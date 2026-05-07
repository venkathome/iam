export const DIFFICULTIES = [
  { id: 'very-easy', label: 'Very Easy', emoji: '🌱', color: '#4ade80' },
  { id: 'easy',      label: 'Easy',      emoji: '😊', color: '#60a5fa' },
  { id: 'medium',    label: 'Medium',    emoji: '🎯', color: '#fbbf24' },
  { id: 'hard',      label: 'Hard',      emoji: '💪', color: '#fb923c' },
  { id: 'very-hard', label: 'Very Hard', emoji: '🔥', color: '#f87171' },
  { id: 'ultimate',  label: 'Ultimate',  emoji: '💀', color: '#a78bfa' },
]

export default function DifficultySelector({ value, onChange }) {
  return (
    <div className="diff-selector">
      {DIFFICULTIES.map(d => (
        <button
          key={d.id}
          className={`diff-btn${value === d.id ? ' diff-btn--active' : ''}`}
          style={{ '--diff-color': d.color }}
          onClick={() => onChange(d.id)}
        >
          <span className="diff-emoji">{d.emoji}</span>
          <span className="diff-label">{d.label}</span>
        </button>
      ))}
    </div>
  )
}
