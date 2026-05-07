import { useState } from 'react'
import './HowToPlay.css'

export default function HowToPlay({ steps }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="htp">
      <button className="htp-toggle" onClick={() => setOpen(o => !o)}>
        <span>📖 How to Play</span>
        <span className="htp-chevron">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <ol className="htp-list">
          {steps.map((step, i) => (
            <li key={i} className="htp-step">{step}</li>
          ))}
        </ol>
      )}
    </div>
  )
}
