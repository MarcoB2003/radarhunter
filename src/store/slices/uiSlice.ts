
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UiState = {
  sidebarOpen: boolean;
  activePage: string;
  notifications: {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    read: boolean;
    timestamp: string;
  }[];
};

const initialState: UiState = {
  sidebarOpen: true,
  activePage: 'dashboard',
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setActivePage: (state, action: PayloadAction<string>) => {
      state.activePage = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<UiState['notifications'][0], 'id' | 'timestamp' | 'read'>>) => {
      state.notifications.unshift({
        ...action.payload,
        id: Date.now().toString(),
        read: false,
        timestamp: new Date().toISOString(),
      });
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
  },
});

export const {
  toggleSidebar,
  setActivePage,
  addNotification,
  markNotificationAsRead,
  clearNotifications,
  removeNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
