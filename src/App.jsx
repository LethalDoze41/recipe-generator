import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './pages/Dashboard';
import GenerateRecipe from './pages/GenerateRecipe';
import SavedRecipes from './pages/SavedRecipes';
import RecipeDetail from './pages/RecipeDetail';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  const { currentUser } = useAuth();

  return (
    <Box>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={currentUser ? <Navigate to="/dashboard" /> : <Home />} 
        />
        <Route 
          path="/login" 
          element={currentUser ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={currentUser ? <Navigate to="/dashboard" /> : <Signup />} 
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/generate"
          element={
            <PrivateRoute>
              <GenerateRecipe />
            </PrivateRoute>
          }
        />
        <Route
          path="/saved-recipes"
          element={
            <PrivateRoute>
              <SavedRecipes />
            </PrivateRoute>
          }
        />
        <Route
          path="/recipe/:id"
          element={
            <PrivateRoute>
              <RecipeDetail />
            </PrivateRoute>
          }
        />
      </Routes>
    </Box>
  );
}

export default App;