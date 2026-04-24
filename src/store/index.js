import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import rolesReducer from './slices/rolesSlice';
import recipesReducer from './slices/recipesSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    roles: rolesReducer,
    recipes: recipesReducer,
  },
});
