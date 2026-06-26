import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUserFromStorage',
  async () => {
    const raw = localStorage.getItem('auth');
    return raw ? JSON.parse(raw) : null;
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', credentials);
      const { token, role, user } = res.data;
      const authData = {
        user,
        role: (role || user?.role || '').toLowerCase(),
        token,
      };
      localStorage.setItem('auth', JSON.stringify(authData));
      return authData;
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      return rejectWithValue(msg);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/register', {
        full_name: userData.full_name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: userData.role,
      });
      const { token, role, user } = res.data;
      const authData = {
        user,
        role: (role || user?.role || userData.role || '').toLowerCase(),
        token,
      };
      localStorage.setItem('auth', JSON.stringify(authData));
      return authData;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      return rejectWithValue(msg);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    role: null,
    token: null,
    status: 'idle',
    error: null,
    initialized: false,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.role = null;
      state.token = null;
      localStorage.removeItem('auth');
    },
    setUser(state, action) {
      state.user = action.payload;
      try {
        const stored = JSON.parse(localStorage.getItem('auth') || '{}');
        localStorage.setItem('auth', JSON.stringify({ ...stored, user: action.payload }));
      } catch {}
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.initialized = true;
        if (action.payload) {
          state.user = action.payload.user;
          state.role = action.payload.role;
          state.token = action.payload.token;
        }
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.initialized = true;
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
