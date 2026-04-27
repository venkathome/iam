import { createSlice } from '@reduxjs/toolkit'

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    selectedRecipeId: null,
    searchQuery: '',
    sortBy: 'alphabetical',
  },
  reducers: {
    setSelectedRecipe: (state, action) => { state.selectedRecipeId = action.payload },
    setSearchQuery:    (state, action) => { state.searchQuery    = action.payload },
    setSortBy:         (state, action) => { state.sortBy         = action.payload },
  },
})

export const { setSelectedRecipe, setSearchQuery, setSortBy } = recipesSlice.actions
export default recipesSlice.reducer
