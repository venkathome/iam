import { useState, useEffect } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import DifficultySelector from '../components/DifficultySelector'
import HowToPlay from '../components/HowToPlay'
import '../components/DifficultySelector.css'
import './QuizBowl.css'

const HOW_TO_PLAY = [
  'Pick a category (Science, History, Geography, and more).',
  'A question appears with four possible answers — pick the right one.',
  'Answer before the timer runs out to score points.',
  'The quicker you answer, the more points you earn.',
  'See how high you can score across all your questions!',
]

const DIFF_CONFIG = {
  'very-easy': { questionTime: 30 },
  'easy':      { questionTime: 25 },
  'medium':    { questionTime: 20 },
  'hard':      { questionTime: 15 },
  'very-hard': { questionTime: 10 },
  'ultimate':  { questionTime: 7  },
}

const CATEGORIES = [
  {
    id: 'science', label: 'Science', color: '#22d3ee', bg: 'rgba(34,211,238,0.1)', emoji: '🔬',
    questions: [
      { q: 'What is the chemical symbol for gold?', options: ['Au', 'Ag', 'Fe', 'Pb'], correct: 0 },
      { q: 'How many bones are in the adult human body?', options: ['206', '300', '150', '256'], correct: 0 },
      { q: 'What gas do plants absorb during photosynthesis?', options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], correct: 0 },
      { q: 'What is the hardest natural substance on Earth?', options: ['Diamond', 'Quartz', 'Sapphire', 'Graphite'], correct: 0 },
      { q: 'What is the powerhouse of the cell?', options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Chloroplast'], correct: 0 },
      { q: 'How many chromosomes are in a normal human cell?', options: ['46', '23', '48', '44'], correct: 0 },
      { q: 'What element has the chemical symbol Fe?', options: ['Iron', 'Fluorine', 'Francium', 'Fermium'], correct: 0 },
      { q: 'Approximately how fast does light travel per second?', options: ['300,000 km', '150,000 km', '450,000 km', '200,000 km'], correct: 0 },
      { q: 'What is H₂O commonly known as?', options: ['Water', 'Hydrogen peroxide', 'Hydrochloric acid', 'Saltwater'], correct: 0 },
      { q: 'What is the pH value of pure water?', options: ['7', '6', '8', '5'], correct: 0 },
    ],
  },
  {
    id: 'geography', label: 'Geography', color: '#4ade80', bg: 'rgba(74,222,128,0.1)', emoji: '🌍',
    questions: [
      { q: 'Which is the longest river in the world?', options: ['Nile', 'Amazon', 'Yangtze', 'Mississippi'], correct: 0 },
      { q: 'What is the capital city of Australia?', options: ['Canberra', 'Sydney', 'Melbourne', 'Brisbane'], correct: 0 },
      { q: 'Which is the largest country by land area?', options: ['Russia', 'Canada', 'China', 'USA'], correct: 0 },
      { q: 'Which is the largest ocean on Earth?', options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], correct: 0 },
      { q: 'What is the capital of Japan?', options: ['Tokyo', 'Osaka', 'Kyoto', 'Hiroshima'], correct: 0 },
      { q: 'How many continents are there on Earth?', options: ['7', '6', '5', '8'], correct: 0 },
      { q: 'What is the tallest mountain on Earth?', options: ['Everest', 'K2', 'Kilimanjaro', 'Mont Blanc'], correct: 0 },
      { q: 'What is the capital city of Brazil?', options: ['Brasília', 'Rio de Janeiro', 'São Paulo', 'Salvador'], correct: 0 },
      { q: 'Which body of water has the highest salinity on Earth?', options: ['Dead Sea', 'Red Sea', 'Mediterranean', 'Caspian Sea'], correct: 0 },
      { q: 'Which country has the most freshwater lakes?', options: ['Canada', 'Russia', 'USA', 'Finland'], correct: 0 },
    ],
  },
  {
    id: 'history', label: 'History', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', emoji: '📜',
    questions: [
      { q: 'In what year did World War 2 end?', options: ['1945', '1944', '1946', '1943'], correct: 0 },
      { q: 'Who was the first President of the United States?', options: ['George Washington', 'John Adams', 'Thomas Jefferson', 'Abraham Lincoln'], correct: 0 },
      { q: 'Which is the only surviving ancient wonder of the world?', options: ['Great Pyramid of Giza', 'Colossus of Rhodes', 'Lighthouse of Alexandria', 'Temple of Artemis'], correct: 0 },
      { q: 'In what year did the Berlin Wall fall?', options: ['1989', '1991', '1987', '1985'], correct: 0 },
      { q: 'Who painted the Mona Lisa?', options: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Caravaggio'], correct: 0 },
      { q: 'In what year did the Titanic sink?', options: ['1912', '1914', '1910', '1916'], correct: 0 },
      { q: 'Which was the first country to grant women the right to vote?', options: ['New Zealand', 'Australia', 'United Kingdom', 'United States'], correct: 0 },
      { q: 'Napoleon Bonaparte was born on which island?', options: ['Corsica', 'Sardinia', 'Sicily', 'Elba'], correct: 0 },
      { q: 'In what year did the French Revolution begin?', options: ['1789', '1799', '1776', '1815'], correct: 0 },
      { q: 'What was the name of the ancient wonder built at Alexandria?', options: ['A lighthouse', 'A pyramid', 'A statue', 'A temple'], correct: 0 },
    ],
  },
  {
    id: 'animals', label: 'Animals', color: '#f97316', bg: 'rgba(249,115,22,0.1)', emoji: '🦁',
    questions: [
      { q: 'What is the fastest land animal on Earth?', options: ['Cheetah', 'Lion', 'Leopard', 'Greyhound'], correct: 0 },
      { q: 'What is the largest animal ever to have lived on Earth?', options: ['Blue whale', 'African elephant', 'Sperm whale', 'Megalosaurus'], correct: 0 },
      { q: 'How many legs does a spider have?', options: ['8', '6', '10', '4'], correct: 0 },
      { q: 'What is a group of lions called?', options: ['Pride', 'Pack', 'Herd', 'Flock'], correct: 0 },
      { q: 'What is the tallest living animal on Earth?', options: ['Giraffe', 'Elephant', 'Ostrich', 'Horse'], correct: 0 },
      { q: 'Which is the only mammal capable of true powered flight?', options: ['Bat', 'Flying squirrel', 'Colugo', 'Sugar glider'], correct: 0 },
      { q: 'What is the largest fish in the world?', options: ['Whale shark', 'Great white shark', 'Basking shark', 'Giant manta ray'], correct: 0 },
      { q: 'How many hearts does an octopus have?', options: ['3', '1', '2', '4'], correct: 0 },
      { q: 'What is a baby kangaroo called?', options: ['Joey', 'Cub', 'Pup', 'Foal'], correct: 0 },
      { q: 'Which bird lays the largest eggs of any living bird?', options: ['Ostrich', 'Emu', 'Cassowary', 'Albatross'], correct: 0 },
    ],
  },
  {
    id: 'food', label: 'Food & Drink', color: '#ec4899', bg: 'rgba(236,72,153,0.1)', emoji: '🍕',
    questions: [
      { q: 'Where did coffee originally come from?', options: ['Ethiopia', 'Brazil', 'Colombia', 'Vietnam'], correct: 0 },
      { q: 'What is the main ingredient in guacamole?', options: ['Avocado', 'Tomato', 'Cucumber', 'Lime'], correct: 0 },
      { q: 'Which country invented pizza?', options: ['Italy', 'Greece', 'USA', 'France'], correct: 0 },
      { q: 'Sushi originated in which country?', options: ['Japan', 'China', 'South Korea', 'Thailand'], correct: 0 },
      { q: 'What is tofu made from?', options: ['Soybeans', 'Chickpeas', 'Rice', 'Wheat'], correct: 0 },
      { q: 'What gives red wine its colour?', options: ['Grape skins', 'Grape seeds', 'Added colouring', 'Fermentation time'], correct: 0 },
      { q: 'Which nut is the main ingredient in marzipan?', options: ['Almonds', 'Cashews', 'Hazelnuts', 'Walnuts'], correct: 0 },
      { q: 'What grain is most commonly used to brew beer?', options: ['Barley', 'Wheat', 'Corn', 'Oats'], correct: 0 },
      { q: 'Parmesan cheese originates from which Italian city?', options: ['Parma', 'Milan', 'Rome', 'Naples'], correct: 0 },
      { q: 'Which spice is the most expensive in the world by weight?', options: ['Saffron', 'Vanilla', 'Cardamom', 'Truffle'], correct: 0 },
    ],
  },
  {
    id: 'space', label: 'Space', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', emoji: '🚀',
    questions: [
      { q: 'Which planet is closest to the Sun?', options: ['Mercury', 'Venus', 'Mars', 'Earth'], correct: 0 },
      { q: 'How long does sunlight take to reach Earth?', options: ['About 8 minutes', 'About 1 minute', 'About 1 hour', 'About 1 day'], correct: 0 },
      { q: 'Which is the largest planet in our solar system?', options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], correct: 0 },
      { q: 'How many moons does Mars have?', options: ['2', '0', '1', '4'], correct: 0 },
      { q: 'Who was the first human to walk on the Moon?', options: ['Neil Armstrong', 'Buzz Aldrin', 'Yuri Gagarin', 'John Glenn'], correct: 0 },
      { q: 'Which is the hottest planet in our solar system?', options: ['Venus', 'Mercury', 'Mars', 'Jupiter'], correct: 0 },
      { q: 'The asteroid belt lies between which two planets?', options: ['Mars and Jupiter', 'Earth and Mars', 'Jupiter and Saturn', 'Saturn and Uranus'], correct: 0 },
      { q: 'What is a light-year a measure of?', options: ['Distance', 'Time', 'Speed', 'Mass'], correct: 0 },
      { q: 'Which is the largest moon in our solar system?', options: ['Ganymede', 'Titan', 'Callisto', 'Europa'], correct: 0 },
      { q: 'What type of star is our Sun?', options: ['Yellow dwarf', 'White dwarf', 'Red giant', 'Neutron star'], correct: 0 },
    ],
  },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const LABELS = ['A', 'B', 'C', 'D']

export default function QuizBowl() {
  const [difficulty, setDifficulty] = useState('medium')
  const [screen, setScreen]     = useState('categories')
  const [activeCat, setActiveCat] = useState(null)
  const [questions, setQuestions] = useState([])
  const [qIndex, setQIndex]     = useState(0)
  const [score, setScore]       = useState(0)
  const [timeLeft, setTimeLeft] = useState(DIFF_CONFIG['medium'].questionTime)
  const [feedback, setFeedback] = useState(null)

  const cfg = DIFF_CONFIG[difficulty]
  const question = questions[qIndex] ?? null

  function pickCategory(cat) {
    setActiveCat(cat)
    setQuestions(shuffle(cat.questions).slice(0, 8))
    setQIndex(0)
    setScore(0)
    setTimeLeft(cfg.questionTime)
    setFeedback(null)
    setScreen('question')
  }

  function handleDifficultyChange(d) {
    setDifficulty(d)
    setScreen('categories')
    setActiveCat(null)
    setQuestions([])
    setQIndex(0)
    setScore(0)
    setTimeLeft(DIFF_CONFIG[d].questionTime)
    setFeedback(null)
  }

  useEffect(() => {
    if (screen !== 'question' || feedback !== null) return
    if (timeLeft <= 0) {
      setFeedback({ chosen: -1, correct: false, timedOut: true })
      return
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [screen, timeLeft, feedback])

  function handleAnswer(idx) {
    if (feedback !== null || !question) return
    const isCorrect = idx === question.correct
    if (isCorrect) {
      const bonus = Math.floor((timeLeft / cfg.questionTime) * 5)
      setScore(s => s + 10 + bonus)
    }
    setFeedback({ chosen: idx, correct: isCorrect, timedOut: false })
  }

  useEffect(() => {
    if (feedback === null) return
    const id = setTimeout(() => {
      if (qIndex + 1 >= questions.length) {
        setScreen('result')
      } else {
        setQIndex(i => i + 1)
        setTimeLeft(cfg.questionTime)
        setFeedback(null)
      }
    }, 1600)
    return () => clearTimeout(id)
  }, [feedback, qIndex, questions.length, cfg.questionTime])

  function optionClass(idx) {
    if (!feedback) return 'qb-option'
    if (idx === question.correct) return 'qb-option qb-option--correct'
    if (idx === feedback.chosen && !feedback.correct) return 'qb-option qb-option--wrong'
    return 'qb-option qb-option--dim'
  }

  if (screen === 'categories') {
    return (
      <div className="qb-page">
        <Breadcrumb />
        <h1>Quiz Bowl</h1>
        <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
        <HowToPlay steps={HOW_TO_PLAY} />
        <p className="qb-subtitle">Choose a category to begin.</p>
        <div className="qb-cat-grid">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className="qb-cat-tile"
              style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
              onClick={() => pickCategory(cat)}
            >
              <span className="qb-cat-emoji">{cat.emoji}</span>
              <span className="qb-cat-label">{cat.label}</span>
              <span className="qb-cat-count">{cat.questions.length} questions</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (screen === 'result') {
    const maxScore = questions.length * 15
    const pct = Math.round((score / maxScore) * 100)
    const grade =
      pct >= 90 ? '🏆 Outstanding!' :
      pct >= 70 ? '🌟 Great job!' :
      pct >= 50 ? '👍 Good effort!' :
                  '💪 Keep practising!'
    return (
      <div className="qb-page qb-page--result">
        <Breadcrumb />
        <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
        <div className="qb-result-card" style={{ '--cat-color': activeCat.color }}>
          <div className="qb-result-emoji">{activeCat.emoji}</div>
          <p className="qb-result-grade">{grade}</p>
          <p className="qb-result-score">{score}</p>
          <p className="qb-result-sub">points out of {maxScore}</p>
          <div className="qb-result-bar-wrap">
            <div className="qb-result-bar" style={{ width: `${pct}%`, background: activeCat.color }} />
          </div>
          <p className="qb-result-pct">{pct}%</p>
          <div className="qb-result-actions">
            <button className="qb-btn qb-btn--secondary" onClick={() => setScreen('categories')}>
              Try another category
            </button>
            <button className="qb-btn qb-btn--primary" style={{ background: activeCat.color }} onClick={() => pickCategory(activeCat)}>
              Play again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="qb-page qb-page--question">
      <Breadcrumb />
      <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
      <div className="qb-header">
        <span className="qb-cat-tag" style={{ color: activeCat.color, borderColor: activeCat.color }}>
          {activeCat.emoji} {activeCat.label}
        </span>
        <span className="qb-progress">Q {qIndex + 1} / {questions.length}</span>
        <span className="qb-score-badge">{score} pts</span>
      </div>

      <div className="qb-timer-track">
        <div
          className={`qb-timer-fill ${timeLeft <= 5 ? 'qb-timer-fill--urgent' : ''}`}
          style={{
            width: `${(timeLeft / cfg.questionTime) * 100}%`,
            transition: feedback ? 'none' : 'width 1s linear',
          }}
        />
      </div>
      <div className="qb-timer-label">{feedback ? '' : `${timeLeft}s`}</div>

      <div className={`qb-question-card ${feedback ? (feedback.correct ? 'qb-card--correct' : 'qb-card--wrong') : ''}`}>
        <p className="qb-question-text">{question.q}</p>
        {feedback?.timedOut && <p className="qb-timeout-msg">⏰ Time's up!</p>}
      </div>

      <div className="qb-options">
        {question.options.map((opt, i) => (
          <button
            key={i}
            className={optionClass(i)}
            onClick={() => handleAnswer(i)}
            disabled={feedback !== null}
          >
            <span className="qb-option-label">{LABELS[i]}</span>
            <span className="qb-option-text">{opt}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
