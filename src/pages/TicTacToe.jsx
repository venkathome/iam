import { useState, useEffect, useRef } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import './TicTacToe.css'

const STORAGE_KEY = 'iam-ttt-history'
const COLORS = { X: '#a78bfa', O: '#fb923c', win: '#4ade80', draw: '#f59e0b' }

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2) }

// ── Win check ──────────────────────────────────────────────────────────────────

function checkWin(board, size) {
  const check = cells => {
    const sym = board[cells[0]]
    return sym && cells.every(i => board[i] === sym) ? { sym, line: cells } : null
  }
  for (let r = 0; r < size; r++) {
    const res = check(Array.from({ length: size }, (_, c) => r * size + c))
    if (res) return res
  }
  for (let c = 0; c < size; c++) {
    const res = check(Array.from({ length: size }, (_, r) => r * size + c))
    if (res) return res
  }
  return (
    check(Array.from({ length: size }, (_, i) => i * size + i)) ||
    check(Array.from({ length: size }, (_, i) => i * size + (size - 1 - i)))
  )
}

// ── AI ─────────────────────────────────────────────────────────────────────────

function getWinLines(size) {
  const lines = []
  for (let r = 0; r < size; r++)
    lines.push(Array.from({ length: size }, (_, c) => r * size + c))
  for (let c = 0; c < size; c++)
    lines.push(Array.from({ length: size }, (_, r) => r * size + c))
  lines.push(Array.from({ length: size }, (_, i) => i * size + i))
  lines.push(Array.from({ length: size }, (_, i) => i * size + (size - 1 - i)))
  return lines
}

function heuristic(board, size, aiSym, humanSym) {
  let score = 0
  for (const line of getWinLines(size)) {
    const cells = line.map(i => board[i])
    const ai = cells.filter(c => c === aiSym).length
    const hu = cells.filter(c => c === humanSym).length
    if (hu === 0 && ai > 0) score += ai * ai
    if (ai === 0 && hu > 0) score -= hu * hu
  }
  return score
}

function minimax(board, size, depth, isMax, alpha, beta, aiSym, humanSym) {
  const res = checkWin(board, size)
  if (res) return res.sym === aiSym ? 100 + depth : -(100 + depth)
  const empty = []
  for (let i = 0; i < board.length; i++) if (!board[i]) empty.push(i)
  if (empty.length === 0 || depth <= 0) return heuristic(board, size, aiSym, humanSym)

  if (isMax) {
    let best = -Infinity
    for (const i of empty) {
      board[i] = aiSym
      best = Math.max(best, minimax(board, size, depth - 1, false, alpha, beta, aiSym, humanSym))
      board[i] = null
      alpha = Math.max(alpha, best)
      if (alpha >= beta) break
    }
    return best
  } else {
    let best = Infinity
    for (const i of empty) {
      board[i] = humanSym
      best = Math.min(best, minimax(board, size, depth - 1, true, alpha, beta, aiSym, humanSym))
      board[i] = null
      beta = Math.min(beta, best)
      if (alpha >= beta) break
    }
    return best
  }
}

function findWinningMove(board, size, sym) {
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = sym
      const win = checkWin(board, size)
      board[i] = null
      if (win) return i
    }
  }
  return -1
}

function getBestMove(board, size, difficulty, aiSym, humanSym) {
  const empty = []
  for (let i = 0; i < board.length; i++) if (!board[i]) empty.push(i)
  if (empty.length === 0) return -1

  // Always take immediate win
  const winMove = findWinningMove(board, size, aiSym)
  if (winMove >= 0) return winMove

  // Easy: random, no blocking
  if (difficulty === 'easy') {
    return empty[Math.floor(Math.random() * empty.length)]
  }

  // Medium + Hard: block opponent's immediate win
  const blockMove = findWinningMove(board, size, humanSym)
  if (blockMove >= 0) return blockMove

  // Medium: occasionally random after blocking
  if (difficulty === 'medium' && Math.random() < 0.4) {
    return empty[Math.floor(Math.random() * empty.length)]
  }

  const depth = difficulty === 'hard'
    ? (size === 3 ? 9 : size === 4 ? 5 : 3)
    : (size === 3 ? 4 : 2)

  const workBoard = [...board]
  let bestScore = -Infinity
  let bestMove  = empty[0]

  for (const i of empty) {
    workBoard[i] = aiSym
    const score = minimax(workBoard, size, depth - 1, false, -Infinity, Infinity, aiSym, humanSym)
    workBoard[i] = null
    if (score > bestScore) { bestScore = score; bestMove = i }
  }

  return bestMove
}

// ── Board component ────────────────────────────────────────────────────────────

function Board({ board, size, winLine, onPress, disabled }) {
  return (
    <div className="ttt-board" style={{ '--size': size }}>
      {board.map((cell, idx) => {
        const highlighted = winLine?.includes(idx)
        return (
          <button
            key={idx}
            className={`ttt-cell ${cell ? `ttt-cell-${cell.toLowerCase()}` : ''} ${highlighted ? 'ttt-cell-win' : ''}`}
            onClick={() => !disabled && !cell && onPress(idx)}
            disabled={disabled || !!cell}
          >
            {cell}
          </button>
        )
      })}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function TicTacToe() {
  const [tab,              setTab]              = useState('game')
  const [phase,            setPhase]            = useState('setup')
  const [boardSize,        setBoardSize]        = useState(3)
  const [names,            setNames]            = useState(['Player 1', 'Player 2'])
  const [vsComputer,       setVsComputer]       = useState(false)
  const [difficulty,       setDifficulty]       = useState('medium')
  const [players,          setPlayers]          = useState([
    { name: 'Player 1', symbol: 'X', score: 0 },
    { name: 'Player 2', symbol: 'O', score: 0 },
  ])
  const [board,            setBoard]            = useState(Array(9).fill(null))
  const [current,          setCurrent]          = useState(0)
  const [winResult,        setWinResult]        = useState(null)
  const [draws,            setDraws]            = useState(0)
  const [moves,            setMoves]            = useState(0)
  const [history,          setHistory]          = useState([])
  const [computerThinking, setComputerThinking] = useState(false)

  // Refs so the computer effect always sees fresh board/moves without them as deps
  const boardRef   = useRef(board)
  const movesRef   = useRef(moves)
  const playersRef = useRef(players)
  useEffect(() => { boardRef.current = board },     [board])
  useEffect(() => { movesRef.current = moves },     [moves])
  useEffect(() => { playersRef.current = players }, [players])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setHistory(JSON.parse(raw))
    } catch {}
  }, [])

  function persist(h) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(h)) } catch {}
  }

  function addHistory(entry) {
    setHistory(prev => {
      const nh = [entry, ...prev]
      persist(nh)
      return nh
    })
  }

  function startGame() {
    const p2name = vsComputer
      ? `Computer (${difficulty[0].toUpperCase() + difficulty.slice(1)})`
      : (names[1] || 'Player 2')
    setPlayers([
      { name: names[0] || 'Player 1', symbol: 'X', score: players[0].score },
      { name: p2name,                  symbol: 'O', score: players[1].score },
    ])
    setBoard(Array(boardSize * boardSize).fill(null))
    setCurrent(0)
    setWinResult(null)
    setMoves(0)
    setComputerThinking(false)
    setPhase('playing')
  }

  // Computer turn effect
  useEffect(() => {
    if (!vsComputer || phase !== 'playing' || current !== 1) return

    setComputerThinking(true)

    const timer = setTimeout(() => {
      const b    = [...boardRef.current]
      const nm   = movesRef.current + 1
      const ps   = playersRef.current
      const move = getBestMove([...b], boardSize, difficulty, 'O', 'X')

      if (move < 0) return

      b[move] = 'O'
      setBoard(b)
      setMoves(nm)
      setComputerThinking(false)

      const result = checkWin(b, boardSize)
      if (result) {
        const wi = result.sym === 'O' ? 1 : 0
        setPlayers(prev => prev.map((p, i) => i === wi ? { ...p, score: p.score + 1 } : p))
        setWinResult(result)
        addHistory({
          id: uid(),
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          boardSize, result: 'win',
          winner: ps[wi].name, loser: ps[1 - wi].name, moves: nm,
        })
        setPhase('ended')
      } else if (b.every(Boolean)) {
        setWinResult('draw')
        setDraws(d => d + 1)
        addHistory({
          id: uid(),
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          boardSize, result: 'draw', players: [ps[0].name, ps[1].name], moves: nm,
        })
        setPhase('ended')
      } else {
        setCurrent(0)
      }
    }, 550)

    return () => { clearTimeout(timer); setComputerThinking(false) }
  }, [phase, current, vsComputer, boardSize, difficulty])

  function handleCell(idx) {
    if (phase !== 'playing' || board[idx] || computerThinking) return
    const nb = [...board]
    nb[idx] = players[current].symbol
    const nm = moves + 1
    setBoard(nb)
    setMoves(nm)

    const result = checkWin(nb, boardSize)
    if (result) {
      const wi = players.findIndex(p => p.symbol === result.sym)
      setPlayers(prev => prev.map((p, i) => i === wi ? { ...p, score: p.score + 1 } : p))
      setWinResult(result)
      addHistory({ id: uid(), date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), boardSize, result: 'win', winner: players[wi].name, loser: players[1 - wi].name, moves: nm })
      setPhase('ended')
    } else if (nb.every(Boolean)) {
      setWinResult('draw')
      setDraws(d => d + 1)
      addHistory({ id: uid(), date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), boardSize, result: 'draw', players: [players[0].name, players[1].name], moves: nm })
      setPhase('ended')
    } else {
      setCurrent(c => 1 - c)
    }
  }

  function handleResign() {
    const wi = 1 - current
    setPlayers(prev => prev.map((p, i) => i === wi ? { ...p, score: p.score + 1 } : p))
    addHistory({ id: uid(), date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), boardSize, result: 'resign', winner: players[wi].name, loser: players[current].name, moves })
    setWinResult({ sym: players[wi].symbol, resign: true })
    setPhase('ended')
  }

  function playAgain() {
    setBoard(Array(boardSize * boardSize).fill(null))
    setCurrent(0)
    setWinResult(null)
    setMoves(0)
    setComputerThinking(false)
    setPhase('playing')
  }

  function clearHistory() { setHistory([]); persist([]) }

  const winnerName = winResult && winResult !== 'draw'
    ? players.find(p => p.symbol === winResult.sym)?.name
    : null

  const allTimeStats = history.reduce((acc, g) => {
    if (g.result === 'draw') acc.draws++
    else if (g.winner) acc.wins[g.winner] = (acc.wins[g.winner] || 0) + 1
    return acc
  }, { wins: {}, draws: 0 })

  const topPlayers = Object.entries(allTimeStats.wins).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div className="ttt-page">
      <Breadcrumb />

      <div className="ttt-tabs">
        {[{ key: 'game', label: 'Game' }, { key: 'history', label: 'Stats & History' }].map(t => (
          <button
            key={t.key}
            className={`ttt-tab ${tab === t.key ? 'ttt-tab-active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'game' ? (
        <div className="ttt-content">
          {/* Score strip */}
          <div className="ttt-score">
            <div className="ttt-score-player" style={{ '--clr': COLORS.X }}>
              <span className="ttt-score-sym">X</span>
              <span className="ttt-score-name">{players[0].name}</span>
              <span className="ttt-score-num">{players[0].score}</span>
            </div>
            <div className="ttt-score-mid">
              <span className="ttt-score-draw-lbl">DRAWS</span>
              <span className="ttt-score-draw-num">{draws}</span>
            </div>
            <div className="ttt-score-player ttt-score-player-right" style={{ '--clr': COLORS.O }}>
              <span className="ttt-score-sym">O</span>
              <span className="ttt-score-name">{players[1].name}</span>
              <span className="ttt-score-num">{players[1].score}</span>
            </div>
          </div>

          {/* Setup */}
          {phase === 'setup' && (
            <div className="ttt-section">
              {/* Mode toggle */}
              <p className="ttt-section-title">Mode</p>
              <div className="ttt-mode-row">
                <button
                  className={`ttt-mode-btn ${!vsComputer ? 'ttt-mode-btn-active' : ''}`}
                  onClick={() => setVsComputer(false)}
                >
                  👥 vs Player
                </button>
                <button
                  className={`ttt-mode-btn ${vsComputer ? 'ttt-mode-btn-active' : ''}`}
                  onClick={() => setVsComputer(true)}
                >
                  🤖 vs Computer
                </button>
              </div>

              {/* Player names */}
              <p className="ttt-section-title" style={{ marginTop: '1.25rem' }}>Players</p>
              <div className="ttt-player-row">
                <span className="ttt-sym-badge" style={{ '--clr': COLORS.X }}>X</span>
                <input
                  className="ttt-name-input"
                  value={names[0]}
                  onChange={e => setNames(prev => [e.target.value, prev[1]])}
                  placeholder="Player 1"
                  maxLength={20}
                />
              </div>

              {vsComputer ? (
                <>
                  <p className="ttt-section-title" style={{ marginTop: '1.25rem' }}>Difficulty</p>
                  <div className="ttt-diff-row">
                    {[
                      { key: 'easy',   label: 'Easy',   hint: 'Random moves' },
                      { key: 'medium', label: 'Medium', hint: 'Makes mistakes' },
                      { key: 'hard',   label: 'Hard',   hint: 'Near perfect' },
                    ].map(({ key, label, hint }) => (
                      <button
                        key={key}
                        className={`ttt-diff-chip ${difficulty === key ? 'ttt-diff-chip-active' : ''}`}
                        onClick={() => setDifficulty(key)}
                      >
                        <span className="ttt-size-label">{label}</span>
                        <span className="ttt-size-hint">{hint}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="ttt-player-row">
                  <span className="ttt-sym-badge" style={{ '--clr': COLORS.O }}>O</span>
                  <input
                    className="ttt-name-input"
                    value={names[1]}
                    onChange={e => setNames(prev => [prev[0], e.target.value])}
                    placeholder="Player 2"
                    maxLength={20}
                  />
                </div>
              )}

              {/* Board size */}
              <p className="ttt-section-title" style={{ marginTop: '1.5rem' }}>Board Size</p>
              <div className="ttt-size-row">
                {[{ sz: 3, label: '3×3', hint: 'Classic' }, { sz: 4, label: '4×4', hint: 'Medium' }, { sz: 5, label: '5×5', hint: 'Large' }].map(({ sz, label, hint }) => (
                  <button
                    key={sz}
                    className={`ttt-size-chip ${boardSize === sz ? 'ttt-size-chip-active' : ''}`}
                    onClick={() => setBoardSize(sz)}
                  >
                    <span className="ttt-size-label">{label}</span>
                    <span className="ttt-size-hint">{hint}</span>
                  </button>
                ))}
              </div>

              <button className="ttt-primary-btn" onClick={startGame}>▶ Start Game</button>

              {(players[0].score > 0 || players[1].score > 0 || draws > 0) && (
                <button className="ttt-ghost-btn" onClick={() => {
                  setPlayers(prev => prev.map(p => ({ ...p, score: 0 })))
                  setDraws(0)
                }}>↺ Reset Session Scores</button>
              )}
            </div>
          )}

          {/* Playing */}
          {phase === 'playing' && (
            <div className="ttt-section">
              <div
                className={`ttt-turn-banner ${computerThinking ? 'ttt-turn-banner-thinking' : ''}`}
                style={{ '--clr': players[current].symbol === 'X' ? COLORS.X : COLORS.O }}
              >
                <span className="ttt-turn-sym">{players[current].symbol}</span>
                <div>
                  <div className="ttt-turn-name">{players[current].name}</div>
                  <div className="ttt-turn-hint">
                    {computerThinking ? 'thinking…' : "it's your turn"}
                  </div>
                </div>
                <span className="ttt-move-count">Move {moves + 1}</span>
              </div>
              <Board
                board={board}
                size={boardSize}
                winLine={null}
                onPress={handleCell}
                disabled={computerThinking}
              />
              {!computerThinking && (
                <button className="ttt-ghost-btn" onClick={handleResign}>🏳 Resign</button>
              )}
            </div>
          )}

          {/* Ended */}
          {phase === 'ended' && (
            <div className="ttt-section">
              <div className="ttt-result-banner">
                {winResult === 'draw' ? (
                  <>
                    <span className="ttt-result-emoji">🤝</span>
                    <span className="ttt-result-title" style={{ color: COLORS.draw }}>It's a Draw!</span>
                    <span className="ttt-result-sub">{moves} moves played</span>
                  </>
                ) : winResult?.resign ? (
                  <>
                    <span className="ttt-result-emoji">🏳️</span>
                    <span className="ttt-result-title" style={{ color: winResult.sym === 'X' ? COLORS.X : COLORS.O }}>{winnerName} Wins!</span>
                    <span className="ttt-result-sub">by resignation</span>
                  </>
                ) : (
                  <>
                    <span className="ttt-result-emoji">{winnerName === players[1].name && vsComputer ? '🤖' : '🎉'}</span>
                    <span className="ttt-result-title" style={{ color: winResult?.sym === 'X' ? COLORS.X : COLORS.O }}>{winnerName} Wins!</span>
                    <span className="ttt-result-sub">in {moves} moves</span>
                  </>
                )}
              </div>
              <Board board={board} size={boardSize} winLine={winResult !== 'draw' && !winResult?.resign ? winResult?.line : null} onPress={() => {}} disabled />
              <div className="ttt-end-row">
                <button className="ttt-primary-btn" style={{ flex: 1 }} onClick={playAgain}>↺ Play Again</button>
                <button className="ttt-ghost-btn" style={{ flex: 1 }} onClick={() => setPhase('setup')}>⌂ Menu</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* History tab */
        <div className="ttt-content">
          {history.length === 0 ? (
            <div className="ttt-empty">
              <span className="ttt-empty-icon">🏆</span>
              <p>No games yet. Start playing to build your history.</p>
            </div>
          ) : (
            <>
              <div className="ttt-section">
                <p className="ttt-section-title">All-Time Stats</p>
                <div className="ttt-stats-row">
                  <div className="ttt-stat-card"><span className="ttt-stat-num">{history.length}</span><span className="ttt-stat-lbl">Games</span></div>
                  <div className="ttt-stat-card"><span className="ttt-stat-num" style={{ color: COLORS.win }}>{history.filter(g => g.result !== 'draw').length}</span><span className="ttt-stat-lbl">Wins</span></div>
                  <div className="ttt-stat-card"><span className="ttt-stat-num" style={{ color: COLORS.draw }}>{allTimeStats.draws}</span><span className="ttt-stat-lbl">Draws</span></div>
                </div>
              </div>

              {topPlayers.length > 0 && (
                <div className="ttt-section">
                  <p className="ttt-section-title">Leaderboard</p>
                  {topPlayers.map(([name, wins], i) => (
                    <div key={name} className="ttt-leader-row">
                      <span className="ttt-leader-rank">#{i + 1}</span>
                      <span className="ttt-leader-name">{name}</span>
                      <span className="ttt-leader-wins" style={{ color: COLORS.win }}>{wins} <span style={{ color: '#888', fontWeight: 400 }}>wins</span></span>
                    </div>
                  ))}
                </div>
              )}

              <div className="ttt-section">
                <div className="ttt-log-header">
                  <p className="ttt-section-title" style={{ margin: 0 }}>Game Log</p>
                  <button className="ttt-clear-btn" onClick={clearHistory}>Clear All</button>
                </div>
                {history.map(g => (
                  <div key={g.id} className="ttt-log-card">
                    <div className="ttt-log-main">
                      {g.result === 'draw'
                        ? `Draw — ${g.players?.join(' vs ')}`
                        : `${g.winner} defeated ${g.loser}${g.result === 'resign' ? ' (resign)' : ''}`}
                    </div>
                    <div className="ttt-log-meta">{g.boardSize}×{g.boardSize} · {g.moves} moves · {g.date} {g.time}</div>
                    <span className="ttt-log-badge" style={{ '--clr': g.result === 'draw' ? COLORS.draw : COLORS.win }}>
                      {g.result === 'resign' ? 'RESIGN' : g.result.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
