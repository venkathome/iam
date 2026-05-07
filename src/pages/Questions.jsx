import { useState, useCallback, useEffect } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import DifficultySelector from '../components/DifficultySelector'
import '../components/DifficultySelector.css'
import { QUESTIONS, CATEGORIES } from '../data/communicateData'
import './Communicate.css'

const DIFF_CONFIG = {
  'very-easy': { ageRange: '4-6',   canReveal: true  },
  'easy':      { ageRange: '7-9',   canReveal: true  },
  'medium':    { ageRange: '10-12', canReveal: true  },
  'hard':      { ageRange: '13-15', canReveal: true  },
  'very-hard': { ageRange: '16-19', canReveal: true  },
  'ultimate':  { ageRange: '16-19', canReveal: false },
}

const SPARK_COLORS = ['#f97316','#ec4899','#a78bfa','#06b6d4','#4ade80','#fbbf24','#fb923c']

const FUN_TIPS = [
  { icon: '💡', text: 'Great conversations start with <span>curiosity</span>. Ask follow-up questions!' },
  { icon: '👂', text: 'The best communicators <span>listen twice</span> as much as they speak.' },
  { icon: '🎯', text: 'Specific questions get <span>amazing answers</span>. Instead of "how was your day?", try "what made you smile today?"' },
  { icon: '🌟', text: 'There are <span>no wrong answers</span> here — every answer starts a conversation!' },
  { icon: '🤝', text: '<span>Empathy</span> means trying to understand how someone else feels. Ask about feelings, not just facts!' },
  { icon: '🎤', text: 'Try the <span>Question for Question</span> category — it\'s a fun way to learn how to keep conversations going!' },
  { icon: '😂', text: 'Laughter is the <span>best icebreaker</span>. Don\'t be afraid to be silly!' },
  { icon: '🔥', text: 'Challenge yourself! Try the <span>Brain Busters</span> category when you\'re ready to level up.' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function Sparkles({ items }) {
  if (!items.length) return null
  return (
    <div className="comm-sparkle-container" aria-hidden>
      {items.map(s => (
        <span key={s.id} className="comm-sparkle" style={{ left: `${s.x}%`, top: `${s.y}%`, '--spark-color': s.color, '--dx': `${s.dx}px`, '--dy': `${s.dy}px` }} />
      ))}
    </div>
  )
}

function QuestionsIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="30" height="22" rx="6" fill="url(#qg1)" opacity="0.9"/>
      <circle cx="13" cy="17" r="2.2" fill="white"/>
      <circle cx="19" cy="17" r="2.2" fill="white"/>
      <circle cx="25" cy="17" r="2.2" fill="white"/>
      <path d="M9 28 L6 34 L16 30" fill="url(#qg1)"/>
      <rect x="18" y="24" width="30" height="22" rx="6" fill="url(#qg2)" opacity="0.9"/>
      <text x="33" y="39" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Arial Black, Arial">?</text>
      <defs>
        <linearGradient id="qg1" x1="4" y1="6" x2="34" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f97316"/><stop offset="1" stopColor="#ec4899"/>
        </linearGradient>
        <linearGradient id="qg2" x1="18" y1="24" x2="48" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a78bfa"/><stop offset="1" stopColor="#06b6d4"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Questions() {
  const [difficulty, setDifficulty] = useState('medium')
  const [category, setCategory] = useState('')
  const [questions, setQuestions] = useState([])
  const [qIndex, setQIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [cardState, setCardState] = useState('idle')
  const [sparkles, setSparkles] = useState([])
  const [favorites, setFavorites] = useState([])
  const [showFavs, setShowFavs] = useState(false)
  const [tipIndex, setTipIndex] = useState(0)
  const [savedIds, setSavedIds] = useState(new Set())

  useEffect(() => {
    if (category) {
      const ageRange = DIFF_CONFIG[difficulty].ageRange
      const qs = QUESTIONS[ageRange]?.[category] ?? []
      setQuestions(shuffle(qs))
      setQIndex(0)
      setRevealed(false)
      setCardState('idle')
    }
  }, [difficulty, category])

  useEffect(() => {
    const iv = setInterval(() => setTipIndex(i => (i + 1) % FUN_TIPS.length), 8000)
    return () => clearInterval(iv)
  }, [])

  const fireSparkles = useCallback(() => {
    const items = Array.from({ length: 14 }, (_, id) => ({
      id, x: 20 + Math.random() * 60, y: 20 + Math.random() * 60,
      color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
      dx: (Math.random() - 0.5) * 160, dy: (Math.random() - 0.5) * 120,
    }))
    setSparkles(items)
    setTimeout(() => setSparkles([]), 1000)
  }, [])

  const transition = useCallback((cb) => {
    setCardState('out')
    setTimeout(() => { cb(); setRevealed(false); setCardState('in'); setTimeout(() => setCardState('idle'), 240) }, 190)
  }, [])

  function nextQuestion() { transition(() => setQIndex(i => (i + 1) % questions.length)) }
  function prevQuestion() { transition(() => setQIndex(i => (i - 1 + questions.length) % questions.length)) }

  useEffect(() => {
    if (!questions.length) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') nextQuestion()
      else if (e.key === 'ArrowLeft') prevQuestion()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function shuffleNow() {
    fireSparkles()
    setQuestions(q => shuffle([...q]))
    setQIndex(0)
    setRevealed(false)
  }

  function toggleFavorite() {
    const q = questions[qIndex]
    if (!q) return
    const key = typeof q === 'object' ? (q.q || q.starter) : q
    if (savedIds.has(key)) {
      setSavedIds(s => { const ns = new Set(s); ns.delete(key); return ns })
      setFavorites(f => f.filter(x => x !== key))
    } else {
      setSavedIds(s => new Set(s).add(key))
      setFavorites(f => [key, ...f])
      fireSparkles()
    }
  }

  const cfg = DIFF_CONFIG[difficulty]

  const currentQ = questions[qIndex]
  const catInfo = CATEGORIES.find(c => c.id === category)
  const isQforQ = category === 'qForQ'
  const isRevealable = cfg.canReveal && !isQforQ && currentQ && typeof currentQ === 'object' && !!currentQ.a
  const qKey = currentQ ? typeof currentQ === 'object' ? (currentQ.q || currentQ.starter) : currentQ : null
  const isFaved = qKey ? savedIds.has(qKey) : false
  const tip = FUN_TIPS[tipIndex]

  return (
    <div className="communicate-page">
      <Sparkles items={sparkles} />
      <Breadcrumb />

      <div className="comm-header">
        <QuestionsIcon />
        <h1 className="comm-title">Questions!</h1>
        <p className="comm-subtitle">Questions, riddles & fun for curious minds 🎉</p>
      </div>

      <DifficultySelector value={difficulty} onChange={d => { setDifficulty(d); setCategory(''); setQuestions([]); setQIndex(0); setRevealed(false) }} />

      <div className="comm-categories-section">
        <p className="comm-categories-title">Pick a category</p>
        <div className="comm-categories-grid">
          {CATEGORIES.map(cat => (
            <button key={cat.id} className={`comm-cat-btn ${category === cat.id ? 'active' : ''}`} style={{ '--cat-color': cat.color }} onClick={() => setCategory(cat.id)}>
              <span className="comm-cat-emoji">{cat.emoji}</span>{cat.label}
            </button>
          ))}
        </div>
      </div>

      {questions.length > 0 && catInfo && (
        <div className="comm-card-section">
          <div className="comm-progress">
            <span>{qIndex + 1}</span>
            <div className="comm-progress-bar-track">
              <div className="comm-progress-bar-fill" style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }}/>
            </div>
            <span>{questions.length}</span>
          </div>

          <div className={`comm-card ${cardState === 'out' ? 'flip-out' : cardState === 'in' ? 'flip-in' : ''}`} style={{ '--cat-color': catInfo.color }} onClick={() => { if (isRevealable && !revealed) setRevealed(true) }}>
            <div className="comm-card-glow" />
            {isQforQ ? (
              <>
                <span className="comm-card-emoji">🎤</span>
                <div className="comm-qforq-starter">"{currentQ.starter}"</div>
                <div className="comm-qforq-arrow">↓</div>
                <div className="comm-qforq-reply">💬 "{currentQ.reply}"</div>
                <p className="comm-qforq-tip">💡 {currentQ.tip}</p>
              </>
            ) : (
              <>
                <span className="comm-card-emoji">{catInfo.emoji}</span>
                <p className="comm-card-question">{isRevealable ? currentQ.q : (typeof currentQ === 'string' ? currentQ : currentQ.q)}</p>
                {isRevealable && revealed && <div className="comm-card-answer">✅ {currentQ.a}</div>}
                {isRevealable && !revealed && <span className="comm-card-hint">👆 Tap to reveal the answer!</span>}
              </>
            )}
          </div>

          <div className="comm-card-nav">
            <button className="comm-nav-btn" onClick={prevQuestion} disabled={questions.length <= 1}>← Prev</button>
            <button className="comm-nav-btn primary" onClick={nextQuestion}>Next →</button>
            <button className="comm-nav-btn shuffle" onClick={shuffleNow} title="Shuffle">🔀 Shuffle</button>
            <button className={`comm-nav-btn fav ${isFaved ? 'saved' : ''}`} onClick={toggleFavorite}>{isFaved ? '⭐ Saved!' : '☆ Save'}</button>
          </div>
        </div>
      )}

      {category && questions.length === 0 && (
        <div className="comm-empty"><div className="comm-empty-icon">🤔</div><h2 className="comm-empty-title">Coming soon!</h2><p className="comm-empty-text">More questions are on their way. Try another category!</p></div>
      )}

      {!category && (
        <div className="comm-empty"><div className="comm-empty-icon">💬</div><h2 className="comm-empty-title">Let's get talking!</h2><p className="comm-empty-text">Pick a difficulty and a category to start exploring hundreds of questions, riddles, and more.</p></div>
      )}

      {!category && (
        <div className="comm-fun-bar" key={tipIndex}>
          <span className="comm-fun-bar-icon">{tip.icon}</span>
          <p className="comm-fun-bar-text" dangerouslySetInnerHTML={{ __html: tip.text }} />
        </div>
      )}

      {favorites.length > 0 && (
        <>
          <button className="comm-favs-toggle" onClick={() => setShowFavs(v => !v)}>⭐ {showFavs ? 'Hide' : 'Show'} Favourites ({favorites.length})</button>
          {showFavs && (
            <div className="comm-favs-panel">
              <p className="comm-favs-title">⭐ Your Favourite Questions</p>
              {favorites.map((q, i) => (
                <div key={i} className="comm-fav-item">
                  <span>{q}</span>
                  <button className="comm-fav-remove" onClick={() => { setSavedIds(s => { const ns = new Set(s); ns.delete(q); return ns }); setFavorites(f => f.filter(x => x !== q)) }} title="Remove">✕</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
