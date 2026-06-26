import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/users');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch users');
    }
  }
);

export const toggleUserActive = createAsyncThunk(
  'admin/toggleUserActive',
  async ({ id, active }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/users/${id}`, { active });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update user status');
    }
  }
);

export const fetchAllVolunteers = createAsyncThunk(
  'admin/fetchAllVolunteers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/volunteers');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch volunteers');
    }
  }
);

export const updateVolunteerStatus = createAsyncThunk(
  'admin/updateVolunteerStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/volunteers/${id}`, { status });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update volunteer status');
    }
  }
);

export const fetchActivityLog = createAsyncThunk(
  'admin/fetchActivityLog',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/activityLog?_sort=timestamp&_order=desc');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch activity log');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    usersStatus: 'idle',
    usersError: null,

    volunteers: [],
    volunteersStatus: 'idle',
    volunteersError: null,

    activityLog: [],
    activityLogStatus: 'idle',
    activityLogError: null,

    actionStatus: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersStatus = 'loading';
        state.usersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersStatus = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersStatus = 'failed';
        state.usersError = action.payload;
      });

    builder
      .addCase(toggleUserActive.pending, (state) => { state.actionStatus = 'loading'; })
      .addCase(toggleUserActive.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        const idx = state.users.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(toggleUserActive.rejected, (state) => { state.actionStatus = 'idle'; });

    builder
      .addCase(fetchAllVolunteers.pending, (state) => {
        state.volunteersStatus = 'loading';
        state.volunteersError = null;
      })
      .addCase(fetchAllVolunteers.fulfilled, (state, action) => {
        state.volunteersStatus = 'succeeded';
        state.volunteers = action.payload;
      })
      .addCase(fetchAllVolunteers.rejected, (state, action) => {
        state.volunteersStatus = 'failed';
        state.volunteersError = action.payload;
      });

    builder
      .addCase(updateVolunteerStatus.fulfilled, (state, action) => {
        const idx = state.volunteers.findIndex((v) => v.id === action.payload.id);
        if (idx !== -1) state.volunteers[idx] = action.payload;
      });

    builder
      .addCase(fetchActivityLog.pending, (state) => {
        state.activityLogStatus = 'loading';
        state.activityLogError = null;
      })
      .addCase(fetchActivityLog.fulfilled, (state, action) => {
        state.activityLogStatus = 'succeeded';
        state.activityLog = action.payload;
      })
      .addCase(fetchActivityLog.rejected, (state, action) => {
        state.activityLogStatus = 'failed';
        state.activityLogError = action.payload;
      });
  },
});

export default adminSlice.reducer;
