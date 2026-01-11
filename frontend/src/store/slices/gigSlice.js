import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchGigs = createAsyncThunk(
  'gigs/fetchGigs',
  async ({ search = '', status = 'open' } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('status', status);
      
      const response = await api.get(`/gigs?${params.toString()}`);
      return response.data.gigs;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gigs');
    }
  }
);

export const fetchGig = createAsyncThunk(
  'gigs/fetchGig',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/gigs/${gigId}`);
      return response.data.gig;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gig');
    }
  }
);

export const fetchMyGigs = createAsyncThunk(
  'gigs/fetchMyGigs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/gigs/my-gigs');
      return response.data.gigs;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your gigs');
    }
  }
);

export const createGig = createAsyncThunk(
  'gigs/createGig',
  async (gigData, { rejectWithValue }) => {
    try {
      const response = await api.post('/gigs', gigData);
      return response.data.gig;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create gig');
    }
  }
);

export const updateGig = createAsyncThunk(
  'gigs/updateGig',
  async ({ gigId, gigData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/gigs/${gigId}`, gigData);
      return response.data.gig;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update gig');
    }
  }
);

export const deleteGig = createAsyncThunk(
  'gigs/deleteGig',
  async (gigId, { rejectWithValue }) => {
    try {
      await api.delete(`/gigs/${gigId}`);
      return gigId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete gig');
    }
  }
);

const initialState = {
  gigs: [],
  myGigs: [],
  currentGig: null,
  isLoading: false,
  error: null,
};

const gigSlice = createSlice({
  name: 'gigs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentGig: (state) => {
      state.currentGig = null;
    },
    updateGigInList: (state, action) => {
      const index = state.gigs.findIndex(g => g._id === action.payload._id);
      if (index !== -1) {
        state.gigs[index] = action.payload;
      }
      const myIndex = state.myGigs.findIndex(g => g._id === action.payload._id);
      if (myIndex !== -1) {
        state.myGigs[myIndex] = action.payload;
      }
      if (state.currentGig?._id === action.payload._id) {
        state.currentGig = action.payload;
      }
    },
    addGigToList: (state, action) => {
      state.gigs.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGigs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gigs = action.payload;
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchGig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGig = action.payload;
      })
      .addCase(fetchGig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyGigs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyGigs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myGigs = action.payload;
      })
      .addCase(fetchMyGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createGig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gigs.unshift(action.payload);
        state.myGigs.unshift(action.payload);
      })
      .addCase(createGig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateGig.fulfilled, (state, action) => {
        const index = state.gigs.findIndex(g => g._id === action.payload._id);
        if (index !== -1) {
          state.gigs[index] = action.payload;
        }
        const myIndex = state.myGigs.findIndex(g => g._id === action.payload._id);
        if (myIndex !== -1) {
          state.myGigs[myIndex] = action.payload;
        }
      })
      .addCase(deleteGig.fulfilled, (state, action) => {
        state.gigs = state.gigs.filter(g => g._id !== action.payload);
        state.myGigs = state.myGigs.filter(g => g._id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentGig, updateGigInList, addGigToList } = gigSlice.actions;
export default gigSlice.reducer;
