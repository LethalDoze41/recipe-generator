import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

// Components
import ImageUpload from '../components/ingredients/ImageUpload';
import ManualInput from '../components/ingredients/ManualInput';
import RecipeFilters from '../components/recipe/RecipeFilters';
import RecipeCard from '../components/recipe/RecipeCard';

// Services
import { generateRecipe } from '../services/geminiService';
import { saveRecipe } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';

const steps = ['Add Ingredients', 'Set Preferences', 'Generate Recipe'];

const GenerateRecipe = () => {
  const navigate = useNavigate();
  const { currentUser, fetchUserProfile } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [ingredients, setIngredients] = useState([]);
  const [preferences, setPreferences] = useState({
    cuisine: '',
    spiceLevel: 'medium',
    dietaryRestrictions: [],
    mealType: '',
    dietaryPreference: 'No Preference',
  });
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [inputMethod, setInputMethod] = useState('upload');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleIngredientsExtracted = (extractedIngredients) => {
    setIngredients(extractedIngredients);
    setError('');
  };

  const handleIngredientsChange = (newIngredients) => {
    setIngredients(newIngredients);
  };

  const handlePreferencesChange = (newPreferences) => {
    setPreferences(newPreferences);
  };

  const handleNext = () => {
    if (activeStep === 0 && ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleGenerateRecipe = async () => {
    setLoading(true);
    setError('');

    try {
      const generatedRecipe = await generateRecipe(ingredients, preferences);
      setRecipe(generatedRecipe);
      setIsSaved(false); // Reset saved state for new recipe
      setActiveStep(2);
    } catch (err) {
      setError(err.message || 'Failed to generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!currentUser) {
      setError('You must be logged in to save recipes');
      return;
    }

    if (!recipe) {
      setError('No recipe to save');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await saveRecipe(currentUser.uid, recipe);
      setIsSaved(true);
      setSuccessMessage('Recipe saved successfully! 🎉');
      
      // Refresh user profile to update stats
      await fetchUserProfile(currentUser.uid);
    } catch (err) {
      setError(err.message || 'Failed to save recipe.');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateNew = () => {
    setActiveStep(0);
    setIngredients([]);
    setRecipe(null);
    setError('');
    setIsSaved(false);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Step 1: Add Your Ingredients
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Upload a photo of your ingredients or add them manually
            </Typography>

            <Tabs
              value={inputMethod}
              onChange={(e, newValue) => setInputMethod(newValue)}
              sx={{ mb: 3 }}
            >
              <Tab label="📷 Upload Image" value="upload" />
              <Tab label="✏️ Type Manually" value="manual" />
            </Tabs>

            {inputMethod === 'upload' ? (
              <ImageUpload onIngredientsExtracted={handleIngredientsExtracted} />
            ) : (
              <ManualInput
                ingredients={ingredients}
                onIngredientsChange={handleIngredientsChange}
              />
            )}

            {ingredients.length > 0 && inputMethod === 'upload' && (
              <Box sx={{ mt: 3 }}>
                <ManualInput
                  ingredients={ingredients}
                  onIngredientsChange={handleIngredientsChange}
                />
              </Box>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Step 2: Customize Your Recipe
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select your preferences to personalize the recipe
            </Typography>

            <RecipeFilters
              preferences={preferences}
              onPreferencesChange={handlePreferencesChange}
            />

            <Paper elevation={0} sx={{ p: 3, mt: 3, backgroundColor: 'grey.50' }}>
              <Typography variant="subtitle2" gutterBottom>
                Your Ingredients ({ingredients.length})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ingredients.join(', ')}
              </Typography>
            </Paper>
          </Box>
        );

      case 2:
        return (
          <Box>
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 8,
                }}
              >
                <CircularProgress size={80} />
                <Typography variant="h6" sx={{ mt: 3 }}>
                  Creating your perfect recipe...
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  This may take a few seconds
                </Typography>
              </Box>
            ) : recipe ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight={600}>
                    Your Generated Recipe 🎉
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleGenerateNew}
                    startIcon={<RestaurantMenuIcon />}
                  >
                    Generate Another
                  </Button>
                </Box>
                <RecipeCard
                  recipe={recipe}
                  onSave={handleSaveRecipe}
                  isSaved={isSaved}
                  saving={saving}
                />
              </Box>
            ) : null}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 3 }}
        >
          Back to Dashboard
        </Button>

        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            🍳 Generate Your Recipe
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Let AI create amazing recipes from your ingredients
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
          {renderStepContent()}
        </Paper>

        {activeStep < 2 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              size="large"
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === 1 ? handleGenerateRecipe : handleNext}
              disabled={loading || (activeStep === 0 && ingredients.length === 0)}
              size="large"
            >
              {activeStep === 1 ? 'Generate Recipe' : 'Next'}
            </Button>
          </Box>
        )}

        {/* Success Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={4000}
          onClose={() => setSuccessMessage('')}
          message={successMessage}
        />
      </Container>
    </Box>
  );
};

export default GenerateRecipe;