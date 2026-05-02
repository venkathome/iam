import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import './Games.css'

const GAMES = [
  { id: 'tic-tac-toe',     label: 'Tic Tac Toe',      desc: '2 Players · 3×3 to 5×5',                    route: '/games/tic-tac-toe'     },
  { id: 'ludo',            label: 'Ludo',              desc: '2–4 Players · Classic',                      route: '/games/ludo'            },
  { id: 'questions',       label: 'Questions',         desc: 'Questions & Riddles · Ages 4–19',            route: '/games/questions'       },
  { id: 'brands',          label: 'Brands',            desc: 'Guess the Logo · 8 Categories',              route: '/games/brands'          },
  { id: 'hangman',         label: 'Hangman',           desc: 'Words & Sentences · Letter by letter',       route: '/games/hangman'         },
  { id: 'word-scramble',   label: 'Word Scramble',     desc: 'Unscramble the hidden word',                 route: '/games/word-scramble'   },
  { id: 'crossword',       label: 'Crossword',         desc: 'Mini 5×5 grid · Fill in the clues',         route: '/games/crossword'       },
  { id: 'word-chain',      label: 'Word Chain',        desc: 'Each word starts where the last one ends',   route: '/games/word-chain'      },
  { id: 'simon-says',      label: 'Simon Says',        desc: 'Repeat the growing colour sequence',         route: '/games/simon-says'      },
  { id: 'memory-match',    label: 'Memory Match',      desc: 'Flip cards to find matching pairs',          route: '/games/memory-match'    },
  { id: 'sequence-recall', label: 'Sequence Recall',   desc: 'Watch the sequence · Then reproduce it',    route: '/games/sequence-recall' },
  { id: 'quiz-bowl',       label: 'Quiz Bowl',         desc: 'Multiple choice · 6 categories',            route: '/games/quiz-bowl'       },
  { id: 'flag-quiz',       label: 'Flag Quiz',         desc: 'Identify the country from its flag',        route: '/games/flag-quiz'       },
  { id: 'true-false',      label: 'True or False',     desc: 'Fast-paced rapid-fire statements',          route: '/games/true-false'      },
  { id: 'sudoku',          label: 'Sudoku',            desc: '9×9 · 6 levels · Infinite puzzles',         route: '/games/sudoku'          },
  { id: '2048',            label: '2048',              desc: 'Slide and merge tiles to reach 2048',        route: '/games/2048'            },
  { id: 'sliding-puzzle',  label: 'Sliding Puzzle',    desc: 'Rearrange the tiles into order',            route: '/games/sliding-puzzle'  },
  { id: 'pictionary',      label: 'Pictionary',        desc: 'A drawing reveals itself · Guess the word', route: '/games/pictionary'      },
  { id: 'kakuro',          label: 'Kakuro',            desc: 'Number crossword · 6 levels · Infinite',    route: '/games/kakuro'          },
  { id: 'killer-kakuro',  label: 'Killer Kakuro',     desc: 'Sudoku + cage sums · 6 levels · Infinite',  route: '/games/killer-kakuro'   },
  { id: 'dos-games',      label: 'DOS Games',         desc: 'Tetris · Snake · Pong · 6 classic games',   route: '/games/dos'             },
]

function TicTacToeIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
      <rect x="5" y="5" width="30" height="30" rx="4" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="5" y1="15" x2="35" y2="15" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="5" y1="25" x2="35" y2="25" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="15" y1="5" x2="15" y2="35" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="25" y1="5" x2="25" y2="35" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  )
}

function LudoIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
      <rect x="3" y="3" width="34" height="34" rx="5" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="11" cy="11" r="5" fill="#ef4444"/>
      <circle cx="29" cy="11" r="5" fill="#22c55e"/>
      <circle cx="29" cy="29" r="5" fill="#eab308"/>
      <circle cx="11" cy="29" r="5" fill="#3b82f6"/>
      <rect x="16" y="16" width="8" height="8" rx="2" fill="currentColor" opacity="0.4"/>
    </svg>
  )
}

function QuestionsIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      <rect x="4" y="6" width="28" height="20" rx="5" fill="url(#qig1)" opacity="0.9"/>
      <circle cx="12" cy="16" r="2" fill="white"/>
      <circle cx="18" cy="16" r="2" fill="white"/>
      <circle cx="24" cy="16" r="2" fill="white"/>
      <path d="M8 26 L5 32 L15 28" fill="url(#qig1)"/>
      <rect x="20" y="22" width="28" height="20" rx="5" fill="url(#qig2)" opacity="0.9"/>
      <text x="34" y="35" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Arial Black, Arial">?</text>
      <defs>
        <linearGradient id="qig1" x1="4" y1="6" x2="32" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f97316"/><stop offset="1" stopColor="#ec4899"/>
        </linearGradient>
        <linearGradient id="qig2" x1="20" y1="22" x2="48" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a78bfa"/><stop offset="1" stopColor="#06b6d4"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

function BrandsIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      <rect x="4" y="8" width="26" height="20" rx="5" fill="url(#big1)" opacity="0.9"/>
      <text x="17" y="21" textAnchor="middle" fill="white" fontSize="11" fontWeight="900" fontFamily="Arial Black, Arial">B</text>
      <rect x="22" y="22" width="26" height="20" rx="5" fill="url(#big2)" opacity="0.9"/>
      <text x="35" y="35" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Arial Black, Arial">?</text>
      <defs>
        <linearGradient id="big1" x1="4" y1="8" x2="30" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f97316"/><stop offset="1" stopColor="#ec4899"/>
        </linearGradient>
        <linearGradient id="big2" x1="22" y1="22" x2="48" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1"/><stop offset="1" stopColor="#06b6d4"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

function HangmanGameIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      <line x1="6"  y1="48" x2="46" y2="48" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="14" y1="48" x2="14" y2="6"  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="14" y1="6"  x2="34" y2="6"  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="34" y1="6"  x2="34" y2="14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="34" cy="21" r="7" stroke="currentColor" strokeWidth="2"/>
      <line x1="34" y1="28" x2="34" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="34" y1="31" x2="27" y2="37" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="34" y1="31" x2="41" y2="37" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function WordScrambleIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      <rect x="2"  y="6"  width="13" height="14" rx="3" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="19" y="2"  width="13" height="14" rx="3" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="37" y="10" width="13" height="14" rx="3" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="8"  y="28" width="13" height="14" rx="3" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="29" y="32" width="13" height="14" rx="3" stroke="currentColor" strokeWidth="1.6"/>
      <text x="8.5"  y="17"  textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="monospace" fill="currentColor">S</text>
      <text x="25.5" y="13"  textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="monospace" fill="currentColor">C</text>
      <text x="43.5" y="21"  textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="monospace" fill="currentColor">R</text>
      <text x="14.5" y="39"  textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="monospace" fill="currentColor">M</text>
      <text x="35.5" y="43"  textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="monospace" fill="currentColor">B</text>
    </svg>
  )
}

function CrosswordIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      {[0,1,2,3,4].map(r => [0,1,2,3,4].map(c => {
        const black = (r===0&&c===0)||(r===1&&c===3)||(r===3&&c===1)||(r===4&&c===4)||(r===2&&c===2)
        return <rect key={`${r}-${c}`} x={2+c*10} y={2+r*10} width="9" height="9" rx="1"
          fill={black ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="0.8" opacity={black ? 0.6 : 1}/>
      }))}
      <text x="12" y="10"  fontSize="5.5" fontWeight="700" fontFamily="monospace" fill="currentColor" textAnchor="middle">A</text>
      <text x="22" y="10"  fontSize="5.5" fontWeight="700" fontFamily="monospace" fill="currentColor" textAnchor="middle">P</text>
      <text x="32" y="10"  fontSize="5.5" fontWeight="700" fontFamily="monospace" fill="currentColor" textAnchor="middle">E</text>
      <text x="42" y="10"  fontSize="5.5" fontWeight="700" fontFamily="monospace" fill="currentColor" textAnchor="middle">S</text>
    </svg>
  )
}

function WordChainIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      <rect x="2" y="14" width="20" height="12" rx="6" stroke="currentColor" strokeWidth="2"/>
      <rect x="16" y="26" width="20" height="12" rx="6" stroke="currentColor" strokeWidth="2"/>
      <rect x="30" y="14" width="20" height="12" rx="6" stroke="currentColor" strokeWidth="2"/>
      <text x="12" y="23" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="monospace" fill="currentColor">CAT</text>
      <text x="26" y="35" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="monospace" fill="currentColor">TIP</text>
      <text x="40" y="23" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="monospace" fill="currentColor">PEN</text>
    </svg>
  )
}

function SimonSaysIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      <path d="M26 26 L26 4 A22 22 0 0 1 48 26 Z" fill="#22c55e" opacity="0.85"/>
      <path d="M26 26 L48 26 A22 22 0 0 1 26 48 Z" fill="#ef4444" opacity="0.85"/>
      <path d="M26 26 L26 48 A22 22 0 0 1 4 26 Z"  fill="#eab308" opacity="0.85"/>
      <path d="M26 26 L4 26 A22 22 0 0 1 26 4 Z"   fill="#3b82f6" opacity="0.85"/>
      <circle cx="26" cy="26" r="7" fill="#1a1a1a" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

function MemoryMatchIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      <rect x="2"  y="8" width="22" height="30" rx="4" fill="url(#mmg1)" opacity="0.9"/>
      <rect x="28" y="8" width="22" height="30" rx="4" fill="url(#mmg1)" opacity="0.9"/>
      <text x="13" y="27" textAnchor="middle" fontSize="18" fill="white">★</text>
      <text x="39" y="27" textAnchor="middle" fontSize="18" fill="white">★</text>
      <defs>
        <linearGradient id="mmg1" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#6366f1"/><stop offset="1" stopColor="#a78bfa"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

function SequenceRecallIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      <circle cx="10" cy="26" r="8" fill="#3b82f6" opacity="0.9"/>
      <circle cx="26" cy="26" r="8" fill="#a78bfa" opacity="0.9"/>
      <circle cx="42" cy="26" r="8" fill="#22d3ee" opacity="0.9"/>
      <text x="10" y="30" textAnchor="middle" fontSize="9" fontWeight="800" fill="white">1</text>
      <text x="26" y="30" textAnchor="middle" fontSize="9" fontWeight="800" fill="white">2</text>
      <text x="42" y="30" textAnchor="middle" fontSize="9" fontWeight="800" fill="white">3</text>
      <path d="M18 26 L18 26" stroke="currentColor" strokeWidth="1.4"/>
      <line x1="18" y1="26" x2="18" y2="26" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  )
}

function QuizBowlIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      <path d="M16 8 H36 L34 28 Q26 36 18 28 Z" fill="url(#qbg1)" opacity="0.9"/>
      <rect x="22" y="34" width="8" height="8" fill="url(#qbg1)" opacity="0.8"/>
      <rect x="16" y="42" width="20" height="4" rx="2" fill="url(#qbg1)" opacity="0.9"/>
      <line x1="8"  y1="12" x2="16" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="44" y1="12" x2="36" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <defs>
        <linearGradient id="qbg1" x1="16" y1="8" x2="36" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b"/><stop offset="1" stopColor="#f97316"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

function FlagQuizIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      <line x1="10" y1="6" x2="10" y2="46" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <rect x="10" y="8" width="32" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="10" y="8"  width="32" height="7" rx="2" fill="#ef4444" opacity="0.8"/>
      <rect x="10" y="15" width="32" height="8" fill="white" opacity="0.7"/>
      <rect x="10" y="23" width="32" height="7" rx="2" fill="#3b82f6" opacity="0.8"/>
    </svg>
  )
}

function TrueFalseIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      <circle cx="14" cy="26" r="11" fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="1.8"/>
      <polyline points="8,26 13,31 20,20" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="38" cy="26" r="11" fill="rgba(248,113,113,0.15)" stroke="#f87171" strokeWidth="1.8"/>
      <line x1="32" y1="20" x2="44" y2="32" stroke="#f87171" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="44" y1="20" x2="32" y2="32" stroke="#f87171" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

function SudokuIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      <rect x="3" y="3" width="46" height="46" rx="4" stroke="currentColor" strokeWidth="1.5"/>
      {[1,2].map(i => <line key={`h${i}`} x1="3" y1={3+i*46/3} x2="49" y2={3+i*46/3} stroke="currentColor" strokeWidth="1.5"/>)}
      {[1,2].map(i => <line key={`v${i}`} x1={3+i*46/3} y1="3" x2={3+i*46/3} y2="49" stroke="currentColor" strokeWidth="1.5"/>)}
      {[['1','3','_','2'],['_','2','1','_'],['3','_','2','1'],['2','1','_','3']].map((row, r) =>
        row.map((n, c) => n !== '_' &&
          <text key={`${r}${c}`} x={3+c*46/3+46/6} y={3+r*46/3+46/6+3.5} textAnchor="middle"
            fontSize="8" fontWeight="700" fontFamily="monospace" fill="currentColor" opacity="0.85">{n}</text>
        )
      )}
    </svg>
  )
}

function Game2048Icon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      <rect x="2"  y="2"  width="22" height="22" rx="4" fill="#eab308" opacity="0.9"/>
      <rect x="28" y="2"  width="22" height="22" rx="4" fill="#f97316" opacity="0.9"/>
      <rect x="2"  y="28" width="22" height="22" rx="4" fill="#f97316" opacity="0.9"/>
      <rect x="28" y="28" width="22" height="22" rx="4" fill="#ef4444" opacity="0.9"/>
      <text x="13" y="17"  textAnchor="middle" fontSize="10" fontWeight="900" fill="white">2</text>
      <text x="39" y="17"  textAnchor="middle" fontSize="10" fontWeight="900" fill="white">4</text>
      <text x="13" y="43"  textAnchor="middle" fontSize="10" fontWeight="900" fill="white">8</text>
      <text x="39" y="43"  textAnchor="middle" fontSize="8"  fontWeight="900" fill="white">16</text>
    </svg>
  )
}

function SlidingPuzzleIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      {[[1,2,3],[4,5,6],[7,8,0]].map((row, r) =>
        row.map((n, c) => n !== 0
          ? <g key={`${r}${c}`}>
              <rect x={2+c*17} y={2+r*17} width="15" height="15" rx="3" stroke="currentColor" strokeWidth="1.4" fill="rgba(100,108,255,0.12)"/>
              <text x={9.5+c*17} y={13+r*17} textAnchor="middle" fontSize="7.5" fontWeight="700" fontFamily="monospace" fill="currentColor">{n}</text>
            </g>
          : <rect key={`${r}${c}`} x={2+c*17} y={2+r*17} width="15" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.3"/>
        )
      )}
    </svg>
  )
}

function PictionaryIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      <rect x="4" y="6" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M10 26 Q16 14 22 20 Q28 26 34 16" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <line x1="40" y1="10" x2="46" y2="4"  stroke="currentColor" strokeWidth="2"   strokeLinecap="round"/>
      <line x1="40" y1="10" x2="34" y2="16" stroke="currentColor" strokeWidth="2"   strokeLinecap="round"/>
      <line x1="34" y1="16" x2="32" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="10" y1="38" x2="42" y2="38" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      <line x1="10" y1="44" x2="30" y2="44" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.3"/>
    </svg>
  )
}

function DOSGamesIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      <rect x="3" y="8" width="46" height="32" rx="3" stroke="#00ff41" strokeWidth="1.6" fill="rgba(0,255,65,0.05)"/>
      <rect x="3" y="36" width="46" height="4" rx="1" fill="rgba(0,255,65,0.15)" stroke="#00ff41" strokeWidth="0.8"/>
      <text x="8" y="22" fontSize="6" fontFamily="Courier New, monospace" fill="#00ff41" fontWeight="700">C:\GAMES&gt;</text>
      <text x="8" y="31" fontSize="6" fontFamily="Courier New, monospace" fill="#00ff41" opacity="0.7">RUN TETRIS.EXE</text>
      <rect x="44" y="17" width="3" height="8" fill="#00ff41" opacity="0.9"/>
    </svg>
  )
}

function KillerKakuroIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      <rect x="3" y="3" width="46" height="46" rx="4" stroke="currentColor" strokeWidth="1.4"/>
      {[1,2].map(i => <line key={`h${i}`} x1="3" y1={3+i*46/3} x2="49" y2={3+i*46/3} stroke="currentColor" strokeWidth="1.4"/>)}
      {[1,2].map(i => <line key={`v${i}`} x1={3+i*46/3} y1="3" x2={3+i*46/3} y2="49" stroke="currentColor" strokeWidth="1.4"/>)}
      <rect x="4" y="4" width="30" height="30" rx="2" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.9"/>
      <rect x="22" y="22" width="26" height="26" rx="2" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.9"/>
      <text x="6" y="11" fontSize="5" fontWeight="700" fill="#f59e0b" opacity="0.9">15</text>
      <text x="24" y="29" fontSize="5" fontWeight="700" fill="#a78bfa" opacity="0.9">10</text>
      <text x="18" y="20" fontSize="8" fontWeight="900" fontFamily="monospace" fill="currentColor" textAnchor="middle">3</text>
      <text x="34" y="20" fontSize="8" fontWeight="900" fontFamily="monospace" fill="currentColor" textAnchor="middle">7</text>
    </svg>
  )
}

function KakuroIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
      {[[0,1,2],[3,4,5],[6,7,8]].map((row, ri) =>
        row.map((_, ci) => (
          <g key={`${ri}-${ci}`}>
            <rect x={2+ci*17} y={2+ri*17} width="15" height="15" rx="2"
              fill={ri===0&&ci===0||ri===1&&ci===1||ri===2&&ci===0 ? '#111' : 'none'}
              stroke={ri===0&&ci===0||ri===1&&ci===1||ri===2&&ci===0 ? '#444' : 'currentColor'}
              strokeWidth="1.2" opacity="0.9"/>
            {ri===0&&ci===0 && <>
              <line x1="2" y1="2" x2="17" y2="17" stroke="#555" strokeWidth="1"/>
              <text x="14" y="8" textAnchor="end" fontSize="4.5" fontWeight="700" fill="#999">15</text>
              <text x="5" y="16" textAnchor="start" fontSize="4.5" fontWeight="700" fill="#999">7</text>
            </>}
            {ri===0&&ci===1 && <text x="9.5+17" y="13" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="monospace" fill="currentColor">3</text>}
            {ri===0&&ci===2 && <text x="9.5+34" y="13" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="monospace" fill="currentColor">4</text>}
            {ri===1&&ci===0 && <text x="9.5" y="30" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="monospace" fill="currentColor">8</text>}
            {ri===1&&ci===2 && <text x="9.5+34" y="30" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="monospace" fill="currentColor">7</text>}
            {ri===2&&ci===1 && <text x="9.5+17" y="47" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="monospace" fill="currentColor">2</text>}
            {ri===2&&ci===2 && <text x="9.5+34" y="47" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="monospace" fill="currentColor">9</text>}
          </g>
        ))
      )}
    </svg>
  )
}

function GameIcon({ id }) {
  if (id === 'ludo')            return <LudoIcon />
  if (id === 'questions')       return <QuestionsIcon />
  if (id === 'brands')          return <BrandsIcon />
  if (id === 'hangman')         return <HangmanGameIcon />
  if (id === 'word-scramble')   return <WordScrambleIcon />
  if (id === 'crossword')       return <CrosswordIcon />
  if (id === 'word-chain')      return <WordChainIcon />
  if (id === 'simon-says')      return <SimonSaysIcon />
  if (id === 'memory-match')    return <MemoryMatchIcon />
  if (id === 'sequence-recall') return <SequenceRecallIcon />
  if (id === 'quiz-bowl')       return <QuizBowlIcon />
  if (id === 'flag-quiz')       return <FlagQuizIcon />
  if (id === 'true-false')      return <TrueFalseIcon />
  if (id === 'sudoku')          return <SudokuIcon />
  if (id === '2048')            return <Game2048Icon />
  if (id === 'sliding-puzzle')  return <SlidingPuzzleIcon />
  if (id === 'pictionary')      return <PictionaryIcon />
  if (id === 'kakuro')          return <KakuroIcon />
  if (id === 'killer-kakuro')  return <KillerKakuroIcon />
  if (id === 'dos-games')      return <DOSGamesIcon />
  return <TicTacToeIcon />
}

export default function Games() {
  const navigate = useNavigate()

  return (
    <div className="games-page">
      <Breadcrumb />
      <h1>Games</h1>
      <p>Pick a game to play.</p>
      <div className="games-grid">
        {GAMES.map(g => (
          <button key={g.id} className="game-tile" onClick={() => navigate(g.route)}>
            <GameIcon id={g.id} />
            <span className="game-tile-label">{g.label}</span>
            <span className="game-tile-desc">{g.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
