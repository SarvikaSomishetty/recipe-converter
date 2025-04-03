from flask import Flask, request, jsonify
import json
import re
import sys
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define conversion factors
CONVERSION_FACTORS = {
    # Volume units (ml equivalent)
    'ml': 1,
    'liter': 1000,
    'tsp': 5,          # teaspoon
    'tbsp': 15,        # tablespoon
    'cup': 240,
    'glass': 250,
    'pint': 473,
    'quart': 946,
    
    # Weight units (gram equivalent)
    'g': 1,
    'kg': 1000,
    'oz': 28.35,
    'lb': 453.6
}

# Load food data
try:
    with open(os.path.join(os.path.dirname(__file__), "Densities.json"), "r",encoding='utf-8') as f:
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

# Update the convert endpoint
@app.route('/api/convert', methods=['POST'])
def convert():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data received"}), 400

        required_fields = ['food', 'quantity', 'from_unit', 'to_unit']
        if not all(field in data for field in required_fields):
            return jsonify({"error": f"Missing required fields: {required_fields}"}), 400

        food_name = data['food'].lower()
        from_unit = data['from_unit'].lower()
        to_unit = data['to_unit'].lower()
        quantity = float(data['quantity'])

        # Find food item
        food_item = next(
            (item for item in FOOD_DATA 
             if item["Food name and description"].lower() == food_name),
            None
        )
        
        if not food_item:
            return jsonify({"error": f"Food '{food_name}' not found"}), 404
        
        # Get density
        density_str = str(food_item["Density in g/ml"]).strip()
        match = re.search(r"\d+(\.\d+)?", density_str)
        if not match:
            return jsonify({"error": f"Invalid density format: {density_str}"}), 400
        density = float(match.group())

        # Validate units
        if from_unit not in CONVERSION_FACTORS or to_unit not in CONVERSION_FACTORS:
            return jsonify({
                "error": "Invalid unit(s)",
                "valid_units": list(CONVERSION_FACTORS.keys())
            }), 400

        # Convert to grams first
        if from_unit in ['ml', 'liter', 'tsp', 'tbsp', 'cup', 'glass', 'pint', 'quart']:
            # Volume to weight conversion
            ml = quantity * CONVERSION_FACTORS[from_unit]
            grams = ml * density
        else:
            # Weight to weight conversion
            grams = quantity * CONVERSION_FACTORS[from_unit]

        # Convert to target unit
        if to_unit in ['ml', 'liter', 'tsp', 'tbsp', 'cup', 'glass', 'pint', 'quart']:
            # Weight to volume conversion
            ml = grams / density
            result_value = ml / CONVERSION_FACTORS[to_unit]
            result_unit = to_unit
        else:
            # Weight to weight conversion
            result_value = grams / CONVERSION_FACTORS[to_unit]
            result_unit = to_unit

        return jsonify({
            "input": f"{quantity} {from_unit}",
            "output": f"{result_value:.2f} {result_unit}",
            "ingredient": food_name,
            "density_used": f"{density} g/ml"
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
    app.run(host='0.0.0.0', port=os.getenv("PORT", 5000))