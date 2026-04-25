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

function FamilyTreeIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Root person */}
      <circle cx="20" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8"/>
      {/* Trunk line down from root */}
      <line x1="20" y1="11.5" x2="20" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      {/* Horizontal branch */}
      <line x1="10" y1="18" x2="30" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      {/* Left branch down */}
      <line x1="10" y1="18" x2="10" y2="24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      {/* Right branch down */}
      <line x1="30" y1="18" x2="30" y2="24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      {/* Left child */}
      <circle cx="10" cy="28" r="4" fill="none" stroke="currentColor" strokeWidth="1.6"/>
      {/* Right child */}
      <circle cx="30" cy="28" r="4" fill="none" stroke="currentColor" strokeWidth="1.6"/>
      {/* Left grandchild lines */}
      <line x1="10" y1="32" x2="10" y2="35.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="7" y1="35.5" x2="13" y2="35.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      {/* Right grandchild lines */}
      <line x1="30" y1="32" x2="30" y2="35.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="27" y1="35.5" x2="33" y2="35.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      {/* Leaf dots */}
      <circle cx="7" cy="37.5" r="1.8" fill="currentColor" opacity="0.6"/>
      <circle cx="13" cy="37.5" r="1.8" fill="currentColor" opacity="0.6"/>
      <circle cx="27" cy="37.5" r="1.8" fill="currentColor" opacity="0.6"/>
      <circle cx="33" cy="37.5" r="1.8" fill="currentColor" opacity="0.6"/>
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
        <button className="app-tile app-tile-family" onClick={() => onNavigate('familyTree')}>
          <FamilyTreeIcon />
          <span>Family Tree</span>
        </button>
      </div>
    </div>
  )
}
