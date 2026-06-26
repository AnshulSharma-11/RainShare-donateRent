import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: localStorage.getItem('darkMode') === 'true',
    sidebarOpen: true,
    activeModal: null, // e.g. 'addGear' | 'rentRequest' | 'confirm'
    modalData: null,
  },
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setDarkMode(state, action) {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', action.payload);
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
    openModal(state, action) {
      state.activeModal = action.payload.modal;
      state.modalData = action.payload.data || null;
    },
    closeModal(state) {
      state.activeModal = null;
      state.modalData = null;
    },
  },
});

export const {
  toggleDarkMode, setDarkMode,
  toggleSidebar, setSidebarOpen,
  openModal, closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
