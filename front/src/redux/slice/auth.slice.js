    import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
    import axios from 'axios';

    const API_URL = 'http://localhost:5000/api/auth';

    // 📤 Register with profile image
    export const db_registerUser = createAsyncThunk(
    'register/registerUser',
    async (formData, thunkAPI) => {
        try {
        const response = await axios.post(`${API_URL}/register`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
        } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
    );

    // 🔐 Login
    export const db_loginUser = createAsyncThunk(
    'register/loginUser',
    async (credentials, thunkAPI) => {
        try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
        } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
    );

    // 📩 Send OTP
    export const db_sendOTP = createAsyncThunk(
    'register/sendOTP',
    async (emailData, thunkAPI) => {
        try {
        const response = await axios.post(`${API_URL}/sendotp`, emailData);
        return response.data;
        } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
    );

    // ✅ Verify OTP
    export const db_verifyOTP = createAsyncThunk(
    'register/verifyOTP',
    async (otpData, thunkAPI) => {
        try {
        const response = await axios.post(`${API_URL}/verifyotp`, otpData);
        return response.data;
        } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
    );

    // 🔁 Reset Password
    export const db_resetPassword = createAsyncThunk(
    'register/resetPassword',
    async (resetData, thunkAPI) => {
        try {
        const response = await axios.post(`${API_URL}/resetpass`, resetData);
        return response.data;
        } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
    );

    // 📥 Get all registered users
    export const db_getAllUsers = createAsyncThunk(
    'register/getAllUsers',
    async (_, thunkAPI) => {
        try {
        const response = await axios.get(`${API_URL}`);
        return response.data;
        } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
    );

    // 📋 Get single user by ID
    export const db_getUserById = createAsyncThunk(
    'register/getUserById',
    async (userId, thunkAPI) => {
        try {
        const response = await axios.get(`${API_URL}/${userId}`);
        return response.data;
        } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
    );

    // ✏️ Update user
  export const db_updateUser = createAsyncThunk(
  'auth/updateUser',
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await axios.put(`/api/user/${id}`, updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message || 'Update failed');
    }
  }
);


    // ❌ Delete user
    export const db_deleteUser = createAsyncThunk(
    'register/deleteUser',
    async (id, thunkAPI) => {
        try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
        } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
    );

    // 🧩 Slice
    const registerSlice = createSlice({
    name: 'register',
    initialState: {
        users: [],
        user: null,
        authUser: null,
        loading: false,
        error: null,
        otpStatus: null,
        passwordResetStatus: null,
    },
    reducers: {
        db_logoutUser(state) {
        state.authUser = null;
        localStorage.removeItem('authUser');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        },
    },
    extraReducers: (builder) => {
        builder
        // Register
        .addCase(db_registerUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(db_registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.authUser = action.payload;
        })
        .addCase(db_registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Login
        .addCase(db_loginUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(db_loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.authUser = action.payload;
            localStorage.setItem('authUser', JSON.stringify(action.payload));
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('userId', action.payload.user?._id || '');
        })
        .addCase(db_loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Send OTP
        .addCase(db_sendOTP.fulfilled, (state, action) => {
            state.otpStatus = action.payload;
        })

        // Verify OTP
        .addCase(db_verifyOTP.fulfilled, (state, action) => {
            state.otpStatus = action.payload;
        })

        // Reset Password
        .addCase(db_resetPassword.fulfilled, (state, action) => {
            state.passwordResetStatus = action.payload;
        })

        // Get All Users
        .addCase(db_getAllUsers.pending, (state) => {
            state.loading = true;
        })
        .addCase(db_getAllUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
        })
        .addCase(db_getAllUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Get Single User
        .addCase(db_getUserById.fulfilled, (state, action) => {
            state.user = action.payload;
        })

        // Update User
        .addCase(db_updateUser.fulfilled, (state, action) => {
            state.user = action.payload;
        })

        // Delete User
        .addCase(db_deleteUser.fulfilled, (state, action) => {
            state.users = state.users.filter((user) => user._id !== action.meta.arg);
        });
    },
    });

    export const { db_logoutUser } = registerSlice.actions;
    export default registerSlice.reducer;
