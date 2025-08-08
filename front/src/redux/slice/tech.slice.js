import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/tech';

// Get all techs
export const fetchTechs = createAsyncThunk(
  'tech/fetchTechs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create tech
export const createTech = createAsyncThunk(
  'tech/createTech',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error || "Something went wrong.");
    }
  }
);

// Update tech
export const updateTech = createAsyncThunk(
  'tech/updateTech',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error || "Something went wrong.");
    }
  }
);

// Delete tech
export const deleteTech = createAsyncThunk(
  'tech/deleteTech',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Toggle tech status
export const toggleTechStatus = createAsyncThunk(
  'tech/toggleTechStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${BASE_URL}/${id}/toggle-status`);
      return response.data.tech || response.data.result || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const techSlice = createSlice({
  name: 'tech',
  initialState: {
    techs: [],
    selectedTech: null,
    loading: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
  },
  reducers: {
    resetCreateSuccess(state) {
      state.createSuccess = false;
    },
    resetUpdateSuccess(state) {
      state.updateSuccess = false;
    },
    clearSelectedTech(state) {
      state.selectedTech = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTechs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTechs.fulfilled, (state, action) => {
        state.loading = false;
        state.techs = action.payload;
      })
      .addCase(fetchTechs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTech.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createTech.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        if (Array.isArray(state.techs?.result)) {
          state.techs.result.unshift(action.payload);
        } else if (Array.isArray(state.techs)) {
          state.techs.unshift(action.payload);
        }
      })
      .addCase(createTech.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      .addCase(updateTech.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateTech.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        if (Array.isArray(state.techs?.result)) {
          const idx = state.techs.result.findIndex(item => item._id === action.payload._id);
          if (idx !== -1) state.techs.result[idx] = action.payload;
        } else if (Array.isArray(state.techs)) {
          const idx = state.techs.findIndex(item => item._id === action.payload._id);
          if (idx !== -1) state.techs[idx] = action.payload;
        }
      })
      .addCase(updateTech.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      .addCase(deleteTech.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTech.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.techs?.result)) {
          state.techs.result = state.techs.result.filter(item => item._id !== action.payload);
        } else if (Array.isArray(state.techs)) {
          state.techs = state.techs.filter(item => item._id !== action.payload);
        }
      })
      .addCase(deleteTech.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleTechStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTechStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.techs?.result)) {
          const idx = state.techs.result.findIndex(item => item._id === action.payload._id);
          if (idx !== -1) state.techs.result[idx] = action.payload;
        } else if (Array.isArray(state.techs)) {
          const idx = state.techs.findIndex(item => item._id === action.payload._id);
          if (idx !== -1) state.techs[idx] = action.payload;
        }
      })
      .addCase(toggleTechStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetCreateSuccess,
  resetUpdateSuccess,
  clearSelectedTech
} = techSlice.actions;

export default techSlice.reducer;
