import { useState } from 'react'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import FamilyTree from './pages/FamilyTree'

function App() {
  const [page, setPage] = useState('home')

  if (page === 'recipes') return <Recipes onBack={() => setPage('home')} />
  if (page === 'familyTree') return <FamilyTree onBack={() => setPage('home')} />
  return <Home onNavigate={setPage} />
}

export default App
