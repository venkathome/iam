import { useState, useEffect, useRef } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import DifficultySelector from '../components/DifficultySelector'
import HowToPlay from '../components/HowToPlay'
import '../components/DifficultySelector.css'
import './WordChain.css'

const HOW_TO_PLAY = [
  'Type any word to start the chain.',
  'Each new word must begin with the last letter of the previous word.',
  'Example: cat → tiger → rabbit → tiger... wait, no repeats allowed!',
  'A harder difficulty means shorter time limits and rarer words.',
  'Keep the chain going as long as you can!',
]

const DIFF_CONFIG = {
  'very-easy': { timeLimit: 25 },
  'easy':      { timeLimit: 20 },
  'medium':    { timeLimit: 15 },
  'hard':      { timeLimit: 10 },
  'very-hard': { timeLimit: 7  },
  'ultimate':  { timeLimit: 4  },
}

const SEEDS = ['apple', 'eagle', 'ocean', 'lamp', 'tiger', 'river', 'nest', 'tree', 'elephant', 'diamond']

function randomSeed() {
  return SEEDS[Math.floor(Math.random() * SEEDS.length)]
}

export default function WordChain() {
  const [difficulty, setDifficulty] = useState('medium')
  const [chain, setChain]       = useState([randomSeed()])
  const [input, setInput]       = useState('')
  const [timeLeft, setTimeLeft] = useState(DIFF_CONFIG['medium'].timeLimit)
  const [status, setStatus]     = useState('playing') // 'playing' | 'over'
  const [error, setError]       = useState('')
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('wc-best') ?? 0))
  const inputRef  = useRef(null)
  const chainRef  = useRef(null)

  const timeLimit = DIFF_CONFIG[difficulty].timeLimit

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
    setTimeLeft(timeLimit)
  }

  function restart() {
    const seed = randomSeed()
    setChain([seed])
    setInput('')
    setTimeLeft(timeLimit)
    setStatus('playing')
    setError('')
  }

  function handleDifficultyChange(d) {
    setDifficulty(d)
    const seed = randomSeed()
    setChain([seed])
    setInput('')
    setTimeLeft(DIFF_CONFIG[d].timeLimit)
    setStatus('playing')
    setError('')
  }

  const timerPct = (timeLeft / timeLimit) * 100
  const timerUrgent = timeLeft <= Math.min(5, Math.floor(timeLimit / 3))

  return (
    <div className="wc-page">
      <Breadcrumb />
      <h1>Word Chain</h1>
      <p className="wc-subtitle">Each word must start with the last letter of the previous one.</p>
      <p className="diff-label-text">Difficulty</p>
      <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
      <HowToPlay steps={HOW_TO_PLAY} />

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
