import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RecipeCard from '../components/recipe/RecipeCard';

const RecipeDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recipe } = location.state || {};

  if (!recipe) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <p>Recipe not found</p>
          <Button onClick={() => navigate('/saved-recipes')}>
            Back to Saved Recipes
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/saved-recipes')}
          sx={{ mb: 3 }}
        >
          Back to Saved Recipes
        </Button>

        <RecipeCard recipe={recipe} />
      </Container>
    </Box>
  );
};

export default RecipeDetail;