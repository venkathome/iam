import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import './DOSGames.css'

const DOS_GAMES = [
  { id: 'tetris',         label: 'TETRIS',         desc: 'Stack falling blocks · Clear lines · Level up',   route: '/games/dos/tetris'         },
  { id: 'snake',          label: 'SNAKE',           desc: 'Eat food · Grow longer · Don\'t bite yourself',   route: '/games/dos/snake'          },
  { id: 'minesweeper',    label: 'MINESWEEPER',     desc: 'Reveal the field · Flag the mines · Survive',     route: '/games/dos/minesweeper'    },
  { id: 'breakout',       label: 'BREAKOUT',        desc: 'Smash bricks with a bouncing ball · 3 lives',     route: '/games/dos/breakout'       },
  { id: 'space-invaders', label: 'SPACE INVADERS',  desc: 'Defend Earth · Shoot the descending aliens',      route: '/games/dos/space-invaders' },
  { id: 'pong',           label: 'PONG',            desc: 'The original video game · vs AI or 2 Players',   route: '/games/dos/pong'           },
]

const ASCII_ICONS = {
  tetris:          ['┌──┐ ', '│██│ ', '│██├─┐', '└──┤█│', '   └─┘'],
  snake:           [' ●══╗ ', ' ║  ╚╗', ' ╚╗ ╚╗', '  ╚╗ ● ', '   ╚══╗'],
  minesweeper:     [' ┌─┬─┐', ' │1│*│', ' ├─┼─┤', ' │2│!│', ' └─┴─┘'],
  'space-invaders':['  /O\\ ', ' |O O|', ' \\___/', ' // \\\\', '      '],
  breakout:        ['▓▓▓▓▓▓', '▒▒▒▒▒▒', '░░░░░░', '      ', ' ══●  '],
  pong:            ['|     |', '|  ●  |', '|     |', '|  ┃  |', '|     |'],
}

export default function DOSGames() {
  const navigate = useNavigate()

  return (
    <div className="dos-page">
      <Breadcrumb />

      <div className="dos-header">
        <pre className="dos-title">{
`██████╗  ██████╗ ███████╗
██╔══██╗██╔═══██╗██╔════╝
██║  ██║██║   ██║███████╗
██║  ██║██║   ██║╚════██║
██████╔╝╚██████╔╝███████║
╚═════╝  ╚═════╝ ╚══════╝  GAMES`
        }</pre>
        <p className="dos-prompt">C:\GAMES\DOS&gt; <span className="dos-cursor">_</span></p>
        <p className="dos-tagline">6 classic games from the golden age of computing</p>
      </div>

      <div className="dos-grid">
        {DOS_GAMES.map(g => (
          <button key={g.id} className="dos-tile" onClick={() => navigate(g.route)}>
            <pre className="dos-tile-art">
              {(ASCII_ICONS[g.id] || []).join('\n')}
            </pre>
            <div className="dos-tile-info">
              <span className="dos-tile-label">[{g.label}]</span>
              <span className="dos-tile-desc">{g.desc}</span>
            </div>
          </button>
        ))}
      </div>

      <p className="dos-footer">SELECT A PROGRAM AND PRESS ENTER</p>
    </div>
  )
}
