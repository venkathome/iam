import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    selectedUserId: null,
    roleFilter: '',
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUserId = action.payload;
    },
    setRoleFilter: (state, action) => {
      state.roleFilter = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUserId = null;
    },
  },
});

export const { setSelectedUser, setRoleFilter, clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
