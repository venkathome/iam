import './Home.css'

function RecipesIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="4" width="22" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/>
      <rect x="12" y="4" width="16" height="32" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="15" y1="13" x2="25" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="18" x2="25" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="23" x2="21" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="31" cy="31" r="7" fill="#646cff"/>
      <line x1="31" y1="27.5" x2="31" y2="34.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="27.5" y1="31" x2="34.5" y2="31" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export default function Home({ onNavigate }) {
  return (
    <div className="home">
      <h1>Home</h1>
      <p>Welcome to the IAM application.</p>

      <div className="home-apps">
        <button className="app-tile" onClick={() => onNavigate('recipes')}>
          <RecipesIcon />
          <span>Recipes</span>
        </button>
      </div>
    </div>
  )
}
