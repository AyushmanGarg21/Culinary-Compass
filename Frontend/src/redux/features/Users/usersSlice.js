import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    return [
        {
          id: 1,
          name: "John Doe",
          profileImage: "https://via.placeholder.com/100",
          aboutMe: "I love coding and exploring new technologies.",
          country: "USA",
          foodPreference: "Veg",
          gender: "Male",
          age: 29,
          language: "English",
        },
        {
          id: 2,
          name: "Jane Smith",
          profileImage: "https://via.placeholder.com/100",
          aboutMe: "A passionate traveler and foodie.",
          country: "Canada",
          foodPreference: "Non-Veg",
          gender: "Female",
          age: 25,
          language: "French",
        },
        {
          id: 3,
          name: "Ali Khan",
          profileImage: "https://via.placeholder.com/100",
          aboutMe: "Tech enthusiast and aspiring entrepreneur.",
          country: "Pakistan",
          foodPreference: "Veg",
          gender: "Male",
          age: 31,
          language: "Urdu",
        },
        {
          id: 4,
          name: "Maria Lopez",
          profileImage: "https://via.placeholder.com/100",
          aboutMe: "Loves painting and hiking in the mountains.",
          country: "Mexico",
          foodPreference: "Non-Veg",
          gender: "Female",
          age: 28,
          language: "Spanish",
        },
        {
          id: 5,
          name: "Akira Tanaka",
          profileImage: "https://via.placeholder.com/100",
          aboutMe: "Always looking for new culinary experiences.",
          country: "Japan",
          foodPreference: "Veg",
          gender: "Male",
          age: 35,
          language: "Japanese",
        },
        {
          id: 6,
          name: "Sarah Lee",
          profileImage: "https://via.placeholder.com/100",
          aboutMe: "Yoga lover and tech-savvy marketer.",
          country: "South Korea",
          foodPreference: "Veg",
          gender: "Female",
          age: 30,
          language: "Korean",
        },
        {
          id: 7,
          name: "Rajesh Gupta",
          profileImage: "https://via.placeholder.com/100",
          aboutMe: "Enjoys cricket and a good book on weekends.",
          country: "India",
          foodPreference: "Non-Veg",
          gender: "Male",
          age: 27,
          language: "Hindi",
        },
        {
          id: 8,
          name: "Lina Müller",
          profileImage: "https://via.placeholder.com/100",
          aboutMe: "Passionate about sustainable living and design.",
          country: "Germany",
          foodPreference: "Veg",
          gender: "Female",
          age: 32,
          language: "German",
        },
        {
          id: 9,
          name: "Ahmed Al-Sheikh",
          profileImage: "https://via.placeholder.com/100",
          aboutMe: "Fan of history and Middle Eastern cuisine.",
          country: "Egypt",
          foodPreference: "Non-Veg",
          gender: "Male",
          age: 34,
          language: "Arabic",
        },
        {
          id: 10,
          name: "Emily Brown",
          profileImage: "https://via.placeholder.com/100",
          aboutMe: "Animal lover and advocate for wildlife conservation.",
          country: "Australia",
          foodPreference: "Veg",
          gender: "Female",
          age: 26,
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



