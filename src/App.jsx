import { useState } from 'react'
import Home from './pages/Home'
import Recipes from './pages/Recipes'

function App() {
  const [page, setPage] = useState('home')

  if (page === 'recipes') return <Recipes onBack={() => setPage('home')} />
  return <Home onNavigate={setPage} />
}

export default App
