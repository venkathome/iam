import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
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

function LearningIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="20,6 36,14 20,22 4,14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <line x1="20" y1="6" x2="20" y2="22" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>
      <path d="M9 17 L9 28 Q9 33 20 33 Q31 33 31 28 L31 17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="36" y1="14" x2="36" y2="22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="36" cy="24" r="2" fill="currentColor" opacity="0.7"/>
    </svg>
  )
}

function DiaryIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* left cover */}
      <path d="M5 9 C5 7.3 6.3 6 8 6 L18 6 L18 34 L8 34 C6.3 34 5 32.7 5 31 Z"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* spine */}
      <line x1="18" y1="6" x2="22" y2="6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="18" y1="34" x2="22" y2="34" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="20" y1="6" x2="20" y2="34" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/>
      {/* right page */}
      <path d="M22 6 L32 6 C33.7 6 35 7.3 35 9 L35 31 C35 32.7 33.7 34 32 34 L22 34 Z"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* lines on right page */}
      <line x1="25" y1="13" x2="32" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="25" y1="18" x2="32" y2="18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="25" y1="23" x2="29" y2="23" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      {/* small heart on left page */}
      <path d="M11.5 19 C11.5 17.6 12.4 17 13.2 17 C13.8 17 14.3 17.3 14.5 17.7 C14.7 17.3 15.2 17 15.8 17 C16.6 17 17.5 17.6 17.5 19 C17.5 20.5 14.5 23 14.5 23 C14.5 23 11.5 20.5 11.5 19 Z"
        fill="currentColor" opacity="0.7"/>
    </svg>
  )
}

function FamilyTreeIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="20" y1="11.5" x2="20" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="10" y1="18" x2="30" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="10" y1="18" x2="10" y2="24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="30" y1="18" x2="30" y2="24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="10" cy="28" r="4" fill="none" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="30" cy="28" r="4" fill="none" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="10" y1="32" x2="10" y2="35.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="7" y1="35.5" x2="13" y2="35.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="30" y1="32" x2="30" y2="35.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="27" y1="35.5" x2="33" y2="35.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="7" cy="37.5" r="1.8" fill="currentColor" opacity="0.6"/>
      <circle cx="13" cy="37.5" r="1.8" fill="currentColor" opacity="0.6"/>
      <circle cx="27" cy="37.5" r="1.8" fill="currentColor" opacity="0.6"/>
      <circle cx="33" cy="37.5" r="1.8" fill="currentColor" opacity="0.6"/>
    </svg>
  )
}

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="home">
      <Breadcrumb />
      <h1>Home</h1>
      <p>Welcome to the IAM application.</p>

      <div className="home-apps">
        <button className="app-tile" onClick={() => navigate('/recipes')}>
          <RecipesIcon />
          <span>Recipes</span>
        </button>
        <button className="app-tile app-tile-family" onClick={() => navigate('/family-tree')}>
          <FamilyTreeIcon />
          <span>Family Tree</span>
        </button>
        <button className="app-tile app-tile-learning" onClick={() => navigate('/learning')}>
          <LearningIcon />
          <span>Learning</span>
        </button>
        <button className="app-tile app-tile-diary" onClick={() => navigate('/diary')}>
          <DiaryIcon />
          <span>Diary</span>
        </button>
      </div>
    </div>
  )
}
