import { configureStore } from '@reduxjs/toolkit';
import authReducer     from '../features/auth/authSlice';
import uiReducer       from './uiSlice';
import gearReducer     from './gearSlice';
import donationReducer from './donationSlice';
import rentalReducer   from './rentalSlice';
import adminReducer    from './adminSlice';

export const store = configureStore({
  reducer: {
    auth:      authReducer,
    ui:        uiReducer,
    gear:      gearReducer,
    donations: donationReducer,
    rentals:   rentalReducer,
    admin:     adminReducer,
  },
});

export default store;
