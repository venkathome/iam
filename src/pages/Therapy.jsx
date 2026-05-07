import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { GET_PROFILES } from '../apollo/queries'
import Breadcrumb from '../components/Breadcrumb'
import { useTherapyProgress } from '../hooks/useTherapyProgress'
import {
  pdfUrl, filesUrl,
  VOCABULARY, READING_GRADES,
  WH_QUESTIONS, SOCIAL_SKILLS,
  FOLLOWING_DIRECTIONS, LANGUAGE_THERAPY,
  ABA_BUNDLES, cleanPdfName,
} from '../data/therapyData'
import './Therapy.css'

// Pre-computed key lists per section (used for tab stats)
const SECTION_KEYS = {
  vocabulary: VOCABULARY.flatMap(c => c.words.map(w => `vocab:${c.id}:${w}`)),
  reading:    READING_GRADES.flatMap(g => g.levels.map(l => l.file)),
  wh:         WH_QUESTIONS.flatMap(g => g.items.map(i => i.file)),
  social:     SOCIAL_SKILLS.flatMap(g => g.items.map(i => i.file)),
  directions: FOLLOWING_DIRECTIONS.map(i => i.file),
  language:   LANGUAGE_THERAPY.map(i => i.file),
  aba:        [],
}

const TABS = [
  { id: 'aba',         label: 'ABA Resources' },
  { id: 'altogether',  label: '⭐ Altogether'  },
  { id: 'directions',  label: 'Directions'    },
  { id: 'language',    label: 'Language'      },
  { id: 'picture',     label: '🖼️ Picture'    },
  { id: 'reading',     label: 'Reading'       },
  { id: 'social',      label: 'Social Skills' },
  { id: 'vocabulary',  label: 'Vocabulary'    },
  { id: 'wh',          label: 'WH Questions'  },
]

// ── Shared components ─────────────────────────────────────────────────────────

function ProgressBadge({ pct, onCycle }) {
  const done = pct === 100
  return (
    <button
      className={`pbadge ${done ? 'pbadge--done' : pct > 0 ? 'pbadge--partial' : 'pbadge--empty'}`}
      onClick={e => { e.preventDefault(); e.stopPropagation(); onCycle() }}
      title={done ? 'Completed · click to reset' : pct > 0 ? `${pct}% · click to advance` : 'Not started · click to advance'}
    >
      {done ? (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <polyline points="2,6 4.5,8.5 9,2.5" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : pct > 0 ? (
        <span>{pct}</span>
      ) : null}
    </button>
  )
}

function PdfCard({ name, file, get, cycle }) {
  const pct  = get(file)
  const done = pct === 100
  return (
    <div className={`pdf-card${done ? ' pdf-card--done' : ''}`}>
      <a className="pdf-card-link" href={pdfUrl(file)} target="_blank" rel="noreferrer">
        <span className="pdf-card-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
            <line x1="7" y1="8"  x2="13" y2="8"  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <line x1="7" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <line x1="7" y1="14" x2="11" y2="14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M14 12 L20 12 M17 9 L20 12 L17 15" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="pdf-card-name">{name}</span>
      </a>
      <ProgressBadge pct={pct} onCycle={() => cycle(file)} />
    </div>
  )
}

function SectionGroup({ title, children }) {
  return (
    <div className="section-group">
      {title && <h3 className="section-group-title">{title}</h3>}
      <div className="pdf-grid">{children}</div>
    </div>
  )
}

// ── Vocabulary ────────────────────────────────────────────────────────────────

function VocabularySection({ get, toggle }) {
  const [highlight, setHighlight] = useState(null)

  return (
    <div className="vocab-section">
      <p className="section-desc">
        Tap a word to highlight it during naming practice. Tap the badge to mark it complete.
      </p>
      {VOCABULARY.map(cat => (
        <div key={cat.id} className="vocab-group">
          <h3 className="section-group-title" style={{ color: cat.color }}>{cat.label}</h3>
          <div className="word-chips">
            {cat.words.map(w => {
              const key  = `vocab:${cat.id}:${w}`
              const done = get(key) === 100
              const lit  = highlight === key
              return (
                <div
                  key={w}
                  className={`word-chip${done ? ' word-chip--done' : lit ? ' word-chip--lit' : ''}`}
                  style={{ '--chip-color': cat.color }}
                >
                  <button
                    className="word-chip-text"
                    onClick={() => setHighlight(prev => prev === key ? null : key)}
                  >
                    {w}
                  </button>
                  <SpeakBtn text={w} />
                  <button
                    className="word-chip-check"
                    onClick={() => toggle(key)}
                    title={done ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {done
                      ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <polyline points="2,5.5 4.2,8 8,2.5" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      : <span className="word-chip-dot" />
                    }
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Reading ───────────────────────────────────────────────────────────────────

function ReadingSection({ get, cycle, stats }) {
  const [gradeIdx, setGradeIdx] = useState(0)
  const grade = READING_GRADES[gradeIdx]

  return (
    <div className="reading-section">
      <p className="section-desc">K5 Learning leveled readers — select a grade then open a level.</p>
      <div className="grade-tabs">
        {READING_GRADES.map((g, i) => {
          const { done, total } = stats(g.levels.map(l => l.file))
          const allDone = total > 0 && done === total
          return (
            <button
              key={g.grade}
              className={`grade-tab${i === gradeIdx ? ' grade-tab--active' : ''}${allDone ? ' grade-tab--complete' : ''}`}
              style={{ '--grade-color': g.color }}
              onClick={() => setGradeIdx(i)}
            >
              {g.grade}
              <span className={`grade-tab-stat${allDone ? ' grade-tab-stat--done' : ''}`}>
                {done}/{total}
              </span>
            </button>
          )
        })}
      </div>
      <div className="level-grid">
        {grade.levels.map(l => {
          const pct  = get(l.file)
          const done = pct === 100
          return (
            <div key={l.level} className={`level-card${done ? ' level-card--done' : ''}`}
              style={{ '--grade-color': grade.color }}>
              <a className="level-card-link" href={pdfUrl(l.file)} target="_blank" rel="noreferrer">
                <span className="level-letter">{l.level}</span>
                <span className="level-label">Level {l.level}</span>
              </a>
              <ProgressBadge pct={pct} onCycle={() => cycle(l.file)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── WH Questions ──────────────────────────────────────────────────────────────

function WHSection({ get, cycle }) {
  return (
    <div>
      <p className="section-desc">WH question materials for comprehension and speech therapy.</p>
      {WH_QUESTIONS.map(g => (
        <SectionGroup key={g.group} title={g.group}>
          {g.items.map(item => (
            <PdfCard key={item.file} name={item.name} file={item.file} get={get} cycle={cycle} />
          ))}
        </SectionGroup>
      ))}
    </div>
  )
}

// ── Social Skills ─────────────────────────────────────────────────────────────

function SocialSection({ get, cycle }) {
  return (
    <div>
      <p className="section-desc">Pragmatic language and social skills activities.</p>
      {SOCIAL_SKILLS.map(g => (
        <SectionGroup key={g.group} title={g.group}>
          {g.items.map(item => (
            <PdfCard key={item.file} name={item.name} file={item.file} get={get} cycle={cycle} />
          ))}
        </SectionGroup>
      ))}
    </div>
  )
}

// ── Following Directions ──────────────────────────────────────────────────────

function DirectionsSection({ get, cycle }) {
  return (
    <div>
      <p className="section-desc">Following directions activities and worksheets.</p>
      <SectionGroup>
        {FOLLOWING_DIRECTIONS.map(item => (
          <PdfCard key={item.file} name={item.name} file={item.file} get={get} cycle={cycle} />
        ))}
      </SectionGroup>
    </div>
  )
}

// ── Language Therapy ──────────────────────────────────────────────────────────

function LanguageSection({ get, cycle }) {
  return (
    <div>
      <p className="section-desc">Complete school-age language therapy toolkit.</p>
      <SectionGroup>
        {LANGUAGE_THERAPY.map(item => (
          <PdfCard key={item.file} name={item.name} file={item.file} get={get} cycle={cycle} />
        ))}
      </SectionGroup>
    </div>
  )
}

// ── ABA Resources ─────────────────────────────────────────────────────────────

function ABASection({ get, cycle, stats }) {
  const [bundleId, setBundleId] = useState(ABA_BUNDLES[0].id)
  const [files, setFiles]       = useState([])
  const [loading, setLoading]   = useState(false)
  const [query, setQuery]       = useState('')

  const bundle = ABA_BUNDLES.find(b => b.id === bundleId)

  const loadFiles = useCallback(async (b) => {
    setLoading(true)
    setFiles([])
    try {
      const res  = await fetch(filesUrl(b.dir))
      const list = await res.json()
      setFiles(list)
    } catch {
      setFiles([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFiles(bundle)
    setQuery('')
  }, [bundleId])

  const filtered  = files.filter(f =>
    query.trim() === '' || f.toLowerCase().includes(query.toLowerCase())
  )

  const fileKeys  = files.map(f => `${bundle.dir}/${f}`)
  const { done: bundleDone, total: bundleTotal } = stats(fileKeys)

  return (
    <div className="aba-section">
      <p className="section-desc">Large ABA resource bundles — select a collection then search by keyword.</p>

      <div className="aba-bundles">
        {ABA_BUNDLES.map(b => {
          const { done, total } = stats(files.map(f => `${b.dir}/${f}`))
          const allDone = total > 0 && done === total
          return (
            <button
              key={b.id}
              className={`aba-bundle-btn${b.id === bundleId ? ' aba-bundle-btn--active' : ''}${allDone ? ' aba-bundle-btn--complete' : ''}`}
              style={{ '--bundle-color': b.color }}
              onClick={() => setBundleId(b.id)}
            >
              <span className="aba-bundle-name">{b.name}</span>
              <span className="aba-bundle-count">{b.count} PDFs</span>
            </button>
          )
        })}
      </div>

      <div className="aba-search-row">
        <input
          className="aba-search"
          type="text"
          placeholder="Search PDFs…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {!loading && files.length > 0 && (
          <span className="aba-count">
            {filtered.length !== files.length
              ? `${filtered.length} of ${files.length}`
              : `${files.length} files`
            }
            {bundleDone > 0 && (
              <span className="aba-done-count"> · {bundleDone}/{bundleTotal} done</span>
            )}
          </span>
        )}
      </div>

      {loading ? (
        <p className="aba-loading">Loading…</p>
      ) : (
        <div className="pdf-grid">
          {filtered.map(f => {
            const fileKey = `${bundle.dir}/${f}`
            return (
              <PdfCard
                key={f}
                name={cleanPdfName(f)}
                file={fileKey}
                get={get}
                cycle={cycle}
              />
            )
          })}
          {!loading && filtered.length === 0 && query && (
            <p className="aba-empty">No results for "{query}"</p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Picture Section ───────────────────────────────────────────────────────────

const WH_COLOURS = {
  // Original WH types
  WHO:    '#60a5fa',
  WHAT:   '#4ade80',
  WHERE:  '#f59e0b',
  WHEN:   '#a78bfa',
  WHY:    '#f87171',
  HOW:    '#14b8a6',
  // Extended WH types
  WHICH:  '#fb923c',
  WHOM:   '#93c5fd',
  WHOSE:  '#818cf8',
  // Yes/No — present
  IS:     '#f43f5e',
  ARE:    '#ec4899',
  // Yes/No — past
  WAS:    '#c084fc',
  WERE:   '#a855f7',
  // Do-support
  DO:     '#fbbf24',
  DOES:   '#f59e0b',
  DID:    '#d97706',
  // Ability / possibility
  CAN:    '#34d399',
  COULD:  '#10b981',
  // Future
  WILL:   '#38bdf8',
  SHALL:  '#0ea5e9',
  // Conditional / advice
  WOULD:  '#a5b4fc',
  SHOULD: '#6366f1',
  // Experience / perfect
  HAVE:   '#fb7185',
  HAS:    '#e11d48',
  HAD:    '#7c3aed',
  // Present be — first person
  AM:     '#ef4444',
  // Permission / possibility
  MAY:    '#06b6d4',
  MIGHT:  '#0d9488',
  // Necessity
  MUST:   '#dc2626',
  NEED:   '#84cc16',
}

const DIFFICULTY_LEVELS = [
  { id: 'all',       label: 'All',       color: '#6b7280' },
  { id: 'very-easy', label: 'Very Easy', color: '#22c55e' },
  { id: 'easy',      label: 'Easy',      color: '#14b8a6' },
  { id: 'medium',    label: 'Medium',    color: '#60a5fa' },
  { id: 'hard',      label: 'Hard',      color: '#f59e0b' },
  { id: 'very-hard', label: 'Very Hard', color: '#f87171' },
  { id: 'ultimate',  label: 'Ultimate',  color: '#a78bfa' },
]

// ── Pointer question modal ────────────────────────────────────────────────────

function PtrModal({ modal, allQuestions, onClose }) {
  const [mIdx, setMIdx]     = useState(modal.qStart)
  const [revealed, setReveal] = useState(false)

  const q      = allQuestions[mIdx] || allQuestions[0]
  const wh     = q?.wh || q?.type || ''
  const text   = q?.q  || q?.text || ''
  const answer = q?.a   || null
  const whColor = WH_COLOURS[wh] || '#888'

  // Smart fixed positioning: right of pointer when space allows, else left
  const MODAL_W = 310
  const MARGIN  = 10
  const { rect } = modal
  const vw = window.innerWidth
  const vh = window.innerHeight

  const spaceRight = vw - rect.right
  let left = spaceRight >= MODAL_W + MARGIN
    ? rect.right + MARGIN
    : Math.max(MARGIN, rect.left - MODAL_W - MARGIN)
  left = Math.max(MARGIN, Math.min(left, vw - MODAL_W - MARGIN))

  const top = Math.max(MARGIN, Math.min(rect.top - 24, vh - 340))

  function prev() { setMIdx(i => Math.max(0, i - 1)); setReveal(false) }
  function next() { setMIdx(i => Math.min(allQuestions.length - 1, i + 1)); setReveal(false) }

  return (
    <>
      <div className="ptr-backdrop" onClick={onClose} />
      <div
        className="ptr-modal"
        style={{ left: `${left}px`, top: `${top}px`, '--wh-color': whColor }}
        onClick={e => e.stopPropagation()}
      >
        <button className="ptr-modal-close" onClick={onClose} aria-label="Close">×</button>

        <div className="ptr-modal-wh">{wh}?</div>
        <div className="speak-row">
          <p className="ptr-modal-q">{text}</p>
          <SpeakBtn text={text} />
        </div>

        {answer ? (
          !revealed ? (
            <button className="ptr-modal-reveal" onClick={() => setReveal(true)}>Show Answer</button>
          ) : (
            <div className="ptr-modal-answer">
              <div className="speak-row">
                <p className="ptr-modal-answer-text">{answer}</p>
                <SpeakBtn text={answer} />
              </div>
              <button
                className="ptr-modal-reveal ptr-modal-reveal--next"
                onClick={() => { if (mIdx < allQuestions.length - 1) next() }}
                disabled={mIdx >= allQuestions.length - 1}
              >
                {mIdx < allQuestions.length - 1 ? 'Next →' : 'All done!'}
              </button>
            </div>
          )
        ) : (
          <p className="ptr-modal-no-answer">No written answer — discuss aloud.</p>
        )}

        <div className="ptr-modal-nav">
          <button className="ptr-modal-nav-btn" onClick={prev} disabled={mIdx === 0}>‹</button>
          <span className="ptr-modal-counter">{mIdx + 1} / {allQuestions.length}</span>
          <button className="ptr-modal-nav-btn" onClick={next} disabled={mIdx === allQuestions.length - 1}>›</button>
        </div>
      </div>
    </>
  )
}

function shuffleArr(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function SpeakBtn({ text, className = '' }) {
  const [speaking, setSpeaking] = useState(false)

  function handleSpeak(e) {
    e.stopPropagation()
    if (!window.speechSynthesis) return
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return }
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.onend  = () => setSpeaking(false)
    utt.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(utt)
  }

  return (
    <button
      className={`speak-btn${speaking ? ' speak-btn--active' : ''}${className ? ` ${className}` : ''}`}
      onClick={handleSpeak}
      title={speaking ? 'Stop' : 'Listen'}
      aria-label={speaking ? 'Stop' : 'Read aloud'}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {speaking ? (
          <>
            <line x1="15" y1="9" x2="21" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="21" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </>
        ) : (
          <>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </>
        )}
      </svg>
    </button>
  )
}

function GuessTheQuestion({ pic, visibleQs }) {
  // Use visible filtered questions as the guess pool; fall back to all if fewer than 4
  const guessPool = useMemo(() => {
    const withAnswer = visibleQs.filter(q => q.a)
    return shuffleArr(withAnswer)
  }, [pic.id, visibleQs.length, visibleQs.map(q => q.difficulty).join()])

  const distractorPool = useMemo(
    () => pic.questions.filter(q => q.a),
    [pic.id]
  )

  const [gIdx, setGIdx]       = useState(0)
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(null)
  const [score, setScore]     = useState({ correct: 0, total: 0 })

  const current = guessPool[gIdx % Math.max(guessPool.length, 1)]

  // Build new options whenever the question changes
  useEffect(() => {
    if (!current) return
    const distractors = shuffleArr(
      distractorPool.filter(q => q.id !== current.id && q.q !== current.q)
    ).slice(0, 3)
    setOptions(shuffleArr([current, ...distractors]))
    setSelected(null)
  }, [current?.id, gIdx])

  // Reset round index when picture or difficulty changes
  useEffect(() => { setGIdx(0); setSelected(null); setScore({ correct: 0, total: 0 }) }, [pic.id])
  useEffect(() => { setGIdx(0); setSelected(null) }, [visibleQs.length, visibleQs.map(q => q.difficulty).join()])

  function handleSelect(opt) {
    if (selected !== null) return
    setSelected(opt.id)
    setScore(s => ({
      correct: s.correct + (opt.id === current.id ? 1 : 0),
      total: s.total + 1,
    }))
  }

  function nextRound() {
    setGIdx(i => (i + 1) % guessPool.length)
  }

  if (!guessPool.length) {
    return (
      <div className="pic-guess-panel">
        <p className="pic-guess-empty">No questions with written answers for this difficulty. Try a different difficulty level.</p>
      </div>
    )
  }

  if (!current || options.length === 0) return null

  const answered   = selected !== null
  const isCorrect  = selected === current.id
  const whColor    = WH_COLOURS[current.wh] || '#888'
  const pct        = score.total > 0 ? Math.round((score.correct / score.total) * 100) : null

  return (
    <div className="pic-guess-panel">

      {/* Score strip */}
      <div className="pic-guess-score-bar">
        <span className="pic-guess-score-label">Score</span>
        <span className="pic-guess-score-nums">{score.correct} / {score.total}</span>
        {pct !== null && (
          <span className={`pic-guess-pct ${pct >= 70 ? 'pic-guess-pct--good' : 'pic-guess-pct--low'}`}>
            {pct}%
          </span>
        )}
        <span className="pic-guess-round">Round {(gIdx % guessPool.length) + 1} of {guessPool.length}</span>
      </div>

      {/* Statement box */}
      <div className="pic-guess-statement-wrap">
        <div className="speak-row" style={{ marginBottom: '0.25rem' }}>
        <p className="pic-guess-instr" style={{ margin: 0 }}>Read the statement below, then choose the question that was asked:</p>
      </div>
        <div className="pic-guess-statement">
          <span className="pic-guess-wh-chip" style={{ '--wh-color': whColor }}>{current.wh}?</span>
          <div className="speak-row">
            <p className="pic-guess-statement-text">"{current.a}"</p>
            <SpeakBtn text={current.a} />
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="pic-guess-options">
        {options.map((opt, i) => {
          const isThisCorrect = opt.id === current.id
          const isThisSelected = opt.id === selected
          let cls = 'pic-guess-opt'
          if (answered) {
            if (isThisCorrect)        cls += ' pic-guess-opt--correct'
            else if (isThisSelected)  cls += ' pic-guess-opt--wrong'
            else                      cls += ' pic-guess-opt--faded'
          }
          return (
            <div key={opt.id || i} className="guess-opt-row">
              <button
                className={cls}
                onClick={() => handleSelect(opt)}
                disabled={answered}
              >
                <span className="pic-guess-opt-letter">{String.fromCharCode(65 + i)}</span>
                <span className="pic-guess-opt-text">{opt.q}</span>
                {answered && isThisCorrect && <span className="pic-guess-opt-tick">✓</span>}
                {answered && isThisSelected && !isThisCorrect && <span className="pic-guess-opt-cross">✗</span>}
              </button>
              <SpeakBtn text={opt.q} />
            </div>
          )
        })}
      </div>

      {/* Feedback row */}
      {answered && (
        <div className={`pic-guess-feedback ${isCorrect ? 'pic-guess-feedback--correct' : 'pic-guess-feedback--wrong'}`}>
          <span className="pic-guess-feedback-msg">
            {isCorrect ? '🎉 Correct!' : '😅 Not quite — the highlighted option was correct.'}
          </span>
          <button className="pic-guess-next-btn" onClick={nextRound}>
            {gIdx + 1 < guessPool.length ? 'Next →' : 'Restart →'}
          </button>
        </div>
      )}
    </div>
  )
}

function PictureSection() {
  const [cat, setCat]               = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [imgIdx, setImgIdx]         = useState(0)
  const [qIdx, setQIdx]             = useState(0)
  const [revealed, setRevealed]     = useState(false)
  const [imgError, setImgError]     = useState(false)
  const [ptrModal, setPtrModal]     = useState(null)
  const [picMode, setPicMode]       = useState('questions')
  const [picData, setPicData]       = useState(null)
  // ptrModal: null | { pointerId, rect: DOMRect, qStart: number }

  useEffect(() => {
    let cancelled = false
    import('../data/pictureData').then(m => {
      if (!cancelled) setPicData({ items: m.PICTURE_ITEMS, categories: m.PICTURE_CATEGORIES })
    })
    return () => { cancelled = true }
  }, [])

  const PICTURE_ITEMS      = picData?.items      ?? []
  const PICTURE_CATEGORIES = picData?.categories ?? []

  const filtered  = cat === 'all' ? PICTURE_ITEMS : PICTURE_ITEMS.filter(p => p.category === cat)
  const pic       = filtered[Math.min(imgIdx, filtered.length - 1)]
  const visibleQs = difficulty === 'all'
    ? (pic?.questions ?? [])
    : (pic?.questions ?? []).filter(q => q.difficulty === difficulty)
  const question  = visibleQs[Math.min(qIdx, visibleQs.length - 1)]

  function resetQ()   { setQIdx(0); setRevealed(false); setPtrModal(null) }
  function resetImg() { setImgIdx(0); setQIdx(0); setRevealed(false); setImgError(false); setPtrModal(null) }

  function changeCat(c)        { setCat(c); resetImg() }
  function changeDifficulty(d) { setDifficulty(d); resetQ() }
  function goNextImg()  { if (imgIdx < filtered.length - 1) { setImgIdx(i => i + 1); resetQ(); setImgError(false) } }
  function goPrevImg()  { if (imgIdx > 0) { setImgIdx(i => i - 1); resetQ(); setImgError(false) } }
  function goNextQ()    { if (qIdx < visibleQs.length - 1) { setQIdx(i => i + 1); setRevealed(false) } }
  function goPrevQ()    { if (qIdx > 0) { setQIdx(i => i - 1); setRevealed(false) } }

  function handlePointerClick(ptr, e) {
    // Toggle off if same pointer clicked again
    if (ptrModal?.pointerId === ptr.id) { setPtrModal(null); return }
    const rect   = e.currentTarget.getBoundingClientRect()
    const qStart = Math.max(0, visibleQs.findIndex(q => q.pointer === ptr.id))
    setPtrModal({ pointerId: ptr.id, rect, qStart })
    setQIdx(qStart)
    setRevealed(false)
  }

  useEffect(() => { resetImg() }, [cat])

  if (!picData) return <div className="pic-section"><p className="section-desc">Loading picture library…</p></div>
  if (!pic) return null

  const whColor = question ? (WH_COLOURS[question.wh] || '#888') : '#888'

  return (
    <div className="pic-section">
      <p className="section-desc">
        Tap a numbered pointer on the image to open a question card next to it. Use ← → below to browse all questions, or filter by difficulty.
      </p>

      {/* Category filter */}
      <div className="pic-cat-bar">
        {PICTURE_CATEGORIES.map(c => (
          <button
            key={c.id}
            className={`pic-cat-btn${cat === c.id ? ' pic-cat-btn--active' : ''}`}
            onClick={() => changeCat(c.id)}
          >{c.label}</button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div className="pic-diff-bar">
        {DIFFICULTY_LEVELS.map(d => (
          <button
            key={d.id}
            className={`pic-diff-btn${difficulty === d.id ? ' pic-diff-btn--active' : ''}`}
            style={{ '--diff-color': d.color }}
            onClick={() => changeDifficulty(d.id)}
          >{d.label}</button>
        ))}
      </div>

      {/* Image frame */}
      <div className="pic-frame">
        {imgError ? (
          <div className="pic-img-fallback">
            <span className="pic-img-fallback-icon">🖼️</span>
            <p className="pic-img-fallback-text">{pic.alt}</p>
          </div>
        ) : (
          <img
            key={pic.src}
            src={pic.src}
            alt={pic.alt}
            className="pic-img"
            onError={() => setImgError(true)}
          />
        )}

        {/* Pointer overlays */}
        {!imgError && pic.pointers.map(ptr => {
          const isActive = ptrModal?.pointerId === ptr.id
          return (
            <button
              key={ptr.id}
              className={`pic-pointer${isActive ? ' pic-pointer--active' : ''}`}
              style={{ left: `${ptr.x}%`, top: `${ptr.y}%` }}
              onClick={e => handlePointerClick(ptr, e)}
              title="Tap to open question"
            >
              {ptr.label}
            </button>
          )
        })}

        {/* Image navigation overlaid on frame */}
        <button className="pic-img-arrow pic-img-arrow--left"  onClick={goPrevImg} disabled={imgIdx === 0}>‹</button>
        <button className="pic-img-arrow pic-img-arrow--right" onClick={goNextImg} disabled={imgIdx === filtered.length - 1}>›</button>

        {/* Image counter badge */}
        <div className="pic-img-badge">{imgIdx + 1} / {filtered.length}</div>
      </div>

      {/* Pointer modal — rendered via fixed positioning */}
      {ptrModal && visibleQs.length > 0 && (
        <PtrModal
          modal={ptrModal}
          allQuestions={visibleQs}
          onClose={() => setPtrModal(null)}
        />
      )}

      <h3 className="pic-title">{pic.title}</h3>

      {/* Mode toggle */}
      <div className="pic-mode-bar">
        <button
          className={`pic-mode-btn${picMode === 'questions' ? ' pic-mode-btn--active' : ''}`}
          onClick={() => setPicMode('questions')}
        >
          💬 Questions
        </button>
        <button
          className={`pic-mode-btn${picMode === 'guess' ? ' pic-mode-btn--active' : ''}`}
          onClick={() => setPicMode('guess')}
        >
          🎯 Guess the Question
        </button>
      </div>

      {/* Guess the Question mode */}
      {picMode === 'guess' && (
        <GuessTheQuestion pic={pic} visibleQs={visibleQs.length > 0 ? visibleQs : pic.questions} />
      )}

      {/* Question panel — only shown in questions mode */}
      {picMode === 'questions' && (
        visibleQs.length === 0 ? (
          <div className="pic-empty-diff">
            <span className="pic-empty-diff-icon">🔍</span>
            <p>No <strong>{DIFFICULTY_LEVELS.find(d => d.id === difficulty)?.label}</strong> questions for this image.</p>
            <p className="pic-empty-diff-hint">Try another image ← → or select a different difficulty above.</p>
          </div>
        ) : (
          <>
            <div className="pic-q-panel">
              {/* Question nav */}
              <div className="pic-q-nav">
                <button className="pic-q-nav-btn" onClick={goPrevQ} disabled={qIdx === 0}>← Prev</button>
                <span className="pic-q-counter">Question {qIdx + 1} of {visibleQs.length}</span>
                <button className="pic-q-nav-btn" onClick={goNextQ} disabled={qIdx === visibleQs.length - 1}>Next →</button>
              </div>

              {/* WH badge + question */}
              <div className="pic-wh-badge" style={{ '--wh-color': whColor }}>{question.wh || question.type}?</div>
              <div className="speak-row">
                <p className="pic-question">{question.q || question.text}</p>
                <SpeakBtn text={question.q || question.text} />
              </div>

              {/* Pointer hint */}
              {question.pointer && (
                <p className="pic-pointer-hint">
                  👆 See pointer <strong>{pic.pointers.find(p => p.id === question.pointer)?.label}</strong> on the image above
                </p>
              )}

              {/* Reveal */}
              {question.a ? (
                !revealed ? (
                  <button className="pic-reveal-btn" onClick={() => setRevealed(true)}>Show Answer</button>
                ) : (
                  <div className="pic-answer">
                    <div className="speak-row">
                      <p className="pic-answer-text">{question.a}</p>
                      <SpeakBtn text={question.a} />
                    </div>
                    <button
                      className="pic-reveal-btn pic-reveal-btn--next"
                      onClick={() => {
                        if (qIdx < visibleQs.length - 1) goNextQ()
                        else if (imgIdx < filtered.length - 1) goNextImg()
                      }}
                    >
                      {qIdx < visibleQs.length - 1 ? 'Next Question →' : imgIdx < filtered.length - 1 ? 'Next Picture →' : 'All done! 🎉'}
                    </button>
                  </div>
                )
              ) : (
                <p className="pic-pointer-hint">Discuss the answer aloud.</p>
              )}
            </div>

            {/* All visible questions quick-jump */}
            <div className="pic-q-dots">
              {visibleQs.map((q, i) => (
                <button
                  key={q.id || i}
                  className={`pic-q-dot${i === qIdx ? ' pic-q-dot--active' : ''}`}
                  style={{ '--dot-color': WH_COLOURS[q.wh || q.type] || '#888' }}
                  onClick={() => { setQIdx(i); setRevealed(false); setPtrModal(null) }}
                  title={`${q.wh || q.type}: ${(q.q || q.text || '').slice(0, 40)}…`}
                />
              ))}
            </div>
          </>
        )
      )}
    </div>
  )
}

// ── Altogether data ───────────────────────────────────────────────────────────
// ALL content sourced directly from Diya's therapy PDFs (21 PDFs total):
//   Riddles    → Items in the Fridge.rtf / Things in house.rtf (vocabulary)
//   WH Stories → "WH Question Stories with Illustrations.pdf" (standalone)
//                "Answering WH Questions From Short Text" (LT #10)
//                "Around the Community - WH Questions.pdf" (standalone)
//                WH Bundle #3 "Real Pictures WH Questions" (multiple choice)
//                WH Bundle #5 "Simple Dry Erase Flip Books" (answer banks)
//   Social     → OCR: Conversation Turn-Taking & Balance
//                OCR: Identifying and Using Sarcasm
//                OCR: Identifying Feelings & Emotions in Social Situations
//                OCR: Using Body Language to Identify Emotion
//                OCR: Conversational Responses Questions & Comments
//                OCR: Conversation Scripts Role Play Scenarios (#4)
//   Sequence   → OCR: Sequencing for Story Retell 3-6 Steps (LT #16)
//   Word Play  → "Daily Phonological Awareness Questions" (LT #26)
//                "Prefix + Suffix Activities" (LT #23)
//                "Early Describing and Categorizing Packet" (LT #27)
//                "Vocabulary Worksheets" (LT #21)
//                "One Sheet Real Picture Describing" (LT #24)
//   Directions → "Following Direction Task Cards to Get Your Students Moving"
//   Story      → "Summarizing Stories — Somebody Wanted But So Then" (LT #08)
//                "Identifying Story Grammar Parts — Expansion Pack" (LT #11)
//                "Learning Story Grammar Parts in Narratives" (LT #15)
//                "Creating Narratives with Real Pictures" (LT #17)
//   Sentences  → "Systematic Sentence Combining" (LT #01)
//                "Describing and Defining" (LT #20)

const ALTOGETHER_CATS = [
  { id: 'all',        label: 'All' },
  { id: 'riddles',    label: '🔍 Riddles' },
  { id: 'wh',         label: '❓ WH Questions' },
  { id: 'social',     label: '🤝 Social Skills' },
  { id: 'sequence',   label: '📋 Story Order' },
  { id: 'wordplay',   label: '🔤 Word Play' },
  { id: 'directions', label: '👆 Directions' },
  { id: 'story',      label: '📖 Story Skills' },
  { id: 'sentence',   label: '✏️ Sentences' },
  { id: 'reading',    label: '📚 Reading' },
  { id: 'textstruct', label: '🗂️ Text Structure' },
]

// Vocabulary sourced directly from Items in the Fridge.rtf
const ALTOGETHER = [
  // ── Riddles: fridge vocabulary (Items in the Fridge.rtf) ─────────────────
  { id: 'r1',  cat: 'riddles', type: 'riddle', emoji: '🍉',
    question: "I'm green on the outside and red and juicy on the inside. I'm full of black seeds and live in the fridge. What am I?",
    answer: 'Watermelon' },
  { id: 'r2',  cat: 'riddles', type: 'riddle', emoji: '🍲',
    question: "I'm a warm, golden South Indian lentil soup. I'm served with rice or idli and I come from the fridge after dinner. What am I?",
    answer: 'Sambar' },
  { id: 'r3',  cat: 'riddles', type: 'riddle', emoji: '🍅',
    question: "I'm red and round. I grow on a vine. Science calls me a fruit, but everyone cooks me as a vegetable. What am I?",
    answer: 'Tomato' },
  { id: 'r4',  cat: 'riddles', type: 'riddle', emoji: '🍌',
    question: "I'm yellow and curved. Peel me before you eat me. Monkeys are my biggest fans! What am I?",
    answer: 'Banana' },
  { id: 'r5',  cat: 'riddles', type: 'riddle', emoji: '🍇',
    question: "I grow in bunches on a vine. I'm small and round — green or purple. I live in the fridge. What am I?",
    answer: 'Grapes' },
  { id: 'r6',  cat: 'riddles', type: 'riddle', emoji: '🍫',
    question: "I'm brown, sweet, and melt in your mouth. I can be a bar, a chip, or a drink. Everyone loves me! What am I?",
    answer: 'Chocolate' },
  { id: 'r7',  cat: 'riddles', type: 'riddle', emoji: '🍓',
    question: "I'm small, red, and heart-shaped. Sweet and a little tangy. I live in the fridge and go great with cream. What am I?",
    answer: 'Strawberry' },
  { id: 'r8',  cat: 'riddles', type: 'riddle', emoji: '🫐',
    question: "I'm tiny, round, and blue-purple. I grow in clusters. I'm great in smoothies and muffins. What am I?",
    answer: 'Blueberry' },
  { id: 'r9',  cat: 'riddles', type: 'riddle', emoji: '🍆',
    question: "I'm purple and shiny. I look a bit like a big egg! I'm used in Indian curries. What am I?",
    answer: 'Eggplant' },
  { id: 'r10', cat: 'riddles', type: 'riddle', emoji: '🥟',
    question: "I'm a triangular fried snack stuffed with spiced potatoes. A popular Indian treat. What am I?",
    answer: 'Samosa' },
  { id: 'r11', cat: 'riddles', type: 'riddle', emoji: '🫓',
    question: "I'm soft and flat, made from flour, cooked on a tawa. I'm eaten with dal or curry. What am I?",
    answer: 'Roti' },
  { id: 'r12', cat: 'riddles', type: 'riddle', emoji: '🍦',
    question: "I'm cold, sweet, and creamy. You scoop me into a bowl or cone. Perfect on a hot day! What am I?",
    answer: 'Ice Cream' },
  { id: 'r13', cat: 'riddles', type: 'riddle', emoji: '🎃',
    question: "I'm big and orange. People carve faces on me for Halloween. I'm also a delicious soup! What am I?",
    answer: 'Pumpkin' },
  { id: 'r14', cat: 'riddles', type: 'riddle', emoji: '🍞',
    question: "I come in a loaf. You toast me in the morning. Spread butter or jam on me. What am I?",
    answer: 'Bread' },
  { id: 'r15', cat: 'riddles', type: 'riddle', emoji: '🫙',
    question: "I'm sweet and sticky. I come in a jar. Spread me on bread or roti. What am I?",
    answer: 'Jam' },

  // ── Riddles: living room vocabulary (Things in house.rtf) ────────────────
  { id: 'r16', cat: 'riddles', type: 'riddle', emoji: '📺',
    question: "I'm a big flat screen on the wall. You watch your favourite shows and movies on me. What am I?",
    answer: 'TV' },
  { id: 'r17', cat: 'riddles', type: 'riddle', emoji: '🛋️',
    question: "I'm soft and long. The whole family can sink into me to relax. I'm in the living room. What am I?",
    answer: 'Sofa' },
  { id: 'r18', cat: 'riddles', type: 'riddle', emoji: '🔊',
    question: "I'm a small smart speaker. You talk to me and I play music, answer questions, or set timers. What am I?",
    answer: 'Amazon Echo' },
  { id: 'r19', cat: 'riddles', type: 'riddle', emoji: '🪑',
    question: "I have four legs but can't walk. One person sits on me. I'm in the living room. What am I?",
    answer: 'Chair' },
  { id: 'r20', cat: 'riddles', type: 'riddle', emoji: '🔥',
    question: "I'm in the living room. On cold nights, a warm fire burns inside me. What am I?",
    answer: 'Fireplace' },

  // ── WH Questions — sourced from "WH Question Stories with Illustrations.pdf" ──
  { id: 'wh1', cat: 'wh', type: 'wh', wh: 'WHO',
    story: "Katie and Madison are at the beach. They are building a sandcastle. Katie wants to put seashells on the sandcastle. She looks under a bucket for seashells. 'Eek!' Katie screams. There is something under the bucket!",
    question: "WHO is under the bucket?",
    answer: "A crab! 🦀",
    explanation: "Katie screams because she finds a crab hiding under the bucket instead of seashells." },
  { id: 'wh2', cat: 'wh', type: 'wh', wh: 'WHERE',
    story: "Josh and Derek are playing in Derek's backyard. They are catching butterflies. Derek catches butterflies in a net. Josh catches butterflies in a jar. They look at the butterflies for a while. Then, they let them fly away into the sky.",
    question: "WHERE does Josh keep the butterflies he catches?",
    answer: "In a jar! 🫙",
    explanation: "Derek uses a net and Josh uses a jar — two different ways to catch the same things." },
  { id: 'wh3', cat: 'wh', type: 'wh', wh: 'WHAT',
    story: "Sarah and Noah are in the play room. Sarah is playing with a cat puppet. Noah's cat Whiskers walks over. She stands on the rug and looks at Sarah. Whiskers wants to play with the cat puppet too. She brings something over.",
    question: "WHAT does Whiskers bring over?",
    answer: "A ball of yarn! 🧶",
    explanation: "Whiskers the real cat wants to join the play — she brings yarn because she wants to play too." },
  { id: 'wh4', cat: 'wh', type: 'wh', wh: 'WHO',
    story: "The farmer was stacking hay. He put the hay into a big pile. Now the farmer is finished. He wants to get in his tractor and drive home. But something is in the way — it will not move!",
    question: "WHO is standing in front of the tractor?",
    answer: "A cow! 🐄",
    explanation: "A cow is blocking the farmer's path home. The cow won't move out of the way!" },
  { id: 'wh5', cat: 'wh', type: 'wh', wh: 'WHAT',
    story: "The children are ice skating on the lake. A little girl has a toy penguin. The other children are very surprised when they see it. The little girl puts her toy penguin on the ice. She holds his hand and pulls him along.",
    question: "WHAT is the toy penguin wearing that surprises everyone?",
    answer: "Real skates! ⛸️",
    explanation: "Everyone is surprised because the toy penguin is wearing actual ice skates — just like a real skater!" },
  { id: 'wh6', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "The class is outside at recess. They forgot to lock the mouse cage. The mouse gets out! He starts to crawl around the room. The mouse sniffs a backpack carefully.",
    question: "WHY is the mouse sniffing the backpack?",
    answer: "He is hungry and looking for food! 🐭",
    explanation: "The mouse escaped and is searching for something to eat by following the smell of food in the bags." },
  { id: 'wh7', cat: 'wh', type: 'wh', wh: 'WHO',
    story: "Kevin is reading in the living room. Anna wants to read a book too. There is a stack of books on the rug. Anna decides to choose a book. But there is something resting on top of all the books!",
    question: "WHO is sleeping on top of the books?",
    answer: "Kevin's cat! 🐱",
    explanation: "Anna can't reach the books easily because Kevin's cat has found a cozy spot right on top of them." },
  { id: 'wh8', cat: 'wh', type: 'wh', wh: 'WHERE',
    story: "George and Mason are swimming in the lake. They are having fun. Mason sees something green. 'Oh no, it’s a sea monster!' he yells. George laughs. 'It’s not a sea monster,' George says.",
    question: "WHERE is the frog that George can see?",
    answer: "On a lilypad! 🐸",
    explanation: "What looked like a scary sea monster to Mason was actually just a small frog sitting on a lilypad." },
  { id: 'wh9', cat: 'wh', type: 'wh', wh: 'WHERE',
    story: "The children are outside flying kites. The wind blows one kite away. It sails through the air and then lands somewhere unexpected. The dog runs around in circles and gets all tangled up in the kite string.",
    question: "WHERE does the kite land?",
    answer: "On the dog! 🐕",
    explanation: "The wind sends the kite straight onto the dog, who then runs around tangled in the string." },
  { id: 'wh10', cat: 'wh', type: 'wh', wh: 'WHO',
    story: "Today is Saturday. The children are playing in the backyard. Blake goes down the slide and will play on the swings next. Another boy named Jack is too tired to play. He finds a blanket and lies down.",
    question: "WHO takes a nap in the backyard?",
    answer: "Jack! 😴",
    explanation: "While Blake slides and swings, Jack is too tired to join in, so he curls up with a blanket for a nap." },
  { id: 'wh11', cat: 'wh', type: 'wh', wh: 'WHAT',
    story: "The boys are playing in the mud. They are pretending to dig for buried treasure. Ian finds something and puts it into his bucket. 'Did you find treasure?', the boys ask. Ian looks inside. It is not gold.",
    question: "WHAT did Ian actually find in the mud?",
    answer: "A snail! 🐌",
    explanation: "Ian thought he found treasure but it was really a snail — the boys were disappointed but it made a funny story!" },
  { id: 'wh12', cat: 'wh', type: 'wh', wh: 'WHAT',
    story: "Kelly is in the bathroom brushing her teeth. Oh no! Kelly drops the toothpaste on the floor. Now there is toothpaste on the floor. Kelly needs to clean up the mess.",
    question: "WHAT will Kelly use to clean up the mess?",
    answer: "A cloth! 🧹",
    explanation: "Kelly needs to get a cloth or rag to wipe up the toothpaste she spilled on the bathroom floor." },

  // ── WH Questions — sourced from "Answering WH Questions From Short Text" (LT Toolkit #10) ──
  { id: 'wh13', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "TIME FOR A WALK — One sunny Saturday morning, Jared decided to go for a walk. Normally he would spend the whole weekend in his room playing video games, but he wanted to make a change. He decided to enjoy some fresh air and nature. He saw birds, cool plants, and a tall colourful tree — and walked all the way to a park!",
    question: "WHY did Jared go for a walk instead of playing video games?",
    answer: "Because he wanted to be healthier! 🌳",
    explanation: "Jared made a positive choice to change his routine and enjoy fresh air and nature for his health." },
  { id: 'wh14', cat: 'wh', type: 'wh', wh: 'WHAT',
    story: "THE WINTER ROAD TRIP — The Anderson family took their yearly trip to Colorado in winter to see the snow and mountains. They stayed in a cabin in the woods. It was a 14-hour drive. The kids, Isaiah and Makayla, kept busy by playing 'I Spy' out the window.",
    question: "WHAT did Makayla see on the long drive to Colorado?",
    answer: "A black bear! 🐻",
    explanation: "While looking out the window during their long road trip, Makayla spotted an actual black bear — quite an exciting sight!" },
  { id: 'wh15', cat: 'wh', type: 'wh', wh: 'HOW',
    story: "MUSEUM DAY — Amy woke up and jumped out of bed — it was Saturday and she was going to the history museum with her friends! She has always loved fossils and history. Once there, everyone split into groups of four. Amy brought her camera and took lots of photos. When she got home, she had a special project waiting.",
    question: "HOW will Amy remember her fun museum day?",
    answer: "By making a scrapbook! 📸",
    explanation: "Amy took photos at the museum and turned them into a scrapbook so she'd always remember the memories." },
  { id: 'wh16', cat: 'wh', type: 'wh', wh: 'HOW',
    story: "ANDY AND JONAH — Andy couldn't wait for the school day to end. It was Friday and he had plans with his best friend Jonah — the skate park, the ice-cream shop, then a sleepover. Finally the last bell rang! They celebrated at the skate park by sharing a huge dish of chocolate cookie dough ice cream.",
    question: "HOW did Andy and Jonah get to the skate park?",
    answer: "They took the bus! 🚌",
    explanation: "The two friends hopped on a public bus together to travel from school to the skate park." },
  { id: 'wh17', cat: 'wh', type: 'wh', wh: 'HOW',
    story: "TRYOUTS — Henry promised his mom he would try out for every sports team at school. On Friday, August 2nd he tried soccer, basketball, and football — but didn't make any of them. At the last minute he decided to try one more sport. He ran to the locker room afterwards and looked at a list on the door.",
    question: "HOW did Henry find out he made the volleyball team?",
    answer: "He saw his name on the list! 📋",
    explanation: "After tryouts, Henry ran to the locker room door where the list of selected players was posted — and his name was on it!" },
  { id: 'wh18', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "SELLING LEMONADE — On a very hot summer day in July, William suddenly had a great idea. He set up a stand outside his house selling his mom's famous Sweet Strawberry Lemonade. By the end of the day he had made enough money to get what he wanted.",
    question: "WHY did William want to make money selling lemonade?",
    answer: "To buy a new game he'd been wanting! 🎮",
    explanation: "William came up with a clever plan to earn money himself rather than just asking — and it worked!" },
  { id: 'wh19', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "A BAD DAY — King had a really tough day. He was late to his first class, spilled juice on his clothes at lunch, and missed his bus so he had to walk home. All he wanted was a warm shower and sleep — but first he needed to sit at his desk and finish his homework, even when he felt like giving up.",
    question: "WHY did King have such a hard day?",
    answer: "He was late to class, spilled juice on himself, and missed his bus! 😤",
    explanation: "A series of unlucky events piled up on King — but even then he finished his homework, which shows great responsibility." },
  { id: 'wh20', cat: 'wh', type: 'wh', wh: 'HOW',
    story: "GAME NIGHT — Fred normally comes home from school, does homework, plays video games alone, and goes to sleep. His parents talked to him about spending more time with the family. Fred decided to skip video games and play a board game instead. He walked to the game closet to choose one.",
    question: "HOW did Fred pick which board game to play?",
    answer: "He closed his eyes and pointed to a random game! 🎲",
    explanation: "Fred made a fun, random choice by closing his eyes and pointing — the game turned out to be Monopoly, his family's favourite!" },

  // ── Social Skills (Social Skills Bundle: turn-taking, sarcasm, emotions, body language) ──
  { id: 's1', cat: 'social', type: 'choice',
    question: "Your friend is excitedly telling you about their favourite show. What is the BEST thing to do?",
    options: ["Look at your phone 📱", "Listen, nod, and ask a question 👍", "Interrupt and talk about your own show", "Walk away"],
    correct: 1,
    explanation: "Good listeners make eye contact, nod, and ask follow-up questions — this is turn-taking! 🎯" },
  { id: 's2', cat: 'social', type: 'choice',
    question: "Diya wants the TV remote, but her sibling is already watching. What should she do?",
    options: ["Grab it from them!", "\"Can I please have a turn when you're done?\" 😊", "Start crying loudly", "Turn the TV off"],
    correct: 1,
    explanation: "Asking politely with 'please' and waiting for your turn is always the right first step! 🌟" },
  { id: 's3', cat: 'social', type: 'choice',
    question: "A classmate walks in with droopy eyes and a big frown. How do they probably FEEL?",
    options: ["Happy and excited 😊", "Silly and playful 😜", "Sad or very tired 😢", "Hungry 🍕"],
    correct: 2,
    explanation: "Droopy eyes and a frown are body language clues for sadness or tiredness — reading faces matters!" },
  { id: 's4', cat: 'social', type: 'choice',
    question: "It's pouring rain. Dad says: \"Oh GREAT — perfect weather for our picnic!\" Is Dad being…?",
    options: ["Serious — he really loves rain", "Sarcastic — saying the opposite to be funny 😂", "Confused about the weather", "Angry 😡"],
    correct: 1,
    explanation: "Sarcasm = saying the OPPOSITE of what you mean, often with a funny or exaggerated tone." },
  { id: 's5', cat: 'social', type: 'choice',
    question: "Diya feels frustrated during a hard worksheet. What should she try FIRST?",
    options: ["Crumple the worksheet 😤", "Take three slow deep breaths 🌬️", "Scream loudly 😱", "Give up and go home"],
    correct: 1,
    explanation: "Deep breathing calms the nervous system so we can think clearly and try again! 💪" },
  { id: 's6', cat: 'social', type: 'choice',
    question: "Your friend just shared some exciting news. The BEST response is:",
    options: ["\"Whatever.\"", "\"Wow, tell me more! That's amazing!\" 🌟", "Change the subject to yourself", "Ignore them and check your phone"],
    correct: 1,
    explanation: "Showing genuine interest keeps the conversation going and makes your friend feel valued!" },
  { id: 's7', cat: 'social', type: 'choice',
    question: "Diya accidentally bumps into someone in the hallway. What should she say?",
    options: ["Nothing — keep walking", "\"I'm sorry! Are you okay?\" 😊", "Laugh at them", "Run away quickly"],
    correct: 1,
    explanation: "Apologising right away shows responsibility and empathy — two key social skills!" },
  { id: 's8', cat: 'social', type: 'choice',
    question: "Someone holds the door open for Diya. What should she do?",
    options: ["Walk through without a word", "Say \"Thank you!\" and smile 😊", "Ask why they're holding it", "Shake their hand formally"],
    correct: 1,
    explanation: "A simple 'Thank you' is polite, warm, and makes everyone feel good!" },
  { id: 's9', cat: 'social', type: 'choice',
    question: "Diya disagrees with what her friend said. The BEST way to handle it is:",
    options: ["Yell \"You're WRONG!\"", "\"I see it a bit differently — I think…\" 🤔", "Sulk and go silent", "Tell another friend behind their back"],
    correct: 1,
    explanation: "Sharing disagreement calmly with 'I think…' keeps the friendship strong and conversation going." },

  // ── Story Sequences (Language Therapy Toolkit: sequencing for story retell) ──
  { id: 'seq1', cat: 'sequence', type: 'sequence', emoji: '🍞',
    title: "Diya Makes Toast with Jam",
    scrambled: ["Spread jam on the toast 🍓", "Get two slices of bread 🍞", "Wait for it to pop up ⏱️", "Take a yummy bite! 😋", "Put the bread in the toaster 🔌"],
    answer:    ["Get two slices of bread 🍞", "Put the bread in the toaster 🔌", "Wait for it to pop up ⏱️", "Spread jam on the toast 🍓", "Take a yummy bite! 😋"] },
  { id: 'seq2', cat: 'sequence', type: 'sequence', emoji: '☀️',
    title: "Diya's Morning Routine",
    scrambled: ["Eat breakfast 🥣", "Get dressed 👗", "Wake up 😴", "Go to school 🎒", "Brush teeth 🪥"],
    answer:    ["Wake up 😴", "Brush teeth 🪥", "Get dressed 👗", "Eat breakfast 🥣", "Go to school 🎒"] },
  { id: 'seq3', cat: 'sequence', type: 'sequence', emoji: '🌳',
    title: "A Trip to the Park",
    scrambled: ["Play on the swings 🎡", "Put on shoes 👟", "Drink water when thirsty 💧", "Walk to the park 🚶", "Walk back home 🏠"],
    answer:    ["Put on shoes 👟", "Walk to the park 🚶", "Play on the swings 🎡", "Drink water when thirsty 💧", "Walk back home 🏠"] },
  { id: 'seq4', cat: 'sequence', type: 'sequence', emoji: '🌙',
    title: "Diya's Bedtime Routine",
    scrambled: ["Put on pyjamas 👕", "Read a bedtime story 📖", "Go to sleep 😴", "Take a bath 🛁", "Brush teeth 🪥"],
    answer:    ["Take a bath 🛁", "Put on pyjamas 👕", "Brush teeth 🪥", "Read a bedtime story 📖", "Go to sleep 😴"] },
  { id: 'seq5', cat: 'sequence', type: 'sequence', emoji: '🍲',
    title: "Putting Away Leftover Sambar",
    scrambled: ["Put the container in the fridge 🧊", "Wait for it to cool down a little ⏳", "Find a clean container with a lid 🥡", "Pour the sambar in 🍲", "Label it with the date 🗓️"],
    answer:    ["Find a clean container with a lid 🥡", "Pour the sambar in 🍲", "Wait for it to cool down a little ⏳", "Label it with the date 🗓️", "Put the container in the fridge 🧊"] },
  { id: 'seq6', cat: 'sequence', type: 'sequence', emoji: '🛒',
    title: "A Quick Trip to the Store",
    scrambled: ["Pay for your items 💳", "Put on shoes and grab a bag 👟", "Find everything on the list 🛒", "Write a shopping list 📝", "Head back home 🏠"],
    answer:    ["Write a shopping list 📝", "Put on shoes and grab a bag 👟", "Find everything on the list 🛒", "Pay for your items 💳", "Head back home 🏠"] },
  { id: 'seq7', cat: 'sequence', type: 'sequence', emoji: '🤝',
    title: "Meeting Someone New",
    scrambled: ["Shake hands or wave 🤝", "Walk over and smile 😊", "Ask them a question to keep talking 💬", "Say your name 👋", "Listen to their name"],
    answer:    ["Walk over and smile 😊", "Say your name 👋", "Shake hands or wave 🤝", "Listen to their name", "Ask them a question to keep talking 💬"] },

  // ── Word Play — sourced from "Daily Phonological Awareness Questions" (LT Toolkit #26) ──
  // Questions taken verbatim from the January–February daily challenges (Levels 1–3)
  { id: 'wp1', cat: 'wordplay', type: 'wordplay', emoji: '🎵',
    question: "RHYME — Name a word that rhymes with 'way'.",
    answer: "day, say, play, may, bay, hay, ray, pay… 🎵\n(Any real word that ends with the -ay sound!)" },
  { id: 'wp2', cat: 'wordplay', type: 'wordplay', emoji: '👏',
    question: "SYLLABLES — How many syllables are in the word 'basketball'?",
    answer: "3 syllables! bas · ket · ball 👏👏👏",
    visual: ['bas', 'ket', 'ball'] },
  { id: 'wp3', cat: 'wordplay', type: 'wordplay', emoji: '🔤',
    question: "FIRST SOUND — What is the first sound in the word 'boy'?",
    answer: "/b/ — the word 'boy' starts with the /b/ sound 🔤" },
  { id: 'wp4', cat: 'wordplay', type: 'wordplay', emoji: '🔤',
    question: "LAST SOUND — What is the last sound in the word 'dog'?",
    answer: "/g/ — the word 'dog' ends with the /g/ sound 🐕" },
  { id: 'wp5', cat: 'wordplay', type: 'wordplay', emoji: '🧩',
    question: "BLENDING — What word is this? c – a – t",
    answer: "CAT! 🐱\nBlending the sounds /k/ + /a/ + /t/ = 'cat'" },
  { id: 'wp6', cat: 'wordplay', type: 'wordplay', emoji: '➕',
    question: "ADD A SOUND — Say 'top'. Now add /s/ to the beginning. What new word do you make?",
    answer: "STOP! 🛑\nAdding /s/ to the front of 'top' makes the new word 'stop'." },
  { id: 'wp7', cat: 'wordplay', type: 'wordplay', emoji: '✂️',
    question: "DELETE A SOUND — Say 'feet' without the /f/. What word is left?",
    answer: "EAT! 🍽️\nTaking /f/ off the front of 'feet' leaves just 'eat'." },
  { id: 'wp8', cat: 'wordplay', type: 'wordplay', emoji: '🔄',
    question: "CHANGE A SOUND — Say 'bat'. Now change /b/ to /h/. What new word?",
    answer: "HAT! 🎩\nSwapping the first sound from /b/ to /h/ turns 'bat' into 'hat'." },
  { id: 'wp9', cat: 'wordplay', type: 'wordplay', emoji: '🎵',
    question: "RHYME — Name a word that rhymes with 'map'.",
    answer: "cap, clap, gap, nap, rap, sap, tap, zap, snap, trap… 🎵\n(Any real word that ends with the -ap sound!)" },
  { id: 'wp10', cat: 'wordplay', type: 'wordplay', emoji: '🔢',
    question: "SEGMENT — Tell me all the sounds in the word 'hand'.",
    answer: "/h/ – /a/ – /n/ – /d/ — four sounds! ✋\n(Notice 'hand' has 4 letters AND 4 sounds.)" },
  { id: 'wp11', cat: 'wordplay', type: 'wordplay', emoji: '👏',
    question: "SYLLABLES — How many syllables are in the word 'January'?",
    answer: "4 syllables! Jan · u · ar · y 👏👏👏👏",
    visual: ['Jan', 'u', 'ar', 'y'] },
  { id: 'wp12', cat: 'wordplay', type: 'wordplay', emoji: '🧩',
    question: "BLENDING — What word is this? t – ab",
    answer: "TAB! 🏷️\nBlending the onset /t/ with the rime '-ab' makes 'tab'." },
  { id: 'wp13', cat: 'wordplay', type: 'wordplay', emoji: '➕',
    question: "ADD A SOUND — Say 'ox'. Now add /b/ to the beginning. What new word?",
    answer: "BOX! 📦\nAdding /b/ to the front of 'ox' makes the new word 'box'." },
  { id: 'wp14', cat: 'wordplay', type: 'wordplay', emoji: '🔄',
    question: "CHANGE A SOUND — Say 'fed'. Now change /f/ to /b/. What new word?",
    answer: "BED! 🛏️\nSwapping /f/ for /b/ at the start turns 'fed' into 'bed'." },
  { id: 'wp15', cat: 'wordplay', type: 'wordplay', emoji: '👏',
    question: "SYLLABLES — How many syllables are in 'alligator'?",
    answer: "4 syllables! al · li · ga · tor 👏👏👏👏",
    visual: ['al', 'li', 'ga', 'tor'] },

  // ── Following Directions — sourced from "Action Directions! Task Cards" PDF ──
  // Cards use: actions, body parts, colours, shapes, animals, temporal terms
  { id: 'd1', cat: 'directions', type: 'directions', emoji: '👆',
    instruction: "Three steps — do them in order:\n\n1️⃣ Touch your toes\n2️⃣ Touch your nose\n3️⃣ Say your favourite colour out loud!",
    confirmText: "I did all 3! ✓" },
  { id: 'd2', cat: 'directions', type: 'directions', emoji: '🐰',
    instruction: "Two silly steps:\n\n1️⃣ Hop like a bunny three times\n2️⃣ Then spin around once and sit back down",
    confirmText: "Hop, spin, sit! ✓" },
  { id: 'd3', cat: 'directions', type: 'directions', emoji: '⏰',
    instruction: "TEMPORAL direction — listen carefully!\n\nBEFORE you jump twice, clap your hands 3 times.\n\n(Do the clapping first!)",
    confirmText: "Clap 3 times, then jump! ✓" },
  { id: 'd4', cat: 'directions', type: 'directions', emoji: '🎭',
    instruction: "Pretend play — two steps:\n\n1️⃣ Pretend you're swimming for 5 seconds 🏊\n2️⃣ Then pretend to eat ice cream 🍦",
    confirmText: "Swim, then ice cream! ✓" },
  { id: 'd5', cat: 'directions', type: 'directions', emoji: '🎯',
    instruction: "Do ONLY the SECOND action in this list:\n\nA) Run in place\nB) Raise one hand and say your name 🙋\nC) Make a silly face",
    confirmText: "I raised my hand and said my name! ✓" },
  { id: 'd6', cat: 'directions', type: 'directions', emoji: '🔁',
    instruction: "TEMPORAL direction:\n\nAFTER you count to 3 out loud, stand up.\nTHEN point to your shoulder, then sit back down.",
    confirmText: "Count, stand, shoulder, sit! ✓" },
  { id: 'd7', cat: 'directions', type: 'directions', emoji: '🤫',
    instruction: "Do these QUIETLY with no talking:\n\n1️⃣ Point to something you can sit on\n2️⃣ Point to something that gives light\n3️⃣ Give a thumbs up 👍",
    confirmText: "Done quietly! ✓" },

  // ── WH Questions — Community Scenes ("Around the Community - WH Questions.pdf") ──
  { id: 'wh21', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "GROCERY STORE — You are at the grocery store. A worker is wearing a nametag and an apron. There are baskets and carts available. The produce section has a scale for weighing fruits and vegetables. The cashier hands you a paper after you pay.",
    question: "WHY do we get a receipt from the cashier?",
    answer: "So we can see what we bought and how much everything cost! 🧾",
    explanation: "A receipt is a record of your purchase. It helps you check for mistakes and keep track of spending." },
  { id: 'wh22', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "RESTAURANT — You sit down at a restaurant. A waiter comes over right away. Before ordering, you look at a booklet with all the food and drink choices listed.",
    question: "WHY do we look at a menu at a restaurant?",
    answer: "To choose what food and drink we want to order! 🍽️",
    explanation: "Menus show all the options available and their prices so you can decide what to get." },
  { id: 'wh23', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "PARK — People are jogging, walking dogs, and playing on the playground. Several dogs are walking with their owners. A park ranger is also there.",
    question: "WHY do people put their dogs on leashes at the park?",
    answer: "To keep the dog under control and keep everyone safe! 🐕",
    explanation: "Leashes stop dogs from running at other people or animals — it protects the dog and everyone around it." },
  { id: 'wh24', cat: 'wh', type: 'wh', wh: 'WHAT',
    story: "HOSPITAL — A patient has a broken leg. The doctor checks the X-ray and explains the treatment. The bone needs to be held firmly in place while it heals.",
    question: "WHAT is placed on a broken leg to keep the bones in place?",
    answer: "A cast! 🦴",
    explanation: "A cast is a hard shell (usually plaster or fibreglass) that holds the broken bone still so it heals correctly." },
  { id: 'wh25', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "ZOO — The animals live in large enclosures with fences. Lions, zebras, and giraffes are all visible from the paths. Visitors walk along safe pathways to view them.",
    question: "WHY are the animals at the zoo kept within fences?",
    answer: "To keep the animals safe AND protect the visitors! 🦁",
    explanation: "Fences stop animals from escaping into the city, and keep curious visitors at a safe distance." },
  { id: 'wh26', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "POST OFFICE — People line up to send letters and packages. The worker has a scale on the counter. All envelopes must have a small printed sticker on them before they can be mailed.",
    question: "WHY do we use stamps on envelopes?",
    answer: "To pay for the cost of delivering the letter! 💌",
    explanation: "A stamp is proof of payment. It tells the postal service that the sender has paid the delivery fee." },
  { id: 'wh27', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "LIBRARY — The library is very quiet. People are reading, studying, and working on computers. A librarian is reading aloud to a group of children.",
    question: "WHY must you be quiet in a library?",
    answer: "Because people are reading, studying, and concentrating — noise is disruptive! 📚",
    explanation: "Libraries are shared spaces for focus and learning. Being quiet shows respect for everyone there." },
  { id: 'wh28', cat: 'wh', type: 'wh', wh: 'WHO',
    story: "HAIR SALON — One person is sweeping the floor. A stylist is cutting someone's hair. Another person is having their hair washed. There are scissors, a hairdryer, and magazines in the waiting area.",
    question: "WHO is sweeping the hair off the floor?",
    answer: "The salon assistant or junior stylist! 💈",
    explanation: "In a salon, someone sweeps up cut hair between clients so the floor stays clean and safe to walk on." },

  // ── WH multiple-choice — WH Bundle #3 "Real Pictures WH Questions" ──
  { id: 'wh29', cat: 'wh', type: 'choice',
    question: "WHERE is the bus going? Look at the picture clues: children with backpacks, books, lunchboxes.",
    options: ["To the zoo 🦒", "To the school 🏫", "To the mall 🛍️", "To the park 🌳"],
    correct: 1,
    explanation: "Children carrying backpacks and lunchboxes are a clue they are going to school!" },
  { id: 'wh30', cat: 'wh', type: 'choice',
    question: "WHO do you see? They wear scrubs, use dental tools, and ask you to open wide.",
    options: ["A doctor 🩺", "A police officer 👮", "A dentist 🦷", "A nurse 💉"],
    correct: 2,
    explanation: "Dentists wear scrubs and use special tools to check and clean your teeth." },

  // ── WH fill-in — WH Bundle #5 "Simple Dry Erase Flip Books" (answer bank items) ──
  { id: 'wh31', cat: 'wh', type: 'choice',
    question: "WHO saves you from drowning at a swimming pool?",
    options: ["A doctor 🩺", "A police officer 👮", "A chef 👨‍🍳", "A lifeguard 🏊"],
    correct: 3,
    explanation: "Lifeguards are specially trained to watch over swimmers and perform rescues if needed." },
  { id: 'wh32', cat: 'wh', type: 'choice',
    question: "WHEN do you wear a bathing suit?",
    options: ["In winter ❄️", "When it's cold 🧥", "In the summer or when swimming 🏖️", "At bedtime 🌙"],
    correct: 2,
    explanation: "Bathing suits are worn for swimming or at the beach — usually in warm weather or summer!" },

  // ── Social Skills — OCR: Sarcasm ("Identifying and Using Sarcasm.pdf") ──
  { id: 's10', cat: 'social', type: 'choice',
    question: "Greg is leaning against his car with a FLAT TIRE. He says: 'Awesome. My tire is flat and I need to be at work in 15 minutes.' Is Greg being...?",
    options: ["Serious — he thinks the flat tyre is great 😀", "Sarcastic — he means the OPPOSITE: this is terrible 😤", "Confused about the tyre 🤔", "Excited about being late 😄"],
    correct: 1,
    explanation: "Greg says 'Awesome' but he's clearly in a stressful situation. When tone doesn't match context, it's sarcasm — he means the opposite of what he says." },
  { id: 's11', cat: 'social', type: 'choice',
    question: "At a parade, a loud marching band plays right in front of Aunt Mary. She says: 'They're so quiet! I can hardly hear them.' Is Aunt Mary being...?",
    options: ["Serious — the band is playing softly 🎵", "Confused about the music 🤔", "Sarcastic — the band is actually VERY LOUD 🥁", "Angry at the parade 😡"],
    correct: 2,
    explanation: "A marching band is never quiet! Aunt Mary is saying the OPPOSITE of what she means — that's sarcasm." },
  { id: 's12', cat: 'social', type: 'choice',
    question: "At a long, dull staff meeting, a friend whispers: 'This meeting is just SO interesting. I'm about to fall asleep.' Is the friend being...?",
    options: ["Serious — they love the meeting 😄", "Confused about the meeting 🤔", "Sarcastic — the meeting is BORING 😴", "Happy they came 😊"],
    correct: 2,
    explanation: "Saying something is 'SO interesting' while also saying they're falling asleep is a big sarcasm clue! The words and the feeling don't match." },
  { id: 's13', cat: 'social', type: 'choice',
    question: "At a family game night, everyone is laughing. Your brother says: 'This game is fun! I want to take it to the sleepover tomorrow.' Is he being...?",
    options: ["Sarcastic — he hates the game 😤", "Serious — he genuinely likes the game and wants to bring it 😊", "Confused about the game 🤔", "Angry 😡"],
    correct: 1,
    explanation: "Everyone IS having fun, so the words match the situation. This is NOT sarcasm — he truly means it! Context matters." },

  // ── Social Skills — OCR: Identifying Feelings ("Identifying Feelings and Emotions.pdf") ──
  { id: 's14', cat: 'social', type: 'choice',
    question: "Marcus comes stomping downstairs. 'I said you couldn't borrow my baseball mitt! The big game is in one hour and my lucky glove is missing!' How does Marcus FEEL?",
    options: ["Happy and calm 😊", "Silly and playful 😜", "Angry and furious 😤", "Surprised and thrilled 🤩"],
    correct: 2,
    explanation: "Stomping, a raised voice, and the word 'I SAID you couldn't' are all signs that Marcus is very angry and frustrated." },
  { id: 's15', cat: 'social', type: 'choice',
    question: "Norah is fidgeting with her sleeve. She says: 'Today is the audition for the spring play. I'm trying out for the lead role. I just can't wait until it's over!' How does Norah FEEL?",
    options: ["Bored and impatient ⏰", "Anxious and nervous 😰", "Excited and confident 💪", "Angry 😡"],
    correct: 1,
    explanation: "Fidgeting + wanting it to be over + a big high-stakes event = anxiety. Norah is nervous, even though she might also be a little excited." },
  { id: 's16', cat: 'social', type: 'choice',
    question: "Camille thought she'd done badly at the softball tryout because she felt sick. The coach reads names aloud. When Camille hears her own name, her eyes go wide and she says: 'What?!' How does Camille FEEL?",
    options: ["Sad and disappointed 😢", "Angry at the coach 😡", "Surprised and thrilled 🤩", "Bored 😑"],
    correct: 2,
    explanation: "Wide eyes, 'What?!' and an unexpected good outcome = surprised and thrilled. She made the team despite thinking she'd failed!" },
  { id: 's17', cat: 'social', type: 'choice',
    question: "Kelsey is sitting on a bench at the library, fidgeting with her backpack zipper and glancing at the clock every few minutes. 'I've already been waiting 15 minutes.' How does Kelsey FEEL?",
    options: ["Excited about her wait 😄", "Happy and relaxed 😊", "Impatient and bored ⏱️", "Frightened 😨"],
    correct: 2,
    explanation: "Fidgeting + clock-watching + mentioning she's been waiting = classic signs of impatience and boredom." },

  // ── Social Skills — OCR: Conversation Turn-Taking ──
  { id: 's18', cat: 'social', type: 'choice',
    question: "Jill spends 3 full minutes talking about her history test — Julius Caesar, grades, paper scores — while Mark stands there and barely gets a word in. What is the PROBLEM with this conversation?",
    options: ["Mark is being too rude by listening quietly", "Jill is talking far too much — the conversation is unbalanced 🔊", "They are talking about the wrong topic", "Mark should walk away immediately"],
    correct: 1,
    explanation: "Balanced conversations mean BOTH people talk roughly the same amount. Jill is dominating — Mark feels ignored or bored. She should stop and ask Mark something!" },
  { id: 's19', cat: 'social', type: 'choice',
    question: "Shane tries to keep a conversation going by sharing things. Cole keeps responding with just 'Yeah.' every time. What is the PROBLEM?",
    options: ["Shane is talking too much 🔊", "Cole is not contributing enough — the conversation feels one-sided 🤐", "They are talking about a bad topic", "There is nothing wrong — short answers are fine"],
    correct: 1,
    explanation: "Conversation takes two! When one person says only 'Yeah' over and over, the other person feels unheard and the conversation dies. Cole needs to add more." },
  { id: 's20', cat: 'social', type: 'choice',
    question: "Someone says to you: 'I got a new phone!' What is the BEST way to respond?",
    options: ["'Okay.' and look away 😶", "'Whatever, I got one too.' and walk off 🚶", "'Oh cool! What kind did you get? What do you like about it?' 📱", "Tell a long story about your own phone"],
    correct: 2,
    explanation: "Asking a follow-up question shows genuine interest and keeps the conversation going — exactly what the Taking Turns Q&A toolkit recommends!" },

  // ── Sequence — OCR: "Sequencing for Story Retell 3–6 Steps" (LT #16) ──
  // Replacing hand-adapted sequences with REAL stories from the PDF
  { id: 'seq1', cat: 'sequence', type: 'sequence', emoji: '🏖️',
    title: "Elijah's Sandcastles (from Sequencing PDF)",
    scrambled: ["A big wave splashed right on top of him 🌊", "His castle was ruined and he was completely soaked! 😱", "Elijah was happily building sandcastles on the beach 🏖️"],
    answer:    ["Elijah was happily building sandcastles on the beach 🏖️", "A big wave splashed right on top of him 🌊", "His castle was ruined and he was completely soaked! 😱"] },
  { id: 'seq2', cat: 'sequence', type: 'sequence', emoji: '🚴',
    title: "Evelyn's Bike Ride (from Sequencing PDF)",
    scrambled: ["She put on her helmet and went for a bike ride 🚴", "She hit a rock going downhill and fell, hurting her knee 🤕", "Her mum came out and gave her a band-aid 🩹", "She started to cry — her knee hurt badly 😢", "With the band-aid on, Evelyn finally felt better 😊"],
    answer:    ["She put on her helmet and went for a bike ride 🚴", "She hit a rock going downhill and fell, hurting her knee 🤕", "She started to cry — her knee hurt badly 😢", "Her mum came out and gave her a band-aid 🩹", "With the band-aid on, Evelyn finally felt better 😊"] },
  { id: 'seq3', cat: 'sequence', type: 'sequence', emoji: '🍓',
    title: "Making Jam (from Sequencing PDF)",
    scrambled: ["Got a berry-picking basket 🧺", "Cooked the berries on the stove with sugar 🍯", "Picked the berries off the bush 🍓", "Put the finished jam into jars 🫙", "Brought berries home and washed them 🚿"],
    answer:    ["Got a berry-picking basket 🧺", "Picked the berries off the bush 🍓", "Brought berries home and washed them 🚿", "Cooked the berries on the stove with sugar 🍯", "Put the finished jam into jars 🫙"] },
  { id: 'seq4', cat: 'sequence', type: 'sequence', emoji: '🌱',
    title: "Planting Seeds (from Sequencing PDF)",
    scrambled: ["Covered seeds with dirt and watered them 💧", "Saw tiny seedlings sprouting a few days later 🌱", "Dug small holes in the ground ⛏️", "Placed seeds carefully into the holes 🌾"],
    answer:    ["Dug small holes in the ground ⛏️", "Placed seeds carefully into the holes 🌾", "Covered seeds with dirt and watered them 💧", "Saw tiny seedlings sprouting a few days later 🌱"] },
  { id: 'seq5', cat: 'sequence', type: 'sequence', emoji: '🏕️',
    title: "Going Camping (from Sequencing PDF)",
    scrambled: ["Gathered sticks and lit a campfire 🔥", "Curled up in a sleeping bag and went to sleep 😴", "Hiked through the woods to reach the campsite 🌲", "Set up the tent at the campsite ⛺", "Roasted marshmallows over the hot fire 🍡"],
    answer:    ["Hiked through the woods to reach the campsite 🌲", "Set up the tent at the campsite ⛺", "Gathered sticks and lit a campfire 🔥", "Roasted marshmallows over the hot fire 🍡", "Curled up in a sleeping bag and went to sleep 😴"] },
  { id: 'seq6', cat: 'sequence', type: 'sequence', emoji: '🎪',
    title: "Sivi at the Carnival (from Sequencing PDF)",
    scrambled: ["Paid the worker to play the dart game 🎟️", "Won a giant teddy bear! 🧸", "Aimed and threw his dart — it missed and hit the wall 😬", "Wanted to play the dart game at the carnival 🎪", "Threw again — popped a balloon! 🎉"],
    answer:    ["Wanted to play the dart game at the carnival 🎪", "Paid the worker to play the dart game 🎟️", "Aimed and threw his dart — it missed and hit the wall 😬", "Threw again — popped a balloon! 🎉", "Won a giant teddy bear! 🧸"] },
  { id: 'seq7', cat: 'sequence', type: 'sequence', emoji: '🦷',
    title: "Laila and the Tooth Fairy (from Sequencing PDF)",
    scrambled: ["Woke up to find the tooth fairy had left money! 💰", "Had a very wiggly tooth 🦷", "The tooth fairy came in the night 🧚", "Took a big bite of a crunchy apple — tooth popped out! 🍎", "Put the tooth under her pillow and fell asleep 😴"],
    answer:    ["Had a very wiggly tooth 🦷", "Took a big bite of a crunchy apple — tooth popped out! 🍎", "Put the tooth under her pillow and fell asleep 😴", "The tooth fairy came in the night 🧚", "Woke up to find the tooth fairy had left money! 💰"] },

  // ── Word Play — LT #23 "Prefix + Suffix Activities" ──
  { id: 'wp16', cat: 'wordplay', type: 'wordplay', emoji: '🔄',
    question: "PREFIX: What does RE- mean? Give 3 example words.",
    answer: "RE- means AGAIN!\nExamples: rebuild (build again), replay (play again), refill (fill again), rewrite (write again) 🔁" },
  { id: 'wp17', cat: 'wordplay', type: 'wordplay', emoji: '🔤',
    question: "Break down UNFRIENDLY into its parts: prefix + base word + suffix. What does each part mean?",
    answer: "UN- (not) + FRIEND (base word) + -LY (in a way that is like)\n= 'not in a way that is like a friend' = mean or rude 😒" },
  { id: 'wp18', cat: 'wordplay', type: 'wordplay', emoji: '🔬',
    question: "PREFIX: What does MICRO- mean? Name 3 words that use it.",
    answer: "MICRO- means SMALL!\nmicrophone (small + voice), microwave (small waves), microscope (small + look) 🔭" },
  { id: 'wp19', cat: 'wordplay', type: 'wordplay', emoji: '📝',
    question: "Break down RESEARCHER into its parts: prefix + base + suffix. What does each part mean?",
    answer: "RE- (again) + SEARCH (base: look for) + -ER (a person who)\n= 'a person who searches for information again and again' 🔎" },
  { id: 'wp20', cat: 'wordplay', type: 'wordplay', emoji: '🦸',
    question: "What does the prefix SUPER- mean? Which of these words uses it? superhero / sunshine / subway",
    answer: "SUPER- means ABOVE or MORE THAN NORMAL!\nSUPERHERO = super (above normal) + hero ✅\n(sunshine and subway use 'sun' and 'sub', different prefixes!)" },

  // ── Word Play — LT #27 "Early Describing and Categorizing" ──
  { id: 'wp21', cat: 'wordplay', type: 'wordplay', emoji: '🗂️',
    question: "CATEGORY: Bee, butterfly, ant, grasshopper, beetle, ladybug — what do they all have in common?",
    answer: "They're all INSECTS! 🦋🐜\n(6 legs, usually small, many have wings — insects live everywhere)" },
  { id: 'wp22', cat: 'wordplay', type: 'wordplay', emoji: '🗂️',
    question: "CATEGORY: Car, bus, airplane, train, boat, motorcycle, helicopter — what do they all have in common?",
    answer: "They're all VEHICLES! ✈️🚌\n(Things that carry people or goods from one place to another)" },
  { id: 'wp23', cat: 'wordplay', type: 'wordplay', emoji: '📍',
    question: "PLACE: Where in the world would you find these? Fish · Ice cream · Nails · A baby",
    answer: "Fish → in the water or at a fish shop 🐟\nIce cream → in the freezer 🍦\nNails → in a toolbox 🔨\nA baby → in a crib or bedroom 👶" },

  // ── Word Play — LT #21 "Vocabulary Worksheets" ──
  { id: 'wp24', cat: 'wordplay', type: 'wordplay', emoji: '💬',
    question: "VOCABULARY: What does ADORE mean? Use it in a sentence about something you love.",
    answer: "ADORE = to love something (or someone) very much!\nSimilar words: love, cherish 💛\nExample: 'Diya adores music and dancing.'" },
  { id: 'wp25', cat: 'wordplay', type: 'wordplay', emoji: '💬',
    question: "VOCABULARY: What does ALLOW mean? Name something your school ALLOWS, and something it does NOT allow.",
    answer: "ALLOW = to let somebody have or do something\nSimilar: permit, let\nExample: 'My school allows eating in the cafeteria but does not allow running in the hallways.' 🏫" },

  // ── Word Play — LT #24 "One Sheet Real Picture Describing" ──
  { id: 'wp26', cat: 'wordplay', type: 'wordplay', emoji: '🍌',
    question: "DESCRIBE a BANANA using G-A-P-P-L-U: Group · Action · Place · Parts · Looks Like · Unique",
    answer: "Group: It's a FRUIT 🍌\nAction: You EAT it / peel it\nPlace: Grocery store, fridge, lunchbox\nParts: Yellow peel, soft inside flesh\nLooks like: Curved, yellow, medium sized\nUnique: Monkeys love it! Goes brown when ripe." },

  // ── Story Skills — SWBST & Story Grammar (LT #08, #11, #15) ──
  { id: 'story1', cat: 'story', type: 'wh', wh: 'SOMEBODY',
    story: "THE SCHOOL PROJECT — Kiara heard about the big project all year: every student had to create a special newspaper about their favourite animal. She chose baby seals and had special paper ready. But she kept putting it off — visiting friends, volleyball practice, watching movies. The night before it was due she hadn't started. She worked until 2am. The printer broke. Her drawing wasn't good. She finished the rushed project and turned it in. The other kids had beautiful newspapers. Kiara got a bad grade.",
    question: "SOMEBODY — Who is this story about, and what did she WANT to do?",
    answer: "Kiara! She wanted to create a great newspaper about baby seals. 🦭",
    explanation: "In the SWBST framework: SOMEBODY = the main character. WANTED = their goal. Kiara's goal was a great newspaper." },
  { id: 'story2', cat: 'story', type: 'wh', wh: 'BUT',
    story: "THE SCHOOL PROJECT — (Same Kiara story above) Despite having all the materials she needed, Kiara kept finding reasons to put the project off. She went to her friend's house, then volleyball practice, then watched a movie. Day after day passed.",
    question: "BUT — What was the PROBLEM that got in Kiara's way?",
    answer: "She kept procrastinating (putting it off)! Then the night before, her printer broke and her drawing wasn't good. 😟",
    explanation: "'But' = the obstacle. Kiara's obstacle was her own procrastination, plus last-minute technical problems." },
  { id: 'story3', cat: 'story', type: 'wh', wh: 'SOLUTION',
    story: "RUNNING LATE — Oliver kept sleeping through his alarm. His mum was upset he'd been late three times that week. Plan 1: he moved the alarm clock across the room so he had to get up to turn it off. He got up, turned it off — then sat back down and fell asleep again! Plan 2: he borrowed his mum's old clock and set TWO alarms, 5 minutes apart.",
    question: "SOLUTION — Which plan finally worked, and WHY?",
    answer: "Plan 2 worked! Setting TWO alarms 5 minutes apart — the second alarm made him jump up and stay awake. ⏰",
    explanation: "A solution is the plan that actually fixes the problem. The 'failed action' (Plan 1) is important — it shows not every plan works on the first try." },
  { id: 'story4', cat: 'story', type: 'wh', wh: 'FEELINGS',
    story: "LOST IN THE WOODS — Liana was camping and went exploring after breakfast. She got distracted picking up a leaf, a rock, and a pinecone. After a while, nothing looked familiar — she had wandered far from the creek. She felt shaky and her heart raced. Then she remembered what her mum had taught her. She reached into her pocket, pulled something out, and blew it over and over.",
    question: "FEELINGS — How did Liana feel when she realised she was lost? How did she feel after?",
    answer: "Lost: nervous, scared, shaky 😨\nAfter: relieved and safe once her mum found her! 😌",
    explanation: "Tracking how characters' feelings CHANGE through a story is a key story grammar skill — feelings show us the emotional journey." },
  { id: 'story5', cat: 'story', type: 'wh', wh: 'CHARACTER',
    story: "THE DESTROYER — The Destroyer was a supervillain who was tired of being booed. He tried helping: when a man grabbed a woman's purse and ran, The Destroyer tripped the thief. The woman screamed that The Destroyer stole her purse and ran. He tried again: at a car crash, he used his ray gun to cut open the car and pulled a trapped man out safely. The crowd finally understood — he was helping.",
    question: "CHARACTER — How does The Destroyer change from the BEGINNING to the END of the story?",
    answer: "Beginning: A feared villain that people boo and hate 👿\nEnd: A recognised hero that people thank and respect 🦸",
    explanation: "Characters can change across a story — this is called 'character development'. The Destroyer goes from villain to hero through actions." },
  { id: 'story6', cat: 'story', type: 'wh', wh: 'SETTING',
    story: "LOLA THE ALLIGATOR — Lola lived in a river that had become full of rubbish. She and her friends — the fish, the turtles, and the birds — couldn't swim in it anymore because of all the trash. Lola decided something had to be done.",
    question: "SETTING — Where does this story take place, and how does the setting create the PROBLEM?",
    answer: "The story takes place in a dirty, rubbish-filled river 🌊\nThe setting IS the problem — the polluted water is what Lola needs to fix!" ,
    explanation: "Sometimes the setting creates the problem. Here the dirty river is why Lola can't swim — the place itself drives the story forward." },
  { id: 'story7', cat: 'story', type: 'wh', wh: 'PLAN',
    story: "LOLA THE ALLIGATOR (continued) — Lola wanted to clean up the river but the trash was far too heavy to move by herself with just her tail. She thought hard about what to do. Then she had an idea.",
    question: "PLAN — What plan did Lola come up with to solve her problem?",
    answer: "She gathered ALL her animal friends — the fish, the turtles, and the birds — to work together as a team! 🐊🐢🐦",
    explanation: "A character's plan is what they DECIDE to do to fix the problem. Lola's plan was teamwork — something she couldn't do alone." },
  { id: 'story8', cat: 'story', type: 'wh', wh: 'TRANSITION',
    story: "Story transition words help a listener or reader follow the order of events. They signal whether something is happening at the BEGINNING, MIDDLE, or END of a story.",
    question: "TRANSITION — Sort these words: First · But then · Finally · One day · After that · In the end",
    answer: "Beginning: First, One day 🌅\nMiddle: But then, After that ➡️\nEnd: Finally, In the end 🏁",
    explanation: "Transition words act like road signs in a story — they tell you where you are in the sequence of events." },

  // ── Sentences — LT #01 "Systematic Sentence Combining" ──
  { id: 'sent1', cat: 'sentence', type: 'wordplay', emoji: '➕',
    question: "COMBINE with AND: 'I love soccer.' + 'I love basketball.' → Say the combined sentence.",
    answer: "I love soccer AND basketball! ⚽🏀\n(Both sentences share the same subject 'I love', so we combine the objects with 'and'.)" },
  { id: 'sent2', cat: 'sentence', type: 'wordplay', emoji: '🔄',
    question: "COMBINE with BUT: 'The book was interesting.' + 'The book was too long.' → Say the combined sentence.",
    answer: "The book was interesting BUT too long! 📚\n('But' joins ideas that CONTRAST — one positive, one negative.)" },
  { id: 'sent3', cat: 'sentence', type: 'wordplay', emoji: '🧠',
    question: "COMBINE with BECAUSE: 'I cleaned my bedroom.' + 'It was a huge mess.' → Say the combined sentence.",
    answer: "I cleaned my bedroom BECAUSE it was a huge mess! 🧹\n('Because' gives the REASON — it answers 'why?')" },
  { id: 'sent4', cat: 'sentence', type: 'wordplay', emoji: '🌧️',
    question: "COMBINE with SO: 'It started to rain.' + 'I went inside.' → Say the combined sentence.",
    answer: "It started to rain SO I went inside! ☔\n('So' shows the RESULT or consequence — what happened next because of the first event.)" },
  { id: 'sent5', cat: 'sentence', type: 'wordplay', emoji: '🐱',
    question: "Fill in the missing conjunction: 'He won't feed the cat _____ you remind him.' (UNLESS / BECAUSE / SO)",
    answer: "UNLESS! He won't feed the cat UNLESS you remind him. 🐈\n('Unless' = except if / only if not — the cat only gets fed IF you remind him.)" },
  { id: 'sent6', cat: 'sentence', type: 'wordplay', emoji: '📖',
    question: "Fill in the missing conjunction: 'Keep reading _____ class ends.' (BEFORE / UNTIL / WHILE)",
    answer: "UNTIL! Keep reading UNTIL class ends. 📖\n('Until' means up to the point in time when something happens.)" },
  { id: 'sent7', cat: 'sentence', type: 'wordplay', emoji: '🧑‍🏫',
    question: "COMBINE using WHO or THAT: 'This is the teacher.' + 'She taught me how to read.' → Say the combined sentence.",
    answer: "This is the teacher WHO taught me how to read! 🧑‍🏫\n(Use WHO for people. Use THAT for things.)" },
  { id: 'sent8', cat: 'sentence', type: 'wordplay', emoji: '🔤',
    question: "COMBINE using WHOSE: 'That is the woman.' + 'I take care of her dog.' → Say the combined sentence.",
    answer: "That is the woman WHOSE dog I take care of! 🐕\n(WHOSE shows belonging/possession — her dog = whose dog.)" },

  // ── WH Bundle 1 + 3: function/location questions ──────────────────────────
  { id: 'wh33', cat: 'wh', type: 'choice', emoji: '🍴',
    question: "WHAT do you eat with?",
    choices: ['Fork or spoon', 'Pillow', 'Crayon', 'Umbrella'],
    answer: 'Fork or spoon' },
  { id: 'wh34', cat: 'wh', type: 'choice', emoji: '😴',
    question: "WHERE do you sleep?",
    choices: ['In a bed', 'In a tree', 'At the store', 'In a pool'],
    answer: 'In a bed' },
  { id: 'wh35', cat: 'wh', type: 'choice', emoji: '🏥',
    question: "WHERE do you go when you are sick and need a doctor?",
    choices: ['To the doctor/clinic', 'To the park', 'To the mall', 'To school'],
    answer: 'To the doctor/clinic' },
  { id: 'wh36', cat: 'wh', type: 'choice', emoji: '🏫',
    question: "WHERE do you go to learn with a teacher every day?",
    choices: ['At school', 'At the park', 'At the mall', 'In a car'],
    answer: 'At school' },
  { id: 'wh37', cat: 'wh', type: 'choice', emoji: '🎉',
    question: "WHERE are the boys? (They have balloons, cake, and are celebrating.)",
    choices: ['At a party', 'At the zoo', 'At home alone', 'At the library'],
    answer: 'At a party' },
  { id: 'wh38', cat: 'wh', type: 'choice', emoji: '👶',
    question: "WHO is crying? (You see a baby, a doctor, and a mom in the picture.)",
    choices: ['The doctor', 'The baby', 'The mom', 'Nobody'],
    answer: 'The baby' },
  { id: 'wh39', cat: 'wh', type: 'choice', emoji: '🦷',
    question: "WHO is cleaning someone's teeth? (A dental professional is working in a person's mouth.)",
    choices: ['The dentist', 'The doctor', 'The police officer', 'The patient'],
    answer: 'The dentist' },

  // ── Cloudy story WH questions ──────────────────────────────────────────────
  { id: 'wh40', cat: 'wh', type: 'wh', wh: 'WHO',
    story: "One cloudy Saturday afternoon, two brothers Sam and Eli were flying a kite. A big gust of wind blew the kite away! They climbed a tall tree to look for it and found a secret world in the clouds with a lost-and-found full of missing kites.",
    question: "WHO were flying a kite at the start of the Cloudy story?",
    answer: 'Sam and Eli — two brothers.' },
  { id: 'wh41', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "Sam and Eli climbed a tall tree higher and higher until they entered a secret world in the clouds where they found a lost-and-found with their kite.",
    question: "WHY did Sam and Eli climb the tree?",
    answer: 'To look for their lost kite — it had blown away in the wind.' },
  { id: 'wh42', cat: 'wh', type: 'wh', wh: 'WHERE',
    story: "Sam and Eli explored the cloud world and noticed a lost-and-found. They found their kite, plus two extra kites belonging to their friends Ariel and Jessica.",
    question: "WHERE did Sam and Eli find the missing kites?",
    answer: 'In a lost-and-found inside the secret world in the clouds.' },
  { id: 'wh43', cat: 'wh', type: 'wh', wh: 'HOW',
    story: "Sam and Eli wanted to show their parents the cloud world. But when the family walked back to the tree, the clouds had cleared and the world was gone.",
    question: "HOW did the parents react when Sam and Eli took them to see the cloud world?",
    answer: "Their parents did NOT believe them — the clouds had cleared, so the world was invisible. Their dad said 'I knew you imagined it!'" },

  // ── Searching for Home WH questions ───────────────────────────────────────
  { id: 'wh44', cat: 'wh', type: 'wh', wh: 'WHO',
    story: "One night, a little alien peeked through a window. His rocket had crash-landed on Earth and he was lost. He knocked on the window, and Maya woke up — surprised to see an alien standing outside!",
    question: "WHO knocked on Maya's window in the middle of the night?",
    answer: "A little alien whose rocket had crash-landed on Earth — he was lost and needed help finding his home planet." },
  { id: 'wh45', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "The alien started to cry. He showed Maya what he was looking for: his home planet — red, hot, and rocky. He thought he might never get home.",
    question: "WHY was the alien crying?",
    answer: 'He was lost, far from his home planet, and was afraid he might never get home.' },
  { id: 'wh46', cat: 'wh', type: 'wh', wh: 'HOW',
    story: "Maya had a plan! She and the alien climbed into the rocket and flew into space. They landed on a stormy planet (wrong!), then an icy planet (wrong!), and finally the hot, rocky home planet.",
    question: "HOW did Maya and the alien eventually find the right planet?",
    answer: 'They tried different planets one by one until they found the alien\'s hot, red, rocky home planet — the third one they tried.' },

  // ── Social Skills: Body Language ──────────────────────────────────────────
  { id: 's21', cat: 'social', type: 'choice', emoji: '😲',
    question: "To identify someone's emotion, you first look at their FACIAL EXPRESSION. Which OTHER body language clues do you also check?",
    choices: [
      'Gestures, orientation, attention, posture, distance',
      'Only their smile',
      'The color of their shirt',
      'Only whether they are standing or sitting',
    ],
    answer: 'Gestures, orientation, attention, posture, distance' },
  { id: 's22', cat: 'social', type: 'choice', emoji: '😡',
    question: "Someone has clenched fists, eyebrows pulled down, and a tight jaw. Which emotion are they most likely feeling?",
    choices: ['Angry', 'Excited', 'Calm', 'Surprised'],
    answer: 'Angry' },
  { id: 's23', cat: 'social', type: 'wordplay', emoji: '🎭',
    question: "Name 3 emotions in the HAPPY family (related to happy — different types or intensities)",
    answer: 'Calm/relaxed, Proud, Glad, Enamored, Ecstatic\n(Any 3 count! They are all types of happiness.)' },
  { id: 's24', cat: 'social', type: 'choice', emoji: '😬',
    question: "Sonya tells Gregory she has a turkey sandwich for lunch. Gregory says 'Ewww, gross! That is so nasty. Disgusting!' Is this a good conversational response?",
    choices: [
      "No — it is rude and hurts Sonya's feelings",
      'Yes — he is being honest',
      'Yes — it starts a great conversation',
      'No — he should say nothing at all',
    ],
    answer: "No — it is rude and hurts Sonya's feelings" },
  { id: 's25', cat: 'social', type: 'choice', emoji: '📣',
    question: "When someone tells you something in a conversation, you take your turn by doing what?",
    choices: [
      'Asking a question OR making a comment',
      'Staying silent so they keep talking',
      'Changing the subject right away',
      'Only nodding your head',
    ],
    answer: 'Asking a question OR making a comment' },
  { id: 's26', cat: 'social', type: 'wordplay', emoji: '😊',
    question: "Your friend says 'I got an A on my test!' Give TWO positive comments and ONE follow-up question.",
    answer: "Comments: 'Awesome!' / 'That\'s great!' / 'Wonderful!' / 'Fantastic!'\nQuestion: 'How did you study for it?' or 'What class was it for?'" },
  { id: 's27', cat: 'social', type: 'wordplay', emoji: '😢',
    question: "Your friend says 'I missed the bus and was late to school.' Give TWO sympathetic comments you could make.",
    answer: "'Oh no, that\'s too bad!' / 'Bummer!' / 'I\'m sorry!' / 'Yikes! That\'s not good.'\n(These show you care about what happened to them.)" },

  // ── Following Directions: spatial + temporal ───────────────────────────────
  { id: 'd8', cat: 'directions', type: 'directions', emoji: '🐶',
    instruction: "SPATIAL DIRECTIONS: Follow each instruction with a picture or objects on a table.\n\n🔹 Circle the dog that is IN a dog bed\n🔹 Underline the pig that is BEHIND the box\n🔹 Cross out the jelly beans that are OUTSIDE the jar",
    confirmText: "Done! ✓" },
  { id: 'd9', cat: 'directions', type: 'directions', emoji: '🪁',
    instruction: "TWO-STEP DIRECTIONS: Do both steps in the right order.\n\n1️⃣ First: Touch something red\n2️⃣ Then: Clap your hands twice\n\n➡️ Try it: Point to the door BEFORE you stand up",
    confirmText: "Done! ✓" },
  { id: 'd10', cat: 'directions', type: 'choice', emoji: '⏱️',
    question: "'BEFORE you clap your hands, stomp your feet.' Which action do you do FIRST?",
    choices: ['Stomp your feet', 'Clap your hands', 'Both at the same time', 'Clap then stomp'],
    answer: 'Stomp your feet' },
  { id: 'd11', cat: 'directions', type: 'choice', emoji: '⏱️',
    question: "'AFTER you snap your fingers, jump up.' Which action do you do SECOND?",
    choices: ['Jump up', 'Snap your fingers', 'Both together', 'Neither'],
    answer: 'Jump up' },
  { id: 'd12', cat: 'directions', type: 'directions', emoji: '🔢',
    instruction: "MULTI-STEP DIRECTIONS: Listen carefully and follow each step in order.\n\n1️⃣ Touch your nose\n2️⃣ Clap three times\n3️⃣ Say your name out loud\n4️⃣ Stand up and sit back down",
    confirmText: "All 4 done! ✓" },
  { id: 'd13', cat: 'directions', type: 'directions', emoji: '🎯',
    instruction: "CONDITIONAL DIRECTIONS: Only do the action if the condition is true for you.\n\n🔹 IF you are wearing socks, raise your hand\n🔹 IF your name has the letter A in it, wave\n🔹 IF you ate breakfast today, give a thumbs up",
    confirmText: "Done! ✓" },

  // ── Context Clues (LT Context Clues PDF) ──────────────────────────────────
  { id: 'wp27', cat: 'wordplay', type: 'wordplay', emoji: '📖',
    question: "CONTEXT CLUE: 'Greg was an AVID fan of manga, which means he had a strong interest in it.' What does AVID mean?",
    answer: 'Avid = having a strong interest or enthusiasm.\nThe clue phrase "which means he had a strong interest in it" tells you directly!' },
  { id: 'wp28', cat: 'wordplay', type: 'wordplay', emoji: '🏪',
    question: "CONTEXT CLUE: 'Marquan wanted to be the PROPRIETOR, or business owner, of a skateboarding shop.' What does PROPRIETOR mean?",
    answer: 'Proprietor = the owner of a business.\nThe clue "or business owner" appears right after the word!' },
  { id: 'wp29', cat: 'wordplay', type: 'wordplay', emoji: '🚫',
    question: "CONTEXT CLUE: 'The police THWARTED, or prevented, the robber from taking the money.' What does THWARTED mean?",
    answer: 'Thwarted = stopped or prevented from doing something.\nThe clue "or prevented" is right there in the sentence!' },
  { id: 'wp30', cat: 'wordplay', type: 'wordplay', emoji: '📚',
    question: "CONTEXT CLUE: 'Kanai\'s loud voice REVERBERATED, or echoed, through the tunnel.' What does REVERBERATED mean?",
    answer: 'Reverberated = echoed / bounced off surfaces and repeated.\nThe clue "or echoed" tells you right away!' },

  // ── Multiple Meaning Words ─────────────────────────────────────────────────
  { id: 'wp31', cat: 'wordplay', type: 'choice', emoji: '⌚',
    question: "MULTIPLE MEANINGS — WATCH: Which sentence uses 'watch' as a VERB (action)?",
    choices: [
      'I want to watch a movie tonight.',
      'I am going to buy a new watch at the store.',
      'She dropped her gold watch.',
      'He fixed the broken watch.',
    ],
    answer: 'I want to watch a movie tonight.' },
  { id: 'wp32', cat: 'wordplay', type: 'wordplay', emoji: '🏦',
    question: "MULTIPLE MEANINGS — BANK: Give TWO different meanings for the word BANK. Use each in a sentence.",
    answer: 'Meaning 1: A building where money is kept → "My mom went to the BANK to deposit her check."\nMeaning 2: The ground beside a river → "We sat on the BANK of the river and watched fish."' },

  // ── Past Tense Verbs ───────────────────────────────────────────────────────
  { id: 'wp33', cat: 'wordplay', type: 'wordplay', emoji: '🕐',
    question: "REGULAR PAST TENSE (just add -ed or -d): Change these verbs!\nbake → ?    wash → ?    paint → ?    climb → ?    play → ?",
    answer: 'bake → baked    wash → washed    paint → painted    climb → climbed    play → played\n(Rule: regular verbs = just add -ed or -d to the end)' },
  { id: 'wp34', cat: 'wordplay', type: 'wordplay', emoji: '🔄',
    question: "IRREGULAR PAST TENSE (these do NOT follow the -ed rule!): Change them!\nswim → ?    blow → ?    throw → ?    build → ?    break → ?",
    answer: 'swim → swam    blow → blew    throw → threw    build → built    break → broke\n(Irregular = the whole word changes — you must memorize these!)' },
  { id: 'wp35', cat: 'wordplay', type: 'wordplay', emoji: '🎯',
    question: "IRREGULAR PAST TENSE — tricky ones!\ngrow → ?    win → ?    find → ?    catch → ?    fall → ?",
    answer: 'grow → grew    win → won    find → found    catch → caught    fall → fell\n(All change in surprising ways — no -ed at all!)' },

  // ── Complex Sentence Comprehension ────────────────────────────────────────
  { id: 'wp36', cat: 'wordplay', type: 'wh', wh: 'WHAT',
    story: "After flying around in the wind, the leaf got stuck in a metal fence.",
    question: "WHAT happened to the leaf? And WHERE did it get stuck?",
    answer: 'The leaf got STUCK IN A METAL FENCE after flying around in the wind.' },
  { id: 'wp37', cat: 'wordplay', type: 'wh', wh: 'WHO',
    story: "The child who is sitting on the box will be moving to a new house soon.",
    question: "WHO is described in this sentence? And WHEN will they move?",
    answer: 'The CHILD sitting on the box — and they will move SOON.' },
  { id: 'wp38', cat: 'wordplay', type: 'wh', wh: 'WHAT',
    story: "The group gazed at the giraffe in the distance.",
    question: "WHO is in this sentence? What does 'gazed' mean? WHERE is the giraffe?",
    answer: "The GROUP gazed (looked closely/admiringly) at a GIRAFFE that was FAR AWAY (in the distance)." },

  // ── Sentence Formulation patterns ─────────────────────────────────────────
  { id: 'wp39', cat: 'wordplay', type: 'wordplay', emoji: '🐱',
    question: "SUBJECT + VERB: Say a sentence about JUST who is doing something.\nExample: 'The dog is running.'\nNow make one about a CAT.",
    answer: 'The cat is sleeping. / The cat is jumping. / The cat is eating.\n(Subject + Verb = WHO + what they are doing)' },
  { id: 'wp40', cat: 'wordplay', type: 'wordplay', emoji: '🍕',
    question: "SUBJECT + VERB + OBJECT: Add WHAT they are acting on.\nExample: 'The girl is eating pizza.'\nMake one about a BOY and a BALL.",
    answer: 'The boy is kicking the ball. / The boy is throwing the ball. / The boy is catching the ball.\n(Object = the thing they are acting on)' },
  { id: 'wp41', cat: 'wordplay', type: 'wordplay', emoji: '🏊',
    question: "SUBJECT + VERB + PLACE: Add WHERE the action happens.\nExample: 'The boy is swimming in the pool.'\nMake one about a GIRL at SCHOOL.",
    answer: 'The girl is studying at school. / The girl is eating lunch at school. / The girl is running at school.\n(Place = WHERE — at school, in the pool, on the playground)' },

  // ── Describing with Attributes (LT 20) ────────────────────────────────────
  { id: 'wp42', cat: 'wordplay', type: 'wordplay', emoji: '🧸',
    question: "DESCRIBING with 2 ATTRIBUTES: Describe a toy using exactly 2 adjectives joined by 'and'.\nExample: 'round and colorful'\nNow describe a BLANKET using 2 attributes.",
    answer: 'Soft and warm / Large and cozy / Fluffy and blue\n(Attributes = size, color, texture, shape, weight — pick any 2!)' },
  { id: 'wp43', cat: 'wordplay', type: 'wordplay', emoji: '📦',
    question: "DESCRIBING with 3 ATTRIBUTES: Describe a box using 3 attributes.\nExample: 'empty, brown, and open'\nNow describe a BACKPACK using 3 attributes.",
    answer: 'Heavy, blue, and zippered / Small, red, and full / Big, black, and torn\n(Pick 3 from: color, size, weight, texture, shape, condition)' },

  // ── Visualization Memory Challenge ────────────────────────────────────────
  { id: 'wp44', cat: 'wordplay', type: 'wordplay', emoji: '🧠',
    question: "VISUALIZATION MEMORY: Listen, then close your eyes!\n'A red, round apple sitting on a wooden brown table, next to a tall glass of water.'\nWhat COLOR was the apple? What SHAPE? What was it sitting next to?",
    answer: 'Red apple, round shape, sitting next to a TALL GLASS OF WATER on a wooden brown table.\n(Tip: paint a picture in your brain as you hear the description!)' },

  // ── Story Elements: new guiding questions (Story Elements & Structure PDF) ─
  { id: 'story9', cat: 'story', type: 'wh', wh: 'BACKSTORY',
    question: "STORY ELEMENT — BACKSTORY: What happened BEFORE the story started? Think about any story you know and describe its backstory.",
    answer: "The BACKSTORY is what happened before the story began — events that set up the situation.\nExample (Searching for Home): The alien's rocket had already crashed on Earth before the story opens." },
  { id: 'story10', cat: 'story', type: 'wh', wh: 'GOAL',
    question: "STORY ELEMENT — GOAL: What did the main character WANT? What were they trying to achieve?",
    answer: "A GOAL is what the character is trying to get or accomplish.\nExample (Cloudy): Sam and Eli's goal was to find their lost kite.\nAsk yourself: 'What does _____ want more than anything?'" },
  { id: 'story11', cat: 'story', type: 'wh', wh: 'OOPS',
    question: "STORY ELEMENT — OOPS: What MISTAKE did the character make? What failed attempt made things harder?",
    answer: "OOPS = a mistake or failed attempt that makes the problem worse or continues the story.\nAsk: 'What did the character try that did not work? What went wrong because of their action?'" },
  { id: 'story12', cat: 'story', type: 'wh', wh: 'LESSON',
    question: "STORY ELEMENT — LESSON (Theme): What is the LESSON of the story? What can we learn from it?",
    answer: "The LESSON (theme) is the big idea the author wants you to take away.\nExamples: Never give up. / Kindness matters. / Honesty is the best policy.\nAsk: 'What did the character learn? What can WE learn?'" },

  // ── Cloudy story grammar ───────────────────────────────────────────────────
  { id: 'story13', cat: 'story', type: 'wh', wh: 'SET THE SCENE',
    story: "One cloudy Saturday afternoon, two brothers, Sam and Eli, were outside flying a kite.",
    question: "SET THE SCENE: Describe the time, place, and characters at the start of Cloudy.",
    answer: "Time: Cloudy Saturday afternoon\nPlace: Outside in their neighborhood (near a tree)\nCharacters: Sam and Eli — two brothers" },
  { id: 'story14', cat: 'story', type: 'wh', wh: 'PROBLEM',
    story: "A big gust of wind came. Woosh! The string slipped out of Sam's hand and the kite flew into the air! Sam and Eli ran after it as quickly as they could. But sadly, the kite flew away. It was lost.",
    question: "What is the PROBLEM in Cloudy?",
    answer: "Their kite flew away in the wind and was lost — they ran after it but could not catch it!" },
  { id: 'story15', cat: 'story', type: 'wh', wh: 'SURPRISE',
    story: "Sam and Eli climbed the tree so high they began to climb through the clouds. WOW! Sam and Eli reached the top of the tree and could not believe their eyes! Right in front of them was a giant, secret world in the clouds!",
    question: "What was the SURPRISE in Cloudy? What were Sam and Eli not expecting?",
    answer: "A giant SECRET WORLD in the clouds! They climbed the tree to look for their kite but discovered something magical instead." },
  { id: 'story16', cat: 'story', type: 'wh', wh: 'SOLUTION',
    story: "The brothers found a lost-and-found in the cloud world. They ran over, grabbed their lost kite, and cheered! Before leaving, Eli grabbed two more kites belonging to friends Ariel and Jessica.",
    question: "What was the SOLUTION to the problem in Cloudy?",
    answer: "They found their kite (and two others!) in a lost-and-found inside the cloud world, then returned the extra kites to their friends." },

  // ── Searching for Home story grammar ──────────────────────────────────────
  { id: 'story17', cat: 'story', type: 'wh', wh: 'CHARACTER',
    story: "Maya loved outer space. She was brave enough to climb into a stranger's rocket in the middle of the night. She showed kindness to the alien and helped him find his home.",
    question: "Describe MAYA using 3 character traits. Give evidence from the story.",
    answer: "BRAVE — climbed into a rocket at night\nKIND — helped the alien find his home\nADVENTUROUS/CURIOUS — loves outer space and wanted to explore\n(Character traits = adjectives that describe personality)" },
  { id: 'story18', cat: 'story', type: 'wh', wh: 'FEELINGS',
    story: "The alien started to cry, afraid he might never get home. Maya said 'I can help you!' The alien felt hopeful. When they landed on the wrong planets, tears fell again. Finally on his home planet, the alien cheered!",
    question: "How did the alien's FEELINGS change through the story? Name at least 3 feelings in order.",
    answer: "1. SAD / SCARED — crying, thought he would never get home\n2. HOPEFUL — Maya offered to help\n3. SAD / DETERMINED — tears when landing on wrong planets\n4. JOYFUL — cheered when he finally found his home!" },
  { id: 'story19', cat: 'story', type: 'wh', wh: 'COMPARE',
    story: "Earth: where Maya lives — has weather, green and blue. Alien's home planet: red, hot, and rocky. The icy wrong planet: covered in snow and ice, cold.",
    question: "COMPARE & CONTRAST the alien's home planet and the icy planet. Same? Different?",
    answer: "SAME: Both are planets / Both are in outer space / Both are round\nDIFFERENT: Alien's home = hot, red, rocky. Icy planet = cold, covered in snow and ice." },

  // ── Cloudy sequencing ──────────────────────────────────────────────────────
  { id: 'seq8', cat: 'sequence', type: 'sequence', emoji: '☁️',
    title: "Put the CLOUDY story in order (3 steps):",
    answer:   ["Sam and Eli's kite blew away in the wind — it was lost", "Sam and Eli climbed a tall tree to search for their missing kite", "They found their kite in a lost-and-found inside a secret world in the clouds"],
    scrambled:["Sam and Eli climbed a tall tree to search for their missing kite", "They found their kite in a lost-and-found inside a secret world in the clouds", "Sam and Eli's kite blew away in the wind — it was lost"] },
  { id: 'seq9', cat: 'sequence', type: 'sequence', emoji: '🪁',
    title: "Put the CLOUDY story in order (5 steps):",
    answer:   ["One cloudy Saturday, Sam and Eli were outside flying their kite", "Suddenly, their kite blew away in the wind — it was lost", "Sam and Eli climbed a tall tree, going higher and higher", "Surprise! They entered a magical secret world in the clouds", "Sam and Eli found their kite in a lost-and-found and hurried home"],
    scrambled:["Sam and Eli climbed a tall tree, going higher and higher", "One cloudy Saturday, Sam and Eli were outside flying their kite", "Sam and Eli found their kite in a lost-and-found and hurried home", "Suddenly, their kite blew away in the wind — it was lost", "Surprise! They entered a magical secret world in the clouds"] },

  // ── Searching for Home sequencing ─────────────────────────────────────────
  { id: 'seq10', cat: 'sequence', type: 'sequence', emoji: '🚀',
    title: "Put the SEARCHING FOR HOME story in order (3 steps):",
    answer:   ["Maya woke up to an alien knocking on her window — he was lost and wanted to go home", "Maya climbed into the alien's rocket and flew into outer space to help him", "They found the alien's hot, rocky home planet, and the alien cheered — he was finally home!"],
    scrambled:["Maya climbed into the alien's rocket and flew into outer space to help him", "They found the alien's hot, rocky home planet, and the alien cheered — he was finally home!", "Maya woke up to an alien knocking on her window — he was lost and wanted to go home"] },
  { id: 'seq11', cat: 'sequence', type: 'sequence', emoji: '🌍',
    title: "Put the SEARCHING FOR HOME story in order (5 steps):",
    answer:   ["In the middle of the night, Maya woke up to an alien knocking on her window", "The alien was lost and looking for his hot, red, rocky home planet", "Maya and the alien flew into outer space but landed on a STORMY planet — wrong!", "They flew back into space and landed on an ICY planet — still wrong!", "They found the alien's home planet and celebrated — then Maya flew back to Earth"],
    scrambled:["Maya and the alien flew into outer space but landed on a STORMY planet — wrong!", "In the middle of the night, Maya woke up to an alien knocking on her window", "They found the alien's home planet and celebrated — then Maya flew back to Earth", "The alien was lost and looking for his hot, red, rocky home planet", "They flew back into space and landed on an ICY planet — still wrong!"] },

  // ── Reading Comprehension: Narrative passages ──────────────────────────────
  { id: 'read1', cat: 'reading', type: 'wh', wh: 'WHO',
    story: "Camila had been caring for some butterflies. One day, her mother called out: 'Camila, it\'s time to let the butterflies make their way out into the world. It\'s time to set them free!' Camila was sad to see her winged friends leave, but she knew her mom was right. After taking the cage outside, they opened the door, allowing the butterflies to explore a new world.",
    question: "WHO is this story about, and WHY was she sad?",
    answer: "CAMILA — she was sad because she had to let the butterflies she had been caring for go free into the world." },
  { id: 'read2', cat: 'reading', type: 'wh', wh: 'MAIN IDEA',
    story: "Camila had been caring for some butterflies. One day, her mother called out: 'Camila, it\'s time to let the butterflies make their way out into the world. It\'s time to set them free!' Camila was sad to see her winged friends leave, but she knew her mom was right. After taking the cage outside, they opened the door, allowing the butterflies to explore a new world.",
    question: "What is the MAIN IDEA of this story? (What is it mostly about?)",
    answer: "The story is mostly about Camila letting go of her pet butterflies so they can be free in the world — and accepting that even though she was sad." },
  { id: 'read3', cat: 'reading', type: 'wh', wh: 'WHAT',
    story: "Tyrell stood in the center of the stage at the school talent show. He opened his mouth to sing, but suddenly forgot the words. 'Oh, no!' Tyrell thought. Ms. Simpson winked at him. 'Let\'s try that again, Tyrell,' she said calmly. 'Everyone gets stage fright sometimes.' She played the beginning of his song again, and Tyrell relaxed. He sang every word, and the students applauded.",
    question: "WHAT went wrong during Tyrell's performance, and what was the SOLUTION?",
    answer: "PROBLEM: Tyrell forgot the words to his song on stage in front of the whole school.\nSOLUTION: His teacher Ms. Simpson played the song again, Tyrell relaxed, sang every word, and the students applauded." },
  { id: 'read4', cat: 'reading', type: 'wh', wh: 'INFER',
    story: "Tyrell stood in the center of the stage at the school talent show. He opened his mouth to sing, but suddenly forgot the words. 'Oh, no!' Tyrell thought. Ms. Simpson winked at him. 'Everyone gets stage fright sometimes.' She played the song a second time, and Tyrell relaxed. He sang every word, and the students applauded for his bravery and talent.",
    question: "INFERENCE: How do you think Tyrell felt BEFORE he forgot the words? How did he feel at the END?",
    answer: "Before forgetting: CONFIDENT — he 'walked confidently' out on stage\nAfter forgetting: SCARED / EMBARRASSED — 'Oh, no!'\nAt the end: PROUD / RELIEVED — students applauded for his 'bravery and talent'" },
  { id: 'read5', cat: 'reading', type: 'wh', wh: 'PREDICT',
    story: "Camila had been caring for her butterflies for weeks. She watched them change from caterpillars to beautiful winged creatures. Camila's mother walked over and said, 'It is almost time...'",
    question: "PREDICT: What do you think Camila's mother is about to say? What clues help you predict?",
    answer: "She will probably say it\'s time to set the butterflies free.\nClues: They have grown wings (ready for the world) + 'It is almost time...' signals a change is coming + caring for them implies they will eventually need to be released." },
  { id: 'read6', cat: 'reading', type: 'wh', wh: 'INFER',
    question: "INFERENCING: A girl at a birthday party has a big smile, arms raised, and is looking at a wrapped present. What is she PROBABLY feeling? Name the clues.",
    answer: "She is probably feeling EXCITED or HAPPY.\nClues: Big smile (facial expression) + arms raised (body language/gesture) + looking at a present (attention/focus) = excitement about opening the gift!\n(Inferencing = use clues to figure out what is NOT said directly.)" },
  { id: 'read7', cat: 'reading', type: 'wh', wh: 'INFER',
    question: "INFERENCING: A boy is sitting alone at lunch. His head is down, arms crossed, and he is not eating. What might he be feeling? Name 2 possible emotions and explain the clues.",
    answer: "Possible emotions: SAD, UPSET, LONELY, EMBARRASSED\nClues: Head down (posture/shame) + arms crossed (closed-off) + not eating (distracted/troubled) + sitting ALONE (isolated)\nMultiple clues together point to a negative emotion." },
  { id: 'read8', cat: 'reading', type: 'choice', emoji: '🔍',
    question: "INFERENCING STRATEGY: When you make an inference, you use clues from the text PLUS your own ___ to figure out something not directly stated.",
    choices: ['Background knowledge / experience', 'A dictionary', "The author's name", 'The title only'],
    answer: 'Background knowledge / experience' },

  // ── Text Structure ─────────────────────────────────────────────────────────
  { id: 'ts1', cat: 'textstruct', type: 'choice', emoji: '💥',
    question: "CAUSE & EFFECT: 'I dropped my phone. My phone broke.' Which is the CAUSE?",
    choices: ['I dropped my phone', 'My phone broke', 'They are both causes', 'There is no cause'],
    answer: 'I dropped my phone' },
  { id: 'ts2', cat: 'textstruct', type: 'wordplay', emoji: '🌡️',
    question: "CAUSE & EFFECT: 'It was really hot outside. _____ my ice cream melted.' Which signal word fits? What word connects cause to effect?",
    answer: "Signal word: SO — 'It was really hot outside, SO my ice cream melted.'\nOther C&E signal words: because, caused, result, therefore, if/then" },
  { id: 'ts3', cat: 'textstruct', type: 'wordplay', emoji: '🌧️',
    question: "CAUSE & EFFECT: 'Some cities have a lot of air pollution. BECAUSE OF THAT, more people get lung cancer and asthma.'\nWhat is the CAUSE? What is the EFFECT?",
    answer: "CAUSE: Cities have a lot of air pollution\nEFFECT: More people get lung cancer and asthma\nSignal phrase: 'because of that'" },
  { id: 'ts4', cat: 'textstruct', type: 'wordplay', emoji: '🐺',
    question: "COMPARE & CONTRAST: 'Dogs are pets but wolves are wild. They are BOTH canines. HOWEVER, dogs are domesticated — tame and living with humans.' What is SAME? What is DIFFERENT?",
    answer: "SAME: Both are canines (same animal family)\nDIFFERENT: Dogs = PETS (tame, live with humans) vs. Wolves = WILD animals\nSignal words: BOTH (same) / HOWEVER (different)" },
  { id: 'ts5', cat: 'textstruct', type: 'wordplay', emoji: '☀️',
    question: "COMPARE & CONTRAST: A cloud vs. the sun. Name 2 things that are the SAME and 2 things that are DIFFERENT.",
    answer: "SAME: Both found in the sky / Both related to the weather\nDIFFERENT: Cloud = fluffy, white/gray, produces rain. Sun = very hot, bright, gives light.\nSignal words: both, similar / but, however, while, different" },
  { id: 'ts6', cat: 'textstruct', type: 'sequence', emoji: '🐦',
    title: "SEQUENCE TEXT: Put the bird's story in the correct order:",
    answer:   ["The bird built a nest in a tree", "The bird laid three tiny blue eggs", "It sat patiently in the nest for a long time", "After many days, three baby birds were born!"],
    scrambled:["It sat patiently in the nest for a long time", "The bird built a nest in a tree", "After many days, three baby birds were born!", "The bird laid three tiny blue eggs"] },
  { id: 'ts7', cat: 'textstruct', type: 'choice', emoji: '🧩',
    question: "PROBLEM & SOLUTION: 'Oh no! Someone lost a piece of their puzzle. Phew! They found it under the couch.' What is the SOLUTION?",
    choices: ['They found the puzzle piece under the couch', 'They lost a piece of their puzzle', 'They bought a new puzzle', 'They gave up on the puzzle'],
    answer: 'They found the puzzle piece under the couch' },
  { id: 'ts8', cat: 'textstruct', type: 'wordplay', emoji: '🌱',
    question: "PROBLEM & SOLUTION: Create your own!\nPROBLEM: Shan noticed her plants were really dry.\nWrite a SOLUTION sentence using a signal word (so / solved by / fixed by).",
    answer: "Shan's plants were dry, SO she watered them every day — and they grew strong and healthy!\nSolution signal words: so, solved by, fixed by, the answer was, in the end" },
  { id: 'ts9', cat: 'textstruct', type: 'choice', emoji: '📖',
    question: "Which TEXT STRUCTURE would best fit a book called 'How a Caterpillar Becomes a Butterfly'?",
    choices: ['Sequence (order/steps)', 'Cause & Effect', 'Compare & Contrast', 'Problem & Solution'],
    answer: 'Sequence (order/steps)' },
  { id: 'ts10', cat: 'textstruct', type: 'choice', emoji: '📝',
    question: "Which TEXT STRUCTURE signal words go with PROBLEM & SOLUTION?",
    choices: ['Question, problem, solved, fixed, help', 'First, next, then, finally', 'Both, however, similar, different', 'Because, so, result, caused by'],
    answer: 'Question, problem, solved, fixed, help' },

  // ── WH Questions: Searching for Home simple questions (wh47–wh52) ──
  { id: 'wh47', cat: 'wh', type: 'wh', wh: 'WHO', emoji: '🌍',
    story: 'In Searching for Home, Maya woke up at night to find a little alien knocking on her window. She used a flashlight to see him in the dark. She helped him get back home.',
    question: 'Who helped the alien get home?', answer: 'Maya!' },
  { id: 'wh48', cat: 'wh', type: 'wh', wh: 'WHAT', emoji: '🔦',
    story: 'In Searching for Home, Maya woke up at night to find a little alien knocking on her window. She used a flashlight to see him in the dark.',
    question: 'What did Maya use to see the alien in the dark?', answer: 'A flashlight!' },
  { id: 'wh49', cat: 'wh', type: 'wh', wh: 'WHERE', emoji: '🚀',
    story: 'In Searching for Home, Maya and the alien got into the rocket and flew into outer space to find the alien\'s home planet.',
    question: 'Where is the alien\'s home?', answer: 'In outer space on his home planet!' },
  { id: 'wh50', cat: 'wh', type: 'wh', wh: 'WHEN', emoji: '🌙',
    story: 'In Searching for Home, Maya was woken up by a knocking sound in the middle of the night.',
    question: 'When did the story happen?', answer: 'At night!' },
  { id: 'wh51', cat: 'wh', type: 'wh', wh: 'HOW', emoji: '🛸',
    story: 'In Searching for Home, Maya and the alien needed to travel to outer space to return the alien home.',
    question: 'How did Maya and the alien get to outer space?', answer: 'In the alien\'s rocket!' },
  { id: 'wh52', cat: 'wh', type: 'wh', wh: 'WHY', emoji: '💡',
    story: 'In Searching for Home, the alien had crash-landed his rocket on Earth by accident. He was lost and didn\'t know how to get home.',
    question: 'Why did the alien need help?', answer: 'He was lost — he crash-landed on Earth and didn\'t know how to get home!' },

  // ── Word Play: Prefixes & Suffixes from story units (wp45–wp50) ──
  { id: 'wp45', cat: 'wordplay', type: 'choice', emoji: '⬆️',
    question: 'The prefix "up-" means higher or better. In the story Cloudy, Sam and Eli climbed UP a tree to reach the clouds. Which word means "to move to a better, higher level"?',
    choices: ['uplevel', 'download', 'beneath', 'lower'],
    answer: 'uplevel! (up- = higher/better + level = stage)' },
  { id: 'wp46', cat: 'wordplay', type: 'choice', emoji: '⭐',
    question: 'The prefix "ast-" means star (from Greek "astron"). In Searching for Home, the alien came from outer space. Which word means "a person who travels to space"?',
    choices: ['astronaut', 'asteroid', 'astronomy', 'asterisk'],
    answer: 'astronaut! (ast- = star + naut = sailor → "star sailor") ⭐' },
  { id: 'wp47', cat: 'wordplay', type: 'choice', emoji: '🌧️',
    question: 'The suffix "-y" means FULL OF. In Searching for Home, the first planet was full of storms. What is the word for full of storms?',
    choices: ['stormy', 'stormful', 'stormish', 'stormly'],
    answer: 'Stormy! (-y = full of → storm + y = stormy) 🌧️\nMore examples: cloud → cloudy, wind → windy, rain → rainy, mud → muddy' },
  { id: 'wp48', cat: 'wordplay', type: 'wordplay', emoji: '🔑',
    question: 'CONTEXT CLUES from Cloudy:\n"The brothers\' goal was to LOCATE their missing kite. After a big surprise, they did it. They FOUND their kite!"\n\nWhat does LOCATE mean?',
    answer: 'LOCATE means to FIND the place where something is! 🔍\nThe context clue is: "they found their kite" — which shows what locate means.' },
  { id: 'wp49', cat: 'wordplay', type: 'choice', emoji: '🌍',
    question: 'CONTEXT CLUES from Searching for Home:\n"The first planet they landed on was HOSTILE. It was stormy, unfriendly, and would be difficult to live on."\n\nWhat does HOSTILE mean?',
    choices: ['Warm and welcoming', 'Unfriendly and dangerous', 'Quiet and peaceful', 'Dark and cold'],
    answer: 'Unfriendly and dangerous! 🌍\nContext clues: "stormy, unfriendly, and difficult to live on" — all tell us hostile means not safe or welcoming.' },
  { id: 'wp50', cat: 'wordplay', type: 'choice', emoji: '🔭',
    question: 'CONTEXT CLUES from Searching for Home:\n"The rocket\'s engines used a huge amount of FUEL as it blasted off. It takes a lot of POWER to do that."\n\nWhat does FUEL mean?',
    choices: ['Sound a rocket makes', 'Energy source that powers a machine', 'The nose of a rocket', 'Speed of a rocket'],
    answer: 'Energy source that powers a machine! 🔭\nContext clue: "takes a lot of POWER" — fuel is what provides that power.' },

  // ── Word Play: Context clues set 2 (wp51–wp52) ──
  { id: 'wp51', cat: 'wordplay', type: 'choice', emoji: '🎈',
    question: 'CONTEXT CLUES from Searching for Home:\n"When you blow up a balloon, it will EXPAND and become bigger. Don\'t blow it up too much or it will pop!"\n\nWhat does EXPAND mean?',
    choices: ['Get smaller and deflate', 'Get bigger in size', 'Float away', 'Change colour'],
    answer: 'Get bigger in size! 🎈\nContext clue: "expand and become bigger" — the sentence actually tells you what it means!' },
  { id: 'wp52', cat: 'wordplay', type: 'wordplay', emoji: '🌕',
    question: 'CONTEXT CLUES from Searching for Home:\n"The moon ORBITS around the Earth, which means it moves in a big circle around our planet."\n\nWhat does ORBIT mean?',
    answer: 'To move in a circular path around something! 🌕\nThe sentence gives it away directly: "which means it moves in a big circle around our planet."' },

  // ── Word Play: Synonyms & Antonyms from story units (wp53–wp58) ──
  { id: 'wp53', cat: 'wordplay', type: 'choice', emoji: '☁️',
    question: 'SYNONYMS for CLOUDY (from the story Cloudy):\nWhich word is a synonym for "cloudy" — meaning it has a SIMILAR meaning?',
    choices: ['overcast', 'sunny', 'bright', 'clear'],
    answer: 'Overcast! ☁️\nMore synonyms for cloudy: overcast, murky, dreary, misty, grey\nAntonyms: sunny, bright, clear, nice' },
  { id: 'wp54', cat: 'wordplay', type: 'choice', emoji: '🌡️',
    question: 'SYNONYMS for HOT (from Searching for Home — the planets were different temperatures):\nWhich word is a synonym for "hot"?',
    choices: ['scorching', 'frigid', 'wintry', 'chilly'],
    answer: 'Scorching! 🌡️\nSynonyms for hot: scorching, boiling, roasting, balmy, sweltering\nAntonyms: frigid, freezing, wintry, chilly, icy' },
  { id: 'wp55', cat: 'wordplay', type: 'choice', emoji: '💧',
    question: 'SYNONYMS for WET (one planet in Searching for Home was too wet):\nWhich word is a synonym for "wet"?',
    choices: ['drenched', 'arid', 'dusty', 'parched'],
    answer: 'Drenched! 💧\nSynonyms for wet: damp, drenched, soaked, saturated, moist\nAntonyms: dry, arid, dusty, waterless, desert-like' },
  { id: 'wp56', cat: 'wordplay', type: 'wordplay', emoji: '❄️',
    question: 'ANTONYMS game from Searching for Home!\nThe word "FRIGID" means extremely cold — it is an antonym of HOT.\nName 3 more antonyms (opposites) of HOT.\nHint: think about very cold weather words!',
    answer: 'Great antonyms of HOT: frigid, freezing, wintry, chilly, icy, frosty, arctic ❄️\nRemember: frigid appears in the story — the cold planet was FRIGID!' },
  { id: 'wp57', cat: 'wordplay', type: 'choice', emoji: '⬆️',
    question: 'ANTONYMS for UP (from the story Cloudy — Sam and Eli climbed UP the tree):\nWhich word is an antonym (opposite) of "up"?',
    choices: ['descend', 'ascend', 'uplevel', 'rise'],
    answer: 'Descend! ⬆️\nSynonyms for up: lift, ascend, climb, rise, soar\nAntonyms: descend, lower, sink, drop, fall' },
  { id: 'wp58', cat: 'wordplay', type: 'wordplay', emoji: '🗣️',
    question: 'DESCRIBING with adjectives!\nIn Cloudy, Sam and Eli\'s kite flew away. Describe the kite using this sentence frame:\n"A kite is a __________ that __________."',
    answer: 'Example: A kite is a flat, diamond-shaped toy that flies through the air on a string! 🪁\nTry your own: A kite is a __________ (adjective + noun) that __________ (what it does).' },
  { id: 'wp59', cat: 'wordplay', type: 'wordplay', emoji: '🚀',
    question: 'DESCRIBING with adjectives!\nIn Searching for Home, the alien arrived in a rocket. Describe the rocket using this sentence frame:\n"A rocket is a __________ that __________."',
    answer: 'Example: A rocket is a tall, pointed vehicle that blasts into outer space using fuel! 🚀\nTry your own description: what does it look like? What does it do?' },

  // ── Word Play: Vocabulary worksheets (wp60–wp63) ──
  { id: 'wp60', cat: 'wordplay', type: 'wordplay', emoji: '📖',
    question: 'VOCABULARY: LOST (from Cloudy)\nLOST means: you don\'t know where you are or where something else is.\nIn Cloudy, Sam and Eli LOST their kite when it flew into the air.\n\nCan you use "lost" in a sentence about something YOU have lost before?',
    answer: 'Examples: "I lost my water bottle at school." / "The puppy got lost in the park."\nSynonyms: missing, misplaced, gone, disappeared' },
  { id: 'wp61', cat: 'wordplay', type: 'wordplay', emoji: '🌡️',
    question: 'VOCABULARY: FRIGID (from Searching for Home)\nFRIGID means: a very cold temperature.\nIn Searching for Home, one of the planets was FRIGID — much too cold to live on.\n\nCan you use "frigid" in a sentence about a cold place or cold weather?',
    answer: 'Examples: "The water in the swimming pool was frigid." / "The arctic is a frigid place."\nSynonyms: freezing, icy, arctic, bitter-cold, frosty' },
  { id: 'wp62', cat: 'wordplay', type: 'choice', emoji: '📚',
    question: 'UPPER LEVEL VOCABULARY (Level 1):\nTo "NOTICE" something means you become aware of it or pay attention to it. Which sentence uses "notice" correctly?',
    choices: ['She noticed a crack in the wall that hadn\'t been there before.', 'She noticed up the stairs quickly.', 'He noticed the ball into the net.', 'They noticed tomorrow morning.'],
    answer: 'She noticed a crack in the wall that hadn\'t been there before! 📚\nNOTICE = to see or become aware of something\nSynonyms: observe, spot, detect, perceive' },
  { id: 'wp63', cat: 'wordplay', type: 'choice', emoji: '💰',
    question: 'UPPER LEVEL VOCABULARY (Level 1):\nWEALTHY means having a lot of money or possessions. Which is the ANTONYM (opposite) of wealthy?',
    choices: ['poor', 'rich', 'prosperous', 'affluent'],
    answer: 'Poor! 💰\nWEALTHY = having a lot of money\nSynonyms: rich, affluent, prosperous, well-off\nAntonyms: poor, broke, penniless' },
  { id: 'wp64', cat: 'wordplay', type: 'wordplay', emoji: '🤔',
    question: 'UPPER LEVEL VOCABULARY (Level 1):\nTo "DOUBT" something means you are not sure if it is true. You question it.\n\n"I doubt it will rain today because the sky is clear."\n\nCan you make your own sentence using "doubt"?',
    answer: 'Examples: "I doubt I can finish this in 10 minutes." / "She had doubts about whether the plan would work."\nSynonyms: question, distrust, be uncertain, be unsure' },
  { id: 'wp65', cat: 'wordplay', type: 'choice', emoji: '🤝',
    question: 'UPPER LEVEL VOCABULARY (Level 2):\nTo "CONTRIBUTE" means to give or add something that helps a group or goal. Which sentence uses contribute correctly?',
    choices: ['Everyone contributed ideas to make the project better.', 'She contributed the ball across the field.', 'He contributed very quietly.', 'They contributed the door open.'],
    answer: 'Everyone contributed ideas to make the project better! 🤝\nCONTRIBUTE = to give or add to something\nSynonyms: add, donate, offer, participate' },
  { id: 'wp66', cat: 'wordplay', type: 'wordplay', emoji: '🏆',
    question: 'UPPER LEVEL VOCABULARY (Level 2):\nTo "ACCOMPLISH" means to successfully complete or achieve something.\n\n"She worked hard and accomplished her goal of finishing the book in a week."\n\nWhat is something YOU have accomplished recently?',
    answer: 'Examples: "I accomplished my goal of learning 10 new words." / "The team accomplished something great when they won the championship."\nSynonyms: achieve, complete, finish, succeed in, attain' },
  { id: 'wp67', cat: 'wordplay', type: 'choice', emoji: '⚖️',
    question: 'UPPER LEVEL VOCABULARY (Level 2):\nTo "EVALUATE" means to look at something carefully and decide how good or valuable it is. Which is a synonym of evaluate?',
    choices: ['assess', 'ignore', 'accept', 'create'],
    answer: 'Assess! ⚖️\nEVALUATE = to judge the value or quality of something\nSynonyms: assess, judge, appraise, analyse, measure\nUsed in: "Evaluate the evidence before making a decision."' },
  { id: 'wp68', cat: 'wordplay', type: 'wordplay', emoji: '🌟',
    question: 'UPPER LEVEL VOCABULARY (Level 2):\nINDEPENDENT means doing something on your own, without needing help from others.\n\n"She completed the project independently — she did not ask for any help."\n\nCan you use "independent" in a sentence about a time you did something on your own?',
    answer: 'Examples: "I made breakfast independently for the first time." / "An independent thinker forms their own opinions."\nSynonyms: self-reliant, autonomous, self-sufficient, solo' },

  // ── Sentence Skills: Combining & Deconstruction (sent9–sent14) ──
  { id: 'sent9', cat: 'sentence', type: 'wordplay', emoji: '☁️',
    question: 'SENTENCE COMBINING from Cloudy:\nCombine these two sentences into ONE sentence using "so":\n\nSentence 1: Eli wanted to touch a cloud.\nSentence 2: He climbed up the tree.',
    answer: 'Eli wanted to touch a cloud, SO he climbed up the tree! ☁️\nThe word "so" shows that the climbing was the RESULT of wanting to touch the cloud.\nOther conjunctions you could use: because, and, then' },
  { id: 'sent10', cat: 'sentence', type: 'wordplay', emoji: '🚀',
    question: 'SENTENCE COMBINING from Searching for Home:\nCombine these two sentences into ONE sentence using "and":\n\nSentence 1: Maya got in the rocket.\nSentence 2: The alien got in the rocket.',
    answer: 'Maya and the alien got in the rocket! 🚀\nThe word "and" joins two subjects doing the same thing.\nYou could also say: "Both Maya and the alien climbed into the rocket."' },
  { id: 'sent11', cat: 'sentence', type: 'wordplay', emoji: '🪁',
    question: 'SENTENCE DECONSTRUCTION from Cloudy:\nBreak this sentence into parts by answering the questions below:\n\n"The string slipped out of Sam\'s hand and the kite flew into the air!"\n\n• What slipped? • Whose hand? • What flew? • Where did it fly?',
    answer: '• What slipped? → The STRING\n• Whose hand? → SAM\'S hand\n• What flew? → The KITE\n• Where did it fly? → Into the AIR! 🪁\nThe sentence has two parts joined by "and" — two things happened at once!' },
  { id: 'sent12', cat: 'sentence', type: 'wordplay', emoji: '👽',
    question: 'SENTENCE DECONSTRUCTION from Searching for Home:\nBreak this sentence into parts:\n\n"Maya woke up to an alien knocking on her window!"\n\n• Who is this about? • What did she do? • What woke her up? • Where was the alien knocking?',
    answer: '• Who? → MAYA\n• What did she do? → WOKE UP\n• What woke her? → An ALIEN knocking\n• Where? → On her WINDOW! 👽\nThe phrase "to an alien knocking on her window" tells us HOW and WHY she woke up.' },
  { id: 'sent13', cat: 'sentence', type: 'wordplay', emoji: '✏️',
    question: 'SENTENCE BUILDING from Cloudy:\nPut these Cloudy story events in the right order and say each one as a sentence!\n\nEvents: • The kite flew into a cloud • Sam and Eli found a castle • The string slipped out • They climbed a tree',
    answer: 'Story order: 1. They climbed a tree. 2. The string slipped out. 3. The kite flew into a cloud. 4. Sam and Eli found a castle! ✏️\nTry saying each sentence with: "First... Then... Next... Finally..."' },
  { id: 'sent14', cat: 'sentence', type: 'wordplay', emoji: '🌌',
    question: 'SENTENCE BUILDING from Searching for Home:\nPut these SFH story events in the right order and say each one as a sentence!\n\nEvents: • They searched the planets • Maya used a flashlight • The alien got home • Maya woke up to knocking',
    answer: 'Story order: 1. Maya woke up to knocking. 2. Maya used a flashlight. 3. They searched the planets. 4. The alien got home! 🌌\nTry saying each with: "First... Then... Next... Finally..."' },

  // ── Sentence Skills: Supported Writing (sent15) ──
  { id: 'sent15', cat: 'sentence', type: 'wordplay', emoji: '🪁',
    question: 'SUPPORTED WRITING from Cloudy:\nComplete these sentences by choosing a word or phrase:\n\n"I would fly a __________ kite."\nChoices: octopus 🐙 / heart ❤️ / butterfly 🦋 / rainbow 🌈\n\n"I would rather __________."\nChoices: fly a kite / ride a bike',
    answer: 'Any answer works! The goal is to form a complete sentence.\nExample: "I would fly a rainbow kite. I would rather ride a bike."\nBonus: Can you say WHY? "I would fly a butterfly kite BECAUSE I love butterflies!"' },

  // ── Sentence Skills: Complex Sentences (sent16–sent18) ──
  { id: 'sent16', cat: 'sentence', type: 'wordplay', emoji: '🍂',
    question: 'COMPLEX SENTENCE — Adverb Clause:\nUnderstand this sentence by breaking it into parts:\n\n"After flying around in the wind, the leaf got stuck in a metal fence."\n\n• Who or what is the sentence about?\n• What happened to it?\n• What happened BEFORE that?',
    answer: '• About: the LEAF\n• What happened: it got STUCK in a metal fence\n• Before that: it was flying around in the wind 🍂\nThe phrase "After flying around in the wind" is an ADVERB CLAUSE — it tells you WHEN and WHAT happened before.' },
  { id: 'sent17', cat: 'sentence', type: 'wordplay', emoji: '📦',
    question: 'COMPLEX SENTENCE — Relative Clause:\nUnderstand this sentence:\n\n"The child who is sitting on the box will be moving to a new house soon."\n\n• Who is moving to a new house?\n• Which child? How do we know?\n• What is the extra information in the middle?',
    answer: '• Who is moving? → THE CHILD\n• Which child? → The one SITTING ON THE BOX\n• Extra info: "who is sitting on the box" is a RELATIVE CLAUSE 📦\nTip: Find the subject (the child) and the main verb (will be moving) — then everything else is extra detail!' },
  { id: 'sent18', cat: 'sentence', type: 'wordplay', emoji: '✈️',
    question: 'COMPLEX SENTENCE — Object Complement:\nUnderstand this sentence:\n\n"He often dreamt of becoming a pilot when he got older."\n\n• Who is this about?\n• What did he dream about?\n• When does he imagine this happening?',
    answer: '• About: HIM (a boy)\n• He dreamt of: becoming a PILOT ✈️\n• When: when he GOT OLDER\nThe phrase "of becoming a pilot" is the object complement — it completes what he dreamt ABOUT.\nBonus: What do YOU dream of becoming?' },

  // ── Story Skills: Character Description (story20–story21) ──
  { id: 'story20', cat: 'story', type: 'wh', wh: 'CHARACTER', emoji: '☁️',
    story: 'In Cloudy, Sam and Eli are brothers who love adventure. They climb trees together and believe in what they see — even when others don\'t.',
    question: 'Which words describe Sam and Eli? Choose 3 and make a sentence!\nOptions: Curious / Brave / Kind / Helpful / Energetic / Adventurous / Thoughtful / Cautious',
    answer: 'Sam and Eli are CURIOUS (they wondered about clouds), ADVENTUROUS (they climbed a tree!), and BRAVE (they explored the castle in the clouds)!\nExample sentence: Sam is a curious and adventurous boy who loves exploring new things.' },
  { id: 'story21', cat: 'story', type: 'wh', wh: 'CHARACTER', emoji: '🌍',
    story: 'In Searching for Home, Maya woke up at night to find a lost alien at her window. She chose to help him even though she didn\'t know him.',
    question: 'Which words describe Maya? Choose 3 and make a sentence!\nOptions: Generous / Brave / Kind / Helpful / Smart / Friendly / Curious / Determined',
    answer: 'Maya is KIND (she chose to help), BRAVE (she wasn\'t scared of the alien), and DETERMINED (she kept searching until they found his home)!\nExample sentence: Maya is a kind and determined girl who always tries to help others.' },

  // ── Story Skills: Feelings (story22–story23) ──
  { id: 'story22', cat: 'story', type: 'choice', emoji: '😊',
    question: 'FEELINGS from Cloudy:\nSam and Eli were CURIOUS about the clouds before they climbed. When the kite flew away they felt STRESSED. When they found the castle they felt SURPRISED.\n\nWhich feeling comes FIRST in the story?',
    choices: ['Curious — wondering about the clouds', 'Stressed — when the kite flew away', 'Surprised — finding a castle', 'Excited — at the end'],
    answer: 'Curious — wondering about the clouds! 😊\nFeelings in order: Curious → Stressed → Surprised → Excited/Happy\nBonus: Have you ever felt curious about something and then got a big surprise?' },
  { id: 'story23', cat: 'story', type: 'choice', emoji: '😲',
    question: 'FEELINGS from Searching for Home:\nMaya felt CONFUSED at first (who was at her window?), then SURPRISED (it\'s an alien!), then HELPFUL (let me take you home).\n\nWhich feeling did Maya have when she first saw the alien?',
    choices: ['Confused — who is knocking?', 'Happy — glad to meet him', 'Scared — ran away', 'Angry — woken up at night'],
    answer: 'Confused — who is knocking at night?! 😲\nFeelings in order: Confused → Surprised → Helpful → Happy (at the end)\nBonus: How would YOU feel if an alien knocked on your window?' },

  // ── Story Skills: KWL Charts (story24–story25) ──
  { id: 'story24', cat: 'story', type: 'wordplay', emoji: '📋',
    question: 'KWL CHART for Cloudy:\nK = What do you KNOW about kites before reading?\nW = What do you WONDER (want to know) about the story?\nL = After reading: What did you LEARN?\n\nAnswer all three!',
    answer: 'Example K: I know kites fly in the wind and need string.\nExample W: I wonder if Sam and Eli really found a castle in the clouds!\nExample L: I learned that it takes curiosity and bravery to explore something new. 📋\nKWL helps you think before AND after reading!' },
  { id: 'story25', cat: 'story', type: 'wordplay', emoji: '📋',
    question: 'KWL CHART for Searching for Home:\nK = What do you KNOW about outer space or aliens before reading?\nW = What do you WONDER about the story?\nL = After reading: What did you LEARN?\n\nAnswer all three!',
    answer: 'Example K: I know outer space has planets and stars and it\'s very cold.\nExample W: I wonder what the alien\'s home planet looks like!\nExample L: I learned that with a friend\'s help you can find your way home — even from far away. 📋' },

  // ── Story Skills: Predicting (story26–story27) ──
  { id: 'story26', cat: 'story', type: 'wordplay', emoji: '🤔',
    question: 'PREDICTING — Cloudy:\nBefore reading Cloudy, look at these clues:\n• Title: "Cloudy"\n• Two brothers outside\n• A kite on the cover\n\nWhat do you PREDICT the story will be about? Then check: were you right?',
    answer: 'A good prediction: "I think two brothers will fly a kite and something unusual will happen with the clouds."\nAfter reading: The kite flew into a cloud and they found a magical castle! ☁️\nPredictions don\'t have to be perfect — the important thing is using clues to make a smart guess!' },
  { id: 'story27', cat: 'story', type: 'wordplay', emoji: '🛸',
    question: 'PREDICTING — Searching for Home:\nBefore reading, look at these clues:\n• Title: "Searching for Home"\n• A girl and a small alien on the cover\n• A rocket in the background\n\nWhat do you PREDICT the story will be about?',
    answer: 'A good prediction: "I think a girl will help a lost alien find his way back home using a rocket." 🛸\nAfter reading: That\'s exactly what happened!\nBonus question: Why do you think Maya decided to help a stranger (even an alien)?' },

  // ── Story Skills: Simple Story Elements & Retell (story28–story33) ──
  { id: 'story28', cat: 'story', type: 'sequence', emoji: '🗂️',
    steps: [
      { n: 'CHARACTER', d: 'Who is the story about? Sam and Eli — two brothers who love adventure.' },
      { n: 'PROBLEM', d: 'What goes wrong? Their kite string slips and the kite flies into a cloud.' },
      { n: 'ACTION', d: 'What do they do? They climb the tree higher to find their kite.' },
      { n: 'SURPRISE', d: 'What happens that is unexpected? They discover a castle hidden in the clouds!' },
      { n: 'FEELING', d: 'How do they feel? Amazed, excited, happy.' },
      { n: 'SUCCESS', d: 'How does it end? They find their kite and have an incredible adventure.' },
    ]},
  { id: 'story29', cat: 'story', type: 'sequence', emoji: '🌌',
    steps: [
      { n: 'CHARACTER', d: 'Who is the story about? Maya — a kind girl — and a little alien.' },
      { n: 'PROBLEM', d: 'What goes wrong? The alien crash-landed on Earth and is lost — he can\'t find home.' },
      { n: 'ACTION', d: 'What do they do? Maya helps him get in the rocket and they fly to outer space.' },
      { n: 'OOPS', d: 'What obstacle? The first planet is too stormy, the second too wet.' },
      { n: 'SUCCESS', d: 'How does it end? They find the alien\'s home planet — warm and just right!' },
      { n: 'FEELING', d: 'How do they feel? Happy, relieved, proud.' },
    ]},
  { id: 'story30', cat: 'story', type: 'wh', wh: 'RETELL', emoji: '☁️',
    story: 'In Cloudy, Sam and Eli were flying a kite when the string slipped out of Sam\'s hand. The kite flew up into a cloud. The brothers climbed a tall tree to find it. When they reached the top, they discovered something incredible — a castle hidden in the clouds!',
    question: 'Retell the story using: BEGINNING — MIDDLE — END.\nUse words like: First... Then... Finally...',
    answer: 'Beginning: One afternoon, Sam and Eli were flying their kite. First, the string slipped from Sam\'s hand.\nMiddle: Then, the kite flew into a cloud. They climbed the tree to find it.\nEnd: Finally, they found not just their kite — but a whole castle in the clouds! ☁️' },
  { id: 'story31', cat: 'story', type: 'wh', wh: 'RETELL', emoji: '🚀',
    story: 'In Searching for Home, one night a little alien crash-landed on Earth. He knocked on Maya\'s window asking for help. Maya used her flashlight to see him. They got in the alien\'s rocket and searched the planets until they found his warm, bright home.',
    question: 'Retell the story using: ONE NIGHT... THEN... SO... FINALLY...',
    answer: 'One night, an alien crash-landed on Earth and knocked on Maya\'s window.\nThen, Maya grabbed her flashlight and opened the window to help him.\nSo, they flew in the rocket and searched through the planets.\nFinally, the alien found his home — and he was safe at last! 🚀' },
  { id: 'story32', cat: 'story', type: 'wordplay', emoji: '📝',
    question: 'TOPIC WRITING — Cloudy:\nChoose one writing prompt and say or write 2–3 sentences:\n\n1. If you had a kite, what would it look like?\n2. Would you rather fly a kite or go for a bike ride on a sunny day? Why?\n3. Have you ever climbed a tall tree? Why or why not?\n4. If you were friends with Sam and Eli, would you believe they saw a castle in the clouds?',
    answer: 'Example: "I would have a rainbow kite with a long sparkly tail. I would fly it at the park on a windy day."\nExample: "I would rather fly a kite because I love watching it soar high in the sky."\nBonus: Try to use at least one adjective and one conjunction (because, but, so)!' },
  { id: 'story33', cat: 'story', type: 'wordplay', emoji: '🌟',
    question: 'TOPIC WRITING — Searching for Home:\nChoose one writing prompt and say or write 2–3 sentences:\n\n1. Would you like to be an astronaut? Why or why not?\n2. Tell about a time you searched for something.\n3. If a friendly alien knocked on your window, what would you do first?\n4. What do you think the alien\'s home planet looked like?',
    answer: 'Example: "I would like to be an astronaut because I want to explore the stars and visit other planets."\nExample: "If an alien knocked on my window, I would first make sure he was friendly, then I would offer him some food!"\nBonus: Use the word "because" to explain your reason!' },

  // ── Story Skills: Backstory & Advanced Elements (story34–story35) ──
  { id: 'story34', cat: 'story', type: 'wh', wh: 'BACKSTORY', emoji: '🛸',
    story: 'In Searching for Home, the story starts when the alien arrives on Earth. But something happened BEFORE the story began — he crashed his rocket!',
    question: 'BACKSTORY: What do you think happened BEFORE the story started? Draw or describe what went wrong with the alien\'s rocket.',
    answer: 'A good backstory: "The alien was flying his rocket through space on his way home. A big asteroid (space rock) hit his rocket and knocked it off course. He flew too fast and couldn\'t stop — and he crash-landed right on Earth!" 🛸\nEvery story has a backstory — events that happened before the first page.' },
  { id: 'story35', cat: 'story', type: 'wh', wh: 'BACKSTORY', emoji: '🪁',
    story: 'In Cloudy, the story starts on a sunny afternoon. But Sam and Eli\'s kite adventure had to begin somehow — they made or found that kite!',
    question: 'BACKSTORY: What do you think happened BEFORE the Cloudy story began? How did Sam and Eli get their kite?',
    answer: 'A good backstory: "Sam and Eli had been saving up pocket money all summer. One day at the toy shop, they spotted the perfect kite — bright red with a long tail. They bought it together and couldn\'t wait to fly it!" 🪁\nMaking up backstories helps you understand characters better!' },

  // ── Story Skills: Compare & Contrast the two stories (story36) ──
  { id: 'story36', cat: 'story', type: 'choice', emoji: '🔄',
    question: 'COMPARE & CONTRAST — Cloudy vs Searching for Home:\nBoth stories are about an unexpected adventure. What is the SAME about both stories?',
    choices: ['Both involve outer space', 'Both have a character who is lost and finds their way', 'Both have two brothers as main characters', 'Both happen in a school'],
    answer: 'Both have a character who is lost and finds their way! 🔄\nCloudy: the kite gets lost → they find it + a castle\nSearching for Home: the alien is lost on Earth → he finds his way home\nBoth stories show that with curiosity and help, you can find what you\'re looking for!' },

  // ── Sequence: Beginning-Middle-End sorts (seq12–seq13) ──
  { id: 'seq12', cat: 'sequence', type: 'sequence', emoji: '🪁',
    steps: [
      { n: 'BEGINNING', d: 'Sam and Eli flew their kite on a sunny afternoon.' },
      { n: 'MIDDLE', d: 'The kite string slipped — the kite FLEW into a cloud.' },
      { n: 'END', d: 'They climbed up and FOUND their kite — and a magical castle!' },
    ]},
  { id: 'seq13', cat: 'sequence', type: 'sequence', emoji: '🌍',
    steps: [
      { n: 'BEGINNING', d: 'Maya was SURPRISED to find an alien at her window late at night.' },
      { n: 'MIDDLE', d: 'Maya and the alien SEARCHED through many planets in the rocket.' },
      { n: 'END', d: 'They finally FOUND the alien\'s warm and bright home planet!' },
    ]},

  // ── Reading: Nonfiction — What Are Clouds Made Of? (read9–read11) ──
  { id: 'read9', cat: 'reading', type: 'wh', wh: 'WHAT', emoji: '☁️',
    story: 'What Are Clouds Made Of?\nClouds are made up of tiny water droplets or ice crystals that have formed in the atmosphere. Clouds form when warm air rises and cools, causing water vapour to condense into tiny droplets. The type of cloud depends on temperature and humidity.',
    question: 'What are clouds actually made of?',
    answer: 'Tiny water droplets or ice crystals! ☁️\nWhen warm air rises it cools down, and the water vapour (invisible gas) turns into tiny liquid droplets — those droplets together make a cloud!' },
  { id: 'read10', cat: 'reading', type: 'wh', wh: 'HOW', emoji: '🌫️',
    story: 'Clouds form when warm air rises into the atmosphere. As the air goes higher, it cools down. When it cools, the water vapour condenses — it changes from invisible gas into tiny water droplets. Millions of these droplets group together to form a cloud.',
    question: 'How do clouds form? Explain the steps in order.',
    answer: 'Step 1: Warm air rises into the sky.\nStep 2: As it goes higher, it cools down.\nStep 3: Water vapour condenses — turns from gas into tiny liquid droplets.\nStep 4: Millions of droplets group together → a CLOUD! 🌫️' },
  { id: 'read11', cat: 'reading', type: 'choice', emoji: '🔬',
    question: 'NONFICTION COMPREHENSION — Clouds:\nYou just read about how clouds form. What causes water vapour to turn into droplets and form a cloud?',
    choices: ['The air gets warmer as it rises', 'The air cools down as it rises higher', 'Wind pushes water from the ocean upward', 'Sunlight heats the droplets directly'],
    answer: 'The air cools down as it rises higher! 🔬\nThis is called CONDENSATION — when gas cools and becomes liquid. The same thing happens on a cold glass of water: the air near the glass cools → water droplets form on the outside!' },

  // ── Text Structure: Compare & Contrast + Problem & Solution from SFH (ts11–ts14) ──
  { id: 'ts11', cat: 'textstruct', type: 'choice', emoji: '🔄',
    question: 'COMPARE & CONTRAST — Maya and the Alien (Searching for Home):\nWhat is one DIFFERENCE between Maya and the alien?',
    choices: ['Maya lives on Earth; the alien lives in outer space', 'Both Maya and the alien are humans', 'Maya has a rocket; the alien does not', 'They both feel confused at the start'],
    answer: 'Maya lives on Earth; the alien lives in outer space! 🔄\nSame: both are curious, both end up in the rocket, both feel relieved at the end.\nDifferent: species (human vs alien), home planet, why they need to travel.' },
  { id: 'ts12', cat: 'textstruct', type: 'wordplay', emoji: '🌍',
    question: 'PROBLEM & SOLUTION from Searching for Home:\n\nThe story has a clear problem and solution. Identify both:\n• What is the PROBLEM?\n• What is the SOLUTION?\n• What SIGNAL WORDS show the solution?',
    answer: 'PROBLEM: The alien crash-landed on Earth and doesn\'t know how to get home. 🌍\nSOLUTION: Maya helps him get in the rocket and they search the planets until they find his home.\nSIGNAL WORDS: "solved the problem", "the alien was back home"\nBonus: Can you think of 3 other problem/solution signal words? (fixed by, helped by, in the end...)' },
  { id: 'ts13', cat: 'textstruct', type: 'choice', emoji: '☁️',
    question: 'TEXT STRUCTURE — Cloudy:\nHow is the story CLOUDY mainly organised?',
    choices: ['Sequence — events happen in order from beginning to end', 'Compare and Contrast — comparing two different kites', 'Cause and Effect — listing reasons why clouds form', 'Problem and Solution only — the kite is lost and found'],
    answer: 'Sequence — events happen in order from beginning to end! ☁️\nAlmost all narrative (story) texts use SEQUENCE as their main structure.\nHowever, PROBLEM & SOLUTION is also present: problem = lost kite, solution = climb to find it!' },
  { id: 'ts14', cat: 'textstruct', type: 'wordplay', emoji: '🌌',
    question: 'CREATE YOUR OWN — Compare & Contrast:\nCompare the TWO story planets in Searching for Home that the alien and Maya visited before finding the right one.\n\nPlanet 1 was hostile and stormy.\nPlanet 2 was too wet.\n\nFill in: What is DIFFERENT? What is SIMILAR?',
    answer: 'DIFFERENT:\n• Planet 1: stormy, hostile, cold\n• Planet 2: wet, damp, also uninhabitable\nSIMILAR: Both planets were wrong for the alien — neither was his home. Both had extreme weather. 🌌\nSignal words used: "both had..." / "however..." / "while Planet 1 was..., Planet 2 was..."' },

  // ── Cloudy WH Questions (wh53–wh58) ──────────────────────────────────────────
  { id: 'wh53', cat: 'wh', type: 'wh', wh: 'WHO', emoji: '🪁',
    story: 'In Cloudy, two brothers named Sam and Eli spent a Saturday afternoon flying their kite outside. A big gust of wind blew it away — and a great adventure began!',
    question: 'Who was flying the kite at the very start of the story?', answer: 'Sam! He was flying the kite when the wind snatched it away. 🪁' },

  { id: 'wh54', cat: 'wh', type: 'wh', wh: 'WHAT', emoji: '🌳',
    story: 'In Cloudy, Sam and Eli noticed the top of their favourite tree was covered in clouds. They decided to climb up to find their lost kite.',
    question: 'What did the brothers climb to reach the cloud world?', answer: 'A tree! They climbed all the way to the top where the clouds were. 🌳' },

  { id: 'wh55', cat: 'wh', type: 'wh', wh: 'WHEN', emoji: '⛅',
    story: 'In Cloudy, the kite adventure happens on a very specific kind of afternoon — the kind that makes everything feel magical.',
    question: 'When did the story happen?', answer: 'On a cloudy Saturday afternoon! ⛅' },

  { id: 'wh56', cat: 'wh', type: 'wh', wh: 'WHERE', emoji: '☁️',
    story: 'In Cloudy, Sam and Eli climbed into the cloud world and discovered a special place where all lost things ended up — including kites!',
    question: 'Where did they find their kite (and extra kites for their friends)?', answer: 'In a lost and found — hidden up in the magical cloud world! ☁️' },

  { id: 'wh57', cat: 'wh', type: 'wh', wh: 'WHY', emoji: '🎁',
    story: 'In Cloudy, Sam and Eli found extra kites in the cloud lost-and-found. Once they climbed back down to earth, they went from house to house visiting friends.',
    question: "Why did Sam and Eli go to their friends' houses?", answer: "To give them their kites back! They found extra kites in the lost-and-found and knew who they belonged to. 🎁" },

  { id: 'wh58', cat: 'wh', type: 'wh', wh: 'HOW', emoji: '💨',
    story: 'In Cloudy, the kite was flying high in the air when something unexpected happened — and the whole adventure started.',
    question: 'How did Sam and Eli lose their kite in the first place?', answer: 'It flew away in the wind! A big gust blew it right out of their hands. 💨' },

  // ── Cloudy Comprehension Strategies (story37) ─────────────────────────────────
  { id: 'story37', cat: 'story', type: 'wordplay', emoji: '🧠',
    question: 'COMPREHENSION STRATEGIES for Cloudy:\n5 tools to understand stories better — can you explain each one?\n\n1. FUTURE THINKING — make a smart guess about what comes next\n2. TIMELINE — think beginning, middle, and end\n3. VISUALIZE IT — make a picture in your head of what\'s happening\n4. ASK QUESTIONS — start with "I wonder…" or "What if…"\n5. STORY PARTS — Character · Setting · Problem · Solution · Feelings',
    answer: '1. FUTURE THINKING: "I predict Sam and Eli will find the kite by climbing the tree!" 🔭\n2. TIMELINE: Lost kite → climbed tree → cloud world → returned kites → told parents 📅\n3. VISUALIZE: Picture the brothers poking their heads up through the clouds at the top of the tree 🌥️\n4. ASK: "What if their parents HAD believed them? What would have changed?" 🤔\n5. STORY PARTS: Brothers (character) · Saturday afternoon in the clouds (setting) · Lost kite (problem) · Found it in the cloud lost-and-found (solution) 🎯' },

  // ── Cloudy Comprehension MC Quiz (story38–story40) ────────────────────────────
  { id: 'story38', cat: 'story', type: 'choice', emoji: '🏰',
    question: 'What did Sam and Eli SEE when they climbed up into the cloud world in Cloudy?',
    choices: ['A giant, a castle, and a rainbow 🏰', 'Only fog and their lost kite 📦', 'Their house from above 🏠', 'Nothing — it was just a normal cloud'],
    answer: 'A giant, a castle, and a rainbow 🏰 — the cloud world was full of magical surprises!' },

  { id: 'story39', cat: 'story', type: 'choice', emoji: '🌟',
    question: 'How would you best describe Sam and Eli from Cloudy?',
    choices: ['Curious and brave 🌟', 'Angry and selfish 😠', 'Shy and nervous 🤫', 'Scared and unhappy 😨'],
    answer: 'Curious and brave 🌟 — they chose to climb the tree and explore the unknown cloud world!' },

  { id: 'story40', cat: 'story', type: 'choice', emoji: '🌤️',
    question: 'How did Cloudy end? What happened when the family walked back to the tree?',
    choices: ['The clouds were gone — no magical world this time 🌤️', 'They climbed up again for another adventure 🪁', 'The parents finally believed them right away 🎉', 'Sam and Eli found even more kites hidden in the bark'],
    answer: 'The clouds were gone — no magical world this time 🌤️ — but the memory of the adventure stayed with them forever!' },

  // ── SFH Comprehension MC Quiz (story41–story42) ───────────────────────────────
  { id: 'story41', cat: 'story', type: 'choice', emoji: '🌌',
    question: 'How did the alien feel when they landed on the cold, stormy FIRST planet in Searching for Home?',
    choices: ['Sad and uncomfortable 😢', 'Excited and happy 😄', 'Angry and frustrated 😤', 'Calm and relaxed 😌'],
    answer: 'Sad and uncomfortable 😢 — that frigid planet was nothing like his real home!' },

  { id: 'story42', cat: 'story', type: 'choice', emoji: '💛',
    question: 'How would you best describe Maya from Searching for Home?',
    choices: ['Helpful and kind 💛', 'Mean and selfish 😠', 'Shy and scared 😨', 'Loud and bossy 📢'],
    answer: 'Helpful and kind 💛 — she immediately chose to help the alien find his way home!' },

  // ── SWBST Summarizing — Cloudy & SFH (story43–story44) ───────────────────────
  { id: 'story43', cat: 'story', type: 'sequence', emoji: '📖',
    steps: [
      { n: 'SOMEBODY', d: 'Sam and Eli — two brothers who love flying kites together.' },
      { n: 'WANTED', d: 'To spend a Saturday afternoon flying their kite outside.' },
      { n: 'BUT', d: 'A big gust of wind blew their kite away and they couldn\'t find it!' },
      { n: 'SO', d: 'They climbed their favourite tree all the way into the cloud world — and found a magical lost-and-found full of kites!' },
      { n: 'THEN', d: 'They returned all the kites to their friends, and told their parents about the incredible adventure.' },
    ]},

  { id: 'story44', cat: 'story', type: 'sequence', emoji: '🌌',
    steps: [
      { n: 'SOMEBODY', d: 'Maya — a kind, curious girl — and a little alien from outer space.' },
      { n: 'WANTED', d: 'The alien wanted to find his home planet. He was lost on Earth!' },
      { n: 'BUT', d: 'They tried two wrong planets — one was too frigid and stormy, one was too wet.' },
      { n: 'SO', d: 'Maya kept searching bravely, steering the rocket to planet after planet.' },
      { n: 'THEN', d: 'They found the alien\'s warm, bright home planet! Maya waved goodbye and climbed safely back to her room.' },
    ]},

  // ── SFH Story Retell — Story Grammar (story45) ───────────────────────────────
  { id: 'story45', cat: 'story', type: 'sequence', emoji: '🗺️',
    steps: [
      { n: 'WHO', d: 'Maya — a kind girl — and a little lost alien from outer space.' },
      { n: 'SETTING', d: 'At night, starting at Maya\'s bedroom window — then outer space!' },
      { n: 'PROBLEM', d: 'The alien\'s rocket crash-landed on Earth and he couldn\'t find his home planet.' },
      { n: 'GOAL', d: 'Maya decided to help the alien get back to his home planet.' },
      { n: 'ACTION', d: 'They flew through outer space in the rocket, trying different planets one by one.' },
      { n: 'SOLUTION', d: 'They found the alien\'s warm, bright home planet — just right for him!' },
      { n: 'END', d: 'The alien was home at last. Maya climbed back to her room, happy and proud.' },
    ]},

  // ── Suffix -y (wp69) ──────────────────────────────────────────────────────────
  { id: 'wp69', cat: 'wordplay', type: 'wordplay', emoji: '🌧️',
    question: 'SUFFIX -y means "full of" (from Searching for Home Suffix Worksheet)\n\nExamples:\n• storm + y → stormy  • sun + y → sunny  • ice + y → icy  • wind + y → windy\n\nNow complete these:\n1. A food full of salt is called __________\n2. Shoes full of dirt become __________\n3. A road full of bumps is __________\n4. Ground full of rocks is __________\n5. A city full of wind today is __________',
    answer: '1. salty 🧂\n2. dirty 👟\n3. bumpy 🛤️\n4. rocky ⛰️\n5. windy 🌬️\n\nRemember: -y = "full of" — it turns NOUNS into ADJECTIVES (describing words)!\nsalt (noun) → salty (adjective) · storm (noun) → stormy (adjective)' },

  // ── Direct Vocabulary: frigid, launch, return (wp70–wp72) ────────────────────
  { id: 'wp70', cat: 'wordplay', type: 'wordplay', emoji: '🥶',
    question: 'DIRECT VOCABULARY — frigid (from Searching for Home)\n\n🔤 Say it: FRIG-id · 2 syllables\n📖 Frigid means: a very cold temperature — almost freezing!\n🔗 Related words: cold, freezing, frozen, frost, icy\n\n❓ Questions to discuss:\n• Have you ever been somewhere frigid?\n• What do people wear when it\'s frigid outside?\n• Which planet in the story was frigid?\n\nSentence: "We sat outside, shivering in the frigid winter air."\n💬 What does the word SHIVERING tell us about how cold it was?',
    answer: 'frigid = VERY cold / almost freezing 🥶\n\nIn Searching for Home: the FIRST planet Maya and the alien visited was frigid — icy cold and stormy. That\'s why the alien couldn\'t stay there!\n\nContext clue: they were SHIVERING → shivering only happens when very cold → frigid!\n\nSynonyms (coldest to least cold): arctic → frigid → freezing → icy → chilly → cool ❄️' },

  { id: 'wp71', cat: 'wordplay', type: 'wordplay', emoji: '🚀',
    question: 'DIRECT VOCABULARY — launch (from Searching for Home)\n\n🔤 Say it: LAUNCH · 1 syllable\n📖 Launch means: to send something powerfully into the air or water\n🔗 Word family: launched · launchpad · prelaunch\n\n❓ Questions to discuss:\n• What gets launched from a launchpad?\n• Pretend to "launch" your arms into the sky!\n• How would you describe the sound and look of a rocket launch?\n\nSentence: "I launched my paper airplane across the classroom."\n💬 What does this tell us about the airplane\'s movement?',
    answer: 'launch = to send something POWERFULLY into the air 🚀\n\nUsed for: rockets · ships · new apps · paper airplanes · a ball!\n\nWord family: launch → LAUNCHED (past tense) · LAUNCHPAD (where rockets take off) · PRELAUNCH (before liftoff)\n\nIn Searching for Home: Maya and the alien LAUNCHED the rocket into the sky to search for his home planet! 🛸' },

  { id: 'wp72', cat: 'wordplay', type: 'wordplay', emoji: '🏠',
    question: 'DIRECT VOCABULARY — return (from Searching for Home)\n\n🔤 Say it: re-TURN · 2 syllables\n📖 Return means: to go back to a place, or to give something back\n🔗 Word family: returned · return trip · return address\n\n❓ Questions to discuss:\n• When do you return home each day?\n• Name one thing you might have to return to a shop.\n• In Cloudy, Sam and Eli returned kites to their friends — what does that mean?\n\nSentence: "Maya helped the alien return to his home planet."\n💬 What does this tell us about where the alien went?',
    answer: 'return = to GO BACK or GIVE BACK 🏠\n\nTwo meanings:\n1. Go back to a place: "The alien RETURNED home" → he went BACK to his planet 🌍\n2. Give something back: "Return the book to the library" → bring it BACK 📚\n\nPrefix: re- = "again" → re-turn = turn AGAIN / go AGAIN\n\nBoth stories use it: Sam & Eli RETURNED kites to friends · The alien RETURNED to his home planet! ✨' },

  // ── Category Sorts (wp73–wp74) ────────────────────────────────────────────────
  { id: 'wp73', cat: 'wordplay', type: 'wordplay', emoji: '📏',
    question: 'CATEGORY SORTS — BIG vs SMALL (from Searching for Home)\n\nSort these into BIG or SMALL:\ncoin · elephant · germ · ring · rocket · planet · whale · mouse · crane · sunfish\n\nMatch synonyms:\n• Words meaning BIG: massive · enormous · huge · giant · colossal · gigantic · tremendous\n• Words meaning SMALL: tiny · little · mini · bitty · petite · teeny · miniscule · undersized\n\n❓ Which BIG word fits: "The ___ whale surfaced near the boat"?\n❓ Which SMALL word fits: "The ant left a ___ footprint"?',
    answer: 'BIG: elephant 🐘 · rocket 🚀 · planet 🌍 · whale 🐋 · crane 🏗️\nSMALL: coin 🪙 · germ 🦠 · ring 💍 · mouse 🐭 · sunfish 🐟\n\nBIG synonyms scale: colossal → gigantic → enormous → huge → large → massive → big\nSMALL synonyms scale: miniscule → teeny → petite → tiny → mini → bitty → small\n\n"The COLOSSAL whale surfaced near the boat." 🐋\n"The ant left a MINISCULE footprint." 🐜' },

  { id: 'wp74', cat: 'wordplay', type: 'wordplay', emoji: '🌡️',
    question: 'CATEGORY SORTS — HOT vs COLD (from Searching for Home)\n\nSort these into HOT or COLD:\nvolcano · snow · fire · ice cube · iron · glacier · sun · popsicle · candle · ice cream · desert · fridge\n\nSynonyms for HOT: burning · warm · fiery · boiling · blazing · scalding · sizzling\nSynonyms for COLD: chilly · iced · frigid · freezing · brisk · arctic · bitter · frozen\n\n❓ Which planet in Searching for Home was FRIGID? Why couldn\'t the alien live there?',
    answer: 'HOT: volcano 🌋 · fire 🔥 · iron · sun ☀️ · candle 🕯️ · desert 🏜️\nCOLD: snow ❄️ · ice cube 🧊 · glacier 🏔️ · popsicle 🍡 · ice cream 🍦 · fridge\n\nHOT scale: sizzling → scalding → boiling → blazing → fiery → burning → warm\nCOLD scale: arctic → frigid → freezing → icy → bitter → chilly → brisk\n\nThe FIRST planet was frigid — arctic-cold and stormy. Not at all like the alien\'s warm home planet! 🌌❄️' },

  // ── Describing Frames (wp75–wp76) ─────────────────────────────────────────────
  { id: 'wp75', cat: 'wordplay', type: 'wordplay', emoji: '🪁',
    question: 'DESCRIBING — The KITE from Cloudy\nUse the 6-point describing frame:\n\n1. CATEGORY: What group does a kite belong to?\n2. ACTION: What can a kite do?\n3. PLACE: Where can you find/fly a kite?\n4. PARTS: What parts does a kite have?\n5. LOOKS LIKE: What does a kite look like?\n6. UNIQUE: What is special about kites?\n\n"A kite is a __________ that __________."',
    answer: '1. CATEGORY: A toy — specifically a flying toy! 🪁\n2. ACTION: It flies, soars, glides, dips, swoops in the wind!\n3. PLACE: Parks, open fields, beaches — anywhere with wind ☁️\n4. PARTS: Frame (wooden sticks) · fabric or plastic sail · tail · string 🧵\n5. LOOKS LIKE: Flat, usually diamond-shaped, colourful, lightweight\n6. UNIQUE: Flies WITHOUT an engine — powered only by wind and a string!\n\n"A kite is a FLYING TOY that SOARS in the wind when you hold the string." 🌬️' },

  { id: 'wp76', cat: 'wordplay', type: 'wordplay', emoji: '🚀',
    question: 'DESCRIBING — The ROCKET from Searching for Home\nUse the 6-point describing frame:\n\n1. CATEGORY: What group does a rocket belong to?\n2. ACTION: What can a rocket do?\n3. PLACE: Where do you find rockets?\n4. PARTS: What parts does a rocket have?\n5. LOOKS LIKE: What does a rocket look like?\n6. UNIQUE: What is special about rockets?\n\n"A rocket is a __________ that __________."',
    answer: '1. CATEGORY: A vehicle — specifically a spacecraft 🛸\n2. ACTION: It blasts off, zooms, launches, travels, lands!\n3. PLACE: Launchpads, outer space, science museums 🌌\n4. PARTS: Nose cone · fuel tanks · engines · fins · windows 🔩\n5. LOOKS LIKE: Tall, metal, pointed at the top, fins at the bottom\n6. UNIQUE: Can travel to OUTER SPACE — faster than any other vehicle!\n\n"A rocket is a SPACECRAFT that BLASTS OFF and travels into outer space!" 🌙✨' },

  // ── One Sheet Language Lessons — Cloudy (wp77–wp80) ──────────────────────────
  { id: 'wp77', cat: 'wordplay', type: 'wordplay', emoji: '💡',
    question: 'ONE SHEET LANGUAGE LESSON — Cloudy #1\n\n📚 VOCAB WORD: curious\nWhat does curious mean? Use it in a sentence about Sam and Eli.\n\n🔡 PREFIX up- = higher or better\nWhich are real up- words? upward · upstairs · uproot · uplevel · upstream\n\n🧠 NAMING: Name 4 things that can FLY in the air.\n\n💬 CONVERSATION: What topic are YOU curious about? Why?\n\n📖 INFERENCING: Sam and Eli climbed into clouds. Could this story be real? How do you know?',
    answer: 'curious = wanting to know more · eager to explore and discover 🔍\nSentence: "Sam and Eli were CURIOUS about what was hiding inside the cloud."\n\nup- words: upward ✓ · upstairs ✓ · uproot ✓ · uplevel ✓ · upstream ✓ (all real!)\n\nThings that fly: birds 🐦 · planes ✈️ · kites 🪁 · butterflies 🦋 · balloons 🎈 · bees · helicopters · seeds (dandelion!)\n\nInferencing: FANTASY — real clouds are water vapour; they can\'t hold a castle or lost-and-found. It\'s a pretend adventure! 🌤️' },

  { id: 'wp78', cat: 'wordplay', type: 'wordplay', emoji: '⬆️',
    question: 'ONE SHEET LANGUAGE LESSON — Cloudy #2\n\n📚 VOCAB WORD: ascend\nWhat does ascend mean? Use it to describe what Sam and Eli did.\n\n🔡 SUFFIX -y = full of\nMake adjectives: cloud → ? · rock → ? · rain → ? · wind → ? · storm → ?\n\n🧠 NAMING: Name 3 things that can BE cloudy.\n\n💬 CONVERSATION: Sam and Eli\'s parents didn\'t believe them. Has anyone not believed you? How did that feel?\n\n📖 INFERENCING: Sam and Eli look up at the tree. What are they THINKING? What are the parents thinking?',
    answer: 'ascend = to go UP · to climb to a higher place 📈\nSentence: "Sam and Eli ASCENDED the tree until they popped into the cloud."\nOpposite: descend (go down)\n\n-y adjectives: cloudy ☁️ · rocky ⛰️ · rainy 🌧️ · windy 💨 · stormy ⛈️\n\nThings that can be cloudy: the sky · a glass of juice (milky/cloudy) · someone\'s mood ("feeling cloudy" = confused)\n\nInferencing: Brothers → excited, wondering if they can reach the cloud.\nParents → "They\'re playing pretend — clouds can\'t really hold anything!" 🤔' },

  { id: 'wp79', cat: 'wordplay', type: 'wordplay', emoji: '🔍',
    question: 'ONE SHEET LANGUAGE LESSON — Cloudy #3\n\n📚 VOCAB WORD: locate\nWhat does locate mean? How did Sam and Eli need to LOCATE something?\n\n🔡 SUFFIX -s = more than one (plural)\nMake plural: kite → ? · cloud → ? · brother → ? · parent → ? · friend → ?\n\n🧠 NAMING: Name 3 things you could CLIMB.\n\n💬 CONVERSATION: What would you do if you found a lost wallet?\n\n📖 INFERENCING: Why do schools have lost-and-founds? What might have happened to the other kites in the cloud lost-and-found?',
    answer: 'locate = to FIND the place where something is 🔍\nSentence: "Sam and Eli needed to LOCATE their kite — it had blown away!"\nWord family: locate → located → location → relocate\n\nPlurals (-s): kites · clouds · brothers · parents · friends\n\nThings to climb: a tree 🌳 · a ladder · a rock wall · stairs · a hill · a jungle gym\n\nLost wallet → return to teacher, police, or owner if there\'s ID inside.\nCloud lost-and-found → the other kites probably blew away from other kids flying them on windy days! 🪁' },

  { id: 'wp80', cat: 'wordplay', type: 'wordplay', emoji: '↩️',
    question: 'ONE SHEET LANGUAGE LESSON — Cloudy #4\n\n📚 VOCAB WORD: return\nWhat does return mean? How is it used two different ways in Cloudy?\n\n🔡 SUFFIX -ly = how something is done (adverb)\nMake adverbs: brave → ? · quick → ? · quiet → ? · kind → ?\n\n🧠 NAMING: Name 3 PARTS of a tree.\n\n💬 CONVERSATION: Would you like to fly a kite? Why or why not?\n\n📖 INFERENCING: If YOU were Sam and Eli\'s parent, would you have believed their cloud story? Why?',
    answer: 'return = to GO BACK or GIVE BACK 🏠\nIn Cloudy: Sam & Eli RETURNED the kites (gave them back) AND RETURNED home (came back) — two uses!\n\n-ly adverbs: bravely 🦁 · quickly 💨 · quietly 🤫 · kindly 💛\nSentence: "They bravely climbed up, quickly grabbed the kites, and kindly returned them."\n\nParts of a tree: trunk 🌳 · branches · leaves · roots · bark · canopy\n\nParent inference: Hard to believe! BUT — they came home with extra kites. Where did those come from if not a cloud lost-and-found? That\'s the evidence! 🤔' },
]

// ── Altogether sub-components ──────────────────────────────────────────────────

function RiddleCard({ a, revealed, onReveal, onGot, onMissed }) {
  return (
    <>
      <div className="ag-type-badge">🔍 Riddle</div>
      <div className="ag-emoji">{a.emoji}</div>
      <div className="speak-row">
        <p className="ag-question">{a.question}</p>
        <SpeakBtn text={a.question} />

      </div>
      {!revealed
        ? <button className="ag-reveal-btn" onClick={onReveal}>Reveal Answer</button>
        : <>
            <div className="ag-answer">
              <div className="speak-row">
                <span className="ag-answer-word">{a.answer}</span>
                <SpeakBtn text={a.answer} />
              </div>
            </div>
            <div className="ag-verdict-row">
              <button className="ag-btn ag-btn--got" onClick={onGot}>✓ Got it!</button>
              <button className="ag-btn ag-btn--missed" onClick={onMissed}>✗ Try again</button>
            </div>
          </>
      }
    </>
  )
}

function WHCard({ a, revealed, onReveal, onGot, onMissed }) {
  return (
    <>
      <div className="ag-type-badge">❓ WH Question</div>
      {a.story && (
        <div className="ag-story-box">
          <div className="speak-row">
            <p className="ag-story-text">{a.story}</p>
            <SpeakBtn text={a.story} />
          </div>
        </div>
      )}
      <div className="ag-wh-badge">{a.wh}?</div>
      <div className="speak-row">
        <p className="ag-question">{a.question}</p>
        <SpeakBtn text={a.question} />

      </div>
      {!revealed
        ? <button className="ag-reveal-btn" onClick={onReveal}>Show Answer</button>
        : <>
            <div className="ag-answer">
              <div className="speak-row">
                <div>
                  <p className="ag-answer-text">{a.answer}</p>
                  {a.explanation && <p className="ag-explanation">{a.explanation}</p>}
                </div>
                <SpeakBtn text={a.answer} />
              </div>
            </div>
            <div className="ag-verdict-row">
              <button className="ag-btn ag-btn--got" onClick={onGot}>✓ Got it!</button>
              <button className="ag-btn ag-btn--missed" onClick={onMissed}>✗ Try again</button>
            </div>
          </>
      }
    </>
  )
}

function choiceCorrectIdx(a) {
  if (a.options !== undefined) return a.correct
  const opts = a.choices || []
  return opts.findIndex(o => a.answer && a.answer.toLowerCase().startsWith(o.toLowerCase()))
}

function ChoiceCard({ a, revealed, choiceSelected, onSelect, onNext }) {
  const opts = a.options || a.choices || []
  const correctIdx = choiceCorrectIdx(a)
  const isCorrect = choiceSelected === correctIdx
  const correctText = opts[correctIdx] || a.answer || ''
  const badge = a.cat === 'social' ? '🤝 Social Skills' : a.cat === 'wh' ? '❓ WH Quiz' : '🧠 Quiz'
  return (
    <>
      <div className="ag-type-badge">{badge}</div>
      {a.story && (
        <div className="ag-story-box">
          <div className="speak-row">
            <p className="ag-story-text">{a.story}</p>
            <SpeakBtn text={a.story} />
          </div>
        </div>
      )}
      {a.emoji && <div className="ag-emoji">{a.emoji}</div>}
      <div className="speak-row">
        <p className="ag-question">{a.question}</p>
        <SpeakBtn text={a.question} />
      </div>
      <div className="ag-choice-grid">
        {opts.map((opt, i) => {
          let cls = 'ag-choice-btn'
          if (revealed) {
            if (i === correctIdx)          cls += ' ag-choice-btn--correct'
            else if (i === choiceSelected) cls += ' ag-choice-btn--wrong'
            else                           cls += ' ag-choice-btn--faded'
          }
          return (
            <div key={i} className="ag-choice-row">
              <button className={cls} onClick={() => onSelect(i)} disabled={revealed}>
                <span className="ag-choice-letter">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
              <SpeakBtn text={opt} />
            </div>
          )
        })}
      </div>
      {revealed && (
        <>
          <p className={`ag-verdict-text ${isCorrect ? 'ag-verdict-text--correct' : 'ag-verdict-text--wrong'}`}>
            {isCorrect ? '🎉 Correct!' : '✗ Not quite!'}
          </p>
          {(a.explanation || a.answer) && (
            <div className="speak-row">
              <p className="ag-explanation">{a.explanation || a.answer}</p>
              <SpeakBtn text={a.explanation || a.answer} />
            </div>
          )}
          <button className="ag-reveal-btn" onClick={onNext}>Next →</button>
        </>
      )}
    </>
  )
}

function SequenceCard({ a, revealed, onReveal, onNext }) {
  const [order, setOrder]     = useState(() => a.scrambled ? [...a.scrambled] : [])
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (a.scrambled) setOrder([...a.scrambled])
    setChecked(false)
  }, [a.id])

  function moveUp(i) {
    if (i === 0) return
    setOrder(o => { const n = [...o]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; return n })
    setChecked(false)
  }
  function moveDown(i) {
    if (i === order.length - 1) return
    setOrder(o => { const n = [...o]; [n[i], n[i + 1]] = [n[i + 1], n[i]]; return n })
    setChecked(false)
  }

  if (a.steps) {
    return (
      <>
        <div className="ag-type-badge">📋 Story Structure</div>
        <div className="ag-emoji">{a.emoji}</div>
        {a.title && (
          <div className="speak-row">
            <p className="ag-question">{a.title}</p>
            <SpeakBtn text={a.title} />
          </div>
        )}
        <p className="ag-seq-prompt">{revealed ? 'Here\'s the full breakdown:' : 'Can you describe each part?'}</p>
        <div className="ag-sequence">
          {a.steps.map((step, i) => (
            <div key={i} className={`ag-step ${revealed ? 'ag-step--correct' : 'ag-step--scrambled'}`}>
              <span className="ag-step-num">{step.n}</span>
              {revealed && <span style={{ flex: 1 }}>{step.d}</span>}
              {revealed && <SpeakBtn text={step.d} />}
            </div>
          ))}
        </div>
        {!revealed
          ? <button className="ag-reveal-btn" onClick={onReveal}>Show Details</button>
          : <button className="ag-reveal-btn" onClick={onNext}>Next →</button>
        }
      </>
    )
  }

  const isAllCorrect = checked && order.every((step, i) => step === a.answer[i])

  return (
    <>
      <div className="ag-type-badge">📋 Story Order</div>
      <div className="ag-emoji">{a.emoji}</div>
      <div className="speak-row">
        <p className="ag-question">{a.title}</p>
        <SpeakBtn text={a.title} />
      </div>
      <p className="ag-seq-prompt">
        {revealed ? 'Here\'s the correct order:' : 'Use ↑ ↓ to put the steps in the right order!'}
      </p>
      <div className="ag-sequence">
        {(revealed ? a.answer : order).map((step, i) => {
          const isCorrect = checked ? step === a.answer[i] : null
          return (
            <div key={i} className={`ag-step ${revealed ? 'ag-step--correct' : checked ? (isCorrect ? 'ag-step--correct' : 'ag-step--wrong') : 'ag-step--scrambled'}`}>
              <span className="ag-step-num" style={checked && !revealed ? { background: isCorrect ? 'rgba(20,184,166,0.15)' : 'rgba(239,68,68,0.15)', color: isCorrect ? '#14b8a6' : '#ef4444' } : {}}>
                {revealed ? i + 1 : checked ? (isCorrect ? '✓' : '✗') : i + 1}
              </span>
              <span style={{ flex: 1 }}>{step}</span>
              <SpeakBtn text={step} />
              {!revealed && (
                <div className="ag-step-arrows">
                  <button className="ag-step-arrow" onClick={() => moveUp(i)} disabled={i === 0} aria-label="Move up">↑</button>
                  <button className="ag-step-arrow" onClick={() => moveDown(i)} disabled={i === order.length - 1} aria-label="Move down">↓</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {!revealed && (
        <>
          {checked && isAllCorrect && <p className="ag-seq-feedback ag-seq-feedback--correct">🎉 Perfect order!</p>}
          {checked && !isAllCorrect && <p className="ag-seq-feedback ag-seq-feedback--wrong">Not quite — keep rearranging or reveal the answer.</p>}
          <div className="ag-seq-btn-row">
            <button className="ag-reveal-btn ag-reveal-btn--check" onClick={() => setChecked(true)}>Check Order</button>
            <button className="ag-reveal-btn" onClick={onReveal}>Show Answer</button>
          </div>
        </>
      )}
      {revealed && <button className="ag-reveal-btn" onClick={onNext}>Next →</button>}
    </>
  )
}

function WordPlayCard({ a, revealed, onReveal, onGot, onMissed }) {
  return (
    <>
      <div className="ag-type-badge">🔤 Word Play</div>
      <div className="ag-emoji">{a.emoji}</div>
      <div className="speak-row">
        <p className="ag-question">{a.question}</p>
        <SpeakBtn text={a.question} />

      </div>
      {!revealed
        ? <button className="ag-reveal-btn" onClick={onReveal}>Reveal Answer</button>
        : <>
            {a.visual && (
              <div className="ag-syllables">
                {a.visual.flatMap((syl, i) => {
                  const items = [<span key={`s${i}`} className="ag-syl-bubble">{syl}</span>]
                  if (i < a.visual.length - 1) items.push(<span key={`d${i}`} className="ag-syl-dot">·</span>)
                  return items
                })}
              </div>
            )}
            <div className="ag-answer">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', width: '100%' }}>
                <div style={{ flex: 1 }}>
                  {a.answer.split('\n').map((line, i) =>
                    <p key={i} className="ag-answer-text">{line}</p>
                  )}
                </div>
                <SpeakBtn text={a.answer} />
              </div>
            </div>
            <div className="ag-verdict-row">
              <button className="ag-btn ag-btn--got" onClick={onGot}>✓ Got it!</button>
              <button className="ag-btn ag-btn--missed" onClick={onMissed}>✗ Try again</button>
            </div>
          </>
      }
    </>
  )
}

function DirectionsCard({ a, onDone }) {
  return (
    <>
      <div className="ag-type-badge">👆 Follow Along</div>
      <div className="ag-emoji">{a.emoji}</div>
      <div className="ag-directions-box">
        {a.instruction.split('\n').map((line, i) =>
          line.trim()
            ? (
              <div key={i} className="ag-dir-line-row">
                <p className="ag-dir-line">{line}</p>
                <SpeakBtn text={line} />
              </div>
            )
            : <br key={i} />
        )}
      </div>
      <button className="ag-reveal-btn ag-reveal-btn--done" onClick={onDone}>
        {a.confirmText}
      </button>
    </>
  )
}

function AltogetherSection() {
  const [cat, setCat]               = useState('all')
  const [idx, setIdx]               = useState(0)
  const [revealed, setRevealed]     = useState(false)
  const [choiceSelected, setChoice] = useState(-1)
  const [score, setScore]           = useState({ got: 0, total: 0 })

  const filtered = cat === 'all' ? ALTOGETHER : ALTOGETHER.filter(a => a.cat === cat)
  const activity = filtered[Math.min(idx, filtered.length - 1)]

  function resetCard() { setRevealed(false); setChoice(-1) }
  function changeCat(c) { setCat(c); setIdx(0); resetCard() }
  function goNext() { if (idx < filtered.length - 1) { setIdx(i => i + 1); resetCard() } }
  function goPrev() { if (idx > 0) { setIdx(i => i - 1); resetCard() } }
  function gotIt()  { setScore(s => ({ got: s.got + 1, total: s.total + 1 })); goNext() }
  function missed() { setScore(s => ({ ...s, total: s.total + 1 })); resetCard() }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function selectChoice(optIdx) {
    if (choiceSelected !== -1) return
    setChoice(optIdx)
    setRevealed(true)
    if (optIdx === choiceCorrectIdx(activity)) setScore(s => ({ got: s.got + 1, total: s.total + 1 }))
    else setScore(s => ({ ...s, total: s.total + 1 }))
  }

  if (!activity) return null

  return (
    <div className="altogether-section">
      <div className="ag-header">
        <p className="section-desc" style={{ margin: 0 }}>
          Activities drawn directly from Diya's therapy PDFs — WH stories, phonological awareness challenges, following directions task cards, and more!
        </p>
        {score.total > 0 && (
          <div className="ag-score">⭐ {score.got} / {score.total}</div>
        )}
      </div>

      <div className="ag-cat-bar">
        {ALTOGETHER_CATS.map(c => (
          <button
            key={c.id}
            className={`ag-cat-btn${cat === c.id ? ' ag-cat-btn--active' : ''}`}
            onClick={() => changeCat(c.id)}
          >{c.label}</button>
        ))}
      </div>

      <p className="ag-counter">Activity {idx + 1} of {filtered.length}</p>

      <div className={`ag-card ag-card--${activity.type}`}>
        {activity.type === 'riddle'     && <RiddleCard    a={activity} revealed={revealed} onReveal={() => setRevealed(true)} onGot={gotIt} onMissed={missed} />}
        {activity.type === 'wh'         && <WHCard        a={activity} revealed={revealed} onReveal={() => setRevealed(true)} onGot={gotIt} onMissed={missed} />}
        {activity.type === 'choice'     && <ChoiceCard    a={activity} revealed={revealed} choiceSelected={choiceSelected} onSelect={selectChoice} onNext={goNext} />}
        {activity.type === 'sequence'   && <SequenceCard  a={activity} revealed={revealed} onReveal={() => setRevealed(true)} onNext={goNext} />}
        {activity.type === 'wordplay'   && <WordPlayCard  a={activity} revealed={revealed} onReveal={() => setRevealed(true)} onGot={gotIt} onMissed={missed} />}
        {activity.type === 'directions' && <DirectionsCard a={activity} onDone={goNext} />}
      </div>

      <div className="ag-nav">
        <button className="ag-nav-btn" onClick={goPrev} disabled={idx === 0}>← Prev</button>
        <button className="ag-nav-btn" onClick={goNext} disabled={idx === filtered.length - 1}>Next →</button>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Therapy() {
  const { profileId } = useParams()
  const { data }      = useQuery(GET_PROFILES)
  const profile       = (data?.profiles ?? []).find(p => p.id === profileId) ?? null
  const name          = profile ? `${profile.firstName}${profile.lastName ? ` ${profile.lastName}` : ''}` : ''

  const { get, cycle, toggle, stats } = useTherapyProgress(profileId)
  const [tab, setTab] = useState('vocabulary')

  // Overall progress across all fixed sections
  const allKeys = Object.values(SECTION_KEYS).flat()
  const { done: totalDone, total: totalAll, pct: totalPct } = stats(allKeys)

  return (
    <div className="therapy-page">
      <Breadcrumb />
      <div className="therapy-header">
        <div className="therapy-header-top">
          <div>
            <h1>Therapy</h1>
            {name && <p className="therapy-subtitle">for {name}</p>}
          </div>
          <div className="therapy-overall">
            <div className="therapy-overall-bar">
              <div className="therapy-overall-fill" style={{ width: `${totalPct}%` }} />
            </div>
            <span className="therapy-overall-label">
              {totalDone}/{totalAll} completed
            </span>
          </div>
        </div>
      </div>

      <div className="therapy-tabs">
        {TABS.map(t => {
          const keys   = SECTION_KEYS[t.id] || []
          const { done, total, pct } = stats(keys)
          const allDone = total > 0 && done === total
          return (
            <button
              key={t.id}
              className={`therapy-tab${tab === t.id ? ' therapy-tab--active' : ''}${allDone ? ' therapy-tab--complete' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className="therapy-tab-label">{t.label}</span>
              {total > 0 && (
                <span className={`therapy-tab-stat${allDone ? ' therapy-tab-stat--done' : done > 0 ? ' therapy-tab-stat--partial' : ''}`}>
                  {done}/{total}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="therapy-content">
        {tab === 'vocabulary'  && <VocabularySection get={get} toggle={toggle} />}
        {tab === 'reading'     && <ReadingSection    get={get} cycle={cycle} stats={stats} />}
        {tab === 'wh'          && <WHSection         get={get} cycle={cycle} />}
        {tab === 'social'      && <SocialSection     get={get} cycle={cycle} />}
        {tab === 'directions'  && <DirectionsSection get={get} cycle={cycle} />}
        {tab === 'language'    && <LanguageSection   get={get} cycle={cycle} />}
        {tab === 'aba'         && <ABASection        get={get} cycle={cycle} stats={stats} />}
        {tab === 'altogether'  && <AltogetherSection />}
        {tab === 'picture'     && <PictureSection />}
      </div>
    </div>
  )
}
