from flask import Flask, request, jsonify
import json
import re
import sys
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define conversion factors
CONVERSION_FACTORS = {
    "cup": 240,
    "tablespoon": 15,
    "teaspoon": 5,
    "glass": 200
}

# Load food data
try:
    with open("Densities.json", "r", encoding="utf-8") as f:
        FOOD_DATA = json.load(f)
    print("✅ Successfully loaded food data")
except Exception as e:
    print(f"❌ Failed to load food data: {str(e)}", file=sys.stderr)
    sys.exit(1)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

@app.route('/api/foods', methods=['GET'])
def get_all_foods():
    """Get all food names for initial loading"""
    try:
        foods = [item["Food name and description"] for item in FOOD_DATA]
        return jsonify(foods)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/search_foods', methods=['GET'])
def search_foods():
    """Search foods with query matching"""
    try:
        query = request.args.get('query', '').lower().strip()
        if not query:
            return jsonify([])
        
        normalized_query = re.sub(r"[^\w\s]", "", query)
        results = []
        
        for item in FOOD_DATA:
            food_name = item["Food name and description"]
            normalized_name = re.sub(r"[^\w\s]", "", food_name).lower()
            
            if normalized_query in normalized_name:
                results.append(food_name)
                if len(results) >= 15:  # Limit to 15 suggestions
                    break
        
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/convert', methods=['POST'])
def convert():
    """Handle conversion requests with proper error handling"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data received"}), 400

        # Required fields validation
        required_fields = ['food', 'quantity', 'unit']
        if not all(field in data for field in required_fields):
            return jsonify({"error": f"Missing required fields: {required_fields}"}), 400

        food_name = data['food']
        quantity = data['quantity']
        unit = data['unit']

        # Find the food item
        food_item = next(
            (item for item in FOOD_DATA 
             if item["Food name and description"].lower() == food_name.lower()),
            None
        )
        
        if not food_item:
            return jsonify({"error": f"Food '{food_name}' not found"}), 404
        
        # Parse density
        density_str = str(food_item["Density in g/ml"]).strip()
        match = re.search(r"\d+(\.\d+)?", density_str)
        if not match:
            return jsonify({"error": f"Invalid density format: {density_str}"}), 400
        density = float(match.group())
        
        # Parse quantity
        try:
            parsed_quantity = parse_quantity(quantity)
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        
        # Validate unit
        if unit not in CONVERSION_FACTORS:
            return jsonify({
                "error": f"Invalid unit: {unit}",
                "valid_units": list(CONVERSION_FACTORS.keys())
            }), 400
        
        # Calculate
        ml = parsed_quantity * CONVERSION_FACTORS[unit]
        grams = ml * density
        
        is_liquid = food_item.get("is_liquid", False)
        
        return jsonify({
            "result": f"{quantity} {unit} of {food_name} = {ml:.2f} ml" if is_liquid else f"{grams:.2f} g",
            "is_liquid": is_liquid,
            "value": ml if is_liquid else grams,
            "unit": "ml" if is_liquid else "g"
        })

    except Exception as e:
        app.logger.error(f"Conversion error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


def parse_quantity(input_str):
    """Parse quantity input with proper error handling"""
    try:
        input_str = str(input_str).strip().lower()
        fractional_values = {
            "1": 1, "1/2": 0.5, "1/4": 0.25, 
            "3/4": 0.75, "2": 2, "3": 3,
            "half": 0.5, "quarter": 0.25
        }
        
        if input_str in fractional_values:
            return fractional_values[input_str]
        
        if "/" in input_str:
            numerator, denominator = map(float, input_str.split("/"))
            return numerator / denominator
            
        return float(input_str)
        
    except (ValueError, ZeroDivisionError) as e:
        raise ValueError(f"Invalid quantity format: {input_str}")


if __name__ == '__main__':
    app.run(port=5000, debug=True)