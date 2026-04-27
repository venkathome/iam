import { Link, useLocation, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { GET_PROFILES } from '../apollo/queries'
import './Breadcrumb.css'

function buildCrumbs(pathname, profile) {
  if (pathname === '/') return [{ label: 'Home' }]

  const crumbs = [{ label: 'Home', to: '/' }]

  if (pathname.startsWith('/recipes')) {
    crumbs.push({ label: 'Recipes' })
  } else if (pathname.startsWith('/family-tree')) {
    crumbs.push({ label: 'Family Tree' })
  } else if (pathname.startsWith('/learning')) {
    const isProfilePicker = pathname === '/learning'
    crumbs.push({ label: 'Learning', to: isProfilePicker ? undefined : '/learning' })

    if (profile) {
      const name = profile.firstName + (profile.lastName ? ` ${profile.lastName}` : '')
      const onSpellings = pathname.endsWith('/spellings')
      const onTamil = pathname.endsWith('/tamil')
      const onThirukkural = pathname.endsWith('/thirukkural')

      const hasSubpage = onSpellings || onTamil || onThirukkural
      crumbs.push({
        label: name,
        to: hasSubpage ? `/learning/${profile.id}` : undefined,
      })

      if (onSpellings) {
        crumbs.push({ label: 'Spellings' })
      } else if (onTamil) {
        crumbs.push({ label: 'Tamil' })
      } else if (onThirukkural) {
        crumbs.push({ label: 'Tamil', to: `/learning/${profile.id}/tamil` })
        crumbs.push({ label: 'Thirukkural' })
      }
    }
  }

  return crumbs
}

export default function Breadcrumb({ inline = false }) {
  const { pathname } = useLocation()
  const { profileId } = useParams()
  const { data } = useQuery(GET_PROFILES, { skip: !profileId })
  const profile = profileId ? (data?.profiles ?? []).find(p => p.id === profileId) : null

  const crumbs = buildCrumbs(pathname, profile)

  return (
    <nav className={`breadcrumb${inline ? ' breadcrumb--inline' : ''}`} aria-label="breadcrumb">
      {crumbs.map((crumb, i) => (
        <span key={i} className="crumb-item">
          {i > 0 && <span className="crumb-sep">›</span>}
          {crumb.to
            ? <Link to={crumb.to} className="crumb-link">{crumb.label}</Link>
            : <span className="crumb-current">{crumb.label}</span>
          }
        </span>
      ))}
    </nav>
  )
}
