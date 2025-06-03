
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Opportunity, PipelineStage } from '../../types';

type OpportunitiesState = {
  items: Opportunity[];
  pipelineStages: PipelineStage[];
  selectedOpportunity: Opportunity | null;
  loading: boolean;
  error: string | null;
};

const initialState: OpportunitiesState = {
  items: [],
  pipelineStages: [
    { id: 'lead', name: 'Lead', order: 0 },
    { id: 'qualified', name: 'Qualificado', order: 1 },
    { id: 'proposal', name: 'Proposta', order: 2 },
    { id: 'negotiation', name: 'Negociação', order: 3 },
    { id: 'closed_won', name: 'Fechado (Ganho)', order: 4 },
    { id: 'closed_lost', name: 'Fechado (Perdido)', order: 5 },
  ],
  selectedOpportunity: null,
  loading: false,
  error: null,
};

const opportunitiesSlice = createSlice({
  name: 'opportunities',
  initialState,
  reducers: {
    fetchOpportunitiesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOpportunitiesSuccess: (state, action: PayloadAction<Opportunity[]>) => {
      state.items = action.payload;
      state.loading = false;
    },
    fetchOpportunitiesFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectOpportunity: (state, action: PayloadAction<string>) => {
      state.selectedOpportunity = state.items.find(opp => opp.id === action.payload) || null;
    },
    clearSelectedOpportunity: (state) => {
      state.selectedOpportunity = null;
    },
    addOpportunity: (state, action: PayloadAction<Opportunity>) => {
      state.items.push(action.payload);
    },
    updateOpportunity: (state, action: PayloadAction<Opportunity>) => {
      const index = state.items.findIndex(opp => opp.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        if (state.selectedOpportunity?.id === action.payload.id) {
          state.selectedOpportunity = action.payload;
        }
      }
    },
    moveOpportunity: (state, action: PayloadAction<{ id: string, stageId: string }>) => {
      const index = state.items.findIndex(opp => opp.id === action.payload.id);
      if (index !== -1) {
        state.items[index].stageId = action.payload.stageId;
        state.items[index].updatedAt = new Date().toISOString();
        
        if (state.selectedOpportunity?.id === action.payload.id) {
          state.selectedOpportunity = { ...state.items[index] };
        }
      }
    },
    removeOpportunity: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(opp => opp.id !== action.payload);
      if (state.selectedOpportunity?.id === action.payload) {
        state.selectedOpportunity = null;
      }
    },
    updatePipelineStages: (state, action: PayloadAction<PipelineStage[]>) => {
      state.pipelineStages = action.payload;
    },
  },
});

export const {
  fetchOpportunitiesStart,
  fetchOpportunitiesSuccess,
  fetchOpportunitiesFailed,
  selectOpportunity,
  clearSelectedOpportunity,
  addOpportunity,
  updateOpportunity,
  moveOpportunity,
  removeOpportunity,
  updatePipelineStages,
} = opportunitiesSlice.actions;

export default opportunitiesSlice.reducer;
