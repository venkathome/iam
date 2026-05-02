import { useState, useCallback } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import { BRANDS, BRAND_CATEGORIES } from '../data/brandsData'
import './Brands.css'

const SPARK_COLORS = ['#f97316','#ec4899','#a78bfa','#06b6d4','#4ade80','#fbbf24']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateChoices(allBrands, correct) {
  const others = allBrands.filter(b => b.id !== correct.id)
  return shuffle([correct, ...shuffle([...others]).slice(0, 3)])
}

function Sparkles({ items }) {
  if (!items.length) return null
  return (
    <div className="br-sparkle-container" aria-hidden>
      {items.map(s => (
        <span key={s.id} className="br-sparkle" style={{ left: `${s.x}%`, top: `${s.y}%`, '--spark-color': s.color, '--dx': `${s.dx}px`, '--dy': `${s.dy}px` }} />
      ))}
    </div>
  )
}

function BrandsIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="26" height="20" rx="5" fill="url(#bri1)" opacity="0.9"/>
      <text x="17" y="21" textAnchor="middle" fill="white" fontSize="11" fontWeight="900" fontFamily="Arial Black, Arial">B</text>
      <rect x="22" y="22" width="26" height="20" rx="5" fill="url(#bri2)" opacity="0.9"/>
      <text x="35" y="35" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Arial Black, Arial">?</text>
      <defs>
        <linearGradient id="bri1" x1="4" y1="8" x2="30" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f97316"/><stop offset="1" stopColor="#ec4899"/>
        </linearGradient>
        <linearGradient id="bri2" x1="22" y1="22" x2="48" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1"/><stop offset="1" stopColor="#06b6d4"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

function StarRating({ score, total }) {
  const pct = total > 0 ? score / total : 0
  const stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0
  return (
    <div className="br-stars">
      {[1, 2, 3].map(n => (
        <span key={n} className={`br-star ${n <= stars ? 'filled' : ''}`}>★</span>
      ))}
    </div>
  )
}

export default function Brands() {
  const [screen, setScreen] = useState('home')
  const [category, setCategory] = useState(null)
  const [brandsList, setBrandsList] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [choices, setChoices] = useState([])
  const [selected, setSelected] = useState(null)
  const [sparkles, setSparkles] = useState([])

  const fireSparkles = useCallback(() => {
    const items = Array.from({ length: 14 }, (_, id) => ({
      id, x: 20 + Math.random() * 60, y: 20 + Math.random() * 60,
      color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
      dx: (Math.random() - 0.5) * 160, dy: (Math.random() - 0.5) * 120,
    }))
    setSparkles(items)
    setTimeout(() => setSparkles([]), 1000)
  }, [])

  function startQuiz(catId) {
    const all = BRANDS[catId]
    const shuffled = shuffle([...all])
    setBrandsList(shuffled)
    setCurrentIndex(0)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setSelected(null)
    setChoices(generateChoices(all, shuffled[0]))
    setCategory(catId)
    setScreen('quiz')
  }

  function handleAnswer(brandId) {
    if (selected) return
    setSelected(brandId)
    const correct = brandId === brandsList[currentIndex].id
    if (correct) {
      setScore(s => s + 1)
      setStreak(s => {
        const ns = s + 1
        setMaxStreak(m => Math.max(m, ns))
        return ns
      })
      fireSparkles()
    } else {
      setStreak(0)
    }
  }

  function nextQuestion() {
    const nextIdx = currentIndex + 1
    if (nextIdx >= brandsList.length) {
      setScreen('end')
    } else {
      setCurrentIndex(nextIdx)
      setSelected(null)
      setChoices(generateChoices(BRANDS[category], brandsList[nextIdx]))
    }
  }

  const catInfo = category ? BRAND_CATEGORIES.find(c => c.id === category) : null
  const currentBrand = brandsList[currentIndex]
  const isAnswered = selected !== null
  const isCorrect = selected === currentBrand?.id

  if (screen === 'home') {
    return (
      <div className="brands-page">
        <Breadcrumb />
        <div className="br-header">
          <BrandsIcon />
          <h1 className="br-title">Brand Quiz!</h1>
          <p className="br-subtitle">Guess the brand from the logo 🏆</p>
        </div>
        <div className="br-home-grid">
          {BRAND_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className="br-cat-tile"
              style={{ '--cat-color': cat.color }}
              onClick={() => startQuiz(cat.id)}
            >
              <span className="br-cat-emoji">{cat.emoji}</span>
              <span className="br-cat-label">{cat.label}</span>
              <span className="br-cat-count">{BRANDS[cat.id].length} brands</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (screen === 'end') {
    const pct = brandsList.length > 0 ? score / brandsList.length : 0
    const msg =
      pct === 1 ? '🏆 Perfect score! You\'re a brand genius!' :
      pct >= 0.8 ? '🌟 Amazing! You really know your brands!' :
      pct >= 0.6 ? '👍 Great job! Keep practising!' :
      pct >= 0.4 ? '😊 Good effort! You\'re learning fast!' :
      '💪 Keep going — you\'ll get better every time!'

    return (
      <div className="brands-page">
        <Sparkles items={sparkles} />
        <Breadcrumb />
        <div className="br-end-screen">
          <h2 className="br-end-title">Quiz Complete!</h2>
          <StarRating score={score} total={brandsList.length} />
          <div className="br-end-score">{score} / {brandsList.length}</div>
          <p className="br-end-msg">{msg}</p>
          {maxStreak >= 3 && (
            <div className="br-end-streak">🔥 Best streak: {maxStreak} in a row!</div>
          )}
          <div className="br-end-actions">
            <button className="br-btn primary" onClick={() => startQuiz(category)}>
              🔄 Play Again
            </button>
            <button className="br-btn secondary" onClick={() => setScreen('home')}>
              ← Back to Categories
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Quiz screen
  const { Logo } = currentBrand

  return (
    <div className="brands-page">
      <Sparkles items={sparkles} />
      <Breadcrumb />

      <div className="br-quiz-top">
        <div className="br-quiz-meta">
          <span className="br-cat-badge" style={{ '--cat-color': catInfo?.color }}>{catInfo?.emoji} {catInfo?.label}</span>
          {streak >= 3 && <span className="br-streak-badge">🔥 {streak} streak!</span>}
        </div>
        <div className="br-score-badge">{score}/{currentIndex}</div>
      </div>

      <div className="br-progress">
        <div className="br-progress-bar">
          <div className="br-progress-fill" style={{ width: `${((currentIndex + 1) / brandsList.length) * 100}%` }}/>
        </div>
        <span className="br-progress-text">{currentIndex + 1} of {brandsList.length}</span>
      </div>

      <div className="br-logo-card">
        <div className="br-logo-wrapper">
          <Logo />
        </div>
        <p className="br-logo-country">{currentBrand.country} · Est. {currentBrand.founded}</p>
      </div>

      <div className="br-choices-grid">
        {choices.map(brand => {
          let state = ''
          if (isAnswered) {
            if (brand.id === currentBrand.id) state = 'correct'
            else if (brand.id === selected) state = 'wrong'
            else state = 'dim'
          }
          return (
            <button
              key={brand.id}
              className={`br-choice-btn ${state}`}
              onClick={() => handleAnswer(brand.id)}
              disabled={isAnswered}
            >
              {brand.name}
            </button>
          )
        })}
      </div>

      {isAnswered && (
        <div className={`br-result ${isCorrect ? 'correct' : 'wrong'}`}>
          <div className="br-result-icon">{isCorrect ? '✅' : '❌'}</div>
          <div className="br-result-text">
            {isCorrect ? 'Correct!' : `It was ${currentBrand.name}!`}
          </div>
          <div className="br-fact-box">
            💡 {currentBrand.funFact}
          </div>
          <button className="br-btn primary" onClick={nextQuestion}>
            {currentIndex + 1 < brandsList.length ? 'Next Brand →' : 'See Results 🏆'}
          </button>
        </div>
      )}
    </div>
  )
}
