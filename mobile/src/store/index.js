import { configureStore } from '@reduxjs/toolkit'
import recipesReducer from './slices/recipesSlice'

export const store = configureStore({
  reducer: {
    recipes: recipesReducer,
  },
})
