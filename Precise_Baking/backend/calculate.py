import json
from questionary import autocomplete
import re

# Constants
CONVERSION_FACTORS = {
    "cup": 240,  # 1 cup = 240 ml
    "tablespoon": 15,  # 1 tablespoon = 15 ml
    "teaspoon": 5,  # 1 teaspoon = 5 ml
    "glass": 200,  # 1 glass = 200 ml (approximate)
}

FRACTIONAL_WORDS = {
    "half": 0.5,
    "quarter": 0.25,
    "third": 1 / 3,
    "fourth": 0.25,
    "eighth": 0.125,
}

# Load JSON data
def load_food_data(file_path="Densities.json"):
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)

def get_food_database(food_data):
    """Returns a list of all food names from JSON."""
    return [item["Food name and description"] for item in food_data]

def parse_quantity(input_str):
    """Parses fractions, decimals, and words like 'half' into numeric values."""
    input_str = input_str.strip().lower()

    # Handle fractional words
    if input_str in FRACTIONAL_WORDS:
        return FRACTIONAL_WORDS[input_str]

    # Handle fractions
    if "/" in input_str:
        try:
            numerator, denominator = map(float, input_str.split("/"))
            return numerator / denominator
        except (ValueError, ZeroDivisionError):
            raise ValueError(f"Invalid fraction: {input_str}")

    # Handle decimal inputs
    try:
        return float(input_str)
    except ValueError:
        raise ValueError(f"Invalid quantity: {input_str}")

def get_density(food_name, food_data):
    """Retrieve density from JSON, allowing slight variations in names."""
    food_name = food_name.strip().lower()  # Normalize input

    for item in food_data:
        stored_name = item["Food name and description"].strip().lower()
        if stored_name == food_name:
            density_str = str(item["Density in g/ml"]).strip()

            # Extract only the first numeric value from density range (e.g., "0.35-0.38")
            match = re.search(r"\d+(\.\d+)?", density_str)
            if match:
                density = float(match.group())  # Convert extracted number to float
                return density  # Return extracted density

    print(f"ERROR: '{food_name}' not found in JSON.")  # Debug output
    return None  # Return None if food is not found

def get_is_liquid(food_name, food_data):
    """Retrieve is_liquid status from JSON."""
    food_name = food_name.strip().lower()  # Normalize input

    for item in food_data:
        stored_name = item["Food name and description"].strip().lower()
        if stored_name == food_name:
            return item.get("is_liquid", False)  # Return True/False, default to False if missing

    return False  # Default to False if not found

def convert_to_grams_and_ml(quantity, unit, density):
    """Convert volume-based measurements to grams using density."""
    if unit not in CONVERSION_FACTORS:
        raise ValueError(f"Unsupported unit: {unit}")

    ml = quantity * CONVERSION_FACTORS[unit]  # Convert to milliliters
    grams = ml * density  # Convert to grams using density
    return grams, ml

def main():
    # Load food data from JSON file
    food_data = load_food_data()
    # Normalize food names by removing punctuation
    normalized_food_db = {re.sub(r"[^\w\s]", "", name).lower(): name for name in get_food_database(food_data)}

# Autocomplete using normalized names
    food_name_input = autocomplete(
    "Enter food item:",
    choices=list(normalized_food_db.keys()),  # Use normalized names
    ignore_case=True,
    match_middle=True
    ).ask()

# Retrieve the original food name from JSON
    food_name = normalized_food_db.get(food_name_input)

    if not food_name:
        print("Food not found.")
        return


    quantity_input = input("Enter the quantity (e.g., '1/4', 'half', '0.5'): ")
    unit = input("Enter the unit (cup, tablespoon, teaspoon, glass): ").lower()

    # Parse quantity
    try:
        quantity = parse_quantity(quantity_input)
    except ValueError as e:
        print(e)
        return

    # Fetch density and is_liquid status
    density = get_density(food_name, food_data)
    is_liquid = get_is_liquid(food_name, food_data)

    if density is None:
        print(f"Error: Density for '{food_name}' not found in the JSON file.")
        return

    # Perform conversion
    try:
        grams, ml = convert_to_grams_and_ml(quantity, unit, density)

        print(f"\n{quantity_input} {unit}(s) of {food_name} is approximately:")
        
        if is_liquid:
            print(f"- {ml:.2f} milliliters")  # Show only milliliters for liquids
        else:
            print(f"- {grams:.2f} grams")  # Show only grams for solids

    except ValueError as e:
        print(e)

if __name__ == "__main__":
    main()
