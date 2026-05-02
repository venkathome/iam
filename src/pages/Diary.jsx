import { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Diary.css'

// ─── Event-type storage ───────────────────────────────────────────────────────

const ET_KEY = 'iam-diary-event-types'

const DEFAULT_EVENT_TYPES = [
  { id: 'personal',    name: 'Personal',    color: '#7c6fe0' },
  { id: 'family',      name: 'Family',      color: '#22c55e' },
  { id: 'work',        name: 'Work',        color: '#3b82f6' },
  { id: 'travel',      name: 'Travel',      color: '#f97316' },
  { id: 'achievement', name: 'Achievement', color: '#eab308' },
  { id: 'celebration', name: 'Celebration', color: '#ec4899' },
  { id: 'health',      name: 'Health',      color: '#10b981' },
  { id: 'memory',      name: 'Memory',      color: '#a855f7' },
  { id: 'milestone',   name: 'Milestone',   color: '#f59e0b' },
  { id: 'other',       name: 'Other',       color: '#94a3b8' },
]

const COLOR_PALETTE = [
  '#7c6fe0','#646cff','#3b82f6','#06b6d4','#10b981','#22c55e',
  '#84cc16','#eab308','#f97316','#ef4444','#ec4899','#a855f7',
  '#8b5cf6','#f59e0b','#14b8a6','#94a3b8',
]

function loadEventTypes() {
  try {
    const v = JSON.parse(localStorage.getItem(ET_KEY))
    return Array.isArray(v) && v.length ? v : DEFAULT_EVENT_TYPES
  } catch { return DEFAULT_EVENT_TYPES }
}
function saveEventTypes(v) { localStorage.setItem(ET_KEY, JSON.stringify(v)) }

function etUid() { return Date.now().toString(36) + Math.random().toString(36).slice(2) }

// ─── Other constants ──────────────────────────────────────────────────────────

const MOODS = [
  { label: 'Happy',     emoji: '😊' }, { label: 'Excited',   emoji: '🤩' },
  { label: 'Grateful',  emoji: '🙏' }, { label: 'Content',   emoji: '😌' },
  { label: 'Neutral',   emoji: '😐' }, { label: 'Anxious',   emoji: '😰' },
  { label: 'Sad',       emoji: '😔' }, { label: 'Emotional', emoji: '😢' },
  { label: 'Angry',     emoji: '😤' },
]

const GROUP_OPTIONS = [
  { value: 'month',     label: 'Month & Year' },
  { value: 'eventType', label: 'Event Type' },
  { value: 'mood',      label: 'Mood' },
  { value: 'person',    label: 'Person' },
  { value: 'tag',       label: 'Tag' },
  { value: 'location',  label: 'Location' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'az',     label: 'A → Z' },
  { value: 'za',     label: 'Z → A' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2) }
function todayStr() { return new Date().toISOString().slice(0, 10) }

function loadEntries() {
  try { return JSON.parse(localStorage.getItem('iam-diary') || '[]') } catch { return [] }
}
function saveEntries(entries) { localStorage.setItem('iam-diary', JSON.stringify(entries)) }

function fmtDate(str) {
  if (!str) return ''
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

function fmtMonthYear(str) {
  if (!str) return ''
  const [y, m] = str.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function moodEmoji(label) { return MOODS.find(m => m.label === label)?.emoji ?? '😐' }

function excerpt(text, n = 140) {
  if (!text) return ''
  return text.length > n ? text.slice(0, n) + '…' : text
}

function parseTags(val) {
  if (Array.isArray(val)) return val.filter(Boolean)
  if (!val) return []
  return val.split(',').map(s => s.trim()).filter(Boolean)
}

function groupEntries(entries, groupBy) {
  const map = new Map()
  function add(key, entry) {
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(entry)
  }
  for (const e of entries) {
    switch (groupBy) {
      case 'month':     add(fmtMonthYear(e.date), e); break
      case 'eventType': add(e.eventType || 'Other', e); break
      case 'mood':      add(`${moodEmoji(e.mood || 'Neutral')} ${e.mood || 'Neutral'}`, e); break
      case 'person': {
        const people = parseTags(e.people)
        people.length ? people.forEach(p => add(p, e)) : add('Unspecified', e); break
      }
      case 'tag': {
        const tags = parseTags(e.tags)
        tags.length ? tags.forEach(t => add(`# ${t}`, e)) : add('Untagged', e); break
      }
      case 'location': add(e.location || 'Unknown location', e); break
    }
  }
  return map
}

// ─── ColorPicker ─────────────────────────────────────────────────────────────

function ColorPicker({ value, onChange }) {
  return (
    <div className="et-color-picker">
      {COLOR_PALETTE.map(c => (
        <button
          key={c} type="button"
          className={`et-color-swatch${value === c ? ' et-color-swatch--on' : ''}`}
          style={{ background: c }}
          onClick={() => onChange(c)}
          title={c}
        />
      ))}
    </div>
  )
}

// ─── EventTypesModal ──────────────────────────────────────────────────────────

function EventTypesModal({ eventTypes, onAdd, onEdit, onDelete, onClose }) {
  const [editingId,  setEditingId]  = useState(null)
  const [editName,   setEditName]   = useState('')
  const [editColor,  setEditColor]  = useState(COLOR_PALETTE[0])
  const [newName,    setNewName]    = useState('')
  const [newColor,   setNewColor]   = useState(COLOR_PALETTE[0])
  const [confirmDel, setConfirmDel] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  function startEdit(et) {
    setEditingId(et.id)
    setEditName(et.name)
    setEditColor(et.color)
    setConfirmDel(null)
  }

  function saveEdit(id) {
    const trimmed = editName.trim()
    if (!trimmed) return
    onEdit(id, trimmed, editColor)
    setEditingId(null)
  }

  function cancelEdit() { setEditingId(null) }

  function handleDelete(id) {
    if (confirmDel === id) {
      clearTimeout(timerRef.current)
      setConfirmDel(null)
      onDelete(id)
    } else {
      setConfirmDel(id)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setConfirmDel(null), 2500)
    }
  }

  function handleAdd(e) {
    e.preventDefault()
    const trimmed = newName.trim()
    if (!trimmed) return
    onAdd(trimmed, newColor)
    setNewName('')
    setNewColor(COLOR_PALETTE[0])
  }

  return (
    <div className="et-overlay" onClick={onClose}>
      <div className="et-modal" onClick={e => e.stopPropagation()}>
        <div className="et-modal-header">
          <h2>Manage Event Types</h2>
          <button className="et-close" onClick={onClose}>✕</button>
        </div>

        <div className="et-list">
          {eventTypes.map(et => (
            <div key={et.id} className="et-row">
              {editingId === et.id ? (
                <div className="et-edit-form">
                  <div className="et-edit-top">
                    <span className="et-swatch" style={{ background: editColor }} />
                    <input
                      className="et-name-input"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveEdit(et.id); if (e.key === 'Escape') cancelEdit() }}
                      autoFocus
                    />
                    <button className="et-btn et-btn-save"  onClick={() => saveEdit(et.id)}>Save</button>
                    <button className="et-btn et-btn-cancel" onClick={cancelEdit}>Cancel</button>
                  </div>
                  <ColorPicker value={editColor} onChange={setEditColor} />
                </div>
              ) : (
                <>
                  <span className="et-swatch" style={{ background: et.color }} />
                  <span className="et-name">{et.name}</span>
                  <div className="et-row-actions">
                    <button className="et-btn et-btn-edit" onClick={() => startEdit(et)} title="Edit">✎</button>
                    <button
                      className={`et-btn et-btn-del${confirmDel === et.id ? ' confirming' : ''}`}
                      onClick={() => handleDelete(et.id)}
                      title={confirmDel === et.id ? 'Click again to confirm' : 'Delete'}
                    >
                      {confirmDel === et.id ? '✓ Confirm' : '🗑'}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <form className="et-add-form" onSubmit={handleAdd}>
          <div className="et-add-top">
            <span className="et-swatch" style={{ background: newColor }} />
            <input
              className="et-name-input"
              placeholder="New event type name…"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
            <button className="et-btn et-btn-add" type="submit" disabled={!newName.trim()}>
              + Add
            </button>
          </div>
          <ColorPicker value={newColor} onChange={setNewColor} />
        </form>
      </div>
    </div>
  )
}

// ─── StatsBar ─────────────────────────────────────────────────────────────────

function StatsBar({ entries }) {
  const thisMonth = useMemo(() => {
    const prefix = todayStr().slice(0, 7)
    return entries.filter(e => (e.date || '').startsWith(prefix)).length
  }, [entries])

  const favorites = entries.filter(e => e.isFavorite).length

  const topMood = useMemo(() => {
    const counts = {}
    entries.forEach(e => { if (e.mood) counts[e.mood] = (counts[e.mood] || 0) + 1 })
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return top ? top[0] : null
  }, [entries])

  const streak = useMemo(() => {
    if (!entries.length) return 0
    const dates = [...new Set(entries.map(e => e.date))].sort().reverse()
    let s = 0, cursor = new Date()
    cursor.setHours(0, 0, 0, 0)
    for (const d of dates) {
      const entryDate = new Date(d + 'T00:00:00')
      const diff = Math.round((cursor - entryDate) / 86400000)
      if (diff === 0 || diff === 1) { s++; cursor = entryDate } else break
    }
    return s
  }, [entries])

  return (
    <div className="diary-stats">
      <div className="diary-stat"><span className="diary-stat-val">{entries.length}</span><span className="diary-stat-lbl">Total Entries</span></div>
      <div className="diary-stat"><span className="diary-stat-val">{thisMonth}</span><span className="diary-stat-lbl">This Month</span></div>
      <div className="diary-stat"><span className="diary-stat-val">{favorites}</span><span className="diary-stat-lbl">Favourites</span></div>
      <div className="diary-stat"><span className="diary-stat-val">{streak}</span><span className="diary-stat-lbl">Day Streak</span></div>
      {topMood && <div className="diary-stat"><span className="diary-stat-val">{moodEmoji(topMood)}</span><span className="diary-stat-lbl">Top Mood</span></div>}
    </div>
  )
}

// ─── EntryForm ────────────────────────────────────────────────────────────────

const BLANK = {
  title: '', content: '', date: todayStr(), time: '',
  eventType: 'Personal', mood: 'Neutral',
  people: '', location: '', tags: '', isFavorite: false,
}

function EntryForm({ initial, onSave, onCancel, eventTypes }) {
  const [form, setForm] = useState(() => ({
    ...BLANK,
    ...(initial ?? {}),
    people: Array.isArray(initial?.people) ? initial.people.join(', ') : (initial?.people ?? ''),
    tags:   Array.isArray(initial?.tags)   ? initial.tags.join(', ')   : (initial?.tags   ?? ''),
  }))

  function set(field, value) { setForm(f => ({ ...f, [field]: value })) }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave({
      ...form,
      title:    form.title.trim(),
      content:  form.content.trim(),
      location: form.location.trim(),
      people:   parseTags(form.people),
      tags:     parseTags(form.tags),
    })
  }

  const typeNames = eventTypes.map(t => t.name)
  const colorMap  = Object.fromEntries(eventTypes.map(t => [t.name, t.color]))

  return (
    <div className="diary-overlay" onClick={onCancel}>
      <div className="diary-form" onClick={e => e.stopPropagation()}>
        <div className="diary-form-header">
          <h2>{initial ? 'Edit Entry' : '✍️ New Entry'}</h2>
          <button className="diary-form-close" onClick={onCancel} type="button">✕</button>
        </div>

        <form className="diary-form-body" onSubmit={handleSubmit}>

          <div className="df-field">
            <label className="df-label">Title *</label>
            <input className="df-input" type="text" placeholder="What's this entry about?"
              value={form.title} onChange={e => set('title', e.target.value)} required autoFocus />
          </div>

          <div className="df-row">
            <div className="df-field">
              <label className="df-label">Date *</label>
              <input className="df-input" type="date" value={form.date}
                onChange={e => set('date', e.target.value)} required />
            </div>
            <div className="df-field df-field-sm">
              <label className="df-label">Time</label>
              <input className="df-input" type="time" value={form.time}
                onChange={e => set('time', e.target.value)} />
            </div>
          </div>

          <div className="df-row">
            <div className="df-field">
              <label className="df-label">Event Type</label>
              <select className="df-input" value={form.eventType}
                onChange={e => set('eventType', e.target.value)}
                style={{ borderLeftColor: colorMap[form.eventType] || '#ccc', borderLeftWidth: 3 }}>
                {typeNames.map(t => <option key={t}>{t}</option>)}
                {form.eventType && !typeNames.includes(form.eventType) && (
                  <option value={form.eventType}>{form.eventType}</option>
                )}
              </select>
            </div>
            <div className="df-field">
              <label className="df-label">Location</label>
              <input className="df-input" type="text" placeholder="Where?"
                value={form.location} onChange={e => set('location', e.target.value)} />
            </div>
          </div>

          <div className="df-field">
            <label className="df-label">How are you feeling?</label>
            <div className="df-moods">
              {MOODS.map(m => (
                <button key={m.label} type="button"
                  className={`df-mood${form.mood === m.label ? ' df-mood--on' : ''}`}
                  onClick={() => set('mood', m.label)} title={m.label}>
                  <span className="df-mood-emoji">{m.emoji}</span>
                  <span className="df-mood-lbl">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="df-field df-field-grow">
            <label className="df-label">Your thoughts…</label>
            <textarea className="df-textarea"
              placeholder="What happened? How did you feel? What do you want to remember?"
              value={form.content} onChange={e => set('content', e.target.value)} rows={8} />
          </div>

          <div className="df-row">
            <div className="df-field">
              <label className="df-label">People</label>
              <input className="df-input" type="text" placeholder="Alice, Bob, …"
                value={form.people} onChange={e => set('people', e.target.value)} />
            </div>
            <div className="df-field">
              <label className="df-label">Tags</label>
              <input className="df-input" type="text" placeholder="vacation, milestone, …"
                value={form.tags} onChange={e => set('tags', e.target.value)} />
            </div>
          </div>

          <label className="df-fav-row">
            <input type="checkbox" checked={form.isFavorite}
              onChange={e => set('isFavorite', e.target.checked)} />
            <span>{form.isFavorite ? '★' : '☆'} Mark as favourite</span>
          </label>

          <div className="df-actions">
            <button type="button" className="df-btn df-btn-cancel" onClick={onCancel}>Cancel</button>
            <button type="submit" className="df-btn df-btn-save">
              {initial ? 'Save Changes' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── EntryCard ────────────────────────────────────────────────────────────────

function EntryCard({ entry, colorMap, onEdit, onDelete, onToggleFav }) {
  const [expanded, setExpanded] = useState(false)
  const people = parseTags(entry.people)
  const tags   = parseTags(entry.tags)
  const color  = colorMap[entry.eventType] || '#94a3b8'

  return (
    <div className={`diary-card${expanded ? ' diary-card--open' : ''}`} style={{ '--accent': color }}>
      <div className="diary-card-top" onClick={() => setExpanded(v => !v)}>
        <div className="diary-card-meta">
          <span className="diary-card-date">{fmtDate(entry.date)}{entry.time ? ` · ${entry.time}` : ''}</span>
          <span className="diary-card-type" style={{ background: color + '22', color }}>{entry.eventType}</span>
          <span className="diary-card-mood" title={entry.mood}>{moodEmoji(entry.mood)}</span>
        </div>
        <div className="diary-card-titlerow">
          <h3 className="diary-card-title">{entry.title}</h3>
          <button
            className={`diary-fav${entry.isFavorite ? ' diary-fav--on' : ''}`}
            onClick={e => { e.stopPropagation(); onToggleFav(entry.id) }}
            title={entry.isFavorite ? 'Remove favourite' : 'Add to favourites'}
          >{entry.isFavorite ? '★' : '☆'}</button>
        </div>
        {!expanded && entry.content && <p className="diary-card-excerpt">{excerpt(entry.content)}</p>}
        {(entry.location || people.length > 0 || tags.length > 0) && (
          <div className="diary-card-chips">
            {entry.location && <span className="chip chip-loc">📍 {entry.location}</span>}
            {people.map(p => <span key={p} className="chip chip-person">👤 {p}</span>)}
            {tags.map(t => <span key={t} className="chip chip-tag"># {t}</span>)}
          </div>
        )}
      </div>
      {expanded && (
        <div className="diary-card-body">
          {entry.content
            ? <div className="diary-card-content">{entry.content}</div>
            : <div className="diary-card-empty-content">No content written.</div>}
          <div className="diary-card-footer">
            <span className="diary-card-ts">
              Added {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {entry.updatedAt !== entry.createdAt && ' · edited'}
            </span>
            <div className="diary-card-actions">
              <button className="diary-act-btn" onClick={e => { e.stopPropagation(); onEdit(entry) }}>✎ Edit</button>
              <button className="diary-act-btn diary-act-btn--del"
                onClick={e => { e.stopPropagation(); if (window.confirm('Delete this entry?')) onDelete(entry.id) }}>
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Diary (main) ─────────────────────────────────────────────────────────────

export default function Diary() {
  const [entries,         setEntries]         = useState(loadEntries)
  const [eventTypes,      setEventTypes]      = useState(loadEventTypes)
  const [showForm,        setShowForm]        = useState(false)
  const [editing,         setEditing]         = useState(null)
  const [showManageTypes, setShowManageTypes] = useState(false)
  const [groupBy,         setGroupBy]         = useState('month')
  const [sortOrder,       setSortOrder]       = useState('newest')
  const [search,          setSearch]          = useState('')
  const [filterType,      setFilterType]      = useState('')
  const [filterMood,      setFilterMood]      = useState('')
  const [filterFavs,      setFilterFavs]      = useState(false)

  useEffect(() => saveEntries(entries), [entries])
  useEffect(() => saveEventTypes(eventTypes), [eventTypes])

  // Clear filterType if the type was deleted
  useEffect(() => {
    if (filterType && !eventTypes.find(t => t.name === filterType)) setFilterType('')
  }, [eventTypes, filterType])

  const typeNames = eventTypes.map(t => t.name)
  const colorMap  = Object.fromEntries(eventTypes.map(t => [t.name, t.color]))

  // ── Event type CRUD ────────────────────────────────────────────────────────

  function addEventType(name, color) {
    if (eventTypes.find(t => t.name.toLowerCase() === name.toLowerCase())) return
    setEventTypes(prev => [...prev, { id: etUid(), name, color }])
  }

  function editEventType(id, newName, newColor) {
    const old = eventTypes.find(t => t.id === id)
    if (!old) return
    setEventTypes(prev => prev.map(t => t.id === id ? { ...t, name: newName, color: newColor } : t))
    if (old.name !== newName) {
      setEntries(prev => prev.map(e => e.eventType === old.name ? { ...e, eventType: newName } : e))
      if (filterType === old.name) setFilterType(newName)
    }
  }

  function deleteEventType(id) {
    setEventTypes(prev => prev.filter(t => t.id !== id))
  }

  // ── Entry CRUD ─────────────────────────────────────────────────────────────

  function openNew()       { setEditing(null); setShowForm(true) }
  function openEdit(entry) { setEditing(entry); setShowForm(true) }
  function closeForm()     { setShowForm(false); setEditing(null) }

  function addEntry(data) {
    const now = new Date().toISOString()
    setEntries(prev => [{ id: uid(), ...data, createdAt: now, updatedAt: now }, ...prev])
    closeForm()
  }

  function updateEntry(data) {
    setEntries(prev => prev.map(e =>
      e.id === editing.id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
    ))
    closeForm()
  }

  function deleteEntry(id)   { setEntries(prev => prev.filter(e => e.id !== id)) }
  function toggleFav(id)     { setEntries(prev => prev.map(e => e.id === id ? { ...e, isFavorite: !e.isFavorite } : e)) }

  // ── Filter / sort ──────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let r = entries
    if (filterFavs)  r = r.filter(e => e.isFavorite)
    if (filterType)  r = r.filter(e => e.eventType === filterType)
    if (filterMood)  r = r.filter(e => e.mood === filterMood)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      r = r.filter(e =>
        e.title?.toLowerCase().includes(q)    ||
        e.content?.toLowerCase().includes(q)  ||
        e.location?.toLowerCase().includes(q) ||
        parseTags(e.people).some(p => p.toLowerCase().includes(q)) ||
        parseTags(e.tags).some(t => t.toLowerCase().includes(q))   ||
        e.eventType?.toLowerCase().includes(q) ||
        e.mood?.toLowerCase().includes(q)
      )
    }
    const s = [...r]
    if (sortOrder === 'newest') s.sort((a, b) => (b.date+(b.time||'')) > (a.date+(a.time||'')) ? 1 : -1)
    if (sortOrder === 'oldest') s.sort((a, b) => (a.date+(a.time||'')) > (b.date+(b.time||'')) ? 1 : -1)
    if (sortOrder === 'az')     s.sort((a, b) => (a.title||'').localeCompare(b.title||''))
    if (sortOrder === 'za')     s.sort((a, b) => (b.title||'').localeCompare(a.title||''))
    return s
  }, [entries, filterFavs, filterType, filterMood, search, sortOrder])

  const groups     = useMemo(() => groupEntries(filtered, groupBy), [filtered, groupBy])
  const hasFilters = filterFavs || filterType || filterMood || search.trim()

  return (
    <div className="diary-page">

      {/* ── Header ── */}
      <header className="diary-header">
        <Link to="/" className="diary-back">← Home</Link>
        <div className="diary-header-center">
          <h1>My Diary</h1>
          <p className="diary-header-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button className="diary-new-btn" onClick={openNew}>+ New Entry</button>
      </header>

      {/* ── Stats ── */}
      <StatsBar entries={entries} />

      {/* ── Toolbar ── */}
      <div className="diary-toolbar">
        <input className="diary-search" type="text" placeholder="Search entries…"
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="diary-toolbar-controls">
          <label className="diary-toolbar-lbl">Group by</label>
          <select className="diary-sel" value={groupBy} onChange={e => setGroupBy(e.target.value)}>
            {GROUP_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <label className="diary-toolbar-lbl">Sort</label>
          <select className="diary-sel" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* ── Filter chips ── */}
      <div className="diary-filters">
        <button className={`dchip${filterFavs ? ' dchip--on' : ''}`}
          onClick={() => setFilterFavs(v => !v)}>★ Favourites</button>

        <span className="dchip-sep" />

        {eventTypes.map(t => (
          <button key={t.id}
            className={`dchip${filterType === t.name ? ' dchip--on' : ''}`}
            style={filterType === t.name
              ? { background: t.color + '25', borderColor: t.color, color: t.color }
              : {}}
            onClick={() => setFilterType(v => v === t.name ? '' : t.name)}
          >{t.name}</button>
        ))}

        <button className="dchip dchip-manage" onClick={() => setShowManageTypes(true)}
          title="Manage event types">⚙ Types</button>

        <span className="dchip-sep" />

        {MOODS.map(m => (
          <button key={m.label}
            className={`dchip dchip-mood${filterMood === m.label ? ' dchip--on' : ''}`}
            title={m.label}
            onClick={() => setFilterMood(v => v === m.label ? '' : m.label)}
          >{m.emoji}</button>
        ))}

        {hasFilters && (
          <button className="dchip dchip-clear"
            onClick={() => { setFilterFavs(false); setFilterType(''); setFilterMood(''); setSearch('') }}>
            ✕ Clear filters
          </button>
        )}
      </div>

      {/* ── Content ── */}
      <div className="diary-body">
        {filtered.length === 0 ? (
          <div className="diary-empty">
            {entries.length === 0 ? (
              <>
                <div className="diary-empty-icon">📖</div>
                <h2>Your diary is empty</h2>
                <p>Start capturing your memories, thoughts, and moments.</p>
                <button className="diary-new-btn diary-new-btn-lg" onClick={openNew}>Write your first entry</button>
              </>
            ) : (
              <><div className="diary-empty-icon">🔍</div><p>No entries match your filters.</p></>
            )}
          </div>
        ) : (
          Array.from(groups.entries()).map(([groupKey, groupItems]) => (
            <section key={groupKey} className="diary-group">
              <div className="diary-group-hdr">
                <span className="diary-group-name">{groupKey}</span>
                <span className="diary-group-count">{groupItems.length} {groupItems.length === 1 ? 'entry' : 'entries'}</span>
              </div>
              <div className="diary-group-list">
                {groupItems.map(e => (
                  <EntryCard key={e.id} entry={e} colorMap={colorMap}
                    onEdit={openEdit} onDelete={deleteEntry} onToggleFav={toggleFav} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* ── FAB ── */}
      <button className="diary-fab" onClick={openNew} title="New entry">＋</button>

      {/* ── Entry form modal ── */}
      {showForm && (
        <EntryForm initial={editing} eventTypes={eventTypes}
          onSave={editing ? updateEntry : addEntry} onCancel={closeForm} />
      )}

      {/* ── Event types modal ── */}
      {showManageTypes && (
        <EventTypesModal
          eventTypes={eventTypes}
          onAdd={addEventType}
          onEdit={editEventType}
          onDelete={deleteEventType}
          onClose={() => setShowManageTypes(false)}
        />
      )}
    </div>
  )
}
