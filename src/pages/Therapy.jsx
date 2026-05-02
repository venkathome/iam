import { useState, useEffect, useCallback } from 'react' // useEffect/useCallback used by ABASection
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { GET_PROFILES } from '../apollo/queries'
import Breadcrumb from '../components/Breadcrumb'
import { useTherapyProgress } from '../hooks/useTherapyProgress'
import {
  pdfUrl, filesUrl,
  VOCABULARY, READING_GRADES,
  WH_QUESTIONS, SOCIAL_SKILLS,
  FOLLOWING_DIRECTIONS, LANGUAGE_THERAPY,
  ABA_BUNDLES, cleanPdfName,
} from '../data/therapyData'
import './Therapy.css'

// Pre-computed key lists per section (used for tab stats)
const SECTION_KEYS = {
  vocabulary: VOCABULARY.flatMap(c => c.words.map(w => `vocab:${c.id}:${w}`)),
  reading:    READING_GRADES.flatMap(g => g.levels.map(l => l.file)),
  wh:         WH_QUESTIONS.flatMap(g => g.items.map(i => i.file)),
  social:     SOCIAL_SKILLS.flatMap(g => g.items.map(i => i.file)),
  directions: FOLLOWING_DIRECTIONS.map(i => i.file),
  language:   LANGUAGE_THERAPY.map(i => i.file),
  aba:        [],
}

const TABS = [
  { id: 'vocabulary',  label: 'Vocabulary'    },
  { id: 'reading',     label: 'Reading'       },
  { id: 'wh',          label: 'WH Questions'  },
  { id: 'social',      label: 'Social Skills' },
  { id: 'directions',  label: 'Directions'    },
  { id: 'language',    label: 'Language'      },
  { id: 'aba',         label: 'ABA Resources' },
  { id: 'altogether',  label: '⭐ Altogether'  },
]

// ── Shared components ─────────────────────────────────────────────────────────

function ProgressBadge({ pct, onCycle }) {
  const done = pct === 100
  return (
    <button
      className={`pbadge ${done ? 'pbadge--done' : pct > 0 ? 'pbadge--partial' : 'pbadge--empty'}`}
      onClick={e => { e.preventDefault(); e.stopPropagation(); onCycle() }}
      title={done ? 'Completed · click to reset' : pct > 0 ? `${pct}% · click to advance` : 'Not started · click to advance'}
    >
      {done ? (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <polyline points="2,6 4.5,8.5 9,2.5" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : pct > 0 ? (
        <span>{pct}</span>
      ) : null}
    </button>
  )
}

function PdfCard({ name, file, get, cycle }) {
  const pct  = get(file)
  const done = pct === 100
  return (
    <div className={`pdf-card${done ? ' pdf-card--done' : ''}`}>
      <a className="pdf-card-link" href={pdfUrl(file)} target="_blank" rel="noreferrer">
        <span className="pdf-card-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
            <line x1="7" y1="8"  x2="13" y2="8"  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <line x1="7" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <line x1="7" y1="14" x2="11" y2="14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M14 12 L20 12 M17 9 L20 12 L17 15" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="pdf-card-name">{name}</span>
      </a>
      <ProgressBadge pct={pct} onCycle={() => cycle(file)} />
    </div>
  )
}

function SectionGroup({ title, children }) {
  return (
    <div className="section-group">
      {title && <h3 className="section-group-title">{title}</h3>}
      <div className="pdf-grid">{children}</div>
    </div>
  )
}

// ── Vocabulary ────────────────────────────────────────────────────────────────

function VocabularySection({ get, toggle }) {
  const [highlight, setHighlight] = useState(null)

  return (
    <div className="vocab-section">
      <p className="section-desc">
        Tap a word to highlight it during naming practice. Tap the badge to mark it complete.
      </p>
      {VOCABULARY.map(cat => (
        <div key={cat.id} className="vocab-group">
          <h3 className="section-group-title" style={{ color: cat.color }}>{cat.label}</h3>
          <div className="word-chips">
            {cat.words.map(w => {
              const key  = `vocab:${cat.id}:${w}`
              const done = get(key) === 100
              const lit  = highlight === key
              return (
                <div
                  key={w}
                  className={`word-chip${done ? ' word-chip--done' : lit ? ' word-chip--lit' : ''}`}
                  style={{ '--chip-color': cat.color }}
                >
                  <button
                    className="word-chip-text"
                    onClick={() => setHighlight(prev => prev === key ? null : key)}
                  >
                    {w}
                  </button>
                  <button
                    className="word-chip-check"
                    onClick={() => toggle(key)}
                    title={done ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {done
                      ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <polyline points="2,5.5 4.2,8 8,2.5" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      : <span className="word-chip-dot" />
                    }
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Reading ───────────────────────────────────────────────────────────────────

function ReadingSection({ get, cycle, stats }) {
  const [gradeIdx, setGradeIdx] = useState(0)
  const grade = READING_GRADES[gradeIdx]

  return (
    <div className="reading-section">
      <p className="section-desc">K5 Learning leveled readers — select a grade then open a level.</p>
      <div className="grade-tabs">
        {READING_GRADES.map((g, i) => {
          const { done, total } = stats(g.levels.map(l => l.file))
          const allDone = total > 0 && done === total
          return (
            <button
              key={g.grade}
              className={`grade-tab${i === gradeIdx ? ' grade-tab--active' : ''}${allDone ? ' grade-tab--complete' : ''}`}
              style={{ '--grade-color': g.color }}
              onClick={() => setGradeIdx(i)}
            >
              {g.grade}
              <span className={`grade-tab-stat${allDone ? ' grade-tab-stat--done' : ''}`}>
                {done}/{total}
              </span>
            </button>
          )
        })}
      </div>
      <div className="level-grid">
        {grade.levels.map(l => {
          const pct  = get(l.file)
          const done = pct === 100
          return (
            <div key={l.level} className={`level-card${done ? ' level-card--done' : ''}`}
              style={{ '--grade-color': grade.color }}>
              <a className="level-card-link" href={pdfUrl(l.file)} target="_blank" rel="noreferrer">
                <span className="level-letter">{l.level}</span>
                <span className="level-label">Level {l.level}</span>
              </a>
              <ProgressBadge pct={pct} onCycle={() => cycle(l.file)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── WH Questions ──────────────────────────────────────────────────────────────

function WHSection({ get, cycle }) {
  return (
    <div>
      <p className="section-desc">WH question materials for comprehension and speech therapy.</p>
      {WH_QUESTIONS.map(g => (
        <SectionGroup key={g.group} title={g.group}>
          {g.items.map(item => (
            <PdfCard key={item.file} name={item.name} file={item.file} get={get} cycle={cycle} />
          ))}
        </SectionGroup>
      ))}
    </div>
  )
}

// ── Social Skills ─────────────────────────────────────────────────────────────

function SocialSection({ get, cycle }) {
  return (
    <div>
      <p className="section-desc">Pragmatic language and social skills activities.</p>
      {SOCIAL_SKILLS.map(g => (
        <SectionGroup key={g.group} title={g.group}>
          {g.items.map(item => (
            <PdfCard key={item.file} name={item.name} file={item.file} get={get} cycle={cycle} />
          ))}
        </SectionGroup>
      ))}
    </div>
  )
}

// ── Following Directions ──────────────────────────────────────────────────────

function DirectionsSection({ get, cycle }) {
  return (
    <div>
      <p className="section-desc">Following directions activities and worksheets.</p>
      <SectionGroup>
        {FOLLOWING_DIRECTIONS.map(item => (
          <PdfCard key={item.file} name={item.name} file={item.file} get={get} cycle={cycle} />
        ))}
      </SectionGroup>
    </div>
  )
}

// ── Language Therapy ──────────────────────────────────────────────────────────

function LanguageSection({ get, cycle }) {
  return (
    <div>
      <p className="section-desc">Complete school-age language therapy toolkit.</p>
      <SectionGroup>
        {LANGUAGE_THERAPY.map(item => (
          <PdfCard key={item.file} name={item.name} file={item.file} get={get} cycle={cycle} />
        ))}
      </SectionGroup>
    </div>
  )
}

// ── ABA Resources ─────────────────────────────────────────────────────────────

function ABASection({ get, cycle, stats }) {
  const [bundleId, setBundleId] = useState(ABA_BUNDLES[0].id)
  const [files, setFiles]       = useState([])
  const [loading, setLoading]   = useState(false)
  const [query, setQuery]       = useState('')

  const bundle = ABA_BUNDLES.find(b => b.id === bundleId)

  const loadFiles = useCallback(async (b) => {
    setLoading(true)
    setFiles([])
    try {
      const res  = await fetch(filesUrl(b.dir))
      const list = await res.json()
      setFiles(list)
    } catch {
      setFiles([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFiles(bundle)
    setQuery('')
  }, [bundleId])

  const filtered  = files.filter(f =>
    query.trim() === '' || f.toLowerCase().includes(query.toLowerCase())
  )

  const fileKeys  = files.map(f => `${bundle.dir}/${f}`)
  const { done: bundleDone, total: bundleTotal } = stats(fileKeys)

  return (
    <div className="aba-section">
      <p className="section-desc">Large ABA resource bundles — select a collection then search by keyword.</p>

      <div className="aba-bundles">
        {ABA_BUNDLES.map(b => {
          const { done, total } = stats(files.map(f => `${b.dir}/${f}`))
          const allDone = total > 0 && done === total
          return (
            <button
              key={b.id}
              className={`aba-bundle-btn${b.id === bundleId ? ' aba-bundle-btn--active' : ''}${allDone ? ' aba-bundle-btn--complete' : ''}`}
              style={{ '--bundle-color': b.color }}
              onClick={() => setBundleId(b.id)}
            >
              <span className="aba-bundle-name">{b.name}</span>
              <span className="aba-bundle-count">{b.count} PDFs</span>
            </button>
          )
        })}
      </div>

      <div className="aba-search-row">
        <input
          className="aba-search"
          type="text"
          placeholder="Search PDFs…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {!loading && files.length > 0 && (
          <span className="aba-count">
            {filtered.length !== files.length
              ? `${filtered.length} of ${files.length}`
              : `${files.length} files`
            }
            {bundleDone > 0 && (
              <span className="aba-done-count"> · {bundleDone}/{bundleTotal} done</span>
            )}
          </span>
        )}
      </div>

      {loading ? (
        <p className="aba-loading">Loading…</p>
      ) : (
        <div className="pdf-grid">
          {filtered.map(f => {
            const fileKey = `${bundle.dir}/${f}`
            return (
              <PdfCard
                key={f}
                name={cleanPdfName(f)}
                file={fileKey}
                get={get}
                cycle={cycle}
              />
            )
          })}
          {!loading && filtered.length === 0 && query && (
            <p className="aba-empty">No results for "{query}"</p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Altogether data ───────────────────────────────────────────────────────────
// ALL content sourced directly from Diya's therapy PDFs (21 PDFs total):
//   Riddles    → Items in the Fridge.rtf / Things in house.rtf (vocabulary)
//   WH Stories → "WH Question Stories with Illustrations.pdf" (standalone)
//                "Answering WH Questions From Short Text" (LT #10)
//                "Around the Community - WH Questions.pdf" (standalone)
//                WH Bundle #3 "Real Pictures WH Questions" (multiple choice)
//                WH Bundle #5 "Simple Dry Erase Flip Books" (answer banks)
//   Social     → OCR: Conversation Turn-Taking & Balance
//                OCR: Identifying and Using Sarcasm
//                OCR: Identifying Feelings & Emotions in Social Situations
//                OCR: Using Body Language to Identify Emotion
//                OCR: Conversational Responses Questions & Comments
//                OCR: Conversation Scripts Role Play Scenarios (#4)
//   Sequence   → OCR: Sequencing for Story Retell 3-6 Steps (LT #16)
//   Word Play  → "Daily Phonological Awareness Questions" (LT #26)
//                "Prefix + Suffix Activities" (LT #23)
//                "Early Describing and Categorizing Packet" (LT #27)
//                "Vocabulary Worksheets" (LT #21)
//                "One Sheet Real Picture Describing" (LT #24)
//   Directions → "Following Direction Task Cards to Get Your Students Moving"
//   Story      → "Summarizing Stories — Somebody Wanted But So Then" (LT #08)
//                "Identifying Story Grammar Parts — Expansion Pack" (LT #11)
//                "Learning Story Grammar Parts in Narratives" (LT #15)
//                "Creating Narratives with Real Pictures" (LT #17)
//   Sentences  → "Systematic Sentence Combining" (LT #01)
//                "Describing and Defining" (LT #20)

const ALTOGETHER_CATS = [
  { id: 'all',        label: 'All' },
  { id: 'riddles',    label: '🔍 Riddles' },
  { id: 'wh',         label: '❓ WH Questions' },
  { id: 'social',     label: '🤝 Social Skills' },
  { id: 'sequence',   label: '📋 Story Order' },
  { id: 'wordplay',   label: '🔤 Word Play' },
  { id: 'directions', label: '👆 Directions' },
  { id: 'story',      label: '📖 Story Skills' },
  { id: 'sentence',   label: '✏️ Sentences' },
]

// Vocabulary sourced directly from Items in the Fridge.rtf
const ALTOGETHER = [
  // ── Riddles: fridge vocabulary (Items in the Fridge.rtf) ─────────────────
  { id: 'r1',  cat: 'riddles', type: 'riddle', emoji: '🍉',
    question: "I'm green on the outside and red and juicy on the inside. I'm full of black seeds and live in the fridge. What am I?",
    answer: 'Watermelon' },
  { id: 'r2',  cat: 'riddles', type: 'riddle', emoji: '🍲',
    question: "I'm a warm, golden South Indian lentil soup. I'm served with rice or idli and I come from the fridge after dinner. What am I?",
    answer: 'Sambar' },
  { id: 'r3',  cat: 'riddles', type: 'riddle', emoji: '🍅',
    question: "I'm red and round. I grow on a vine. Science calls me a fruit, but everyone cooks me as a vegetable. What am I?",
    answer: 'Tomato' },
  { id: 'r4',  cat: 'riddles', type: 'riddle', emoji: '🍌',
    question: "I'm yellow and curved. Peel me before you eat me. Monkeys are my biggest fans! What am I?",
    answer: 'Banana' },
  { id: 'r5',  cat: 'riddles', type: 'riddle', emoji: '🍇',
    question: "I grow in bunches on a vine. I'm small and round — green or purple. I live in the fridge. What am I?",
    answer: 'Grapes' },
  { id: 'r6',  cat: 'riddles', type: 'riddle', emoji: '🍫',
    question: "I'm brown, sweet, and melt in your mouth. I can be a bar, a chip, or a drink. Everyone loves me! What am I?",
    answer: 'Chocolate' },
  { id: 'r7',  cat: 'riddles', type: 'riddle', emoji: '🍓',
    question: "I'm small, red, and heart-shaped. Sweet and a little tangy. I live in the fridge and go great with cream. What am I?",
    answer: 'Strawberry' },
  { id: 'r8',  cat: 'riddles', type: 'riddle', emoji: '🫐',
    question: "I'm tiny, round, and blue-purple. I grow in clusters. I'm great in smoothies and muffins. What am I?",
    answer: 'Blueberry' },
  { id: 'r9',  cat: 'riddles', type: 'riddle', emoji: '🍆',
    question: "I'm purple and shiny. I look a bit like a big egg! I'm used in Indian curries. What am I?",
    answer: 'Eggplant' },
  { id: 'r10', cat: 'riddles', type: 'riddle', emoji: '🥟',
    question: "I'm a triangular fried snack stuffed with spiced potatoes. A popular Indian treat. What am I?",
    answer: 'Samosa' },
  { id: 'r11', cat: 'riddles', type: 'riddle', emoji: '🫓',
    question: "I'm soft and flat, made from flour, cooked on a tawa. I'm eaten with dal or curry. What am I?",
    answer: 'Roti' },
  { id: 'r12', cat: 'riddles', type: 'riddle', emoji: '🍦',
    question: "I'm cold, sweet, and creamy. You scoop me into a bowl or cone. Perfect on a hot day! What am I?",
    answer: 'Ice Cream' },
  { id: 'r13', cat: 'riddles', type: 'riddle', emoji: '🎃',
    question: "I'm big and orange. People carve faces on me for Halloween. I'm also a delicious soup! What am I?",
    answer: 'Pumpkin' },
  { id: 'r14', cat: 'riddles', type: 'riddle', emoji: '🍞',
    question: "I come in a loaf. You toast me in the morning. Spread butter or jam on me. What am I?",
    answer: 'Bread' },
  { id: 'r15', cat: 'riddles', type: 'riddle', emoji: '🫙',
    question: "I'm sweet and sticky. I come in a jar. Spread me on bread or roti. What am I?",
    answer: 'Jam' },

  // ── Riddles: living room vocabulary (Things in house.rtf) ────────────────
  { id: 'r16', cat: 'riddles', type: 'riddle', emoji: '📺',
    question: "I'm a big flat screen on the wall. You watch your favourite shows and movies on me. What am I?",
    answer: 'TV' },
  { id: 'r17', cat: 'riddles', type: 'riddle', emoji: '🛋️',
    question: "I'm soft and long. The whole family can sink into me to relax. I'm in the living room. What am I?",
    answer: 'Sofa' },
  { id: 'r18', cat: 'riddles', type: 'riddle', emoji: '🔊',
    question: "I'm a small smart speaker. You talk to me and I play music, answer questions, or set timers. What am I?",
    answer: 'Amazon Echo' },
  { id: 'r19', cat: 'riddles', type: 'riddle', emoji: '🪑',
    question: "I have four legs but can't walk. One person sits on me. I'm in the living room. What am I?",
    answer: 'Chair' },
  { id: 'r20', cat: 'riddles', type: 'riddle', emoji: '🔥',
    question: "I'm in the living room. On cold nights, a warm fire burns inside me. What am I?",
    answer: 'Fireplace' },

  // ── WH Questions — sourced from "WH Question Stories with Illustrations.pdf" ──
  { id: 'wh1', cat: 'wh', type: 'wh', wh: 'WHO',
    story: "Katie and Madison are at the beach. They are building a sandcastle. Katie wants to put seashells on the sandcastle. She looks under a bucket for seashells. 'Eek!' Katie screams. There is something under the bucket!",
    question: "WHO is under the bucket?",
    answer: "A crab! 🦀",
    explanation: "Katie screams because she finds a crab hiding under the bucket instead of seashells." },
  { id: 'wh2', cat: 'wh', type: 'wh', wh: 'WHERE',
    story: "Josh and Derek are playing in Derek's backyard. They are catching butterflies. Derek catches butterflies in a net. Josh catches butterflies in a jar. They look at the butterflies for a while. Then, they let them fly away into the sky.",
    question: "WHERE does Josh keep the butterflies he catches?",
    answer: "In a jar! 🫙",
    explanation: "Derek uses a net and Josh uses a jar — two different ways to catch the same things." },
  { id: 'wh3', cat: 'wh', type: 'wh', wh: 'WHAT',
    story: "Sarah and Noah are in the play room. Sarah is playing with a cat puppet. Noah's cat Whiskers walks over. She stands on the rug and looks at Sarah. Whiskers wants to play with the cat puppet too. She brings something over.",
    question: "WHAT does Whiskers bring over?",
    answer: "A ball of yarn! 🧶",
    explanation: "Whiskers the real cat wants to join the play — she brings yarn because she wants to play too." },
  { id: 'wh4', cat: 'wh', type: 'wh', wh: 'WHO',
    story: "The farmer was stacking hay. He put the hay into a big pile. Now the farmer is finished. He wants to get in his tractor and drive home. But something is in the way — it will not move!",
    question: "WHO is standing in front of the tractor?",
    answer: "A cow! 🐄",
    explanation: "A cow is blocking the farmer's path home. The cow won't move out of the way!" },
  { id: 'wh5', cat: 'wh', type: 'wh', wh: 'WHAT',
    story: "The children are ice skating on the lake. A little girl has a toy penguin. The other children are very surprised when they see it. The little girl puts her toy penguin on the ice. She holds his hand and pulls him along.",
    question: "WHAT is the toy penguin wearing that surprises everyone?",
    answer: "Real skates! ⛸️",
    explanation: "Everyone is surprised because the toy penguin is wearing actual ice skates — just like a real skater!" },
  { id: 'wh6', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "The class is outside at recess. They forgot to lock the mouse cage. The mouse gets out! He starts to crawl around the room. The mouse sniffs a backpack carefully.",
    question: "WHY is the mouse sniffing the backpack?",
    answer: "He is hungry and looking for food! 🐭",
    explanation: "The mouse escaped and is searching for something to eat by following the smell of food in the bags." },
  { id: 'wh7', cat: 'wh', type: 'wh', wh: 'WHO',
    story: "Kevin is reading in the living room. Anna wants to read a book too. There is a stack of books on the rug. Anna decides to choose a book. But there is something resting on top of all the books!",
    question: "WHO is sleeping on top of the books?",
    answer: "Kevin's cat! 🐱",
    explanation: "Anna can't reach the books easily because Kevin's cat has found a cozy spot right on top of them." },
  { id: 'wh8', cat: 'wh', type: 'wh', wh: 'WHERE',
    story: "George and Mason are swimming in the lake. They are having fun. Mason sees something green. 'Oh no, it’s a sea monster!' he yells. George laughs. 'It’s not a sea monster,' George says.",
    question: "WHERE is the frog that George can see?",
    answer: "On a lilypad! 🐸",
    explanation: "What looked like a scary sea monster to Mason was actually just a small frog sitting on a lilypad." },
  { id: 'wh9', cat: 'wh', type: 'wh', wh: 'WHERE',
    story: "The children are outside flying kites. The wind blows one kite away. It sails through the air and then lands somewhere unexpected. The dog runs around in circles and gets all tangled up in the kite string.",
    question: "WHERE does the kite land?",
    answer: "On the dog! 🐕",
    explanation: "The wind sends the kite straight onto the dog, who then runs around tangled in the string." },
  { id: 'wh10', cat: 'wh', type: 'wh', wh: 'WHO',
    story: "Today is Saturday. The children are playing in the backyard. Blake goes down the slide and will play on the swings next. Another boy named Jack is too tired to play. He finds a blanket and lies down.",
    question: "WHO takes a nap in the backyard?",
    answer: "Jack! 😴",
    explanation: "While Blake slides and swings, Jack is too tired to join in, so he curls up with a blanket for a nap." },
  { id: 'wh11', cat: 'wh', type: 'wh', wh: 'WHAT',
    story: "The boys are playing in the mud. They are pretending to dig for buried treasure. Ian finds something and puts it into his bucket. 'Did you find treasure?', the boys ask. Ian looks inside. It is not gold.",
    question: "WHAT did Ian actually find in the mud?",
    answer: "A snail! 🐌",
    explanation: "Ian thought he found treasure but it was really a snail — the boys were disappointed but it made a funny story!" },
  { id: 'wh12', cat: 'wh', type: 'wh', wh: 'WHAT',
    story: "Kelly is in the bathroom brushing her teeth. Oh no! Kelly drops the toothpaste on the floor. Now there is toothpaste on the floor. Kelly needs to clean up the mess.",
    question: "WHAT will Kelly use to clean up the mess?",
    answer: "A cloth! 🧹",
    explanation: "Kelly needs to get a cloth or rag to wipe up the toothpaste she spilled on the bathroom floor." },

  // ── WH Questions — sourced from "Answering WH Questions From Short Text" (LT Toolkit #10) ──
  { id: 'wh13', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "TIME FOR A WALK — One sunny Saturday morning, Jared decided to go for a walk. Normally he would spend the whole weekend in his room playing video games, but he wanted to make a change. He decided to enjoy some fresh air and nature. He saw birds, cool plants, and a tall colourful tree — and walked all the way to a park!",
    question: "WHY did Jared go for a walk instead of playing video games?",
    answer: "Because he wanted to be healthier! 🌳",
    explanation: "Jared made a positive choice to change his routine and enjoy fresh air and nature for his health." },
  { id: 'wh14', cat: 'wh', type: 'wh', wh: 'WHAT',
    story: "THE WINTER ROAD TRIP — The Anderson family took their yearly trip to Colorado in winter to see the snow and mountains. They stayed in a cabin in the woods. It was a 14-hour drive. The kids, Isaiah and Makayla, kept busy by playing 'I Spy' out the window.",
    question: "WHAT did Makayla see on the long drive to Colorado?",
    answer: "A black bear! 🐻",
    explanation: "While looking out the window during their long road trip, Makayla spotted an actual black bear — quite an exciting sight!" },
  { id: 'wh15', cat: 'wh', type: 'wh', wh: 'HOW',
    story: "MUSEUM DAY — Amy woke up and jumped out of bed — it was Saturday and she was going to the history museum with her friends! She has always loved fossils and history. Once there, everyone split into groups of four. Amy brought her camera and took lots of photos. When she got home, she had a special project waiting.",
    question: "HOW will Amy remember her fun museum day?",
    answer: "By making a scrapbook! 📸",
    explanation: "Amy took photos at the museum and turned them into a scrapbook so she'd always remember the memories." },
  { id: 'wh16', cat: 'wh', type: 'wh', wh: 'HOW',
    story: "ANDY AND JONAH — Andy couldn't wait for the school day to end. It was Friday and he had plans with his best friend Jonah — the skate park, the ice-cream shop, then a sleepover. Finally the last bell rang! They celebrated at the skate park by sharing a huge dish of chocolate cookie dough ice cream.",
    question: "HOW did Andy and Jonah get to the skate park?",
    answer: "They took the bus! 🚌",
    explanation: "The two friends hopped on a public bus together to travel from school to the skate park." },
  { id: 'wh17', cat: 'wh', type: 'wh', wh: 'HOW',
    story: "TRYOUTS — Henry promised his mom he would try out for every sports team at school. On Friday, August 2nd he tried soccer, basketball, and football — but didn't make any of them. At the last minute he decided to try one more sport. He ran to the locker room afterwards and looked at a list on the door.",
    question: "HOW did Henry find out he made the volleyball team?",
    answer: "He saw his name on the list! 📋",
    explanation: "After tryouts, Henry ran to the locker room door where the list of selected players was posted — and his name was on it!" },
  { id: 'wh18', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "SELLING LEMONADE — On a very hot summer day in July, William suddenly had a great idea. He set up a stand outside his house selling his mom's famous Sweet Strawberry Lemonade. By the end of the day he had made enough money to get what he wanted.",
    question: "WHY did William want to make money selling lemonade?",
    answer: "To buy a new game he'd been wanting! 🎮",
    explanation: "William came up with a clever plan to earn money himself rather than just asking — and it worked!" },
  { id: 'wh19', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "A BAD DAY — King had a really tough day. He was late to his first class, spilled juice on his clothes at lunch, and missed his bus so he had to walk home. All he wanted was a warm shower and sleep — but first he needed to sit at his desk and finish his homework, even when he felt like giving up.",
    question: "WHY did King have such a hard day?",
    answer: "He was late to class, spilled juice on himself, and missed his bus! 😤",
    explanation: "A series of unlucky events piled up on King — but even then he finished his homework, which shows great responsibility." },
  { id: 'wh20', cat: 'wh', type: 'wh', wh: 'HOW',
    story: "GAME NIGHT — Fred normally comes home from school, does homework, plays video games alone, and goes to sleep. His parents talked to him about spending more time with the family. Fred decided to skip video games and play a board game instead. He walked to the game closet to choose one.",
    question: "HOW did Fred pick which board game to play?",
    answer: "He closed his eyes and pointed to a random game! 🎲",
    explanation: "Fred made a fun, random choice by closing his eyes and pointing — the game turned out to be Monopoly, his family's favourite!" },

  // ── Social Skills (Social Skills Bundle: turn-taking, sarcasm, emotions, body language) ──
  { id: 's1', cat: 'social', type: 'choice',
    question: "Your friend is excitedly telling you about their favourite show. What is the BEST thing to do?",
    options: ["Look at your phone 📱", "Listen, nod, and ask a question 👍", "Interrupt and talk about your own show", "Walk away"],
    correct: 1,
    explanation: "Good listeners make eye contact, nod, and ask follow-up questions — this is turn-taking! 🎯" },
  { id: 's2', cat: 'social', type: 'choice',
    question: "Diya wants the TV remote, but her sibling is already watching. What should she do?",
    options: ["Grab it from them!", "\"Can I please have a turn when you're done?\" 😊", "Start crying loudly", "Turn the TV off"],
    correct: 1,
    explanation: "Asking politely with 'please' and waiting for your turn is always the right first step! 🌟" },
  { id: 's3', cat: 'social', type: 'choice',
    question: "A classmate walks in with droopy eyes and a big frown. How do they probably FEEL?",
    options: ["Happy and excited 😊", "Silly and playful 😜", "Sad or very tired 😢", "Hungry 🍕"],
    correct: 2,
    explanation: "Droopy eyes and a frown are body language clues for sadness or tiredness — reading faces matters!" },
  { id: 's4', cat: 'social', type: 'choice',
    question: "It's pouring rain. Dad says: \"Oh GREAT — perfect weather for our picnic!\" Is Dad being…?",
    options: ["Serious — he really loves rain", "Sarcastic — saying the opposite to be funny 😂", "Confused about the weather", "Angry 😡"],
    correct: 1,
    explanation: "Sarcasm = saying the OPPOSITE of what you mean, often with a funny or exaggerated tone." },
  { id: 's5', cat: 'social', type: 'choice',
    question: "Diya feels frustrated during a hard worksheet. What should she try FIRST?",
    options: ["Crumple the worksheet 😤", "Take three slow deep breaths 🌬️", "Scream loudly 😱", "Give up and go home"],
    correct: 1,
    explanation: "Deep breathing calms the nervous system so we can think clearly and try again! 💪" },
  { id: 's6', cat: 'social', type: 'choice',
    question: "Your friend just shared some exciting news. The BEST response is:",
    options: ["\"Whatever.\"", "\"Wow, tell me more! That's amazing!\" 🌟", "Change the subject to yourself", "Ignore them and check your phone"],
    correct: 1,
    explanation: "Showing genuine interest keeps the conversation going and makes your friend feel valued!" },
  { id: 's7', cat: 'social', type: 'choice',
    question: "Diya accidentally bumps into someone in the hallway. What should she say?",
    options: ["Nothing — keep walking", "\"I'm sorry! Are you okay?\" 😊", "Laugh at them", "Run away quickly"],
    correct: 1,
    explanation: "Apologising right away shows responsibility and empathy — two key social skills!" },
  { id: 's8', cat: 'social', type: 'choice',
    question: "Someone holds the door open for Diya. What should she do?",
    options: ["Walk through without a word", "Say \"Thank you!\" and smile 😊", "Ask why they're holding it", "Shake their hand formally"],
    correct: 1,
    explanation: "A simple 'Thank you' is polite, warm, and makes everyone feel good!" },
  { id: 's9', cat: 'social', type: 'choice',
    question: "Diya disagrees with what her friend said. The BEST way to handle it is:",
    options: ["Yell \"You're WRONG!\"", "\"I see it a bit differently — I think…\" 🤔", "Sulk and go silent", "Tell another friend behind their back"],
    correct: 1,
    explanation: "Sharing disagreement calmly with 'I think…' keeps the friendship strong and conversation going." },

  // ── Story Sequences (Language Therapy Toolkit: sequencing for story retell) ──
  { id: 'seq1', cat: 'sequence', type: 'sequence', emoji: '🍞',
    title: "Diya Makes Toast with Jam",
    scrambled: ["Spread jam on the toast 🍓", "Get two slices of bread 🍞", "Wait for it to pop up ⏱️", "Take a yummy bite! 😋", "Put the bread in the toaster 🔌"],
    answer:    ["Get two slices of bread 🍞", "Put the bread in the toaster 🔌", "Wait for it to pop up ⏱️", "Spread jam on the toast 🍓", "Take a yummy bite! 😋"] },
  { id: 'seq2', cat: 'sequence', type: 'sequence', emoji: '☀️',
    title: "Diya's Morning Routine",
    scrambled: ["Eat breakfast 🥣", "Get dressed 👗", "Wake up 😴", "Go to school 🎒", "Brush teeth 🪥"],
    answer:    ["Wake up 😴", "Brush teeth 🪥", "Get dressed 👗", "Eat breakfast 🥣", "Go to school 🎒"] },
  { id: 'seq3', cat: 'sequence', type: 'sequence', emoji: '🌳',
    title: "A Trip to the Park",
    scrambled: ["Play on the swings 🎡", "Put on shoes 👟", "Drink water when thirsty 💧", "Walk to the park 🚶", "Walk back home 🏠"],
    answer:    ["Put on shoes 👟", "Walk to the park 🚶", "Play on the swings 🎡", "Drink water when thirsty 💧", "Walk back home 🏠"] },
  { id: 'seq4', cat: 'sequence', type: 'sequence', emoji: '🌙',
    title: "Diya's Bedtime Routine",
    scrambled: ["Put on pyjamas 👕", "Read a bedtime story 📖", "Go to sleep 😴", "Take a bath 🛁", "Brush teeth 🪥"],
    answer:    ["Take a bath 🛁", "Put on pyjamas 👕", "Brush teeth 🪥", "Read a bedtime story 📖", "Go to sleep 😴"] },
  { id: 'seq5', cat: 'sequence', type: 'sequence', emoji: '🍲',
    title: "Putting Away Leftover Sambar",
    scrambled: ["Put the container in the fridge 🧊", "Wait for it to cool down a little ⏳", "Find a clean container with a lid 🥡", "Pour the sambar in 🍲", "Label it with the date 🗓️"],
    answer:    ["Find a clean container with a lid 🥡", "Pour the sambar in 🍲", "Wait for it to cool down a little ⏳", "Label it with the date 🗓️", "Put the container in the fridge 🧊"] },
  { id: 'seq6', cat: 'sequence', type: 'sequence', emoji: '🛒',
    title: "A Quick Trip to the Store",
    scrambled: ["Pay for your items 💳", "Put on shoes and grab a bag 👟", "Find everything on the list 🛒", "Write a shopping list 📝", "Head back home 🏠"],
    answer:    ["Write a shopping list 📝", "Put on shoes and grab a bag 👟", "Find everything on the list 🛒", "Pay for your items 💳", "Head back home 🏠"] },
  { id: 'seq7', cat: 'sequence', type: 'sequence', emoji: '🤝',
    title: "Meeting Someone New",
    scrambled: ["Shake hands or wave 🤝", "Walk over and smile 😊", "Ask them a question to keep talking 💬", "Say your name 👋", "Listen to their name"],
    answer:    ["Walk over and smile 😊", "Say your name 👋", "Shake hands or wave 🤝", "Listen to their name", "Ask them a question to keep talking 💬"] },

  // ── Word Play — sourced from "Daily Phonological Awareness Questions" (LT Toolkit #26) ──
  // Questions taken verbatim from the January–February daily challenges (Levels 1–3)
  { id: 'wp1', cat: 'wordplay', type: 'wordplay', emoji: '🎵',
    question: "RHYME — Name a word that rhymes with 'way'.",
    answer: "day, say, play, may, bay, hay, ray, pay… 🎵\n(Any real word that ends with the -ay sound!)" },
  { id: 'wp2', cat: 'wordplay', type: 'wordplay', emoji: '👏',
    question: "SYLLABLES — How many syllables are in the word 'basketball'?",
    answer: "3 syllables! bas · ket · ball 👏👏👏",
    visual: ['bas', 'ket', 'ball'] },
  { id: 'wp3', cat: 'wordplay', type: 'wordplay', emoji: '🔤',
    question: "FIRST SOUND — What is the first sound in the word 'boy'?",
    answer: "/b/ — the word 'boy' starts with the /b/ sound 🔤" },
  { id: 'wp4', cat: 'wordplay', type: 'wordplay', emoji: '🔤',
    question: "LAST SOUND — What is the last sound in the word 'dog'?",
    answer: "/g/ — the word 'dog' ends with the /g/ sound 🐕" },
  { id: 'wp5', cat: 'wordplay', type: 'wordplay', emoji: '🧩',
    question: "BLENDING — What word is this? c – a – t",
    answer: "CAT! 🐱\nBlending the sounds /k/ + /a/ + /t/ = 'cat'" },
  { id: 'wp6', cat: 'wordplay', type: 'wordplay', emoji: '➕',
    question: "ADD A SOUND — Say 'top'. Now add /s/ to the beginning. What new word do you make?",
    answer: "STOP! 🛑\nAdding /s/ to the front of 'top' makes the new word 'stop'." },
  { id: 'wp7', cat: 'wordplay', type: 'wordplay', emoji: '✂️',
    question: "DELETE A SOUND — Say 'feet' without the /f/. What word is left?",
    answer: "EAT! 🍽️\nTaking /f/ off the front of 'feet' leaves just 'eat'." },
  { id: 'wp8', cat: 'wordplay', type: 'wordplay', emoji: '🔄',
    question: "CHANGE A SOUND — Say 'bat'. Now change /b/ to /h/. What new word?",
    answer: "HAT! 🎩\nSwapping the first sound from /b/ to /h/ turns 'bat' into 'hat'." },
  { id: 'wp9', cat: 'wordplay', type: 'wordplay', emoji: '🎵',
    question: "RHYME — Name a word that rhymes with 'map'.",
    answer: "cap, clap, gap, nap, rap, sap, tap, zap, snap, trap… 🎵\n(Any real word that ends with the -ap sound!)" },
  { id: 'wp10', cat: 'wordplay', type: 'wordplay', emoji: '🔢',
    question: "SEGMENT — Tell me all the sounds in the word 'hand'.",
    answer: "/h/ – /a/ – /n/ – /d/ — four sounds! ✋\n(Notice 'hand' has 4 letters AND 4 sounds.)" },
  { id: 'wp11', cat: 'wordplay', type: 'wordplay', emoji: '👏',
    question: "SYLLABLES — How many syllables are in the word 'January'?",
    answer: "4 syllables! Jan · u · ar · y 👏👏👏👏",
    visual: ['Jan', 'u', 'ar', 'y'] },
  { id: 'wp12', cat: 'wordplay', type: 'wordplay', emoji: '🧩',
    question: "BLENDING — What word is this? t – ab",
    answer: "TAB! 🏷️\nBlending the onset /t/ with the rime '-ab' makes 'tab'." },
  { id: 'wp13', cat: 'wordplay', type: 'wordplay', emoji: '➕',
    question: "ADD A SOUND — Say 'ox'. Now add /b/ to the beginning. What new word?",
    answer: "BOX! 📦\nAdding /b/ to the front of 'ox' makes the new word 'box'." },
  { id: 'wp14', cat: 'wordplay', type: 'wordplay', emoji: '🔄',
    question: "CHANGE A SOUND — Say 'fed'. Now change /f/ to /b/. What new word?",
    answer: "BED! 🛏️\nSwapping /f/ for /b/ at the start turns 'fed' into 'bed'." },
  { id: 'wp15', cat: 'wordplay', type: 'wordplay', emoji: '👏',
    question: "SYLLABLES — How many syllables are in 'alligator'?",
    answer: "4 syllables! al · li · ga · tor 👏👏👏👏",
    visual: ['al', 'li', 'ga', 'tor'] },

  // ── Following Directions — sourced from "Action Directions! Task Cards" PDF ──
  // Cards use: actions, body parts, colours, shapes, animals, temporal terms
  { id: 'd1', cat: 'directions', type: 'directions', emoji: '👆',
    instruction: "Three steps — do them in order:\n\n1️⃣ Touch your toes\n2️⃣ Touch your nose\n3️⃣ Say your favourite colour out loud!",
    confirmText: "I did all 3! ✓" },
  { id: 'd2', cat: 'directions', type: 'directions', emoji: '🐰',
    instruction: "Two silly steps:\n\n1️⃣ Hop like a bunny three times\n2️⃣ Then spin around once and sit back down",
    confirmText: "Hop, spin, sit! ✓" },
  { id: 'd3', cat: 'directions', type: 'directions', emoji: '⏰',
    instruction: "TEMPORAL direction — listen carefully!\n\nBEFORE you jump twice, clap your hands 3 times.\n\n(Do the clapping first!)",
    confirmText: "Clap 3 times, then jump! ✓" },
  { id: 'd4', cat: 'directions', type: 'directions', emoji: '🎭',
    instruction: "Pretend play — two steps:\n\n1️⃣ Pretend you're swimming for 5 seconds 🏊\n2️⃣ Then pretend to eat ice cream 🍦",
    confirmText: "Swim, then ice cream! ✓" },
  { id: 'd5', cat: 'directions', type: 'directions', emoji: '🎯',
    instruction: "Do ONLY the SECOND action in this list:\n\nA) Run in place\nB) Raise one hand and say your name 🙋\nC) Make a silly face",
    confirmText: "I raised my hand and said my name! ✓" },
  { id: 'd6', cat: 'directions', type: 'directions', emoji: '🔁',
    instruction: "TEMPORAL direction:\n\nAFTER you count to 3 out loud, stand up.\nTHEN point to your shoulder, then sit back down.",
    confirmText: "Count, stand, shoulder, sit! ✓" },
  { id: 'd7', cat: 'directions', type: 'directions', emoji: '🤫',
    instruction: "Do these QUIETLY with no talking:\n\n1️⃣ Point to something you can sit on\n2️⃣ Point to something that gives light\n3️⃣ Give a thumbs up 👍",
    confirmText: "Done quietly! ✓" },

  // ── WH Questions — Community Scenes ("Around the Community - WH Questions.pdf") ──
  { id: 'wh21', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "GROCERY STORE — You are at the grocery store. A worker is wearing a nametag and an apron. There are baskets and carts available. The produce section has a scale for weighing fruits and vegetables. The cashier hands you a paper after you pay.",
    question: "WHY do we get a receipt from the cashier?",
    answer: "So we can see what we bought and how much everything cost! 🧾",
    explanation: "A receipt is a record of your purchase. It helps you check for mistakes and keep track of spending." },
  { id: 'wh22', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "RESTAURANT — You sit down at a restaurant. A waiter comes over right away. Before ordering, you look at a booklet with all the food and drink choices listed.",
    question: "WHY do we look at a menu at a restaurant?",
    answer: "To choose what food and drink we want to order! 🍽️",
    explanation: "Menus show all the options available and their prices so you can decide what to get." },
  { id: 'wh23', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "PARK — People are jogging, walking dogs, and playing on the playground. Several dogs are walking with their owners. A park ranger is also there.",
    question: "WHY do people put their dogs on leashes at the park?",
    answer: "To keep the dog under control and keep everyone safe! 🐕",
    explanation: "Leashes stop dogs from running at other people or animals — it protects the dog and everyone around it." },
  { id: 'wh24', cat: 'wh', type: 'wh', wh: 'WHAT',
    story: "HOSPITAL — A patient has a broken leg. The doctor checks the X-ray and explains the treatment. The bone needs to be held firmly in place while it heals.",
    question: "WHAT is placed on a broken leg to keep the bones in place?",
    answer: "A cast! 🦴",
    explanation: "A cast is a hard shell (usually plaster or fibreglass) that holds the broken bone still so it heals correctly." },
  { id: 'wh25', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "ZOO — The animals live in large enclosures with fences. Lions, zebras, and giraffes are all visible from the paths. Visitors walk along safe pathways to view them.",
    question: "WHY are the animals at the zoo kept within fences?",
    answer: "To keep the animals safe AND protect the visitors! 🦁",
    explanation: "Fences stop animals from escaping into the city, and keep curious visitors at a safe distance." },
  { id: 'wh26', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "POST OFFICE — People line up to send letters and packages. The worker has a scale on the counter. All envelopes must have a small printed sticker on them before they can be mailed.",
    question: "WHY do we use stamps on envelopes?",
    answer: "To pay for the cost of delivering the letter! 💌",
    explanation: "A stamp is proof of payment. It tells the postal service that the sender has paid the delivery fee." },
  { id: 'wh27', cat: 'wh', type: 'wh', wh: 'WHY',
    story: "LIBRARY — The library is very quiet. People are reading, studying, and working on computers. A librarian is reading aloud to a group of children.",
    question: "WHY must you be quiet in a library?",
    answer: "Because people are reading, studying, and concentrating — noise is disruptive! 📚",
    explanation: "Libraries are shared spaces for focus and learning. Being quiet shows respect for everyone there." },
  { id: 'wh28', cat: 'wh', type: 'wh', wh: 'WHO',
    story: "HAIR SALON — One person is sweeping the floor. A stylist is cutting someone's hair. Another person is having their hair washed. There are scissors, a hairdryer, and magazines in the waiting area.",
    question: "WHO is sweeping the hair off the floor?",
    answer: "The salon assistant or junior stylist! 💈",
    explanation: "In a salon, someone sweeps up cut hair between clients so the floor stays clean and safe to walk on." },

  // ── WH multiple-choice — WH Bundle #3 "Real Pictures WH Questions" ──
  { id: 'wh29', cat: 'wh', type: 'choice',
    question: "WHERE is the bus going? Look at the picture clues: children with backpacks, books, lunchboxes.",
    options: ["To the zoo 🦒", "To the school 🏫", "To the mall 🛍️", "To the park 🌳"],
    correct: 1,
    explanation: "Children carrying backpacks and lunchboxes are a clue they are going to school!" },
  { id: 'wh30', cat: 'wh', type: 'choice',
    question: "WHO do you see? They wear scrubs, use dental tools, and ask you to open wide.",
    options: ["A doctor 🩺", "A police officer 👮", "A dentist 🦷", "A nurse 💉"],
    correct: 2,
    explanation: "Dentists wear scrubs and use special tools to check and clean your teeth." },

  // ── WH fill-in — WH Bundle #5 "Simple Dry Erase Flip Books" (answer bank items) ──
  { id: 'wh31', cat: 'wh', type: 'choice',
    question: "WHO saves you from drowning at a swimming pool?",
    options: ["A doctor 🩺", "A police officer 👮", "A chef 👨‍🍳", "A lifeguard 🏊"],
    correct: 3,
    explanation: "Lifeguards are specially trained to watch over swimmers and perform rescues if needed." },
  { id: 'wh32', cat: 'wh', type: 'choice',
    question: "WHEN do you wear a bathing suit?",
    options: ["In winter ❄️", "When it's cold 🧥", "In the summer or when swimming 🏖️", "At bedtime 🌙"],
    correct: 2,
    explanation: "Bathing suits are worn for swimming or at the beach — usually in warm weather or summer!" },

  // ── Social Skills — OCR: Sarcasm ("Identifying and Using Sarcasm.pdf") ──
  { id: 's10', cat: 'social', type: 'choice',
    question: "Greg is leaning against his car with a FLAT TIRE. He says: 'Awesome. My tire is flat and I need to be at work in 15 minutes.' Is Greg being...?",
    options: ["Serious — he thinks the flat tyre is great 😀", "Sarcastic — he means the OPPOSITE: this is terrible 😤", "Confused about the tyre 🤔", "Excited about being late 😄"],
    correct: 1,
    explanation: "Greg says 'Awesome' but he's clearly in a stressful situation. When tone doesn't match context, it's sarcasm — he means the opposite of what he says." },
  { id: 's11', cat: 'social', type: 'choice',
    question: "At a parade, a loud marching band plays right in front of Aunt Mary. She says: 'They're so quiet! I can hardly hear them.' Is Aunt Mary being...?",
    options: ["Serious — the band is playing softly 🎵", "Confused about the music 🤔", "Sarcastic — the band is actually VERY LOUD 🥁", "Angry at the parade 😡"],
    correct: 2,
    explanation: "A marching band is never quiet! Aunt Mary is saying the OPPOSITE of what she means — that's sarcasm." },
  { id: 's12', cat: 'social', type: 'choice',
    question: "At a long, dull staff meeting, a friend whispers: 'This meeting is just SO interesting. I'm about to fall asleep.' Is the friend being...?",
    options: ["Serious — they love the meeting 😄", "Confused about the meeting 🤔", "Sarcastic — the meeting is BORING 😴", "Happy they came 😊"],
    correct: 2,
    explanation: "Saying something is 'SO interesting' while also saying they're falling asleep is a big sarcasm clue! The words and the feeling don't match." },
  { id: 's13', cat: 'social', type: 'choice',
    question: "At a family game night, everyone is laughing. Your brother says: 'This game is fun! I want to take it to the sleepover tomorrow.' Is he being...?",
    options: ["Sarcastic — he hates the game 😤", "Serious — he genuinely likes the game and wants to bring it 😊", "Confused about the game 🤔", "Angry 😡"],
    correct: 1,
    explanation: "Everyone IS having fun, so the words match the situation. This is NOT sarcasm — he truly means it! Context matters." },

  // ── Social Skills — OCR: Identifying Feelings ("Identifying Feelings and Emotions.pdf") ──
  { id: 's14', cat: 'social', type: 'choice',
    question: "Marcus comes stomping downstairs. 'I said you couldn't borrow my baseball mitt! The big game is in one hour and my lucky glove is missing!' How does Marcus FEEL?",
    options: ["Happy and calm 😊", "Silly and playful 😜", "Angry and furious 😤", "Surprised and thrilled 🤩"],
    correct: 2,
    explanation: "Stomping, a raised voice, and the word 'I SAID you couldn't' are all signs that Marcus is very angry and frustrated." },
  { id: 's15', cat: 'social', type: 'choice',
    question: "Norah is fidgeting with her sleeve. She says: 'Today is the audition for the spring play. I'm trying out for the lead role. I just can't wait until it's over!' How does Norah FEEL?",
    options: ["Bored and impatient ⏰", "Anxious and nervous 😰", "Excited and confident 💪", "Angry 😡"],
    correct: 1,
    explanation: "Fidgeting + wanting it to be over + a big high-stakes event = anxiety. Norah is nervous, even though she might also be a little excited." },
  { id: 's16', cat: 'social', type: 'choice',
    question: "Camille thought she'd done badly at the softball tryout because she felt sick. The coach reads names aloud. When Camille hears her own name, her eyes go wide and she says: 'What?!' How does Camille FEEL?",
    options: ["Sad and disappointed 😢", "Angry at the coach 😡", "Surprised and thrilled 🤩", "Bored 😑"],
    correct: 2,
    explanation: "Wide eyes, 'What?!' and an unexpected good outcome = surprised and thrilled. She made the team despite thinking she'd failed!" },
  { id: 's17', cat: 'social', type: 'choice',
    question: "Kelsey is sitting on a bench at the library, fidgeting with her backpack zipper and glancing at the clock every few minutes. 'I've already been waiting 15 minutes.' How does Kelsey FEEL?",
    options: ["Excited about her wait 😄", "Happy and relaxed 😊", "Impatient and bored ⏱️", "Frightened 😨"],
    correct: 2,
    explanation: "Fidgeting + clock-watching + mentioning she's been waiting = classic signs of impatience and boredom." },

  // ── Social Skills — OCR: Conversation Turn-Taking ──
  { id: 's18', cat: 'social', type: 'choice',
    question: "Jill spends 3 full minutes talking about her history test — Julius Caesar, grades, paper scores — while Mark stands there and barely gets a word in. What is the PROBLEM with this conversation?",
    options: ["Mark is being too rude by listening quietly", "Jill is talking far too much — the conversation is unbalanced 🔊", "They are talking about the wrong topic", "Mark should walk away immediately"],
    correct: 1,
    explanation: "Balanced conversations mean BOTH people talk roughly the same amount. Jill is dominating — Mark feels ignored or bored. She should stop and ask Mark something!" },
  { id: 's19', cat: 'social', type: 'choice',
    question: "Shane tries to keep a conversation going by sharing things. Cole keeps responding with just 'Yeah.' every time. What is the PROBLEM?",
    options: ["Shane is talking too much 🔊", "Cole is not contributing enough — the conversation feels one-sided 🤐", "They are talking about a bad topic", "There is nothing wrong — short answers are fine"],
    correct: 1,
    explanation: "Conversation takes two! When one person says only 'Yeah' over and over, the other person feels unheard and the conversation dies. Cole needs to add more." },
  { id: 's20', cat: 'social', type: 'choice',
    question: "Someone says to you: 'I got a new phone!' What is the BEST way to respond?",
    options: ["'Okay.' and look away 😶", "'Whatever, I got one too.' and walk off 🚶", "'Oh cool! What kind did you get? What do you like about it?' 📱", "Tell a long story about your own phone"],
    correct: 2,
    explanation: "Asking a follow-up question shows genuine interest and keeps the conversation going — exactly what the Taking Turns Q&A toolkit recommends!" },

  // ── Sequence — OCR: "Sequencing for Story Retell 3–6 Steps" (LT #16) ──
  // Replacing hand-adapted sequences with REAL stories from the PDF
  { id: 'seq1', cat: 'sequence', type: 'sequence', emoji: '🏖️',
    title: "Elijah's Sandcastles (from Sequencing PDF)",
    scrambled: ["A big wave splashed right on top of him 🌊", "His castle was ruined and he was completely soaked! 😱", "Elijah was happily building sandcastles on the beach 🏖️"],
    answer:    ["Elijah was happily building sandcastles on the beach 🏖️", "A big wave splashed right on top of him 🌊", "His castle was ruined and he was completely soaked! 😱"] },
  { id: 'seq2', cat: 'sequence', type: 'sequence', emoji: '🚴',
    title: "Evelyn's Bike Ride (from Sequencing PDF)",
    scrambled: ["She put on her helmet and went for a bike ride 🚴", "She hit a rock going downhill and fell, hurting her knee 🤕", "Her mum came out and gave her a band-aid 🩹", "She started to cry — her knee hurt badly 😢", "With the band-aid on, Evelyn finally felt better 😊"],
    answer:    ["She put on her helmet and went for a bike ride 🚴", "She hit a rock going downhill and fell, hurting her knee 🤕", "She started to cry — her knee hurt badly 😢", "Her mum came out and gave her a band-aid 🩹", "With the band-aid on, Evelyn finally felt better 😊"] },
  { id: 'seq3', cat: 'sequence', type: 'sequence', emoji: '🍓',
    title: "Making Jam (from Sequencing PDF)",
    scrambled: ["Got a berry-picking basket 🧺", "Cooked the berries on the stove with sugar 🍯", "Picked the berries off the bush 🍓", "Put the finished jam into jars 🫙", "Brought berries home and washed them 🚿"],
    answer:    ["Got a berry-picking basket 🧺", "Picked the berries off the bush 🍓", "Brought berries home and washed them 🚿", "Cooked the berries on the stove with sugar 🍯", "Put the finished jam into jars 🫙"] },
  { id: 'seq4', cat: 'sequence', type: 'sequence', emoji: '🌱',
    title: "Planting Seeds (from Sequencing PDF)",
    scrambled: ["Covered seeds with dirt and watered them 💧", "Saw tiny seedlings sprouting a few days later 🌱", "Dug small holes in the ground ⛏️", "Placed seeds carefully into the holes 🌾"],
    answer:    ["Dug small holes in the ground ⛏️", "Placed seeds carefully into the holes 🌾", "Covered seeds with dirt and watered them 💧", "Saw tiny seedlings sprouting a few days later 🌱"] },
  { id: 'seq5', cat: 'sequence', type: 'sequence', emoji: '🏕️',
    title: "Going Camping (from Sequencing PDF)",
    scrambled: ["Gathered sticks and lit a campfire 🔥", "Curled up in a sleeping bag and went to sleep 😴", "Hiked through the woods to reach the campsite 🌲", "Set up the tent at the campsite ⛺", "Roasted marshmallows over the hot fire 🍡"],
    answer:    ["Hiked through the woods to reach the campsite 🌲", "Set up the tent at the campsite ⛺", "Gathered sticks and lit a campfire 🔥", "Roasted marshmallows over the hot fire 🍡", "Curled up in a sleeping bag and went to sleep 😴"] },
  { id: 'seq6', cat: 'sequence', type: 'sequence', emoji: '🎪',
    title: "Sivi at the Carnival (from Sequencing PDF)",
    scrambled: ["Paid the worker to play the dart game 🎟️", "Won a giant teddy bear! 🧸", "Aimed and threw his dart — it missed and hit the wall 😬", "Wanted to play the dart game at the carnival 🎪", "Threw again — popped a balloon! 🎉"],
    answer:    ["Wanted to play the dart game at the carnival 🎪", "Paid the worker to play the dart game 🎟️", "Aimed and threw his dart — it missed and hit the wall 😬", "Threw again — popped a balloon! 🎉", "Won a giant teddy bear! 🧸"] },
  { id: 'seq7', cat: 'sequence', type: 'sequence', emoji: '🦷',
    title: "Laila and the Tooth Fairy (from Sequencing PDF)",
    scrambled: ["Woke up to find the tooth fairy had left money! 💰", "Had a very wiggly tooth 🦷", "The tooth fairy came in the night 🧚", "Took a big bite of a crunchy apple — tooth popped out! 🍎", "Put the tooth under her pillow and fell asleep 😴"],
    answer:    ["Had a very wiggly tooth 🦷", "Took a big bite of a crunchy apple — tooth popped out! 🍎", "Put the tooth under her pillow and fell asleep 😴", "The tooth fairy came in the night 🧚", "Woke up to find the tooth fairy had left money! 💰"] },

  // ── Word Play — LT #23 "Prefix + Suffix Activities" ──
  { id: 'wp16', cat: 'wordplay', type: 'wordplay', emoji: '🔄',
    question: "PREFIX: What does RE- mean? Give 3 example words.",
    answer: "RE- means AGAIN!\nExamples: rebuild (build again), replay (play again), refill (fill again), rewrite (write again) 🔁" },
  { id: 'wp17', cat: 'wordplay', type: 'wordplay', emoji: '🔤',
    question: "Break down UNFRIENDLY into its parts: prefix + base word + suffix. What does each part mean?",
    answer: "UN- (not) + FRIEND (base word) + -LY (in a way that is like)\n= 'not in a way that is like a friend' = mean or rude 😒" },
  { id: 'wp18', cat: 'wordplay', type: 'wordplay', emoji: '🔬',
    question: "PREFIX: What does MICRO- mean? Name 3 words that use it.",
    answer: "MICRO- means SMALL!\nmicrophone (small + voice), microwave (small waves), microscope (small + look) 🔭" },
  { id: 'wp19', cat: 'wordplay', type: 'wordplay', emoji: '📝',
    question: "Break down RESEARCHER into its parts: prefix + base + suffix. What does each part mean?",
    answer: "RE- (again) + SEARCH (base: look for) + -ER (a person who)\n= 'a person who searches for information again and again' 🔎" },
  { id: 'wp20', cat: 'wordplay', type: 'wordplay', emoji: '🦸',
    question: "What does the prefix SUPER- mean? Which of these words uses it? superhero / sunshine / subway",
    answer: "SUPER- means ABOVE or MORE THAN NORMAL!\nSUPERHERO = super (above normal) + hero ✅\n(sunshine and subway use 'sun' and 'sub', different prefixes!)" },

  // ── Word Play — LT #27 "Early Describing and Categorizing" ──
  { id: 'wp21', cat: 'wordplay', type: 'wordplay', emoji: '🗂️',
    question: "CATEGORY: Bee, butterfly, ant, grasshopper, beetle, ladybug — what do they all have in common?",
    answer: "They're all INSECTS! 🦋🐜\n(6 legs, usually small, many have wings — insects live everywhere)" },
  { id: 'wp22', cat: 'wordplay', type: 'wordplay', emoji: '🗂️',
    question: "CATEGORY: Car, bus, airplane, train, boat, motorcycle, helicopter — what do they all have in common?",
    answer: "They're all VEHICLES! ✈️🚌\n(Things that carry people or goods from one place to another)" },
  { id: 'wp23', cat: 'wordplay', type: 'wordplay', emoji: '📍',
    question: "PLACE: Where in the world would you find these? Fish · Ice cream · Nails · A baby",
    answer: "Fish → in the water or at a fish shop 🐟\nIce cream → in the freezer 🍦\nNails → in a toolbox 🔨\nA baby → in a crib or bedroom 👶" },

  // ── Word Play — LT #21 "Vocabulary Worksheets" ──
  { id: 'wp24', cat: 'wordplay', type: 'wordplay', emoji: '💬',
    question: "VOCABULARY: What does ADORE mean? Use it in a sentence about something you love.",
    answer: "ADORE = to love something (or someone) very much!\nSimilar words: love, cherish 💛\nExample: 'Diya adores music and dancing.'" },
  { id: 'wp25', cat: 'wordplay', type: 'wordplay', emoji: '💬',
    question: "VOCABULARY: What does ALLOW mean? Name something your school ALLOWS, and something it does NOT allow.",
    answer: "ALLOW = to let somebody have or do something\nSimilar: permit, let\nExample: 'My school allows eating in the cafeteria but does not allow running in the hallways.' 🏫" },

  // ── Word Play — LT #24 "One Sheet Real Picture Describing" ──
  { id: 'wp26', cat: 'wordplay', type: 'wordplay', emoji: '🍌',
    question: "DESCRIBE a BANANA using G-A-P-P-L-U: Group · Action · Place · Parts · Looks Like · Unique",
    answer: "Group: It's a FRUIT 🍌\nAction: You EAT it / peel it\nPlace: Grocery store, fridge, lunchbox\nParts: Yellow peel, soft inside flesh\nLooks like: Curved, yellow, medium sized\nUnique: Monkeys love it! Goes brown when ripe." },

  // ── Story Skills — SWBST & Story Grammar (LT #08, #11, #15) ──
  { id: 'story1', cat: 'story', type: 'wh', wh: 'SOMEBODY',
    story: "THE SCHOOL PROJECT — Kiara heard about the big project all year: every student had to create a special newspaper about their favourite animal. She chose baby seals and had special paper ready. But she kept putting it off — visiting friends, volleyball practice, watching movies. The night before it was due she hadn't started. She worked until 2am. The printer broke. Her drawing wasn't good. She finished the rushed project and turned it in. The other kids had beautiful newspapers. Kiara got a bad grade.",
    question: "SOMEBODY — Who is this story about, and what did she WANT to do?",
    answer: "Kiara! She wanted to create a great newspaper about baby seals. 🦭",
    explanation: "In the SWBST framework: SOMEBODY = the main character. WANTED = their goal. Kiara's goal was a great newspaper." },
  { id: 'story2', cat: 'story', type: 'wh', wh: 'BUT',
    story: "THE SCHOOL PROJECT — (Same Kiara story above) Despite having all the materials she needed, Kiara kept finding reasons to put the project off. She went to her friend's house, then volleyball practice, then watched a movie. Day after day passed.",
    question: "BUT — What was the PROBLEM that got in Kiara's way?",
    answer: "She kept procrastinating (putting it off)! Then the night before, her printer broke and her drawing wasn't good. 😟",
    explanation: "'But' = the obstacle. Kiara's obstacle was her own procrastination, plus last-minute technical problems." },
  { id: 'story3', cat: 'story', type: 'wh', wh: 'SOLUTION',
    story: "RUNNING LATE — Oliver kept sleeping through his alarm. His mum was upset he'd been late three times that week. Plan 1: he moved the alarm clock across the room so he had to get up to turn it off. He got up, turned it off — then sat back down and fell asleep again! Plan 2: he borrowed his mum's old clock and set TWO alarms, 5 minutes apart.",
    question: "SOLUTION — Which plan finally worked, and WHY?",
    answer: "Plan 2 worked! Setting TWO alarms 5 minutes apart — the second alarm made him jump up and stay awake. ⏰",
    explanation: "A solution is the plan that actually fixes the problem. The 'failed action' (Plan 1) is important — it shows not every plan works on the first try." },
  { id: 'story4', cat: 'story', type: 'wh', wh: 'FEELINGS',
    story: "LOST IN THE WOODS — Liana was camping and went exploring after breakfast. She got distracted picking up a leaf, a rock, and a pinecone. After a while, nothing looked familiar — she had wandered far from the creek. She felt shaky and her heart raced. Then she remembered what her mum had taught her. She reached into her pocket, pulled something out, and blew it over and over.",
    question: "FEELINGS — How did Liana feel when she realised she was lost? How did she feel after?",
    answer: "Lost: nervous, scared, shaky 😨\nAfter: relieved and safe once her mum found her! 😌",
    explanation: "Tracking how characters' feelings CHANGE through a story is a key story grammar skill — feelings show us the emotional journey." },
  { id: 'story5', cat: 'story', type: 'wh', wh: 'CHARACTER',
    story: "THE DESTROYER — The Destroyer was a supervillain who was tired of being booed. He tried helping: when a man grabbed a woman's purse and ran, The Destroyer tripped the thief. The woman screamed that The Destroyer stole her purse and ran. He tried again: at a car crash, he used his ray gun to cut open the car and pulled a trapped man out safely. The crowd finally understood — he was helping.",
    question: "CHARACTER — How does The Destroyer change from the BEGINNING to the END of the story?",
    answer: "Beginning: A feared villain that people boo and hate 👿\nEnd: A recognised hero that people thank and respect 🦸",
    explanation: "Characters can change across a story — this is called 'character development'. The Destroyer goes from villain to hero through actions." },
  { id: 'story6', cat: 'story', type: 'wh', wh: 'SETTING',
    story: "LOLA THE ALLIGATOR — Lola lived in a river that had become full of rubbish. She and her friends — the fish, the turtles, and the birds — couldn't swim in it anymore because of all the trash. Lola decided something had to be done.",
    question: "SETTING — Where does this story take place, and how does the setting create the PROBLEM?",
    answer: "The story takes place in a dirty, rubbish-filled river 🌊\nThe setting IS the problem — the polluted water is what Lola needs to fix!" ,
    explanation: "Sometimes the setting creates the problem. Here the dirty river is why Lola can't swim — the place itself drives the story forward." },
  { id: 'story7', cat: 'story', type: 'wh', wh: 'PLAN',
    story: "LOLA THE ALLIGATOR (continued) — Lola wanted to clean up the river but the trash was far too heavy to move by herself with just her tail. She thought hard about what to do. Then she had an idea.",
    question: "PLAN — What plan did Lola come up with to solve her problem?",
    answer: "She gathered ALL her animal friends — the fish, the turtles, and the birds — to work together as a team! 🐊🐢🐦",
    explanation: "A character's plan is what they DECIDE to do to fix the problem. Lola's plan was teamwork — something she couldn't do alone." },
  { id: 'story8', cat: 'story', type: 'wh', wh: 'TRANSITION',
    story: "Story transition words help a listener or reader follow the order of events. They signal whether something is happening at the BEGINNING, MIDDLE, or END of a story.",
    question: "TRANSITION — Sort these words: First · But then · Finally · One day · After that · In the end",
    answer: "Beginning: First, One day 🌅\nMiddle: But then, After that ➡️\nEnd: Finally, In the end 🏁",
    explanation: "Transition words act like road signs in a story — they tell you where you are in the sequence of events." },

  // ── Sentences — LT #01 "Systematic Sentence Combining" ──
  { id: 'sent1', cat: 'sentence', type: 'wordplay', emoji: '➕',
    question: "COMBINE with AND: 'I love soccer.' + 'I love basketball.' → Say the combined sentence.",
    answer: "I love soccer AND basketball! ⚽🏀\n(Both sentences share the same subject 'I love', so we combine the objects with 'and'.)" },
  { id: 'sent2', cat: 'sentence', type: 'wordplay', emoji: '🔄',
    question: "COMBINE with BUT: 'The book was interesting.' + 'The book was too long.' → Say the combined sentence.",
    answer: "The book was interesting BUT too long! 📚\n('But' joins ideas that CONTRAST — one positive, one negative.)" },
  { id: 'sent3', cat: 'sentence', type: 'wordplay', emoji: '🧠',
    question: "COMBINE with BECAUSE: 'I cleaned my bedroom.' + 'It was a huge mess.' → Say the combined sentence.",
    answer: "I cleaned my bedroom BECAUSE it was a huge mess! 🧹\n('Because' gives the REASON — it answers 'why?')" },
  { id: 'sent4', cat: 'sentence', type: 'wordplay', emoji: '🌧️',
    question: "COMBINE with SO: 'It started to rain.' + 'I went inside.' → Say the combined sentence.",
    answer: "It started to rain SO I went inside! ☔\n('So' shows the RESULT or consequence — what happened next because of the first event.)" },
  { id: 'sent5', cat: 'sentence', type: 'wordplay', emoji: '🐱',
    question: "Fill in the missing conjunction: 'He won't feed the cat _____ you remind him.' (UNLESS / BECAUSE / SO)",
    answer: "UNLESS! He won't feed the cat UNLESS you remind him. 🐈\n('Unless' = except if / only if not — the cat only gets fed IF you remind him.)" },
  { id: 'sent6', cat: 'sentence', type: 'wordplay', emoji: '📖',
    question: "Fill in the missing conjunction: 'Keep reading _____ class ends.' (BEFORE / UNTIL / WHILE)",
    answer: "UNTIL! Keep reading UNTIL class ends. 📖\n('Until' means up to the point in time when something happens.)" },
  { id: 'sent7', cat: 'sentence', type: 'wordplay', emoji: '🧑‍🏫',
    question: "COMBINE using WHO or THAT: 'This is the teacher.' + 'She taught me how to read.' → Say the combined sentence.",
    answer: "This is the teacher WHO taught me how to read! 🧑‍🏫\n(Use WHO for people. Use THAT for things.)" },
  { id: 'sent8', cat: 'sentence', type: 'wordplay', emoji: '🔤',
    question: "COMBINE using WHOSE: 'That is the woman.' + 'I take care of her dog.' → Say the combined sentence.",
    answer: "That is the woman WHOSE dog I take care of! 🐕\n(WHOSE shows belonging/possession — her dog = whose dog.)" },
]

// ── Altogether sub-components ──────────────────────────────────────────────────

function RiddleCard({ a, revealed, onReveal, onGot, onMissed }) {
  return (
    <>
      <div className="ag-type-badge">🔍 Riddle</div>
      <div className="ag-emoji">{a.emoji}</div>
      <p className="ag-question">{a.question}</p>
      {!revealed
        ? <button className="ag-reveal-btn" onClick={onReveal}>Reveal Answer</button>
        : <>
            <div className="ag-answer"><span className="ag-answer-word">{a.answer}</span></div>
            <div className="ag-verdict-row">
              <button className="ag-btn ag-btn--got" onClick={onGot}>✓ Got it!</button>
              <button className="ag-btn ag-btn--missed" onClick={onMissed}>✗ Try again</button>
            </div>
          </>
      }
    </>
  )
}

function WHCard({ a, revealed, onReveal, onGot, onMissed }) {
  return (
    <>
      <div className="ag-type-badge">❓ WH Question</div>
      {a.story && (
        <div className="ag-story-box">
          <p className="ag-story-text">{a.story}</p>
        </div>
      )}
      <div className="ag-wh-badge">{a.wh}?</div>
      <p className="ag-question">{a.question}</p>
      {!revealed
        ? <button className="ag-reveal-btn" onClick={onReveal}>Show Answer</button>
        : <>
            <div className="ag-answer">
              <p className="ag-answer-text">{a.answer}</p>
              {a.explanation && <p className="ag-explanation">{a.explanation}</p>}
            </div>
            <div className="ag-verdict-row">
              <button className="ag-btn ag-btn--got" onClick={onGot}>✓ Got it!</button>
              <button className="ag-btn ag-btn--missed" onClick={onMissed}>✗ Try again</button>
            </div>
          </>
      }
    </>
  )
}

function ChoiceCard({ a, revealed, choiceSelected, onSelect, onNext }) {
  const isCorrect = choiceSelected === a.correct
  return (
    <>
      <div className="ag-type-badge">🤝 Social Skills</div>
      <p className="ag-question">{a.question}</p>
      <div className="ag-choice-grid">
        {a.options.map((opt, i) => {
          let cls = 'ag-choice-btn'
          if (revealed) {
            if (i === a.correct)       cls += ' ag-choice-btn--correct'
            else if (i === choiceSelected) cls += ' ag-choice-btn--wrong'
            else                           cls += ' ag-choice-btn--faded'
          }
          return (
            <button key={i} className={cls} onClick={() => onSelect(i)} disabled={revealed}>
              <span className="ag-choice-letter">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          )
        })}
      </div>
      {revealed && (
        <>
          <p className={`ag-verdict-text ${isCorrect ? 'ag-verdict-text--correct' : 'ag-verdict-text--wrong'}`}>
            {isCorrect ? '🎉 Correct!' : '✗ Not quite!'}
          </p>
          {a.explanation && <p className="ag-explanation">{a.explanation}</p>}
          <button className="ag-reveal-btn" onClick={onNext}>Next →</button>
        </>
      )}
    </>
  )
}

function SequenceCard({ a, revealed, onReveal, onNext }) {
  return (
    <>
      <div className="ag-type-badge">📋 Story Order</div>
      <div className="ag-emoji">{a.emoji}</div>
      <p className="ag-question">{a.title}</p>
      <p className="ag-seq-prompt">Can you put these steps in the right order?</p>
      <div className="ag-sequence">
        {(revealed ? a.answer : a.scrambled).map((step, i) => (
          <div key={i} className={`ag-step ${revealed ? 'ag-step--correct' : 'ag-step--scrambled'}`}>
            {revealed
              ? <span className="ag-step-num">{i + 1}</span>
              : <span className="ag-step-dot" />
            }
            <span>{step}</span>
          </div>
        ))}
      </div>
      {!revealed
        ? <button className="ag-reveal-btn" onClick={onReveal}>Show Correct Order</button>
        : <button className="ag-reveal-btn" onClick={onNext}>Next →</button>
      }
    </>
  )
}

function WordPlayCard({ a, revealed, onReveal, onGot, onMissed }) {
  return (
    <>
      <div className="ag-type-badge">🔤 Word Play</div>
      <div className="ag-emoji">{a.emoji}</div>
      <p className="ag-question">{a.question}</p>
      {!revealed
        ? <button className="ag-reveal-btn" onClick={onReveal}>Reveal Answer</button>
        : <>
            {a.visual && (
              <div className="ag-syllables">
                {a.visual.flatMap((syl, i) => {
                  const items = [<span key={`s${i}`} className="ag-syl-bubble">{syl}</span>]
                  if (i < a.visual.length - 1) items.push(<span key={`d${i}`} className="ag-syl-dot">·</span>)
                  return items
                })}
              </div>
            )}
            <div className="ag-answer">
              {a.answer.split('\n').map((line, i) =>
                <p key={i} className="ag-answer-text">{line}</p>
              )}
            </div>
            <div className="ag-verdict-row">
              <button className="ag-btn ag-btn--got" onClick={onGot}>✓ Got it!</button>
              <button className="ag-btn ag-btn--missed" onClick={onMissed}>✗ Try again</button>
            </div>
          </>
      }
    </>
  )
}

function DirectionsCard({ a, onDone }) {
  return (
    <>
      <div className="ag-type-badge">👆 Follow Along</div>
      <div className="ag-emoji">{a.emoji}</div>
      <div className="ag-directions-box">
        {a.instruction.split('\n').map((line, i) =>
          line.trim()
            ? <p key={i} className="ag-dir-line">{line}</p>
            : <br key={i} />
        )}
      </div>
      <button className="ag-reveal-btn ag-reveal-btn--done" onClick={onDone}>
        {a.confirmText}
      </button>
    </>
  )
}

function AltogetherSection() {
  const [cat, setCat]               = useState('all')
  const [idx, setIdx]               = useState(0)
  const [revealed, setRevealed]     = useState(false)
  const [choiceSelected, setChoice] = useState(-1)
  const [score, setScore]           = useState({ got: 0, total: 0 })

  const filtered = cat === 'all' ? ALTOGETHER : ALTOGETHER.filter(a => a.cat === cat)
  const activity = filtered[Math.min(idx, filtered.length - 1)]

  function resetCard() { setRevealed(false); setChoice(-1) }
  function changeCat(c) { setCat(c); setIdx(0); resetCard() }
  function goNext() { if (idx < filtered.length - 1) { setIdx(i => i + 1); resetCard() } }
  function goPrev() { if (idx > 0) { setIdx(i => i - 1); resetCard() } }
  function gotIt()  { setScore(s => ({ got: s.got + 1, total: s.total + 1 })); goNext() }
  function missed() { setScore(s => ({ ...s, total: s.total + 1 })); resetCard() }

  function selectChoice(optIdx) {
    if (choiceSelected !== -1) return
    setChoice(optIdx)
    setRevealed(true)
    if (optIdx === activity.correct) setScore(s => ({ got: s.got + 1, total: s.total + 1 }))
    else setScore(s => ({ ...s, total: s.total + 1 }))
  }

  if (!activity) return null

  return (
    <div className="altogether-section">
      <div className="ag-header">
        <p className="section-desc" style={{ margin: 0 }}>
          Activities drawn directly from Diya's therapy PDFs — WH stories, phonological awareness challenges, following directions task cards, and more!
        </p>
        {score.total > 0 && (
          <div className="ag-score">⭐ {score.got} / {score.total}</div>
        )}
      </div>

      <div className="ag-cat-bar">
        {ALTOGETHER_CATS.map(c => (
          <button
            key={c.id}
            className={`ag-cat-btn${cat === c.id ? ' ag-cat-btn--active' : ''}`}
            onClick={() => changeCat(c.id)}
          >{c.label}</button>
        ))}
      </div>

      <p className="ag-counter">Activity {idx + 1} of {filtered.length}</p>

      <div className={`ag-card ag-card--${activity.type}`}>
        {activity.type === 'riddle'     && <RiddleCard    a={activity} revealed={revealed} onReveal={() => setRevealed(true)} onGot={gotIt} onMissed={missed} />}
        {activity.type === 'wh'         && <WHCard        a={activity} revealed={revealed} onReveal={() => setRevealed(true)} onGot={gotIt} onMissed={missed} />}
        {activity.type === 'choice'     && <ChoiceCard    a={activity} revealed={revealed} choiceSelected={choiceSelected} onSelect={selectChoice} onNext={goNext} />}
        {activity.type === 'sequence'   && <SequenceCard  a={activity} revealed={revealed} onReveal={() => setRevealed(true)} onNext={goNext} />}
        {activity.type === 'wordplay'   && <WordPlayCard  a={activity} revealed={revealed} onReveal={() => setRevealed(true)} onGot={gotIt} onMissed={missed} />}
        {activity.type === 'directions' && <DirectionsCard a={activity} onDone={goNext} />}
      </div>

      <div className="ag-nav">
        <button className="ag-nav-btn" onClick={goPrev} disabled={idx === 0}>← Prev</button>
        <button className="ag-nav-btn" onClick={goNext} disabled={idx === filtered.length - 1}>Next →</button>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Therapy() {
  const { profileId } = useParams()
  const { data }      = useQuery(GET_PROFILES)
  const profile       = (data?.profiles ?? []).find(p => p.id === profileId) ?? null
  const name          = profile ? `${profile.firstName}${profile.lastName ? ` ${profile.lastName}` : ''}` : ''

  const { get, cycle, toggle, stats } = useTherapyProgress(profileId)
  const [tab, setTab] = useState('vocabulary')

  // Overall progress across all fixed sections
  const allKeys = Object.values(SECTION_KEYS).flat()
  const { done: totalDone, total: totalAll, pct: totalPct } = stats(allKeys)

  return (
    <div className="therapy-page">
      <Breadcrumb />
      <div className="therapy-header">
        <div className="therapy-header-top">
          <div>
            <h1>Therapy</h1>
            {name && <p className="therapy-subtitle">for {name}</p>}
          </div>
          <div className="therapy-overall">
            <div className="therapy-overall-bar">
              <div className="therapy-overall-fill" style={{ width: `${totalPct}%` }} />
            </div>
            <span className="therapy-overall-label">
              {totalDone}/{totalAll} completed
            </span>
          </div>
        </div>
      </div>

      <div className="therapy-tabs">
        {TABS.map(t => {
          const keys   = SECTION_KEYS[t.id] || []
          const { done, total, pct } = stats(keys)
          const allDone = total > 0 && done === total
          return (
            <button
              key={t.id}
              className={`therapy-tab${tab === t.id ? ' therapy-tab--active' : ''}${allDone ? ' therapy-tab--complete' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className="therapy-tab-label">{t.label}</span>
              {total > 0 && (
                <span className={`therapy-tab-stat${allDone ? ' therapy-tab-stat--done' : done > 0 ? ' therapy-tab-stat--partial' : ''}`}>
                  {done}/{total}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="therapy-content">
        {tab === 'vocabulary'  && <VocabularySection get={get} toggle={toggle} />}
        {tab === 'reading'     && <ReadingSection    get={get} cycle={cycle} stats={stats} />}
        {tab === 'wh'          && <WHSection         get={get} cycle={cycle} />}
        {tab === 'social'      && <SocialSection     get={get} cycle={cycle} />}
        {tab === 'directions'  && <DirectionsSection get={get} cycle={cycle} />}
        {tab === 'language'    && <LanguageSection   get={get} cycle={cycle} />}
        {tab === 'aba'         && <ABASection        get={get} cycle={cycle} stats={stats} />}
        {tab === 'altogether'  && <AltogetherSection />}
      </div>
    </div>
  )
}
