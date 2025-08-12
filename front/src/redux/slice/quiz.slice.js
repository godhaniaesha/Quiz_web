import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL_USER = "http://localhost:5000/api/user";
const API_URL_QUIZ = "http://localhost:5000/api/quiz";

// 1. Generate Quiz
export const db_generateQuiz = createAsyncThunk(
  "quiz/generateQuiz",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL_USER}/generate-quiz`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 2. Login Quiz
export const db_loginQuiz = createAsyncThunk(
  "quiz/loginQuiz",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL_USER}/LoginQuiz`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 3. Submit Quiz
export const db_submitQuiz = createAsyncThunk(
  "quiz/submitQuiz",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL_QUIZ}/submit`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 4. Get All Quizzes
export const db_getAllQuizzes = createAsyncThunk(
  "quiz/getAllQuizzes",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL_QUIZ}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 5. Get Quiz by ID
export const db_getQuizById = createAsyncThunk(
  "quiz/getQuizById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL_QUIZ}/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    quizzes: [],
    currentQuiz: null,
    loading: false,
    error: null,
    result: null, // for submit results
    userAnswers: [], // (not used in current component, but can be added if centralized answer tracking is desired)
  },
  reducers: {
    db_resetQuizState(state) {
      state.currentQuiz = null;
      state.result = null;
      state.error = null;
      state.userAnswers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate Quiz
      .addCase(db_generateQuiz.pending, (state) => {
        state.loading = true;
      })
      .addCase(db_generateQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
        state.result = action.payload; // if you want to store result here
      })
      .addCase(db_generateQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login Quiz
      .addCase(db_loginQuiz.pending, (state) => {
        state.loading = true;
      })
      .addCase(db_loginQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(db_loginQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit Quiz
      .addCase(db_submitQuiz.pending, (state) => {
        state.loading = true;
      })
      .addCase(db_submitQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(db_submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Quizzes
      .addCase(db_getAllQuizzes.pending, (state) => {
        state.loading = true;
      })
      .addCase(db_getAllQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload.data || [];  // <-- Use data array here
      })
      .addCase(db_getAllQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Quiz by ID
      .addCase(db_getQuizById.pending, (state) => {
        state.loading = true;
      })
      .addCase(db_getQuizById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(db_getQuizById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { db_resetQuizState } = quizSlice.actions;
export default quizSlice.reducer;
