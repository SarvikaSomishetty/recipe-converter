// Common baking ingredients and their density in g/cup
export const ingredientDensities = {
  'all-purpose flour': 120,
  'bread flour': 127,
  'cake flour': 114,
  'granulated sugar': 200,
  'brown sugar': 220,
  'powdered sugar': 120,
  'cocoa powder': 84,
  'butter': 227,
  'vegetable oil': 224,
  'milk': 240,
  'honey': 340,
  'maple syrup': 322,
  'salt': 292,
  'baking powder': 192,
  'baking soda': 192,
  'almond flour': 96,
  'coconut flour': 112,
  'cornstarch': 128,
  'heavy cream': 240,
  'yogurt': 245,
} as const;

export type IngredientType = keyof typeof ingredientDensities;

export const measurementTypes = ['cups', 'tablespoons', 'teaspoons', 'glasses'] as const;
export type MeasurementType = typeof measurementTypes[number];

export const conversions = {
  cups: 1,
  tablespoons: 1/16,
  teaspoons: 1/48,
  glasses: 1.5, // Assuming a standard glass is 1.5 cups
};