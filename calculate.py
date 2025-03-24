from pymongo import MongoClient


client = MongoClient("mongodb://localhost:27017")
db = client["Food"]
collection = db["Densities"]


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

def parse_quantity(input_str):
    """Parse fractional inputs like '1/4', 'half', or '0.5' into a decimal."""
    input_str = input_str.strip().lower()

    # Handle fractional words (e.g., "half", "quarter")
    if input_str in FRACTIONAL_WORDS:
        return FRACTIONAL_WORDS[input_str]

    # Handle fractions (e.g., "1/4", "3/4")
    if "/" in input_str:
        numerator, denominator = input_str.split("/")
        try:
            return float(numerator) / float(denominator)
        except (ValueError, ZeroDivisionError):
            raise ValueError(f"Invalid fraction: {input_str}")

    # Handle decimal inputs (e.g., "0.5", "1.25")
    try:
        return float(input_str)
    except ValueError:
        raise ValueError(f"Invalid quantity: {input_str}")

def get_density(food_name):
    """Fetch the density of a food item from MongoDB."""
    food_item = collection.find_one({"Food name and description": food_name})
    if food_item:
        density = food_item.get("Density in g/ml")
        if isinstance(density, str):  # Handle ranges like "0.56-0.72"
            density = float(density.split("-")[0])  # Use the lower bound
        return float(density)
    else:
        return None

def convert_to_grams_and_ml(quantity, unit, density):
    """Convert the given quantity and unit to grams and milliliters."""
    if unit not in CONVERSION_FACTORS:
        raise ValueError(f"Unsupported unit: {unit}")

    # Convert to milliliters
    ml = quantity * CONVERSION_FACTORS[unit]

    # Convert to grams using density
    grams = ml * density

    return grams, ml

def main():
    # User input
    food_name = input("Enter the food item: ")
    quantity_input = input("Enter the quantity (e.g., '1/4', 'half', '0.5'): ")
    unit = input("Enter the unit (cup, tablespoon, teaspoon, glass): ").lower()

    # Parse quantity
    try:
        quantity = parse_quantity(quantity_input)
    except ValueError as e:
        print(e)
        return

    # Fetch density from MongoDB
    density = get_density(food_name)
    if density is None:
        print(f"Error: Density for '{food_name}' not found in the database.")
        return

    # Perform conversion
    try:
        grams, ml = convert_to_grams_and_ml(quantity, unit, density)
        print(f"{quantity_input} {unit}(s) of {food_name} is approximately:")
        print(f"- {grams:.2f} grams")
        print(f"- {ml:.2f} milliliters")
    except ValueError as e:
        print(e)

if __name__ == "__main__":
    main()