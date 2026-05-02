import { useState, useRef } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import './Pictionary.css'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const C = 'currentColor'
const lc = { strokeLinecap: 'round' }
const lj = { strokeLinecap: 'round', strokeLinejoin: 'round' }

const SUBJECTS = [
  {
    word: 'house',
    clue: 'Buildings & Places',
    steps: [
      <rect key="w"  x="40" y="100" width="120" height="80" fill="none" stroke={C} strokeWidth="3" />,
      <polygon key="r" points="30,100 100,40 170,100" fill="none" stroke={C} strokeWidth="3" strokeLinejoin="round" />,
      <rect key="d"  x="80" y="140" width="30" height="40" fill="none" stroke={C} strokeWidth="2.5" />,
      <rect key="wl" x="50" y="112" width="25" height="20" fill="none" stroke={C} strokeWidth="2" />,
      <rect key="wr" x="125" y="112" width="25" height="20" fill="none" stroke={C} strokeWidth="2" />,
      <rect key="ch" x="120" y="55" width="15" height="30" fill="none" stroke={C} strokeWidth="2.5" />,
      <path key="sm" d="M127 55 Q120 45 127 35 Q134 25 127 15" fill="none" stroke={C} strokeWidth="2" strokeLinecap="round" />,
      <circle key="dk" cx="105" cy="162" r="3" fill={C} />,
    ],
  },
  {
    word: 'cat',
    clue: 'Animals',
    steps: [
      <ellipse key="bd" cx="100" cy="135" rx="45" ry="38" fill="none" stroke={C} strokeWidth="3" />,
      <circle key="hd" cx="100" cy="78" r="34" fill="none" stroke={C} strokeWidth="3" />,
      <polygon key="el" points="68,55 76,22 91,50" fill="none" stroke={C} strokeWidth="2.5" />,
      <polygon key="er" points="109,50 124,22 132,55" fill="none" stroke={C} strokeWidth="2.5" />,
      <g key="ey"><ellipse cx="87" cy="72" rx="6" ry="7" fill={C} /><ellipse cx="113" cy="72" rx="6" ry="7" fill={C} /></g>,
      <g key="nm"><polygon points="97,82 103,82 100,87" fill={C} /><path d="M100 87 Q91 93 87 91 M100 87 Q109 93 113 91" fill="none" stroke={C} strokeWidth="1.5" strokeLinecap="round" /></g>,
      <g key="wh"><line x1="58" y1="80" x2="88" y2="83" stroke={C} strokeWidth="1.5" /><line x1="58" y1="87" x2="88" y2="86" stroke={C} strokeWidth="1.5" /><line x1="112" y1="83" x2="142" y2="80" stroke={C} strokeWidth="1.5" /><line x1="112" y1="86" x2="142" y2="87" stroke={C} strokeWidth="1.5" /></g>,
      <path key="tl" d="M145 145 Q175 125 170 95 Q165 72 152 82" fill="none" stroke={C} strokeWidth="3" strokeLinecap="round" />,
    ],
  },
  {
    word: 'sun',
    clue: 'Nature & Weather',
    steps: [
      <circle key="c" cx="100" cy="100" r="35" fill="none" stroke={C} strokeWidth="3" />,
      <line key="rt" x1="100" y1="57" x2="100" y2="20" stroke={C} strokeWidth="3" strokeLinecap="round" />,
      <line key="rb" x1="100" y1="143" x2="100" y2="180" stroke={C} strokeWidth="3" strokeLinecap="round" />,
      <g key="rl"><line x1="57" y1="100" x2="20" y2="100" stroke={C} strokeWidth="3" strokeLinecap="round" /><line x1="143" y1="100" x2="180" y2="100" stroke={C} strokeWidth="3" strokeLinecap="round" /></g>,
      <g key="rd"><line x1="75" y1="75" x2="48" y2="48" stroke={C} strokeWidth="3" strokeLinecap="round" /><line x1="125" y1="75" x2="152" y2="48" stroke={C} strokeWidth="3" strokeLinecap="round" /></g>,
      <g key="ru"><line x1="75" y1="125" x2="48" y2="152" stroke={C} strokeWidth="3" strokeLinecap="round" /><line x1="125" y1="125" x2="152" y2="152" stroke={C} strokeWidth="3" strokeLinecap="round" /></g>,
      <g key="ey"><circle cx="88" cy="95" r="5" fill={C} /><circle cx="112" cy="95" r="5" fill={C} /></g>,
      <path key="sm" d="M82 110 Q100 125 118 110" fill="none" stroke={C} strokeWidth="2.5" strokeLinecap="round" />,
    ],
  },
  {
    word: 'tree',
    clue: 'Nature',
    steps: [
      <rect key="tr" x="88" y="130" width="24" height="58" fill="none" stroke={C} strokeWidth="3" />,
      <ellipse key="f1" cx="100" cy="128" rx="45" ry="30" fill="none" stroke={C} strokeWidth="3" />,
      <ellipse key="f2" cx="100" cy="103" rx="38" ry="28" fill="none" stroke={C} strokeWidth="3" />,
      <ellipse key="f3" cx="100" cy="78" rx="28" ry="24" fill="none" stroke={C} strokeWidth="3" />,
      <polygon key="tp" points="100,36 87,65 113,65" fill="none" stroke={C} strokeWidth="2.5" />,
      <path key="r1" d="M88 188 Q70 182 60 188" fill="none" stroke={C} strokeWidth="2.5" strokeLinecap="round" />,
      <path key="r2" d="M112 188 Q130 182 140 188" fill="none" stroke={C} strokeWidth="2.5" strokeLinecap="round" />,
      <g key="ap"><circle cx="82" cy="112" r="7" fill="none" stroke="#ef4444" strokeWidth="2" /><circle cx="118" cy="95" r="7" fill="none" stroke="#ef4444" strokeWidth="2" /></g>,
    ],
  },
  {
    word: 'car',
    clue: 'Vehicles',
    steps: [
      <rect key="bd" x="18" y="112" width="164" height="52" rx="10" fill="none" stroke={C} strokeWidth="3" />,
      <path key="cb" d="M55 112 Q72 76 128 76 Q150 76 162 112" fill="none" stroke={C} strokeWidth="3" />,
      <g key="wl"><circle cx="52" cy="164" r="22" fill="none" stroke={C} strokeWidth="3" /><circle cx="52" cy="164" r="8" fill="none" stroke={C} strokeWidth="2" /></g>,
      <g key="wr"><circle cx="148" cy="164" r="22" fill="none" stroke={C} strokeWidth="3" /><circle cx="148" cy="164" r="8" fill="none" stroke={C} strokeWidth="2" /></g>,
      <path key="ws" d="M75 112 Q80 84 130 84 Q138 84 140 112" fill="none" stroke={C} strokeWidth="2" />,
      <rect key="sw" x="78" y="88" width="46" height="20" rx="3" fill="none" stroke={C} strokeWidth="2" />,
      <g key="hl"><ellipse cx="24" cy="126" rx="8" ry="5" fill="none" stroke={C} strokeWidth="2" /><ellipse cx="176" cy="126" rx="8" ry="5" fill="none" stroke={C} strokeWidth="2" /></g>,
      <g key="dr"><line x1="100" y1="114" x2="100" y2="156" stroke={C} strokeWidth="2" /><circle cx="92" cy="136" r="3" fill={C} /></g>,
    ],
  },
  {
    word: 'fish',
    clue: 'Sea Creatures',
    steps: [
      <ellipse key="bd" cx="92" cy="100" rx="60" ry="35" fill="none" stroke={C} strokeWidth="3" />,
      <polygon key="tl" points="152,100 185,70 185,130" fill="none" stroke={C} strokeWidth="3" strokeLinejoin="round" />,
      <g key="ey"><circle cx="52" cy="90" r="8" fill="none" stroke={C} strokeWidth="2.5" /><circle cx="50" cy="88" r="3" fill={C} /></g>,
      <path key="tf" d="M78 65 Q100 45 122 65" fill="none" stroke={C} strokeWidth="2.5" />,
      <path key="mo" d="M28 100 Q36 94 28 107" fill="none" stroke={C} strokeWidth="2.5" strokeLinecap="round" />,
      <path key="bf" d="M100 135 Q112 152 124 135" fill="none" stroke={C} strokeWidth="2.5" />,
      <g key="sc"><path d="M78 90 Q90 79 102 90 Q114 79 126 90" fill="none" stroke={C} strokeWidth="1.5" /><path d="M78 107 Q90 96 102 107 Q114 96 126 107" fill="none" stroke={C} strokeWidth="1.5" /></g>,
      <g key="bb"><circle cx="22" cy="72" r="4" fill="none" stroke={C} strokeWidth="1.5" /><circle cx="15" cy="56" r="6" fill="none" stroke={C} strokeWidth="1.5" /><circle cx="26" cy="46" r="3" fill="none" stroke={C} strokeWidth="1.5" /></g>,
    ],
  },
  {
    word: 'bird',
    clue: 'Animals that fly',
    steps: [
      <ellipse key="bd" cx="96" cy="118" rx="42" ry="30" fill="none" stroke={C} strokeWidth="3" />,
      <circle key="hd" cx="148" cy="90" r="25" fill="none" stroke={C} strokeWidth="3" />,
      <polygon key="bk" points="173,86 192,91 173,97" fill={C} />,
      <circle key="ey" cx="158" cy="84" r="5" fill={C} />,
      <path key="wg" d="M58 110 Q42 83 65 70 Q88 57 96 84" fill="none" stroke={C} strokeWidth="2.5" strokeLinejoin="round" />,
      <path key="tl" d="M55 128 Q38 138 33 128 Q38 118 55 122" fill="none" stroke={C} strokeWidth="2.5" />,
      <g key="ll"><line x1="88" y1="148" x2="76" y2="172" stroke={C} strokeWidth="2.5" strokeLinecap="round" /><line x1="76" y1="172" x2="60" y2="172" stroke={C} strokeWidth="2" strokeLinecap="round" /></g>,
      <g key="rl"><line x1="108" y1="148" x2="120" y2="172" stroke={C} strokeWidth="2.5" strokeLinecap="round" /><line x1="120" y1="172" x2="104" y2="172" stroke={C} strokeWidth="2" strokeLinecap="round" /></g>,
    ],
  },
  {
    word: 'star',
    clue: 'Shapes & Space',
    steps: [
      <line key="s1" x1="100" y1="18" x2="158" y2="148" stroke={C} strokeWidth="2.5" strokeLinecap="round" />,
      <line key="s2" x1="158" y1="148" x2="28" y2="62" stroke={C} strokeWidth="2.5" strokeLinecap="round" />,
      <line key="s3" x1="28" y1="62" x2="172" y2="62" stroke={C} strokeWidth="2.5" strokeLinecap="round" />,
      <line key="s4" x1="172" y1="62" x2="42" y2="148" stroke={C} strokeWidth="2.5" strokeLinecap="round" />,
      <line key="s5" x1="42" y1="148" x2="100" y2="18" stroke={C} strokeWidth="2.5" strokeLinecap="round" />,
      <g key="gl"><circle cx="40" cy="38" r="4" fill="#eab308" /><circle cx="160" cy="38" r="3" fill="#eab308" /><circle cx="20" cy="105" r="3" fill="#eab308" /></g>,
      <g key="sp1"><line x1="30" y1="30" x2="38" y2="46" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" /><line x1="22" y1="38" x2="38" y2="38" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" /></g>,
      <g key="sp2"><line x1="162" y1="30" x2="154" y2="46" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" /><line x1="170" y1="38" x2="154" y2="38" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" /></g>,
    ],
  },
  {
    word: 'boat',
    clue: 'Water Vehicles',
    steps: [
      <path key="hl" d="M18 140 Q100 172 182 140" fill="none" stroke={C} strokeWidth="3" strokeLinecap="round" />,
      <line key="ls" x1="18" y1="140" x2="34" y2="108" stroke={C} strokeWidth="3" strokeLinecap="round" />,
      <line key="rs" x1="182" y1="140" x2="166" y2="108" stroke={C} strokeWidth="3" strokeLinecap="round" />,
      <line key="dk" x1="34" y1="108" x2="166" y2="108" stroke={C} strokeWidth="3" strokeLinecap="round" />,
      <line key="ms" x1="100" y1="108" x2="100" y2="28" stroke={C} strokeWidth="3" strokeLinecap="round" />,
      <polygon key="sl" points="100,33 100,105 158,105" fill="none" stroke={C} strokeWidth="2.5" strokeLinejoin="round" />,
      <polygon key="fg" points="100,33 100,50 118,41" fill={C} />,
      <path key="wv" d="M8 158 Q28 148 48 158 Q68 168 88 158 Q108 148 128 158 Q148 168 168 158 Q188 148 200 158" fill="none" stroke={C} strokeWidth="2" strokeLinecap="round" />,
    ],
  },
  {
    word: 'umbrella',
    clue: 'Objects & Accessories',
    steps: [
      <path key="ca" d="M22 100 Q100 22 178 100" fill="none" stroke={C} strokeWidth="3" />,
      <g key="fl"><path d="M22 100 Q16 112 32 102" fill="none" stroke={C} strokeWidth="2" /><path d="M178 100 Q184 112 168 102" fill="none" stroke={C} strokeWidth="2" /></g>,
      <line key="pl" x1="100" y1="100" x2="100" y2="165" stroke={C} strokeWidth="3" strokeLinecap="round" />,
      <path key="hd" d="M100 165 Q100 188 78 188 Q62 188 62 172" fill="none" stroke={C} strokeWidth="3" strokeLinecap="round" />,
      <g key="rb"><line x1="22" y1="100" x2="100" y2="100" stroke={C} strokeWidth="1.5" opacity="0.5" /><line x1="60" y1="60" x2="100" y2="100" stroke={C} strokeWidth="1.5" opacity="0.5" /></g>,
      <g key="rr"><line x1="178" y1="100" x2="100" y2="100" stroke={C} strokeWidth="1.5" opacity="0.5" /><line x1="140" y1="60" x2="100" y2="100" stroke={C} strokeWidth="1.5" opacity="0.5" /></g>,
      <g key="rd"><line x1="50" y1="122" x2="44" y2="144" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" /><line x1="82" y1="128" x2="76" y2="150" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" /><line x1="140" y1="122" x2="134" y2="144" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" /></g>,
      <g key="rd2"><line x1="162" y1="130" x2="156" y2="152" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" /><line x1="120" y1="135" x2="114" y2="157" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" /></g>,
    ],
  },
  {
    word: 'apple',
    clue: 'Fruits & Food',
    steps: [
      <path key="rh" d="M100 52 Q158 52 158 112 Q158 162 100 168" fill="none" stroke={C} strokeWidth="3" />,
      <path key="lh" d="M100 52 Q42 52 42 112 Q42 162 100 168" fill="none" stroke={C} strokeWidth="3" />,
      <path key="ti" d="M84 52 Q100 42 116 52" fill="none" stroke={C} strokeWidth="2.5" />,
      <path key="st" d="M100 42 Q106 26 118 20" fill="none" stroke={C} strokeWidth="3" strokeLinecap="round" />,
      <path key="lf" d="M118 20 Q135 30 124 46 Q118 36 118 20" fill="none" stroke={C} strokeWidth="2.5" />,
      <ellipse key="sh" cx="70" cy="82" rx="11" ry="17" fill="none" stroke={C} strokeWidth="1.5" opacity="0.4" transform="rotate(-20,70,82)" />,
      <path key="bt" d="M92 168 Q100 174 108 168" fill="none" stroke={C} strokeWidth="2" />,
      <g key="sd"><line x1="92" y1="120" x2="108" y2="130" stroke={C} strokeWidth="1.2" opacity="0.35" /><line x1="92" y1="130" x2="108" y2="120" stroke={C} strokeWidth="1.2" opacity="0.35" /></g>,
    ],
  },
  {
    word: 'bicycle',
    clue: 'Vehicles',
    steps: [
      <circle key="rw" cx="48" cy="145" r="33" fill="none" stroke={C} strokeWidth="3" />,
      <circle key="fw" cx="155" cy="145" r="33" fill="none" stroke={C} strokeWidth="3" />,
      <g key="fr"><line x1="88" y1="95" x2="148" y2="88" stroke={C} strokeWidth="3" strokeLinecap="round" /><line x1="95" y1="145" x2="148" y2="88" stroke={C} strokeWidth="3" strokeLinecap="round" /></g>,
      <g key="st"><line x1="95" y1="145" x2="85" y2="93" stroke={C} strokeWidth="3" strokeLinecap="round" /><line x1="48" y1="145" x2="95" y2="145" stroke={C} strokeWidth="3" strokeLinecap="round" /></g>,
      <line key="ss" x1="48" y1="145" x2="85" y2="93" stroke={C} strokeWidth="2.5" strokeLinecap="round" />,
      <g key="hb"><line x1="148" y1="88" x2="162" y2="74" stroke={C} strokeWidth="3" strokeLinecap="round" /><line x1="155" y1="70" x2="168" y2="80" stroke={C} strokeWidth="3" strokeLinecap="round" /></g>,
      <g key="se"><line x1="70" y1="90" x2="96" y2="90" stroke={C} strokeWidth="4" strokeLinecap="round" /><line x1="84" y1="90" x2="84" y2="98" stroke={C} strokeWidth="3" strokeLinecap="round" /></g>,
      <g key="pd"><line x1="95" y1="145" x2="108" y2="160" stroke={C} strokeWidth="3" strokeLinecap="round" /><line x1="108" y1="160" x2="122" y2="156" stroke={C} strokeWidth="3" strokeLinecap="round" /></g>,
    ],
  },
  {
    word: 'cloud',
    clue: 'Weather & Sky',
    steps: [
      <circle key="c1" cx="100" cy="95" r="35" fill="none" stroke={C} strokeWidth="3" />,
      <circle key="c2" cx="63" cy="112" r="25" fill="none" stroke={C} strokeWidth="3" />,
      <circle key="c3" cx="140" cy="112" r="25" fill="none" stroke={C} strokeWidth="3" />,
      <circle key="c4" cx="70" cy="80" r="22" fill="none" stroke={C} strokeWidth="3" />,
      <circle key="c5" cx="128" cy="77" r="22" fill="none" stroke={C} strokeWidth="3" />,
      <line key="fl" x1="40" y1="132" x2="164" y2="132" stroke={C} strokeWidth="3" strokeLinecap="round" />,
      <g key="r1"><line x1="68" y1="142" x2="60" y2="167" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" /><line x1="100" y1="140" x2="92" y2="165" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" /><line x1="132" y1="142" x2="124" y2="167" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" /></g>,
      <g key="r2"><line x1="52" y1="152" x2="44" y2="177" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" /><line x1="116" y1="150" x2="108" y2="175" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" /><line x1="148" y1="152" x2="140" y2="177" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" /></g>,
    ],
  },
  {
    word: 'elephant',
    clue: 'Animals',
    steps: [
      <ellipse key="bd" cx="108" cy="128" rx="65" ry="45" fill="none" stroke={C} strokeWidth="3" />,
      <circle key="hd" cx="60" cy="92" r="34" fill="none" stroke={C} strokeWidth="3" />,
      <path key="tk" d="M42 118 Q28 138 34 158 Q40 172 56 167" fill="none" stroke={C} strokeWidth="3" strokeLinecap="round" />,
      <ellipse key="er" cx="36" cy="80" rx="18" ry="26" fill="none" stroke={C} strokeWidth="2.5" />,
      <circle key="ey" cx="68" cy="84" r="6" fill={C} />,
      <path key="ts" d="M50 114 Q44 128 55 136" fill="none" stroke={C} strokeWidth="3" strokeLinecap="round" />,
      <g key="fl"><rect x="78" y="168" width="18" height="24" rx="4" fill="none" stroke={C} strokeWidth="2.5" /><rect x="102" y="168" width="18" height="24" rx="4" fill="none" stroke={C} strokeWidth="2.5" /></g>,
      <g key="bl"><rect x="130" y="168" width="18" height="24" rx="4" fill="none" stroke={C} strokeWidth="2.5" /><rect x="152" y="168" width="18" height="24" rx="4" fill="none" stroke={C} strokeWidth="2.5" /><path d="M170 112 Q183 98 178 82" fill="none" stroke={C} strokeWidth="2.5" strokeLinecap="round" /></g>,
    ],
  },
  {
    word: 'guitar',
    clue: 'Musical Instruments',
    steps: [
      <ellipse key="lb" cx="100" cy="150" rx="42" ry="36" fill="none" stroke={C} strokeWidth="3" />,
      <ellipse key="ub" cx="100" cy="86" rx="30" ry="28" fill="none" stroke={C} strokeWidth="3" />,
      <g key="ws"><line x1="58" y1="122" x2="70" y2="100" stroke={C} strokeWidth="3" strokeLinecap="round" /><line x1="142" y1="122" x2="130" y2="100" stroke={C} strokeWidth="3" strokeLinecap="round" /></g>,
      <rect key="nk" x="93" y="22" width="14" height="62" rx="3" fill="none" stroke={C} strokeWidth="2.5" />,
      <rect key="hs" x="87" y="10" width="26" height="18" rx="4" fill="none" stroke={C} strokeWidth="2.5" />,
      <circle key="sh" cx="100" cy="148" r="14" fill="none" stroke={C} strokeWidth="2" />,
      <g key="sr"><line x1="95" y1="22" x2="95" y2="162" stroke={C} strokeWidth="1" opacity="0.6" /><line x1="100" y1="22" x2="100" y2="162" stroke={C} strokeWidth="1" opacity="0.6" /><line x1="105" y1="22" x2="105" y2="162" stroke={C} strokeWidth="1" opacity="0.6" /></g>,
      <g key="ft"><line x1="93" y1="36" x2="107" y2="36" stroke={C} strokeWidth="1.5" /><line x1="93" y1="50" x2="107" y2="50" stroke={C} strokeWidth="1.5" /><circle cx="89" cy="14" r="3" fill={C} /><circle cx="111" cy="14" r="3" fill={C} /></g>,
    ],
  },
]

export default function Pictionary() {
  const [list]                    = useState(() => shuffle(SUBJECTS))
  const [idx, setIdx]             = useState(0)
  const [step, setStep]           = useState(0)
  const [input, setInput]         = useState('')
  const [status, setStatus]       = useState('playing')
  const [wrongGuesses, setWrong]  = useState([])
  const [score, setScore]         = useState(0)
  const [total, setTotal]         = useState(0)
  const inputRef = useRef(null)

  const subject  = list[idx]
  const maxSteps = subject.steps.length

  function guess(e) {
    e.preventDefault()
    const g = input.trim().toLowerCase()
    if (!g || status !== 'playing') return
    setInput('')
    if (g === subject.word) {
      const points = Math.max(1, maxSteps - step)
      setScore(s => s + points)
      setTotal(t => t + 1)
      setStatus('won')
    } else {
      setWrong(w => w.includes(g) ? w : [...w, g])
    }
    inputRef.current?.focus()
  }

  function revealMore() {
    if (step + 1 >= maxSteps) {
      setTotal(t => t + 1)
      setStatus('lost')
    } else {
      setStep(s => s + 1)
    }
  }

  function next() {
    setIdx(i => (i + 1) % list.length)
    setStep(0)
    setInput('')
    setStatus('playing')
    setWrong([])
  }

  const points = Math.max(1, maxSteps - step)

  return (
    <div className="pict-page">
      <Breadcrumb />

      <div className="pict-header">
        <h1>Pictionary</h1>
        <div className="pict-score">Score: {score} / {total}</div>
      </div>

      <div className="pict-meta">
        <span className="pict-category-badge">{subject.clue}</span>
        <span className="pict-step-counter">Step {step + 1} of {maxSteps}</span>
        {status === 'playing' && <span className="pict-points-hint">+{points} pts if correct now</span>}
      </div>

      <div className="pict-canvas-wrap">
        <svg viewBox="0 0 200 200" className="pict-canvas">
          {subject.steps.slice(0, step + 1)}
        </svg>
      </div>

      {status === 'playing' && (
        <>
          <form className="pict-form" onSubmit={guess}>
            <input
              ref={inputRef}
              className="pict-input"
              type="text"
              placeholder="What is being drawn? Type your guess…"
              value={input}
              onChange={e => setInput(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
              autoComplete="off"
              autoFocus
            />
            <button className="pict-btn pict-btn--guess" type="submit" disabled={!input.trim()}>
              Guess
            </button>
          </form>

          <button className="pict-btn pict-btn--reveal" onClick={revealMore}>
            {step + 1 < maxSteps
              ? `Reveal next clue (${maxSteps - step - 1} more left)`
              : 'Give up — show the answer'}
          </button>

          {wrongGuesses.length > 0 && (
            <div className="pict-wrong-list">
              <span className="pict-wrong-label">Wrong guesses:</span>
              {wrongGuesses.map(w => (
                <span key={w} className="pict-wrong-badge">{w}</span>
              ))}
            </div>
          )}
        </>
      )}

      {status !== 'playing' && (
        <div className={`pict-result ${status === 'won' ? 'pict-result--won' : 'pict-result--lost'}`}>
          {status === 'won'
            ? <p>🎉 Correct! It&apos;s a <strong>{subject.word}</strong>! <span className="pict-pts">+{points} pts</span></p>
            : <p>The answer was <strong>{subject.word}</strong>. Better luck next time!</p>}
          <button className="pict-btn pict-btn--next" onClick={next}>
            {idx < list.length - 1 ? 'Next Drawing →' : 'Play Again →'}
          </button>
        </div>
      )}
    </div>
  )
}
