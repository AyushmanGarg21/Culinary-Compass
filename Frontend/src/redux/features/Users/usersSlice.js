import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    return [
        {
          id: 1,
          name: "John Doe",
          profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          aboutMe: "I love coding and exploring new technologies.",
          city: "New York",
          country: "USA",
          foodPreference: "Vegetarian",
          gender: "Male",
          language: "English",
        },
        {
          id: 2,
          name: "Jane Smith",
          profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
          aboutMe: "A passionate traveler and foodie.",
          city: "Toronto",
          country: "Canada",
          foodPreference: "Non-Vegetarian",
          gender: "Female",
          language: "French",
        },
        {
          id: 3,
          name: "Ali Khan",
          profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          aboutMe: "Tech enthusiast and aspiring entrepreneur.",
          city: "Karachi",
          country: "Pakistan",
          foodPreference: "Vegetarian",
          gender: "Male",
          language: "Urdu",
        },
        {
          id: 4,
          name: "Maria Lopez",
          profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          aboutMe: "Loves painting and hiking in the mountains.",
          city: "Mexico City",
          country: "Mexico",
          foodPreference: "Non-Vegetarian",
          gender: "Female",
          language: "Spanish",
        },
        {
          id: 5,
          name: "Akira Tanaka",
          profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
          aboutMe: "Always looking for new culinary experiences.",
          city: "Tokyo",
          country: "Japan",
          foodPreference: "Vegetarian",
          gender: "Male",
          language: "Japanese",
        },
        {
          id: 6,
          name: "Sarah Lee",
          profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
          aboutMe: "Yoga lover and tech-savvy marketer.",
          city: "Seoul",
          country: "South Korea",
          foodPreference: "Vegan",
          gender: "Female",
          language: "Korean",
        },
        {
          id: 7,
          name: "Rajesh Gupta",
          profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          aboutMe: "Enjoys cricket and a good book on weekends.",
          city: "Mumbai",
          country: "India",
          foodPreference: "Non-Vegetarian",
          gender: "Male",
          language: "Hindi",
        },
        {
          id: 8,
          name: "Lina Müller",
          profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
          aboutMe: "Passionate about sustainable living and design.",
          city: "Berlin",
          country: "Germany",
          foodPreference: "Vegan",
          gender: "Female",
          language: "German",
        },
        {
          id: 9,
          name: "Ahmed Al-Sheikh",
          profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          aboutMe: "Fan of history and Middle Eastern cuisine.",
          city: "Cairo",
          country: "Egypt",
          foodPreference: "Non-Vegetarian",
          gender: "Male",
          language: "Arabic",
        },
        {
          id: 10,
          name: "Emily Brown",
          profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          aboutMe: "Animal lover and advocate for wildlife conservation.",
          city: "Sydney",
          country: "Australia",
          foodPreference: "Vegan",
          gender: "Female",
          language: "English",
        },
      ];
});
        

const usersSlice = createSlice({
    name: 'users',
    initialState : {
        users: [],
        loading: false,
        error: [],
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
    
});

export default usersSlice.reducer;



