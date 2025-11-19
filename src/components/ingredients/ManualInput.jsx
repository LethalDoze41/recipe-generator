import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Chip,
  Paper,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ManualInput = ({ ingredients, onIngredientsChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const newIngredient = inputValue.trim();
    
    if (newIngredient && !ingredients.includes(newIngredient)) {
      onIngredientsChange([...ingredients, newIngredient]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleDelete = (ingredientToDelete) => {
    onIngredientsChange(
      ingredients.filter((ingredient) => ingredient !== ingredientToDelete)
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Add Ingredient"
          placeholder="e.g., Chicken breast, Tomatoes..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
        />
        <Button
          variant="contained"
          onClick={handleAdd}
          startIcon={<AddIcon />}
          sx={{ minWidth: 120 }}
        >
          Add
        </Button>
      </Box>

      {ingredients.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: 'grey.50',
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
            Selected Ingredients ({ingredients.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {ingredients.map((ingredient, index) => (
              <Chip
                key={index}
                label={ingredient}
                onDelete={() => handleDelete(ingredient)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ManualInput;