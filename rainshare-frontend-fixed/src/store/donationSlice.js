import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// ── Thunks ──────────────────────────────────────────────────────────────────

export const fetchMyDonations = createAsyncThunk(
  'donations/fetchMyDonations',
  async (filters = {}, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const params = new URLSearchParams();
      params.set('donor_id', auth.user.id);
      if (filters.status && filters.status !== 'all') params.set('status', filters.status);
      params.set('_expand', 'gear');
      const res = await api.get(`/donations?${params.toString()}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch donations');
    }
  }
);

export const createDonation = createAsyncThunk(
  'donations/createDonation',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await api.post('/donations', {
        ...payload,
        donor_id: auth.user.id,
        status: 'pending',
        created_at: new Date().toISOString(),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create donation');
    }
  }
);

export const cancelDonation = createAsyncThunk(
  'donations/cancelDonation',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/donations/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to cancel donation');
    }
  }
);

export const fetchAllDonations = createAsyncThunk(
  'donations/fetchAllDonations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/donations?_expand=gear');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch donations');
    }
  }
);

export const updateDonationStatus = createAsyncThunk(
  'donations/updateDonationStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/donations/${id}`, { status });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update donation');
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const donationSlice = createSlice({
  name: 'donations',
  initialState: {
    donations: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearDonations(state) {
      state.donations = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchMyDonations
    builder
      .addCase(fetchMyDonations.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMyDonations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.donations = action.payload;
      })
      .addCase(fetchMyDonations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // createDonation
    builder
      .addCase(createDonation.fulfilled, (state, action) => {
        state.donations.unshift(action.payload);
      });

    // cancelDonation
    builder
      .addCase(cancelDonation.fulfilled, (state, action) => {
        state.donations = state.donations.filter((d) => d.id !== action.payload);
      });

    // fetchAllDonations (admin)
    builder
      .addCase(fetchAllDonations.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllDonations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.donations = action.payload;
      })
      .addCase(fetchAllDonations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // updateDonationStatus (admin)
    builder
      .addCase(updateDonationStatus.fulfilled, (state, action) => {
        const idx = state.donations.findIndex((d) => d.id === action.payload.id);
        if (idx !== -1) state.donations[idx] = action.payload;
      });
  },
});

export const { clearDonations } = donationSlice.actions;
export default donationSlice.reducer;
