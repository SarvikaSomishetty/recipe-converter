import json
import re

# List of known liquid-related words (Expanded from your JSON)
LIQUID_KEYWORDS = [
    "juice", "beverage", "soda", "tea", "coffee", "soup", "broth", "water",
    "syrup", "nectar", "wine", "beer", "milk", "oil", "liqueur", "liquor",
    "drink", "vinegar", "extract", "concentrate"
]

# List of known solid-related words (Expanded from your JSON)
SOLID_KEYWORDS = [
    "flour", "grain", "meal", "bran", "powder", "sugar", "salt", "nuts",
    "seeds", "cereal", "flakes", "chips", "biscuits", "bread", "rice", "pasta",
    "noodles", "vegetables", "fruit", "dried", "cheese", "meat", "beans",
    "lentils", "peas", "tofu", "potato", "yam", "casserole", "stew", "baked",
    "dough", "corn", "wheat", "oat"
]

def determine_liquid_status(food_name, density):
    """Decide if a food item is a liquid or solid based on name and density."""
    food_name_lower = food_name.lower()

    # Rule 1: Check if food name contains any known liquid keyword
    if any(keyword in food_name_lower for keyword in LIQUID_KEYWORDS):
        return True

    # Rule 2: Check if food name contains any known solid keyword
    if any(keyword in food_name_lower for keyword in SOLID_KEYWORDS):
        return False

    # Rule 3: Check if density is close to 1 g/ml (common for liquids)
    if density and 0.8 <= density <= 1.2:
        return True

    # Default: Consider it solid
    return False

def update_json(file_path="Densities.json"):
    """Reads the JSON file, updates it with 'is_liquid', and saves it back."""
    with open(file_path, "r", encoding="utf-8") as file:
        food_data = json.load(file)

    for item in food_data:
        # Extract density (handle cases like "0.35-0.38")
        density_str = str(item.get("Density in g/ml", "")).strip()
        match = re.search(r"\d+(\.\d+)?", density_str)
        density = float(match.group()) if match else None

        # Determine if it's a liquid or solid
        item["is_liquid"] = determine_liquid_status(item["Food name and description"], density)

    # Save the updated JSON
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(food_data, file, indent=4, ensure_ascii=False)

    print("✅ JSON file updated with 'is_liquid' property!")

# Run the script to update JSON
update_json()
