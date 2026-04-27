import { useState, useRef, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery, useMutation } from '@apollo/client/react'
import Breadcrumb from '../components/Breadcrumb'
import { setSelectedRecipe, setSearchQuery, setSortBy } from '../store/slices/recipesSlice'
import { GET_RECIPES, GET_RECIPE, CREATE_RECIPE, UPDATE_RECIPE, DELETE_RECIPE } from '../apollo/queries'
import './Recipes.css'

const SORT_LABELS = {
  alphabetical: 'A – Z',
  category: 'Category',
  complexity: 'Difficulty',
  cuisine: 'Cuisine',
}

const COMPLEXITY_LABELS = ['', 'Very Easy', 'Easy', 'Medium', 'Hard', 'Expert']

const HEALTH_SCORES = {
  'Soups & Rasam':      5,
  'Dals & Lentils':     5,
  'Chutneys & Raitas':  4,
  'Curries & Gravies':  3,
  'Breakfast & Tiffin': 3,
  'Rice & Pulao':       3,
  'Indo-Chinese':       2,
  'Snacks & Street Food': 2,
  'Breads':             2,
  'Sweets & Desserts':  1,
}

const HEALTH_META = [
  null,
  { label: 'Indulgent',     color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  { label: 'Less Healthy',  color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  { label: 'Moderate',      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { label: 'Healthy',       color: '#84cc16', bg: 'rgba(132,204,22,0.12)' },
  { label: 'Very Healthy',  color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
]

function getHealthScore(category) {
  return HEALTH_SCORES[category] ?? 3
}

function HealthBadge({ category, compact }) {
  const score = getHealthScore(category)
  const meta = HEALTH_META[score]
  if (compact) {
    return (
      <span className="health-dots">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className="health-dot"
            style={{ background: i < score ? meta.color : 'rgba(255,255,255,0.12)' }}
          />
        ))}
      </span>
    )
  }
  return (
    <span
      className="health-badge"
      style={{ color: meta.color, background: meta.bg, borderColor: meta.color + '44' }}
    >
      {meta.label}
    </span>
  )
}

function RecipeThumb({ imageUrl, name }) {
  const src = imageUrl || `https://source.unsplash.com/featured/?${encodeURIComponent(name + ' food dish')}`
  return (
    <img
      className="recipe-thumb"
      src={src}
      alt={name}
      onError={e => { e.currentTarget.style.display = 'none' }}
    />
  )
}

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

// ── Ingredient utilities ────────────────────────────────────────────────────

function extractAllIngredients(recipes) {
  const seen = new Map()
  for (const r of recipes) {
    for (const ing of (r.ingredients || [])) {
      if (ing.name) {
        const key = ing.name.toLowerCase()
        if (!seen.has(key)) seen.set(key, ing.name)
      }
    }
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b))
}

function computeMatches(recipes, selectedIngredients) {
  if (selectedIngredients.size === 0) return []
  const selected = new Set([...selectedIngredients].map(s => s.toLowerCase()))
  return recipes
    .map(r => {
      const ings = r.ingredients || []
      const names = ings.map(i => i.name).filter(Boolean)
      const matched = names.filter(n => selected.has(n.toLowerCase())).length
      const missingIngredients = names.filter(n => !selected.has(n.toLowerCase()))
      return { ...r, matched, missing: names.length - matched, total: names.length, missingIngredients }
    })
    .filter(r => r.matched > 0)
    .sort((a, b) => a.missing - b.missing || b.matched - a.matched)
}

// ── IngredientLanding ───────────────────────────────────────────────────────

function IngredientLanding({ recipes, selectedIngredients, onToggle, onSelectRecipe }) {
  const [search, setSearch] = useState('')
  const [showHidden, setShowHidden] = useState(false)
  const [hiddenIngredients, setHiddenIngredients] = useState(() => {
    try {
      const stored = localStorage.getItem('hidden-ingredients')
      return new Set(stored ? JSON.parse(stored) : [])
    } catch { return new Set() }
  })

  function hideIngredient(name) {
    setHiddenIngredients(prev => {
      const next = new Set(prev)
      next.add(name)
      localStorage.setItem('hidden-ingredients', JSON.stringify([...next]))
      return next
    })
  }

  function unhideIngredient(name) {
    setHiddenIngredients(prev => {
      const next = new Set(prev)
      next.delete(name)
      localStorage.setItem('hidden-ingredients', JSON.stringify([...next]))
      return next
    })
  }

  const allIngredients = useMemo(() => extractAllIngredients(recipes), [recipes])

  const visibleIngredients = useMemo(() => {
    const q = search.toLowerCase()
    return allIngredients.filter(
      i => !selectedIngredients.has(i) && !hiddenIngredients.has(i) && (!q || i.toLowerCase().includes(q))
    )
  }, [allIngredients, selectedIngredients, hiddenIngredients, search])

  const hiddenList = useMemo(
    () => [...hiddenIngredients]
      .filter(h => allIngredients.some(a => a.toLowerCase() === h.toLowerCase()))
      .sort((a, b) => a.localeCompare(b)),
    [hiddenIngredients, allIngredients]
  )

  const matches = useMemo(
    () => computeMatches(recipes, selectedIngredients),
    [recipes, selectedIngredients]
  )

  const recommendedRecipes = useMemo(
    () => matches.filter(r => r.missing === 0),
    [matches]
  )

  const otherMatchGroups = useMemo(() => {
    const groups = new Map()
    for (const r of matches) {
      if (r.missing === 0) continue
      if (!groups.has(r.missing)) groups.set(r.missing, [])
      groups.get(r.missing).push(r)
    }
    return [...groups.entries()].sort(([a], [b]) => a - b)
  }, [matches])

  const selectedList = useMemo(
    () => [...selectedIngredients].sort((a, b) => a.localeCompare(b)),
    [selectedIngredients]
  )

  return (
    <div className="ingredient-landing">
      {/* Left: ingredient picker */}
      <div className="picker-section">
        <div className="picker-header">
          <h2 className="picker-title">What's in your pantry?</h2>
          {selectedIngredients.size > 0 && (
            <span className="picker-count">{selectedIngredients.size} selected</span>
          )}
        </div>

        {selectedList.length > 0 && (
          <div className="selected-pills-row">
            {selectedList.map(name => (
              <button key={name} className="pill pill-selected" onClick={() => onToggle(name)}>
                {name} <span className="pill-remove">×</span>
              </button>
            ))}
          </div>
        )}

        <div className="ingredient-search-wrapper">
          <input
            className="ingredient-search-input"
            type="text"
            placeholder="Search ingredients…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="ingredient-search-clear" onClick={() => setSearch('')}>×</button>
          )}
        </div>

        <div className="all-pills-container">
          {visibleIngredients.map(name => (
            <div key={name} className="pill-wrapper">
              <button className="pill" onClick={() => onToggle(name)}>
                {name}
              </button>
              <button
                className="pill-hide-btn"
                onClick={() => hideIngredient(name)}
                title="Hide from list"
              >×</button>
            </div>
          ))}
          {visibleIngredients.length === 0 && search && (
            <p className="pills-empty">No ingredients match "{search}"</p>
          )}
          {visibleIngredients.length === 0 && !search && allIngredients.length > 0 && (
            <p className="pills-empty">All ingredients selected.</p>
          )}
        </div>

        {hiddenList.length > 0 && (
          <div className="hidden-ingredients-section">
            <button className="hidden-toggle-btn" onClick={() => setShowHidden(h => !h)}>
              {showHidden ? '▲' : '▼'} {hiddenList.length} hidden
            </button>
            {showHidden && (
              <div className="hidden-pills-container">
                {hiddenList.map(name => (
                  <div key={name} className="pill-wrapper">
                    <span className="pill pill-hidden">{name}</span>
                    <button
                      className="pill-unhide-btn"
                      onClick={() => unhideIngredient(name)}
                      title="Show again"
                    >↩</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: recipe matches */}
      {selectedIngredients.size > 0 ? (
        <div className="matches-section">
          <div className="matches-header">
            <span className="matches-title">Recipes you can cook</span>
            <span className="matches-count">{matches.length} recipes</span>
          </div>

          {matches.length === 0 ? (
            <p className="no-matches">No recipes match the selected ingredients.</p>
          ) : (
            <>
              {recommendedRecipes.length > 0 && (
                <div className="recommended-section">
                  <div className="recommended-header">
                    <span className="recommended-icon">★</span>
                    <span className="recommended-title">Recommended</span>
                    <span className="recommended-subtitle">Ready to cook — all ingredients available</span>
                    <span className="recommended-count">{recommendedRecipes.length}</span>
                  </div>
                  <div className="recommended-list">
                    {recommendedRecipes.map(r => (
                      <div
                        key={r.id}
                        className="recommended-recipe-card"
                        onClick={() => onSelectRecipe(r.id)}
                      >
                        <RecipeThumb imageUrl={r.imageUrl} name={r.name} />
                        <div className="match-recipe-info">
                          <span className="match-recipe-name">{r.name}</span>
                          <span className="match-recipe-meta">{r.category} · {r.cuisine}</span>
                          <HealthBadge category={r.category} />
                        </div>
                        <span className="recommended-ingredients-count">{r.matched}/{r.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {otherMatchGroups.map(([missing, recs]) => (
                <div key={missing} className="match-group">
                  <div className={`match-group-label missing-${Math.min(missing, 3)}`}>
                    {`Missing ${missing} ingredient${missing !== 1 ? 's' : ''}`}
                    <span className="match-group-count">{recs.length}</span>
                  </div>
                  <div className="match-recipe-list">
                    {recs.map(r => (
                      <div
                        key={r.id}
                        className="match-recipe-row"
                        onClick={() => onSelectRecipe(r.id)}
                      >
                        <RecipeThumb imageUrl={r.imageUrl} name={r.name} />
                        <div className="match-recipe-info">
                          <span className="match-recipe-name">{r.name}</span>
                          <div className="match-recipe-sub">
                            <span className="match-recipe-meta">{r.category} · {r.cuisine}</span>
                            <HealthBadge category={r.category} compact />
                          </div>
                          {r.missingIngredients.length > 0 && (
                            <div className="missing-ingredients-inline">
                              <span className="missing-inline-label">Need:</span>
                              {r.missingIngredients.map(ing => (
                                <span key={ing} className={`missing-inline-pill missing-inline-pill-${Math.min(missing, 3)}`}>{ing}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="match-recipe-score">
                          <div className="score-bar">
                            <div
                              className="score-fill"
                              style={{ width: `${(r.matched / r.total) * 100}%` }}
                            />
                          </div>
                          <span className="score-text">{r.matched}/{r.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="picker-hint">
          <div className="hint-icon">👨‍🍳</div>
          <p>Select ingredients to find recipes you can cook</p>
        </div>
      )}
    </div>
  )
}

// ── RecipeFormModal ─────────────────────────────────────────────────────────

const CATEGORIES = [
  'Breakfast & Tiffin', 'Breads', 'Chutneys & Raitas', 'Curries & Gravies',
  'Dals & Lentils', 'Indo-Chinese', 'Rice & Pulao', 'Snacks & Street Food',
  'Soups & Rasam', 'Sweets & Desserts',
]

const CUISINES = [
  'Andhra', 'Bengali', 'Chinese', 'Chettinad', 'Goan', 'Gujarati', 'Hyderabadi',
  'Indo-Chinese', 'Jain', 'Kannada', 'Kashmiri', 'Kerala', 'Maharashtrian',
  'North Indian', 'Punjabi', 'Rajasthani', 'South Indian', 'Tamil Nadu',
  'Telugu', 'Udupi', 'Vegan', 'Vegetarian',
]

function RecipeFormModal({ recipe, onClose, onSaved }) {
  const isEdit = !!recipe
  const dragIdx = useRef(null)
  const [dragOverIdx, setDragOverIdx] = useState(null)
  const [form, setForm] = useState({
    name: recipe?.name ?? '',
    category: recipe?.category ?? '',
    cuisine: recipe?.cuisine ?? '',
    servings: recipe?.servings ?? '',
    prepTime: recipe?.prepTime ?? '',
    cookTime: recipe?.cookTime ?? '',
    complexity: recipe?.complexity ?? 3,
    imageUrl: recipe?.imageUrl ?? '',
    ingredients: recipe ? (recipe.ingredients || []).map(i => ({ name: i.name || '', quantity: i.quantity || '' })) : [{ name: '', quantity: '' }],
    instructions: recipe ? JSON.parse(recipe.instructions || '[]') : [''],
  })

  const [createRecipe, { loading: creating }] = useMutation(CREATE_RECIPE, {
    refetchQueries: [{ query: GET_RECIPES }],
  })
  const [updateRecipe, { loading: updating }] = useMutation(UPDATE_RECIPE, {
    refetchQueries: [{ query: GET_RECIPES }, { query: GET_RECIPE, variables: { id: recipe?.id } }],
  })

  const saving = creating || updating

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }))
  }

  function setListItem(field, i, val) {
    setForm(f => { const arr = [...f[field]]; arr[i] = val; return { ...f, [field]: arr } })
  }

  function addListItem(field) {
    setForm(f => ({ ...f, [field]: [...f[field], ''] }))
  }

  function removeListItem(field, i) {
    setForm(f => ({ ...f, [field]: f[field].filter((_, idx) => idx !== i) }))
  }

  function setIngredientField(i, field, val) {
    setForm(f => {
      const arr = [...f.ingredients]
      arr[i] = { ...arr[i], [field]: val }
      return { ...f, ingredients: arr }
    })
  }

  function moveIngredient(from, to) {
    setForm(f => {
      const arr = [...f.ingredients]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return { ...f, ingredients: arr }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const vars = {
      name: form.name.trim(),
      category: form.category.trim(),
      cuisine: form.cuisine.trim(),
      ingredients: form.ingredients.filter(i => i.name.trim()).map(i => ({ name: i.name.trim(), quantity: i.quantity.trim() || null })),
      instructions: JSON.stringify(form.instructions.filter(s => s.trim())),
      servings: form.servings.trim() || null,
      prepTime: form.prepTime.trim() || null,
      cookTime: form.cookTime.trim() || null,
      complexity: parseInt(form.complexity, 10),
      imageUrl: form.imageUrl.trim() || null,
    }
    if (isEdit) {
      await updateRecipe({ variables: { id: recipe.id, ...vars } })
    } else {
      await createRecipe({ variables: vars })
    }
    onSaved?.()
    onClose()
  }

  return (
    <div className="modal-overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Recipe' : 'Add Recipe'}</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <form className="recipe-form" onSubmit={handleSubmit}>
          <div className="form-scroll">
            <div className="form-section-label">Basic Info</div>
            <div className="form-row">
              <div className="form-field form-field-wide">
                <label>Recipe Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="e.g. Chicken Tikka Masala"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Category *</label>
                <select required value={form.category} onChange={e => set('category', e.target.value)}>
                  <option value="">Select category…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Cuisine *</label>
                <select required value={form.cuisine} onChange={e => set('cuisine', e.target.value)}>
                  <option value="">Select cuisine…</option>
                  {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Servings</label>
                <input value={form.servings} onChange={e => set('servings', e.target.value)} placeholder="e.g. 4" />
              </div>
              <div className="form-field">
                <label>Prep Time</label>
                <input value={form.prepTime} onChange={e => set('prepTime', e.target.value)} placeholder="e.g. 20 mins" />
              </div>
              <div className="form-field">
                <label>Cook Time</label>
                <input value={form.cookTime} onChange={e => set('cookTime', e.target.value)} placeholder="e.g. 30 mins" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Difficulty (1–5)</label>
                <div className="complexity-picker">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      className={`complexity-star${form.complexity >= n ? ' on' : ''}`}
                      onClick={() => set('complexity', n)}
                      title={COMPLEXITY_LABELS[n]}
                    >★</button>
                  ))}
                  <span className="complexity-label-text">{COMPLEXITY_LABELS[form.complexity]}</span>
                </div>
              </div>
              <div className="form-field form-field-wide">
                <label>Image URL</label>
                <input value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://…" />
              </div>
            </div>

            <div className="form-section-label">
              Ingredients
              <span className="form-section-count">{form.ingredients.filter(i => i.name.trim()).length}</span>
            </div>
            <div className="dynamic-list">
              {form.ingredients.map((ing, i) => (
                <div
                  key={i}
                  className={`dynamic-list-row${dragOverIdx === i ? ' drag-over' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOverIdx(i) }}
                  onDragLeave={() => setDragOverIdx(null)}
                  onDrop={() => {
                    if (dragIdx.current !== null && dragIdx.current !== i) {
                      moveIngredient(dragIdx.current, i)
                    }
                    dragIdx.current = null
                    setDragOverIdx(null)
                  }}
                  onDragEnd={() => { dragIdx.current = null; setDragOverIdx(null) }}
                >
                  <span
                    className="drag-handle"
                    draggable
                    onDragStart={e => { e.stopPropagation(); dragIdx.current = i }}
                    title="Drag to reorder"
                  >⠿</span>
                  <span className="dynamic-list-index">{i + 1}</span>
                  <input
                    className="ingredient-qty-input"
                    value={ing.quantity}
                    onChange={e => setIngredientField(i, 'quantity', e.target.value)}
                    placeholder="Qty"
                  />
                  <input
                    value={ing.name}
                    onChange={e => setIngredientField(i, 'name', e.target.value)}
                    placeholder="Ingredient name"
                  />
                  <button
                    type="button"
                    className="dynamic-list-remove"
                    onClick={() => removeListItem('ingredients', i)}
                    disabled={form.ingredients.length === 1}
                  >×</button>
                </div>
              ))}
              <button type="button" className="dynamic-list-add" onClick={() => setForm(f => ({ ...f, ingredients: [...f.ingredients, { name: '', quantity: '' }] }))}>
                + Add Ingredient
              </button>
            </div>

            <div className="form-section-label">
              Instructions
              <span className="form-section-count">{form.instructions.filter(s => s.trim()).length} steps</span>
            </div>
            <div className="dynamic-list">
              {form.instructions.map((step, i) => (
                <div key={i} className="dynamic-list-row">
                  <span className="dynamic-list-index">{i + 1}</span>
                  <textarea
                    value={step}
                    onChange={e => setListItem('instructions', i, e.target.value)}
                    placeholder={`Step ${i + 1}…`}
                    rows={2}
                  />
                  <button
                    type="button"
                    className="dynamic-list-remove"
                    onClick={() => removeListItem('instructions', i)}
                    disabled={form.instructions.length === 1}
                  >×</button>
                </div>
              ))}
              <button type="button" className="dynamic-list-add" onClick={() => addListItem('instructions')}>
                + Add Step
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── RecipeImage / RecipeDetail ──────────────────────────────────────────────

function RecipeImage({ src, query, alt, className }) {
  const finalSrc = src || `https://source.unsplash.com/featured/?${encodeURIComponent(query)}`
  return (
    <img
      className={className}
      src={finalSrc}
      alt={alt}
      onError={e => {
        e.currentTarget.style.display = 'none'
        e.currentTarget.parentElement.classList.add('img-fallback')
      }}
    />
  )
}

function RecipeDetail({ id, onEdit, onDeleted }) {
  const { data, loading } = useQuery(GET_RECIPE, { variables: { id }, skip: !id })
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteRecipe, { loading: deleting }] = useMutation(DELETE_RECIPE, {
    refetchQueries: [{ query: GET_RECIPES }],
    onCompleted: onDeleted,
  })
  const [hiddenIngredients, setHiddenIngredients] = useState(new Set())
  const [showHiddenIngredients, setShowHiddenIngredients] = useState(false)

  useEffect(() => {
    setShowHiddenIngredients(false)
    try {
      const stored = localStorage.getItem(`hidden-recipe-ings-${id}`)
      setHiddenIngredients(new Set(stored ? JSON.parse(stored) : []))
    } catch {
      setHiddenIngredients(new Set())
    }
  }, [id])

  function hideIngredient(name) {
    setHiddenIngredients(prev => {
      const next = new Set(prev)
      next.add(name.toLowerCase())
      localStorage.setItem(`hidden-recipe-ings-${id}`, JSON.stringify([...next]))
      return next
    })
  }

  function unhideIngredient(name) {
    setHiddenIngredients(prev => {
      const next = new Set(prev)
      next.delete(name.toLowerCase())
      localStorage.setItem(`hidden-recipe-ings-${id}`, JSON.stringify([...next]))
      return next
    })
  }

  if (loading) return <div className="recipe-placeholder">Loading…</div>
  if (!data?.recipe) return <div className="recipe-placeholder">Recipe not found.</div>

  const r = data.recipe
  const ingredients = r.ingredients || []
  const instructions = JSON.parse(r.instructions || '[]')

  const mainQuery = `${r.name} food dish`
  const sideQuery1 = `${r.cuisine} cuisine cooking`
  const sideQuery2 = `${r.category} food plated`

  return (
    <div className="recipe-detail">
      <div className="recipe-hero">
        <div className="hero-main">
          <RecipeImage src={r.imageUrl} query={mainQuery} alt={r.name} className="hero-img" />
          <div className="hero-overlay">
            <div className="hero-actions">
              <button className="hero-action-btn" onClick={() => onEdit(r)}>Edit</button>
              {confirmDelete ? (
                <>
                  <span className="delete-confirm-text">Delete this recipe?</span>
                  <button
                    className="hero-action-btn hero-action-btn-danger"
                    onClick={() => deleteRecipe({ variables: { id: r.id } })}
                    disabled={deleting}
                  >{deleting ? 'Deleting…' : 'Yes, delete'}</button>
                  <button className="hero-action-btn" onClick={() => setConfirmDelete(false)}>Cancel</button>
                </>
              ) : (
                <button className="hero-action-btn hero-action-btn-danger" onClick={() => setConfirmDelete(true)}>Delete</button>
              )}
            </div>
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
          </div>
        </div>
        <div className="hero-side">
          <div className="hero-side-img">
            <RecipeImage query={sideQuery1} alt={r.cuisine} className="hero-img" />
          </div>
          <div className="hero-side-img">
            <RecipeImage query={sideQuery2} alt={r.category} className="hero-img" />
          </div>
        </div>
      </div>

      <div className="recipe-content-grid">
        <section className="recipe-section ingredients-section">
          <h3>
            <span className="section-icon">🧂</span> Ingredients
            <span className="count-badge">{ingredients.length}</span>
          </h3>
          {ingredients.length > 0 ? (
            <>
              <ul className="ingredients-list">
                {ingredients
                  .filter(ing => !hiddenIngredients.has(ing.name?.toLowerCase()))
                  .map((ing, i) => (
                    <li key={i} className="ingredient-row">
                      {ing.quantity && <span className="ingredient-qty">{ing.quantity}</span>}
                      <span className="ingredient-name-text">{ing.name}</span>
                      <button
                        className="ingredient-hide-btn"
                        onClick={() => hideIngredient(ing.name)}
                        title="Hide ingredient"
                      >—</button>
                    </li>
                  ))
                }
              </ul>
              {hiddenIngredients.size > 0 && (
                <div className="hidden-ingredients-section">
                  <button className="hidden-toggle-btn" onClick={() => setShowHiddenIngredients(h => !h)}>
                    {showHiddenIngredients ? '▲' : '▼'} {hiddenIngredients.size} hidden
                  </button>
                  {showHiddenIngredients && (
                    <ul className="ingredients-list hidden-ingredients-list">
                      {ingredients
                        .filter(ing => hiddenIngredients.has(ing.name?.toLowerCase()))
                        .map((ing, i) => (
                          <li key={i} className="ingredient-row ingredient-row-hidden">
                            {ing.quantity && <span className="ingredient-qty">{ing.quantity}</span>}
                            <span className="ingredient-name-text">{ing.name}</span>
                            <button
                              className="ingredient-unhide-btn"
                              onClick={() => unhideIngredient(ing.name)}
                              title="Show again"
                            >↩</button>
                          </li>
                        ))
                      }
                    </ul>
                  )}
                </div>
              )}
            </>
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
    </div>
  )
}

// ── Main Recipes page ───────────────────────────────────────────────────────

export default function Recipes() {
  const dispatch = useDispatch()
  const { selectedRecipeId, searchQuery, sortBy } = useSelector(s => s.recipes)
  const { data, loading } = useQuery(GET_RECIPES)
  const [showAC, setShowAC] = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState(new Set())
  const [formModal, setFormModal] = useState(null) // null | { recipe: Recipe|null }
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

  function toggleIngredient(name) {
    setSelectedIngredients(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  return (
    <div className="recipes-page">
      <header className="recipes-header">
        <Breadcrumb inline />
        {selectedRecipeId && (
          <button
            className="back-btn"
            onClick={() => dispatch(setSelectedRecipe(null))}
          >
            ← Pantry
          </button>
        )}
        <h1 className="recipes-title">Recipes</h1>
        <button className="add-recipe-btn" onClick={() => setFormModal({ recipe: null })}>+ Add Recipe</button>
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

        <main className="recipes-main">
          {selectedRecipeId ? (
            <RecipeDetail
              id={selectedRecipeId}
              onEdit={recipe => setFormModal({ recipe })}
              onDeleted={() => dispatch(setSelectedRecipe(null))}
            />
          ) : (
            <IngredientLanding
              recipes={allRecipes}
              selectedIngredients={selectedIngredients}
              onToggle={toggleIngredient}
              onSelectRecipe={id => dispatch(setSelectedRecipe(id))}
            />
          )}
        </main>
      </div>

      {formModal && (
        <RecipeFormModal
          recipe={formModal.recipe}
          onClose={() => setFormModal(null)}
          onSaved={() => {
            if (!formModal.recipe) dispatch(setSelectedRecipe(null))
          }}
        />
      )}
    </div>
  )
}
