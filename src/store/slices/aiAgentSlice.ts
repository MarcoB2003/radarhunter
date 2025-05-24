
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AiMessage, AiSuggestion } from '../../types';

type AiAgentState = {
  loading: boolean;
  error: string | null;
  messages: AiMessage[];
  suggestions: AiSuggestion[];
  conversationHistory: Record<string, AiMessage[]>;
};

const initialState: AiAgentState = {
  loading: false,
  error: null,
  messages: [],
  suggestions: [],
  conversationHistory: {},
};

const aiAgentSlice = createSlice({
  name: 'aiAgent',
  initialState,
  reducers: {
    aiRequestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    aiRequestSuccess: (state) => {
      state.loading = false;
    },
    aiRequestFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addMessage: (state, action: PayloadAction<AiMessage>) => {
      state.messages.push(action.payload);
      
      // Also store in conversation history by contact ID
      if (action.payload.contactId) {
        if (!state.conversationHistory[action.payload.contactId]) {
          state.conversationHistory[action.payload.contactId] = [];
        }
        state.conversationHistory[action.payload.contactId].push(action.payload);
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setSuggestions: (state, action: PayloadAction<AiSuggestion[]>) => {
      state.suggestions = action.payload;
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  aiRequestStart,
  aiRequestSuccess,
  aiRequestFailed,
  addMessage,
  clearMessages,
  setSuggestions,
  clearSuggestions,
  clearError,
} = aiAgentSlice.actions;

export default aiAgentSlice.reducer;
