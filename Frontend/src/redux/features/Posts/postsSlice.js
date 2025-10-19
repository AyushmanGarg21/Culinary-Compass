import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Simulate API call for posts
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: 1,
      userId: 1,
      username: 'John Doe',
      profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      title: 'Authentic Italian Margherita Pizza',
      overview: 'A classic Italian pizza with fresh mozzarella, basil, and tomato sauce. Perfect for family dinners and gatherings.',
      cooking_time: 25,
      cuisine_type: 'Italian',
      servings: 4,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      ingredients: [
        { name: 'Pizza dough', quantity: '1 ball', unit: 'piece' },
        { name: 'Tomato sauce', quantity: '1/2 cup', unit: 'cup' },
        { name: 'Fresh mozzarella', quantity: '200g', unit: 'grams' },
        { name: 'Fresh basil leaves', quantity: '10-12', unit: 'leaves' },
        { name: 'Extra virgin olive oil', quantity: '2 tbsp', unit: 'tablespoons' },
        { name: 'Salt', quantity: '1 tsp', unit: 'teaspoon' },
        { name: 'Black pepper', quantity: '1/2 tsp', unit: 'teaspoon' }
      ],
      instructions: '<h3>Instructions:</h3><ol><li>Preheat your oven to 475°F (245°C).</li><li>Roll out the pizza dough on a floured surface to your desired thickness.</li><li>Transfer the dough to a pizza stone or baking sheet.</li><li>Spread the tomato sauce evenly over the dough, leaving a 1-inch border for the crust.</li><li>Tear the mozzarella into small pieces and distribute over the sauce.</li><li>Drizzle with olive oil and season with salt and pepper.</li><li>Bake for 12-15 minutes until the crust is golden and cheese is bubbly.</li><li>Remove from oven and immediately top with fresh basil leaves.</li><li>Let cool for 2-3 minutes before slicing and serving.</li></ol>',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      userId: 2,
      username: 'Jane Smith',
      profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      title: 'Nutritious Buddha Bowl',
      overview: 'A colorful and healthy bowl packed with quinoa, roasted vegetables, and tahini dressing. Perfect for a nutritious lunch.',
      cooking_time: 35,
      cuisine_type: 'Healthy',
      servings: 2,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
      ingredients: [
        { name: 'Quinoa', quantity: '1 cup', unit: 'cup' },
        { name: 'Chickpeas', quantity: '1 can', unit: 'can' },
        { name: 'Avocado', quantity: '1 large', unit: 'piece' },
        { name: 'Sweet potato', quantity: '2 medium', unit: 'pieces' },
        { name: 'Tahini', quantity: '3 tbsp', unit: 'tablespoons' },
        { name: 'Lemon juice', quantity: '2 tbsp', unit: 'tablespoons' },
        { name: 'Spinach', quantity: '2 cups', unit: 'cups' }
      ],
      instructions: '<h3>Instructions:</h3><ol><li>Cook quinoa according to package instructions.</li><li>Roast diced sweet potato at 400°F for 25 minutes.</li><li>Drain and rinse chickpeas, then sauté until crispy.</li><li>Whisk tahini with lemon juice and water to make dressing.</li><li>Arrange quinoa, vegetables, and chickpeas in bowls.</li><li>Top with sliced avocado and drizzle with tahini dressing.</li><li>Serve immediately while warm.</li></ol>',
      createdAt: '2024-01-14T15:45:00Z'
    },
    {
      id: 3,
      userId: 3,
      username: 'Ali Khan',
      profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      title: 'Traditional Chicken Biryani',
      overview: 'Aromatic basmati rice layered with spiced chicken and saffron. A family recipe passed down through generations.',
      cooking_time: 90,
      cuisine_type: 'Pakistani',
      servings: 6,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
      ingredients: [
        { name: 'Basmati rice', quantity: '2 cups', unit: 'cups' },
        { name: 'Chicken', quantity: '1 kg', unit: 'kg' },
        { name: 'Yogurt', quantity: '1 cup', unit: 'cup' },
        { name: 'Biryani spice mix', quantity: '2 tbsp', unit: 'tablespoons' },
        { name: 'Saffron', quantity: '1/2 tsp', unit: 'teaspoon' },
        { name: 'Fried onions', quantity: '1 cup', unit: 'cup' },
        { name: 'Mint leaves', quantity: '1/2 cup', unit: 'cup' }
      ],
      instructions: '<h3>Instructions:</h3><ol><li>Marinate chicken in yogurt and spices for 2 hours.</li><li>Soak saffron in warm milk.</li><li>Parboil rice with whole spices until 70% cooked.</li><li>Cook marinated chicken until tender.</li><li>Layer rice and chicken in a heavy-bottomed pot.</li><li>Sprinkle saffron milk and fried onions between layers.</li><li>Cover and cook on high heat for 3 minutes, then low heat for 45 minutes.</li><li>Let it rest for 10 minutes before serving.</li></ol>',
      createdAt: '2024-01-13T18:20:00Z'
    },
    {
      id: 4,
      userId: 4,
      username: 'Maria Lopez',
      profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      title: 'Fresh Fish Tacos',
      overview: 'Crispy fish tacos with homemade salsa and creamy avocado. Perfect for summer gatherings and outdoor dining.',
      cooking_time: 30,
      cuisine_type: 'Mexican',
      servings: 4,
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
      ingredients: [
        { name: 'White fish fillets', quantity: '500g', unit: 'grams' },
        { name: 'Corn tortillas', quantity: '8', unit: 'pieces' },
        { name: 'Tomatoes', quantity: '3 medium', unit: 'pieces' },
        { name: 'Red onion', quantity: '1 small', unit: 'piece' },
        { name: 'Cilantro', quantity: '1/2 cup', unit: 'cup' },
        { name: 'Lime', quantity: '2', unit: 'pieces' },
        { name: 'Avocado', quantity: '2', unit: 'pieces' }
      ],
      instructions: '<h3>Instructions:</h3><ol><li>Season fish with cumin, chili powder, and lime juice.</li><li>Dice tomatoes, onion, and cilantro for salsa.</li><li>Cook fish in a hot pan until crispy and flaky.</li><li>Warm tortillas in a dry pan or microwave.</li><li>Mash avocado with lime juice and salt.</li><li>Assemble tacos with fish, salsa, and avocado.</li><li>Serve with lime wedges and hot sauce.</li></ol>',
      createdAt: '2024-01-12T12:15:00Z'
    },
    {
      id: 5,
      userId: 5,
      username: 'Akira Tanaka',
      profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      title: 'Rich Tonkotsu Ramen',
      overview: 'Authentic Japanese ramen with rich pork bone broth, tender chashu, and perfectly cooked noodles.',
      cooking_time: 180,
      cuisine_type: 'Japanese',
      servings: 4,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
      ingredients: [
        { name: 'Pork bones', quantity: '2 kg', unit: 'kg' },
        { name: 'Ramen noodles', quantity: '4 portions', unit: 'portions' },
        { name: 'Miso paste', quantity: '3 tbsp', unit: 'tablespoons' },
        { name: 'Green onions', quantity: '4', unit: 'pieces' },
        { name: 'Soft-boiled eggs', quantity: '4', unit: 'pieces' },
        { name: 'Chashu pork', quantity: '200g', unit: 'grams' },
        { name: 'Nori sheets', quantity: '4', unit: 'sheets' }
      ],
      instructions: '<h3>Instructions:</h3><ol><li>Simmer pork bones for 12-16 hours to create rich broth.</li><li>Strain broth and season with miso paste.</li><li>Prepare soft-boiled eggs and marinate overnight.</li><li>Slice chashu pork and green onions.</li><li>Cook ramen noodles according to package instructions.</li><li>Assemble bowls with noodles, hot broth, and toppings.</li><li>Serve immediately while hot.</li></ol>',
      createdAt: '2024-01-11T19:30:00Z'
    }
  ];
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearError } = postsSlice.actions;
export default postsSlice.reducer;