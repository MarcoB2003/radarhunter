
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Lead } from '../../types';

type LeadsState = {
  items: Lead[];
  filteredItems: Lead[];
  selectedLead: Lead | null;
  loading: boolean;
  error: string | null;
  filters: {
    temperature?: 'hot' | 'warm' | 'cold';
    segment?: string;
    source?: string;
    period?: 'today' | 'week' | 'month' | 'quarter' | 'year';
  };
};

const initialState: LeadsState = {
  items: [],
  filteredItems: [],
  selectedLead: null,
  loading: false,
  error: null,
  filters: {},
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    fetchLeadsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLeadsSuccess: (state, action: PayloadAction<Lead[]>) => {
      state.items = action.payload;
      state.filteredItems = applyFilters(action.payload, state.filters);
      state.loading = false;
    },
    fetchLeadsFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<LeadsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredItems = applyFilters(state.items, state.filters);
    },
    clearFilters: (state) => {
      state.filters = {};
      state.filteredItems = state.items;
    },
    selectLead: (state, action: PayloadAction<string>) => {
      state.selectedLead = state.items.find(lead => lead.id === action.payload) || null;
    },
    clearSelectedLead: (state) => {
      state.selectedLead = null;
    },
    addLead: (state, action: PayloadAction<Lead>) => {
      state.items.push(action.payload);
      state.filteredItems = applyFilters(state.items, state.filters);
    },
    updateLead: (state, action: PayloadAction<Lead>) => {
      const index = state.items.findIndex(lead => lead.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        if (state.selectedLead?.id === action.payload.id) {
          state.selectedLead = action.payload;
        }
        state.filteredItems = applyFilters(state.items, state.filters);
      }
    },
    removeLead: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(lead => lead.id !== action.payload);
      if (state.selectedLead?.id === action.payload) {
        state.selectedLead = null;
      }
      state.filteredItems = applyFilters(state.items, state.filters);
    },
  },
});

// Helper function to apply filters
const applyFilters = (leads: Lead[], filters: LeadsState['filters']) => {
  let filtered = [...leads];
  
  if (filters.temperature) {
    filtered = filtered.filter(lead => lead.temperature === filters.temperature);
  }
  
  if (filters.segment) {
    filtered = filtered.filter(lead => lead.segment === filters.segment);
  }
  
  if (filters.source) {
    filtered = filtered.filter(lead => lead.source === filters.source);
  }
  
  // Period filtering would need more complex logic with dates
  // This is a simplified version
  if (filters.period) {
    const now = new Date();
    let startDate = new Date();
    
    switch (filters.period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    filtered = filtered.filter(lead => {
      const leadDate = new Date(lead.createdAt);
      return leadDate >= startDate && leadDate <= now;
    });
  }
  
  return filtered;
};

export const {
  fetchLeadsStart,
  fetchLeadsSuccess,
  fetchLeadsFailed,
  setFilters,
  clearFilters,
  selectLead,
  clearSelectedLead,
  addLead,
  updateLead,
  removeLead,
} = leadsSlice.actions;

export default leadsSlice.reducer;
