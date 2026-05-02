import { useState, useEffect, useRef } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import './WordChain.css'

const TIME_LIMIT = 15
const SEEDS = ['apple', 'eagle', 'ocean', 'lamp', 'tiger', 'river', 'nest', 'tree', 'elephant', 'diamond']

function randomSeed() {
  return SEEDS[Math.floor(Math.random() * SEEDS.length)]
}

export default function WordChain() {
  const [chain, setChain]       = useState([randomSeed()])
  const [input, setInput]       = useState('')
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [status, setStatus]     = useState('playing') // 'playing' | 'over'
  const [error, setError]       = useState('')
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('wc-best') ?? 0))
  const inputRef  = useRef(null)
  const chainRef  = useRef(null)

  const currentWord = chain[chain.length - 1]
  const requiredLetter = currentWord[currentWord.length - 1]
  const score = chain.length - 1

  // Auto-scroll chain to bottom
  useEffect(() => {
    if (chainRef.current) chainRef.current.scrollTop = chainRef.current.scrollHeight
  }, [chain])

  // Focus input on mount and after each successful word
  useEffect(() => {
    if (status === 'playing') inputRef.current?.focus()
  }, [status, chain.length])

  // Countdown timer
  useEffect(() => {
    if (status !== 'playing') return
    if (timeLeft <= 0) { endGame(); return }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, status])

  function endGame() {
    setStatus('over')
    if (score > bestScore) {
      const s = chain.length - 1
      setBestScore(s)
      localStorage.setItem('wc-best', String(s))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const word = input.trim().toLowerCase().replace(/[^a-z]/g, '')
    setInput('')

    if (!word) return

    if (word[0] !== requiredLetter) {
      setError(`"${word}" must start with "${requiredLetter.toUpperCase()}"`)
      return
    }

    if (chain.includes(word)) {
      setError(`"${word}" has already been used!`)
      return
    }

    setError('')
    setChain(prev => [...prev, word])
    setTimeLeft(TIME_LIMIT)
  }

  function restart() {
    const seed = randomSeed()
    setChain([seed])
    setInput('')
    setTimeLeft(TIME_LIMIT)
    setStatus('playing')
    setError('')
  }

  const timerPct = (timeLeft / TIME_LIMIT) * 100
  const timerUrgent = timeLeft <= 5

  return (
    <div className="wc-page">
      <Breadcrumb />
      <h1>Word Chain</h1>
      <p className="wc-subtitle">Each word must start with the last letter of the previous one.</p>

      <div className="wc-layout">
        {/* Chain history */}
        <div className="wc-chain" ref={chainRef}>
          {chain.map((word, i) => (
            <div key={i} className={`wc-chain-item ${i === chain.length - 1 ? 'wc-chain-item--current' : ''}`}>
              {i > 0 && <span className="wc-arrow">→</span>}
              <span className="wc-word">
                {i === chain.length - 1 ? (
                  <>
                    <span className="wc-word-body">{word.slice(0, -1)}</span>
                    <span className="wc-word-last">{word.slice(-1).toUpperCase()}</span>
                  </>
                ) : word}
              </span>
              {i === 0 && <span className="wc-tag">start</span>}
            </div>
          ))}
        </div>

        {/* Game panel */}
        {status === 'playing' ? (
          <div className="wc-panel">
            <div className="wc-prompt">
              Type a word starting with
              <span className="wc-required-letter">{requiredLetter.toUpperCase()}</span>
            </div>

            {/* Timer */}
            <div className="wc-timer-row">
              <div className="wc-timer-track">
                <div
                  className={`wc-timer-fill ${timerUrgent ? 'wc-timer-fill--urgent' : ''}`}
                  style={{ width: `${timerPct}%`, transition: 'width 1s linear' }}
                />
              </div>
              <span className={`wc-timer-num ${timerUrgent ? 'wc-timer-num--urgent' : ''}`}>{timeLeft}s</span>
            </div>

            {error && <p className="wc-error">{error}</p>}

            <form className="wc-form" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                className="wc-input"
                type="text"
                placeholder={`A word starting with ${requiredLetter.toUpperCase()}…`}
                value={input}
                onChange={e => { setInput(e.target.value); setError('') }}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
              />
              <button className="wc-submit-btn" type="submit" disabled={!input.trim()}>
                Add
              </button>
            </form>

            <div className="wc-stats">
              <span className="wc-stat">Chain: <strong>{chain.length}</strong></span>
              <span className="wc-stat">Score: <strong>{score}</strong></span>
              <span className="wc-stat">Best: <strong>{bestScore}</strong></span>
            </div>
          </div>
        ) : (
          <div className="wc-over">
            <p className="wc-over-title">{timeLeft <= 0 ? '⏰ Time\'s up!' : 'Game over!'}</p>
            <p className="wc-over-score">{score}</p>
            <p className="wc-over-label">word{score !== 1 ? 's' : ''} added</p>
            {score > 0 && score >= bestScore && <p className="wc-new-best">🏆 New best!</p>}
            <p className="wc-over-best">Best ever: {bestScore}</p>
            <button className="wc-play-again" onClick={restart}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  )
}
