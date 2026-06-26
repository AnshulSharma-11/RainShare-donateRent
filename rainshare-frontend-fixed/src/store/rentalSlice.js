import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const loadWishlistFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('rainshare_wishlist') || '[]');
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (wishlist) => {
  try {
    localStorage.setItem('rainshare_wishlist', JSON.stringify(wishlist));
  } catch {}
};

// ─── Donor thunks (unchanged from Session 3) ─────────────────────────────────

export const fetchRentalRequestsForMyGear = createAsyncThunk(
  'rentals/fetchRentalRequestsForMyGear',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const gearRes = await api.get(`/rain_gear?owner_id=${auth.user.id}`);
      const myGearIds = gearRes.data.map((g) => g.id);
      if (myGearIds.length === 0) return [];
      const params = myGearIds.map((id) => `gear_id=${id}`).join('&');
      const rentalRes = await api.get(`/rentals?${params}&_expand=gear`);
      return rentalRes.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch rental requests');
    }
  }
);

export const approveRental = createAsyncThunk(
  'rentals/approveRental',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/rentals/${id}`, {
        status: 'active',
        approved_at: new Date().toISOString(),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to approve rental');
    }
  }
);

export const declineRental = createAsyncThunk(
  'rentals/declineRental',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/rentals/${id}`, {
        status: 'declined',
        declined_at: new Date().toISOString(),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to decline rental');
    }
  }
);

export const markReturned = createAsyncThunk(
  'rentals/markReturned',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/rentals/${id}`, {
        status: 'returned',
        returned_at: new Date().toISOString(),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to mark as returned');
    }
  }
);

// ─── Renter thunks (Session 4) ────────────────────────────────────────────────

export const fetchMyRentals = createAsyncThunk(
  'rentals/fetchMyRentals',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await api.get(`/rentals?renter_id=${auth.user.id}&_expand=gear`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch your rentals');
    }
  }
);

export const requestRental = createAsyncThunk(
  'rentals/requestRental',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await api.post('/rentals', {
        ...payload,
        renter_id: auth.user.id,
        renter_name: auth.user.name || auth.user.email,
        status: 'pending',
        created_at: new Date().toISOString(),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to submit rental request');
    }
  }
);

export const cancelRentalRequest = createAsyncThunk(
  'rentals/cancelRentalRequest',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/rentals/${id}`, {
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to cancel request');
    }
  }
);

export const fetchAllRentals = createAsyncThunk(
  'rentals/fetchAllRentals',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/rentals?_expand=gear');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch rentals');
    }
  }
);

export const flagOverdue = createAsyncThunk(
  'rentals/flagOverdue',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/rentals/${id}`, {
        status: 'overdue',
        flagged_at: new Date().toISOString(),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to flag overdue');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const rentalSlice = createSlice({
  name: 'rentals',
  initialState: {
    // Donor view
    rentals: [],
    status: 'idle',
    error: null,
    actionStatus: 'idle',

    // Renter view (Session 4)
    myRentals: [],
    myRentalsStatus: 'idle',
    myRentalsError: null,
    requestStatus: 'idle',

    // Wishlist (Session 4) — seeded from localStorage
    wishlist: loadWishlistFromStorage(),
  },
  reducers: {
    clearRentals(state) {
      state.rentals = [];
      state.status = 'idle';
      state.error = null;
    },
    clearMyRentals(state) {
      state.myRentals = [];
      state.myRentalsStatus = 'idle';
      state.myRentalsError = null;
    },

    // Wishlist reducers — persisted to localStorage
    addToWishlist(state, action) {
      const gearId = action.payload;
      if (!state.wishlist.includes(gearId)) {
        state.wishlist.push(gearId);
        saveWishlistToStorage(state.wishlist);
      }
    },
    removeFromWishlist(state, action) {
      state.wishlist = state.wishlist.filter((id) => id !== action.payload);
      saveWishlistToStorage(state.wishlist);
    },
  },
  extraReducers: (builder) => {
    // ── fetchRentalRequestsForMyGear (donor) ──────────────────────────────
    builder
      .addCase(fetchRentalRequestsForMyGear.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRentalRequestsForMyGear.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rentals = action.payload;
      })
      .addCase(fetchRentalRequestsForMyGear.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Shared updater for approve / decline / return (donor)
    const updateRental = (state, action) => {
      const idx = state.rentals.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) state.rentals[idx] = action.payload;
      // Also update myRentals if it appears there
      const myIdx = state.myRentals.findIndex((r) => r.id === action.payload.id);
      if (myIdx !== -1) state.myRentals[myIdx] = action.payload;
      state.actionStatus = 'idle';
    };

    builder
      .addCase(approveRental.pending, (state) => { state.actionStatus = 'loading'; })
      .addCase(approveRental.fulfilled, updateRental)
      .addCase(approveRental.rejected, (state) => { state.actionStatus = 'idle'; });

    builder
      .addCase(declineRental.pending, (state) => { state.actionStatus = 'loading'; })
      .addCase(declineRental.fulfilled, updateRental)
      .addCase(declineRental.rejected, (state) => { state.actionStatus = 'idle'; });

    builder
      .addCase(markReturned.pending, (state) => { state.actionStatus = 'loading'; })
      .addCase(markReturned.fulfilled, updateRental)
      .addCase(markReturned.rejected, (state) => { state.actionStatus = 'idle'; });

    // ── fetchMyRentals (renter) ───────────────────────────────────────────
    builder
      .addCase(fetchMyRentals.pending, (state) => {
        state.myRentalsStatus = 'loading';
        state.myRentalsError = null;
      })
      .addCase(fetchMyRentals.fulfilled, (state, action) => {
        state.myRentalsStatus = 'succeeded';
        state.myRentals = action.payload;
      })
      .addCase(fetchMyRentals.rejected, (state, action) => {
        state.myRentalsStatus = 'failed';
        state.myRentalsError = action.payload;
      });

    // ── requestRental (renter) ────────────────────────────────────────────
    builder
      .addCase(requestRental.pending, (state) => { state.requestStatus = 'loading'; })
      .addCase(requestRental.fulfilled, (state, action) => {
        state.requestStatus = 'succeeded';
        state.myRentals.unshift(action.payload);
      })
      .addCase(requestRental.rejected, (state) => { state.requestStatus = 'idle'; });

    // ── cancelRentalRequest (renter) ──────────────────────────────────────
    builder
      .addCase(cancelRentalRequest.fulfilled, (state, action) => {
        const idx = state.myRentals.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.myRentals[idx] = { ...state.myRentals[idx], ...action.payload };
      });

    // ── fetchAllRentals (admin) ─────────────────────────────────────────
    builder
      .addCase(fetchAllRentals.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllRentals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rentals = action.payload;
      })
      .addCase(fetchAllRentals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // ── flagOverdue (admin) ─────────────────────────────────────────────
    builder
      .addCase(flagOverdue.fulfilled, updateRental);
  },
});

export const { clearRentals, clearMyRentals, addToWishlist, removeFromWishlist } = rentalSlice.actions;
export default rentalSlice.reducer;
