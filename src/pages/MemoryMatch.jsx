import { useState, useEffect, useCallback } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import DifficultySelector from '../components/DifficultySelector'
import HowToPlay from '../components/HowToPlay'
import '../components/DifficultySelector.css'
import './MemoryMatch.css'

const HOW_TO_PLAY = [
  'All cards start face-down.',
  'Click any card to flip it and see the emoji underneath.',
  'Click a second card — if they match, both stay face-up.',
  "If they don't match, both flip back over. Try to remember where they were!",
  'Find all matching pairs to win.',
]

const EMOJIS = ['🐶', '🦁', '🐸', '🦋', '🌈', '🍕', '🚀', '⭐', '🎸', '🏆', '🦄', '🌺', '🍦', '🎨', '🦊', '🐬']

const DIFF_CONFIG = {
  'very-easy': { pairs: 4  },
  'easy':      { pairs: 6  },
  'medium':    { pairs: 8  },
  'hard':      { pairs: 10 },
  'very-hard': { pairs: 12 },
  'ultimate':  { pairs: 16 },
}

function buildDeck(pairs) {
  const pool = EMOJIS.slice(0, pairs)
  const deck = [...pool, ...pool].map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function MemoryMatch() {
  const [difficulty, setDifficulty] = useState('medium')
  const [cards, setCards]           = useState(() => buildDeck(DIFF_CONFIG['medium'].pairs))
  const [selected, setSelected]     = useState([])
  const [locked, setLocked]         = useState(false)
  const [moves, setMoves]           = useState(0)
  const [elapsed, setElapsed]       = useState(0)
  const [won, setWon]               = useState(false)

  const totalPairs = DIFF_CONFIG[difficulty].pairs
  const matchedCount = cards.filter(c => c.matched).length
  const pairs = matchedCount / 2

  useEffect(() => {
    if (won) return
    const id = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(id)
  }, [won])

  useEffect(() => {
    if (matchedCount === totalPairs * 2) setWon(true)
  }, [matchedCount, totalPairs])

  const flip = useCallback((card) => {
    if (locked || card.flipped || card.matched) return

    setCards(prev => prev.map(c => c.id === card.id ? { ...c, flipped: true } : c))
    setSelected(prev => {
      const next = [...prev, card]
      if (next.length === 2) {
        setMoves(m => m + 1)
        if (next[0].emoji === next[1].emoji) {
          setCards(all => all.map(c =>
            c.emoji === next[0].emoji ? { ...c, matched: true } : c
          ))
          return []
        } else {
          setLocked(true)
          setTimeout(() => {
            setCards(all => all.map(c =>
              (c.id === next[0].id || c.id === next[1].id) ? { ...c, flipped: false } : c
            ))
            setLocked(false)
          }, 900)
          return []
        }
      }
      return next
    })
  }, [locked])

  function restart(pairsCount) {
    setCards(buildDeck(pairsCount))
    setSelected([])
    setLocked(false)
    setMoves(0)
    setElapsed(0)
    setWon(false)
  }

  function handleDifficultyChange(d) {
    setDifficulty(d)
    restart(DIFF_CONFIG[d].pairs)
  }

  return (
    <div className="mm-page">
      <Breadcrumb />
      <h1>Memory Match</h1>

      <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
      <HowToPlay steps={HOW_TO_PLAY} />

      <div className="mm-stats">
        <span className="mm-stat"><span className="mm-stat-label">Pairs</span>{pairs}/{totalPairs}</span>
        <span className="mm-stat"><span className="mm-stat-label">Moves</span>{moves}</span>
        <span className="mm-stat"><span className="mm-stat-label">Time</span>{formatTime(elapsed)}</span>
      </div>

      {won ? (
        <div className="mm-win">
          <p className="mm-win-title">🎉 You matched them all!</p>
          <p className="mm-win-detail">{moves} moves · {formatTime(elapsed)}</p>
          <button className="mm-btn" onClick={() => restart(totalPairs)}>Play Again</button>
        </div>
      ) : (
        <div className="mm-grid">
          {cards.map(card => (
            <button
              key={card.id}
              className={`mm-card ${card.flipped || card.matched ? 'mm-card--face-up' : ''} ${card.matched ? 'mm-card--matched' : ''}`}
              onClick={() => flip(card)}
              disabled={card.matched || locked}
              aria-label={card.flipped || card.matched ? card.emoji : 'Hidden card'}
            >
              <span className="mm-card-inner">
                <span className="mm-card-front">{card.emoji}</span>
                <span className="mm-card-back">?</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
