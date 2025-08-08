import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/question'; // Update this if needed

// Get all questions
export const db_getAllQuestions = createAsyncThunk(
  'question/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Get question by ID
export const db_getQuestionById = createAsyncThunk(
  'question/getById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create a new question
export const db_createQuestion = createAsyncThunk(
  'question/create',
  async (questionData, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, questionData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Update a question
export const db_updateQuestion = createAsyncThunk(
  'question/update',
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Delete a question
export const db_deleteQuestion = createAsyncThunk(
  'question/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Slice
const questionSlice = createSlice({
  name: 'question',
  initialState: {
    questions: [],
    singleQuestion: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all questions
      .addCase(db_getAllQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(db_getAllQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(db_getAllQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get question by ID
      .addCase(db_getQuestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(db_getQuestionById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleQuestion = action.payload;
      })
      .addCase(db_getQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create question
      .addCase(db_createQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(db_createQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions.push(action.payload);
      })
      .addCase(db_createQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update question
      .addCase(db_updateQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(db_updateQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = state.questions.map((q) =>
          q._id === action.payload._id ? action.payload : q
        );
      })
      .addCase(db_updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete question
      .addCase(db_deleteQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(db_deleteQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = state.questions.filter((q) => q._id !== action.payload);
      })
      .addCase(db_deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default questionSlice.reducer;
