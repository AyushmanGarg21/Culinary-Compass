import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUserRequests = createAsyncThunk(
  'requests/fetchUserRequests',
  async () => {
    console.log("Fetching user requests...");
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'Alice Smith',
            email: 'alice@example.com',
            phone: '123-456-7890',
            message: 'I would like to be a creator because I love sharing recipes.',
            experience: '5 years in culinary arts',
            links: 'https://myportfolio.com',
          },
          {
            id: 2,
            name: 'Bob Johnson',
            email: 'bob@example.com',
            phone: '987-654-3210',
            message: 'I am passionate about cooking and want to share my knowledge.',
            experience: '3 years of blogging experience',
            links: 'https://bobskitchen.com',
          },
          
          
        ]);
      }, 1000)
    );
  }
);

export const acceptUserRequest = createAsyncThunk(
  'requests/acceptUserRequest',
  async (id) => {
    console.log(`Accepting request with ID: ${id}`);
    // Simulate API delay
    return new Promise((resolve) => setTimeout(() => resolve(id), 500));
  }
);

export const declineUserRequest = createAsyncThunk(
  'requests/declineUserRequest',
  async (id) => {
    console.log(`Declining request with ID: ${id}`);
    // Simulate API delay
    return new Promise((resolve) => setTimeout(() => resolve(id), 500));
  }
);


export const fetchPostRequests = createAsyncThunk(
  'creatorRequests/fetchPostRequests',
  async () => {
    console.log("Fetching creator post requests...");
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          {
            id: 1,
            username: 'John Doe',
            profilePic: 'https://via.placeholder.com/40',
            image: 'https://via.placeholder.com/400x300',
            description: 'A tasty recipe you can make at home!',
            materials: ['Flour', 'Sugar', 'Butter', 'Eggs'],
            fullRecipe: '<p>This is the full recipe with instructions, ingredients, and tips!</p>',
          },
          {
            id: 2,
            username: 'Jane Doe',
            profilePic: 'https://via.placeholder.com/40',
            image: 'https://via.placeholder.com/400x300',
            description: 'Another delicious recipe for you to try!',
            materials: ['Salt', 'Pepper', 'Olive Oil', 'Garlic'],
            fullRecipe: '<p>This is the full recipe with all instructions, ingredients, etc.</p>',
          },
        ]);
      }, 1000)
    );
  }
);

  export const approvePostRequest = createAsyncThunk(
    'creatorRequests/approvePostRequest',
    async (id) => {
      console.log(`Approving post request with ID: ${id}`);
      return new Promise((resolve) => setTimeout(() => resolve(id), 500));
    }
  );

  export const rejectPostRequest = createAsyncThunk(
    'creatorRequests/rejectPostRequest',
    async (id) => {
      console.log(`Rejecting post request with ID: ${id}`);
      return new Promise((resolve) => setTimeout(() => resolve(id), 500));
    }
  );

const requestSlice = createSlice({
  name: 'requests',
  initialState: {
    userRequests: [],
    postRequests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.userRequests = action.payload;
      })
      .addCase(fetchUserRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(acceptUserRequest.fulfilled, (state, action) => {
        state.userRequests = state.userRequests.filter(
          (request) => request.id !== action.payload
        );
      })
      .addCase(declineUserRequest.fulfilled, (state, action) => {
        state.userRequests = state.userRequests.filter(
          (request) => request.id !== action.payload
        );
      })
      .addCase(fetchPostRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.postRequests = action.payload;
      })
      .addCase(fetchPostRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(approvePostRequest.fulfilled, (state, action) => {
        state.postRequests = state.postRequests.filter(
          (request) => request.id !== action.payload
        );
      })
      .addCase(rejectPostRequest.fulfilled, (state, action) => {
        state.postRequests = state.postRequests.filter(
          (request) => request.id !== action.payload
        );
      });
  },
});

export default requestSlice.reducer;