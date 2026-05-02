import { useEffect, useRef, useState } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import './Breakout.css'

const W = 480, H = 540
const PADDLE_W = 80, PADDLE_H = 10, PADDLE_Y = H - 40
const BALL_R = 7
const BRICK_COLS = 10, BRICK_ROWS = 5, BRICK_H = 18, BRICK_GAP = 4
const BRICK_OFFSET_X = 20, BRICK_OFFSET_Y = 60
const BRICK_W = (W - BRICK_OFFSET_X * 2 - (BRICK_COLS - 1) * BRICK_GAP) / BRICK_COLS

const ROW_COLORS = ['#ff4444', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3']

function makeBricks() {
  const bricks = []
  for (let r = 0; r < BRICK_ROWS; r++)
    for (let c = 0; c < BRICK_COLS; c++)
      bricks.push({ r, c, alive: true })
  return bricks
}

export default function Breakout() {
  const canvasRef = useRef(null)
  const stateRef  = useRef(null)
  const rafRef    = useRef(null)
  const [phase, setPhase]   = useState('idle')
  const [score, setScore]   = useState(0)
  const [lives, setLives]   = useState(3)
  const [level, setLevel]   = useState(1)

  function initState(lvl = 1) {
    const speed = 4 + (lvl - 1) * 0.6
    const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 0.8
    return {
      paddleX: W / 2 - PADDLE_W / 2,
      ballX: W / 2,
      ballY: PADDLE_Y - BALL_R - 2,
      vx: speed * Math.cos(angle),
      vy: speed * Math.sin(angle),
      bricks: makeBricks(),
      lives: 3,
      score: 0,
      level: lvl,
      phase: 'playing',
      keys: { left: false, right: false },
    }
  }

  function draw(ctx, s) {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, W, H)

    // scanlines
    ctx.fillStyle = 'rgba(0,0,0,0.08)'
    for (let y = 0; y < H; y += 4) { ctx.fillRect(0, y, W, 2) }

    // bricks
    s.bricks.forEach(b => {
      if (!b.alive) return
      const x = BRICK_OFFSET_X + b.c * (BRICK_W + BRICK_GAP)
      const y = BRICK_OFFSET_Y + b.r * (BRICK_H + BRICK_GAP)
      ctx.fillStyle = ROW_COLORS[b.r]
      ctx.shadowColor = ROW_COLORS[b.r]
      ctx.shadowBlur = 8
      ctx.fillRect(x, y, BRICK_W, BRICK_H)
      ctx.shadowBlur = 0
      ctx.strokeStyle = 'rgba(0,0,0,0.3)'
      ctx.strokeRect(x, y, BRICK_W, BRICK_H)
    })

    // paddle
    ctx.fillStyle = '#00ff41'
    ctx.shadowColor = '#00ff41'
    ctx.shadowBlur = 12
    ctx.fillRect(s.paddleX, PADDLE_Y, PADDLE_W, PADDLE_H)
    ctx.shadowBlur = 0

    // ball
    ctx.beginPath()
    ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = '#ffffff'
    ctx.shadowBlur = 10
    ctx.fill()
    ctx.shadowBlur = 0

    // HUD
    ctx.fillStyle = '#00ff41'
    ctx.font = '13px Courier New'
    ctx.textAlign = 'left'
    ctx.fillText(`SCORE: ${s.score}`, 10, 20)
    ctx.textAlign = 'center'
    ctx.fillText(`LEVEL ${s.level}`, W / 2, 20)
    ctx.textAlign = 'right'
    ctx.fillText('♥'.repeat(s.lives), W - 10, 20)
    ctx.textAlign = 'left'
  }

  function loop() {
    const s = stateRef.current
    if (!s || s.phase !== 'playing') return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    const PADDLE_SPEED = 7
    if (s.keys.left)  s.paddleX = Math.max(0, s.paddleX - PADDLE_SPEED)
    if (s.keys.right) s.paddleX = Math.min(W - PADDLE_W, s.paddleX + PADDLE_SPEED)

    s.ballX += s.vx
    s.ballY += s.vy

    // wall bounce
    if (s.ballX - BALL_R < 0)  { s.ballX = BALL_R;       s.vx = Math.abs(s.vx) }
    if (s.ballX + BALL_R > W)  { s.ballX = W - BALL_R;   s.vx = -Math.abs(s.vx) }
    if (s.ballY - BALL_R < 0)  { s.ballY = BALL_R;        s.vy = Math.abs(s.vy) }

    // paddle
    if (
      s.ballY + BALL_R >= PADDLE_Y &&
      s.ballY + BALL_R <= PADDLE_Y + PADDLE_H + Math.abs(s.vy) &&
      s.ballX >= s.paddleX &&
      s.ballX <= s.paddleX + PADDLE_W &&
      s.vy > 0
    ) {
      const hit = (s.ballX - (s.paddleX + PADDLE_W / 2)) / (PADDLE_W / 2)
      const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy)
      const angle = hit * (Math.PI / 3)
      s.vx = speed * Math.sin(angle)
      s.vy = -speed * Math.cos(angle)
      s.ballY = PADDLE_Y - BALL_R - 1
    }

    // ball lost
    if (s.ballY - BALL_R > H) {
      s.lives -= 1
      setLives(s.lives)
      if (s.lives <= 0) {
        s.phase = 'lost'
        setPhase('lost')
        draw(ctx, s)
        return
      }
      const speed = 4 + (s.level - 1) * 0.6
      const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 0.8
      s.ballX = W / 2
      s.ballY = PADDLE_Y - BALL_R - 2
      s.vx = speed * Math.cos(angle)
      s.vy = speed * Math.sin(angle)
    }

    // brick collision
    s.bricks.forEach(b => {
      if (!b.alive) return
      const bx = BRICK_OFFSET_X + b.c * (BRICK_W + BRICK_GAP)
      const by = BRICK_OFFSET_Y + b.r * (BRICK_H + BRICK_GAP)
      const cx = Math.max(bx, Math.min(s.ballX, bx + BRICK_W))
      const cy = Math.max(by, Math.min(s.ballY, by + BRICK_H))
      const dx = s.ballX - cx, dy = s.ballY - cy
      if (dx * dx + dy * dy < BALL_R * BALL_R) {
        b.alive = false
        s.score += (BRICK_ROWS - b.r) * 10
        setScore(s.score)
        const overlapX = BRICK_W / 2 - Math.abs(s.ballX - (bx + BRICK_W / 2))
        const overlapY = BRICK_H / 2 - Math.abs(s.ballY - (by + BRICK_H / 2))
        if (overlapX < overlapY) s.vx = -s.vx
        else s.vy = -s.vy
      }
    })

    // level clear
    if (s.bricks.every(b => !b.alive)) {
      const nextLvl = s.level + 1
      const newS = initState(nextLvl)
      newS.score = s.score
      newS.lives = s.lives
      stateRef.current = newS
      setLevel(nextLvl)
      draw(ctx, newS)
      rafRef.current = requestAnimationFrame(loop)
      return
    }

    draw(ctx, s)
    rafRef.current = requestAnimationFrame(loop)
  }

  function startGame() {
    cancelAnimationFrame(rafRef.current)
    const s = initState(1)
    stateRef.current = s
    setPhase('playing')
    setScore(0)
    setLives(3)
    setLevel(1)
    rafRef.current = requestAnimationFrame(loop)
  }

  useEffect(() => {
    function onKey(e) {
      const s = stateRef.current
      if (!s) return
      const down = e.type === 'keydown'
      if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') { e.preventDefault(); s.keys.left  = down }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); s.keys.right = down }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)

    function onMouse(e) {
      const s = stateRef.current
      if (!s || s.phase !== 'playing') return
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      const mx = (e.clientX - rect.left) * (W / rect.width)
      s.paddleX = Math.max(0, Math.min(W - PADDLE_W, mx - PADDLE_W / 2))
    }
    canvasRef.current?.addEventListener('mousemove', onMouse)

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
      ctx.font = 'bold 32px Courier New'
      ctx.textAlign = 'center'
      ctx.fillText('BREAKOUT', W / 2, H / 2 - 30)
      ctx.font = '14px Courier New'
      ctx.fillStyle = 'rgba(0,255,65,0.6)'
      ctx.fillText('Arrow keys / A-D or mouse to move paddle', W / 2, H / 2 + 20)
    }
  }, [phase])

  return (
    <div className="breakout-page">
      <Breadcrumb />
      <h1 className="breakout-title">BREAKOUT</h1>

      <div className="breakout-wrap">
        <canvas ref={canvasRef} width={W} height={H} className="breakout-canvas" />
        {(phase === 'idle' || phase === 'lost') && (
          <div className="breakout-overlay">
            {phase === 'lost' && (
              <>
                <p className="bo-over-title">GAME OVER</p>
                <p className="bo-over-sub">Score: {score} &nbsp;|&nbsp; Level: {level}</p>
              </>
            )}
            {phase === 'idle' && <p className="bo-over-title">BREAKOUT</p>}
            <button className="bo-btn" onClick={startGame}>
              {phase === 'lost' ? '[ PLAY AGAIN ]' : '[ START GAME ]'}
            </button>
            <p className="bo-tip">Arrow keys / A-D or move mouse over canvas</p>
          </div>
        )}
      </div>

      <div className="breakout-hud">
        <span>SCORE: <strong>{score}</strong></span>
        <span>LEVEL: <strong>{level}</strong></span>
        <span>LIVES: <strong>{'♥'.repeat(lives)}</strong></span>
      </div>
    </div>
  )
}
