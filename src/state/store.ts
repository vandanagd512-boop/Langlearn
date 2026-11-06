import { create } from 'zustand';
import { AuthState, createAuthSlice } from './slices/authSlice';
import { UiState, createUiSlice } from './slices/uiSlice';
import { UserState, createUserSlice } from './slices/userSlice';

export type RootState = AuthState & UiState & UserState;

export const useAppStore = create<RootState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createUiSlice(...a),
  ...createUserSlice(...a),
}));
