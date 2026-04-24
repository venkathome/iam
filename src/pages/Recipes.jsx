import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from '@apollo/client/react'
import { setSelectedRecipe, setSearchQuery, setSortBy } from '../store/slices/recipesSlice'
import { GET_RECIPES, GET_RECIPE } from '../apollo/queries'
import './Recipes.css'

const SORT_LABELS = {
  alphabetical: 'A – Z',
  category: 'Category',
  complexity: 'Difficulty',
  cuisine: 'Cuisine',
}

const COMPLEXITY_LABELS = ['', 'Very Easy', 'Easy', 'Medium', 'Hard', 'Expert']

function Stars({ n }) {
  return (
    <span className="stars" title={COMPLEXITY_LABELS[n]}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < n ? 'star filled' : 'star'}>★</span>
      ))}
    </span>
  )
}

function groupAlphabetically(recipes) {
  const groups = {}
  for (const r of recipes) {
    const letter = r.name[0].toUpperCase()
    if (!groups[letter]) groups[letter] = []
    groups[letter].push(r)
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
}

function groupByKey(recipes, key) {
  const groups = {}
  for (const r of recipes) {
    const k = r[key] || 'Other'
    if (!groups[k]) groups[k] = []
    groups[k].push(r)
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
}

function groupByComplexity(recipes) {
  const groups = {}
  for (const r of recipes) {
    const label = COMPLEXITY_LABELS[r.complexity] || 'Unknown'
    if (!groups[label]) groups[label] = []
    groups[label].push(r)
  }
  const order = ['Very Easy', 'Easy', 'Medium', 'Hard', 'Expert']
  return order
    .filter(k => groups[k])
    .map(k => [k, groups[k]])
}

function buildGroups(recipes, sortBy) {
  const sorted = [...recipes].sort((a, b) => a.name.localeCompare(b.name))
  switch (sortBy) {
    case 'category':   return groupByKey(sorted, 'category')
    case 'complexity': return groupByComplexity(sorted)
    case 'cuisine':    return groupByKey(sorted, 'cuisine')
    default:           return groupAlphabetically(sorted)
  }
}

function RecipeDetail({ id }) {
  const { data, loading } = useQuery(GET_RECIPE, { variables: { id }, skip: !id })

  if (loading) return <div className="recipe-placeholder">Loading…</div>
  if (!data?.recipe) return <div className="recipe-placeholder">Recipe not found.</div>

  const r = data.recipe
  const ingredients = JSON.parse(r.ingredients || '[]')
  const instructions = JSON.parse(r.instructions || '[]')

  return (
    <div className="recipe-detail">
      <h2 className="recipe-name">{r.name}</h2>

      <div className="recipe-meta">
        <span className="meta-badge">{r.category}</span>
        <span className="meta-badge">{r.cuisine}</span>
        {r.servings && <span className="meta-badge">Serves {r.servings}</span>}
        {r.prepTime && <span className="meta-badge">Prep: {r.prepTime}</span>}
        {r.cookTime && <span className="meta-badge">Cook: {r.cookTime}</span>}
        <span className="meta-badge complexity-badge">
          <Stars n={r.complexity} /> {COMPLEXITY_LABELS[r.complexity]}
        </span>
      </div>

      <section className="recipe-section ingredients-section">
        <h3>
          <span className="section-icon">🧂</span> Ingredients
          <span className="count-badge">{ingredients.length}</span>
        </h3>
        {ingredients.length > 0 ? (
          <ul className="ingredients-list">
            {ingredients.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="empty-note">See cooking steps for ingredient details.</p>
        )}
      </section>

      <section className="recipe-section instructions-section">
        <h3>
          <span className="section-icon">👨‍🍳</span> How to Cook
          {instructions.length > 0 && <span className="count-badge">{instructions.length} steps</span>}
        </h3>
        {instructions.length > 0 ? (
          <ol className="instructions-list">
            {instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        ) : (
          <p className="empty-note">No separate cooking steps — follow the ingredient order above.</p>
        )}
      </section>
    </div>
  )
}

export default function Recipes({ onBack }) {
  const dispatch = useDispatch()
  const { selectedRecipeId, searchQuery, sortBy } = useSelector(s => s.recipes)
  const { data, loading } = useQuery(GET_RECIPES)
  const [showAC, setShowAC] = useState(false)
  const searchRef = useRef(null)
  const acRef = useRef(null)

  const allRecipes = data?.recipes || []

  const filtered = searchQuery
    ? allRecipes.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : allRecipes

  const acSuggestions = searchQuery
    ? allRecipes
        .filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 8)
    : []

  const groups = buildGroups(filtered, sortBy)

  // Close autocomplete on outside click
  useEffect(() => {
    function handler(e) {
      if (
        searchRef.current && !searchRef.current.contains(e.target) &&
        acRef.current && !acRef.current.contains(e.target)
      ) {
        setShowAC(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function selectFromAC(recipe) {
    dispatch(setSelectedRecipe(recipe.id))
    dispatch(setSearchQuery(recipe.name))
    setShowAC(false)
  }

  function handleSearchChange(e) {
    dispatch(setSearchQuery(e.target.value))
    setShowAC(true)
    if (!e.target.value) dispatch(setSelectedRecipe(null))
  }

  function handleSearchKeyDown(e) {
    if (e.key === 'Escape') {
      setShowAC(false)
      dispatch(setSearchQuery(''))
    }
    if (e.key === 'Enter' && acSuggestions.length > 0) {
      selectFromAC(acSuggestions[0])
    }
  }

  return (
    <div className="recipes-page">
      {/* Header */}
      <header className="recipes-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1 className="recipes-title">Recipes</h1>
        <div className="search-wrapper" ref={searchRef}>
          <input
            className="search-input"
            type="text"
            placeholder="Search recipes…"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery && setShowAC(true)}
            onKeyDown={handleSearchKeyDown}
            autoComplete="off"
          />
          {showAC && acSuggestions.length > 0 && (
            <ul className="autocomplete-list" ref={acRef}>
              {acSuggestions.map(r => (
                <li
                  key={r.id}
                  className="autocomplete-item"
                  onMouseDown={() => selectFromAC(r)}
                >
                  <span className="ac-name">{r.name}</span>
                  <span className="ac-category">{r.category}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <span className="recipe-count">{allRecipes.length} recipes</span>
      </header>

      <div className="recipes-body">
        {/* Sidebar */}
        <aside className="recipes-sidebar">
          <div className="sort-tabs">
            {Object.entries(SORT_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={`sort-tab${sortBy === key ? ' active' : ''}`}
                onClick={() => dispatch(setSortBy(key))}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="sidebar-list">
            {loading && <p className="sidebar-loading">Loading…</p>}
            {groups.map(([groupName, recipes]) => (
              <div key={groupName} className="sidebar-group">
                <div className="sidebar-group-header">
                  {groupName}
                  <span className="group-count">{recipes.length}</span>
                </div>
                {recipes.map(r => (
                  <div
                    key={r.id}
                    className={`sidebar-item${selectedRecipeId === r.id ? ' selected' : ''}`}
                    onClick={() => {
                      dispatch(setSelectedRecipe(r.id))
                      dispatch(setSearchQuery(''))
                      setShowAC(false)
                    }}
                  >
                    <span className="sidebar-item-name">{r.name}</span>
                    {sortBy !== 'complexity' && (
                      <Stars n={r.complexity} />
                    )}
                  </div>
                ))}
              </div>
            ))}
            {!loading && groups.length === 0 && (
              <p className="sidebar-empty">No recipes match your search.</p>
            )}
          </div>
        </aside>

        {/* Main panel */}
        <main className="recipes-main">
          {selectedRecipeId ? (
            <RecipeDetail id={selectedRecipeId} />
          ) : (
            <div className="recipe-placeholder">
              <div className="placeholder-icon">📖</div>
              <p>Select a recipe from the sidebar to view its details.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
