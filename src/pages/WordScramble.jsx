import { useState, useEffect, useRef } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import './WordScramble.css'

const ALL_WORDS = [
  'elephant','volcano','umbrella','dolphin','cinnamon','telescope','avalanche',
  'butterfly','chocolate','hurricane','algorithm','porcupine','labyrinth','photon',
  'flamingo','crocodile','parachute','magnolia','platypus','compass','geyser',
  'sapphire','tornado','chameleon','penguin','giraffe','leopard','octopus',
  'armadillo','mongoose','piranha','iguana','narwhal','pangolin','axolotl',
  'calculator','microscope','thermostat','pavement','cathedral','pyramid',
  'accordion','trombone','clarinet','mandolin','xylophone','harmonica',
  'cactus','sequoia','bamboo','orchid','lavender','jasmine','chrysanthemum',
  'nitrogen','hydrogen','platinum','tungsten','titanium','uranium','silicon',
  'marathon','decathlon','badminton','volleyball','lacrosse','archery',
  'astronaut','scientist','architect','historian','geologist','biologist',
  'detective','librarian','carpenter','electrician','pharmacist','veterinarian',
  'peninsula','continent','archipelago','equator','hemisphere','meridian',
  'blizzard','cyclone','monsoon','drought','tsunami','earthquake','eruption',
  'aqueduct','colosseum','acropolis','ziggurat','stonehenge','parthenon',
  'broccoli','asparagus','avocado','pineapple','raspberry','cranberry',
  'sandwich','lasagna','tortilla','croissant','macaroni','dumplings',
  'democracy','monarchy','republic','parliament','constitution','legislation',
  'metaphor','synonym','adjective','paragraph','narrative','biography',
  'triangle','cylinder','pentagon','hexagon','octagon','trapezoid',
  'gradient','velocity','momentum','frequency','amplitude','wavelength',
  'symphony','orchestra','concerto','serenade','overture','rhapsody',
  'sapphire','emerald','diamond','amethyst','turquoise','obsidian',
  'telescope','periscope','kaleidoscope','stethoscope','microscope',
  'labrador','dalmatian','chihuahua','greyhound','sheepdog','retriever',
  'hamster','gerbil','ferret','chinchilla','hedgehog','capybara',
]

const clueCache = new Map()

async function fetchClue(word) {
  if (clueCache.has(word)) return clueCache.get(word)
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
    if (!res.ok) { clueCache.set(word, null); return null }
    const data = await res.json()
    const def = data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition ?? null
    clueCache.set(word, def)
    return def
  } catch {
    clueCache.set(word, null)
    return null
  }
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function scramble(word) {
  let result
  let attempts = 0
  do {
    result = shuffle([...word]).join('')
    attempts++
  } while (result === word && attempts < 20)
  return result
}

const MAX_GUESSES = 5

export default function WordScramble() {
  const [wordList, setWordList] = useState(() => shuffle(ALL_WORDS))
  const [index, setIndex]             = useState(0)
  const [scrambled, setScrambled]     = useState(() => scramble(ALL_WORDS[0]))
  const [input, setInput]             = useState('')
  const [guessesLeft, setGuessesLeft] = useState(MAX_GUESSES)
  const [status, setStatus]           = useState('playing') // playing | correct | failed
  const [shake, setShake]             = useState(false)
  const [score, setScore]             = useState(0)
  const [attempted, setAttempted]     = useState(0)
  const [clue, setClue]               = useState('')
  const [clueLoading, setClueLoading] = useState(true)
  const inputRef = useRef(null)

  const currentWord = wordList[index]

  useEffect(() => {
    setScrambled(scramble(currentWord))
    setInput('')
    setGuessesLeft(MAX_GUESSES)
    setStatus('playing')
    setClue('')
    setClueLoading(true)
    fetchClue(currentWord).then(def => {
      setClue(def || `Unscramble this ${currentWord.length}-letter word`)
      setClueLoading(false)
    })
    inputRef.current?.focus()
  }, [currentWord])

  function handleSubmit(e) {
    e.preventDefault()
    if (status !== 'playing') return
    const guess = input.trim().toLowerCase()
    if (!guess) return

    if (guess === currentWord) {
      setScore(s => s + 1)
      setAttempted(a => a + 1)
      setStatus('correct')
    } else {
      const next = guessesLeft - 1
      setGuessesLeft(next)
      setInput('')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      if (next === 0) {
        setAttempted(a => a + 1)
        setStatus('failed')
      }
    }
  }

  function next() {
    if (index >= wordList.length - 1) {
      setWordList(shuffle(ALL_WORDS))
      setIndex(0)
    } else {
      setIndex(i => i + 1)
    }
  }

  return (
    <div className="scramble-page">
      <Breadcrumb />
      <div className="scramble-header">
        <h1>Word Scramble</h1>
        <div className="scramble-score">
          <span className="score-correct">{score}</span>
          <span className="score-sep">/</span>
          <span className="score-total">{attempted}</span>
          <span className="score-label">correct</span>
        </div>
      </div>

      <div className="scramble-card">
        <p className="scramble-clue-label">Clue</p>
        <p className="scramble-clue">{clueLoading ? 'Loading clue…' : clue}</p>

        <div className={`scramble-letters ${shake ? 'scramble-letters--shake' : ''}`}>
          {scrambled.split('').map((ch, i) => (
            <span key={i} className="scramble-tile">{ch.toUpperCase()}</span>
          ))}
        </div>

        <div className="scramble-guesses">
          {Array.from({ length: MAX_GUESSES }, (_, i) => (
            <span
              key={i}
              className={`guess-pip ${i < guessesLeft ? 'guess-pip--alive' : 'guess-pip--used'}`}
            />
          ))}
          <span className="guess-label">
            {guessesLeft} guess{guessesLeft !== 1 ? 'es' : ''} left
          </span>
        </div>

        {status === 'playing' && (
          <form className="scramble-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="scramble-input"
              type="text"
              placeholder="Type the word..."
              value={input}
              onChange={e => setInput(e.target.value.replace(/[^a-zA-Z]/g, ''))}
              autoComplete="off"
              autoFocus
            />
            <button
              className="scramble-submit"
              type="submit"
              disabled={!input.trim()}
            >
              Submit
            </button>
          </form>
        )}

        {status === 'correct' && (
          <div className="scramble-result scramble-result--correct">
            <p className="result-msg">🎉 Correct! The word was <strong>{currentWord}</strong>.</p>
            <button className="scramble-next" onClick={next}>Next Word →</button>
          </div>
        )}

        {status === 'failed' && (
          <div className="scramble-result scramble-result--failed">
            <p className="result-msg">The word was <strong>{currentWord}</strong>.</p>
            <button className="scramble-next" onClick={next}>Next Word →</button>
          </div>
        )}
      </div>
    </div>
  )
}
