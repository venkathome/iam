import { createSlice } from '@reduxjs/toolkit';

const rolesSlice = createSlice({
  name: 'roles',
  initialState: {
    selectedRoleId: null,
  },
  reducers: {
    setSelectedRole: (state, action) => {
      state.selectedRoleId = action.payload;
    },
    clearSelectedRole: (state) => {
      state.selectedRoleId = null;
    },
  },
});

export const { setSelectedRole, clearSelectedRole } = rolesSlice.actions;
export default rolesSlice.reducer;
