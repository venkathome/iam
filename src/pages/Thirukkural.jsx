import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BOOKS, CHAPTERS, KURALS } from '../data/thirukkural/index.js'
import './Thirukkural.css'

const TTS_ENDPOINT = 'http://localhost:4000/api/tts'

function useBrowserVoices() {
  const [voices, setVoices] = useState([])
  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    function load() {
      setVoices(window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('ta')))
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])
  return voices
}

function VoiceSelector({ voiceKey, onChange, browserVoices }) {
  return (
    <div className="voice-selector">
      <span className="voice-selector-label">Voice</span>
      <select value={voiceKey} onChange={e => onChange(e.target.value)}>
        <option value="google">Google TTS</option>
        {browserVoices.map(v => (
          <option key={v.name} value={v.name}>{v.name}</option>
        ))}
      </select>
    </div>
  )
}

function PlayButton({ text, voiceKey, browserVoices }) {
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'playing'
  const audioRef = useRef(null)
  const objectUrlsRef = useRef([])

  useEffect(() => {
    return () => stopAll()
  }, [])

  function stopAll() {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    objectUrlsRef.current.forEach(u => URL.revokeObjectURL(u))
    objectUrlsRef.current = []
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }

  async function fetchAudioUrl(line) {
    const res = await fetch(`${TTS_ENDPOINT}?text=${encodeURIComponent(line)}`)
    if (!res.ok) throw new Error('TTS failed')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    objectUrlsRef.current.push(url)
    return url
  }

  async function playGoogle(lines) {
    const urls = await Promise.all(lines.map(fetchAudioUrl))
    setStatus('playing')
    let i = 0
    function playNext() {
      if (i >= urls.length) { stopAll(); setStatus('idle'); return }
      const audio = new Audio(urls[i])
      audioRef.current = audio
      audio.onended = () => { i++; if (i < urls.length) setTimeout(playNext, 400); else { stopAll(); setStatus('idle') } }
      audio.onerror = () => { stopAll(); setStatus('idle') }
      audio.play()
    }
    playNext()
  }

  function playBrowser(lines) {
    window.speechSynthesis.cancel()
    const voice = browserVoices.find(v => v.name === voiceKey) ?? null
    let i = 0
    function speakNext() {
      if (i >= lines.length) { setStatus('idle'); return }
      const utt = new SpeechSynthesisUtterance(lines[i])
      utt.lang = 'ta-IN'
      utt.rate = 0.78
      utt.pitch = 0.95
      if (voice) utt.voice = voice
      utt.onend = () => { i++; if (i < lines.length) setTimeout(speakNext, 400); else setStatus('idle') }
      utt.onerror = () => setStatus('idle')
      window.speechSynthesis.speak(utt)
    }
    setStatus('playing')
    speakNext()
  }

  async function toggle() {
    if (status !== 'idle') { stopAll(); setStatus('idle'); return }

    const fullText = text.split('\n').map(l => l.trim()).filter(Boolean).join(' ')

    if (voiceKey === 'google') {
      setStatus('loading')
      try { await playGoogle([fullText]) }
      catch { stopAll(); setStatus('idle') }
    } else {
      playBrowser([fullText])
    }
  }

  return (
    <button
      className={`kural-play-btn${status === 'playing' ? ' kural-play-btn--playing' : ''}${status === 'loading' ? ' kural-play-btn--loading' : ''}`}
      onClick={toggle}
      title={status === 'playing' ? 'Stop' : status === 'loading' ? 'Loading…' : 'Listen in Tamil'}
      aria-label={status === 'playing' ? 'Stop' : 'Play Tamil pronunciation'}
    >
      {status === 'loading' ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="kural-spin">
          <path d="M7 1a6 6 0 1 1 0 12A6 6 0 0 1 7 1zm0 2a4 4 0 1 0 0 8A4 4 0 0 0 7 3z" opacity=".3"/>
          <path d="M13 7a6 6 0 0 0-6-6V1a7 7 0 0 1 7 7h-1z" opacity=".9"/>
        </svg>
      ) : status === 'playing' ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <rect x="2" y="2" width="4" height="10" rx="1"/>
          <rect x="8" y="2" width="4" height="10" rx="1"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <polygon points="3,2 12,7 3,12"/>
        </svg>
      )}
    </button>
  )
}

function KuralCard({ kural, voiceKey, browserVoices }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="kural-card">
      <div className="kural-card-header">
        <span className="kural-number">#{kural.number}</span>
        <PlayButton text={kural.tamil} voiceKey={voiceKey} browserVoices={browserVoices} />
      </div>
      <div className="kural-card-body">
        <div className="kural-tamil">{kural.tamil}</div>
        <div className="kural-transliteration">{kural.transliteration}</div>
        <div className="kural-english">{kural.english}</div>
        {expanded && (
          <div className="kural-explanation">{kural.explanation}</div>
        )}
        <button className="kural-toggle" onClick={() => setExpanded(e => !e)}>
          {expanded ? '▲ Hide explanation' : '▼ Show explanation'}
        </button>
      </div>
    </div>
  )
}

export default function Thirukkural() {
  const { profileId } = useParams()
  const [activeBook, setActiveBook] = useState(0)
  const [activeChapter, setActiveChapter] = useState(null)
  const [search, setSearch] = useState('')
  const [voiceKey, setVoiceKey] = useState('google')
  const browserVoices = useBrowserVoices()

  const filteredChapters = useMemo(() => {
    if (activeBook === 0) return CHAPTERS
    return CHAPTERS.filter(c => c.book === activeBook)
  }, [activeBook])

  const displayedKurals = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (q) {
      return KURALS.filter(k =>
        k.tamil.includes(search.trim()) ||
        k.transliteration.toLowerCase().includes(q) ||
        k.english.toLowerCase().includes(q) ||
        k.explanation.toLowerCase().includes(q) ||
        String(k.number).includes(q)
      )
    }
    if (activeChapter !== null) return KURALS.filter(k => k.chapter === activeChapter)
    if (activeBook !== 0) {
      const book = BOOKS.find(b => b.number === activeBook)
      return KURALS.filter(k => k.chapter >= book.chapters[0] && k.chapter <= book.chapters[1])
    }
    return KURALS.slice(0, 30)
  }, [search, activeChapter, activeBook])

  const isSearching = search.trim().length > 0

  function renderKurals(kurals) {
    return (
      <div className="kural-list">
        {kurals.map(k => (
          <KuralCard key={k.number} kural={k} voiceKey={voiceKey} browserVoices={browserVoices} />
        ))}
      </div>
    )
  }

  return (
    <div className="thirukkural-page">
      <div className="thirukkural-header">
        <Link to={`/learning/${profileId}/tamil`} className="back-link">← Tamil</Link>
        <h1>திருக்குறள்</h1>
        <p className="subtitle">Thirukkural · 1330 Kurals · Thiruvalluvar</p>
        <div className="thirukkural-search">
          <input
            type="text"
            placeholder="Search in Tamil, transliteration, or English…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <VoiceSelector voiceKey={voiceKey} onChange={setVoiceKey} browserVoices={browserVoices} />
      </div>

      <div className="thirukkural-body">
        {isSearching ? (
          <>
            <p className="search-info">
              {displayedKurals.length} result{displayedKurals.length !== 1 ? 's' : ''} for "{search.trim()}"
            </p>
            {displayedKurals.length === 0
              ? <div className="no-results">No kurals found.</div>
              : renderKurals(displayedKurals)
            }
          </>
        ) : (
          <div className="thirukkural-layout">
            <aside className="thirukkural-nav">
              <div className="book-tabs">
                <button
                  className={`book-tab${activeBook === 0 ? ' active' : ''}`}
                  onClick={() => { setActiveBook(0); setActiveChapter(null) }}
                >
                  All Books
                </button>
                {BOOKS.map(b => (
                  <button
                    key={b.number}
                    className={`book-tab${activeBook === b.number ? ' active' : ''}`}
                    onClick={() => { setActiveBook(b.number); setActiveChapter(null) }}
                  >
                    {b.tamil} · {b.english}
                  </button>
                ))}
              </div>
              <div className="chapter-list">
                {filteredChapters.map(ch => (
                  <button
                    key={ch.number}
                    className={`chapter-btn${activeChapter === ch.number ? ' active' : ''}`}
                    onClick={() => setActiveChapter(ch.number === activeChapter ? null : ch.number)}
                  >
                    <span className="ch-number">Chapter {ch.number}</span>
                    <span className="ch-tamil">{ch.tamil}</span>
                    <span className="ch-english">{ch.english}</span>
                  </button>
                ))}
              </div>
            </aside>

            <main className="thirukkural-content">
              {activeChapter === null && activeBook === 0 ? (
                <div className="chapter-prompt">
                  <div className="chapter-prompt-icon">திருக்குறள்</div>
                  <p>Select a book or chapter to begin reading</p>
                </div>
              ) : displayedKurals.length === 0 ? (
                <div className="no-results">No kurals found.</div>
              ) : renderKurals(displayedKurals)}
            </main>
          </div>
        )}
      </div>
    </div>
  )
}
