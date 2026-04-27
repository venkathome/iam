import { useNavigate, useParams, Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import './Tamil.css'

export default function Tamil() {
  const { profileId } = useParams()
  const navigate = useNavigate()

  return (
    <div className="tamil-page">
      <Breadcrumb />
      <div className="tamil-hero">
        <h1 className="tamil-title">தமிழ்</h1>
        <p className="tamil-subtitle">Tamil Learning</p>
      </div>

      <div className="tamil-apps">
        <button
          className="tamil-tile"
          onClick={() => navigate(`/learning/${profileId}/tamil/thirukkural`)}
        >
          <div className="tamil-tile-icon">குறள்</div>
          <div className="tamil-tile-label">Thirukkural</div>
          <div className="tamil-tile-desc">1330 couplets · Thiruvalluvar · Tamil, transliteration &amp; English</div>
        </button>
      </div>
    </div>
  )
}
