const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors")({ origin: true });

// Get API key from environment variable
// Set via: firebase functions:config:set gemini.api_key="YOUR_KEY"
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("⚠️ GEMINI_API_KEY environment variable is not set!");
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Analyze image and extract ingredients
 */
exports.analyzeIngredients = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (!genAI) {
        return res.status(500).json({
          success: false,
          error: "Gemini API is not configured"
        });
      }

      if (req.method !== "POST") {
        return res.status(405).json({
          success: false,
          error: "Method not allowed"
        });
      }

      const { imageData, mimeType } = req.body;

      if (!imageData) {
        return res.status(400).json({
          success: false,
          error: "Image data is required"
        });
      }

      console.log("🔍 Analyzing image for ingredients...");

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const imagePart = {
        inlineData: {
          data: imageData,
          mimeType: mimeType || "image/jpeg",
        },
      };

      const prompt = `Analyze this image and identify all edible food ingredients visible.
Return ONLY a JSON array of ingredient names as strings.
Example format: ["chicken breast", "bell pepper", "onion", "garlic"]

Rules:
- Only include actual food ingredients
- Use common ingredient names
- Be specific (e.g., "red bell pepper" not just "vegetable")
- Ignore cooking utensils, plates, or non-food items
- Return empty array if no ingredients found`;

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      console.log("✅ Gemini response received");

      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        const ingredients = JSON.parse(jsonMatch[0]);
        return res.status(200).json({
          success: true,
          ingredients
        });
      }

      const lines = text.split("\n").filter(line => line.trim());
      const ingredients = lines
        .map(line => line.replace(/^[-*•\d.]\s*/, "").trim())
        .filter(line => line.length > 2);

      return res.status(200).json({
        success: true,
        ingredients
      });

    } catch (error) {
      console.error("❌ Error analyzing image:", error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
});

/**
 * Generate recipe from ingredients and preferences
 */
exports.generateRecipe = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (!genAI) {
        return res.status(500).json({
          success: false,
          error: "Gemini API is not configured"
        });
      }

      if (req.method !== "POST") {
        return res.status(405).json({
          success: false,
          error: "Method not allowed"
        });
      }

      const { ingredients, preferences } = req.body;

      if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Ingredients array is required"
        });
      }

      console.log("🍳 Generating recipe for:", ingredients);

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Create a detailed recipe using these ingredients and preferences:

Ingredients: ${ingredients.join(", ")}

Preferences:
- Cuisine: ${preferences?.cuisine || "Any"}
- Spice Level: ${preferences?.spiceLevel || "Medium"}
- Dietary Restrictions: ${preferences?.dietaryRestrictions?.join(", ") || "None"}
- Meal Type: ${preferences?.mealType || "Any"}
- Dietary Preference: ${preferences?.dietaryPreference || "No Preference"}

Return a JSON object with this EXACT structure (no markdown, no code blocks, just raw JSON):
{
  "recipeName": "Name of the dish",
  "description": "Brief 2-3 sentence description",
  "prepTime": "15 minutes",
  "cookTime": "30 minutes",
  "servings": 4,
  "difficulty": "Easy",
  "ingredients": [
    {
      "item": "chicken breast",
      "amount": "500g",
      "notes": "diced"
    }
  ],
  "instructions": [
    "Step 1 detailed instruction",
    "Step 2 detailed instruction"
  ],
  "nutritionalInfo": {
    "calories": "350 kcal",
    "protein": "25g",
    "carbs": "30g",
    "fat": "12g"
  },
  "tips": [
    "Cooking tip 1",
    "Cooking tip 2"
  ],
  "tags": ["quick", "healthy", "dinner"]
}

Important:
- Only use the provided ingredients as main ingredients
- You can suggest common pantry items (salt, pepper, oil)
- Make instructions clear and detailed
- Ensure the recipe matches all preferences
- Return ONLY valid JSON, no markdown formatting`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("✅ Recipe generated successfully");

      let cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const recipe = JSON.parse(jsonMatch[0]);
        return res.status(200).json({
          success: true,
          recipe: {
            ...recipe,
            createdAt: new Date().toISOString(),
            originalIngredients: ingredients,
          }
        });
      }

      throw new Error("Invalid recipe format received from AI");

    } catch (error) {
      console.error("❌ Error generating recipe:", error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
});