import { useState, useMemo, useRef } from 'react'
import { familyTreePeople } from '../data/familyTreeData'
import './FamilyTree.css'

const peopleMap = new Map(familyTreePeople.map(p => [p.id, p]))

// ─── Helpers ────────────────────────────────────────────────────────────────

function getAge(dob) {
  if (!dob) return null
  const birth = new Date(dob)
  if (isNaN(birth)) return null
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

function parseDOBDate(dob) {
  if (!dob) return null
  const [mo, d, y] = dob.split('/')
  if (!mo || !d || !y) return null
  return new Date(parseInt(y), parseInt(mo) - 1, parseInt(d))
}

function sortByAgeDesc(ids) {
  return [...ids].sort((a, b) => {
    const pa = peopleMap.get(a)
    const pb = peopleMap.get(b)
    const da = pa?.dob ? parseDOBDate(pa.dob) : null
    const db = pb?.dob ? parseDOBDate(pb.dob) : null
    if (!da && !db) return 0
    if (!da) return 1
    if (!db) return -1
    return da - db
  })
}

function getGeneration(person) {
  // heuristic: count ancestor depth from a root node
  const age = getAge(person.dob)
  if (age === null) {
    if (person.deceased) return 'Ancestor'
    return 'Unknown'
  }
  if (age < 18) return 'Young'
  if (age < 35) return 'Millennial'
  if (age < 55) return 'Gen X'
  if (age < 75) return 'Boomer'
  return 'Elder'
}

function getLocation(person) {
  const addr = person.address || ''
  if (!addr) return 'Unknown'
  const parts = addr.split(',').map(s => s.trim())
  // Try to get city/state/country from last two segments
  const city = parts[parts.length - 2] || parts[parts.length - 1] || 'Unknown'
  // Detect country
  if (/bangalore|bellandur|mumbai|andheri|india/i.test(addr)) return 'India'
  if (/CO|Longmont|colorado/i.test(addr)) return 'USA'
  if (addr.trim() === '') return 'Unknown'
  return city.replace(/\d+/g, '').trim() || 'Unknown'
}

function connectionCount(person) {
  return (person.children?.length || 0) + (person.parents?.length || 0) +
    (person.siblings?.length || 0) + (person.spouses?.length || 0)
}

// BFS to find relationship path between two people
function findRelationshipPath(fromId, toId) {
  if (fromId === toId) return [fromId]
  const visited = new Set([fromId])
  const queue = [[fromId, [fromId]]]
  while (queue.length > 0) {
    const [current, path] = queue.shift()
    const person = peopleMap.get(current)
    if (!person) continue
    const neighbors = [
      ...(person.children || []),
      ...(person.parents || []),
      ...(person.siblings || []),
      ...(person.spouses || []),
    ]
    for (const nid of neighbors) {
      if (visited.has(nid)) continue
      const newPath = [...path, nid]
      if (nid === toId) return newPath
      visited.add(nid)
      queue.push([nid, newPath])
    }
  }
  return null
}

function describeStep(fromId, toId) {
  const from = peopleMap.get(fromId)
  const to = peopleMap.get(toId)
  if (!from || !to) return ''
  if (from.children?.includes(toId)) return `parent of`
  if (from.parents?.includes(toId)) return `child of`
  if (from.siblings?.includes(toId)) return `sibling of`
  if (from.spouses?.includes(toId)) return `spouse of`
  return `connected to`
}

// ─── Sort / Group ────────────────────────────────────────────────────────────

function buildGroups(people, sortBy) {
  const sorted = [...people].sort((a, b) => a.name.localeCompare(b.name))
  switch (sortBy) {
    case 'alpha': {
      const groups = {}
      for (const p of sorted) {
        const l = p.name[0].toUpperCase()
        if (!groups[l]) groups[l] = []
        groups[l].push(p)
      }
      return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
    }
    case 'generation': {
      const order = ['Young', 'Millennial', 'Gen X', 'Boomer', 'Elder', 'Ancestor', 'Unknown']
      const groups = {}
      for (const p of sorted) {
        const g = getGeneration(p)
        if (!groups[g]) groups[g] = []
        groups[g].push(p)
      }
      return order.filter(k => groups[k]).map(k => [k, groups[k]])
    }
    case 'location': {
      const groups = {}
      for (const p of sorted) {
        const loc = getLocation(p)
        if (!groups[loc]) groups[loc] = []
        groups[loc].push(p)
      }
      return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
    }
    case 'connections': {
      const tiers = { 'Well-Connected (6+)': [], 'Connected (3-5)': [], 'Few (1-2)': [], 'Isolated (0)': [] }
      for (const p of sorted) {
        const c = connectionCount(p)
        if (c >= 6) tiers['Well-Connected (6+)'].push(p)
        else if (c >= 3) tiers['Connected (3-5)'].push(p)
        else if (c >= 1) tiers['Few (1-2)'].push(p)
        else tiers['Isolated (0)'].push(p)
      }
      return Object.entries(tiers).filter(([, v]) => v.length > 0)
    }
    case 'status': {
      const groups = { 'Living': [], 'Deceased': [] }
      for (const p of sorted) {
        if (p.deceased) groups['Deceased'].push(p)
        else groups['Living'].push(p)
      }
      return Object.entries(groups).filter(([, v]) => v.length > 0)
    }
    default:
      return [['All', sorted]]
  }
}

const SORT_OPTIONS = [
  { key: 'alpha', label: 'A – Z' },
  { key: 'generation', label: 'Generation' },
  { key: 'location', label: 'Location' },
  { key: 'connections', label: 'Connections' },
  { key: 'status', label: 'Status' },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function PersonAvatar({ person, size = 48 }) {
  const initials = person.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const hue = (person.id * 47) % 360
  return (
    <div
      className="person-avatar"
      style={{ width: size, height: size, fontSize: size * 0.33, '--hue': hue }}
      title={person.name}
    >
      {initials}
    </div>
  )
}

function PersonHoverCard({ person, x, y }) {
  const age = getAge(person.dob)
  const isMarried = (person.spouses?.length || 0) > 0
  const childrenCount = person.children?.length || 0
  const siblingsCount = (person.siblings || []).filter(id => id !== person.id).length
  const loc = getLocation(person)

  const cardWidth = 272
  const estimatedHeight = 300
  let left = x + 14
  if (left + cardWidth > window.innerWidth - 12) left = x - cardWidth - 14
  let top = y + 14
  if (top + estimatedHeight > window.innerHeight - 12) top = y - estimatedHeight - 14

  return (
    <div className="person-hover-card" style={{ left, top }}>
      <div className="phc-header">
        <PersonAvatar person={person} size={44} />
        <div className="phc-header-text">
          <div className="phc-name">{person.name}</div>
          {person.alias && <div className="phc-alias">"{person.alias}"</div>}
          <div className={`phc-status ${person.deceased ? 'deceased' : 'living'}`}>
            {person.deceased ? '† Deceased' : '● Living'}
          </div>
        </div>
      </div>
      <div className="phc-divider" />
      <div className="phc-grid">
        <div className="phc-item">
          <span className="phc-icon">🎂</span>
          <div>
            <div className="phc-label">Date of Birth</div>
            <div className="phc-value">{person.dob || '—'}</div>
          </div>
        </div>
        <div className="phc-item">
          <span className="phc-icon">🔢</span>
          <div>
            <div className="phc-label">Age</div>
            <div className="phc-value">{age !== null ? `${age} yrs` : '—'}</div>
          </div>
        </div>
        <div className="phc-item">
          <span className="phc-icon">⚥</span>
          <div>
            <div className="phc-label">Gender</div>
            <div className="phc-value">{person.gender || '—'}</div>
          </div>
        </div>
        <div className="phc-item">
          <span className="phc-icon">{isMarried ? '💍' : '🔓'}</span>
          <div>
            <div className="phc-label">Married</div>
            <div className="phc-value">{isMarried ? 'Yes' : 'No'}</div>
          </div>
        </div>
        <div className="phc-item">
          <span className="phc-icon">🌱</span>
          <div>
            <div className="phc-label">Children</div>
            <div className="phc-value">{childrenCount}</div>
          </div>
        </div>
        <div className="phc-item">
          <span className="phc-icon">👥</span>
          <div>
            <div className="phc-label">Siblings</div>
            <div className="phc-value">{siblingsCount}</div>
          </div>
        </div>
        {loc !== 'Unknown' && (
          <div className="phc-item phc-item-full">
            <span className="phc-icon">📍</span>
            <div>
              <div className="phc-label">Location</div>
              <div className="phc-value">{loc}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function RelationChip({ label, icon, people: ids, onSelect, onHover, onLeave }) {
  if (!ids || ids.length === 0) return null
  return (
    <div className="relation-section">
      <div className="relation-label">
        {icon && <span className="relation-type-icon">{icon}</span>}
        {label}
      </div>
      <div className="relation-chips">
        {ids.map(id => {
          const p = peopleMap.get(id)
          if (!p) return null
          return (
            <button
              key={id}
              className="relation-chip"
              onClick={() => onSelect(id)}
              onMouseEnter={e => onHover?.(id, e)}
              onMouseLeave={() => onLeave?.()}
            >
              <PersonAvatar person={p} size={28} />
              <span>{p.name}</span>
              {p.alias && <span className="chip-alias">({p.alias})</span>}
              {p.deceased && <span className="chip-deceased">†</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PersonDetail({ person, onSelect }) {
  const [hoverCard, setHoverCard] = useState(null)

  const age = getAge(person.dob)
  const gen = getGeneration(person)
  const loc = getLocation(person)

  const fatherId = person.parents?.[0] ?? null
  const motherId = person.parents?.[1] ?? null
  const sortedSiblings = sortByAgeDesc((person.siblings || []).filter(id => id !== person.id))
  const sortedChildren = sortByAgeDesc(person.children || [])

  function handleHover(id, e) {
    const p = peopleMap.get(id)
    if (p) setHoverCard({ person: p, x: e.clientX, y: e.clientY })
  }
  function handleLeave() { setHoverCard(null) }

  return (
    <div className="person-detail">
      <div className="detail-hero">
        <PersonAvatar person={person} size={80} />
        <div className="detail-hero-info">
          <h2 className="detail-name">{person.name}</h2>
          {person.alias && <div className="detail-alias">"{person.alias}"</div>}
          <div className="detail-badges">
            {person.deceased && <span className="badge badge-deceased">Deceased</span>}
            <span className="badge badge-gen">{gen}</span>
            {loc !== 'Unknown' && <span className="badge badge-loc">{loc}</span>}
          </div>
        </div>
      </div>

      <div className="detail-info-grid">
        {person.dob && (
          <div className="info-item">
            <span className="info-icon">🎂</span>
            <div>
              <div className="info-label">Date of Birth</div>
              <div className="info-value">{person.dob}{age !== null ? ` (age ${age})` : ''}</div>
            </div>
          </div>
        )}
        {person.address && (
          <div className="info-item">
            <span className="info-icon">📍</span>
            <div>
              <div className="info-label">Address</div>
              <div className="info-value">{person.address}</div>
            </div>
          </div>
        )}
        {person.email?.length > 0 && (
          <div className="info-item">
            <span className="info-icon">✉️</span>
            <div>
              <div className="info-label">Email</div>
              <div className="info-value">{person.email.join(', ')}</div>
            </div>
          </div>
        )}
        {person.phone?.length > 0 && (
          <div className="info-item">
            <span className="info-icon">📞</span>
            <div>
              <div className="info-label">Phone</div>
              <div className="info-value">{person.phone.join(', ')}</div>
            </div>
          </div>
        )}
      </div>

      <div className="detail-relations">
        {fatherId && <RelationChip label="Father" icon="👨" people={[fatherId]} onSelect={onSelect} onHover={handleHover} onLeave={handleLeave} />}
        {motherId && <RelationChip label="Mother" icon="👩" people={[motherId]} onSelect={onSelect} onHover={handleHover} onLeave={handleLeave} />}
        <RelationChip label="Spouse" icon="💍" people={person.spouses} onSelect={onSelect} onHover={handleHover} onLeave={handleLeave} />
        <RelationChip label="Siblings" icon="👥" people={sortedSiblings} onSelect={onSelect} onHover={handleHover} onLeave={handleLeave} />
        <RelationChip label="Children" icon="🌱" people={sortedChildren} onSelect={onSelect} onHover={handleHover} onLeave={handleLeave} />
      </div>
      {hoverCard && <PersonHoverCard person={hoverCard.person} x={hoverCard.x} y={hoverCard.y} />}
    </div>
  )
}

function RelationshipFinder({ onSelectPerson }) {
  const [fromId, setFromId] = useState('')
  const [toId, setToId] = useState('')
  const [result, setResult] = useState(null)
  const [searched, setSearched] = useState(false)

  function handleFind() {
    const from = parseInt(fromId)
    const to = parseInt(toId)
    if (!from || !to) return
    const path = findRelationshipPath(from, to)
    setResult(path)
    setSearched(true)
  }

  const sortedPeople = useMemo(() => [...familyTreePeople].sort((a, b) => a.name.localeCompare(b.name)), [])

  return (
    <div className="rel-finder">
      <h3 className="rel-finder-title">Find Relationship</h3>
      <p className="rel-finder-desc">Discover how two people in the family are connected.</p>
      <div className="rel-finder-controls">
        <div className="rel-select-group">
          <label>From</label>
          <select value={fromId} onChange={e => { setFromId(e.target.value); setSearched(false) }}>
            <option value="">— select person —</option>
            {sortedPeople.map(p => (
              <option key={p.id} value={p.id}>{p.name}{p.alias ? ` (${p.alias})` : ''}</option>
            ))}
          </select>
        </div>
        <div className="rel-arrow">→</div>
        <div className="rel-select-group">
          <label>To</label>
          <select value={toId} onChange={e => { setToId(e.target.value); setSearched(false) }}>
            <option value="">— select person —</option>
            {sortedPeople.map(p => (
              <option key={p.id} value={p.id}>{p.name}{p.alias ? ` (${p.alias})` : ''}</option>
            ))}
          </select>
        </div>
        <button className="rel-find-btn" onClick={handleFind} disabled={!fromId || !toId}>Find</button>
      </div>

      {searched && (
        <div className="rel-result">
          {result === null ? (
            <p className="rel-no-path">No connection found between these two people.</p>
          ) : result.length === 1 ? (
            <p className="rel-same">These are the same person!</p>
          ) : (
            <div className="rel-path">
              <div className="rel-path-label">Connection path ({result.length - 1} step{result.length > 2 ? 's' : ''})</div>
              <div className="rel-path-nodes">
                {result.map((id, i) => {
                  const p = peopleMap.get(id)
                  if (!p) return null
                  return (
                    <div key={id} className="rel-path-step">
                      <button className="rel-path-person" onClick={() => onSelectPerson(id)}>
                        <PersonAvatar person={p} size={36} />
                        <span>{p.name}</span>
                      </button>
                      {i < result.length - 1 && (
                        <div className="rel-path-edge">
                          <span className="rel-path-arrow">↓</span>
                          <span className="rel-path-rel">{describeStep(id, result[i + 1])}</span>
                          <span className="rel-path-arrow">↓</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function FamilyTree({ onBack }) {
  const [sortBy, setSortBy] = useState('alpha')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [showFinder, setShowFinder] = useState(false)
  const searchRef = useRef(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return familyTreePeople
    return familyTreePeople.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.alias && p.alias.toLowerCase().includes(q))
    )
  }, [search])

  const groups = useMemo(() => buildGroups(filtered, sortBy), [filtered, sortBy])

  const selectedPerson = selectedId ? peopleMap.get(selectedId) : null

  function handleSelectPerson(id) {
    setSelectedId(id)
    setShowFinder(false)
    // Scroll to the person in the sidebar
    setTimeout(() => {
      const el = document.querySelector(`.sidebar-item[data-id="${id}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 50)
  }

  return (
    <div className="ft-page">
      {/* Header */}
      <header className="ft-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1 className="ft-title">Family Tree</h1>
        <div className="ft-search-wrapper" ref={searchRef}>
          <span className="ft-search-icon">🔍</span>
          <input
            className="ft-search-input"
            type="text"
            placeholder="Search by name or alias…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && setSearch('')}
            autoComplete="off"
          />
          {search && (
            <button className="ft-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
        <button
          className={`rel-finder-toggle${showFinder ? ' active' : ''}`}
          onClick={() => { setShowFinder(v => !v); setSelectedId(null) }}
        >
          🔗 Find Relation
        </button>
        <span className="ft-count">{familyTreePeople.length} people</span>
      </header>

      <div className="ft-body">
        {/* Sidebar */}
        <aside className="ft-sidebar">
          <div className="sort-tabs">
            {SORT_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                className={`sort-tab${sortBy === key ? ' active' : ''}`}
                onClick={() => setSortBy(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="ft-sidebar-list">
            {groups.length === 0 && (
              <p className="sidebar-empty">No people match your search.</p>
            )}
            {groups.map(([groupName, people]) => (
              <div key={groupName} className="sidebar-group">
                <div className="sidebar-group-header">
                  {groupName}
                  <span className="group-count">{people.length}</span>
                </div>
                {people.map(p => (
                  <div
                    key={p.id}
                    data-id={p.id}
                    className={`ft-sidebar-item${selectedId === p.id ? ' selected' : ''}${p.deceased ? ' deceased' : ''}`}
                    onClick={() => handleSelectPerson(p.id)}
                  >
                    <PersonAvatar person={p} size={30} />
                    <div className="ft-sidebar-item-info">
                      <span className="ft-sidebar-item-name">{p.name}</span>
                      {p.alias && <span className="ft-sidebar-item-alias">{p.alias}</span>}
                    </div>
                    {p.deceased && <span className="ft-deceased-mark" title="Deceased">†</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Main panel */}
        <main className="ft-main">
          {showFinder ? (
            <RelationshipFinder onSelectPerson={handleSelectPerson} />
          ) : selectedPerson ? (
            <PersonDetail person={selectedPerson} onSelect={handleSelectPerson} />
          ) : (
            <div className="ft-placeholder">
              <div className="placeholder-icon">🌳</div>
              <p>Select a person from the sidebar to view their details.</p>
              <p className="placeholder-sub">Or use <strong>Find Relation</strong> to discover how two people are connected.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
