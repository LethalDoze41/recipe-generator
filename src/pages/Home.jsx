import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" gutterBottom>
          🍳 Gemini Chef
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          AI-Powered Recipe Generator
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600 }}>
          Turn your ingredients into delicious recipes with the power of AI.
          Upload a photo or type your ingredients, and let Gemini Chef create
          personalized recipes just for you!
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;