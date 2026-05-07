import { useEffect, useRef, useState } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import DifficultySelector from '../components/DifficultySelector'
import HowToPlay from '../components/HowToPlay'
import '../components/DifficultySelector.css'
import './Pong.css'

const HOW_TO_PLAY = [
  'Move your paddle up and down to hit the ball back.',
  'Score a point when the ball gets past your opponent.',
  'First to reach the score limit wins!',
  'vs AI: use W (up) and S (down) keys.',
  '2 Players: left paddle uses W/S, right paddle uses ↑/↓.',
]

const DIFF_CONFIG = {
  'very-easy': { aiSpeed: 2.5, ballSpeed: 3.5, winScore: 5  },
  'easy':      { aiSpeed: 3.5, ballSpeed: 4.0, winScore: 7  },
  'medium':    { aiSpeed: 4.5, ballSpeed: 4.5, winScore: 7  },
  'hard':      { aiSpeed: 5.5, ballSpeed: 5.0, winScore: 7  },
  'very-hard': { aiSpeed: 6.5, ballSpeed: 5.5, winScore: 9  },
  'ultimate':  { aiSpeed: 8.0, ballSpeed: 6.5, winScore: 11 },
}

const W = 480, H = 540
const PADDLE_W = 10, PADDLE_H = 70, BALL_R = 7
const PADDLE_MARGIN = 20

function initBall(ballSpeed) {
  const angle = (Math.random() * 0.6 - 0.3) + (Math.random() < 0.5 ? 0 : Math.PI)
  return {
    x: W / 2, y: H / 2,
    vx: ballSpeed * Math.cos(angle),
    vy: ballSpeed * Math.sin(angle),
  }
}

function initState(mode, cfg) {
  return {
    leftY:  H / 2 - PADDLE_H / 2,
    rightY: H / 2 - PADDLE_H / 2,
    ball: initBall(cfg.ballSpeed),
    leftScore: 0,
    rightScore: 0,
    phase: 'playing',
    mode,
    keys: { w: false, s: false, up: false, down: false },
    frameCount: 0,
    aiSpeed: cfg.aiSpeed,
    ballSpeed: cfg.ballSpeed,
    winScore: cfg.winScore,
  }
}

function clampPaddleY(y) {
  return Math.max(0, Math.min(H - PADDLE_H, y))
}

export default function Pong() {
  const canvasRef = useRef(null)
  const stateRef  = useRef(null)
  const rafRef    = useRef(null)
  const diffRef   = useRef('medium')
  const [difficulty, setDifficulty] = useState('medium')
  const [phase, setPhase]   = useState('idle')
  const [mode, setMode]     = useState('ai')
  const [scoreL, setScoreL] = useState(0)
  const [scoreR, setScoreR] = useState(0)

  function draw(ctx, s) {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, W, H)

    // scanlines
    ctx.fillStyle = 'rgba(0,0,0,0.07)'
    for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2)

    // center line
    ctx.setLineDash([8, 8])
    ctx.strokeStyle = 'rgba(0,255,65,0.2)'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke()
    ctx.setLineDash([])

    // scores
    ctx.font = 'bold 40px Courier New'
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(0,255,65,0.3)'
    ctx.fillText(s.leftScore,  W / 4, 60)
    ctx.fillText(s.rightScore, W * 3 / 4, 60)

    // paddles
    ctx.fillStyle = '#00ff41'
    ctx.shadowColor = '#00ff41'
    ctx.shadowBlur = 12
    ctx.fillRect(PADDLE_MARGIN, s.leftY, PADDLE_W, PADDLE_H)
    ctx.fillRect(W - PADDLE_MARGIN - PADDLE_W, s.rightY, PADDLE_W, PADDLE_H)
    ctx.shadowBlur = 0

    // ball
    ctx.beginPath()
    ctx.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = '#ffffff'
    ctx.shadowBlur = 14
    ctx.fill()
    ctx.shadowBlur = 0

    // mode label
    ctx.font = '11px Courier New'
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(0,255,65,0.25)'
    ctx.fillText(s.mode === 'ai' ? 'vs AI' : '2 PLAYERS', W / 2, H - 8)
    ctx.textAlign = 'left'
  }

  function loop() {
    const s = stateRef.current
    if (!s || s.phase !== 'playing') return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    s.frameCount++
    const PADDLE_SPEED = 6

    // left paddle (player 1: W/S)
    if (s.keys.w) s.leftY = clampPaddleY(s.leftY - PADDLE_SPEED)
    if (s.keys.s) s.leftY = clampPaddleY(s.leftY + PADDLE_SPEED)

    // right paddle (player 2 or AI)
    if (s.mode === '2p') {
      if (s.keys.up)   s.rightY = clampPaddleY(s.rightY - PADDLE_SPEED)
      if (s.keys.down) s.rightY = clampPaddleY(s.rightY + PADDLE_SPEED)
    } else {
      const center = s.rightY + PADDLE_H / 2
      const diff = s.ball.y - center
      const aiSpd = Math.min(Math.abs(diff), s.aiSpeed)
      s.rightY = clampPaddleY(s.rightY + Math.sign(diff) * aiSpd)
    }

    // ball
    s.ball.x += s.ball.vx
    s.ball.y += s.ball.vy

    // top/bottom bounce
    if (s.ball.y - BALL_R < 0)  { s.ball.y = BALL_R;       s.ball.vy =  Math.abs(s.ball.vy) }
    if (s.ball.y + BALL_R > H)  { s.ball.y = H - BALL_R;   s.ball.vy = -Math.abs(s.ball.vy) }

    // left paddle hit
    const lx = PADDLE_MARGIN + PADDLE_W
    if (s.ball.vx < 0 && s.ball.x - BALL_R <= lx && s.ball.x - BALL_R >= PADDLE_MARGIN) {
      if (s.ball.y >= s.leftY - BALL_R && s.ball.y <= s.leftY + PADDLE_H + BALL_R) {
        const hit = (s.ball.y - (s.leftY + PADDLE_H / 2)) / (PADDLE_H / 2)
        const speed = Math.sqrt(s.ball.vx ** 2 + s.ball.vy ** 2) * 1.04
        const angle = hit * (Math.PI / 4)
        s.ball.vx =  Math.min(speed * Math.cos(angle), 12)
        s.ball.vy =  speed * Math.sin(angle)
        s.ball.x  = lx + BALL_R
      }
    }

    // right paddle hit
    const rx = W - PADDLE_MARGIN - PADDLE_W
    if (s.ball.vx > 0 && s.ball.x + BALL_R >= rx && s.ball.x + BALL_R <= W - PADDLE_MARGIN) {
      if (s.ball.y >= s.rightY - BALL_R && s.ball.y <= s.rightY + PADDLE_H + BALL_R) {
        const hit = (s.ball.y - (s.rightY + PADDLE_H / 2)) / (PADDLE_H / 2)
        const speed = Math.sqrt(s.ball.vx ** 2 + s.ball.vy ** 2) * 1.04
        const angle = hit * (Math.PI / 4)
        s.ball.vx = -Math.min(speed * Math.cos(angle), 12)
        s.ball.vy =  speed * Math.sin(angle)
        s.ball.x  = rx - BALL_R
      }
    }

    // scoring
    if (s.ball.x - BALL_R < 0) {
      s.rightScore++
      setScoreR(s.rightScore)
      if (s.rightScore >= s.winScore) {
        s.phase = 'won'
        s.winner = s.mode === '2p' ? 'PLAYER 2' : 'AI'
        setPhase('won')
        draw(ctx, s)
        return
      }
      s.ball = initBall(s.ballSpeed)
      s.ball.vx = Math.abs(s.ball.vx)
    }

    if (s.ball.x + BALL_R > W) {
      s.leftScore++
      setScoreL(s.leftScore)
      if (s.leftScore >= s.winScore) {
        s.phase = 'won'
        s.winner = 'PLAYER 1'
        setPhase('won')
        draw(ctx, s)
        return
      }
      s.ball = initBall(s.ballSpeed)
      s.ball.vx = -Math.abs(s.ball.vx)
    }

    draw(ctx, s)
    rafRef.current = requestAnimationFrame(loop)
  }

  function startGame(m) {
    cancelAnimationFrame(rafRef.current)
    const s = initState(m ?? mode, DIFF_CONFIG[diffRef.current])
    stateRef.current = s
    setPhase('playing')
    setScoreL(0)
    setScoreR(0)
    rafRef.current = requestAnimationFrame(loop)
  }

  useEffect(() => {
    function onKey(e) {
      const s = stateRef.current
      if (!s) return
      const down = e.type === 'keydown'
      if (e.key === 'w' || e.key === 'W') { e.preventDefault(); s.keys.w    = down }
      if (e.key === 's' || e.key === 'S') { e.preventDefault(); s.keys.s    = down }
      if (e.key === 'ArrowUp')            { e.preventDefault(); s.keys.up   = down }
      if (e.key === 'ArrowDown')          { e.preventDefault(); s.keys.down = down }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKey)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    if (phase === 'idle') {
      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx) return
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#00ff41'
      ctx.font = 'bold 40px Courier New'
      ctx.textAlign = 'center'
      ctx.fillText('PONG', W / 2, H / 2 - 20)
      ctx.font = '13px Courier New'
      ctx.fillStyle = 'rgba(0,255,65,0.55)'
      ctx.fillText('The original video game', W / 2, H / 2 + 20)
    }
  }, [phase])

  const winner = stateRef.current?.winner

  return (
    <div className="pong-page">
      <Breadcrumb />
      <h1 className="pong-title">PONG</h1>
      <HowToPlay steps={HOW_TO_PLAY} />

      <div className="pong-mode-bar">
        <button
          className={`pong-mode-btn ${mode === 'ai' ? 'pong-mode-btn--active' : ''}`}
          onClick={() => { setMode('ai'); if (phase !== 'idle') startGame('ai') }}
        >vs AI</button>
        <button
          className={`pong-mode-btn ${mode === '2p' ? 'pong-mode-btn--active' : ''}`}
          onClick={() => { setMode('2p'); if (phase !== 'idle') startGame('2p') }}
        >2 PLAYERS</button>
      </div>

      <div className="pong-wrap">
        <canvas ref={canvasRef} width={W} height={H} className="pong-canvas" />
        {(phase === 'idle' || phase === 'won') && (
          <div className="pong-overlay">
            {phase === 'won' && <p className="pong-over-title">{winner} WINS!</p>}
            {phase === 'idle' && <p className="pong-over-title">PONG</p>}
            <DifficultySelector value={difficulty} onChange={(d) => { diffRef.current = d; setDifficulty(d) }} />
            <button className="pong-btn" onClick={() => startGame()}>
              {phase === 'won' ? '[ PLAY AGAIN ]' : '[ START GAME ]'}
            </button>
            <p className="pong-tip">
              {mode === '2p'
                ? 'Left: W/S keys · Right: ↑/↓ keys'
                : 'W/S keys to move · vs AI'}
            </p>
          </div>
        )}
      </div>

      <div className="pong-scoreboard">
        <div className="pong-score-side">
          <p className="pong-score-label">{mode === '2p' ? 'PLAYER 1' : 'PLAYER'}</p>
          <p className="pong-score-val">{scoreL}</p>
        </div>
        <span className="pong-score-sep">:</span>
        <div className="pong-score-side">
          <p className="pong-score-label">{mode === '2p' ? 'PLAYER 2' : 'AI'}</p>
          <p className="pong-score-val">{scoreR}</p>
        </div>
      </div>

      <p className="pong-target">First to {DIFF_CONFIG[difficulty].winScore} wins</p>
    </div>
  )
}
