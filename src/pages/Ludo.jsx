import { useState, useMemo, useEffect } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import './Ludo.css'

// ─── Board constants ──────────────────────────────────────────────────────────

const TRACK = [
  [6,1],[6,2],[6,3],[6,4],[6,5],
  [5,6],[4,6],[3,6],[2,6],[1,6],[0,6],
  [0,7],[0,8],
  [1,8],[2,8],[3,8],[4,8],[5,8],
  [6,9],[6,10],[6,11],[6,12],[6,13],[6,14],
  [7,14],[8,14],
  [8,13],[8,12],[8,11],[8,10],[8,9],
  [9,8],[10,8],[11,8],[12,8],[13,8],[14,8],
  [14,7],[14,6],
  [13,6],[12,6],[11,6],[10,6],[9,6],
  [8,5],[8,4],[8,3],[8,2],[8,1],[8,0],
  [7,0],[6,0],
]  // 52 positions

const HC = {
  red:    [[7,1],[7,2],[7,3],[7,4],[7,5],[7,6]],
  green:  [[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],
  yellow: [[7,13],[7,12],[7,11],[7,10],[7,9],[7,8]],
  blue:   [[13,7],[12,7],[11,7],[10,7],[9,7],[8,7]],
}

const COLORS = ['red', 'green', 'yellow', 'blue']
const CHX = { red: '#ef4444', green: '#22c55e', yellow: '#eab308', blue: '#3b82f6' }
const START = { red: 0, green: 13, yellow: 26, blue: 39 }
const SAFE = new Set([0, 8, 13, 21, 26, 34, 39, 47])

const BASE = {
  red:    [[1,1],[1,3],[3,1],[3,3]],
  green:  [[1,10],[1,12],[3,10],[3,12]],
  yellow: [[11,10],[11,12],[13,10],[13,12]],
  blue:   [[11,1],[11,3],[13,1],[13,3]],
}

// Prebuilt cell lookup map
const CMAP = (() => {
  const m = {}
  TRACK.forEach(([r, c], i) => {
    let tc = null
    if (i === 0) tc = 'red'
    else if (i === 13) tc = 'green'
    else if (i === 26) tc = 'yellow'
    else if (i === 39) tc = 'blue'
    m[`${r},${c}`] = { t: 'path', i, safe: SAFE.has(i), tc }
  })
  Object.entries(HC).forEach(([color, arr]) =>
    arr.forEach(([r, c], i) => { m[`${r},${c}`] = { t: 'hc', color, i } })
  )
  return m
})()

function cinfo(r, c) {
  const k = `${r},${c}`
  if (CMAP[k]) return CMAP[k]
  if (r < 6 && c < 6) return { t: 'home', color: 'red' }
  if (r < 6 && c > 8) return { t: 'home', color: 'green' }
  if (r > 8 && c > 8) return { t: 'home', color: 'yellow' }
  if (r > 8 && c < 6) return { t: 'home', color: 'blue' }
  if (r === 7 && c === 7) return { t: 'center' }
  if ((r === 6 || r === 8) && (c === 6 || c === 8)) {
    const color = r === 6 ? (c === 6 ? 'red' : 'green') : (c === 6 ? 'blue' : 'yellow')
    return { t: 'deco', color }
  }
  return { t: 'empty' }
}

// ─── Game logic ───────────────────────────────────────────────────────────────

const posOf = (color, step) => {
  if (step < 0 || step > 56) return null
  return step <= 50 ? TRACK[(START[color] + step) % 52] : HC[color][step - 51]
}

const tidx = (color, step) =>
  step >= 0 && step <= 50 ? (START[color] + step) % 52 : -1

function movesFor(players, pi, dice) {
  const { color, tokens } = players[pi]
  return tokens.flatMap((t, ti) => {
    if (t.step === -1) return dice === 6 ? [{ ti, to: 0 }] : []
    if (t.step > 56) return []
    const to = t.step + dice
    return to <= 57 ? [{ ti, to }] : []
  })
}

function applyMove(game, ti) {
  if (!game.dice) return game
  const { players, current, dice } = game
  const mvs = movesFor(players, current, dice)
  const mv = mvs.find(m => m.ti === ti)
  if (!mv) return game

  const { color } = players[current]
  const landIdx = mv.to <= 50 ? tidx(color, mv.to) : -1
  const canCap = landIdx >= 0 && !SAFE.has(landIdx)
  let gotCap = false

  const next = players.map((p, pi) => {
    if (pi === current)
      return { ...p, tokens: p.tokens.map((t, i) => i === ti ? { ...t, step: mv.to } : t) }
    if (!canCap) return p
    const tks = p.tokens.map(t => {
      if (t.step < 0 || t.step > 50) return t
      if (tidx(p.color, t.step) === landIdx) { gotCap = true; return { ...t, step: -1 } }
      return t
    })
    return { ...p, tokens: tks }
  })

  if (next[current].tokens.every(t => t.step === 57))
    return { ...game, players: next, phase: 'won', winner: current, dice: null }

  const extra = dice === 6
  const nextP = extra ? current : (current + 1) % next.length
  return { ...game, players: next, current: nextP, dice: null, phase: 'roll', extraTurn: extra }
}

// ─── Board cell ───────────────────────────────────────────────────────────────

function LCell({ r, c, tokens, movable, onMove }) {
  const info = cinfo(r, c)

  let bg = 'emp'
  if (info.t === 'home') {
    const inner =
      (info.color === 'red'    && r >= 1 && r <= 4 && c >= 1 && c <= 4) ||
      (info.color === 'green'  && r >= 1 && r <= 4 && c >= 10 && c <= 13) ||
      (info.color === 'yellow' && r >= 10 && r <= 13 && c >= 10 && c <= 13) ||
      (info.color === 'blue'   && r >= 10 && r <= 13 && c >= 1 && c <= 4)
    bg = inner ? 'hi' : `hb-${info.color}`
  } else if (info.t === 'path') {
    bg = info.tc ? `st-${info.tc}` : (info.safe ? 'safe' : 'path')
  } else if (info.t === 'hc') {
    bg = `hc-${info.color}`
  } else if (info.t === 'center') {
    bg = 'ctr'
  } else if (info.t === 'deco') {
    bg = `dc-${info.color}`
  }

  return (
    <div className={`lc lc-${bg}`}>
      {info.t === 'path' && info.safe && <span className="lc-star">★</span>}
      {tokens?.map(({ color, tokenId }) => {
        const mv = movable?.has(`${color}-${tokenId}`)
        return (
          <button
            key={`${color}-${tokenId}`}
            className={`lt lt-${color}${mv ? ' lt-mv' : ''}`}
            onClick={mv ? () => onMove(color, tokenId) : undefined}
            disabled={!mv}
            aria-label={`${color} token`}
          />
        )
      })}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

const FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

export default function Ludo() {
  const [tab, setTab] = useState('setup')
  const [nPlrs, setNPlrs] = useState(4)
  const [names, setNames] = useState(['Player 1', 'Player 2', 'Player 3', 'Player 4'])
  const [game, setGame] = useState(null)
  const [rolling, setRolling] = useState(false)

  // Auto-advance when no valid moves
  useEffect(() => {
    if (!game || game.phase !== 'no_moves') return
    const t = setTimeout(() =>
      setGame(p => {
        if (!p || p.phase !== 'no_moves') return p
        return { ...p, dice: null, current: (p.current + 1) % p.players.length, phase: 'roll', extraTurn: false }
      }), 1300)
    return () => clearTimeout(t)
  }, [game?.phase, game?.current])

  function startGame() {
    setGame({
      players: COLORS.slice(0, nPlrs).map((color, i) => ({
        color,
        name: names[i] || (color[0].toUpperCase() + color.slice(1)),
        tokens: [0, 1, 2, 3].map(id => ({ id, step: -1 })),
      })),
      current: 0, dice: null, phase: 'roll', winner: null, extraTurn: false,
    })
    setTab('game')
  }

  function handleRoll() {
    if (!game || game.phase !== 'roll' || rolling) return
    setRolling(true)
    setTimeout(() => {
      const d = Math.ceil(Math.random() * 6)
      setRolling(false)
      setGame(prev => {
        if (!prev) return prev
        const mvs = movesFor(prev.players, prev.current, d)
        if (mvs.length === 0)
          return { ...prev, dice: d, phase: 'no_moves' }
        if (mvs.length === 1)
          return applyMove({ ...prev, dice: d, phase: 'move' }, mvs[0].ti)
        return { ...prev, dice: d, phase: 'move' }
      })
    }, 500)
  }

  function handleMove(color, tokenId) {
    if (!game || game.phase !== 'move') return
    if (game.players[game.current].color !== color) return
    setGame(prev => prev ? applyMove(prev, tokenId) : prev)
  }

  const tmap = useMemo(() => {
    if (!game) return {}
    const m = {}
    game.players.forEach(p =>
      p.tokens.forEach(tok => {
        if (tok.step > 56) return
        const pos = tok.step === -1 ? BASE[p.color][tok.id] : posOf(p.color, tok.step)
        if (!pos) return
        const k = `${pos[0]},${pos[1]}`
        ;(m[k] = m[k] || []).push({ color: p.color, tokenId: tok.id })
      })
    )
    return m
  }, [game])

  const movable = useMemo(() => {
    if (!game || game.phase !== 'move') return new Set()
    const mvs = movesFor(game.players, game.current, game.dice)
    return new Set(mvs.map(m => `${game.players[game.current].color}-${m.ti}`))
  }, [game])

  const cur = game?.players[game.current]
  const won = game?.winner != null ? game.players[game.winner] : null

  // ── Setup ──
  if (tab === 'setup') return (
    <div className="ludo-pg">
      <Breadcrumb />
      <h1 className="ludo-h1">Ludo</h1>
      <p className="ludo-sub">Classic board game · 2–4 players</p>

      <div className="ludo-setup">
        <p className="ludo-lbl">Players</p>
        <div className="ludo-row">
          {[2, 3, 4].map(n => (
            <button key={n} className={`ludo-mode-btn${nPlrs === n ? ' sel' : ''}`} onClick={() => setNPlrs(n)}>
              {n} Players
            </button>
          ))}
        </div>

        <p className="ludo-lbl" style={{ marginTop: '1rem' }}>Names</p>
        {COLORS.slice(0, nPlrs).map((color, i) => (
          <div key={color} className="ludo-name-row">
            <span className="ludo-dot" style={{ background: CHX[color] }} />
            <input
              className="ludo-inp"
              value={names[i]}
              onChange={e => setNames(p => p.map((v, j) => j === i ? e.target.value : v))}
              placeholder={`Player ${i + 1}`}
              maxLength={20}
            />
          </div>
        ))}

        <button className="ludo-start-btn" onClick={startGame} style={{ marginTop: '1.25rem' }}>
          ▶ Start Game
        </button>
      </div>
    </div>
  )

  // ── Game ──
  return (
    <div className="ludo-pg">
      <Breadcrumb />

      <div className="ludo-chips">
        {game.players.map((p, i) => {
          const done = p.tokens.filter(t => t.step === 57).length
          const active = game.phase !== 'won' && i === game.current
          return (
            <div key={p.color} className={`ludo-chip${active ? ' on' : ''}`} style={{ '--c': CHX[p.color] }}>
              <span className="ludo-chip-dot" />
              <span className="ludo-chip-nm">{p.name}</span>
              <span className="ludo-chip-sc">{done}/4</span>
            </div>
          )
        })}
      </div>

      <div className="ludo-board">
        {Array.from({ length: 225 }, (_, idx) => {
          const r = Math.floor(idx / 15), c = idx % 15
          return (
            <LCell
              key={idx}
              r={r} c={c}
              tokens={tmap[`${r},${c}`]}
              movable={movable}
              onMove={handleMove}
            />
          )
        })}
      </div>

      {won ? (
        <div className="ludo-won">
          <span>🎉 {won.name} wins!</span>
          <button className="ludo-start-btn" onClick={() => setTab('setup')}>New Game</button>
        </div>
      ) : (
        <div className="ludo-ctrl">
          <div className="ludo-turn" style={{ '--c': CHX[cur?.color] }}>
            <span className="ludo-turn-dot" />
            <span className="ludo-turn-nm">{cur?.name}'s turn</span>
            {game.extraTurn && game.phase === 'roll' && (
              <span className="ludo-extra">Bonus turn!</span>
            )}
          </div>

          <button
            className={`ludo-dice${rolling ? ' rolling' : ''}`}
            onClick={handleRoll}
            disabled={game.phase !== 'roll' || rolling}
          >
            {rolling ? '🎲' : (game.dice ? FACES[game.dice] : '🎲')}
          </button>

          {game.phase === 'move' && (
            <p className="ludo-hint">Tap a glowing token to move</p>
          )}
          {game.phase === 'no_moves' && (
            <p className="ludo-hint">Rolled {FACES[game.dice]} — no valid moves, skipping…</p>
          )}
        </div>
      )}
    </div>
  )
}
