import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Log API key status
if (!API_KEY) {
  console.error('❌ VITE_GEMINI_API_KEY is not set in .env file');
} else {
  console.log('✅ Gemini API key is configured');
  console.log('🔑 Key starts with:', API_KEY.substring(0, 10) + '...');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Analyze image and extract ingredients using Gemini Vision
 */
export const analyzeIngredientsFromImage = async (imageFile) => {
  if (!genAI) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  try {
    console.log('🔍 Analyzing image for ingredients...');
    console.log('📦 Using model: gemini-pro-vision');

    // Use gemini-2.0-flash - the stable multimodal model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash'
    });

    const base64Image = await fileToBase64(imageFile);

    const imagePart = {
      inlineData: {
        data: base64Image.split(',')[1],
        mimeType: imageFile.type,
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

    console.log('📤 Sending image to Gemini API...');
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    console.log('📥 Gemini response:', text);

    // Parse JSON response
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      const ingredients = JSON.parse(jsonMatch[0]);
      console.log('✅ Extracted ingredients:', ingredients);
      return ingredients;
    }

    const fallbackIngredients = extractIngredientsFromText(text);
    console.log('✅ Fallback extracted ingredients:', fallbackIngredients);
    return fallbackIngredients;
  } catch (error) {
    console.error('❌ Error analyzing image:');
    console.error('Error message:', error.message);

    if (error.message?.includes('API_KEY_INVALID')) {
      throw new Error('Invalid Gemini API key. Please check your API key.');
    }
    if (error.message?.includes('503') || error.message?.includes('overloaded')) {
      throw new Error('Gemini AI is currently busy. Please try again in a moment.');
    }

    throw new Error('Failed to analyze image. Please try again.');
  }
};

/**
 * Generate recipe based on ingredients and preferences
 */
export const generateRecipe = async (ingredients, preferences) => {
  if (!genAI) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  try {
    console.log('🍳 Generating recipe with:', { ingredients, preferences });
    console.log('📦 Using model: gemini-pro');

    // Use gemini-2.0-flash - the stable multimodal model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash'
    });

    const prompt = `Create a detailed recipe using these ingredients and preferences:

Ingredients: ${ingredients.join(', ')}

Preferences:
- Cuisine: ${preferences.cuisine || 'Any'}
- Spice Level: ${preferences.spiceLevel || 'Medium'}
- Dietary Restrictions: ${preferences.dietaryRestrictions?.join(', ') || 'None'}
- Meal Type: ${preferences.mealType || 'Any'}
- Dietary Preference: ${preferences.dietaryPreference || 'No Preference'}

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
- You can suggest common pantry items (salt, pepper, oil) if needed
- Make instructions clear and detailed
- Ensure the recipe matches all preferences
- Return ONLY valid JSON, no markdown formatting, no code blocks, no additional text`;

    console.log('📤 Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('📥 Gemini raw response received (length:', text.length, ')');

    // Clean up the response
    let cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Extract JSON
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const recipe = JSON.parse(jsonMatch[0]);
      console.log('✅ Successfully parsed recipe:', recipe.recipeName);

      return {
        ...recipe,
        createdAt: new Date().toISOString(),
        originalIngredients: ingredients,
      };
    }

    console.error('❌ Could not find valid JSON in response');
    throw new Error('Invalid recipe format received from AI');
  } catch (error) {
    console.error('❌ Error generating recipe:');
    console.error('Error message:', error.message);

    if (error.message?.includes('API_KEY_INVALID')) {
      throw new Error('Invalid Gemini API key. Please check your API key.');
    }
    if (error.message?.includes('503') || error.message?.includes('overloaded')) {
      throw new Error('Gemini AI is currently busy. Please try again in a moment.');
    }
    if (error.message?.includes('JSON')) {
      throw new Error('Failed to parse AI response. Please try generating again.');
    }

    throw new Error(error.message || 'Failed to generate recipe. Please try again.');
  }
};

/**
 * Generate multiple recipe variations
 */
export const generateRecipeVariations = async (ingredients, preferences, count = 3) => {
  try {
    const recipes = [];

    for (let i = 0; i < count; i++) {
      const recipe = await generateRecipe(ingredients, preferences);
      recipes.push(recipe);

      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return recipes;
  } catch (error) {
    console.error('Error generating variations:', error);
    throw error;
  }
};

// Helper Functions

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const extractIngredientsFromText = (text) => {
  const lines = text.split('\n').filter(line => line.trim());
  const ingredients = [];

  for (const line of lines) {
    const cleaned = line
      .replace(/^[-*•]\s*/, '')
      .replace(/^\d+\.\s*/, '')
      .replace(/^ingredient:\s*/i, '')
      .trim();

    if (cleaned && cleaned.length > 2) {
      ingredients.push(cleaned);
    }
  }

  return ingredients;
};