import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';

import { useAuth } from '../context/AuthContext';
import { getSavedRecipes, deleteRecipe } from '../services/recipeService';

const SavedRecipes = () => {
  const navigate = useNavigate();
  const { currentUser, fetchUserProfile } = useAuth();
  
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch saved recipes on mount
  useEffect(() => {
    if (currentUser) {
      fetchRecipes();
    }
  }, [currentUser]);

  const fetchRecipes = async () => {
    setLoading(true);
    setError('');
  
    try {
      console.log('🔄 Starting to fetch recipes...');
      const savedRecipes = await getSavedRecipes(currentUser.uid);
      console.log('✅ Recipes fetched successfully:', savedRecipes);
      setRecipes(savedRecipes);
    } catch (err) {
      console.error('❌ Failed to fetch recipes:', err);
      setError(err.message || 'Failed to load saved recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (recipe) => {
    setRecipeToDelete(recipe);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recipeToDelete) return;

    setDeleting(true);
    setError('');

    try {
      await deleteRecipe(currentUser.uid, recipeToDelete.id);
      
      // Remove from local state
      setRecipes(recipes.filter(r => r.id !== recipeToDelete.id));
      
      // Refresh user profile stats
      await fetchUserProfile(currentUser.uid);
      
      setDeleteDialogOpen(false);
      setRecipeToDelete(null);
    } catch (err) {
      setError(err.message || 'Failed to delete recipe');
    } finally {
      setDeleting(false);
    }
  };

  const handleViewRecipe = (recipe) => {
    // Navigate to a detail view (we'll create this next)
    navigate(`/recipe/${recipe.id}`, { state: { recipe } });
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 3 }}
        >
          Back to Dashboard
        </Button>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            📚 My Saved Recipes
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} saved
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {recipes.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Typography variant="h5" gutterBottom color="text.secondary">
              No saved recipes yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start generating recipes and save your favorites!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/generate')}
            >
              Generate Your First Recipe
            </Button>
          </Box>
        ) : (
          /* Recipe Grid */
          <Grid container spacing={3}>
            {recipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  {/* Recipe Header */}
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      p: 2,
                      color: 'white',
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {recipe.recipeName}
                    </Typography>
                    
                    {/* Quick Info */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 1, fontSize: '0.875rem' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="caption">
                          {recipe.prepTime}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <RestaurantIcon fontSize="small" />
                        <Typography variant="caption">
                          {recipe.servings} servings
                        </Typography>
                      </Box>
                    </Box>

                    {/* Tags */}
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={recipe.difficulty}
                        size="small"
                        sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.2)', 
                          color: 'white',
                          height: 20,
                          fontSize: '0.7rem'
                        }}
                      />
                      {recipe.tags?.slice(0, 2).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(255,255,255,0.2)', 
                            color: 'white',
                            height: 20,
                            fontSize: '0.7rem'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Recipe Description */}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {recipe.description?.substring(0, 100)}
                      {recipe.description?.length > 100 ? '...' : ''}
                    </Typography>

                    {/* Ingredients Preview */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Main ingredients:
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {recipe.originalIngredients?.slice(0, 3).join(', ')}
                        {recipe.originalIngredients?.length > 3 && '...'}
                      </Typography>
                    </Box>
                  </CardContent>

                  {/* Actions */}
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewRecipe(recipe)}
                      fullWidth
                    >
                      View Recipe
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(recipe)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => !deleting && setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Recipe?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{recipeToDelete?.recipeName}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default SavedRecipes;