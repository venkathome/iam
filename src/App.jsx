import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import FamilyTree from './pages/FamilyTree'
import Learning from './pages/Learning'
import Spellings from './pages/Spellings'
import Tamil from './pages/Tamil'
import Thirukkural from './pages/Thirukkural'
import Diary from './pages/Diary'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/family-tree" element={<FamilyTree />} />
      <Route path="/learning" element={<Learning />} />
      <Route path="/learning/:profileId" element={<Learning />} />
      <Route path="/learning/:profileId/spellings" element={<Spellings />} />
      <Route path="/learning/:profileId/tamil" element={<Tamil />} />
      <Route path="/learning/:profileId/tamil/thirukkural" element={<Thirukkural />} />
      <Route path="/diary" element={<Diary />} />
    </Routes>
  )
}

export default App
