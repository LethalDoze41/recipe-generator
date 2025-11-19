import { 
    collection, 
    getDocs, 
    addDoc,
    deleteDoc, 
    doc, 
    query, 
    where,
    updateDoc,
    increment,
    serverTimestamp 
  } from 'firebase/firestore';
  import { db } from '../config/firebase';
  import { COLLECTIONS } from '../utils/constants';
  
  /**
   * Save a recipe to Firestore
   */
  export const saveRecipe = async (userId, recipe) => {
    try {
      console.log('💾 Saving recipe for user:', userId);
      const recipesRef = collection(db, COLLECTIONS.RECIPES);
      
      const recipeData = {
        ...recipe,
        userId,
        savedAt: serverTimestamp(),
        rating: 0,
        reviews: [],
      };
  
      const docRef = await addDoc(recipesRef, recipeData);
      
      // Update user's saved recipe count
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(userRef, {
        recipesSaved: increment(1),
        recipesGenerated: increment(1),
      });
  
      console.log('✅ Recipe saved with ID:', docRef.id);
      return { id: docRef.id, ...recipeData };
    } catch (error) {
      console.error('❌ Error saving recipe:', error);
      console.error('Error details:', error.code, error.message);
      throw new Error('Failed to save recipe. Please try again.');
    }
  };
  
  /**
   * Get all saved recipes for a user
   */
  export const getSavedRecipes = async (userId) => {
    try {
      console.log('📚 Fetching recipes for user:', userId);
      console.log('📚 Database instance:', db ? 'Connected' : 'Not connected');
      console.log('📚 Collection name:', COLLECTIONS.RECIPES);
      
      const recipesRef = collection(db, COLLECTIONS.RECIPES);
      console.log('📚 Collection ref created');
      
      // Simple query without orderBy
      const q = query(recipesRef, where('userId', '==', userId));
      console.log('📚 Query created');
  
      const querySnapshot = await getDocs(q);
      console.log('📚 Query executed, docs found:', querySnapshot.size);
      
      const recipes = [];
  
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        console.log('📄 Recipe doc:', docSnap.id, data.recipeName);
        recipes.push({
          id: docSnap.id,
          ...data,
        });
      });
  
      // Sort manually by savedAt (client-side sorting)
      recipes.sort((a, b) => {
        const dateA = a.savedAt?.toDate?.() || new Date(a.createdAt || 0);
        const dateB = b.savedAt?.toDate?.() || new Date(b.createdAt || 0);
        return dateB - dateA;
      });
  
      console.log('✅ Successfully fetched', recipes.length, 'recipes');
      return recipes;
    } catch (error) {
      console.error('❌ Error fetching recipes:');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      throw new Error(`Failed to fetch saved recipes: ${error.message}`);
    }
  };
  
  /**
   * Delete a saved recipe
   */
  export const deleteRecipe = async (userId, recipeId) => {
    try {
      console.log('🗑️ Deleting recipe:', recipeId);
      const recipeRef = doc(db, COLLECTIONS.RECIPES, recipeId);
      await deleteDoc(recipeRef);
  
      // Update user's saved recipe count
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(userRef, {
        recipesSaved: increment(-1),
      });
  
      console.log('✅ Recipe deleted:', recipeId);
    } catch (error) {
      console.error('❌ Error deleting recipe:', error);
      throw new Error('Failed to delete recipe.');
    }
  };
  
  /**
   * Update recipe rating
   */
  export const updateRecipeRating = async (recipeId, rating) => {
    try {
      const recipeRef = doc(db, COLLECTIONS.RECIPES, recipeId);
      await updateDoc(recipeRef, {
        rating,
        lastUpdated: serverTimestamp(),
      });
  
      console.log('✅ Recipe rating updated:', recipeId, rating);
    } catch (error) {
      console.error('❌ Error updating rating:', error);
      throw new Error('Failed to update rating.');
    }
  };
  
  /**
   * Add review to recipe
   */
  export const addRecipeReview = async (recipeId, review) => {
    try {
      const recipeRef = doc(db, COLLECTIONS.RECIPES, recipeId);
      const reviewData = {
        ...review,
        createdAt: new Date().toISOString(),
      };
  
      await updateDoc(recipeRef, {
        reviews: [...(review.reviews || []), reviewData],
        lastUpdated: serverTimestamp(),
      });
  
      console.log('✅ Review added to recipe:', recipeId);
    } catch (error) {
      console.error('❌ Error adding review:', error);
      throw new Error('Failed to add review.');
    }
  };