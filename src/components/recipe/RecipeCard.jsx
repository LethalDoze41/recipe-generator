import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  CircularProgress,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';

const RecipeCard = ({ recipe, onSave, isSaved = false, saving = false }) => {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: 3,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {recipe.recipeName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {recipe.description}
            </Typography>
          </Box>
          <Box>
            <IconButton
              onClick={onSave}
              disabled={saving || isSaved}
              sx={{ color: 'white' }}
            >
              {saving ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : isSaved ? (
                <BookmarkIcon />
              ) : (
                <BookmarkBorderIcon />
              )}
            </IconButton>
            <IconButton sx={{ color: 'white' }}>
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Quick Info */}
        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon fontSize="small" />
            <Typography variant="body2">
              Prep: {recipe.prepTime}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon fontSize="small" />
            <Typography variant="body2">
              Cook: {recipe.cookTime}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RestaurantIcon fontSize="small" />
            <Typography variant="body2">
              Serves: {recipe.servings}
            </Typography>
          </Box>
        </Box>

        {/* Tags */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          <Chip
            label={recipe.difficulty}
            size="small"
            sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
          {recipe.tags?.slice(0, 3).map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          ))}
        </Box>
      </Box>

      <CardContent sx={{ p: 3 }}>
        {/* Ingredients */}
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Ingredients
        </Typography>
        <Box sx={{ mb: 3 }}>
          {recipe.ingredients?.map((ing, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" sx={{ flex: 1 }}>
                {ing.item}
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ minWidth: 100, textAlign: 'right' }}>
                {ing.amount}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Instructions */}
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Instructions
        </Typography>
        <Box sx={{ mb: 3 }}>
          {recipe.instructions?.map((step, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                {index + 1}
              </Box>
              <Typography variant="body2" sx={{ flex: 1, pt: 0.5 }}>
                {step}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Nutritional Info */}
        {recipe.nutritionalInfo && (
          <>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Nutritional Information (per serving)
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 2,
                mb: 3,
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {recipe.nutritionalInfo.calories}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Calories
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {recipe.nutritionalInfo.protein}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Protein
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {recipe.nutritionalInfo.carbs}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Carbs
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {recipe.nutritionalInfo.fat}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Fat
                </Typography>
              </Box>
            </Box>
          </>
        )}

        {/* Tips */}
        {recipe.tips && recipe.tips.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Pro Tips 💡
            </Typography>
            <Box>
              {recipe.tips.map((tip, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Typography variant="body2" color="primary" fontWeight={600}>
                    •
                  </Typography>
                  <Typography variant="body2">{tip}</Typography>
                </Box>
              ))}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeCard;