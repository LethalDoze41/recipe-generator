import { Box, Typography, Container, Button, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const Dashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: 3,
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            Welcome to Your Dashboard! 👋
          </Typography>
          
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {userProfile?.displayName || 'User'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {currentUser?.email}
            </Typography>
          </Box>

          {/* Trial Status */}
          {userProfile?.subscription?.status === 'trial' && (
            <Box
              sx={{
                my: 3,
                p: 2,
                backgroundColor: '#e3f2fd',
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" color="primary" fontWeight={600}>
                🎉 Free Trial Active
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userProfile?.subscription?.trialEndDate && 
                  `Trial ends: ${new Date(userProfile.subscription.trialEndDate).toLocaleDateString()}`
                }
              </Typography>
            </Box>
          )}

          {/* Stats */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              my: 4,
            }}
          >
            <Box>
              <Typography variant="h4" color="primary" fontWeight={700}>
                {userProfile?.recipesGenerated || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recipes Generated
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="primary" fontWeight={700}>
                {userProfile?.recipesSaved || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recipes Saved
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<RestaurantMenuIcon />}
              onClick={() => navigate('/generate')}
              sx={{ minWidth: 180 }}
            >
              Generate Recipe
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<BookmarkIcon />}
              onClick={() => navigate('/saved-recipes')}
              sx={{ minWidth: 180 }}
            >
              Saved Recipes
            </Button>
          </Box>

          {/* Logout */}
          <Box sx={{ mt: 4 }}>
            <Button
              variant="text"
              color="error"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;