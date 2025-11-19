export const CUISINES = [
    'Italian',
    'Mexican',
    'Indian',
    'Chinese',
    'Japanese',
    'Thai',
    'American',
    'French',
    'Mediterranean',
    'Korean',
    'Vietnamese',
    'Greek',
  ];
  
  // Spice Levels
  export const SPICE_LEVELS = [
    { value: 'mild', label: 'Mild' },
    { value: 'medium', label: 'Medium' },
    { value: 'spicy', label: 'Spicy' },
    { value: 'very_spicy', label: 'Very Spicy' },
  ];
  
  // Dietary Restrictions
  export const DIETARY_RESTRICTIONS = [
    'None',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Soy-Free',
    'Egg-Free',
    'Shellfish-Free',
    'Halal',
    'Kosher',
  ];
  
  // Meal Types
  export const MEAL_TYPES = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snack',
    'Dessert',
    'Appetizer',
  ];
  
  // Dietary Preferences
  export const DIETARY_PREFERENCES = [
    'No Preference',
    'Vegetarian',
    'Vegan',
    'Pescatarian',
    'Non-Vegetarian',
  ];
  
  // Subscription Plans
  export const SUBSCRIPTION_PLANS = {
    FREE_TRIAL: {
      name: 'Free Trial',
      duration: 7, // days
      price: 0,
      features: [
        'Generate up to 10 recipes',
        'Save up to 5 recipes',
        'Basic customization',
      ],
    },
    MONTHLY: {
      name: 'Monthly Plan',
      price: 9.99,
      interval: 'month',
      features: [
        'Unlimited recipe generation',
        'Unlimited saved recipes',
        'Advanced customization',
        'Recipe sharing',
        'Nutritional information',
        'Priority support',
      ],
    },
    ANNUAL: {
      name: 'Annual Plan',
      price: 99.99,
      interval: 'year',
      savings: '17%',
      features: [
        'Everything in Monthly',
        'Save 17% annually',
        'Early access to new features',
        'Premium recipe collections',
      ],
    },
  };
  
  // Firestore Collections
  export const COLLECTIONS = {
    USERS: 'users',
    RECIPES: 'recipes',
    SUBSCRIPTIONS: 'subscriptions',
    REVIEWS: 'reviews',
  };
  
  // Routes
  export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    DASHBOARD: '/dashboard',
    GENERATE_RECIPE: '/generate',
    SAVED_RECIPES: '/saved-recipes',
    PROFILE: '/profile',
    SUBSCRIPTION: '/subscription',
  };
  
  // Image Upload Settings
  export const IMAGE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ACCEPTED_FORMATS: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    MAX_FILES: 1,
  };
  
  // Recipe Generation Limits
  export const RECIPE_LIMITS = {
    FREE_TRIAL: 10,
    FREE_TRIAL_SAVED: 5,
    SUBSCRIBED: Infinity,
  };