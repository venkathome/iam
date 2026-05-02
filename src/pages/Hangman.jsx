import { useState, useEffect, useRef } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import './Hangman.css'

const MAX_WRONG_WORD = 6
const MAX_WRONG_SENT = 5

const AUTO_REVEAL = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'of', 'is', 'are', 'was',
  'to', 'it', 'do', 'by', 'as', 'and', 'or', 'but', 'for', 'so',
  'if', 'its', 'be', 'am', 'not', 'has', 'had', 'does',
])

// ── Dictionary API clue fetching ─────────────────────────────
const clueCache = new Map()

async function fetchClue(word) {
  if (clueCache.has(word)) return clueCache.get(word)
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
    if (!res.ok) { clueCache.set(word, null); return null }
    const data = await res.json()
    const def = data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition ?? null
    clueCache.set(word, def)
    return def
  } catch {
    clueCache.set(word, null)
    return null
  }
}

// ── Word pool (~200 words, clues fetched from API) ────────────
const ALL_WORDS = [
  // Animals
  { word: 'elephant',      category: 'Animals'   },
  { word: 'giraffe',       category: 'Animals'   },
  { word: 'dolphin',       category: 'Animals'   },
  { word: 'flamingo',      category: 'Animals'   },
  { word: 'crocodile',     category: 'Animals'   },
  { word: 'penguin',       category: 'Animals'   },
  { word: 'kangaroo',      category: 'Animals'   },
  { word: 'cheetah',       category: 'Animals'   },
  { word: 'rhinoceros',    category: 'Animals'   },
  { word: 'gorilla',       category: 'Animals'   },
  { word: 'leopard',       category: 'Animals'   },
  { word: 'chameleon',     category: 'Animals'   },
  { word: 'octopus',       category: 'Animals'   },
  { word: 'jellyfish',     category: 'Animals'   },
  { word: 'platypus',      category: 'Animals'   },
  { word: 'hedgehog',      category: 'Animals'   },
  { word: 'armadillo',     category: 'Animals'   },
  { word: 'salamander',    category: 'Animals'   },
  { word: 'narwhal',       category: 'Animals'   },
  { word: 'wolverine',     category: 'Animals'   },
  { word: 'capybara',      category: 'Animals'   },
  { word: 'mongoose',      category: 'Animals'   },
  { word: 'meerkat',       category: 'Animals'   },
  { word: 'toucan',        category: 'Animals'   },
  { word: 'iguana',        category: 'Animals'   },
  { word: 'piranha',       category: 'Animals'   },
  { word: 'pelican',       category: 'Animals'   },
  { word: 'albatross',     category: 'Animals'   },
  { word: 'badger',        category: 'Animals'   },
  { word: 'wombat',        category: 'Animals'   },
  { word: 'porcupine',     category: 'Animals'   },
  { word: 'manatee',       category: 'Animals'   },
  { word: 'pangolin',      category: 'Animals'   },
  { word: 'tapir',         category: 'Animals'   },
  { word: 'lemur',         category: 'Animals'   },
  { word: 'macaw',         category: 'Animals'   },
  { word: 'barracuda',     category: 'Animals'   },
  { word: 'mandrill',      category: 'Animals'   },
  { word: 'wallaby',       category: 'Animals'   },
  { word: 'ocelot',        category: 'Animals'   },
  // Objects
  { word: 'umbrella',      category: 'Objects'   },
  { word: 'telescope',     category: 'Objects'   },
  { word: 'parachute',     category: 'Objects'   },
  { word: 'microscope',    category: 'Objects'   },
  { word: 'compass',       category: 'Objects'   },
  { word: 'lantern',       category: 'Objects'   },
  { word: 'binoculars',    category: 'Objects'   },
  { word: 'thermometer',   category: 'Objects'   },
  { word: 'kaleidoscope',  category: 'Objects'   },
  { word: 'typewriter',    category: 'Objects'   },
  { word: 'pendulum',      category: 'Objects'   },
  { word: 'sundial',       category: 'Objects'   },
  { word: 'hourglass',     category: 'Objects'   },
  { word: 'abacus',        category: 'Objects'   },
  { word: 'periscope',     category: 'Objects'   },
  { word: 'barometer',     category: 'Objects'   },
  { word: 'propeller',     category: 'Objects'   },
  { word: 'catapult',      category: 'Objects'   },
  { word: 'sextant',       category: 'Objects'   },
  { word: 'turnstile',     category: 'Objects'   },
  // Nature
  { word: 'volcano',       category: 'Nature'    },
  { word: 'rainbow',       category: 'Nature'    },
  { word: 'avalanche',     category: 'Nature'    },
  { word: 'hurricane',     category: 'Nature'    },
  { word: 'quicksand',     category: 'Nature'    },
  { word: 'glacier',       category: 'Nature'    },
  { word: 'geyser',        category: 'Nature'    },
  { word: 'tornado',       category: 'Nature'    },
  { word: 'tsunami',       category: 'Nature'    },
  { word: 'blizzard',      category: 'Nature'    },
  { word: 'monsoon',       category: 'Nature'    },
  { word: 'eclipse',       category: 'Nature'    },
  { word: 'stalactite',    category: 'Nature'    },
  { word: 'peninsula',     category: 'Nature'    },
  { word: 'archipelago',   category: 'Nature'    },
  { word: 'fjord',         category: 'Nature'    },
  { word: 'savanna',       category: 'Nature'    },
  { word: 'tundra',        category: 'Nature'    },
  { word: 'canyon',        category: 'Nature'    },
  { word: 'plateau',       category: 'Nature'    },
  { word: 'estuary',       category: 'Nature'    },
  { word: 'lagoon',        category: 'Nature'    },
  { word: 'stalagmite',    category: 'Nature'    },
  { word: 'whirlpool',     category: 'Nature'    },
  { word: 'permafrost',    category: 'Nature'    },
  // Food
  { word: 'chocolate',     category: 'Food'      },
  { word: 'mozzarella',    category: 'Food'      },
  { word: 'avocado',       category: 'Food'      },
  { word: 'broccoli',      category: 'Food'      },
  { word: 'asparagus',     category: 'Food'      },
  { word: 'cinnamon',      category: 'Food'      },
  { word: 'cardamom',      category: 'Food'      },
  { word: 'artichoke',     category: 'Food'      },
  { word: 'pomegranate',   category: 'Food'      },
  { word: 'tangerine',     category: 'Food'      },
  { word: 'cranberry',     category: 'Food'      },
  { word: 'blueberry',     category: 'Food'      },
  { word: 'raspberry',     category: 'Food'      },
  { word: 'papaya',        category: 'Food'      },
  { word: 'tamarind',      category: 'Food'      },
  { word: 'turmeric',      category: 'Food'      },
  { word: 'oregano',       category: 'Food'      },
  { word: 'parsley',       category: 'Food'      },
  { word: 'marmalade',     category: 'Food'      },
  { word: 'pineapple',     category: 'Food'      },
  { word: 'persimmon',     category: 'Food'      },
  { word: 'guava',         category: 'Food'      },
  { word: 'kumquat',       category: 'Food'      },
  { word: 'lychee',        category: 'Food'      },
  { word: 'courgette',     category: 'Food'      },
  // Science
  { word: 'molecule',      category: 'Science'   },
  { word: 'electron',      category: 'Science'   },
  { word: 'neutron',       category: 'Science'   },
  { word: 'gravity',       category: 'Science'   },
  { word: 'friction',      category: 'Science'   },
  { word: 'velocity',      category: 'Science'   },
  { word: 'momentum',      category: 'Science'   },
  { word: 'catalyst',      category: 'Science'   },
  { word: 'osmosis',       category: 'Science'   },
  { word: 'chromosome',    category: 'Science'   },
  { word: 'neuron',        category: 'Science'   },
  { word: 'nitrogen',      category: 'Science'   },
  { word: 'hydrogen',      category: 'Science'   },
  { word: 'evolution',     category: 'Science'   },
  { word: 'hypothesis',    category: 'Science'   },
  { word: 'laboratory',    category: 'Science'   },
  { word: 'radiation',     category: 'Science'   },
  { word: 'magnetism',     category: 'Science'   },
  { word: 'diffusion',     category: 'Science'   },
  { word: 'combustion',    category: 'Science'   },
  { word: 'sediment',      category: 'Science'   },
  { word: 'photosynthesis',category: 'Science'   },
  { word: 'algorithm',     category: 'Science'   },
  { word: 'frequency',     category: 'Science'   },
  { word: 'amplitude',     category: 'Science'   },
  // Music
  { word: 'xylophone',     category: 'Music'     },
  { word: 'accordion',     category: 'Music'     },
  { word: 'trombone',      category: 'Music'     },
  { word: 'clarinet',      category: 'Music'     },
  { word: 'harmonica',     category: 'Music'     },
  { word: 'ukulele',       category: 'Music'     },
  { word: 'mandolin',      category: 'Music'     },
  { word: 'saxophone',     category: 'Music'     },
  { word: 'symphony',      category: 'Music'     },
  { word: 'crescendo',     category: 'Music'     },
  { word: 'staccato',      category: 'Music'     },
  { word: 'arpeggio',      category: 'Music'     },
  { word: 'overture',      category: 'Music'     },
  { word: 'serenade',      category: 'Music'     },
  { word: 'concerto',      category: 'Music'     },
  { word: 'sonata',        category: 'Music'     },
  { word: 'cadence',       category: 'Music'     },
  { word: 'falsetto',      category: 'Music'     },
  { word: 'melody',        category: 'Music'     },
  { word: 'rhythm',        category: 'Music'     },
  // Places
  { word: 'labyrinth',     category: 'Places'    },
  { word: 'cathedral',     category: 'Places'    },
  { word: 'amphitheatre',  category: 'Places'    },
  { word: 'monastery',     category: 'Places'    },
  { word: 'observatory',   category: 'Places'    },
  { word: 'lighthouse',    category: 'Places'    },
  { word: 'aquarium',      category: 'Places'    },
  { word: 'planetarium',   category: 'Places'    },
  { word: 'conservatory',  category: 'Places'    },
  { word: 'mausoleum',     category: 'Places'    },
  { word: 'basilica',      category: 'Places'    },
  { word: 'fortress',      category: 'Places'    },
  { word: 'citadel',       category: 'Places'    },
  { word: 'colosseum',     category: 'Places'    },
  { word: 'greenhouse',    category: 'Places'    },
  // History
  { word: 'pyramid',       category: 'History'   },
  { word: 'gladiator',     category: 'History'   },
  { word: 'pharaoh',       category: 'History'   },
  { word: 'revolution',    category: 'History'   },
  { word: 'democracy',     category: 'History'   },
  { word: 'parliament',    category: 'History'   },
  { word: 'constitution',  category: 'History'   },
  { word: 'archaeology',   category: 'History'   },
  { word: 'hieroglyph',    category: 'History'   },
  { word: 'renaissance',   category: 'History'   },
  { word: 'feudalism',     category: 'History'   },
  { word: 'dynasty',       category: 'History'   },
  { word: 'expedition',    category: 'History'   },
  { word: 'monarchy',      category: 'History'   },
  { word: 'republic',      category: 'History'   },
  // Careers
  { word: 'astronaut',     category: 'Careers'   },
  { word: 'veterinarian',  category: 'Careers'   },
  { word: 'archaeologist', category: 'Careers'   },
  { word: 'meteorologist', category: 'Careers'   },
  { word: 'photographer',  category: 'Careers'   },
  { word: 'journalist',    category: 'Careers'   },
  { word: 'cartographer',  category: 'Careers'   },
  { word: 'geologist',     category: 'Careers'   },
  { word: 'botanist',      category: 'Careers'   },
  { word: 'zoologist',     category: 'Careers'   },
  { word: 'architect',     category: 'Careers'   },
  { word: 'choreographer', category: 'Careers'   },
  { word: 'economist',     category: 'Careers'   },
  { word: 'librarian',     category: 'Careers'   },
  { word: 'pharmacist',    category: 'Careers'   },
]

// ── Sentence/question pool (~60 entries) ─────────────────────
const ALL_SENTENCES = [
  // Sentences
  { text: 'The quick brown fox jumps over the lazy dog',                           clue: 'A famous sentence that contains every letter of the alphabet',                     type: 'sentence' },
  { text: 'The sun rises in the east and sets in the west',                        clue: 'Something we observe every day about our nearest star',                           type: 'sentence' },
  { text: 'Elephants are the largest land animals on Earth',                       clue: 'A fact about the biggest creatures that walk on land',                            type: 'sentence' },
  { text: 'Water freezes at zero degrees Celsius',                                 clue: 'A science fact about the temperature when liquid turns to ice',                   type: 'sentence' },
  { text: 'The Great Wall of China stretches across thousands of miles',           clue: 'A fact about one of the most impressive ancient structures ever built',           type: 'sentence' },
  { text: 'Lightning never strikes the same place twice',                          clue: 'A popular saying about a powerful electrical storm — actually a myth',             type: 'sentence' },
  { text: 'Penguins live in Antarctica and cannot fly',                            clue: 'A fact about flightless birds in the coldest place on Earth',                     type: 'sentence' },
  { text: 'The moon orbits the Earth every twenty-eight days',                     clue: 'A fact about our nearest celestial neighbour',                                   type: 'sentence' },
  { text: 'Honey never spoils and can last thousands of years',                    clue: 'A surprising fact about a sweet food made by bees',                              type: 'sentence' },
  { text: 'Octopuses have three hearts and blue blood',                            clue: 'A remarkable fact about a clever eight-armed sea creature',                       type: 'sentence' },
  { text: 'Sound travels faster through water than through air',                   clue: 'A physics fact about how waves move through different materials',                  type: 'sentence' },
  { text: 'Crows can recognise human faces and remember them for years',           clue: 'A fact about the impressive intelligence of a common black bird',                 type: 'sentence' },
  { text: 'The Eiffel Tower grows taller in summer due to heat',                   clue: 'A fact about how metal expands — demonstrated by a famous Paris landmark',        type: 'sentence' },
  { text: 'Sea otters hold hands while sleeping so they do not drift apart',       clue: 'An adorable fact about a furry marine mammal',                                   type: 'sentence' },
  { text: 'A day on Venus is longer than a year on Venus',                         clue: 'A surprising fact about rotation and orbit on our closest planetary neighbour',   type: 'sentence' },
  { text: 'Sharks have been on Earth for over four hundred million years',         clue: 'A fact showing that these ocean predators are older than dinosaurs',              type: 'sentence' },
  { text: 'Bananas are technically berries but strawberries are not',              clue: 'A surprising botanical fact about two very common fruits',                        type: 'sentence' },
  { text: 'Trees communicate with each other through underground fungal networks', clue: 'A remarkable fact about how forests share nutrients and signals',                 type: 'sentence' },
  { text: 'The Amazon rainforest produces twenty percent of the worlds oxygen',    clue: 'A fact about the vital role played by the worlds largest tropical forest',       type: 'sentence' },
  { text: 'Wombats produce cube-shaped droppings',                                 clue: 'A uniquely shaped fact about an Australian burrowing marsupial',                  type: 'sentence' },
  { text: 'A group of flamingos is called a flamboyance',                          clue: 'A fact about the collective noun for a flock of pink wading birds',              type: 'sentence' },
  { text: 'Polar bears have black skin beneath their white fur',                   clue: 'A surprising fact about the largest land predator in the Arctic',                 type: 'sentence' },
  { text: 'Gold is so soft it can be shaped by hand when pure',                    clue: 'A fact about the malleability of a precious yellow metal',                       type: 'sentence' },
  { text: 'An ostrich can run faster than a horse over long distances',            clue: 'A fact about the speed of the worlds largest bird',                              type: 'sentence' },
  { text: 'The human nose can detect over one trillion different smells',          clue: 'A fact about the remarkable sensitivity of our sense of smell',                  type: 'sentence' },
  { text: 'Butterflies taste with their feet when they land on something',         clue: 'A surprising fact about how a common winged insect senses its food',             type: 'sentence' },
  { text: 'The Great Barrier Reef is the largest coral reef system in the world',  clue: 'A fact about a famous marine ecosystem off the coast of Australia',              type: 'sentence' },
  { text: 'Starfish can regenerate lost arms and have no brain',                   clue: 'A remarkable fact about a spiny sea creature with five arms',                   type: 'sentence' },
  { text: 'Glass is made primarily from sand which is heated to very high temperatures', clue: 'A fact about what everyday transparent material is made from',             type: 'sentence' },
  { text: 'A snail can sleep for three years at a time during dry conditions',     clue: 'A fact about how molluscs survive without moisture',                             type: 'sentence' },
  // Questions
  { text: 'What is the capital city of France',                                    clue: 'A geography question about the most visited country in Europe',                  type: 'question' },
  { text: 'Which planet is known as the red planet',                               clue: 'A question about a rusty coloured neighbour in our solar system',               type: 'question' },
  { text: 'How many legs does a spider have',                                      clue: 'A question about a common eight-legged creepy crawly',                          type: 'question' },
  { text: 'What do bees make inside their hives',                                  clue: 'A question about a golden sweet treat produced by buzzing insects',             type: 'question' },
  { text: 'Why do leaves change colour in autumn',                                 clue: 'A question about what happens to trees as the weather turns cold',              type: 'question' },
  { text: 'Which animal is known as the king of the jungle',                       clue: 'A question about a majestic roaring big cat',                                   type: 'question' },
  { text: 'What is the fastest land animal on Earth',                              clue: 'A question about a spotted big cat that can sprint at incredible speed',        type: 'question' },
  { text: 'How many bones does an adult human have',                               clue: 'A question about the number of bones in the fully developed human skeleton',    type: 'question' },
  { text: 'What is the largest ocean on Earth',                                    clue: 'A question about the biggest body of water on our planet',                      type: 'question' },
  { text: 'What gas do plants absorb during photosynthesis',                       clue: 'A question about the gas that plants take in to make their food',               type: 'question' },
  { text: 'How many strings does a standard guitar have',                          clue: 'A question about the number of strings on the most popular musical instrument', type: 'question' },
  { text: 'What is the smallest country in the world',                             clue: 'A question about a tiny independent state within the city of Rome',             type: 'question' },
  { text: 'Which planet has the most moons',                                       clue: 'A question about the ringed gas giant with the greatest number of satellites',  type: 'question' },
  { text: 'What is the hardest natural substance on Earth',                        clue: 'A question about a gemstone used in engagement rings',                          type: 'question' },
  { text: 'Which continent is the driest on Earth',                                clue: 'A question about the frozen continent at the South Pole',                       type: 'question' },
  { text: 'How many hearts does an octopus have',                                  clue: 'A question about the circulatory system of a clever cephalopod',               type: 'question' },
  { text: 'What is the capital city of Australia',                                 clue: 'A question that surprises many people — it is not Sydney',                      type: 'question' },
  { text: 'Which metal is liquid at room temperature',                             clue: 'A question about a silvery metal once used in thermometers',                    type: 'question' },
  { text: 'How many teeth does an adult human normally have',                      clue: 'A question about the complete set of permanent teeth in a grown adult',         type: 'question' },
  { text: 'Which is the largest desert in the world',                              clue: 'A question about the answer that surprises most people — it is not the Sahara', type: 'question' },
  { text: 'How many planets are in our solar system',                              clue: 'A question about the number of planets orbiting our sun since Pluto was reclassified', type: 'question' },
  { text: 'Which bird is the universal symbol of peace',                           clue: 'A question about a white bird often released at ceremonies',                    type: 'question' },
  { text: 'What is the chemical symbol for water',                                 clue: 'A science question about the most essential liquid on Earth',                   type: 'question' },
  { text: 'How many days are in a leap year',                                      clue: 'A question about the calendar year that has one extra day',                     type: 'question' },
  { text: 'What is the longest river in the world',                                clue: 'A geography question about the river that flows through north-east Africa',     type: 'question' },
  { text: 'Which country invented the sport of cricket',                           clue: 'A sports question about the nation that created this bat and ball game',        type: 'question' },
  { text: 'How long does it take light to travel from the sun to Earth',           clue: 'A physics question about the journey of photons across space',                  type: 'question' },
  { text: 'What is the most spoken language in the world',                         clue: 'A question about the language with the most native speakers globally',          type: 'question' },
  { text: 'Which element has the atomic number one',                               clue: 'A chemistry question about the lightest and most abundant element in the universe', type: 'question' },
  { text: 'What is the name of the force that keeps planets in orbit',             clue: 'A physics question about the invisible pull that governs the solar system',     type: 'question' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M'],
]

function HangmanSVG({ wrongCount }) {
  return (
    <svg width="140" height="140" viewBox="0 0 160 160" fill="none" className="hangman-svg">
      <line x1="20" y1="150" x2="140" y2="150" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="50" y1="150" x2="50" y2="10"  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="50" y1="10"  x2="100" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="10" x2="100" y2="30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      {wrongCount >= 1 && <circle cx="100" cy="44" r="14" stroke="currentColor" strokeWidth="2"/>}
      {wrongCount >= 2 && <line x1="100" y1="58" x2="100" y2="100" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>}
      {wrongCount >= 3 && <line x1="100" y1="70" x2="76"  y2="90"  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>}
      {wrongCount >= 4 && <line x1="100" y1="70" x2="124" y2="90"  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>}
      {wrongCount >= 5 && <line x1="100" y1="100" x2="76"  y2="128" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>}
      {wrongCount >= 6 && <line x1="100" y1="100" x2="124" y2="128" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>}
    </svg>
  )
}

function WordsModeTileIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect x="2"  y="16" width="10" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" fill="none"/>
      <rect x="14" y="16" width="10" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" fill="none" opacity="0.3"/>
      <rect x="26" y="16" width="10" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" fill="none" opacity="0.3"/>
      <rect x="38" y="16" width="10" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" fill="none"/>
      <text x="7"  y="26.5" textAnchor="middle" fontSize="9" fontWeight="800" fontFamily="monospace" fill="currentColor">H</text>
      <text x="43" y="26.5" textAnchor="middle" fontSize="9" fontWeight="800" fontFamily="monospace" fill="currentColor">?</text>
      <line x1="2" y1="36" x2="48" y2="36" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="8" y1="42" x2="42" y2="42" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>
    </svg>
  )
}

function SentencesModeTileIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect x="2"  y="8"  width="14" height="5" rx="2.5" fill="currentColor"/>
      <rect x="18" y="8"  width="20" height="5" rx="2.5" fill="currentColor" opacity="0.25"/>
      <rect x="40" y="8"  width="10" height="5" rx="2.5" fill="currentColor"/>
      <rect x="2"  y="19" width="22" height="5" rx="2.5" fill="currentColor" opacity="0.25"/>
      <rect x="26" y="19" width="14" height="5" rx="2.5" fill="currentColor"/>
      <rect x="42" y="19" width="8"  height="5" rx="2.5" fill="currentColor" opacity="0.25"/>
      <rect x="2"  y="30" width="10" height="5" rx="2.5" fill="currentColor"/>
      <rect x="14" y="30" width="24" height="5" rx="2.5" fill="currentColor" opacity="0.25"/>
      <rect x="40" y="30" width="10" height="5" rx="2.5" fill="currentColor"/>
    </svg>
  )
}

function WordGame({ onBack }) {
  const [wordList, setWordList] = useState(() => shuffle(ALL_WORDS))
  const [index, setIndex]       = useState(0)
  const [guessed, setGuessed]   = useState(new Set())
  const [wrongCount, setWrong]  = useState(0)
  const [clue, setClue]         = useState('')
  const [clueLoading, setClueLoading] = useState(true)

  const entry   = wordList[index]
  const word    = entry.word.toLowerCase()
  const letters = new Set(word)
  const won     = [...letters].every(l => guessed.has(l))
  const lost    = wrongCount >= MAX_WRONG_WORD
  const status  = won ? 'won' : lost ? 'lost' : 'playing'

  useEffect(() => {
    setClue('')
    setClueLoading(true)
    fetchClue(entry.word).then(def => {
      setClue(def || `A ${entry.category.toLowerCase()} word`)
      setClueLoading(false)
    })
  }, [entry.word])

  function guessLetter(letter) {
    if (status !== 'playing' || guessed.has(letter)) return
    setGuessed(prev => new Set([...prev, letter]))
    if (!letters.has(letter)) setWrong(c => c + 1)
  }

  function next() {
    if (index >= wordList.length - 1) {
      setWordList(shuffle(ALL_WORDS))
      setIndex(0)
    } else {
      setIndex(i => i + 1)
    }
    setGuessed(new Set())
    setWrong(0)
  }

  return (
    <div className="lang-game">
      <div className="lang-game-header">
        <button className="lang-back-btn" onClick={onBack}>← Back</button>
        <span className="lang-badge lang-badge--category">{entry.category}</span>
        <span className="lang-lives">
          {Array.from({ length: MAX_WRONG_WORD }, (_, i) => (
            <span key={i} className={`lang-life ${i < MAX_WRONG_WORD - wrongCount ? 'lang-life--alive' : 'lang-life--lost'}`}>♥</span>
          ))}
        </span>
      </div>

      <div className="lang-clue">
        <span className="lang-clue-label">Clue</span>
        <p>{clueLoading ? 'Loading clue…' : clue}</p>
      </div>

      <HangmanSVG wrongCount={wrongCount} />

      <div className="lang-word-blanks">
        {word.split('').map((letter, i) => (
          <span key={i} className="lang-blank-wrap">
            <span className={`lang-blank-letter ${
              guessed.has(letter) ? 'lang-blank-letter--found' :
              status === 'lost'   ? 'lang-blank-letter--revealed' : ''
            }`}>
              {guessed.has(letter) || status !== 'playing' ? letter.toUpperCase() : ''}
            </span>
            <span className="lang-blank-line" />
          </span>
        ))}
      </div>

      {status !== 'playing' && (
        <div className={`lang-result ${status === 'won' ? 'lang-result--won' : 'lang-result--lost'}`}>
          <p className="lang-result-msg">
            {status === 'won' ? '🎉 Well done!' : `The word was "${word.toUpperCase()}"`}
          </p>
          <button className="lang-next-btn" onClick={next}>Next Word →</button>
        </div>
      )}

      {status === 'playing' && (
        <div className="lang-keyboard">
          {KEYBOARD_ROWS.map((row, ri) => (
            <div key={ri} className="lang-key-row">
              {row.map(letter => {
                const l = letter.toLowerCase()
                const isHit  = guessed.has(l) && letters.has(l)
                const isMiss = guessed.has(l) && !letters.has(l)
                return (
                  <button
                    key={letter}
                    className={`lang-key ${isHit ? 'lang-key--hit' : ''} ${isMiss ? 'lang-key--miss' : ''}`}
                    onClick={() => guessLetter(l)}
                    disabled={guessed.has(l)}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SentenceGame({ onBack }) {
  const [sentList, setSentList] = useState(() => shuffle(ALL_SENTENCES))
  const [index, setIndex]         = useState(0)
  const [revealed, setRevealed]   = useState(new Set())
  const [wrongCount, setWrong]    = useState(0)
  const [input, setInput]         = useState('')
  const [lastGuess, setLastGuess] = useState(null)
  const inputRef = useRef(null)

  const entry       = sentList[index]
  const words       = entry.text.toLowerCase().split(' ')
  const uniqueWords = [...new Set(words)]
  const hiddenWords = uniqueWords.filter(w => !AUTO_REVEAL.has(w))
  const won         = hiddenWords.every(w => revealed.has(w))
  const lost        = wrongCount >= MAX_WRONG_SENT
  const status      = won ? 'won' : lost ? 'lost' : 'playing'

  function guess(e) {
    e.preventDefault()
    const word = input.trim().toLowerCase()
    if (!word || status !== 'playing') return
    setInput('')

    if (AUTO_REVEAL.has(word) && words.includes(word)) {
      setLastGuess({ correct: true, msg: `"${word}" is already shown!` })
      return
    }
    if (revealed.has(word)) {
      setLastGuess({ correct: true, msg: `"${word}" is already found!` })
      return
    }
    if (words.includes(word)) {
      const nextRevealed = new Set([...revealed, word])
      setRevealed(nextRevealed)
      const remaining = hiddenWords.filter(w => !nextRevealed.has(w)).length
      setLastGuess({
        correct: true,
        msg: remaining === 0 ? '🎉 You found them all!' : `"${word}" is correct! ${remaining} word${remaining !== 1 ? 's' : ''} left.`,
      })
    } else {
      const wrongLeft = MAX_WRONG_SENT - wrongCount - 1
      setWrong(c => c + 1)
      setLastGuess({
        correct: false,
        msg: `"${word}" is not in this ${entry.type}. ${wrongLeft} wrong guess${wrongLeft !== 1 ? 'es' : ''} left.`,
      })
    }
    inputRef.current?.focus()
  }

  function next() {
    if (index >= sentList.length - 1) {
      setSentList(shuffle(ALL_SENTENCES))
      setIndex(0)
    } else {
      setIndex(i => i + 1)
    }
    setRevealed(new Set())
    setWrong(0)
    setInput('')
    setLastGuess(null)
  }

  const remaining = hiddenWords.filter(w => !revealed.has(w)).length

  return (
    <div className="lang-game lang-game--sentence">
      <div className="lang-game-header">
        <button className="lang-back-btn" onClick={onBack}>← Back</button>
        <span className={`lang-badge ${entry.type === 'question' ? 'lang-badge--question' : 'lang-badge--sentence'}`}>
          {entry.type === 'question' ? 'Question' : 'Sentence'}
        </span>
        <span className="lang-lives">
          {Array.from({ length: MAX_WRONG_SENT }, (_, i) => (
            <span key={i} className={`lang-life ${i < MAX_WRONG_SENT - wrongCount ? 'lang-life--alive' : 'lang-life--lost'}`}>♥</span>
          ))}
        </span>
      </div>

      <div className="lang-clue">
        <span className="lang-clue-label">Clue</span>
        <p>{entry.clue}</p>
      </div>

      <div className="lang-sentence-display">
        {words.map((word, i) => {
          const isAuto    = AUTO_REVEAL.has(word)
          const isFound   = revealed.has(word)
          const isVisible = isAuto || isFound || status !== 'playing'
          const isMissed  = status === 'lost' && !isAuto && !isFound
          return (
            <span key={i} className="lang-word-token">
              {isVisible ? (
                <span className={`lang-word-text ${isMissed ? 'lang-word-text--missed' : ''}`}>{word}</span>
              ) : (
                <span className="lang-word-blank">
                  <span className="lang-word-dashes">{'_'.repeat(word.length)}</span>
                  <span className="lang-word-len">{word.length}</span>
                </span>
              )}
            </span>
          )
        })}
      </div>

      {status === 'playing' && (
        <p className="lang-remaining">{remaining} word{remaining !== 1 ? 's' : ''} to find</p>
      )}

      {lastGuess && (
        <div className={`lang-feedback ${lastGuess.correct ? 'lang-feedback--ok' : 'lang-feedback--err'}`}>
          {lastGuess.msg}
        </div>
      )}

      {status !== 'playing' && (
        <div className={`lang-result ${status === 'won' ? 'lang-result--won' : 'lang-result--lost'}`}>
          <p className="lang-result-msg">
            {status === 'won' ? '🎉 Excellent!' : 'Better luck next time!'}
          </p>
          <button className="lang-next-btn" onClick={next}>Next →</button>
        </div>
      )}

      {status === 'playing' && (
        <form className="lang-input-form" onSubmit={guess}>
          <input
            ref={inputRef}
            className="lang-input"
            type="text"
            placeholder="Type a word and guess..."
            value={input}
            onChange={e => setInput(e.target.value.replace(/[^a-zA-Z]/g, ''))}
            autoFocus
            autoComplete="off"
          />
          <button className="lang-submit-btn" type="submit" disabled={!input.trim()}>
            Guess
          </button>
        </form>
      )}
    </div>
  )
}

export default function Hangman() {
  const [mode, setMode] = useState(null)

  return (
    <div className="language-page">
      <Breadcrumb />
      {mode === 'words' ? (
        <WordGame onBack={() => setMode(null)} />
      ) : mode === 'sentences' ? (
        <SentenceGame onBack={() => setMode(null)} />
      ) : (
        <>
          <h1>Hangman</h1>
          <p>Pick a challenge and start guessing.</p>
          <div className="lang-mode-grid">
            <button className="lang-mode-tile lang-mode-tile--words" onClick={() => setMode('words')}>
              <WordsModeTileIcon />
              <span className="lang-mode-title">Words</span>
              <span className="lang-mode-desc">Guess the hidden word one letter at a time · {ALL_WORDS.length}+ words · Unlimited</span>
            </button>
            <button className="lang-mode-tile lang-mode-tile--sentences" onClick={() => setMode('sentences')}>
              <SentencesModeTileIcon />
              <span className="lang-mode-title">Sentences</span>
              <span className="lang-mode-desc">Uncover sentences and questions word by word · {ALL_SENTENCES.length}+ puzzles · Unlimited</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
