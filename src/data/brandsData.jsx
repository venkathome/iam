// ─── CARS ─────────────────────────────────────────────────────────────────────

function ToyotaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#EB0A1E"/>
      <ellipse cx="100" cy="100" rx="72" ry="43" stroke="white" strokeWidth="13" fill="none"/>
      <ellipse cx="100" cy="112" rx="28" ry="48" stroke="white" strokeWidth="13" fill="none"/>
      <ellipse cx="100" cy="57" rx="42" ry="12" fill="none" stroke="white" strokeWidth="12"/>
    </svg>
  )
}

function BMWLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="97" fill="#1C1C1C"/>
      <circle cx="100" cy="100" r="72" fill="white"/>
      <path d="M100,100 L100,28 A72,72 0 0,1 172,100 Z" fill="#0066B1"/>
      <path d="M100,100 L100,172 A72,72 0 0,1 28,100 Z" fill="#0066B1"/>
      <circle cx="100" cy="100" r="72" fill="none" stroke="#1C1C1C" strokeWidth="5"/>
    </svg>
  )
}

function MercedesLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="97" fill="white" stroke="#333" strokeWidth="8"/>
      <circle cx="100" cy="100" r="72" fill="none" stroke="#888" strokeWidth="3"/>
      <line x1="100" y1="100" x2="100" y2="32" stroke="#999" strokeWidth="13" strokeLinecap="round"/>
      <line x1="100" y1="100" x2="159" y2="134" stroke="#999" strokeWidth="13" strokeLinecap="round"/>
      <line x1="100" y1="100" x2="41" y2="134" stroke="#999" strokeWidth="13" strokeLinecap="round"/>
      <circle cx="100" cy="100" r="14" fill="white" stroke="#888" strokeWidth="3"/>
    </svg>
  )
}

function FordLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003087"/>
      <ellipse cx="100" cy="100" rx="90" ry="58" fill="none" stroke="#60A0FF" strokeWidth="5"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="62" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="bold">Ford</text>
    </svg>
  )
}

function HondaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <text x="100" y="132" textAnchor="middle" fill="white" fontSize="130" fontFamily="Arial Black, sans-serif" fontWeight="900">H</text>
    </svg>
  )
}

function VolkswagenLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="97" fill="#1B3B8A"/>
      <circle cx="100" cy="100" r="72" fill="none" stroke="white" strokeWidth="5"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="78" fontFamily="Arial Black, sans-serif" fontWeight="900">VW</text>
    </svg>
  )
}

function AudiLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#333"/>
      <circle cx="40" cy="100" r="32" fill="none" stroke="white" strokeWidth="10"/>
      <circle cx="77" cy="100" r="32" fill="none" stroke="white" strokeWidth="10"/>
      <circle cx="123" cy="100" r="32" fill="none" stroke="white" strokeWidth="10"/>
      <circle cx="160" cy="100" r="32" fill="none" stroke="white" strokeWidth="10"/>
    </svg>
  )
}

function TeslaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#E31937"/>
      <path d="M50,80 Q50,55 100,55 Q150,55 150,80" stroke="white" strokeWidth="16" fill="none" strokeLinecap="round"/>
      <rect x="89" y="55" width="22" height="95" rx="5" fill="white"/>
    </svg>
  )
}

function FerrariLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <path d="M100,28 L148,52 L148,138 L100,168 L52,138 L52,52 Z" fill="#D4AF37"/>
      <ellipse cx="100" cy="95" rx="14" ry="22" fill="#1A1A1A" transform="rotate(-10 100 95)"/>
      <circle cx="106" cy="74" r="11" fill="#1A1A1A"/>
      <path d="M112,82 L122,68 L127,73 L116,87 Z" fill="#1A1A1A"/>
      <rect x="89" y="112" width="8" height="24" rx="3" fill="#1A1A1A" transform="rotate(-8 89 112)"/>
      <rect x="100" y="112" width="8" height="24" rx="3" fill="#1A1A1A" transform="rotate(6 100 112)"/>
      <path d="M86,90 C77,80 74,67 81,64" stroke="#1A1A1A" strokeWidth="5" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

function LamborghiniLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#D4AF00"/>
      <path d="M100,28 L152,60 L152,140 L100,172 L48,140 L48,60 Z" fill="#1A1A1A"/>
      <ellipse cx="100" cy="100" rx="28" ry="24" fill="#D4AF00"/>
      <path d="M74,88 L52,70 L60,82 L74,88 Z" fill="#D4AF00"/>
      <path d="M126,88 L148,70 L140,82 L126,88 Z" fill="#D4AF00"/>
      <circle cx="92" cy="106" r="4" fill="#1A1A1A"/>
      <circle cx="108" cy="106" r="4" fill="#1A1A1A"/>
      <path d="M88,116 L100,124 L112,116" stroke="#1A1A1A" strokeWidth="4" fill="none"/>
    </svg>
  )
}

function PorscheLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M100,30 L148,54 L148,118 L100,145 L52,118 L52,54 Z" fill="none" stroke="#C4A400" strokeWidth="5"/>
      <ellipse cx="100" cy="90" rx="26" ry="22" fill="#C4A400"/>
      <ellipse cx="100" cy="86" rx="14" ry="18" fill="#1A1A1A" transform="rotate(-10 100 86)"/>
      <circle cx="104" cy="70" r="10" fill="#1A1A1A"/>
      <path d="M112,76 L120,64 L126,70 L116,82 Z" fill="#1A1A1A"/>
      <text x="100" y="172" textAnchor="middle" fill="#C4A400" fontSize="18" fontFamily="Arial Black, sans-serif" fontWeight="900">PORSCHE</text>
    </svg>
  )
}

function ChevroletLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M18,100 L52,82 L88,90 L100,82 L112,90 L148,82 L182,100 L148,118 L112,110 L100,118 L88,110 L52,118 Z" fill="#D4AF37"/>
    </svg>
  )
}

function HyundaiLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#002C5F"/>
      <ellipse cx="100" cy="100" rx="90" ry="62" fill="none" stroke="white" strokeWidth="6"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="95" fontFamily="Arial Black, sans-serif" fontWeight="900" fontStyle="italic">H</text>
    </svg>
  )
}

function KiaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#05141F"/>
      <text x="100" y="124" textAnchor="middle" fill="white" fontSize="68" fontFamily="Arial Black, sans-serif" fontWeight="900" fontStyle="italic">KIA</text>
    </svg>
  )
}

function NissanLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#C3002F"/>
      <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="8"/>
      <rect x="12" y="88" width="176" height="24" fill="#C3002F"/>
      <rect x="12" y="88" width="176" height="24" fill="none" stroke="white" strokeWidth="6"/>
      <text x="100" y="106" textAnchor="middle" fill="white" fontSize="20" fontFamily="Arial Black, sans-serif" fontWeight="900">NISSAN</text>
    </svg>
  )
}

function MazdaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <ellipse cx="100" cy="100" rx="80" ry="80" fill="none" stroke="#C0392B" strokeWidth="5"/>
      <path d="M100,50 L78,100 L50,84 L58,120 L100,105 L142,120 L150,84 L122,100 Z" fill="white"/>
      <ellipse cx="100" cy="100" rx="22" ry="22" fill="#1A1A1A"/>
      <ellipse cx="100" cy="100" rx="14" ry="14" fill="white" opacity="0.8"/>
    </svg>
  )
}

// ─── MOTORCYCLES ──────────────────────────────────────────────────────────────

function HarleyDavidsonLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <rect x="25" y="85" width="150" height="30" rx="6" fill="#FF6600"/>
      <path d="M100,30 L148,55 L148,125 L100,155 L52,125 L52,55 Z" fill="none" stroke="#FF6600" strokeWidth="6"/>
      <text x="100" y="113" textAnchor="middle" fill="white" fontSize="28" fontFamily="Arial Black, sans-serif" fontWeight="900">H-D</text>
    </svg>
  )
}

function DucatiLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <text x="100" y="125" textAnchor="middle" fill="white" fontSize="42" fontFamily="Arial Black, sans-serif" fontWeight="900">DUCATI</text>
    </svg>
  )
}

function YamahaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <circle cx="100" cy="100" r="88" fill="none" stroke="#CC0000" strokeWidth="6"/>
      <circle cx="100" cy="48" r="22" fill="none" stroke="#CC0000" strokeWidth="8"/>
      <circle cx="148" cy="126" r="22" fill="none" stroke="#CC0000" strokeWidth="8"/>
      <circle cx="52" cy="126" r="22" fill="none" stroke="#CC0000" strokeWidth="8"/>
      <line x1="100" y1="100" x2="100" y2="70" stroke="#CC0000" strokeWidth="8"/>
      <line x1="100" y1="100" x2="126" y2="113" stroke="#CC0000" strokeWidth="8"/>
      <line x1="100" y1="100" x2="74" y2="113" stroke="#CC0000" strokeWidth="8"/>
    </svg>
  )
}

function KawasakiLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="120" textAnchor="middle" fill="#00A550" fontSize="35" fontFamily="Arial Black, sans-serif" fontWeight="900">KAWASAKI</text>
    </svg>
  )
}

function KTMLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#FF6600"/>
      <text x="100" y="128" textAnchor="middle" fill="black" fontSize="80" fontFamily="Arial Black, sans-serif" fontWeight="900">KTM</text>
    </svg>
  )
}

function RoyalEnfieldLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#6B0A0A"/>
      <circle cx="100" cy="100" r="82" fill="none" stroke="#D4AF37" strokeWidth="5"/>
      <text x="100" y="96" textAnchor="middle" fill="#D4AF37" fontSize="26" fontFamily="Arial Black, sans-serif" fontWeight="900">ROYAL</text>
      <text x="100" y="126" textAnchor="middle" fill="#D4AF37" fontSize="26" fontFamily="Arial Black, sans-serif" fontWeight="900">ENFIELD</text>
    </svg>
  )
}

function TriumphLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="34" fontFamily="Arial Black, sans-serif" fontWeight="900">TRIUMPH</text>
    </svg>
  )
}

function SuzukiLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1155AA"/>
      <text x="100" y="132" textAnchor="middle" fill="white" fontSize="120" fontFamily="Arial Black, sans-serif" fontWeight="900">S</text>
    </svg>
  )
}

function IndianMotorcycleLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M70,85 C60,65 52,52 57,42 C64,52 70,64 72,76 Z" fill="#CC0000"/>
      <path d="M83,72 C78,50 76,38 82,30 C86,42 86,56 84,68 Z" fill="#D4AF37"/>
      <path d="M100,68 C100,46 102,34 108,28 C110,40 108,56 106,68 Z" fill="#CC0000"/>
      <path d="M117,72 C122,50 124,38 118,30 C114,42 114,56 116,68 Z" fill="#D4AF37"/>
      <path d="M130,85 C140,65 148,52 143,42 C136,52 130,64 128,76 Z" fill="#CC0000"/>
      <circle cx="100" cy="100" r="20" fill="#C8A882"/>
      <rect x="78" y="90" width="44" height="12" rx="4" fill="#CC0000"/>
      <text x="100" y="155" textAnchor="middle" fill="#CC0000" fontSize="26" fontFamily="Arial Black, sans-serif" fontWeight="900">INDIAN</text>
    </svg>
  )
}

function AprireLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M100,35 L155,150 M100,35 L45,150 M65,110 L135,110" stroke="white" strokeWidth="16" fill="none" strokeLinecap="round"/>
      <text x="100" y="182" textAnchor="middle" fill="#CC0000" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">APRILIA</text>
    </svg>
  )
}

function MVAgustaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <text x="100" y="96" textAnchor="middle" fill="white" fontSize="46" fontFamily="Arial Black, sans-serif" fontWeight="900">MV</text>
      <text x="100" y="138" textAnchor="middle" fill="white" fontSize="26" fontFamily="Arial Black, sans-serif" fontWeight="900">AGUSTA</text>
    </svg>
  )
}

function MotoGuzziLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <ellipse cx="100" cy="78" rx="20" ry="14" fill="#CC0000"/>
      <path d="M80,72 C56,56 40,48 32,54 C42,64 60,68 78,70 Z" fill="#CC0000"/>
      <path d="M120,72 C144,56 160,48 168,54 C158,64 140,68 122,70 Z" fill="#CC0000"/>
      <path d="M80,82 C70,90 66,104 70,116 C76,110 80,100 82,90 Z" fill="#CC0000"/>
      <path d="M120,82 C130,90 134,104 130,116 C124,110 120,100 118,90 Z" fill="#CC0000"/>
      <rect x="80" y="114" width="40" height="12" rx="4" fill="#CC0000"/>
      <text x="100" y="158" textAnchor="middle" fill="white" fontSize="17" fontFamily="Arial Black, sans-serif" fontWeight="900">MOTO GUZZI</text>
    </svg>
  )
}

function NortonLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="48" fontFamily="Arial Black, sans-serif" fontWeight="900">NORTON</text>
    </svg>
  )
}

function HusqvarnaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M55,50 L55,150 L80,150 L80,108 L120,150 L145,150 L100,100 L145,50 L120,50 L80,92 L80,50 Z" fill="#0D6BDE"/>
    </svg>
  )
}

function BenelliLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#006400"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="40" fontFamily="Arial Black, sans-serif" fontWeight="900">BENELLI</text>
    </svg>
  )
}

// ─── TECHNOLOGY ───────────────────────────────────────────────────────────────

function AppleLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#555"/>
      <path d="M100,44 C118,40 143,48 152,68 C162,88 160,112 146,128 C132,144 118,152 100,152 C82,152 68,144 54,128 C40,112 38,88 48,68 C57,48 82,40 100,44 Z" fill="#E8E8E8"/>
      <ellipse cx="145" cy="80" rx="28" ry="30" fill="#555"/>
      <path d="M100,44 C106,32 118,27 128,31 C120,42 110,47 100,44 Z" fill="#E8E8E8"/>
    </svg>
  )
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="white"/>
      <text x="100" y="126" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="50">
        <tspan fill="#4285F4">G</tspan>
        <tspan fill="#EA4335">o</tspan>
        <tspan fill="#FBBC05">o</tspan>
        <tspan fill="#4285F4">g</tspan>
        <tspan fill="#34A853">l</tspan>
        <tspan fill="#EA4335">e</tspan>
      </text>
    </svg>
  )
}

function MicrosoftLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="white"/>
      <rect x="50" y="50" width="45" height="45" fill="#F25022"/>
      <rect x="105" y="50" width="45" height="45" fill="#7FBA00"/>
      <rect x="50" y="105" width="45" height="45" fill="#00A4EF"/>
      <rect x="105" y="105" width="45" height="45" fill="#FFB900"/>
    </svg>
  )
}

function SamsungLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1428A0"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="33" fontFamily="Arial, sans-serif" fontWeight="bold">SAMSUNG</text>
    </svg>
  )
}

function SonyLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="62" fontFamily="Arial, sans-serif" fontWeight="bold">SONY</text>
    </svg>
  )
}

function AmazonLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#232F3E"/>
      <text x="100" y="105" textAnchor="middle" fill="white" fontSize="42" fontFamily="Arial, sans-serif" fontWeight="bold">amazon</text>
      <path d="M48,130 Q100,152 152,130" stroke="#FF9900" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M148,124 L154,132 L144,130 Z" fill="#FF9900"/>
    </svg>
  )
}

function MetaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#0866FF"/>
      <path d="M40,100 C40,76 54,60 72,60 C88,60 98,74 100,100 C102,74 112,60 128,60 C146,60 160,76 160,100 C160,126 146,140 128,140 C112,140 102,126 100,100 C98,126 88,140 72,140 C54,140 40,126 40,100 Z" fill="white"/>
    </svg>
  )
}

function NetflixLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#E50914"/>
      <text x="100" y="132" textAnchor="middle" fill="white" fontSize="130" fontFamily="Arial Black, sans-serif" fontWeight="900">N</text>
    </svg>
  )
}

function IntelLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#0071C5"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="58" fontFamily="Arial, sans-serif" fontWeight="bold" fontStyle="italic">intel</text>
    </svg>
  )
}

function NvidiaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M30,90 C30,62 54,42 80,42 L80,58 C62,58 48,72 48,90 L48,110 C48,128 62,142 80,142 L80,158 C54,158 30,138 30,110 Z" fill="#76B900"/>
      <path d="M80,42 L80,158 L120,158 L120,42 Z" fill="#76B900"/>
      <text x="130" y="120" fill="#76B900" fontSize="28" fontFamily="Arial Black, sans-serif" fontWeight="900">DIA</text>
    </svg>
  )
}

function SpotifyLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="97" fill="#1DB954"/>
      <path d="M48,72 Q100,58 152,72" stroke="white" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d="M55,100 Q100,88 145,100" stroke="white" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d="M62,128 Q100,118 138,128" stroke="white" strokeWidth="12" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

function TwitterLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="130" textAnchor="middle" fill="white" fontSize="120" fontFamily="Arial Black, sans-serif" fontWeight="900">𝕏</text>
    </svg>
  )
}

function TikTokLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#010101"/>
      <path d="M115,38 C120,55 130,65 148,70 L148,92 C136,90 126,84 118,76 L118,130 C118,154 98,172 74,168 C50,164 36,144 42,122 C48,100 72,88 94,96 L94,118 C84,114 74,120 72,130 C70,140 78,150 88,152 C98,154 108,146 108,136 L108,38 Z" fill="white"/>
      <path d="M112,34 C117,51 127,61 145,66 L148,92 C136,90 126,84 118,76 L118,130 C118,154 98,172 74,168 C50,164 36,144 42,122" fill="none" stroke="#EE1D52" strokeWidth="5"/>
      <path d="M118,76 L118,130 C118,154 98,172 74,168 C50,164 36,144 42,122 C48,100 72,88 94,96 L94,118" fill="none" stroke="#69C9D0" strokeWidth="5"/>
    </svg>
  )
}

function AdobeLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#FF0000"/>
      <polygon points="100,35 158,155 42,155" fill="white"/>
      <polygon points="100,57 148,155 52,155" fill="#FF0000"/>
      <rect x="66" y="116" width="68" height="14" fill="#FF0000"/>
    </svg>
  )
}

function UberLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="62" fontFamily="Arial Black, sans-serif" fontWeight="900">Uber</text>
    </svg>
  )
}

function PayPalLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003087"/>
      <text x="78" y="120" fill="#009cde" fontSize="110" fontFamily="Arial Black, sans-serif" fontWeight="900">P</text>
      <text x="92" y="120" fill="white" fontSize="110" fontFamily="Arial Black, sans-serif" fontWeight="900">P</text>
    </svg>
  )
}

// ─── FOOD & BEVERAGES ─────────────────────────────────────────────────────────

function McDonaldsLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#DA291C"/>
      <text x="100" y="140" textAnchor="middle" fill="#FFC72C" fontSize="140" fontFamily="Arial Black, sans-serif" fontWeight="900">M</text>
    </svg>
  )
}

function CocaColaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#E2001A"/>
      <text x="100" y="88" textAnchor="middle" fill="white" fontSize="34" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="bold">Coca-Cola</text>
      <path d="M30,110 Q100,130 170,110" stroke="white" strokeWidth="3" fill="none"/>
      <text x="100" y="148" textAnchor="middle" fill="white" fontSize="28" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="bold">Coca-Cola</text>
    </svg>
  )
}

function PepsiLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="97" fill="white"/>
      <path d="M3,100 A97,97 0 0,0 197,100 Z" fill="#EE1C25"/>
      <path d="M3,100 A97,97 0 0,1 197,100 Z" fill="#004B93"/>
      <path d="M3,100 Q55,88 100,102 Q148,116 197,100" stroke="white" strokeWidth="22" fill="none" strokeLinecap="round"/>
      <circle cx="100" cy="100" r="97" fill="none" stroke="#DDD" strokeWidth="2"/>
    </svg>
  )
}

function StarbucksLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#00704A"/>
      <circle cx="100" cy="100" r="82" fill="none" stroke="white" strokeWidth="6"/>
      <circle cx="100" cy="78" r="18" fill="white"/>
      <path d="M82,94 C82,94 90,114 100,116 C110,114 118,94 118,94 Z" fill="white"/>
      <path d="M82,94 C72,86 66,95 66,104 C66,116 74,126 82,128 L78,144 Q100,138 122,144 L118,128 C126,126 134,116 134,104 C134,95 128,86 118,94" fill="white"/>
      <path d="M82,96 C82,82 100,74 100,74 C100,74 118,82 118,96" stroke="#00704A" strokeWidth="5" fill="none"/>
      <path d="M66,104 L134,104" stroke="#00704A" strokeWidth="4"/>
    </svg>
  )
}

function KFCLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#E4002B"/>
      <ellipse cx="100" cy="62" rx="38" ry="28" fill="white"/>
      <circle cx="100" cy="96" r="30" fill="#FFCC99"/>
      <circle cx="89" cy="92" r="9" fill="none" stroke="#333" strokeWidth="3"/>
      <circle cx="111" cy="92" r="9" fill="none" stroke="#333" strokeWidth="3"/>
      <line x1="78" y1="88" x2="72" y2="88" stroke="#333" strokeWidth="3"/>
      <line x1="120" y1="88" x2="126" y2="88" stroke="#333" strokeWidth="3"/>
      <path d="M88,108 Q100,115 112,108" stroke="white" strokeWidth="4" fill="none"/>
      <path d="M88,128 L100,136 L112,128 L100,120 Z" fill="#CC0000"/>
      <text x="100" y="174" textAnchor="middle" fill="white" fontSize="30" fontFamily="Arial Black, sans-serif" fontWeight="900">KFC</text>
    </svg>
  )
}

function PizzaHutLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#EE1C25"/>
      <path d="M20,108 L100,30 L180,108 Z" fill="#CC0000"/>
      <ellipse cx="100" cy="108" rx="80" ry="14" fill="#BB0000"/>
      <text x="100" y="148" textAnchor="middle" fill="white" fontSize="24" fontFamily="Arial Black, sans-serif" fontWeight="900">PIZZA HUT</text>
    </svg>
  )
}

function BurgerKingLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#F5821F"/>
      <ellipse cx="100" cy="70" rx="75" ry="26" fill="#D62C2C"/>
      <ellipse cx="100" cy="58" rx="75" ry="22" fill="#D62C2C"/>
      <text x="100" y="112" textAnchor="middle" fill="white" fontSize="38" fontFamily="Arial Black, sans-serif" fontWeight="900">BURGER</text>
      <text x="100" y="148" textAnchor="middle" fill="white" fontSize="38" fontFamily="Arial Black, sans-serif" fontWeight="900">KING</text>
      <ellipse cx="100" cy="160" rx="75" ry="22" fill="#D62C2C"/>
    </svg>
  )
}

function SubwayLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#009B48"/>
      <text x="100" y="126" textAnchor="middle" fill="#FFC600" fontSize="56" fontFamily="Arial Black, sans-serif" fontWeight="900">SUBWAY</text>
    </svg>
  )
}

function DominosLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#006491"/>
      <rect x="30" y="60" width="64" height="80" rx="8" fill="#E31837"/>
      <circle cx="52" cy="82" r="10" fill="white"/>
      <circle cx="74" cy="82" r="10" fill="white"/>
      <circle cx="52" cy="104" r="10" fill="white"/>
      <rect x="106" y="60" width="64" height="80" rx="8" fill="#E31837"/>
      <circle cx="122" cy="80" r="10" fill="white"/>
      <circle cx="154" cy="80" r="10" fill="white"/>
      <circle cx="122" cy="100" r="10" fill="white"/>
      <circle cx="154" cy="100" r="10" fill="white"/>
      <circle cx="122" cy="120" r="10" fill="white"/>
      <circle cx="154" cy="120" r="10" fill="white"/>
    </svg>
  )
}

function TacoBellLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#702082"/>
      <path d="M100,30 C100,30 140,50 150,80 C158,105 148,130 130,142 C116,150 100,152 84,148 L76,160 C82,160 120,162 138,148 C162,130 172,100 160,68 C148,36 120,22 100,22 Z" fill="#EE3A24"/>
      <path d="M100,30 C82,30 62,44 56,68 C50,92 62,118 84,134 L76,160 C48,148 30,120 30,90 C30,56 62,26 100,22 Z" fill="#F2B705"/>
      <text x="100" y="185" textAnchor="middle" fill="white" fontSize="20" fontFamily="Arial Black, sans-serif" fontWeight="900">TACO BELL</text>
    </svg>
  )
}

function DunkinLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#FF6E00"/>
      <text x="100" y="100" textAnchor="middle" fill="white" fontSize="44" fontFamily="Arial Black, sans-serif" fontWeight="900">Dunkin'</text>
      <text x="100" y="148" textAnchor="middle" fill="#DA1884" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">★ ★ ★ ★ ★</text>
    </svg>
  )
}

function RedBullLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0001"/>
      <circle cx="100" cy="84" r="55" fill="#FFC906"/>
      <ellipse cx="72" cy="80" rx="26" ry="28" fill="#CC0001"/>
      <ellipse cx="128" cy="80" rx="26" ry="28" fill="#CC0001"/>
      <path d="M72,56 C62,44 55,38 52,42 C55,50 62,56 70,58 Z" fill="#CC0001"/>
      <path d="M128,56 C138,44 145,38 148,42 C145,50 138,56 130,58 Z" fill="#CC0001"/>
      <text x="100" y="165" textAnchor="middle" fill="white" fontSize="20" fontFamily="Arial Black, sans-serif" fontWeight="900">RED BULL</text>
    </svg>
  )
}

function HeinekenLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#007A33"/>
      <circle cx="100" cy="90" r="62" fill="none" stroke="white" strokeWidth="5"/>
      <circle cx="100" cy="90" r="50" fill="#CC0000"/>
      <polygon points="100,58 110,82 136,82 115,98 122,122 100,106 78,122 85,98 64,82 90,82" fill="white"/>
      <text x="100" y="170" textAnchor="middle" fill="white" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">HEINEKEN</text>
    </svg>
  )
}

function LaysLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#FFD700"/>
      <ellipse cx="100" cy="100" rx="85" ry="75" fill="#D62828"/>
      <text x="100" y="116" textAnchor="middle" fill="#FFD700" fontSize="62" fontFamily="Arial Black, sans-serif" fontWeight="900" fontStyle="italic">Lay's</text>
    </svg>
  )
}

function OreoLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <circle cx="100" cy="100" r="78" fill="#2C1B0E"/>
      <circle cx="100" cy="100" r="62" fill="#F5F0E8"/>
      <circle cx="100" cy="100" r="50" fill="#2C1B0E"/>
      <text x="100" y="108" textAnchor="middle" fill="white" fontSize="28" fontFamily="Arial Black, sans-serif" fontWeight="900">OREO</text>
      <path d="M42,100 Q100,75 158,100 Q100,125 42,100 Z" fill="none" stroke="white" strokeWidth="2" opacity="0.4"/>
    </svg>
  )
}

function NutellaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#FFFFFF"/>
      <rect x="0" y="0" width="200" height="100" rx="20" fill="#C8391C"/>
      <rect x="0" y="80" width="200" height="120" rx="0" fill="#C8391C"/>
      <rect x="0" y="100" width="200" height="100" rx="20" fill="#4A2C0A"/>
      <rect x="0" y="100" width="200" height="20" rx="0" fill="#4A2C0A"/>
      <text x="100" y="76" textAnchor="middle" fill="white" fontSize="40" fontFamily="Arial Black, sans-serif" fontWeight="900" fontStyle="italic">Nutella</text>
      <text x="100" y="148" textAnchor="middle" fill="white" fontSize="16" fontFamily="Arial, sans-serif">hazelnut spread</text>
    </svg>
  )
}

// ─── SPORTS ───────────────────────────────────────────────────────────────────

function NikeLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M20,122 C50,90 115,60 168,68 C130,80 92,100 70,120 Z" fill="white"/>
    </svg>
  )
}

function AdidasLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <rect x="50" y="68" width="100" height="16" rx="5" fill="white"/>
      <rect x="50" y="92" width="100" height="16" rx="5" fill="white"/>
      <rect x="50" y="116" width="100" height="16" rx="5" fill="white"/>
    </svg>
  )
}

function PumaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <ellipse cx="105" cy="75" rx="28" ry="18" fill="white" transform="rotate(-20 105 75)"/>
      <circle cx="88" cy="64" r="15" fill="white"/>
      <ellipse cx="72" cy="58" rx="5" ry="9" fill="white"/>
      <ellipse cx="80" cy="55" rx="5" ry="9" fill="white"/>
      <path d="M100,82 C105,100 108,118 104,140 C100,155 90,160 80,155 C88,148 92,138 90,125 C85,128 78,128 72,120 C80,120 86,115 86,106 C80,100 72,98 65,88 C74,88 84,92 92,92 Z" fill="white"/>
      <text x="100" y="184" textAnchor="middle" fill="white" fontSize="28" fontFamily="Arial Black, sans-serif" fontWeight="900">PUMA</text>
    </svg>
  )
}

function ReebokLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <text x="100" y="122" textAnchor="middle" fill="white" fontSize="50" fontFamily="Arial Black, sans-serif" fontWeight="900">Reebok</text>
    </svg>
  )
}

function UnderArmourLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="125" textAnchor="middle" fill="white" fontSize="90" fontFamily="Arial Black, sans-serif" fontWeight="900">UA</text>
    </svg>
  )
}

function NewBalanceLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CF0A2C"/>
      <text x="100" y="132" textAnchor="middle" fill="white" fontSize="130" fontFamily="Arial Black, sans-serif" fontWeight="900">N</text>
    </svg>
  )
}

function ConverseLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <circle cx="100" cy="90" r="58" fill="none" stroke="white" strokeWidth="5"/>
      <polygon points="100,35 113,72 152,73 121,97 132,135 100,112 68,135 79,97 48,73 87,72" fill="white"/>
      <text x="100" y="170" textAnchor="middle" fill="white" fontSize="20" fontFamily="Arial Black, sans-serif" fontWeight="900">ALL STAR</text>
    </svg>
  )
}

function VansLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <rect x="30" y="72" width="140" height="56" rx="8" fill="none" stroke="white" strokeWidth="4"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="58" fontFamily="Arial Black, sans-serif" fontWeight="900">VANS</text>
    </svg>
  )
}

function LacosteLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#FFFFFF"/>
      <ellipse cx="100" cy="100" rx="78" ry="78" fill="#009A44" opacity="0.1"/>
      <path d="M52,100 C52,78 62,62 78,58 C86,56 92,60 96,66 C92,62 85,62 80,68 C72,78 74,98 82,110 C88,118 96,120 100,116 C96,122 86,124 78,118 C62,108 52,122 52,100 Z" fill="#009A44"/>
      <path d="M78,68 C82,64 88,64 92,70 C96,78 96,92 90,102 C86,110 80,114 76,110 C82,108 86,100 86,90 C86,80 82,72 78,68 Z" fill="#009A44"/>
      <path d="M92,70 C96,76 100,86 100,96 C100,106 96,114 90,118 L90,102 C96,92 96,78 92,70 Z" fill="#009A44"/>
      <path d="M98,60 C104,56 112,60 116,68 C122,80 120,100 112,112 C108,118 104,120 100,118 C104,114 108,106 110,96 C112,84 110,72 106,66 C104,62 100,60 98,60 Z" fill="#009A44"/>
      <text x="115" y="115" fill="#009A44" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">LACOSTE</text>
    </svg>
  )
}

function AsicsLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003DA5"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="48" fontFamily="Arial Black, sans-serif" fontWeight="900">ASICS</text>
    </svg>
  )
}

function FilaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="white"/>
      <rect x="0" y="55" width="200" height="90" rx="0" fill="#003DA5"/>
      <rect x="0" y="55" width="200" height="90" rx="20" fill="#003DA5"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="72" fontFamily="Arial Black, sans-serif" fontWeight="900">FILA</text>
      <rect x="0" y="145" width="200" height="10" rx="5" fill="#CC0000"/>
    </svg>
  )
}

function ChampionLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="130" textAnchor="middle" fill="#CC0000" fontSize="130" fontFamily="Arial Black, sans-serif" fontWeight="900" fontStyle="italic">C</text>
      <text x="100" y="175" textAnchor="middle" fill="white" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">CHAMPION</text>
    </svg>
  )
}

function MizunoLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003DA5"/>
      <path d="M40,150 L80,50 L100,100 L120,50 L160,150 L145,150 L120,88 L100,130 L80,88 L55,150 Z" fill="white"/>
    </svg>
  )
}

function WilsonLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="44" fontFamily="Arial Black, sans-serif" fontWeight="900">WILSON</text>
    </svg>
  )
}

function HeadLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="72" fontFamily="Arial Black, sans-serif" fontWeight="900">HEAD</text>
    </svg>
  )
}

// ─── AIRLINES ─────────────────────────────────────────────────────────────────

function EmiratesLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#C60C30"/>
      <text x="100" y="116" textAnchor="middle" fill="#D4AF37" fontSize="34" fontFamily="Arial, sans-serif" fontWeight="bold">EMIRATES</text>
    </svg>
  )
}

function BritishAirwaysLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#002060"/>
      <text x="100" y="92" textAnchor="middle" fill="white" fontSize="62" fontFamily="Arial Black, sans-serif" fontWeight="900">BA</text>
      <rect x="20" y="112" width="160" height="12" fill="#CF142B"/>
      <rect x="20" y="118" width="160" height="6" fill="white"/>
    </svg>
  )
}

function AirFranceLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#002F87"/>
      <path d="M25,140 Q100,60 175,140" stroke="#FFFFFF" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.3"/>
      <text x="100" y="116" textAnchor="middle" fill="white" fontSize="32" fontFamily="Arial, sans-serif" fontWeight="bold">Air France</text>
    </svg>
  )
}

function LufthansaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#05164D"/>
      <circle cx="100" cy="88" r="72" fill="#FFAD00"/>
      <circle cx="100" cy="88" r="56" fill="#05164D"/>
      <circle cx="100" cy="88" r="44" fill="#FFAD00"/>
      <text x="100" y="167" textAnchor="middle" fill="#FFAD00" fontSize="18" fontFamily="Arial, sans-serif" fontWeight="bold">LUFTHANSA</text>
    </svg>
  )
}

function SingaporeAirlinesLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#0B1F5B"/>
      <path d="M55,88 C65,76 80,72 96,78 C88,68 90,56 96,50 C104,62 102,75 106,80 C116,72 128,66 140,68 C136,78 124,84 114,82 C122,92 126,106 118,120 C110,106 106,94 100,90 C94,98 90,114 88,128 C80,114 80,100 84,90 Z" fill="#D4AF37"/>
    </svg>
  )
}

function DeltaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003366"/>
      <polygon points="100,35 22,158 178,158" fill="#E51937"/>
      <polygon points="100,60 52,145 148,145" fill="#003366"/>
      <text x="100" y="182" textAnchor="middle" fill="white" fontSize="20" fontFamily="Arial Black, sans-serif" fontWeight="900">DELTA</text>
    </svg>
  )
}

function UnitedLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#002244"/>
      <circle cx="100" cy="90" r="60" fill="none" stroke="#5B9BD5" strokeWidth="5"/>
      <text x="100" y="98" textAnchor="middle" fill="white" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">UNITED</text>
      <text x="100" y="160" textAnchor="middle" fill="#5B9BD5" fontSize="16" fontFamily="Arial, sans-serif">AIRLINES</text>
    </svg>
  )
}

function QantasLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#EE1C25"/>
      <ellipse cx="108" cy="105" rx="28" ry="35" fill="white" transform="rotate(-25 108 105)"/>
      <ellipse cx="130" cy="70" rx="20" ry="24" fill="white" transform="rotate(-10 130 70)"/>
      <ellipse cx="150" cy="78" rx="14" ry="8" fill="white"/>
      <circle cx="122" cy="54" r="6" fill="white"/>
      <circle cx="132" cy="52" r="6" fill="white"/>
      <ellipse cx="126" cy="118" rx="7" ry="20" fill="white" transform="rotate(20 126 118)"/>
      <ellipse cx="88" cy="138" rx="8" ry="22" fill="white" transform="rotate(-10 88 138)"/>
      <path d="M82,115 C72,130 66,148 70,160" stroke="white" strokeWidth="12" fill="none" strokeLinecap="round"/>
      <text x="100" y="182" textAnchor="middle" fill="white" fontSize="20" fontFamily="Arial Black, sans-serif" fontWeight="900">QANTAS</text>
    </svg>
  )
}

function TurkishAirlinesLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#C8102E"/>
      <circle cx="100" cy="92" r="62" fill="none" stroke="white" strokeWidth="5"/>
      <circle cx="100" cy="92" r="50" fill="#C8102E"/>
      <path d="M84,72 A20,20 0 1,1 84,112 L100,92 Z" fill="white"/>
      <polygon points="102,70 110,85 102,82 108,96 98,88 104,102 96,92 96,108" fill="white"/>
      <text x="100" y="172" textAnchor="middle" fill="white" fontSize="17" fontFamily="Arial Black, sans-serif" fontWeight="900">TURKISH AIRLINES</text>
    </svg>
  )
}

function CathayPacificLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#006564"/>
      <path d="M30,130 C50,80 80,55 120,55 L170,55 C140,70 110,90 90,130 Z" fill="white"/>
      <path d="M30,130 C50,100 70,80 100,75 L160,75 C140,90 118,108 100,130 Z" fill="#006564"/>
      <text x="100" y="170" textAnchor="middle" fill="white" fontSize="15" fontFamily="Arial Black, sans-serif" fontWeight="900">CATHAY PACIFIC</text>
    </svg>
  )
}

function AmericanAirlinesLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#0078D2"/>
      <path d="M100,30 L155,80 L100,60 L45,80 Z" fill="#CC0000"/>
      <path d="M45,80 L100,60 L100,155 Z" fill="#CC0000"/>
      <path d="M155,80 L100,60 L100,155 Z" fill="#003580"/>
      <text x="100" y="182" textAnchor="middle" fill="white" fontSize="16" fontFamily="Arial Black, sans-serif" fontWeight="900">AMERICAN</text>
    </svg>
  )
}

function EtihadLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#B5A06A"/>
      <text x="100" y="108" textAnchor="middle" fill="white" fontSize="34" fontFamily="Arial Black, sans-serif" fontWeight="900">ETIHAD</text>
      <text x="100" y="138" textAnchor="middle" fill="white" fontSize="16" fontFamily="Arial, sans-serif" fontWeight="bold">AIRWAYS</text>
    </svg>
  )
}

function RyanairLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#073590"/>
      <text x="100" y="108" textAnchor="middle" fill="#FFCC00" fontSize="36" fontFamily="Arial Black, sans-serif" fontWeight="900">RYANAIR</text>
    </svg>
  )
}

function SouthwestLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#304CB2"/>
      <path d="M100,40 C100,40 62,60 52,80 C44,96 52,110 66,108 C54,118 50,134 58,142 C66,150 80,146 86,134 C80,148 84,164 96,168 C108,172 118,160 116,148 C122,162 136,168 148,162 C160,156 162,142 154,132 C166,138 178,134 182,122 C186,110 178,98 166,100 C176,88 174,74 164,68 C154,62 142,66 138,78 C140,64 132,52 120,48 C108,44 100,52 100,52 Z" fill="#CC0000"/>
      <path d="M100,52 C100,52 108,60 110,72 C116,62 126,56 136,60 L100,40 Z" fill="#FFBC00"/>
    </svg>
  )
}

// ─── GAMING ───────────────────────────────────────────────────────────────────

function NintendoLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <ellipse cx="100" cy="100" rx="92" ry="60" fill="#E4000F"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="72" fontFamily="Arial Black, sans-serif" fontWeight="900">N</text>
    </svg>
  )
}

function PlayStationLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003087"/>
      <text x="55" y="92" textAnchor="middle" fill="#F0C040" fontSize="40">△</text>
      <circle cx="145" cy="78" r="18" fill="none" stroke="#E80A2A" strokeWidth="8"/>
      <text x="55" y="152" textAnchor="middle" fill="#7A88C4" fontSize="44">□</text>
      <text x="145" y="152" textAnchor="middle" fill="#7FC5A5" fontSize="40">✕</text>
    </svg>
  )
}

function XboxLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <circle cx="100" cy="100" r="88" fill="#107C10"/>
      <circle cx="100" cy="100" r="68" fill="#1A1A1A"/>
      <circle cx="100" cy="100" r="52" fill="#107C10"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="72" fontFamily="Arial Black, sans-serif" fontWeight="900">X</text>
    </svg>
  )
}

function EALogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="125" textAnchor="middle" fill="white" fontSize="100" fontFamily="Arial Black, sans-serif" fontWeight="900">EA</text>
    </svg>
  )
}

function UbisoftLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#0E1F5B"/>
      <path d="M162,100 A62,62 0 1,0 118,156" stroke="white" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d="M132,100 A32,32 0 1,0 110,128" stroke="white" strokeWidth="12" fill="none" strokeLinecap="round"/>
      <circle cx="100" cy="100" r="10" fill="white"/>
    </svg>
  )
}

function SteamLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1B2838"/>
      <circle cx="100" cy="90" r="62" fill="none" stroke="#66C0F4" strokeWidth="8"/>
      <circle cx="100" cy="90" r="40" fill="none" stroke="#66C0F4" strokeWidth="6"/>
      <line x1="100" y1="28" x2="100" y2="152" stroke="#66C0F4" strokeWidth="5"/>
      <line x1="38" y1="90" x2="162" y2="90" stroke="#66C0F4" strokeWidth="5"/>
      <line x1="55" y1="46" x2="145" y2="134" stroke="#66C0F4" strokeWidth="4"/>
      <line x1="55" y1="134" x2="145" y2="46" stroke="#66C0F4" strokeWidth="4"/>
      <text x="100" y="172" textAnchor="middle" fill="#66C0F4" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">STEAM</text>
    </svg>
  )
}

function RiotGamesLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M70,48 L70,152 L90,152 L90,108 L116,152 L140,152 L110,104 C124,98 132,86 132,70 C132,55 120,48 104,48 Z M90,64 L104,64 C112,64 116,68 116,76 C116,84 112,90 104,90 L90,90 Z" fill="#D4001E"/>
      <rect x="52" y="152" width="96" height="8" fill="#D4001E"/>
    </svg>
  )
}

function BlizzardLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A3B5C"/>
      <line x1="100" y1="25" x2="100" y2="175" stroke="#00AAFF" strokeWidth="10" strokeLinecap="round"/>
      <line x1="25" y1="100" x2="175" y2="100" stroke="#00AAFF" strokeWidth="10" strokeLinecap="round"/>
      <line x1="42" y1="42" x2="158" y2="158" stroke="#00AAFF" strokeWidth="10" strokeLinecap="round"/>
      <line x1="158" y1="42" x2="42" y2="158" stroke="#00AAFF" strokeWidth="10" strokeLinecap="round"/>
      <circle cx="100" cy="100" r="18" fill="#1A3B5C" stroke="#00AAFF" strokeWidth="6"/>
    </svg>
  )
}

function ActivisionLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="116" textAnchor="middle" fill="white" fontSize="30" fontFamily="Arial Black, sans-serif" fontWeight="900">ACTIVISION</text>
    </svg>
  )
}

function CapcomLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#0A2380"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="48" fontFamily="Arial Black, sans-serif" fontWeight="900">CAPCOM</text>
    </svg>
  )
}

function SegaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1755A6"/>
      <text x="100" y="126" textAnchor="middle" fill="white" fontSize="90" fontFamily="Arial Black, sans-serif" fontWeight="900">SEGA</text>
    </svg>
  )
}

function EpicGamesLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#2F2F2F"/>
      <text x="100" y="100" textAnchor="middle" fill="white" fontSize="52" fontFamily="Arial Black, sans-serif" fontWeight="900">Epic</text>
      <text x="100" y="148" textAnchor="middle" fill="#C6C6C6" fontSize="30" fontFamily="Arial Black, sans-serif" fontWeight="900">GAMES</text>
    </svg>
  )
}

function RockstarLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="125" textAnchor="middle" fill="#F5C400" fontSize="100" fontFamily="Arial Black, sans-serif" fontWeight="900">R★</text>
    </svg>
  )
}

function SquareEnixLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <rect x="38" y="38" width="124" height="124" rx="8" fill="none" stroke="white" strokeWidth="8"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="56" fontFamily="Arial Black, sans-serif" fontWeight="900">SE</text>
    </svg>
  )
}

function KonamiLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="42" fontFamily="Arial Black, sans-serif" fontWeight="900">KONAMI</text>
    </svg>
  )
}

function CDProjektLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <text x="100" y="95" textAnchor="middle" fill="white" fontSize="30" fontFamily="Arial Black, sans-serif" fontWeight="900">CD PROJEKT</text>
      <text x="100" y="135" textAnchor="middle" fill="white" fontSize="30" fontFamily="Arial Black, sans-serif" fontWeight="900">RED</text>
    </svg>
  )
}

// ─── LUXURY ───────────────────────────────────────────────────────────────────

function LouisVuittonLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#855E42"/>
      <text x="100" y="120" textAnchor="middle" fill="#DAA520" fontSize="90" fontFamily="serif" fontStyle="italic" fontWeight="bold">LV</text>
    </svg>
  )
}

function GucciLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1B3A2D"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="80" fontFamily="Arial Black, sans-serif" fontWeight="900">GG</text>
    </svg>
  )
}

function ChanelLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M80,60 A42,42 0 1,0 80,140 L80,128 A30,30 0 1,1 80,72 Z" fill="white"/>
      <path d="M120,60 A42,42 0 1,1 120,140 L120,128 A30,30 0 1,0 120,72 Z" fill="white"/>
    </svg>
  )
}

function RolexLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#006039"/>
      <path d="M55,140 L55,95 L75,115 L100,60 L125,115 L145,95 L145,140 Z" fill="#DAA520"/>
      <rect x="50" y="140" width="100" height="12" rx="3" fill="#DAA520"/>
    </svg>
  )
}

function HermesLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#E87722"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="48" fontFamily="serif" fontWeight="bold">Hermès</text>
    </svg>
  )
}

function PradaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M100,35 L165,145 L35,145 Z" fill="none" stroke="white" strokeWidth="5"/>
      <text x="100" y="130" textAnchor="middle" fill="white" fontSize="34" fontFamily="serif" fontWeight="bold">PRADA</text>
    </svg>
  )
}

function VersaceLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <circle cx="100" cy="100" r="82" fill="#DAA520"/>
      <circle cx="100" cy="100" r="68" fill="#1A1A1A"/>
      <text x="100" y="118" textAnchor="middle" fill="#DAA520" fontSize="80" fontFamily="serif" fontWeight="bold">V</text>
    </svg>
  )
}

function BurberryLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#B5A89A"/>
      <text x="100" y="108" textAnchor="middle" fill="#1A1A1A" fontSize="28" fontFamily="serif" fontWeight="bold">BURBERRY</text>
      <line x1="30" y1="125" x2="170" y2="125" stroke="#1A1A1A" strokeWidth="2"/>
      <text x="100" y="150" textAnchor="middle" fill="#1A1A1A" fontSize="14" fontFamily="serif">LONDON</text>
    </svg>
  )
}

function DiorLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#F5F0EB"/>
      <text x="100" y="116" textAnchor="middle" fill="#1A1A1A" fontSize="58" fontFamily="serif" fontWeight="bold">Dior</text>
    </svg>
  )
}

function CartierLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#C5002D"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="46" fontFamily="serif" fontStyle="italic" fontWeight="bold">Cartier</text>
    </svg>
  )
}

function TiffanyLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#81D8D0"/>
      <text x="100" y="96" textAnchor="middle" fill="white" fontSize="30" fontFamily="serif" fontWeight="bold">TIFFANY</text>
      <text x="100" y="128" textAnchor="middle" fill="white" fontSize="18" fontFamily="serif">&amp; CO.</text>
    </svg>
  )
}

function BalenciagaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="108" textAnchor="middle" fill="white" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900" letterSpacing="2">BALENCIAGA</text>
    </svg>
  )
}

function OmegaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="120" textAnchor="middle" fill="#D4AF37" fontSize="110" fontFamily="serif" fontWeight="bold">Ω</text>
    </svg>
  )
}

function TagHeuerLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="95" textAnchor="middle" fill="#CC0000" fontSize="36" fontFamily="Arial Black, sans-serif" fontWeight="900">TAG</text>
      <text x="100" y="136" textAnchor="middle" fill="white" fontSize="28" fontFamily="Arial Black, sans-serif" fontWeight="900">HEUER</text>
    </svg>
  )
}

function BvlgariLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1B3A2D"/>
      <text x="100" y="108" textAnchor="middle" fill="#D4AF37" fontSize="30" fontFamily="serif" fontWeight="bold" letterSpacing="3">BVLGARI</text>
      <line x1="35" y1="122" x2="165" y2="122" stroke="#D4AF37" strokeWidth="2"/>
      <text x="100" y="148" textAnchor="middle" fill="#D4AF37" fontSize="14" fontFamily="serif">ROMA</text>
    </svg>
  )
}

function DolceGabbannaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="100" textAnchor="middle" fill="white" fontSize="68" fontFamily="Arial Black, sans-serif" fontWeight="900">D&amp;G</text>
      <text x="100" y="148" textAnchor="middle" fill="#D4AF37" fontSize="16" fontFamily="serif" letterSpacing="2">DOLCE&amp;GABBANA</text>
    </svg>
  )
}

// ─── NEW CAR LOGOS ────────────────────────────────────────────────────────────

function SubaruLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003399"/>
      <ellipse cx="100" cy="90" rx="78" ry="52" fill="none" stroke="#7BB4E3" strokeWidth="5"/>
      <circle cx="86" cy="82" r="6" fill="#7BB4E3"/>
      <circle cx="96" cy="78" r="9" fill="#7BB4E3"/>
      <circle cx="108" cy="80" r="7" fill="#7BB4E3"/>
      <circle cx="116" cy="88" r="6" fill="#7BB4E3"/>
      <circle cx="112" cy="98" r="5" fill="#7BB4E3"/>
      <circle cx="102" cy="100" r="5" fill="#7BB4E3"/>
      <text x="100" y="142" textAnchor="middle" fill="white" fontSize="28" fontFamily="Arial Black, sans-serif" fontWeight="900">SUBARU</text>
    </svg>
  )
}

function VolvoLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003057"/>
      <circle cx="96" cy="96" r="62" fill="none" stroke="white" strokeWidth="10"/>
      <line x1="140" y1="52" x2="172" y2="38" stroke="white" strokeWidth="10" strokeLinecap="round"/>
      <line x1="155" y1="38" x2="172" y2="38" stroke="white" strokeWidth="10" strokeLinecap="round"/>
      <line x1="172" y1="38" x2="172" y2="55" stroke="white" strokeWidth="10" strokeLinecap="round"/>
      <text x="96" y="105" textAnchor="middle" fill="white" fontSize="36" fontFamily="Arial Black, sans-serif" fontWeight="900">VOLVO</text>
    </svg>
  )
}

function JaguarLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1B4332"/>
      <text x="100" y="105" textAnchor="middle" fill="#D4AF37" fontSize="36" fontFamily="Arial Black, sans-serif" fontWeight="900">JAGUAR</text>
      <path d="M60,130 C70,120 80,118 100,122 C120,118 130,120 140,130 C130,138 120,140 100,136 C80,140 70,138 60,130 Z" fill="#D4AF37" opacity="0.4"/>
    </svg>
  )
}

function LandRoverLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#2E5339"/>
      <rect x="20" y="75" width="160" height="50" rx="6" fill="none" stroke="#D4AF37" strokeWidth="4"/>
      <text x="100" y="108" textAnchor="middle" fill="white" fontSize="20" fontFamily="Arial Black, sans-serif" fontWeight="900">LAND ROVER</text>
    </svg>
  )
}

function BentleyLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A3A1A"/>
      <path d="M100,50 L56,76 L28,100 L56,124 L100,150 L144,124 L172,100 L144,76 Z" fill="none" stroke="#D4AF37" strokeWidth="5"/>
      <text x="100" y="115" textAnchor="middle" fill="#D4AF37" fontSize="80" fontFamily="serif" fontWeight="bold" fontStyle="italic">B</text>
    </svg>
  )
}

function RollsRoyceLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#0C1B33"/>
      <circle cx="100" cy="90" r="68" fill="none" stroke="#C0A860" strokeWidth="5"/>
      <text x="100" y="106" textAnchor="middle" fill="#C0A860" fontSize="72" fontFamily="serif" fontWeight="bold" fontStyle="italic">RR</text>
      <text x="100" y="172" textAnchor="middle" fill="#C0A860" fontSize="18" fontFamily="serif" fontWeight="bold">ROLLS-ROYCE</text>
    </svg>
  )
}

function BugattiLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1B1464"/>
      <ellipse cx="100" cy="96" rx="80" ry="52" fill="none" stroke="#C0A860" strokeWidth="5"/>
      <text x="100" y="88" textAnchor="middle" fill="#C0A860" fontSize="32" fontFamily="serif" fontWeight="bold" fontStyle="italic">EB</text>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">BUGATTI</text>
    </svg>
  )
}

function AlfaRomeoLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <rect x="48" y="52" width="104" height="96" rx="52" fill="#CC0000" stroke="white" strokeWidth="5"/>
      <rect x="48" y="52" width="52" height="96" fill="#CC0000"/>
      <rect x="100" y="52" width="52" height="96" fill="#CC0000"/>
      <line x1="100" y1="52" x2="100" y2="148" stroke="white" strokeWidth="5"/>
      <text x="73" y="108" textAnchor="middle" fill="white" fontSize="30" fontFamily="serif" fontWeight="bold">✛</text>
      <text x="127" y="108" textAnchor="middle" fill="white" fontSize="36" fontFamily="serif" fontWeight="bold">🐍</text>
      <text x="100" y="172" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial Black, sans-serif" fontWeight="900">ALFA ROMEO</text>
    </svg>
  )
}

function FiatLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#B22222"/>
      <rect x="30" y="60" width="140" height="80" rx="10" fill="#003DA5"/>
      <text x="100" y="116" textAnchor="middle" fill="white" fontSize="62" fontFamily="Arial Black, sans-serif" fontWeight="900">FIAT</text>
    </svg>
  )
}

function PeugeotLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003399"/>
      <path d="M100,35 L100,80 C100,80 114,74 120,62 C126,50 120,35 100,35 Z" fill="white"/>
      <path d="M100,80 C100,80 82,78 76,90 C70,102 80,115 100,112 C120,115 130,102 124,90 C118,78 100,80 100,80 Z" fill="white"/>
      <text x="100" y="158" textAnchor="middle" fill="white" fontSize="24" fontFamily="Arial Black, sans-serif" fontWeight="900">PEUGEOT</text>
    </svg>
  )
}

function RenaultLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <polygon points="100,30 140,100 100,170 60,100" fill="#EFDF00"/>
      <polygon points="100,52 128,100 100,148 72,100" fill="#1A1A1A"/>
      <polygon points="100,62 116,100 100,138 84,100" fill="#EFDF00"/>
    </svg>
  )
}

function CitroenLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M20,78 L100,38 L180,78" stroke="#C8102E" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20,100 L100,60 L180,100" stroke="#C8102E" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="100" y="162" textAnchor="middle" fill="white" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">CITROËN</text>
    </svg>
  )
}

function MitsubishiLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#E31937"/>
      <polygon points="100,28 120,62 80,62" fill="white"/>
      <polygon points="68,82 88,116 48,116" fill="white"/>
      <polygon points="132,82 152,116 112,116" fill="white"/>
      <text x="100" y="162" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial Black, sans-serif" fontWeight="900">MITSUBISHI</text>
    </svg>
  )
}

function LexusLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A2E"/>
      <ellipse cx="100" cy="96" rx="80" ry="58" fill="none" stroke="#C0A860" strokeWidth="5"/>
      <text x="100" y="115" textAnchor="middle" fill="#C0A860" fontSize="80" fontFamily="serif" fontStyle="italic" fontWeight="bold">L</text>
    </svg>
  )
}

function CadillacLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M100,35 L155,65 L155,135 L100,165 L45,135 L45,65 Z" fill="none" stroke="#C0A860" strokeWidth="4"/>
      <rect x="70" y="75" width="60" height="50" fill="#C0A860" opacity="0.2"/>
      <rect x="75" y="80" width="22" height="20" fill="#3B82F6"/>
      <rect x="103" y="80" width="22" height="20" fill="#EF4444"/>
      <rect x="75" y="104" width="22" height="16" fill="#EF4444"/>
      <rect x="103" y="104" width="22" height="16" fill="#3B82F6"/>
      <text x="100" y="172" textAnchor="middle" fill="#C0A860" fontSize="18" fontFamily="Arial Black, sans-serif" fontWeight="900">CADILLAC</text>
    </svg>
  )
}

function DodgeLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M30,75 L130,75 L170,100 L130,125 L30,125 Z" fill="#B22222"/>
      <text x="95" y="112" textAnchor="middle" fill="white" fontSize="34" fontFamily="Arial Black, sans-serif" fontWeight="900">DODGE</text>
    </svg>
  )
}

function JeepLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#2C5F2E"/>
      <rect x="25" y="72" width="150" height="56" rx="4" fill="#1A3A1A"/>
      <circle cx="55" cy="100" r="14" fill="none" stroke="#888" strokeWidth="4"/>
      <circle cx="55" cy="100" r="7" fill="#555"/>
      <circle cx="145" cy="100" r="14" fill="none" stroke="#888" strokeWidth="4"/>
      <circle cx="145" cy="100" r="7" fill="#555"/>
      <text x="100" y="108" textAnchor="middle" fill="white" fontSize="36" fontFamily="Arial Black, sans-serif" fontWeight="900">JEEP</text>
    </svg>
  )
}

function MaseratiLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003087"/>
      <line x1="100" y1="40" x2="100" y2="130" stroke="white" strokeWidth="10" strokeLinecap="round"/>
      <path d="M68,68 L100,40 L132,68" stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M78,90 L100,40 L122,90" stroke="white" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="100" y="172" textAnchor="middle" fill="white" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">MASERATI</text>
    </svg>
  )
}

function AstonMartinLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#00534C"/>
      <path d="M10,100 L45,60 L100,72 L155,60 L190,100 L155,140 L100,128 L45,140 Z" fill="none" stroke="#D4AF37" strokeWidth="5"/>
      <text x="100" y="107" textAnchor="middle" fill="white" fontSize="30" fontFamily="Arial Black, sans-serif" fontWeight="900">AM</text>
    </svg>
  )
}

function McLarenLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M20,100 C20,100 60,50 100,50 C140,50 180,100 180,100 C180,100 140,140 100,140 C60,140 20,100 20,100 Z" fill="none" stroke="#FF8000" strokeWidth="8"/>
      <path d="M50,100 C50,100 70,70 100,70 C130,70 150,100 150,100" stroke="#FF8000" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <text x="100" y="172" textAnchor="middle" fill="#FF8000" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">McLAREN</text>
    </svg>
  )
}

function SuzukiCarLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003DA5"/>
      <text x="100" y="132" textAnchor="middle" fill="white" fontSize="120" fontFamily="Arial Black, sans-serif" fontWeight="900">S</text>
    </svg>
  )
}

function GenesisLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A2E"/>
      <ellipse cx="100" cy="96" rx="75" ry="50" fill="none" stroke="#C0A860" strokeWidth="6"/>
      <path d="M60,96 L140,96 M100,60 L130,96" stroke="#C0A860" strokeWidth="8" strokeLinecap="round"/>
      <text x="100" y="168" textAnchor="middle" fill="#C0A860" fontSize="20" fontFamily="Arial Black, sans-serif" fontWeight="900">GENESIS</text>
    </svg>
  )
}

function MiniLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1C1C1C"/>
      <circle cx="100" cy="96" r="76" fill="none" stroke="white" strokeWidth="8"/>
      <circle cx="100" cy="96" r="60" fill="#1C1C1C" stroke="silver" strokeWidth="4"/>
      <text x="100" y="108" textAnchor="middle" fill="white" fontSize="46" fontFamily="Arial Black, sans-serif" fontWeight="900">MINI</text>
    </svg>
  )
}

function BYDLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1565C0"/>
      <rect x="25" y="70" width="150" height="60" rx="8" fill="none" stroke="white" strokeWidth="5"/>
      <text x="100" y="114" textAnchor="middle" fill="white" fontSize="56" fontFamily="Arial Black, sans-serif" fontWeight="900">BYD</text>
    </svg>
  )
}

function RivianLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1B4D3E"/>
      <path d="M40,130 L100,48 L160,130 L130,130 L100,80 L70,130 Z" fill="#70C13E"/>
      <text x="100" y="170" textAnchor="middle" fill="white" fontSize="26" fontFamily="Arial Black, sans-serif" fontWeight="900">RIVIAN</text>
    </svg>
  )
}

function InfinitiLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M30,90 C30,65 52,48 76,54 C94,58 100,80 100,80 C100,80 106,58 124,54 C148,48 170,65 170,90 C170,115 148,132 124,126 C106,122 100,100 100,100 C100,100 94,122 76,126 C52,132 30,115 30,90 Z" fill="none" stroke="white" strokeWidth="8"/>
      <line x1="100" y1="80" x2="100" y2="168" stroke="white" strokeWidth="8" strokeLinecap="round"/>
      <text x="100" y="185" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial Black, sans-serif" fontWeight="900">INFINITI</text>
    </svg>
  )
}

function AcuraLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M68,148 L100,52 L132,148 M80,115 L120,115" stroke="white" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="100" y="178" textAnchor="middle" fill="white" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">ACURA</text>
    </svg>
  )
}

// ─── NEW MOTORCYCLE LOGOS ─────────────────────────────────────────────────────

function BajajLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003DA5"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="52" fontFamily="Arial Black, sans-serif" fontWeight="900">BAJAJ</text>
    </svg>
  )
}

function HeroMotorLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="62" fontFamily="Arial Black, sans-serif" fontWeight="900">HERO</text>
    </svg>
  )
}

function VespaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#007B5E"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="54" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="bold">Vespa</text>
    </svg>
  )
}

function CFMotoLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="108" textAnchor="middle" fill="#CC0000" fontSize="56" fontFamily="Arial Black, sans-serif" fontWeight="900">CF</text>
      <text x="100" y="150" textAnchor="middle" fill="white" fontSize="28" fontFamily="Arial Black, sans-serif" fontWeight="900">MOTO</text>
    </svg>
  )
}

function ZeroMotorcyclesLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#0D2B1A"/>
      <text x="100" y="118" textAnchor="middle" fill="#4CAF50" fontSize="90" fontFamily="Arial Black, sans-serif" fontWeight="900">0</text>
      <text x="100" y="168" textAnchor="middle" fill="white" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">MOTORCYCLES</text>
    </svg>
  )
}

function UralLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#555"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="70" fontFamily="Arial Black, sans-serif" fontWeight="900">URAL</text>
    </svg>
  )
}

function BimotaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="48" fontFamily="Arial Black, sans-serif" fontWeight="900">BIMOTA</text>
    </svg>
  )
}

function BSALogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M30,80 L170,80 L170,90 L130,90 L130,120 L70,120 L70,90 L30,90 Z" fill="#D4AF37"/>
      <text x="100" y="116" textAnchor="middle" fill="#1A1A1A" fontSize="32" fontFamily="Arial Black, sans-serif" fontWeight="900">BSA</text>
      <text x="100" y="158" textAnchor="middle" fill="#D4AF37" fontSize="20" fontFamily="Arial Black, sans-serif" fontWeight="900">BIRMINGHAM</text>
    </svg>
  )
}

function GasGasLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#FF6600"/>
      <text x="100" y="95" textAnchor="middle" fill="black" fontSize="50" fontFamily="Arial Black, sans-serif" fontWeight="900">GAS</text>
      <text x="100" y="148" textAnchor="middle" fill="black" fontSize="50" fontFamily="Arial Black, sans-serif" fontWeight="900">GAS</text>
    </svg>
  )
}

// ─── NEW TECHNOLOGY LOGOS ─────────────────────────────────────────────────────

function DellLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#007DB8"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="72" fontFamily="Arial Black, sans-serif" fontWeight="900">dell</text>
    </svg>
  )
}

function HPLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#0096D6"/>
      <text x="100" y="125" textAnchor="middle" fill="white" fontSize="100" fontFamily="Arial Black, sans-serif" fontWeight="900">hp</text>
    </svg>
  )
}

function LGLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#A50034"/>
      <circle cx="100" cy="96" r="78" fill="none" stroke="white" strokeWidth="7"/>
      <text x="88" y="115" textAnchor="middle" fill="white" fontSize="62" fontFamily="Arial Black, sans-serif" fontWeight="900">L</text>
      <text x="124" y="115" textAnchor="middle" fill="white" fontSize="62" fontFamily="Arial Black, sans-serif" fontWeight="900">G</text>
      <line x1="118" y1="72" x2="134" y2="72" stroke="white" strokeWidth="7"/>
      <line x1="134" y1="72" x2="134" y2="96" stroke="white" strokeWidth="7"/>
    </svg>
  )
}

function IBMLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1F70C1"/>
      <text x="100" y="122" textAnchor="middle" fill="white" fontSize="78" fontFamily="Arial Black, sans-serif" fontWeight="900">IBM</text>
    </svg>
  )
}

function CiscoLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1BA0D7"/>
      <rect x="88" y="50" width="24" height="40" rx="4" fill="white"/>
      <rect x="54" y="66" width="16" height="28" rx="3" fill="white"/>
      <rect x="130" y="66" width="16" height="28" rx="3" fill="white"/>
      <rect x="24" y="80" width="14" height="20" rx="3" fill="white"/>
      <rect x="162" y="80" width="14" height="20" rx="3" fill="white"/>
      <text x="100" y="148" textAnchor="middle" fill="white" fontSize="32" fontFamily="Arial Black, sans-serif" fontWeight="900">CISCO</text>
    </svg>
  )
}

function AMDLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="118" textAnchor="middle" fill="#ED1C24" fontSize="72" fontFamily="Arial Black, sans-serif" fontWeight="900">AMD</text>
    </svg>
  )
}

function QualcommLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#3253DC"/>
      <text x="100" y="110" textAnchor="middle" fill="white" fontSize="36" fontFamily="Arial Black, sans-serif" fontWeight="900">Qualcomm</text>
    </svg>
  )
}

function XiaomiLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#FF6900"/>
      <rect x="36" y="56" width="128" height="88" rx="20" fill="none" stroke="white" strokeWidth="10"/>
      <text x="100" y="115" textAnchor="middle" fill="white" fontSize="56" fontFamily="Arial Black, sans-serif" fontWeight="900">MI</text>
    </svg>
  )
}

function HuaweiLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CF0A2C"/>
      <line x1="100" y1="40" x2="100" y2="160" stroke="white" strokeWidth="10" strokeLinecap="round"/>
      <line x1="40" y1="100" x2="160" y2="100" stroke="white" strokeWidth="10" strokeLinecap="round"/>
      <line x1="57" y1="57" x2="143" y2="143" stroke="white" strokeWidth="8" strokeLinecap="round"/>
      <line x1="143" y1="57" x2="57" y2="143" stroke="white" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="100" cy="100" r="18" fill="#CF0A2C"/>
    </svg>
  )
}

function ASUSLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#00539B"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="58" fontFamily="Arial Black, sans-serif" fontWeight="900">ASUS</text>
    </svg>
  )
}

function LenovoLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#E2231A"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="40" fontFamily="Arial Black, sans-serif" fontWeight="900">Lenovo</text>
    </svg>
  )
}

function OracleLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#F80000"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="38" fontFamily="Arial Black, sans-serif" fontWeight="900">ORACLE</text>
    </svg>
  )
}

function SalesforceLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#00A1E0"/>
      <path d="M82,62 C82,47 92,38 104,40 C110,34 120,33 126,40 C136,38 146,46 144,58 C152,61 156,71 150,80 L82,80 C76,74 76,66 82,62 Z" fill="white"/>
      <text x="100" y="130" textAnchor="middle" fill="white" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">salesforce</text>
    </svg>
  )
}

function DropboxLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#0061FF"/>
      <polygon points="100,52 60,72 100,92 140,72" fill="white"/>
      <polygon points="60,72 20,92 60,112 100,92" fill="white"/>
      <polygon points="140,72 100,92 140,112 180,92" fill="white"/>
      <polygon points="60,112 100,132 140,112 100,92" fill="white"/>
    </svg>
  )
}

function SlackLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#4A154B"/>
      <rect x="60" y="50" width="20" height="60" rx="10" fill="#E01E5A"/>
      <rect x="50" y="90" width="40" height="20" rx="10" fill="#E01E5A"/>
      <rect x="120" y="90" width="30" height="20" rx="10" fill="#36C5F0"/>
      <rect x="130" y="50" width="20" height="60" rx="10" fill="#36C5F0"/>
      <rect x="90" y="130" width="20" height="40" rx="10" fill="#2EB67D"/>
      <rect x="60" y="120" width="60" height="20" rx="10" fill="#2EB67D"/>
      <rect x="90" y="30" width="20" height="40" rx="10" fill="#ECB22E"/>
      <rect x="60" y="60" width="60" height="20" rx="10" fill="#ECB22E"/>
    </svg>
  )
}

function ZoomLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#2D8CFF"/>
      <rect x="30" y="68" width="100" height="64" rx="14" fill="white"/>
      <polygon points="136,72 176,55 176,145 136,128" fill="white"/>
      <text x="80" y="108" textAnchor="middle" fill="#2D8CFF" fontSize="26" fontFamily="Arial Black, sans-serif" fontWeight="900">zoom</text>
    </svg>
  )
}

function AirbnbLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#FF5A5F"/>
      <path d="M100,40 C88,40 78,50 78,62 C78,78 100,110 100,110 C100,110 122,78 122,62 C122,50 112,40 100,40 Z" fill="white"/>
      <circle cx="100" cy="62" r="10" fill="#FF5A5F"/>
      <path d="M64,110 C56,110 50,116 50,124 C50,132 56,138 64,138 C72,138 82,130 100,140 C118,130 128,138 136,138 C144,138 150,132 150,124 C150,116 144,110 136,110 C128,110 118,118 100,110 C82,118 72,110 64,110 Z" fill="white"/>
    </svg>
  )
}

function LinkedInLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#0A66C2"/>
      <rect x="38" y="78" width="30" height="84" rx="4" fill="white"/>
      <circle cx="53" cy="57" r="18" fill="white"/>
      <rect x="88" y="78" width="30" height="84" rx="4" fill="white"/>
      <path d="M118,78 L118,110 C118,125 128,134 140,134 C152,134 162,125 162,110 L162,78 L132,78 L132,110 C132,117 127,120 122,116" fill="none" stroke="white" strokeWidth="12"/>
      <rect x="88" y="78" width="44" height="14" fill="white"/>
    </svg>
  )
}

function SnapchatLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#FFFC00"/>
      <path d="M100,32 C78,32 60,50 60,72 L60,92 C52,94 44,98 40,104 C46,106 52,108 56,114 C54,120 48,128 38,134 C50,138 68,136 76,130 C80,136 88,142 100,142 C112,142 120,136 124,130 C132,136 150,138 162,134 C152,128 146,120 144,114 C148,108 154,106 160,104 C156,98 148,94 140,92 L140,72 C140,50 122,32 100,32 Z" fill="#1A1A1A"/>
    </svg>
  )
}

function DiscordLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#5865F2"/>
      <path d="M70,64 C56,70 44,82 38,96 C50,88 64,84 80,82 C86,78 92,76 100,76 C108,76 114,78 120,82 C136,84 150,88 162,96 C156,82 144,70 130,64 C126,76 112,84 100,84 C88,84 74,76 70,64 Z" fill="white"/>
      <ellipse cx="78" cy="106" rx="16" ry="18" fill="white"/>
      <ellipse cx="122" cy="106" rx="16" ry="18" fill="white"/>
      <path d="M70,138 C78,148 92,154 100,154 C108,154 122,148 130,138 C136,128 138,118 138,108 L138,100 C128,108 114,112 100,112 C86,112 72,108 62,100 L62,108 C62,118 64,128 70,138 Z" fill="white"/>
    </svg>
  )
}

function YouTubeLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#FF0000"/>
      <rect x="22" y="60" width="156" height="80" rx="20" fill="#FF0000" stroke="white" strokeWidth="6"/>
      <polygon points="84,80 84,120 130,100" fill="white"/>
    </svg>
  )
}

function TwitchLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#9146FF"/>
      <path d="M50,40 L50,130 L80,130 L80,155 L105,130 L140,130 L140,80 L165,55 L165,40 Z M130,110 L110,110 L110,65 L130,65 Z M88,110 L68,110 L68,65 L88,65 Z" fill="white"/>
    </svg>
  )
}

function WhatsAppLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#25D366"/>
      <circle cx="100" cy="95" r="68" fill="white"/>
      <path d="M58,148 L66,118 C56,102 52,82 60,64 C72,38 100,26 128,36 C156,46 168,76 158,104 C148,130 120,146 92,140 Z" fill="#25D366"/>
      <path d="M76,80 C76,80 70,76 68,82 C64,92 74,108 86,118 C98,128 116,132 122,128 C126,126 126,120 122,118 C118,116 112,114 110,116 C108,118 106,116 100,110 C94,104 92,98 94,96 C96,94 94,88 92,86 C90,84 86,82 84,84 C82,86 80,84 76,80 Z" fill="white"/>
    </svg>
  )
}

function RedditLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#FF4500"/>
      <circle cx="100" cy="104" r="60" fill="white"/>
      <circle cx="100" cy="104" r="60" fill="#FF4500"/>
      <circle cx="78" cy="104" r="8" fill="white"/>
      <circle cx="122" cy="104" r="8" fill="white"/>
      <path d="M78,122 Q100,136 122,122" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <circle cx="100" cy="52" r="10" fill="white"/>
      <circle cx="152" cy="84" r="16" fill="white"/>
      <circle cx="48" cy="84" r="16" fill="white"/>
      <path d="M100,62 L138,80" stroke="white" strokeWidth="4"/>
      <circle cx="78" cy="98" r="10" fill="white"/>
      <circle cx="122" cy="98" r="10" fill="white"/>
    </svg>
  )
}

// ─── NEW FOOD LOGOS ───────────────────────────────────────────────────────────

function NestleLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#004A97"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="40" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="bold">Nestlé</text>
    </svg>
  )
}

function KraftLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#6B2E8D"/>
      <text x="100" y="118" textAnchor="middle" fill="#D4AF37" fontSize="52" fontFamily="Arial Black, sans-serif" fontWeight="900">Kraft</text>
    </svg>
  )
}

function HeinzLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#8B0000"/>
      <path d="M100,38 L148,62 L148,138 L100,162 L52,138 L52,62 Z" fill="none" stroke="#D4AF37" strokeWidth="5"/>
      <text x="100" y="106" textAnchor="middle" fill="white" fontSize="38" fontFamily="Arial Black, sans-serif" fontWeight="900">HEINZ</text>
      <text x="100" y="136" textAnchor="middle" fill="#D4AF37" fontSize="16" fontFamily="serif">57 VARIETIES</text>
    </svg>
  )
}

function KelloggsLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <text x="100" y="128" textAnchor="middle" fill="white" fontSize="80" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="bold">K</text>
      <text x="100" y="162" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial, sans-serif" fontStyle="italic">Kellogg's</text>
    </svg>
  )
}

function MarsLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#3B1A08"/>
      <text x="100" y="128" textAnchor="middle" fill="#D4AF37" fontSize="80" fontFamily="Arial Black, sans-serif" fontWeight="900" fontStyle="italic">Mars</text>
    </svg>
  )
}

function PringlesLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#E8221B"/>
      <ellipse cx="100" cy="68" rx="55" ry="22" fill="#F5C842"/>
      <rect x="76" y="64" width="48" height="22" fill="#F5C842"/>
      <ellipse cx="88" cy="84" rx="6" ry="5" fill="#3B1A08"/>
      <ellipse cx="112" cy="84" rx="6" ry="5" fill="#3B1A08"/>
      <path d="M78,96 C85,104 115,104 122,96" stroke="#3B1A08" strokeWidth="4" fill="none"/>
      <text x="100" y="148" textAnchor="middle" fill="white" fontSize="28" fontFamily="Arial Black, sans-serif" fontWeight="900">PRINGLES</text>
    </svg>
  )
}

function DoritosLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <polygon points="100,30 172,160 28,160" fill="#EF4444"/>
      <polygon points="100,55 155,155 45,155" fill="#F97316"/>
      <text x="100" y="132" textAnchor="middle" fill="white" fontSize="20" fontFamily="Arial Black, sans-serif" fontWeight="900">DORITOS</text>
    </svg>
  )
}

function SpriteLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#00A550"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="52" fontFamily="Arial Black, sans-serif" fontWeight="900">Sprite</text>
      <circle cx="60" cy="75" r="14" fill="#FFFF00" opacity="0.8"/>
      <circle cx="140" cy="125" r="10" fill="#FFFF00" opacity="0.8"/>
    </svg>
  )
}

function FantaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#F28500"/>
      <text x="100" y="128" textAnchor="middle" fill="white" fontSize="72" fontFamily="Arial Black, sans-serif" fontWeight="900" fontStyle="italic">Fanta</text>
    </svg>
  )
}

function MountainDewLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A3A00"/>
      <text x="100" y="96" textAnchor="middle" fill="#7ED321" fontSize="44" fontFamily="Arial Black, sans-serif" fontWeight="900">MTN</text>
      <text x="100" y="148" textAnchor="middle" fill="#7ED321" fontSize="44" fontFamily="Arial Black, sans-serif" fontWeight="900">DEW</text>
    </svg>
  )
}

function GatoradeLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M68,38 L88,162 L108,80 L128,162 L148,38" stroke="#F7941D" strokeWidth="18" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function MonsterEnergyLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M70,35 L90,100 L70,100 L100,165 M100,165 L130,100 L110,100 L130,35" stroke="#6DC12A" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function KitKatLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <rect x="25" y="75" width="150" height="50" rx="8" fill="white"/>
      <text x="100" y="112" textAnchor="middle" fill="#CC0000" fontSize="34" fontFamily="Arial Black, sans-serif" fontWeight="900" fontStyle="italic">KIT KAT</text>
    </svg>
  )
}

function SnickersLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#3B1A08"/>
      <rect x="22" y="68" width="156" height="64" rx="8" fill="#C4862A"/>
      <text x="100" y="112" textAnchor="middle" fill="white" fontSize="40" fontFamily="Arial Black, sans-serif" fontWeight="900">SNICKERS</text>
    </svg>
  )
}

function CadburyLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#4A0080"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="38" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="bold">Cadbury</text>
    </svg>
  )
}

function FiveGuysLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <rect x="22" y="56" width="156" height="88" rx="8" fill="#1A1A1A"/>
      <text x="100" y="96" textAnchor="middle" fill="white" fontSize="30" fontFamily="Arial Black, sans-serif" fontWeight="900">FIVE</text>
      <text x="100" y="134" textAnchor="middle" fill="#CC0000" fontSize="30" fontFamily="Arial Black, sans-serif" fontWeight="900">GUYS</text>
    </svg>
  )
}

function ChipotleLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#441500"/>
      <text x="100" y="100" textAnchor="middle" fill="white" fontSize="24" fontFamily="Arial Black, sans-serif" fontWeight="900">CHIPOTLE</text>
      <text x="100" y="136" textAnchor="middle" fill="#CE9B55" fontSize="16" fontFamily="Arial, sans-serif">MEXICAN GRILL</text>
    </svg>
  )
}

function WendysLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#E2231A"/>
      <circle cx="100" cy="88" r="52" fill="#FFD700"/>
      <circle cx="100" cy="88" r="40" fill="#FFAA00"/>
      <circle cx="88" cy="84" r="9" fill="white"/>
      <circle cx="112" cy="84" r="9" fill="white"/>
      <path d="M86,100 Q100,110 114,100" stroke="white" strokeWidth="4" fill="none"/>
      <path d="M68,66 C72,54 86,50 100,50 C114,50 128,54 132,66" fill="#CC8800" stroke="none"/>
      <text x="100" y="162" textAnchor="middle" fill="white" fontSize="28" fontFamily="Arial Black, sans-serif" fontWeight="900">Wendy's</text>
    </svg>
  )
}

function ChickFilALogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#E51636"/>
      <text x="100" y="100" textAnchor="middle" fill="white" fontSize="30" fontFamily="Arial Black, sans-serif" fontWeight="900" fontStyle="italic">Chick-fil-A</text>
      <text x="100" y="148" textAnchor="middle" fill="#DD0031" fontSize="60" fontFamily="Arial Black, sans-serif" fontWeight="900" fontStyle="italic">C</text>
    </svg>
  )
}

function TimHortonsLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <circle cx="100" cy="92" r="68" fill="#1A1A1A"/>
      <text x="100" y="100" textAnchor="middle" fill="white" fontSize="44" fontFamily="serif" fontWeight="bold" fontStyle="italic">Tim</text>
      <text x="100" y="136" textAnchor="middle" fill="white" fontSize="26" fontFamily="serif" fontStyle="italic">Hortons</text>
    </svg>
  )
}

function KrispyKremeLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#007749"/>
      <circle cx="100" cy="90" r="60" fill="#F5C842" stroke="white" strokeWidth="5"/>
      <circle cx="100" cy="90" r="28" fill="#007749"/>
      <text x="100" y="164" textAnchor="middle" fill="white" fontSize="20" fontFamily="Arial Black, sans-serif" fontWeight="900">KRISPY KREME</text>
    </svg>
  )
}

function BudweiserLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <path d="M30,70 L90,50 L90,150 L30,130 Z" fill="#CC0000" stroke="#D4AF37" strokeWidth="3"/>
      <path d="M170,70 L110,50 L110,150 L170,130 Z" fill="#CC0000" stroke="#D4AF37" strokeWidth="3"/>
      <text x="100" y="112" textAnchor="middle" fill="white" fontSize="26" fontFamily="Arial Black, sans-serif" fontWeight="900">BUDWEISER</text>
    </svg>
  )
}

function CoronaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1B3A7A"/>
      <path d="M60,90 L80,50 L100,70 L120,50 L140,90" stroke="#D4AF37" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="100" y="132" textAnchor="middle" fill="#D4AF37" fontSize="36" fontFamily="serif" fontWeight="bold" fontStyle="italic">Corona</text>
    </svg>
  )
}

function GuinnessLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M100,36 C100,36 120,50 120,72 C120,86 112,96 100,96 C88,96 80,86 80,72 C80,50 100,36 100,36 Z" fill="#D4AF37"/>
      <path d="M100,60 C100,60 110,68 110,76 C110,82 106,86 100,86 L100,60 Z" fill="#1A1A1A"/>
      <text x="100" y="138" textAnchor="middle" fill="white" fontSize="28" fontFamily="serif" fontWeight="bold">GUINNESS</text>
    </svg>
  )
}

// ─── NEW SPORTS LOGOS ─────────────────────────────────────────────────────────

function ColumbiaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003DA5"/>
      <path d="M50,100 L100,40 L150,100 L130,100 L100,62 L70,100 Z" fill="white"/>
      <rect x="44" y="100" width="112" height="16" rx="4" fill="white"/>
      <text x="100" y="152" textAnchor="middle" fill="white" fontSize="20" fontFamily="Arial Black, sans-serif" fontWeight="900">COLUMBIA</text>
    </svg>
  )
}

function NorthFaceLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M38,148 L100,42 L162,148 Z" fill="none" stroke="white" strokeWidth="10"/>
      <path d="M62,148 L100,80" stroke="white" strokeWidth="10" strokeLinecap="round"/>
      <text x="100" y="178" textAnchor="middle" fill="white" fontSize="16" fontFamily="Arial Black, sans-serif" fontWeight="900">THE NORTH FACE</text>
    </svg>
  )
}

function PatagoniaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#4B9CD3"/>
      <path d="M20,100 L50,60 L80,90 L110,50 L140,80 L170,50 L180,100 L170,110 L140,90 L110,70 L80,105 L50,78 L25,115 Z" fill="white"/>
      <text x="100" y="158" textAnchor="middle" fill="white" fontSize="20" fontFamily="Arial Black, sans-serif" fontWeight="900">PATAGONIA</text>
    </svg>
  )
}

function SalomonLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="40" fontFamily="Arial Black, sans-serif" fontWeight="900">SALOMON</text>
    </svg>
  )
}

function UmbroLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003DA5"/>
      <path d="M100,40 L145,80 L100,120 L55,80 Z" fill="white"/>
      <text x="100" y="162" textAnchor="middle" fill="white" fontSize="30" fontFamily="Arial Black, sans-serif" fontWeight="900">UMBRO</text>
    </svg>
  )
}

function SauconyLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003DA5"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="34" fontFamily="Arial Black, sans-serif" fontWeight="900">SAUCONY</text>
    </svg>
  )
}

function BrooksLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1B4FD8"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="42" fontFamily="Arial Black, sans-serif" fontWeight="900">Brooks</text>
    </svg>
  )
}

function SpeedoLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <path d="M20,96 C20,96 60,60 100,74 C140,88 180,76 180,96 C180,116 140,128 100,116 C60,104 20,116 20,96 Z" fill="white"/>
      <text x="100" y="162" textAnchor="middle" fill="white" fontSize="30" fontFamily="Arial Black, sans-serif" fontWeight="900">SPEEDO</text>
    </svg>
  )
}

function TitleistLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <circle cx="100" cy="90" r="55" fill="white"/>
      <text x="100" y="100" textAnchor="middle" fill="#1A1A1A" fontSize="26" fontFamily="Arial Black, sans-serif" fontWeight="900">Titleist</text>
    </svg>
  )
}

function TaylorMadeLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003DA5"/>
      <text x="100" y="104" textAnchor="middle" fill="white" fontSize="58" fontFamily="Arial Black, sans-serif" fontWeight="900">TM</text>
      <text x="100" y="142" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial, sans-serif">TaylorMade</text>
    </svg>
  )
}

function CallawayLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A4A1A"/>
      <path d="M38,100 L100,40 L162,100" stroke="white" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="100" y="148" textAnchor="middle" fill="white" fontSize="26" fontFamily="Arial Black, sans-serif" fontWeight="900">CALLAWAY</text>
    </svg>
  )
}

function BabolatLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#8B0000"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="36" fontFamily="Arial Black, sans-serif" fontWeight="900">BABOLAT</text>
    </svg>
  )
}

function YonexLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003DA5"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="48" fontFamily="Arial Black, sans-serif" fontWeight="900">YONEX</text>
    </svg>
  )
}

function LiNingLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <path d="M30,130 C50,90 90,60 140,50 L168,50 C118,64 78,96 56,138 Z" fill="white"/>
      <text x="100" y="170" textAnchor="middle" fill="white" fontSize="26" fontFamily="Arial Black, sans-serif" fontWeight="900">LI-NING</text>
    </svg>
  )
}

function AntaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003DA5"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="58" fontFamily="Arial Black, sans-serif" fontWeight="900">ANTA</text>
    </svg>
  )
}

// ─── NEW AIRLINE LOGOS ────────────────────────────────────────────────────────

function KLMLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#00A1DE"/>
      <path d="M100,36 L88,60 L60,60 L82,76 L74,100 L100,84 L126,100 L118,76 L140,60 L112,60 Z" fill="white"/>
      <text x="100" y="148" textAnchor="middle" fill="white" fontSize="40" fontFamily="Arial Black, sans-serif" fontWeight="900">KLM</text>
    </svg>
  )
}

function AirCanadaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <path d="M100,40 L94,60 L80,65 L70,78 L68,90 L78,96 L80,108 L92,112 L100,122 L108,112 L120,108 L122,96 L132,90 L130,78 L120,65 L106,60 Z" fill="white"/>
      <circle cx="100" cy="84" r="12" fill="#CC0000"/>
      <text x="100" y="162" textAnchor="middle" fill="white" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">AIR CANADA</text>
    </svg>
  )
}

function SwissLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <rect x="84" y="54" width="32" height="92" rx="4" fill="white"/>
      <rect x="54" y="84" width="92" height="32" rx="4" fill="white"/>
      <text x="100" y="170" textAnchor="middle" fill="white" fontSize="28" fontFamily="Arial Black, sans-serif" fontWeight="900">SWISS</text>
    </svg>
  )
}

function AustrianAirlinesLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <rect x="28" y="74" width="144" height="16" rx="4" fill="white"/>
      <rect x="28" y="110" width="144" height="16" rx="4" fill="white"/>
      <text x="100" y="168" textAnchor="middle" fill="white" fontSize="20" fontFamily="Arial Black, sans-serif" fontWeight="900">AUSTRIAN</text>
    </svg>
  )
}

function FinnairLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003580"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="36" fontFamily="Arial Black, sans-serif" fontWeight="900">FINNAIR</text>
    </svg>
  )
}

function IberiaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <text x="100" y="118" textAnchor="middle" fill="#FFCC00" fontSize="44" fontFamily="Arial Black, sans-serif" fontWeight="900">IBERIA</text>
    </svg>
  )
}

function VirginAtlanticLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <text x="100" y="100" textAnchor="middle" fill="white" fontSize="42" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="bold">Virgin</text>
      <text x="100" y="148" textAnchor="middle" fill="white" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">ATLANTIC</text>
    </svg>
  )
}

function JetBlueLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003DA5"/>
      <text x="100" y="108" textAnchor="middle" fill="white" fontSize="42" fontFamily="Arial Black, sans-serif" fontWeight="900">jetBlue</text>
    </svg>
  )
}

function AlaskaAirlinesLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#01426A"/>
      <circle cx="70" cy="92" r="48" fill="#E8F4FF"/>
      <circle cx="70" cy="82" r="26" fill="#FFDCA8"/>
      <circle cx="70" cy="72" r="18" fill="#8B4513"/>
      <rect x="56" y="96" width="28" height="16" rx="4" fill="#8B4513"/>
      <text x="130" y="108" textAnchor="middle" fill="white" fontSize="26" fontFamily="Arial Black, sans-serif" fontWeight="900">alaska</text>
    </svg>
  )
}

function AirNewZealandLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M100,38 C100,38 116,58 110,88 C104,118 110,140 100,158 C90,140 96,118 90,88 C84,58 100,38 100,38 Z" fill="white"/>
      <path d="M78,52 C92,64 96,80 90,96 C84,80 78,66 78,52 Z" fill="white" opacity="0.6"/>
      <text x="100" y="180" textAnchor="middle" fill="white" fontSize="16" fontFamily="Arial Black, sans-serif" fontWeight="900">AIR NEW ZEALAND</text>
    </svg>
  )
}

function JALLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <circle cx="100" cy="90" r="62" fill="white"/>
      <circle cx="100" cy="90" r="52" fill="#CC0000"/>
      <text x="100" y="100" textAnchor="middle" fill="white" fontSize="36" fontFamily="Arial Black, sans-serif" fontWeight="900">JAL</text>
      <text x="100" y="172" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial Black, sans-serif" fontWeight="900">JAPAN AIRLINES</text>
    </svg>
  )
}

function ANALogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003380"/>
      <path d="M30,110 L100,40 L170,110 L150,130 L100,80 L50,130 Z" fill="white"/>
      <text x="100" y="168" textAnchor="middle" fill="white" fontSize="38" fontFamily="Arial Black, sans-serif" fontWeight="900">ANA</text>
    </svg>
  )
}

function KoreanAirLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#00256C"/>
      <circle cx="100" cy="90" r="58" fill="none" stroke="white" strokeWidth="5"/>
      <path d="M70,90 L100,58 L100,90 L130,90" stroke="#CC0000" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <path d="M100,90 L100,122 L70,90" stroke="#CC0000" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <text x="100" y="168" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial Black, sans-serif" fontWeight="900">KOREAN AIR</text>
    </svg>
  )
}

function AirAsiaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <text x="100" y="108" textAnchor="middle" fill="white" fontSize="36" fontFamily="Arial Black, sans-serif" fontWeight="900">airasia</text>
    </svg>
  )
}

function IndiGoLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1B1464"/>
      <text x="100" y="104" textAnchor="middle" fill="#FF6600" fontSize="44" fontFamily="Arial Black, sans-serif" fontWeight="900">IndiGo</text>
    </svg>
  )
}

function LATAMLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="56" fontFamily="Arial Black, sans-serif" fontWeight="900">LATAM</text>
    </svg>
  )
}

function AeroMexicoLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003580"/>
      <text x="100" y="104" textAnchor="middle" fill="white" fontSize="28" fontFamily="Arial Black, sans-serif" fontWeight="900">AEROMEXICO</text>
    </svg>
  )
}

function EthiopianAirlinesLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#006A4E"/>
      <circle cx="100" cy="84" r="44" fill="none" stroke="#FCDD09" strokeWidth="8"/>
      <polygon points="100,48 108,72 134,72 113,88 120,112 100,96 80,112 87,88 66,72 92,72" fill="#FCDD09"/>
      <text x="100" y="160" textAnchor="middle" fill="white" fontSize="17" fontFamily="Arial Black, sans-serif" fontWeight="900">ETHIOPIAN</text>
    </svg>
  )
}

function WestJetLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003580"/>
      <path d="M30,120 Q100,60 170,120" stroke="#0090D4" strokeWidth="18" fill="none" strokeLinecap="round"/>
      <text x="100" y="162" textAnchor="middle" fill="white" fontSize="28" fontFamily="Arial Black, sans-serif" fontWeight="900">WestJet</text>
    </svg>
  )
}

function EasyJetLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#FF6600"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="42" fontFamily="Arial Black, sans-serif" fontWeight="900">easyJet</text>
    </svg>
  )
}

// ─── NEW GAMING LOGOS ─────────────────────────────────────────────────────────

function BethesdaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="108" textAnchor="middle" fill="white" fontSize="30" fontFamily="Arial Black, sans-serif" fontWeight="900">BETHESDA</text>
    </svg>
  )
}

function BandaiNamcoLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#D40000"/>
      <text x="100" y="96" textAnchor="middle" fill="white" fontSize="26" fontFamily="Arial Black, sans-serif" fontWeight="900">BANDAI</text>
      <text x="100" y="136" textAnchor="middle" fill="#F5C400" fontSize="26" fontFamily="Arial Black, sans-serif" fontWeight="900">NAMCO</text>
    </svg>
  )
}

function TwoKLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="128" textAnchor="middle" fill="white" fontSize="100" fontFamily="Arial Black, sans-serif" fontWeight="900">2K</text>
    </svg>
  )
}

function THQLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003580"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="62" fontFamily="Arial Black, sans-serif" fontWeight="900">THQ</text>
    </svg>
  )
}

function IOInteractiveLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <circle cx="68" cy="100" r="28" fill="white"/>
      <circle cx="68" cy="100" r="18" fill="#CC0000"/>
      <text x="130" y="115" textAnchor="middle" fill="white" fontSize="48" fontFamily="Arial Black, sans-serif" fontWeight="900">IO</text>
    </svg>
  )
}

function NaughtyDogLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#4A2800"/>
      <ellipse cx="100" cy="82" rx="45" ry="38" fill="#CC8844"/>
      <circle cx="86" cy="76" r="8" fill="#1A1A1A"/>
      <circle cx="114" cy="76" r="8" fill="#1A1A1A"/>
      <path d="M86,98 Q100,108 114,98" stroke="#1A1A1A" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <ellipse cx="72" cy="66" rx="10" ry="14" fill="#CC8844" transform="rotate(-20 72 66)"/>
      <ellipse cx="128" cy="66" rx="10" ry="14" fill="#CC8844" transform="rotate(20 128 66)"/>
      <text x="100" y="158" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial Black, sans-serif" fontWeight="900">NAUGHTY DOG</text>
    </svg>
  )
}

function MojangLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <rect x="44" y="44" width="112" height="112" rx="6" fill="#5F7A26"/>
      <rect x="44" y="44" width="112" height="56" rx="6" fill="#7DB039"/>
      <rect x="44" y="100" width="112" height="12" fill="#4A6020"/>
      <text x="100" y="172" textAnchor="middle" fill="white" fontSize="20" fontFamily="Arial Black, sans-serif" fontWeight="900">MOJANG</text>
    </svg>
  )
}

function AtariLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <rect x="91" y="36" width="18" height="128" rx="4" fill="white"/>
      <path d="M91,36 C91,36 60,56 52,100 C44,144 68,164 91,164" stroke="white" strokeWidth="18" fill="none" strokeLinecap="round"/>
      <path d="M109,36 C109,36 140,56 148,100 C156,144 132,164 109,164" stroke="white" strokeWidth="18" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

function BungieLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <circle cx="100" cy="90" r="66" fill="none" stroke="#F5821F" strokeWidth="8"/>
      <text x="100" y="100" textAnchor="middle" fill="white" fontSize="32" fontFamily="Arial Black, sans-serif" fontWeight="900">BUNGIE</text>
    </svg>
  )
}

function InsomniacGamesLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#4B0082"/>
      <text x="100" y="100" textAnchor="middle" fill="white" fontSize="26" fontFamily="Arial Black, sans-serif" fontWeight="900">INSOMNIAC</text>
      <text x="100" y="136" textAnchor="middle" fill="#DDA0DD" fontSize="20" fontFamily="Arial Black, sans-serif" fontWeight="900">GAMES</text>
    </svg>
  )
}

function FromSoftwareLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="100" textAnchor="middle" fill="white" fontSize="34" fontFamily="Arial Black, sans-serif" fontWeight="900">FROM</text>
      <text x="100" y="142" textAnchor="middle" fill="#888" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">SOFTWARE</text>
    </svg>
  )
}

function ValveLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <circle cx="100" cy="90" r="55" fill="#F5821F"/>
      <circle cx="100" cy="90" r="35" fill="#1A1A1A"/>
      <circle cx="100" cy="90" r="14" fill="#F5821F"/>
      <text x="100" y="165" textAnchor="middle" fill="white" fontSize="32" fontFamily="Arial Black, sans-serif" fontWeight="900">VALVE</text>
    </svg>
  )
}

// ─── NEW LUXURY LOGOS ─────────────────────────────────────────────────────────

function FendiLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="118" textAnchor="middle" fill="#D4AF37" fontSize="80" fontFamily="serif" fontWeight="bold" fontStyle="italic">FF</text>
    </svg>
  )
}

function YSLLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="120" textAnchor="middle" fill="white" fontSize="72" fontFamily="serif" fontWeight="bold">YSL</text>
    </svg>
  )
}

function BottegaVenetaLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#6B4E3D"/>
      <text x="100" y="96" textAnchor="middle" fill="white" fontSize="20" fontFamily="serif" fontStyle="italic" fontWeight="bold">BOTTEGA</text>
      <text x="100" y="128" textAnchor="middle" fill="white" fontSize="20" fontFamily="serif" fontStyle="italic" fontWeight="bold">VENETA</text>
    </svg>
  )
}

function ValentinoLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#8B0000"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="56" fontFamily="Arial Black, sans-serif" fontWeight="900">VLTN</text>
    </svg>
  )
}

function AlexanderMcQueenLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="96" textAnchor="middle" fill="white" fontSize="22" fontFamily="serif" fontWeight="bold">Alexander</text>
      <text x="100" y="130" textAnchor="middle" fill="white" fontSize="22" fontFamily="serif" fontWeight="bold">McQueen</text>
    </svg>
  )
}

function GivenchyLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="108" textAnchor="middle" fill="white" fontSize="28" fontFamily="Arial Black, sans-serif" fontWeight="900">GIVENCHY</text>
    </svg>
  )
}

function CelineLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="50" fontFamily="serif" fontWeight="bold" letterSpacing="8">CÉLINE</text>
    </svg>
  )
}

function LoeweLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#C8A97E"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="44" fontFamily="serif" fontWeight="bold">LOEWE</text>
    </svg>
  )
}

function CoachLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="118" textAnchor="middle" fill="white" fontSize="50" fontFamily="serif" fontWeight="bold">COACH</text>
    </svg>
  )
}

function MichaelKorsLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="96" textAnchor="middle" fill="white" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">MICHAEL</text>
      <text x="100" y="130" textAnchor="middle" fill="white" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900">KORS</text>
    </svg>
  )
}

function RalphLaurenLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003580"/>
      <ellipse cx="90" cy="90" rx="28" ry="48" fill="none" stroke="white" strokeWidth="7"/>
      <ellipse cx="116" cy="76" rx="12" ry="22" fill="none" stroke="white" strokeWidth="7" transform="rotate(-30 116 76)"/>
      <line x1="78" y1="140" x2="84" y2="80" stroke="white" strokeWidth="7" strokeLinecap="round"/>
      <text x="100" y="170" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial Black, sans-serif" fontWeight="900">RALPH LAUREN</text>
    </svg>
  )
}

function ArmaniLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M100,44 L138,60 L152,100 L138,140 L100,156 L62,140 L48,100 L62,60 Z" fill="none" stroke="#888" strokeWidth="3"/>
      <text x="100" y="108" textAnchor="middle" fill="white" fontSize="30" fontFamily="Arial Black, sans-serif" fontWeight="900">ARMANI</text>
    </svg>
  )
}

function PatekPhilippeLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#003DA5"/>
      <circle cx="100" cy="88" r="58" fill="none" stroke="#D4AF37" strokeWidth="4"/>
      <path d="M100,50 L100,88 L126,88" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round"/>
      <text x="100" y="162" textAnchor="middle" fill="#D4AF37" fontSize="14" fontFamily="serif" fontWeight="bold">PATEK PHILIPPE</text>
    </svg>
  )
}

function AudemarsLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M100,36 L166,73 L166,147 L100,184 L34,147 L34,73 Z" fill="none" stroke="#D4AF37" strokeWidth="5"/>
      <text x="100" y="108" textAnchor="middle" fill="#D4AF37" fontSize="38" fontFamily="serif" fontWeight="bold">AP</text>
    </svg>
  )
}

function IWCLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <circle cx="100" cy="88" r="62" fill="none" stroke="#D4AF37" strokeWidth="5"/>
      <text x="100" y="98" textAnchor="middle" fill="white" fontSize="38" fontFamily="Arial Black, sans-serif" fontWeight="900">IWC</text>
      <text x="100" y="165" textAnchor="middle" fill="#D4AF37" fontSize="12" fontFamily="serif">SCHAFFHAUSEN</text>
    </svg>
  )
}

function HublotLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <rect x="30" y="60" width="140" height="80" rx="16" fill="none" stroke="#D4AF37" strokeWidth="6"/>
      <text x="100" y="108" textAnchor="middle" fill="white" fontSize="34" fontFamily="Arial Black, sans-serif" fontWeight="900">HUBLOT</text>
    </svg>
  )
}

function BreitlingLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <path d="M30,80 L100,40 L170,80 L170,90 L130,68 L100,52 L70,68 L30,90 Z" fill="#D4AF37"/>
      <path d="M30,120 L100,160 L170,120 L170,110 L130,132 L100,148 L70,132 L30,110 Z" fill="#D4AF37"/>
      <text x="100" y="108" textAnchor="middle" fill="white" fontSize="24" fontFamily="Arial Black, sans-serif" fontWeight="900">BREITLING</text>
    </svg>
  )
}

function LonginesLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#CC0000"/>
      <text x="100" y="108" textAnchor="middle" fill="white" fontSize="28" fontFamily="serif" fontWeight="bold" fontStyle="italic">Longines</text>
    </svg>
  )
}

function FerragamoLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="96" textAnchor="middle" fill="white" fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="bold">Salvatore</text>
      <text x="100" y="130" textAnchor="middle" fill="white" fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="bold">Ferragamo</text>
    </svg>
  )
}

function JimmyChooLogo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="20" fill="#1A1A1A"/>
      <text x="100" y="96" textAnchor="middle" fill="white" fontSize="26" fontFamily="serif" fontWeight="bold" fontStyle="italic">JIMMY</text>
      <text x="100" y="132" textAnchor="middle" fill="white" fontSize="26" fontFamily="serif" fontWeight="bold" fontStyle="italic">CHOO</text>
    </svg>
  )
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

export const BRAND_CATEGORIES = [
  { id: 'cars',         label: 'Cars',          emoji: '🚗', color: '#ef4444' },
  { id: 'motorcycles',  label: 'Motorcycles',   emoji: '🏍️', color: '#f97316' },
  { id: 'technology',   label: 'Technology',    emoji: '💻', color: '#8b5cf6' },
  { id: 'food',         label: 'Food & Drinks', emoji: '🍔', color: '#f59e0b' },
  { id: 'sports',       label: 'Sports',        emoji: '⚽', color: '#10b981' },
  { id: 'airlines',     label: 'Airlines',      emoji: '✈️', color: '#3b82f6' },
  { id: 'gaming',       label: 'Gaming',        emoji: '🎮', color: '#6366f1' },
  { id: 'luxury',       label: 'Luxury',        emoji: '💎', color: '#d97706' },
]

// ─── BRANDS DATA ──────────────────────────────────────────────────────────────

export const BRANDS = {
  cars: [
    { id: 'toyota',      name: 'Toyota',      country: '🇯🇵 Japan',   founded: 1937, difficulty: 'easy',   funFact: 'Toyota started as a loom-making company before switching to cars!',                                     Logo: ToyotaLogo },
    { id: 'bmw',         name: 'BMW',         country: '🇩🇪 Germany', founded: 1916, difficulty: 'easy',   funFact: 'BMW started making airplane engines — their logo looks like a spinning blue-and-white propeller!',        Logo: BMWLogo },
    { id: 'mercedes',    name: 'Mercedes',    country: '🇩🇪 Germany', founded: 1926, difficulty: 'easy',   funFact: 'Mercedes-Benz helped build the very first true car in 1886 — over 135 years ago!',                       Logo: MercedesLogo },
    { id: 'ford',        name: 'Ford',        country: '🇺🇸 USA',     founded: 1903, difficulty: 'easy',   funFact: 'Henry Ford invented the assembly line, making cars affordable for millions of people.',                   Logo: FordLogo },
    { id: 'honda',       name: 'Honda',       country: '🇯🇵 Japan',   founded: 1948, difficulty: 'easy',   funFact: 'Honda started by making bicycle motors — today they also make jets and robots!',                         Logo: HondaLogo },
    { id: 'volkswagen',  name: 'Volkswagen',  country: '🇩🇪 Germany', founded: 1937, difficulty: 'medium', funFact: 'Volkswagen means "people\'s car" in German — it was designed to be affordable for everyone.',            Logo: VolkswagenLogo },
    { id: 'audi',        name: 'Audi',        country: '🇩🇪 Germany', founded: 1909, difficulty: 'medium', funFact: 'The four rings in Audi\'s logo represent four car companies that merged together in 1932!',              Logo: AudiLogo },
    { id: 'tesla',       name: 'Tesla',       country: '🇺🇸 USA',     founded: 2003, difficulty: 'easy',   funFact: 'Tesla cars run entirely on electricity and can get software updates while you sleep!',                   Logo: TeslaLogo },
    { id: 'ferrari',     name: 'Ferrari',     country: '🇮🇹 Italy',   founded: 1939, difficulty: 'easy',   funFact: 'Ferrari\'s prancing horse badge originally belonged to a World War I flying ace who painted it on his plane!', Logo: FerrariLogo },
    { id: 'lamborghini', name: 'Lamborghini', country: '🇮🇹 Italy',   founded: 1963, difficulty: 'easy',   funFact: 'Lamborghini was started by a tractor maker who argued with Enzo Ferrari and decided to build his own cars!', Logo: LamborghiniLogo },
    { id: 'porsche',     name: 'Porsche',     country: '🇩🇪 Germany', founded: 1931, difficulty: 'medium', funFact: 'The Porsche 911 has been in continuous production since 1963 — one of the longest-running car models ever!', Logo: PorscheLogo },
    { id: 'chevrolet',   name: 'Chevrolet',   country: '🇺🇸 USA',     founded: 1911, difficulty: 'medium', funFact: 'Chevrolet was co-founded by a Swiss racing driver named Louis Chevrolet who loved speed!',               Logo: ChevroletLogo },
    { id: 'hyundai',     name: 'Hyundai',     country: '🇰🇷 Korea',   founded: 1967, difficulty: 'easy',   funFact: 'Hyundai means "modernity" in Korean — they started as a construction company before making cars!',       Logo: HyundaiLogo },
    { id: 'kia',         name: 'Kia',         country: '🇰🇷 Korea',   founded: 1944, difficulty: 'easy',   funFact: 'Kia means "to rise from Asia" in Korean — and that\'s exactly what they did!',                         Logo: KiaLogo },
    { id: 'nissan',      name: 'Nissan',      country: '🇯🇵 Japan',   founded: 1933, difficulty: 'easy',   funFact: 'Nissan made the world\'s first mass-market electric car — the Leaf — back in 2010!',                  Logo: NissanLogo },
    { id: 'mazda',        name: 'Mazda',        country: '🇯🇵 Japan',   founded: 1920, difficulty: 'medium', funFact: 'Mazda is named after Ahura Mazda, the Zoroastrian god of light, wisdom, and harmony!',                 Logo: MazdaLogo },
    { id: 'subaru',       name: 'Subaru',       country: '🇯🇵 Japan',   founded: 1953, difficulty: 'medium', funFact: 'Subaru is the Japanese word for the Pleiades star cluster — those 6 stars are right in their logo!',   Logo: SubaruLogo },
    { id: 'volvo',        name: 'Volvo',        country: '🇸🇪 Sweden',  founded: 1927, difficulty: 'medium', funFact: 'Volvo invented the 3-point seatbelt and gave the patent away freely to save lives worldwide!',         Logo: VolvoLogo },
    { id: 'jaguar',       name: 'Jaguar',       country: '🇬🇧 UK',      founded: 1935, difficulty: 'medium', funFact: 'Jaguar cars were originally called SS Cars — they changed the name after World War II!',               Logo: JaguarLogo },
    { id: 'landrover',    name: 'Land Rover',   country: '🇬🇧 UK',      founded: 1948, difficulty: 'medium', funFact: 'The original Land Rover was designed to be a simple farm vehicle — it became a luxury icon instead!', Logo: LandRoverLogo },
    { id: 'bentley',      name: 'Bentley',      country: '🇬🇧 UK',      founded: 1919, difficulty: 'medium', funFact: 'Bentley won the Le Mans 24-hour race five times in a row from 1927 to 1930!',                        Logo: BentleyLogo },
    { id: 'rollsroyce',   name: 'Rolls-Royce',  country: '🇬🇧 UK',      founded: 1904, difficulty: 'easy',   funFact: 'Rolls-Royce tests every car for weeks before delivery — perfection takes time!',                     Logo: RollsRoyceLogo },
    { id: 'bugatti',      name: 'Bugatti',      country: '🇫🇷 France',  founded: 1909, difficulty: 'hard',   funFact: 'The Bugatti Veyron took 10 years and over 1 billion dollars to develop!',                           Logo: BugattiLogo },
    { id: 'alfaromeo',    name: 'Alfa Romeo',   country: '🇮🇹 Italy',   founded: 1910, difficulty: 'medium', funFact: 'Alfa Romeo\'s logo includes a serpent eating a human — it comes from the city crest of Milan!',      Logo: AlfaRomeoLogo },
    { id: 'fiat',         name: 'Fiat',         country: '🇮🇹 Italy',   founded: 1899, difficulty: 'medium', funFact: 'FIAT stands for Fabbrica Italiana Automobili Torino — Italian for Italian Automobile Factory Turin!',  Logo: FiatLogo },
    { id: 'peugeot',      name: 'Peugeot',      country: '🇫🇷 France',  founded: 1882, difficulty: 'hard',   funFact: 'Peugeot started in 1882 making tools and pepper mills — not cars!',                                 Logo: PeugeotLogo },
    { id: 'renault',      name: 'Renault',      country: '🇫🇷 France',  founded: 1899, difficulty: 'medium', funFact: 'Renault has competed in Formula 1 since 1977 and won the World Championship twice!',                 Logo: RenaultLogo },
    { id: 'citroen',      name: 'Citroën',      country: '🇫🇷 France',  founded: 1919, difficulty: 'hard',   funFact: 'Citroën invented the double chevron logo to represent the herringbone gear their founder made!',     Logo: CitroenLogo },
    { id: 'mitsubishi',   name: 'Mitsubishi',   country: '🇯🇵 Japan',   founded: 1917, difficulty: 'medium', funFact: 'Mitsubishi means "three diamonds" in Japanese — those are exactly the three shapes in their logo!',  Logo: MitsubishiLogo },
    { id: 'lexus',        name: 'Lexus',        country: '🇯🇵 Japan',   founded: 1989, difficulty: 'medium', funFact: 'Lexus is Toyota\'s luxury brand — the name was inspired by the word "luxury" and "elegance"!',       Logo: LexusLogo },
    { id: 'cadillac',     name: 'Cadillac',     country: '🇺🇸 USA',     founded: 1902, difficulty: 'medium', funFact: 'Cadillac was named after the French explorer who founded the city of Detroit in 1701!',             Logo: CadillacLogo },
    { id: 'dodge',        name: 'Dodge',        country: '🇺🇸 USA',     founded: 1900, difficulty: 'easy',   funFact: 'The Dodge Viper was designed to be like a modern muscle car — raw power and no safety nets!',        Logo: DodgeLogo },
    { id: 'jeep',         name: 'Jeep',         country: '🇺🇸 USA',     founded: 1941, difficulty: 'easy',   funFact: 'The first Jeep was built for the US Army in World War II — it was designed in just 49 days!',        Logo: JeepLogo },
    { id: 'maserati',     name: 'Maserati',     country: '🇮🇹 Italy',   founded: 1914, difficulty: 'hard',   funFact: 'The Maserati trident symbol was inspired by Neptune\'s trident fountain in Bologna, Italy!',        Logo: MaseratiLogo },
    { id: 'astonmartin',  name: 'Aston Martin', country: '🇬🇧 UK',      founded: 1913, difficulty: 'medium', funFact: 'Aston Martin is the car brand of James Bond — it\'s appeared in more Bond films than any other!',   Logo: AstonMartinLogo },
    { id: 'mclaren',      name: 'McLaren',      country: '🇬🇧 UK',      founded: 1963, difficulty: 'medium', funFact: 'McLaren\'s F1 team has won more Formula 1 races than almost anyone else in history!',               Logo: McLarenLogo },
    { id: 'suzukicar',    name: 'Suzuki',       country: '🇯🇵 Japan',   founded: 1909, difficulty: 'easy',   funFact: 'Suzuki is one of the top-selling car brands in India, where they sell millions of small cars!',      Logo: SuzukiCarLogo },
    { id: 'genesis',      name: 'Genesis',      country: '🇰🇷 Korea',   founded: 2015, difficulty: 'hard',   funFact: 'Genesis is Hyundai\'s luxury brand — it launched as its own separate company in 2015!',             Logo: GenesisLogo },
    { id: 'mini',         name: 'MINI',         country: '🇬🇧 UK',      founded: 1959, difficulty: 'easy',   funFact: 'The original Mini was so clever it fit 4 adults and luggage in a car only 10 feet long!',            Logo: MiniLogo },
    { id: 'byd',          name: 'BYD',          country: '🇨🇳 China',   founded: 1995, difficulty: 'hard',   funFact: 'BYD stands for "Build Your Dreams" — they are now the world\'s biggest electric car maker!',        Logo: BYDLogo },
    { id: 'rivian',       name: 'Rivian',       country: '🇺🇸 USA',     founded: 2009, difficulty: 'hard',   funFact: 'Rivian makes electric adventure trucks — Amazon ordered 100,000 Rivian delivery vans!',             Logo: RivianLogo },
    { id: 'infiniti',     name: 'Infiniti',     country: '🇯🇵 Japan',   founded: 1989, difficulty: 'hard',   funFact: 'Infiniti is Nissan\'s luxury brand — their infinity-road logo represents endless possibilities!',   Logo: InfinitiLogo },
    { id: 'acura',        name: 'Acura',        country: '🇯🇵 Japan',   founded: 1986, difficulty: 'hard',   funFact: 'Acura was the first Japanese luxury car brand to launch in North America, beating Lexus by 3 years!',Logo: AcuraLogo },
  ],
  motorcycles: [
    { id: 'harley',        name: 'Harley-Davidson', country: '🇺🇸 USA',     founded: 1903, difficulty: 'medium', funFact: 'The first Harley-Davidson was built in a tiny 10×15 foot shed in Milwaukee, USA!',                  Logo: HarleyDavidsonLogo },
    { id: 'ducati',        name: 'Ducati',           country: '🇮🇹 Italy',   founded: 1926, difficulty: 'medium', funFact: 'Ducati motorcycles are so fast and well-designed they have won hundreds of MotoGP races!',          Logo: DucatiLogo },
    { id: 'yamaha',        name: 'Yamaha',           country: '🇯🇵 Japan',   founded: 1887, difficulty: 'easy',   funFact: 'Yamaha makes musical instruments AND motorcycles — they started with pianos!',                     Logo: YamahaLogo },
    { id: 'kawasaki',      name: 'Kawasaki',         country: '🇯🇵 Japan',   founded: 1896, difficulty: 'medium', funFact: 'Kawasaki also builds submarines, trains, and robots — not just motorcycles!',                      Logo: KawasakiLogo },
    { id: 'ktm',           name: 'KTM',              country: '🇦🇹 Austria', founded: 1934, difficulty: 'hard',   funFact: 'KTM stands for Kraftfahrzeuge Trunkenpolz Mattighofen — quite a mouthful!',                        Logo: KTMLogo },
    { id: 'royalenfield',  name: 'Royal Enfield',    country: '🇮🇳 India',   founded: 1901, difficulty: 'hard',   funFact: 'Royal Enfield is the world\'s oldest motorcycle brand still in production today!',                Logo: RoyalEnfieldLogo },
    { id: 'triumph',       name: 'Triumph',          country: '🇬🇧 UK',      founded: 1902, difficulty: 'hard',   funFact: 'Triumph motorcycles were used by the British Army in both World Wars!',                           Logo: TriumphLogo },
    { id: 'suzuki',        name: 'Suzuki',           country: '🇯🇵 Japan',   founded: 1909, difficulty: 'easy',   funFact: 'Suzuki started in 1909 making weaving looms, then moved to motorcycles and cars!',                 Logo: SuzukiLogo },
    { id: 'indian',        name: 'Indian Motorcycle',country: '🇺🇸 USA',     founded: 1901, difficulty: 'medium', funFact: 'Indian was the most popular motorcycle brand in the world in the early 1900s!',                   Logo: IndianMotorcycleLogo },
    { id: 'aprilia',       name: 'Aprilia',          country: '🇮🇹 Italy',   founded: 1945, difficulty: 'hard',   funFact: 'Aprilia has won over 50 MotoGP World Championships — more than almost any other brand!',           Logo: AprireLogo },
    { id: 'mvagusta',      name: 'MV Agusta',        country: '🇮🇹 Italy',   founded: 1945, difficulty: 'hard',   funFact: 'MV Agusta won 17 consecutive world championships — the longest winning streak in MotoGP!',         Logo: MVAgustaLogo },
    { id: 'motoguzzi',     name: 'Moto Guzzi',       country: '🇮🇹 Italy',   founded: 1921, difficulty: 'hard',   funFact: 'Moto Guzzi\'s eagle logo is a tribute to their founder who was a World War I aviator!',           Logo: MotoGuzziLogo },
    { id: 'norton',        name: 'Norton',           country: '🇬🇧 UK',      founded: 1898, difficulty: 'hard',   funFact: 'A Norton motorcycle was the first to beat 100 mph in a race back in 1953!',                       Logo: NortonLogo },
    { id: 'husqvarna',     name: 'Husqvarna',        country: '🇸🇪 Sweden',  founded: 1689, difficulty: 'hard',   funFact: 'Husqvarna started making sewing machines in 1689 — it\'s over 330 years old!',                   Logo: HusqvarnaLogo },
    { id: 'benelli',       name: 'Benelli',          country: '🇮🇹 Italy',   founded: 1911, difficulty: 'hard',   funFact: 'Benelli was founded by a widow and her six sons in a small Italian town in 1911!',                 Logo: BenelliLogo },
    { id: 'bajaj',         name: 'Bajaj',            country: '🇮🇳 India',   founded: 1945, difficulty: 'hard',   funFact: 'Bajaj is India\'s biggest motorcycle exporter — they sell bikes in over 70 countries!',            Logo: BajajLogo },
    { id: 'hero',          name: 'Hero MotoCorp',    country: '🇮🇳 India',   founded: 1984, difficulty: 'hard',   funFact: 'Hero MotoCorp is the world\'s largest motorcycle manufacturer by volume — beating Honda!',          Logo: HeroMotorLogo },
    { id: 'vespa',         name: 'Vespa',            country: '🇮🇹 Italy',   founded: 1946, difficulty: 'medium', funFact: 'Vespa means "wasp" in Italian — the first prototype made a buzzing sound like one!',               Logo: VespaLogo },
    { id: 'cfmoto',        name: 'CFMoto',           country: '🇨🇳 China',   founded: 1989, difficulty: 'hard',   funFact: 'CFMoto is China\'s fastest-growing motorcycle brand, now sold in over 90 countries!',              Logo: CFMotoLogo },
    { id: 'zeromoto',      name: 'Zero Motorcycles', country: '🇺🇸 USA',     founded: 2006, difficulty: 'hard',   funFact: 'Zero Motorcycles makes electric bikes that are nearly silent — you can sneak up on anyone!',         Logo: ZeroMotorcyclesLogo },
    { id: 'ural',          name: 'Ural',             country: '🇷🇺 Russia',  founded: 1941, difficulty: 'hard',   funFact: 'Ural motorcycles were designed for the Soviet Army based on stolen German BMW blueprints in WWII!',  Logo: UralLogo },
    { id: 'bimota',        name: 'Bimota',           country: '🇮🇹 Italy',   founded: 1973, difficulty: 'hard',   funFact: 'Bimota is named by combining the first two letters of its three founders\' surnames!',             Logo: BimotaLogo },
    { id: 'bsa',           name: 'BSA',              country: '🇬🇧 UK',      founded: 1861, difficulty: 'hard',   funFact: 'BSA (Birmingham Small Arms) made guns before motorcycles — and once built half the world\'s bikes!',Logo: BSALogo },
    { id: 'gasgas',        name: 'GasGas',           country: '🇪🇸 Spain',   founded: 1985, difficulty: 'hard',   funFact: 'GasGas specialises in extreme off-road bikes — their riders win the hardest events in the world!',  Logo: GasGasLogo },
  ],
  technology: [
    { id: 'apple',       name: 'Apple',     country: '🇺🇸 USA',   founded: 1976, difficulty: 'easy',   funFact: 'Apple\'s logo has a bite taken out of it so people don\'t confuse it with a cherry!',               Logo: AppleLogo },
    { id: 'google',      name: 'Google',    country: '🇺🇸 USA',   founded: 1998, difficulty: 'easy',   funFact: 'Google got its name from "googol" — a number with 100 zeros after it!',                            Logo: GoogleLogo },
    { id: 'microsoft',   name: 'Microsoft', country: '🇺🇸 USA',   founded: 1975, difficulty: 'easy',   funFact: 'Microsoft was co-founded by Bill Gates when he was just 19 years old!',                            Logo: MicrosoftLogo },
    { id: 'samsung',     name: 'Samsung',   country: '🇰🇷 Korea', founded: 1938, difficulty: 'easy',   funFact: 'Samsung means "three stars" in Korean — it was originally a food export company!',                Logo: SamsungLogo },
    { id: 'sony',        name: 'Sony',      country: '🇯🇵 Japan', founded: 1946, difficulty: 'easy',   funFact: 'Sony was founded in a bombed-out department store in Tokyo with just 8 employees!',                Logo: SonyLogo },
    { id: 'amazon',      name: 'Amazon',    country: '🇺🇸 USA',   founded: 1994, difficulty: 'easy',   funFact: 'The Amazon smile arrow goes from A to Z, meaning they sell everything from A to Z!',              Logo: AmazonLogo },
    { id: 'meta',        name: 'Meta',      country: '🇺🇸 USA',   founded: 2004, difficulty: 'medium', funFact: 'Meta owns Facebook, Instagram, and WhatsApp — three of the most popular apps in the world!',     Logo: MetaLogo },
    { id: 'netflix',     name: 'Netflix',   country: '🇺🇸 USA',   founded: 1997, difficulty: 'easy',   funFact: 'Netflix started by renting DVDs by mail in red envelopes — no streaming at first!',               Logo: NetflixLogo },
    { id: 'intel',       name: 'Intel',     country: '🇺🇸 USA',   founded: 1968, difficulty: 'easy',   funFact: 'Intel invented the world\'s first microprocessor in 1971 — it had just 2,300 transistors!',       Logo: IntelLogo },
    { id: 'nvidia',      name: 'NVIDIA',    country: '🇺🇸 USA',   founded: 1993, difficulty: 'medium', funFact: 'NVIDIA graphics cards are so powerful they\'re used to train the AI that powers ChatGPT!',        Logo: NvidiaLogo },
    { id: 'spotify',     name: 'Spotify',   country: '🇸🇪 Sweden',founded: 2006, difficulty: 'easy',   funFact: 'Spotify has over 100 million songs — if you listened non-stop it would take 600+ years!',         Logo: SpotifyLogo },
    { id: 'twitter',     name: 'X (Twitter)',country: '🇺🇸 USA',  founded: 2006, difficulty: 'easy',   funFact: 'The first tweet ever was sent by Twitter co-founder Jack Dorsey in 2006!',                         Logo: TwitterLogo },
    { id: 'tiktok',      name: 'TikTok',    country: '🇨🇳 China', founded: 2016, difficulty: 'easy',   funFact: 'TikTok is available in over 150 countries and has over a billion users!',                         Logo: TikTokLogo },
    { id: 'adobe',       name: 'Adobe',     country: '🇺🇸 USA',   founded: 1982, difficulty: 'medium', funFact: 'Adobe was named after the Adobe Creek river that ran behind the founders\' houses!',              Logo: AdobeLogo },
    { id: 'uber',        name: 'Uber',      country: '🇺🇸 USA',   founded: 2009, difficulty: 'easy',   funFact: 'Uber started when two friends couldn\'t find a taxi in Paris and wanted to book a ride from an app!', Logo: UberLogo },
    { id: 'paypal',      name: 'PayPal',    country: '🇺🇸 USA',   founded: 1998, difficulty: 'medium', funFact: 'PayPal was co-founded by Elon Musk before he created Tesla and SpaceX!',                         Logo: PayPalLogo },
    { id: 'dell',        name: 'Dell',      country: '🇺🇸 USA',   founded: 1984, difficulty: 'medium', funFact: 'Michael Dell started Dell computers from his university dorm room at age 19 with just $1,000!',      Logo: DellLogo },
    { id: 'hp',          name: 'HP',        country: '🇺🇸 USA',   founded: 1939, difficulty: 'easy',   funFact: 'HP was founded in a garage in Palo Alto — that garage is considered the birthplace of Silicon Valley!',Logo: HPLogo },
    { id: 'lg',          name: 'LG',        country: '🇰🇷 Korea', founded: 1958, difficulty: 'easy',   funFact: 'LG stands for "Life\'s Good" — their original name was Lucky Goldstar!',                            Logo: LGLogo },
    { id: 'ibm',         name: 'IBM',       country: '🇺🇸 USA',   founded: 1911, difficulty: 'easy',   funFact: 'IBM invented the floppy disk, the hard drive, and the first PC operating system!',                   Logo: IBMLogo },
    { id: 'cisco',       name: 'Cisco',     country: '🇺🇸 USA',   founded: 1984, difficulty: 'medium', funFact: 'Cisco was founded by two Stanford professors and named after San Francisco!',                        Logo: CiscoLogo },
    { id: 'amd',         name: 'AMD',       country: '🇺🇸 USA',   founded: 1969, difficulty: 'medium', funFact: 'AMD\'s Ryzen chips are so good they forced Intel to finally make better processors!',                 Logo: AMDLogo },
    { id: 'qualcomm',    name: 'Qualcomm',  country: '🇺🇸 USA',   founded: 1985, difficulty: 'hard',   funFact: 'Qualcomm chips power almost every Android smartphone in the world!',                                 Logo: QualcommLogo },
    { id: 'xiaomi',      name: 'Xiaomi',    country: '🇨🇳 China', founded: 2010, difficulty: 'medium', funFact: 'Xiaomi sold 100,000 phones in 3 minutes when it first launched — they set a world record!',          Logo: XiaomiLogo },
    { id: 'huawei',      name: 'Huawei',    country: '🇨🇳 China', founded: 1987, difficulty: 'medium', funFact: 'Huawei makes the infrastructure for about 30% of the world\'s internet networks!',                   Logo: HuaweiLogo },
    { id: 'asus',        name: 'ASUS',      country: '🇹🇼 Taiwan',founded: 1989, difficulty: 'medium', funFact: 'ASUS is named after Pegasus — the winged horse of Greek mythology — hence the A-S-U-S ending!',     Logo: ASUSLogo },
    { id: 'lenovo',      name: 'Lenovo',    country: '🇨🇳 China', founded: 1984, difficulty: 'easy',   funFact: 'Lenovo bought IBM\'s personal computer division in 2005, including the famous ThinkPad laptop!',      Logo: LenovoLogo },
    { id: 'oracle',      name: 'Oracle',    country: '🇺🇸 USA',   founded: 1977, difficulty: 'medium', funFact: 'Oracle was founded with money from the CIA — their first customer was the US intelligence agency!',   Logo: OracleLogo },
    { id: 'salesforce',  name: 'Salesforce',country: '🇺🇸 USA',   founded: 1999, difficulty: 'hard',   funFact: 'Salesforce holds a lottery each year to give away 1% of its equity, product, and employees\' time!',  Logo: SalesforceLogo },
    { id: 'dropbox',     name: 'Dropbox',   country: '🇺🇸 USA',   founded: 2007, difficulty: 'medium', funFact: 'Dropbox was started after the founder kept forgetting his USB drive — a relatable origin story!',     Logo: DropboxLogo },
    { id: 'slack',       name: 'Slack',     country: '🇺🇸 USA',   founded: 2009, difficulty: 'medium', funFact: 'Slack grew from 0 to 1 million users in just 24 hours after it launched — unprecedented growth!',     Logo: SlackLogo },
    { id: 'zoom',        name: 'Zoom',      country: '🇺🇸 USA',   founded: 2011, difficulty: 'easy',   funFact: 'Zoom became a verb during the pandemic — "Let\'s Zoom" entered everyday language worldwide!',         Logo: ZoomLogo },
    { id: 'airbnb',      name: 'Airbnb',    country: '🇺🇸 USA',   founded: 2008, difficulty: 'easy',   funFact: 'Airbnb was first called "Air Bed and Breakfast" — founders literally rented out air mattresses!',     Logo: AirbnbLogo },
    { id: 'linkedin',    name: 'LinkedIn',  country: '🇺🇸 USA',   founded: 2003, difficulty: 'easy',   funFact: 'LinkedIn was founded a year before Facebook — it\'s the original professional social network!',       Logo: LinkedInLogo },
    { id: 'snapchat',    name: 'Snapchat',  country: '🇺🇸 USA',   founded: 2011, difficulty: 'easy',   funFact: 'Snapchat was first called "Picaboo" — named after the children\'s game peek-a-boo!',                 Logo: SnapchatLogo },
    { id: 'discord',     name: 'Discord',   country: '🇺🇸 USA',   founded: 2015, difficulty: 'medium', funFact: 'Discord was originally built for gamers but it\'s now used by everyone from study groups to fan clubs!',Logo: DiscordLogo },
    { id: 'youtube',     name: 'YouTube',   country: '🇺🇸 USA',   founded: 2005, difficulty: 'easy',   funFact: 'YouTube was originally a video dating site before pivoting to general videos!',                      Logo: YouTubeLogo },
    { id: 'twitch',      name: 'Twitch',    country: '🇺🇸 USA',   founded: 2011, difficulty: 'easy',   funFact: 'Over 30 million people visit Twitch every single day to watch others play video games!',               Logo: TwitchLogo },
    { id: 'whatsapp',    name: 'WhatsApp',  country: '🇺🇸 USA',   founded: 2009, difficulty: 'easy',   funFact: 'WhatsApp was bought by Facebook for $19 billion — at the time it only had 55 employees!',             Logo: WhatsAppLogo },
    { id: 'reddit',      name: 'Reddit',    country: '🇺🇸 USA',   founded: 2005, difficulty: 'easy',   funFact: 'Reddit\'s alien mascot is named "Snoo" — the founders made it up as a placeholder and it stuck!',    Logo: RedditLogo },
  ],
  food: [
    { id: 'mcdonalds',   name: "McDonald's",  country: '🇺🇸 USA',     founded: 1940, difficulty: 'easy',   funFact: "McDonald's serves about 69 million people every day — more than the UK's entire population!",     Logo: McDonaldsLogo },
    { id: 'cocacola',    name: 'Coca-Cola',   country: '🇺🇸 USA',     founded: 1886, difficulty: 'easy',   funFact: 'If all Coca-Cola bottles were stacked up, they would reach the Moon and back 30 times!',          Logo: CocaColaLogo },
    { id: 'pepsi',       name: 'Pepsi',       country: '🇺🇸 USA',     founded: 1893, difficulty: 'easy',   funFact: 'Pepsi got its name from "pepsin" (a digestive enzyme) and "kola nuts" combined!',                Logo: PepsiLogo },
    { id: 'starbucks',   name: 'Starbucks',   country: '🇺🇸 USA',     founded: 1971, difficulty: 'easy',   funFact: 'Starbucks was named after a character in the famous novel Moby Dick!',                          Logo: StarbucksLogo },
    { id: 'kfc',         name: 'KFC',         country: '🇺🇸 USA',     founded: 1930, difficulty: 'easy',   funFact: 'Colonel Sanders started KFC at age 65 — proving it\'s never too late to chase your dreams!',    Logo: KFCLogo },
    { id: 'pizzahut',    name: 'Pizza Hut',   country: '🇺🇸 USA',     founded: 1958, difficulty: 'easy',   funFact: 'The first Pizza Hut was so tiny the waitress could touch both walls at the same time!',          Logo: PizzaHutLogo },
    { id: 'burgerking',  name: 'Burger King', country: '🇺🇸 USA',     founded: 1953, difficulty: 'easy',   funFact: 'Burger King was originally called "Insta-Burger King" — the name was just too long!',            Logo: BurgerKingLogo },
    { id: 'subway',      name: 'Subway',      country: '🇺🇸 USA',     founded: 1965, difficulty: 'easy',   funFact: 'There are more Subway restaurants in the world than any other fast food chain!',                Logo: SubwayLogo },
    { id: 'dominos',     name: "Domino's",    country: '🇺🇸 USA',     founded: 1960, difficulty: 'easy',   funFact: 'The Domino\'s logo has three dots — one for each store when they first made the logo!',         Logo: DominosLogo },
    { id: 'tacobell',    name: 'Taco Bell',   country: '🇺🇸 USA',     founded: 1962, difficulty: 'easy',   funFact: 'Taco Bell was started by Glen Bell who sold tacos for 19 cents each from a tiny stand!',        Logo: TacoBellLogo },
    { id: 'dunkin',      name: "Dunkin'",     country: '🇺🇸 USA',     founded: 1950, difficulty: 'easy',   funFact: 'Dunkin\' dropped the word "Donuts" from its name in 2019 to focus on drinks too!',             Logo: DunkinLogo },
    { id: 'redbull',     name: 'Red Bull',    country: '🇦🇹 Austria', founded: 1987, difficulty: 'easy',   funFact: 'Red Bull is based on a Thai energy drink — it literally gives you wings (and owns F1 teams)!', Logo: RedBullLogo },
    { id: 'heineken',    name: 'Heineken',    country: '🇳🇱 Netherlands',founded: 1864, difficulty: 'hard', funFact: 'Heineken\'s recipe has been almost unchanged since 1886 — it\'s a true classic!',             Logo: HeinekenLogo },
    { id: 'lays',        name: "Lay's",       country: '🇺🇸 USA',     founded: 1932, difficulty: 'easy',   funFact: 'Lay\'s potato chips are the best-selling snack brand in the world!',                         Logo: LaysLogo },
    { id: 'oreo',        name: 'Oreo',        country: '🇺🇸 USA',     founded: 1912, difficulty: 'easy',   funFact: 'Nobody knows for sure what "Oreo" means — it\'s one of the great food mysteries!',            Logo: OreoLogo },
    { id: 'nutella',     name: 'Nutella',      country: '🇮🇹 Italy',      founded: 1964, difficulty: 'easy',   funFact: 'Nutella was invented because cocoa was scarce after WWII — hazelnuts were cheaper than chocolate!', Logo: NutellaLogo },
    { id: 'nestle',      name: 'Nestlé',       country: '🇨🇭 Switzerland',founded: 1866, difficulty: 'medium', funFact: 'Nestlé is the world\'s largest food company — they make everything from KitKat to Nespresso!',     Logo: NestleLogo },
    { id: 'kraft',       name: 'Kraft',        country: '🇺🇸 USA',        founded: 1903, difficulty: 'medium', funFact: 'Kraft cheese slices were the world\'s first individually wrapped processed cheese slices!',          Logo: KraftLogo },
    { id: 'heinz',       name: 'Heinz',        country: '🇺🇸 USA',        founded: 1869, difficulty: 'medium', funFact: 'Heinz\'s "57 Varieties" was made up — Henry Heinz thought 57 was a lucky number!',                  Logo: HeinzLogo },
    { id: 'kelloggs',    name: "Kellogg's",    country: '🇺🇸 USA',        founded: 1906, difficulty: 'easy',   funFact: 'Kellogg\'s Corn Flakes were invented as a bland food to discourage unhealthy behaviour — it backfired!',Logo: KelloggsLogo },
    { id: 'mars',        name: 'Mars',         country: '🇺🇸 USA',        founded: 1911, difficulty: 'easy',   funFact: 'The Mars bar was named after the founder\'s father Frank Mars, not the planet!',                    Logo: MarsLogo },
    { id: 'pringles',    name: 'Pringles',     country: '🇺🇸 USA',        founded: 1968, difficulty: 'easy',   funFact: 'The Pringles tube was designed by a mathematician — its curved shape is called a hyperbolic paraboloid!',Logo: PringlesLogo },
    { id: 'doritos',     name: 'Doritos',      country: '🇺🇸 USA',        founded: 1964, difficulty: 'easy',   funFact: 'Doritos were first sold at Disneyland in 1964 — they were made from leftover tortillas!',             Logo: DoritosLogo },
    { id: 'sprite',      name: 'Sprite',       country: '🇺🇸 USA',        founded: 1961, difficulty: 'easy',   funFact: 'Sprite was invented to compete with 7-Up — the original name was Fanta Klare Zitrone!',              Logo: SpriteLogo },
    { id: 'fanta',       name: 'Fanta',        country: '🇩🇪 Germany',    founded: 1940, difficulty: 'easy',   funFact: 'Fanta was invented in Germany during WWII when Coca-Cola ingredients couldn\'t be imported!',        Logo: FantaLogo },
    { id: 'mountaindew', name: 'Mountain Dew', country: '🇺🇸 USA',        founded: 1940, difficulty: 'medium', funFact: 'Mountain Dew was originally created as a whiskey mixer in Tennessee!',                              Logo: MountainDewLogo },
    { id: 'gatorade',    name: 'Gatorade',     country: '🇺🇸 USA',        founded: 1965, difficulty: 'medium', funFact: 'Gatorade was invented by scientists to help the University of Florida Gators football team!',        Logo: GatoradeLogo },
    { id: 'monster',     name: 'Monster Energy',country: '🇺🇸 USA',       founded: 1997, difficulty: 'easy',   funFact: 'Monster Energy\'s claw logo looks like three Hebrew letters that spell out the number 666!',         Logo: MonsterEnergyLogo },
    { id: 'kitkat',      name: 'Kit Kat',      country: '🇬🇧 UK',         founded: 1935, difficulty: 'easy',   funFact: 'Kit Kat bars were first sent to British soldiers in WWII as part of their rations!',                 Logo: KitKatLogo },
    { id: 'snickers',    name: 'Snickers',     country: '🇺🇸 USA',        founded: 1930, difficulty: 'easy',   funFact: 'Snickers is the world\'s best-selling candy bar — billions are made every single year!',             Logo: SnickersLogo },
    { id: 'cadbury',     name: 'Cadbury',      country: '🇬🇧 UK',         founded: 1824, difficulty: 'easy',   funFact: 'Cadbury\'s founder was a Quaker who believed chocolate was a healthy alternative to alcohol!',       Logo: CadburyLogo },
    { id: 'fiveguys',    name: 'Five Guys',    country: '🇺🇸 USA',        founded: 1986, difficulty: 'medium', funFact: 'Five Guys is named after the five sons of the founding family — they still run it today!',           Logo: FiveGuysLogo },
    { id: 'chipotle',    name: 'Chipotle',     country: '🇺🇸 USA',        founded: 1993, difficulty: 'medium', funFact: 'Chipotle was originally funded by McDonald\'s — who later sold their stake when it took off!',       Logo: ChipotleLogo },
    { id: 'wendys',      name: "Wendy's",      country: '🇺🇸 USA',        founded: 1969, difficulty: 'easy',   funFact: 'Wendy\'s was named after the founder\'s daughter Melinda, whose nickname was Wendy!',               Logo: WendysLogo },
    { id: 'chickfila',   name: 'Chick-fil-A',  country: '🇺🇸 USA',        founded: 1946, difficulty: 'medium', funFact: 'Chick-fil-A is always closed on Sundays — the founder wanted staff to rest and attend church!',     Logo: ChickFilALogo },
    { id: 'timhortons',  name: 'Tim Hortons',  country: '🇨🇦 Canada',     founded: 1964, difficulty: 'medium', funFact: 'Tim Hortons was named after a real hockey player who co-founded the chain before dying in a crash!', Logo: TimHortonsLogo },
    { id: 'krispykreme', name: 'Krispy Kreme', country: '🇺🇸 USA',        founded: 1937, difficulty: 'easy',   funFact: 'When the Krispy Kreme "Hot Now" sign is lit, fresh hot doughnuts are ready right that moment!',     Logo: KrispyKremeLogo },
    { id: 'budweiser',   name: 'Budweiser',    country: '🇺🇸 USA',        founded: 1876, difficulty: 'medium', funFact: 'Budweiser is one of the most-watched Super Bowl advertisers — their ads are legendary!',            Logo: BudweiserLogo },
    { id: 'corona',      name: 'Corona',       country: '🇲🇽 Mexico',     founded: 1925, difficulty: 'medium', funFact: 'Corona is the world\'s most popular imported beer — and it\'s always served with a lime!',          Logo: CoronaLogo },
    { id: 'guinness',    name: 'Guinness',     country: '🇮🇪 Ireland',    founded: 1759, difficulty: 'medium', funFact: 'Guinness was founded in 1759 on a 9,000-year lease — Arthur Guinness was very optimistic!',          Logo: GuinnessLogo },
  ],
  sports: [
    { id: 'nike',         name: 'Nike',          country: '🇺🇸 USA',     founded: 1964, difficulty: 'easy',   funFact: 'Nike is named after the Greek goddess of victory — her wings inspired the famous swoosh!',       Logo: NikeLogo },
    { id: 'adidas',       name: 'Adidas',        country: '🇩🇪 Germany', founded: 1949, difficulty: 'easy',   funFact: 'Adidas and Puma were started by two brothers who had a big argument and split their company!',    Logo: AdidasLogo },
    { id: 'puma',         name: 'Puma',          country: '🇩🇪 Germany', founded: 1948, difficulty: 'easy',   funFact: 'Puma was founded by Rudolf Dassler, the brother of the Adidas founder — family rivals!',         Logo: PumaLogo },
    { id: 'reebok',       name: 'Reebok',        country: '🇬🇧 UK',      founded: 1958, difficulty: 'medium', funFact: 'Reebok was named after the rhebok — a type of incredibly fast antelope from Africa!',            Logo: ReebokLogo },
    { id: 'underarmour',  name: 'Under Armour',  country: '🇺🇸 USA',     founded: 1996, difficulty: 'medium', funFact: 'Under Armour was invented by a college footballer who hated how cotton got sweaty in games!',    Logo: UnderArmourLogo },
    { id: 'newbalance',   name: 'New Balance',   country: '🇺🇸 USA',     founded: 1906, difficulty: 'hard',   funFact: 'New Balance originally made arch support insoles — shoes came much later!',                     Logo: NewBalanceLogo },
    { id: 'converse',     name: 'Converse',      country: '🇺🇸 USA',     founded: 1908, difficulty: 'easy',   funFact: 'The Chuck Taylor All Star shoe has barely changed since 1917 and is still popular today!',      Logo: ConverseLogo },
    { id: 'vans',         name: 'Vans',          country: '🇺🇸 USA',     founded: 1966, difficulty: 'easy',   funFact: 'Vans shoes were first sold in 1966 and originally customers could design their own!',           Logo: VansLogo },
    { id: 'lacoste',      name: 'Lacoste',       country: '🇫🇷 France',  founded: 1933, difficulty: 'medium', funFact: 'Lacoste was named after tennis star René Lacoste, nicknamed "The Crocodile" by fans!',          Logo: LacosteLogo },
    { id: 'asics',        name: 'ASICS',         country: '🇯🇵 Japan',   founded: 1949, difficulty: 'medium', funFact: 'ASICS stands for "Anima Sana In Corpore Sano" — Latin for "a healthy soul in a healthy body"!',  Logo: AsicsLogo },
    { id: 'fila',         name: 'Fila',          country: '🇮🇹 Italy',   founded: 1911, difficulty: 'medium', funFact: 'Fila was founded in a tiny Italian village and became famous for making fabrics for the Alps!',  Logo: FilaLogo },
    { id: 'champion',     name: 'Champion',      country: '🇺🇸 USA',     founded: 1919, difficulty: 'medium', funFact: 'Champion invented the hoodie in 1934 — it was originally made to keep athletes warm!',          Logo: ChampionLogo },
    { id: 'mizuno',       name: 'Mizuno',        country: '🇯🇵 Japan',   founded: 1906, difficulty: 'hard',   funFact: 'Mizuno makes products for 35 different sports — from golf and swimming to ice hockey!',          Logo: MizunoLogo },
    { id: 'wilson',       name: 'Wilson',        country: '🇺🇸 USA',     founded: 1913, difficulty: 'medium', funFact: 'Wilson makes the official ball for the NFL, US Open tennis, and NBA basketball!',              Logo: WilsonLogo },
    { id: 'head',         name: 'Head',          country: '🇦🇹 Austria', founded: 1950, difficulty: 'hard',   funFact: 'Head was the first sports brand to use graphite — it completely changed how rackets were made!', Logo: HeadLogo },
    { id: 'columbia',    name: 'Columbia',      country: '🇺🇸 USA',     founded: 1938, difficulty: 'hard',   funFact: 'Columbia Sportswear was almost sold for $1,000 during tough times — the owner\'s wife saved it!', Logo: ColumbiaLogo },
    { id: 'northface',   name: 'The North Face',country: '🇺🇸 USA',     founded: 1966, difficulty: 'medium', funFact: 'The North Face was named after the coldest and most brutal side of a mountain!',                Logo: NorthFaceLogo },
    { id: 'patagonia',   name: 'Patagonia',     country: '🇺🇸 USA',     founded: 1973, difficulty: 'medium', funFact: 'Patagonia donates 1% of all sales to environmental groups — they call it an "Earth tax"!',      Logo: PatagoniaLogo },
    { id: 'salomon',     name: 'Salomon',       country: '🇫🇷 France',  founded: 1947, difficulty: 'hard',   funFact: 'Salomon started by making ski edges and clamps — now they dominate trail running too!',          Logo: SalomonLogo },
    { id: 'umbro',       name: 'Umbro',         country: '🇬🇧 UK',      founded: 1924, difficulty: 'hard',   funFact: 'Umbro made the kits worn by England when they won the 1966 FIFA World Cup!',                   Logo: UmbroLogo },
    { id: 'saucony',     name: 'Saucony',       country: '🇺🇸 USA',     founded: 1898, difficulty: 'hard',   funFact: 'Saucony is named after the Saucony Creek in Pennsylvania where their first factory was built!',  Logo: SauconyLogo },
    { id: 'brooks',      name: 'Brooks',        country: '🇺🇸 USA',     founded: 1914, difficulty: 'hard',   funFact: 'Brooks Running is so focused on running they stopped making every other type of shoe!',          Logo: BrooksLogo },
    { id: 'speedo',      name: 'Speedo',        country: '🇦🇺 Australia',founded: 1914, difficulty: 'medium', funFact: 'Speedo\'s LZR Racer swimsuit was so fast it was banned from the Olympics for being unfair!',   Logo: SpeedoLogo },
    { id: 'titleist',    name: 'Titleist',      country: '🇺🇸 USA',     founded: 1932, difficulty: 'hard',   funFact: 'Titleist is the most played ball on the professional golf tours worldwide!',                    Logo: TitleistLogo },
    { id: 'taylormade',  name: 'TaylorMade',    country: '🇺🇸 USA',     founded: 1979, difficulty: 'hard',   funFact: 'TaylorMade made the first metal wood golf club — it totally changed how golf was played!',        Logo: TaylorMadeLogo },
    { id: 'callaway',    name: 'Callaway',      country: '🇺🇸 USA',     founded: 1982, difficulty: 'hard',   funFact: 'Callaway\'s Big Bertha driver was named after a famous WWI German cannon known for its size!',   Logo: CallawayLogo },
    { id: 'babolat',     name: 'Babolat',       country: '🇫🇷 France',  founded: 1875, difficulty: 'hard',   funFact: 'Babolat invented natural gut tennis strings in 1875 — they\'ve been at it for 150 years!',        Logo: BabolatLogo },
    { id: 'yonex',       name: 'Yonex',         country: '🇯🇵 Japan',   founded: 1946, difficulty: 'hard',   funFact: 'Yonex started by making wooden floats for fishing nets — quite the pivot to badminton!',         Logo: YonexLogo },
    { id: 'lining',      name: 'Li-Ning',       country: '🇨🇳 China',   founded: 1989, difficulty: 'hard',   funFact: 'Li-Ning was founded by a Chinese gymnast who won 6 medals at the 1984 Olympics!',               Logo: LiNingLogo },
    { id: 'anta',        name: 'Anta',          country: '🇨🇳 China',   founded: 1991, difficulty: 'hard',   funFact: 'Anta is now China\'s biggest sportswear brand and sponsors the Chinese Olympic team!',           Logo: AntaLogo },
  ],
  airlines: [
    { id: 'emirates',    name: 'Emirates',           country: '🇦🇪 UAE',          founded: 1985, difficulty: 'easy',   funFact: 'Emirates flies to more countries than any other airline in the world!',                      Logo: EmiratesLogo },
    { id: 'ba',          name: 'British Airways',    country: '🇬🇧 UK',           founded: 1974, difficulty: 'easy',   funFact: 'British Airways flew the iconic Concorde — the world\'s fastest passenger jet!',              Logo: BritishAirwaysLogo },
    { id: 'airfrance',   name: 'Air France',         country: '🇫🇷 France',       founded: 1933, difficulty: 'medium', funFact: 'Air France created the first business class seats on planes in the 1970s!',                   Logo: AirFranceLogo },
    { id: 'lufthansa',   name: 'Lufthansa',          country: '🇩🇪 Germany',      founded: 1953, difficulty: 'medium', funFact: 'The Lufthansa yellow crane logo has been around since 1918 — over 100 years old!',             Logo: LufthansaLogo },
    { id: 'singaporeair',name: 'Singapore Airlines', country: '🇸🇬 Singapore',    founded: 1972, difficulty: 'hard',   funFact: 'Singapore Airlines is famous for having some of the world\'s best in-flight meals!',          Logo: SingaporeAirlinesLogo },
    { id: 'delta',       name: 'Delta',              country: '🇺🇸 USA',          founded: 1924, difficulty: 'easy',   funFact: 'Delta Air Lines is one of the oldest airlines in the world, founded back in 1924!',            Logo: DeltaLogo },
    { id: 'united',      name: 'United Airlines',    country: '🇺🇸 USA',          founded: 1926, difficulty: 'medium', funFact: 'United was the first airline to offer coast-to-coast flights across America in 1934!',          Logo: UnitedLogo },
    { id: 'qantas',      name: 'Qantas',             country: '🇦🇺 Australia',    founded: 1920, difficulty: 'medium', funFact: 'Qantas is the world\'s third oldest airline — it\'s been flying for over 100 years!',         Logo: QantasLogo },
    { id: 'turkish',     name: 'Turkish Airlines',   country: '🇹🇷 Turkey',       founded: 1933, difficulty: 'medium', funFact: 'Turkish Airlines flies to more countries than any other airline — over 120 destinations!',    Logo: TurkishAirlinesLogo },
    { id: 'cathay',      name: 'Cathay Pacific',     country: '🇭🇰 Hong Kong',    founded: 1946, difficulty: 'hard',   funFact: '"Cathay" is an old name for China used by Marco Polo on his famous travels!',                Logo: CathayPacificLogo },
    { id: 'american',    name: 'American Airlines',  country: '🇺🇸 USA',          founded: 1930, difficulty: 'medium', funFact: 'American Airlines is one of the largest airlines in the world by number of passengers!',       Logo: AmericanAirlinesLogo },
    { id: 'etihad',      name: 'Etihad Airways',     country: '🇦🇪 UAE',          founded: 2003, difficulty: 'hard',   funFact: 'Etihad means "union" in Arabic — it was created to represent the United Arab Emirates!',     Logo: EtihadLogo },
    { id: 'ryanair',     name: 'Ryanair',            country: '🇮🇪 Ireland',      founded: 1984, difficulty: 'easy',   funFact: 'Ryanair is the biggest budget airline in Europe — it made flying cheap for everyone!',         Logo: RyanairLogo },
    { id: 'southwest',   name: 'Southwest Airlines', country: '🇺🇸 USA',        founded: 1967, difficulty: 'medium', funFact: 'Southwest Airlines names all their planes — and lets employees decorate them with artwork!',  Logo: SouthwestLogo },
    { id: 'klm',         name: 'KLM',               country: '🇳🇱 Netherlands',founded: 1919, difficulty: 'medium', funFact: 'KLM is the world\'s oldest airline still operating under its original name — over 100 years!', Logo: KLMLogo },
    { id: 'aircanada',   name: 'Air Canada',         country: '🇨🇦 Canada',     founded: 1937, difficulty: 'medium', funFact: 'Air Canada\'s maple leaf tail logo is one of the most recognisable in aviation!',             Logo: AirCanadaLogo },
    { id: 'swiss',       name: 'Swiss',              country: '🇨🇭 Switzerland',founded: 2002, difficulty: 'medium', funFact: 'SWISS uses Switzerland\'s flag cross as its logo — simple and instantly recognisable!',        Logo: SwissLogo },
    { id: 'austrian',    name: 'Austrian Airlines',  country: '🇦🇹 Austria',    founded: 1957, difficulty: 'hard',   funFact: 'Austrian Airlines flies to Vienna — one of the most beautiful and historic cities in the world!',Logo: AustrianAirlinesLogo },
    { id: 'finnair',     name: 'Finnair',            country: '🇫🇮 Finland',    founded: 1923, difficulty: 'hard',   funFact: 'Finnair has the shortest flight route between Europe and Asia — through the North Pole!',       Logo: FinnairLogo },
    { id: 'iberia',      name: 'Iberia',             country: '🇪🇸 Spain',      founded: 1927, difficulty: 'hard',   funFact: 'Iberia is Spain\'s national airline and one of the oldest carriers in the world!',             Logo: IberiaLogo },
    { id: 'virgin',      name: 'Virgin Atlantic',    country: '🇬🇧 UK',         founded: 1984, difficulty: 'easy',   funFact: 'Richard Branson started Virgin Atlantic after being bumped from a British Airways flight!',    Logo: VirginAtlanticLogo },
    { id: 'jetblue',     name: 'JetBlue',            country: '🇺🇸 USA',        founded: 1998, difficulty: 'medium', funFact: 'JetBlue was the first US airline to have personal TV screens on every seat!',                 Logo: JetBlueLogo },
    { id: 'alaska',      name: 'Alaska Airlines',    country: '🇺🇸 USA',        founded: 1932, difficulty: 'medium', funFact: 'Alaska Airlines famous Eskimo logo has appeared on their planes since 1972!',                Logo: AlaskaAirlinesLogo },
    { id: 'airnz',       name: 'Air New Zealand',    country: '🇳🇿 New Zealand',founded: 1940, difficulty: 'hard',   funFact: 'Air New Zealand had an all-black plane as a tribute to the famous All Blacks rugby team!',     Logo: AirNewZealandLogo },
    { id: 'jal',         name: 'Japan Airlines',     country: '🇯🇵 Japan',      founded: 1951, difficulty: 'medium', funFact: 'Japan Airlines (JAL) has one of the best safety records of any airline in the world!',        Logo: JALLogo },
    { id: 'ana',         name: 'ANA',                country: '🇯🇵 Japan',      founded: 1952, difficulty: 'hard',   funFact: 'ANA stands for All Nippon Airways — Nippon is Japan\'s name for itself in Japanese!',          Logo: ANALogo },
    { id: 'koreanair',   name: 'Korean Air',         country: '🇰🇷 Korea',      founded: 1969, difficulty: 'hard',   funFact: 'Korean Air has one of the largest cargo fleets in the world!',                              Logo: KoreanAirLogo },
    { id: 'airasia',     name: 'AirAsia',            country: '🇲🇾 Malaysia',   founded: 2001, difficulty: 'medium', funFact: 'AirAsia made flying affordable for millions in Southeast Asia — "Now everyone can fly"!',    Logo: AirAsiaLogo },
    { id: 'indigo',      name: 'IndiGo',             country: '🇮🇳 India',      founded: 2006, difficulty: 'hard',   funFact: 'IndiGo is India\'s largest airline — they carry more than half of all domestic passengers!',  Logo: IndiGoLogo },
    { id: 'latam',       name: 'LATAM',              country: '🇧🇷 Brazil',     founded: 1929, difficulty: 'hard',   funFact: 'LATAM Airlines is the biggest airline in Latin America, flying across 27 countries!',         Logo: LATAMLogo },
    { id: 'aeromexico',  name: 'Aeroméxico',         country: '🇲🇽 Mexico',     founded: 1934, difficulty: 'hard',   funFact: 'Aeroméxico is Mexico\'s flag carrier and one of the founding members of SkyTeam alliance!',  Logo: AeroMexicoLogo },
    { id: 'ethiopian',   name: 'Ethiopian Airlines', country: '🇪🇹 Ethiopia',   founded: 1945, difficulty: 'hard',   funFact: 'Ethiopian Airlines is Africa\'s most profitable airline and covers more African routes than any other!',Logo: EthiopianAirlinesLogo },
    { id: 'westjet',     name: 'WestJet',            country: '🇨🇦 Canada',     founded: 1996, difficulty: 'hard',   funFact: 'WestJet crew famously made a viral video surprising passengers with Christmas gifts mid-flight!',Logo: WestJetLogo },
    { id: 'easyjet',     name: 'easyJet',            country: '🇬🇧 UK',         founded: 1995, difficulty: 'easy',   funFact: 'easyJet painted their phone number on planes so passengers could book without a travel agent!', Logo: EasyJetLogo },
  ],
  gaming: [
    { id: 'nintendo',    name: 'Nintendo',      country: '🇯🇵 Japan', founded: 1889, difficulty: 'easy',   funFact: 'Nintendo started in 1889 making playing cards — it\'s over 130 years old!',                        Logo: NintendoLogo },
    { id: 'playstation', name: 'PlayStation',   country: '🇯🇵 Japan', founded: 1994, difficulty: 'easy',   funFact: 'PlayStation was originally designed as a Nintendo add-on before Sony made it on their own!',       Logo: PlayStationLogo },
    { id: 'xbox',        name: 'Xbox',          country: '🇺🇸 USA',   founded: 2001, difficulty: 'easy',   funFact: 'The Xbox got its name from "DirectX Box" — DirectX is the graphics technology inside!',            Logo: XboxLogo },
    { id: 'ea',          name: 'EA Sports',     country: '🇺🇸 USA',   founded: 1982, difficulty: 'medium', funFact: 'EA Sports were the first company to use real athletes\' names and likenesses in sports games!',     Logo: EALogo },
    { id: 'ubisoft',     name: 'Ubisoft',       country: '🇫🇷 France',founded: 1986, difficulty: 'hard',   funFact: 'Ubisoft was founded by five French brothers in their small village in Brittany, France!',           Logo: UbisoftLogo },
    { id: 'steam',       name: 'Steam',         country: '🇺🇸 USA',   founded: 2003, difficulty: 'medium', funFact: 'Steam has over 50,000 games — playing one per day would take 136 years to finish them all!',        Logo: SteamLogo },
    { id: 'riot',        name: 'Riot Games',    country: '🇺🇸 USA',   founded: 2006, difficulty: 'hard',   funFact: 'Riot\'s League of Legends is played by over 150 million people around the world!',                  Logo: RiotGamesLogo },
    { id: 'blizzard',    name: 'Blizzard',      country: '🇺🇸 USA',   founded: 1991, difficulty: 'hard',   funFact: 'Blizzard\'s World of Warcraft was so popular it created its own real virtual economy!',             Logo: BlizzardLogo },
    { id: 'activision',  name: 'Activision',    country: '🇺🇸 USA',   founded: 1979, difficulty: 'medium', funFact: 'Activision published Call of Duty — the best-selling video game franchise of all time!',            Logo: ActivisionLogo },
    { id: 'capcom',      name: 'Capcom',        country: '🇯🇵 Japan', founded: 1979, difficulty: 'medium', funFact: 'Capcom created Street Fighter, Resident Evil, AND Monster Hunter — absolute gaming legends!',        Logo: CapcomLogo },
    { id: 'sega',        name: 'Sega',          country: '🇯🇵 Japan', founded: 1945, difficulty: 'easy',   funFact: 'Sega originally stood for "Service Games" — they started by making slot machines for US soldiers!',  Logo: SegaLogo },
    { id: 'epic',        name: 'Epic Games',    country: '🇺🇸 USA',   founded: 1991, difficulty: 'medium', funFact: 'Epic Games made Fortnite AND the Unreal Engine — the technology behind thousands of other games!',   Logo: EpicGamesLogo },
    { id: 'rockstar',    name: 'Rockstar Games',country: '🇺🇸 USA',   founded: 1998, difficulty: 'medium', funFact: 'Rockstar\'s Grand Theft Auto V made $1 billion in just 3 days — faster than any movie ever!',       Logo: RockstarLogo },
    { id: 'squareenix',  name: 'Square Enix',   country: '🇯🇵 Japan', founded: 2003, difficulty: 'hard',   funFact: 'Square Enix created Final Fantasy AND Dragon Quest — two of the greatest RPG series ever!',         Logo: SquareEnixLogo },
    { id: 'konami',      name: 'Konami',        country: '🇯🇵 Japan', founded: 1969, difficulty: 'medium', funFact: 'Konami created Metal Gear Solid, Pro Evolution Soccer, AND Dance Dance Revolution!',                Logo: KonamiLogo },
    { id: 'cdprojekt',   name: 'CD Projekt Red', country: '🇵🇱 Poland', founded: 1994, difficulty: 'hard',   funFact: 'CD Projekt Red made The Witcher 3 — voted one of the greatest video games ever made!',            Logo: CDProjektLogo },
    { id: 'bethesda',    name: 'Bethesda',        country: '🇺🇸 USA',   founded: 1986, difficulty: 'medium', funFact: 'Bethesda created The Elder Scrolls and Fallout — two of the most epic RPG universes ever built!',  Logo: BethesdaLogo },
    { id: 'bandainamco', name: 'Bandai Namco',    country: '🇯🇵 Japan', founded: 2005, difficulty: 'hard',   funFact: 'Bandai Namco created Pac-Man, Tekken, Elden Ring, and Dark Souls — legendary contributions!',       Logo: BandaiNamcoLogo },
    { id: 'twok',        name: '2K Games',        country: '🇺🇸 USA',   founded: 2005, difficulty: 'medium', funFact: '2K makes NBA 2K — the basketball sim so realistic NBA players use it to study their own moves!',   Logo: TwoKLogo },
    { id: 'thq',         name: 'THQ Nordic',      country: '🇦🇹 Austria',founded: 1989, difficulty: 'hard',  funFact: 'THQ Nordic bought up many classic dormant game franchises and brought them back to life!',          Logo: THQLogo },
    { id: 'io',          name: 'IO Interactive',  country: '🇩🇰 Denmark',founded: 1998, difficulty: 'hard',  funFact: 'IO Interactive created Hitman — a stealth game so clever that no two playthroughs are the same!',  Logo: IOInteractiveLogo },
    { id: 'naughtydog',  name: 'Naughty Dog',     country: '🇺🇸 USA',   founded: 1984, difficulty: 'hard',   funFact: 'Naughty Dog created Crash Bandicoot AND The Last of Us — covering every genre of gaming!',          Logo: NaughtyDogLogo },
    { id: 'mojang',      name: 'Mojang',          country: '🇸🇪 Sweden', founded: 2009, difficulty: 'medium', funFact: 'Mojang\'s Minecraft is the best-selling video game of all time with over 238 million copies sold!', Logo: MojangLogo },
    { id: 'atari',       name: 'Atari',           country: '🇺🇸 USA',   founded: 1972, difficulty: 'medium', funFact: 'Atari invented Pong — the world\'s first commercially successful video game back in 1972!',         Logo: AtariLogo },
    { id: 'bungie',      name: 'Bungie',          country: '🇺🇸 USA',   founded: 1991, difficulty: 'hard',   funFact: 'Bungie created Halo AND Destiny — two of the most influential shooter games ever made!',            Logo: BungieLogo },
    { id: 'insomniac',   name: 'Insomniac Games', country: '🇺🇸 USA',   founded: 1994, difficulty: 'hard',   funFact: 'Insomniac Games made Spider-Man — the fastest-selling PlayStation exclusive of all time!',          Logo: InsomniacGamesLogo },
    { id: 'fromsoftware',name: 'FromSoftware',    country: '🇯🇵 Japan', founded: 1986, difficulty: 'hard',   funFact: 'FromSoftware\'s Dark Souls is so challenging it created its own gaming genre: "Soulslike"!',        Logo: FromSoftwareLogo },
    { id: 'valve',       name: 'Valve',           country: '🇺🇸 USA',   founded: 1996, difficulty: 'medium', funFact: 'Valve has no CEO or managers — all employees choose their own projects in a flat structure!',       Logo: ValveLogo },
  ],
  luxury: [
    { id: 'lv',           name: 'Louis Vuitton', country: '🇫🇷 France', founded: 1854, difficulty: 'medium', funFact: 'Louis Vuitton started in 1854 making luggage for wealthy travellers on horse-drawn carriages!',    Logo: LouisVuittonLogo },
    { id: 'gucci',        name: 'Gucci',         country: '🇮🇹 Italy',  founded: 1921, difficulty: 'easy',   funFact: 'Guccio Gucci was inspired to start his brand after working as a lift boy in a London hotel!',      Logo: GucciLogo },
    { id: 'chanel',       name: 'Chanel',        country: '🇫🇷 France', founded: 1910, difficulty: 'easy',   funFact: 'Coco Chanel was one of the first designers to make women\'s fashion truly comfortable!',           Logo: ChanelLogo },
    { id: 'rolex',        name: 'Rolex',         country: '🇨🇭 Swiss',  founded: 1905, difficulty: 'easy',   funFact: 'Every Rolex watch takes over a year to make and contains more than 200 tiny parts!',              Logo: RolexLogo },
    { id: 'hermes',       name: 'Hermès',        country: '🇫🇷 France', founded: 1837, difficulty: 'hard',   funFact: 'Hermès started in 1837 making horse saddles — horses were very fashionable back then!',           Logo: HermesLogo },
    { id: 'prada',        name: 'Prada',         country: '🇮🇹 Italy',  founded: 1913, difficulty: 'medium', funFact: 'Prada\'s famous nylon bag was made from the same material used in parachutes!',                   Logo: PradaLogo },
    { id: 'versace',      name: 'Versace',       country: '🇮🇹 Italy',  founded: 1978, difficulty: 'medium', funFact: 'Versace chose the Medusa logo because Medusa made people fall in love and never want to leave!',  Logo: VersaceLogo },
    { id: 'burberry',     name: 'Burberry',      country: '🇬🇧 UK',     founded: 1856, difficulty: 'medium', funFact: 'Burberry invented the trench coat during World War I — originally designed for soldiers!',         Logo: BurberryLogo },
    { id: 'dior',         name: 'Dior',          country: '🇫🇷 France', founded: 1946, difficulty: 'easy',   funFact: 'Christian Dior\'s "New Look" in 1947 completely revolutionised fashion after World War II!',       Logo: DiorLogo },
    { id: 'cartier',      name: 'Cartier',       country: '🇫🇷 France', founded: 1847, difficulty: 'medium', funFact: 'Cartier made the world\'s first wristwatch for aviator Alberto Santos-Dumont in 1904!',          Logo: CartierLogo },
    { id: 'tiffany',      name: 'Tiffany & Co.', country: '🇺🇸 USA',    founded: 1837, difficulty: 'medium', funFact: 'The famous "Tiffany Blue" colour is trademarked — nobody else can use that exact shade!',         Logo: TiffanyLogo },
    { id: 'balenciaga',   name: 'Balenciaga',    country: '🇪🇸 Spain',  founded: 1919, difficulty: 'hard',   funFact: 'Coco Chanel called Balenciaga\'s founder "the only true couturier" — highest praise in fashion!', Logo: BalenciagaLogo },
    { id: 'omega',        name: 'Omega',         country: '🇨🇭 Swiss',  founded: 1848, difficulty: 'medium', funFact: 'Omega watches were worn by every NASA Apollo astronaut who walked on the Moon!',                  Logo: OmegaLogo },
    { id: 'tagheuer',     name: 'TAG Heuer',     country: '🇨🇭 Swiss',  founded: 1860, difficulty: 'hard',   funFact: 'TAG Heuer makes timepieces accurate to 1/10,000th of a second — incredibly precise!',             Logo: TagHeuerLogo },
    { id: 'bvlgari',      name: 'Bvlgari',       country: '🇮🇹 Italy',  founded: 1884, difficulty: 'hard',   funFact: 'Bvlgari spells its name with a V instead of U because that\'s how ancient Romans wrote it!',      Logo: BvlgariLogo },
    { id: 'dolcegabbana', name: 'Dolce & Gabbana',country: '🇮🇹 Italy', founded: 1985, difficulty: 'hard',   funFact: 'Dolce & Gabbana was started by two designers who met when they worked for the same fashion house!', Logo: DolceGabbannaLogo },
    { id: 'fendi',        name: 'Fendi',          country: '🇮🇹 Italy', founded: 1925, difficulty: 'hard',   funFact: 'The double-F Fendi logo was designed by Karl Lagerfeld — he worked for Fendi for 54 years!',       Logo: FendiLogo },
    { id: 'ysl',          name: 'Saint Laurent',  country: '🇫🇷 France',founded: 1961, difficulty: 'hard',   funFact: 'Yves Saint Laurent invented the women\'s tuxedo — shocking for fashion in the 1960s!',           Logo: YSLLogo },
    { id: 'bottega',      name: 'Bottega Veneta', country: '🇮🇹 Italy', founded: 1966, difficulty: 'hard',   funFact: 'Bottega Veneta\'s woven leather pattern is so iconic they trademarked it worldwide!',             Logo: BottegaVenetaLogo },
    { id: 'valentino',    name: 'Valentino',      country: '🇮🇹 Italy', founded: 1960, difficulty: 'hard',   funFact: 'Valentino\'s signature red colour is so distinctive it\'s known worldwide as "Valentino Red"!',   Logo: ValentinoLogo },
    { id: 'mcqueen',      name: 'Alexander McQueen',country: '🇬🇧 UK',  founded: 1992, difficulty: 'hard',   funFact: 'Alexander McQueen\'s graduate show was so stunning that Isabella Blow bought the entire collection!',Logo: AlexanderMcQueenLogo },
    { id: 'givenchy',     name: 'Givenchy',       country: '🇫🇷 France',founded: 1952, difficulty: 'hard',   funFact: 'Givenchy dressed Audrey Hepburn — she wore their little black dress in Breakfast at Tiffany\'s!',Logo: GivenchyLogo },
    { id: 'celine',       name: 'Céline',         country: '🇫🇷 France',founded: 1945, difficulty: 'hard',   funFact: 'Céline was founded as a children\'s shoe shop before becoming a luxury fashion powerhouse!',      Logo: CelineLogo },
    { id: 'loewe',        name: 'Loewe',          country: '🇪🇸 Spain', founded: 1846, difficulty: 'hard',   funFact: 'Loewe has been the official supplier to the Spanish Royal Family since 1905!',                   Logo: LoeweLogo },
    { id: 'coach',        name: 'Coach',          country: '🇺🇸 USA',   founded: 1941, difficulty: 'medium', funFact: 'Coach leather goods were originally inspired by the durability of a baseball glove!',            Logo: CoachLogo },
    { id: 'michaelkors',  name: 'Michael Kors',   country: '🇺🇸 USA',   founded: 1981, difficulty: 'medium', funFact: 'Michael Kors was a judge on Project Runway for 9 seasons — he helped launch many careers!',       Logo: MichaelKorsLogo },
    { id: 'ralphlauren',  name: 'Ralph Lauren',   country: '🇺🇸 USA',   founded: 1967, difficulty: 'medium', funFact: 'Ralph Lauren started by designing wide neckties and sold them out of a drawer at Bloomingdale\'s!',Logo: RalphLaurenLogo },
    { id: 'armani',       name: 'Armani',         country: '🇮🇹 Italy', founded: 1975, difficulty: 'medium', funFact: 'Giorgio Armani dressed Richard Gere in American Gigolo — making him famous overnight!',           Logo: ArmaniLogo },
    { id: 'patek',        name: 'Patek Philippe', country: '🇨🇭 Swiss', founded: 1839, difficulty: 'hard',   funFact: 'Patek Philippe\'s Grandmaster Chime watch took 100,000 hours to create and sells for $31 million!',Logo: PatekPhilippeLogo },
    { id: 'audemars',     name: 'Audemars Piguet',country: '🇨🇭 Swiss', founded: 1875, difficulty: 'hard',   funFact: 'The AP Royal Oak was the first luxury sports watch — and was designed in just one night!',         Logo: AudemarsLogo },
    { id: 'iwc',          name: 'IWC',            country: '🇨🇭 Swiss', founded: 1868, difficulty: 'hard',   funFact: 'IWC watches are made in Schaffhausen by American engineer Florentine Ariosto Jones!',            Logo: IWCLogo },
    { id: 'hublot',       name: 'Hublot',         country: '🇨🇭 Swiss', founded: 1980, difficulty: 'hard',   funFact: 'Hublot was the first watch brand to use natural rubber straps — revolutionary in 1980!',          Logo: HublotLogo },
    { id: 'breitling',    name: 'Breitling',      country: '🇨🇭 Swiss', founded: 1884, difficulty: 'hard',   funFact: 'Breitling watches were the official timekeepers for aviation — pilots still love them today!',     Logo: BreitlingLogo },
    { id: 'longines',     name: 'Longines',       country: '🇨🇭 Swiss', founded: 1832, difficulty: 'hard',   funFact: 'Longines is the official timekeeper for the Olympic Games — they\'ve done it since 1896!',        Logo: LonginesLogo },
    { id: 'ferragamo',    name: 'Ferragamo',      country: '🇮🇹 Italy', founded: 1927, difficulty: 'hard',   funFact: 'Salvatore Ferragamo made shoes for Marilyn Monroe, Audrey Hepburn, and Greta Garbo!',            Logo: FerragamoLogo },
    { id: 'jimmychoo',    name: 'Jimmy Choo',     country: '🇬🇧 UK',    founded: 1996, difficulty: 'hard',   funFact: 'Jimmy Choo shoes became famous when Princess Diana was photographed wearing them in 1997!',        Logo: JimmyChooLogo },
  ],
}
