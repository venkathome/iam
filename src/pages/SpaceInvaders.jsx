import { useEffect, useRef, useState } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import './SpaceInvaders.css'

const W = 480, H = 540
const PLAYER_W = 36, PLAYER_H = 20
const BULLET_W = 3, BULLET_H = 10
const ALIEN_COLS = 11, ALIEN_ROWS = 5
const ALIEN_W = 32, ALIEN_H = 24, ALIEN_GAP_X = 10, ALIEN_GAP_Y = 12
const ALIEN_START_X = (W - (ALIEN_COLS * (ALIEN_W + ALIEN_GAP_X))) / 2
const ALIEN_START_Y = 60
const PLAYER_BULLET_SPEED = 7
const ALIEN_BULLET_SPEED = 3

const ALIEN_SHAPES = [
  // row 0 – top (saucer-like)
  (c, x, y) => {
    c.fillRect(x + 12, y,     8,  4)
    c.fillRect(x + 4,  y + 4, 24, 4)
    c.fillRect(x,      y + 8, 32, 8)
    c.fillRect(x + 4,  y + 16, 8, 4)
    c.fillRect(x + 20, y + 16, 8, 4)
  },
  // row 1-2 – crab
  (c, x, y) => {
    c.fillRect(x + 4,  y,     4,  4)
    c.fillRect(x + 24, y,     4,  4)
    c.fillRect(x + 4,  y + 4, 24, 4)
    c.fillRect(x,      y + 8, 32, 8)
    c.fillRect(x + 4,  y + 16, 24, 4)
    c.fillRect(x,      y + 20, 4, 4)
    c.fillRect(x + 28, y + 20, 4, 4)
  },
  // row 3-4 – squid
  (c, x, y) => {
    c.fillRect(x + 12, y,     8, 4)
    c.fillRect(x + 4,  y + 4, 24, 8)
    c.fillRect(x,      y + 12, 32, 4)
    c.fillRect(x + 8,  y + 16, 4,  4)
    c.fillRect(x + 20, y + 16, 4,  4)
    c.fillRect(x + 4,  y + 20, 4,  4)
    c.fillRect(x + 24, y + 20, 4,  4)
  },
]

const ALIEN_COLORS = ['#ff4444', '#ff9800', '#ff9800', '#4caf50', '#4caf50']

function makeAliens() {
  const aliens = []
  for (let r = 0; r < ALIEN_ROWS; r++)
    for (let c = 0; c < ALIEN_COLS; c++)
      aliens.push({ r, c, alive: true, frame: 0 })
  return aliens
}

function playerShape(ctx, x, y, color) {
  ctx.fillStyle = color
  ctx.fillRect(x + 14, y,      8,  4)
  ctx.fillRect(x + 4,  y + 4,  28, 4)
  ctx.fillRect(x,      y + 8,  36, 12)
}

export default function SpaceInvaders() {
  const canvasRef = useRef(null)
  const stateRef  = useRef(null)
  const rafRef    = useRef(null)
  const [phase, setPhase] = useState('idle')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [hiScore, setHiScore] = useState(0)

  function initState() {
    return {
      playerX: W / 2 - PLAYER_W / 2,
      bullets: [],
      alienBullets: [],
      aliens: makeAliens(),
      alienDX: 1.2,
      alienFrame: 0,
      alienTick: 0,
      alienTickMax: 30,
      score: 0,
      lives: 3,
      phase: 'playing',
      keys: { left: false, right: false, shoot: false },
      lastShot: 0,
      frameCount: 0,
    }
  }

  function alienPos(a, aliens, alienDX) {
    const alive = aliens.filter(x => x.alive)
    const minC = Math.min(...alive.map(x => x.c))
    const maxC = Math.max(...alive.map(x => x.c))
    const minR = Math.min(...alive.map(x => x.r))
    const dx = (alienDX > 0 ? 0 : (ALIEN_COLS - 1 - maxC + minC) * (ALIEN_W + ALIEN_GAP_X) * 0)
    void dx
    const baseX = ALIEN_START_X
    const baseY = ALIEN_START_Y + (minR === 0 ? 0 : 0)
    return {
      x: baseX + a.c * (ALIEN_W + ALIEN_GAP_X) + (stateRef.current?.alienOffsetX ?? 0),
      y: baseY + a.r * (ALIEN_H + ALIEN_GAP_Y) + (stateRef.current?.alienOffsetY ?? 0),
    }
  }

  function draw(ctx, s) {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = 'rgba(0,0,0,0.06)'
    for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2)

    // aliens
    s.aliens.forEach(a => {
      if (!a.alive) return
      const x = ALIEN_START_X + a.c * (ALIEN_W + ALIEN_GAP_X) + s.alienOffsetX
      const y = ALIEN_START_Y + a.r * (ALIEN_H + ALIEN_GAP_Y) + s.alienOffsetY
      ctx.fillStyle = ALIEN_COLORS[a.r]
      ctx.shadowColor = ALIEN_COLORS[a.r]
      ctx.shadowBlur = 6
      const shapeFn = ALIEN_SHAPES[Math.min(Math.floor(a.r / 2), 2)]
      shapeFn(ctx, x, y)
    })
    ctx.shadowBlur = 0

    // player bullets
    s.bullets.forEach(b => {
      ctx.fillStyle = '#00ff41'
      ctx.shadowColor = '#00ff41'
      ctx.shadowBlur = 8
      ctx.fillRect(b.x - BULLET_W / 2, b.y, BULLET_W, BULLET_H)
    })

    // alien bullets
    s.alienBullets.forEach(b => {
      ctx.fillStyle = '#ff4444'
      ctx.shadowColor = '#ff4444'
      ctx.shadowBlur = 6
      ctx.fillRect(b.x - BULLET_W / 2, b.y, BULLET_W, BULLET_H)
    })
    ctx.shadowBlur = 0

    // player
    playerShape(ctx, s.playerX, H - PLAYER_H - 20, '#00ff41')

    // ground line
    ctx.fillStyle = '#00ff41'
    ctx.fillRect(0, H - 16, W, 2)

    // HUD
    ctx.font = '13px Courier New'
    ctx.fillStyle = '#00ff41'
    ctx.textAlign = 'left'
    ctx.fillText(`SCORE: ${s.score}`, 10, 20)
    ctx.textAlign = 'center'
    ctx.fillText(`HI: ${Math.max(s.score, hiScore)}`, W / 2, 20)
    ctx.textAlign = 'right'
    ctx.fillText('♥'.repeat(s.lives), W - 10, 20)
    ctx.textAlign = 'left'
  }

  function loop() {
    const s = stateRef.current
    if (!s || s.phase !== 'playing') return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    s.frameCount++

    // player move
    if (s.keys.left)  s.playerX = Math.max(0, s.playerX - 5)
    if (s.keys.right) s.playerX = Math.min(W - PLAYER_W, s.playerX + 5)

    // shoot
    if (s.keys.shoot && s.frameCount - s.lastShot > 20) {
      s.bullets.push({ x: s.playerX + PLAYER_W / 2, y: H - PLAYER_H - 20 })
      s.lastShot = s.frameCount
    }

    // move bullets
    s.bullets = s.bullets.filter(b => b.y > 0)
    s.bullets.forEach(b => b.y -= PLAYER_BULLET_SPEED)

    // alien movement
    s.alienTick++
    if (s.alienTick >= s.alienTickMax) {
      s.alienTick = 0
      s.alienFrame = (s.alienFrame + 1) % 2

      const alive = s.aliens.filter(a => a.alive)
      if (!alive.length) return

      const leftMost  = Math.min(...alive.map(a => ALIEN_START_X + a.c * (ALIEN_W + ALIEN_GAP_X) + s.alienOffsetX))
      const rightMost = Math.max(...alive.map(a => ALIEN_START_X + a.c * (ALIEN_W + ALIEN_GAP_X) + s.alienOffsetX + ALIEN_W))

      let drop = false
      if (rightMost + s.alienDX * 16 > W - 8) { s.alienDX = -Math.abs(s.alienDX); drop = true }
      if (leftMost  + s.alienDX * 16 < 8)      { s.alienDX =  Math.abs(s.alienDX); drop = true }

      s.alienOffsetX += s.alienDX * 16
      if (drop) s.alienOffsetY += 14

      // alien bullet
      if (Math.random() < 0.35) {
        const bottom = []
        for (let c = 0; c < ALIEN_COLS; c++) {
          const col = alive.filter(a => a.c === c)
          if (col.length) bottom.push(col.reduce((a, b) => (a.r > b.r ? a : b)))
        }
        if (bottom.length) {
          const shooter = bottom[Math.floor(Math.random() * bottom.length)]
          const sx = ALIEN_START_X + shooter.c * (ALIEN_W + ALIEN_GAP_X) + s.alienOffsetX + ALIEN_W / 2
          const sy = ALIEN_START_Y + shooter.r * (ALIEN_H + ALIEN_GAP_Y) + s.alienOffsetY + ALIEN_H
          s.alienBullets.push({ x: sx, y: sy })
        }
      }

      s.alienTickMax = Math.max(6, 30 - (s.aliens.filter(a => !a.alive).length * 0.4))
    }

    // move alien bullets
    s.alienBullets = s.alienBullets.filter(b => b.y < H)
    s.alienBullets.forEach(b => b.y += ALIEN_BULLET_SPEED)

    // bullet vs alien
    s.bullets.forEach(b => {
      s.aliens.forEach(a => {
        if (!a.alive) return
        const ax = ALIEN_START_X + a.c * (ALIEN_W + ALIEN_GAP_X) + s.alienOffsetX
        const ay = ALIEN_START_Y + a.r * (ALIEN_H + ALIEN_GAP_Y) + s.alienOffsetY
        if (b.x >= ax && b.x <= ax + ALIEN_W && b.y <= ay + ALIEN_H && b.y >= ay) {
          a.alive = false
          b.y = -100
          s.score += (ALIEN_ROWS - a.r) * 10
          setScore(s.score)
        }
      })
    })

    // alien bullet vs player
    const px = s.playerX, py = H - PLAYER_H - 20
    s.alienBullets.forEach(b => {
      if (b.x >= px && b.x <= px + PLAYER_W && b.y >= py && b.y <= py + PLAYER_H) {
        b.y = H + 100
        s.lives -= 1
        setLives(s.lives)
        if (s.lives <= 0) {
          s.phase = 'lost'
          setHiScore(h => Math.max(h, s.score))
          setPhase('lost')
        }
      }
    })

    // alien reaches bottom
    if (s.aliens.some(a => a.alive && ALIEN_START_Y + a.r * (ALIEN_H + ALIEN_GAP_Y) + s.alienOffsetY + ALIEN_H > H - 30)) {
      s.phase = 'lost'
      setHiScore(h => Math.max(h, s.score))
      setPhase('lost')
    }

    // win
    if (s.aliens.every(a => !a.alive)) {
      s.phase = 'won'
      setHiScore(h => Math.max(h, s.score))
      setPhase('won')
    }

    draw(ctx, s)
    rafRef.current = requestAnimationFrame(loop)
  }

  function startGame() {
    cancelAnimationFrame(rafRef.current)
    const s = { ...initState(), alienOffsetX: 0, alienOffsetY: 0 }
    stateRef.current = s
    setPhase('playing')
    setScore(0)
    setLives(3)
    rafRef.current = requestAnimationFrame(loop)
  }

  useEffect(() => {
    function onKey(e) {
      const s = stateRef.current
      if (!s) return
      const down = e.type === 'keydown'
      if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') { e.preventDefault(); s.keys.left  = down }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); s.keys.right = down }
      if (e.key === ' ' || e.key === 'ArrowUp')                     { e.preventDefault(); s.keys.shoot = down }
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
      ctx.font = 'bold 30px Courier New'
      ctx.textAlign = 'center'
      ctx.fillText('SPACE INVADERS', W / 2, H / 2 - 20)
      ctx.font = '13px Courier New'
      ctx.fillStyle = 'rgba(0,255,65,0.55)'
      ctx.fillText('Arrow keys / A-D to move · Space to shoot', W / 2, H / 2 + 20)
    }
  }, [phase])

  return (
    <div className="si-page">
      <Breadcrumb />
      <h1 className="si-title">SPACE INVADERS</h1>

      <div className="si-wrap">
        <canvas ref={canvasRef} width={W} height={H} className="si-canvas" />
        {(phase === 'idle' || phase === 'lost' || phase === 'won') && (
          <div className="si-overlay">
            {phase === 'lost' && <p className="si-over-title">GAME OVER</p>}
            {phase === 'won'  && <p className="si-over-title si-over-title--win">YOU WIN!</p>}
            {phase === 'idle' && <p className="si-over-title">SPACE INVADERS</p>}
            {phase !== 'idle' && <p className="si-over-sub">Score: {score}</p>}
            <button className="si-btn" onClick={startGame}>
              {phase === 'idle' ? '[ START GAME ]' : '[ PLAY AGAIN ]'}
            </button>
            <p className="si-tip">A/D or ← → to move · Space to shoot</p>
          </div>
        )}
      </div>

      <div className="si-hud">
        <span>SCORE: <strong>{score}</strong></span>
        <span>HI: <strong>{Math.max(score, hiScore)}</strong></span>
        <span>LIVES: <strong>{'♥'.repeat(lives)}</strong></span>
      </div>
    </div>
  )
}
