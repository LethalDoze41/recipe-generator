import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    OutlinedInput,
    Typography,
    Paper,
  } from '@mui/material';
  import {
    CUISINES,
    SPICE_LEVELS,
    DIETARY_RESTRICTIONS,
    MEAL_TYPES,
    DIETARY_PREFERENCES,
  } from '../../utils/constants';
  
  const RecipeFilters = ({ preferences, onPreferencesChange }) => {
    const handleChange = (field, value) => {
      onPreferencesChange({
        ...preferences,
        [field]: value,
      });
    };
  
    return (
      <Paper elevation={0} sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Recipe Preferences
        </Typography>
  
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
          {/* Cuisine */}
          <FormControl fullWidth>
            <InputLabel>Cuisine</InputLabel>
            <Select
              value={preferences.cuisine || ''}
              onChange={(e) => handleChange('cuisine', e.target.value)}
              label="Cuisine"
            >
              <MenuItem value="">Any</MenuItem>
              {CUISINES.map((cuisine) => (
                <MenuItem key={cuisine} value={cuisine}>
                  {cuisine}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          {/* Spice Level */}
          <FormControl fullWidth>
            <InputLabel>Spice Level</InputLabel>
            <Select
              value={preferences.spiceLevel || ''}
              onChange={(e) => handleChange('spiceLevel', e.target.value)}
              label="Spice Level"
            >
              {SPICE_LEVELS.map((level) => (
                <MenuItem key={level.value} value={level.value}>
                  {level.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          {/* Meal Type */}
          <FormControl fullWidth>
            <InputLabel>Meal Type</InputLabel>
            <Select
              value={preferences.mealType || ''}
              onChange={(e) => handleChange('mealType', e.target.value)}
              label="Meal Type"
            >
              <MenuItem value="">Any</MenuItem>
              {MEAL_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          {/* Dietary Preference */}
          <FormControl fullWidth>
            <InputLabel>Dietary Preference</InputLabel>
            <Select
              value={preferences.dietaryPreference || ''}
              onChange={(e) => handleChange('dietaryPreference', e.target.value)}
              label="Dietary Preference"
            >
              {DIETARY_PREFERENCES.map((pref) => (
                <MenuItem key={pref} value={pref}>
                  {pref}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
  
        {/* Dietary Restrictions (Multi-select) */}
        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Dietary Restrictions</InputLabel>
          <Select
            multiple
            value={preferences.dietaryRestrictions || []}
            onChange={(e) => handleChange('dietaryRestrictions', e.target.value)}
            input={<OutlinedInput label="Dietary Restrictions" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {DIETARY_RESTRICTIONS.map((restriction) => (
              <MenuItem key={restriction} value={restriction}>
                {restriction}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
    );
  };
  
  export default RecipeFilters;