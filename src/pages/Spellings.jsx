import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client/react'
import {
  GET_SPELLINGS, SEARCH_SPELLINGS, ADD_SPELLING,
  INCREMENT_SPELT_COUNT, DECREMENT_SPELT_COUNT,
  TOGGLE_REVISION, DELETE_SPELLING,
} from '../apollo/queries'
import Breadcrumb from '../components/Breadcrumb'
import { useNotify } from '../context/NotificationContext'
import './Spellings.css'

async function validateEnglishWord(word) {
  const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
  if (!res.ok) return null
  const data = await res.json()
  const meaning = data?.[0]?.meanings?.[0]
  const def = meaning?.definitions?.[0]?.definition
  return def || null
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

function BookmarkIcon({ filled }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 2H11V12L7 9.5L3 12V2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill={filled ? 'currentColor' : 'none'}
      />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
      <line x1="7" y1="6.5" x2="7" y2="10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="7" cy="4.5" r="0.7" fill="currentColor"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="2" y1="4" x2="12" y2="4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M5 4V3H9V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 4L3.5 11H10.5L11 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="5.5" y1="6.5" x2="5.5" y2="9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="8.5" y1="6.5" x2="8.5" y2="9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

// Fetches related-meaning + word-family suggestions from Datamuse
function WordSuggestions({ word, existingWords, onAdd }) {
  const [rawRelated, setRawRelated] = useState([])
  const [rawExtensions, setRawExtensions] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingWord, setAddingWord] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const feedbackTimer = useRef(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setRawRelated([])
    setRawExtensions([])

    const encoded = encodeURIComponent(word)
    Promise.all([
      fetch(`https://api.datamuse.com/words?ml=${encoded}&max=14`).then(r => r.json()),
      fetch(`https://api.datamuse.com/words?sp=${encoded}*&max=14`).then(r => r.json()),
    ]).then(([relData, extData]) => {
      if (cancelled) return
      const wl = word.toLowerCase()
      setRawRelated(relData.map(w => w.word).filter(w => w.toLowerCase() !== wl))
      setRawExtensions(
        extData.map(w => w.word).filter(w => {
          const l = w.toLowerCase()
          return l !== wl && l.startsWith(wl)
        })
      )
      setLoading(false)
    }).catch(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [word])

  useEffect(() => () => clearTimeout(feedbackTimer.current), [])

  // Filter at render time — newly added words vanish from pills immediately
  const existingSet = new Set(existingWords.map(w => w.toLowerCase()))
  const related    = rawRelated.filter(w => !existingSet.has(w.toLowerCase())).slice(0, 6)
  const extensions = rawExtensions.filter(w => !existingSet.has(w.toLowerCase())).slice(0, 6)

  async function handleAdd(e, w) {
    e.stopPropagation()
    setAddingWord(w)
    clearTimeout(feedbackTimer.current)
    setFeedback(null)
    const result = await onAdd(w)
    setAddingWord(null)
    setFeedback(result)
    feedbackTimer.current = setTimeout(() => setFeedback(null), 3000)
  }

  if (loading) return <p className="sugg-loading">Finding suggestions…</p>
  if (related.length === 0 && extensions.length === 0) return null

  return (
    <div className="sugg-section">
      <span className="sugg-label">Suggested to learn next</span>
      {feedback && (
        <p className={`sugg-feedback ${feedback.ok ? 'sugg-ok' : 'sugg-err'}`}>
          {feedback.ok ? `"${feedback.word}" added!` : feedback.msg}
        </p>
      )}
      {related.length > 0 && (
        <div className="sugg-group">
          <span className="sugg-group-label">Similar meaning</span>
          <div className="sugg-pills">
            {related.map(w => (
              <button
                key={w}
                className="sugg-pill"
                onClick={e => handleAdd(e, w)}
                disabled={!!addingWord}
                title="Click to add to your list"
              >
                {addingWord === w ? '…' : w}
              </button>
            ))}
          </div>
        </div>
      )}
      {extensions.length > 0 && (
        <div className="sugg-group">
          <span className="sugg-group-label">Word extensions</span>
          <div className="sugg-pills">
            {extensions.map(w => (
              <button
                key={w}
                className="sugg-pill sugg-pill--ext"
                onClick={e => handleAdd(e, w)}
                disabled={!!addingWord}
                title="Click to add to your list"
              >
                {addingWord === w ? '…' : w}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Shared word action row used in both the autocomplete and the main list
function WordActions({ spelling, onIncrement, onDecrement, onRevision, onMeaning, onDelete, expandedMeaning, confirmingDelete }) {
  return (
    <div className="autocomplete-actions">
      <div className="spell-counter">
        <button
          className="ac-btn ac-minus"
          onClick={e => onDecrement(e, spelling.id)}
          disabled={spelling.speltCount === 0}
          title="Reduce spelt count"
        >
          <MinusIcon />
        </button>
        <span className="spell-count">{spelling.speltCount}</span>
        <button
          className="ac-btn ac-plus"
          onClick={e => onIncrement(e, spelling.id)}
          title="Mark as spelt"
        >
          <PlusIcon />
        </button>
      </div>
      <button
        className={`ac-btn ac-revision${spelling.needsRevision ? ' active' : ''}`}
        onClick={e => onRevision(e, spelling.id)}
        title={spelling.needsRevision ? 'Remove from revision' : 'Mark for revision'}
      >
        <BookmarkIcon filled={spelling.needsRevision} />
      </button>
      <button
        className={`ac-btn ac-meaning${expandedMeaning === spelling.id ? ' active' : ''}`}
        onClick={e => onMeaning(e, spelling.id)}
        title="Show meaning"
      >
        <InfoIcon />
      </button>
      <button
        className={`ac-btn ac-delete${confirmingDelete === spelling.id ? ' confirming' : ''}`}
        onClick={e => onDelete(e, spelling.id)}
        title={confirmingDelete === spelling.id ? 'Click again to confirm delete' : 'Delete word'}
      >
        <TrashIcon />
      </button>
    </div>
  )
}

export default function Spellings() {
  const { profileId } = useParams()
  const notify = useNotify()

  const [searchInput, setSearchInput] = useState('')
  const [addInput, setAddInput] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [expandedACMeaning, setExpandedACMeaning] = useState(null)
  const [expandedListMeaning, setExpandedListMeaning] = useState(null)
  const [confirmingDelete, setConfirmingDelete] = useState(null)
  const searchContainerRef = useRef(null)
  const confirmTimeoutRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowAutocomplete(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => () => clearTimeout(confirmTimeoutRef.current), [])

  const { data: allData, loading: allLoading } = useQuery(GET_SPELLINGS, {
    variables: { profileId },
    skip: !profileId,
  })
  const { data: searchData, loading: searchLoading } = useQuery(SEARCH_SPELLINGS, {
    variables: { profileId, query: searchInput },
    skip: searchInput.trim().length === 0 || !profileId,
  })

  const [addSpelling] = useMutation(ADD_SPELLING)
  const [incrementSpeltCount] = useMutation(INCREMENT_SPELT_COUNT)
  const [decrementSpeltCount] = useMutation(DECREMENT_SPELT_COUNT)
  const [toggleRevision] = useMutation(TOGGLE_REVISION)
  const [deleteSpelling] = useMutation(DELETE_SPELLING)

  const [activeFilter, setActiveFilter] = useState('all')

  const autocompleteWords = searchInput.trim().length > 0 ? (searchData?.searchSpellings ?? []) : []
  const baseWords = searchInput.trim().length > 0
    ? (searchData?.searchSpellings ?? [])
    : (allData?.spellings ?? [])
  const displayedWords = activeFilter === 'revision'
    ? baseWords.filter(w => w.needsRevision)
    : baseWords
  const loading = searchInput.trim().length > 0 ? searchLoading : allLoading

  const revisionCount = (allData?.spellings ?? []).filter(w => w.needsRevision).length

  function getRefetchQueries() {
    return [
      { query: GET_SPELLINGS, variables: { profileId } },
      ...(searchInput.trim() ? [{ query: SEARCH_SPELLINGS, variables: { profileId, query: searchInput } }] : []),
    ]
  }

  async function handleAdd(e) {
    e.preventDefault()
    const word = addInput.trim().toLowerCase()
    if (!word) return

    const alreadyExists = allData?.spellings?.some(s => s.word === word)
    if (alreadyExists) {
      notify.error(`"${word}" has already been added.`)
      return
    }

    setIsAdding(true)

    const definition = await validateEnglishWord(word)
    if (definition === null) {
      notify.error(`"${word}" was not found in the English dictionary.`)
      setIsAdding(false)
      return
    }

    try {
      await addSpelling({ variables: { profileId, word, definition }, refetchQueries: getRefetchQueries() })
      notify.success(`"${word}" added successfully.`)
      setAddInput('')
    } catch (err) {
      if (err.message?.includes('Unique constraint')) {
        notify.error(`"${word}" has already been added.`)
      } else {
        notify.error('Failed to add word. Please try again.')
      }
    } finally {
      setIsAdding(false)
    }
  }

  async function handleIncrement(e, id) {
    e.stopPropagation()
    await incrementSpeltCount({ variables: { id }, refetchQueries: getRefetchQueries() })
  }

  async function handleDecrement(e, id) {
    e.stopPropagation()
    await decrementSpeltCount({ variables: { id }, refetchQueries: getRefetchQueries() })
  }

  async function handleToggleRevision(e, id) {
    e.stopPropagation()
    await toggleRevision({ variables: { id }, refetchQueries: getRefetchQueries() })
  }

  function handleToggleACMeaning(e, id) {
    e.stopPropagation()
    setExpandedACMeaning(expandedACMeaning === id ? null : id)
  }

  function handleToggleListMeaning(e, id) {
    e.stopPropagation()
    setExpandedListMeaning(expandedListMeaning === id ? null : id)
  }

  function handleDeleteClick(e, id) {
    e.stopPropagation()
    if (confirmingDelete === id) {
      clearTimeout(confirmTimeoutRef.current)
      setConfirmingDelete(null)
      deleteSpelling({ variables: { id }, refetchQueries: getRefetchQueries() })
    } else {
      setConfirmingDelete(id)
      clearTimeout(confirmTimeoutRef.current)
      confirmTimeoutRef.current = setTimeout(() => setConfirmingDelete(null), 2000)
    }
  }

  async function handleAddSuggestion(word) {
    const wordLower = word.toLowerCase()
    if (allData?.spellings?.some(s => s.word === wordLower)) {
      return { ok: false, msg: `"${wordLower}" is already in your list.`, word: wordLower }
    }
    const definition = await validateEnglishWord(wordLower)
    if (definition === null) {
      return { ok: false, msg: `"${wordLower}" not found in the dictionary.`, word: wordLower }
    }
    try {
      await addSpelling({
        variables: { profileId, word: wordLower, definition },
        refetchQueries: getRefetchQueries(),
      })
      return { ok: true, word: wordLower }
    } catch {
      return { ok: false, msg: 'Failed to add word.', word: wordLower }
    }
  }

  return (
    <div className="spellings">
      <Breadcrumb />
      <h1>Spellings</h1>
      <p>Search your word list or add new English words.</p>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          className="add-input"
          type="text"
          placeholder="Add a word..."
          value={addInput}
          onChange={e => setAddInput(e.target.value)}
          disabled={isAdding}
        />
        <button className="add-btn" type="submit" disabled={isAdding || !addInput.trim()}>
          {isAdding ? 'Checking...' : 'Add'}
        </button>
      </form>

      <div className="search-container" ref={searchContainerRef}>
        <div className="search-bar">
          <input
            className="search-input"
            type="text"
            placeholder="Search words..."
            value={searchInput}
            onChange={e => {
              setSearchInput(e.target.value)
              setShowAutocomplete(true)
              setExpandedACMeaning(null)
              setConfirmingDelete(null)
            }}
            onFocus={() => searchInput.trim() && setShowAutocomplete(true)}
          />
          {searchInput && (
            <button className="clear-btn" onClick={() => {
              setSearchInput('')
              setShowAutocomplete(false)
              setExpandedACMeaning(null)
              setConfirmingDelete(null)
            }}>✕</button>
          )}
        </div>

        {showAutocomplete && searchInput.trim() && (
          <div className="autocomplete-dropdown">
            {searchLoading ? (
              <p className="autocomplete-msg">Loading...</p>
            ) : autocompleteWords.length === 0 ? (
              <p className="autocomplete-msg">No matches found.</p>
            ) : (
              autocompleteWords.map(spelling => (
                <div key={spelling.id} className="autocomplete-item">
                  <div className="autocomplete-item-row">
                    <span className="autocomplete-word">{spelling.word}</span>
                    <WordActions
                      spelling={spelling}
                      onIncrement={handleIncrement}
                      onDecrement={handleDecrement}
                      onRevision={handleToggleRevision}
                      onMeaning={handleToggleACMeaning}
                      onDelete={handleDeleteClick}
                      expandedMeaning={expandedACMeaning}
                      confirmingDelete={confirmingDelete}
                    />
                  </div>
                  {expandedACMeaning === spelling.id && (
                    <>
                      <p className="autocomplete-definition">
                        {spelling.definition || 'No definition available.'}
                      </p>
                      <WordSuggestions
                        word={spelling.word}
                        existingWords={(allData?.spellings ?? []).map(s => s.word)}
                        onAdd={handleAddSuggestion}
                      />
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="filter-bar">
        <button
          className={`filter-pill${activeFilter === 'all' ? ' filter-pill--active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-pill filter-pill--revision${activeFilter === 'revision' ? ' filter-pill--active' : ''}`}
          onClick={() => setActiveFilter('revision')}
        >
          <BookmarkIcon filled={activeFilter === 'revision'} />
          Needs Revision
          {revisionCount > 0 && (
            <span className="filter-count">{revisionCount}</span>
          )}
        </button>
      </div>

      <div className="words-section">
        {loading ? (
          <p className="empty-msg">Loading...</p>
        ) : displayedWords.length === 0 ? (
          <p className="empty-msg">
            {activeFilter === 'revision'
              ? (searchInput.trim()
                  ? `No revision words match "${searchInput}".`
                  : 'No words marked for revision yet. Use the bookmark icon on any word to flag it.')
              : (searchInput.trim()
                  ? `No words found matching "${searchInput}".`
                  : 'No words added yet. Add your first word above.')}
          </p>
        ) : (
          <ul className="word-list">
            {displayedWords.map(spelling => (
              <li key={spelling.id} className={`word-item${spelling.needsRevision ? ' word-item--revision' : ''}`}>
                <div className="word-row">
                  <span className="word-text">{spelling.word}</span>
                  <WordActions
                    spelling={spelling}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    onRevision={handleToggleRevision}
                    onMeaning={handleToggleListMeaning}
                    onDelete={handleDeleteClick}
                    expandedMeaning={expandedListMeaning}
                    confirmingDelete={confirmingDelete}
                  />
                </div>
                {expandedListMeaning === spelling.id && (
                  <>
                    {spelling.definition && (
                      <p className="word-definition">{spelling.definition}</p>
                    )}
                    <WordSuggestions
                      word={spelling.word}
                      existingWords={(allData?.spellings ?? []).map(s => s.word)}
                      onAdd={handleAddSuggestion}
                    />
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
