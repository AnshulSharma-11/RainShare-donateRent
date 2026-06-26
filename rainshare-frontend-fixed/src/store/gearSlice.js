import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// ── Thunks ──────────────────────────────────────────────────────────────────

export const fetchGears = createAsyncThunk(
  'gear/fetchGears',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.q)           params.set('q', filters.q);
      if (filters.owner_id)    params.set('owner_id', filters.owner_id);
      if (filters.category_id) params.set('category_id', filters.category_id);
      if (filters.condition)   params.set('condition', filters.condition);
      if (filters.type === 'donation') params.set('rent_price', 0);
      if (filters.status)      params.set('status', filters.status);
      if (filters.available)   params.set('status', 'available');
      params.set('_page',  filters.page  || 1);
      params.set('_limit', filters.limit || 10);

      const res = await api.get(`/rain_gear?${params.toString()}`);
      return {
        items: res.data,
        total: parseInt(res.headers['x-total-count'] || res.data.length, 10),
        page:  filters.page || 1,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch gear');
    }
  }
);

export const fetchGearById = createAsyncThunk(
  'gear/fetchGearById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/rain_gear/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Gear not found');
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const gearSlice = createSlice({
  name: 'gear',
  initialState: {
    items:       [],
    currentGear: null,
    filters: {
      q:           '',
      category_id: '',
      condition:   '',
      minPrice:    '',
      maxPrice:    '',
      type:        'all', // 'all' | 'donation' | 'rental'
    },
    pagination: {
      page:  1,
      limit: 10,
      total: 0,
    },
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error:  null,
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // reset to page 1 on filter change
    },
    clearCurrentGear(state) {
      state.currentGear = null;
    },
    setPage(state, action) {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchGears
    builder
      .addCase(fetchGears.pending, (state) => {
        state.status = 'loading';
        state.error  = null;
      })
      .addCase(fetchGears.fulfilled, (state, action) => {
        state.status           = 'succeeded';
        state.items            = action.payload.items;
        state.pagination.total = action.payload.total;
        state.pagination.page  = action.payload.page;
      })
      .addCase(fetchGears.rejected, (state, action) => {
        state.status = 'failed';
        state.error  = action.payload;
      });

    // fetchGearById
    builder
      .addCase(fetchGearById.pending, (state) => {
        state.status      = 'loading';
        state.currentGear = null;
        state.error       = null;
      })
      .addCase(fetchGearById.fulfilled, (state, action) => {
        state.status      = 'succeeded';
        state.currentGear = action.payload;
      })
      .addCase(fetchGearById.rejected, (state, action) => {
        state.status = 'failed';
        state.error  = action.payload;
      });
  },
});

export const { setFilters, clearCurrentGear, setPage } = gearSlice.actions;

// Aliases / additional thunks used elsewhere in the app
export const fetchGearList = fetchGears;

export const fetchCategories = createAsyncThunk(
  'gear/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/categories');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch categories');
    }
  }
);

export const createCategory = createAsyncThunk(
  'gear/createCategory',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/categories', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'gear/updateCategory',
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/categories/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'gear/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/categories/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete category');
    }
  }
);

export const updateGearStatus = createAsyncThunk(
  'gear/updateGearStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/rain_gear/${id}`, { status });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update gear');
    }
  }
);

export const deleteGear = createAsyncThunk(
  'gear/deleteGear',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/rain_gear/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete gear');
    }
  }
);

export default gearSlice.reducer;
