import { useState, useEffect, useCallback } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import './MemoryMatch.css'

const EMOJIS = ['🐶', '🦁', '🐸', '🦋', '🌈', '🍕', '🚀', '⭐']

function buildDeck() {
  const pairs = [...EMOJIS, ...EMOJIS].map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]]
  }
  return pairs
}

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function MemoryMatch() {
  const [cards, setCards] = useState(buildDeck)
  const [selected, setSelected] = useState([])
  const [locked, setLocked] = useState(false)
  const [moves, setMoves] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [won, setWon] = useState(false)

  const matchedCount = cards.filter(c => c.matched).length
  const pairs = matchedCount / 2

  useEffect(() => {
    if (won) return
    const id = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(id)
  }, [won])

  useEffect(() => {
    if (matchedCount === 16) setWon(true)
  }, [matchedCount])

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

  function restart() {
    setCards(buildDeck())
    setSelected([])
    setLocked(false)
    setMoves(0)
    setElapsed(0)
    setWon(false)
  }

  return (
    <div className="mm-page">
      <Breadcrumb />
      <h1>Memory Match</h1>

      <div className="mm-stats">
        <span className="mm-stat"><span className="mm-stat-label">Pairs</span>{pairs}/8</span>
        <span className="mm-stat"><span className="mm-stat-label">Moves</span>{moves}</span>
        <span className="mm-stat"><span className="mm-stat-label">Time</span>{formatTime(elapsed)}</span>
      </div>

      {won ? (
        <div className="mm-win">
          <p className="mm-win-title">🎉 You matched them all!</p>
          <p className="mm-win-detail">{moves} moves · {formatTime(elapsed)}</p>
          <button className="mm-btn" onClick={restart}>Play Again</button>
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
