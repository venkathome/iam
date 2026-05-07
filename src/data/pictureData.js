import { RECOVERED_INLINE_ITEMS } from './tmp_recovered_inline.js'
import { EMO_SOCIAL_ITEMS } from './tmp_emo_social.js'
import { PLAY_NATURE_PEOPLE_ITEMS } from './tmp_play_nature_people.js'
import { ROUTINES_SCHOOL_ITEMS } from './tmp_routines_school.js'
import { FOOD_TRANSPORT_COMMUNITY_HOME_ITEMS } from './tmp_food_transport_community_home.js'
import { ANIMALS_NEW_ITEMS } from './tmp_animals_new.js'
import { BODY_HEALTH_ITEMS } from './tmp_body_health.js'
import { CLOTHING_SELFCARE_ITEMS } from './tmp_clothing_selfcare.js'
import { EMOTIONS_EXTENDED_ITEMS } from './tmp_emotions_extended.js'
import { TIME_CONCEPTS_ITEMS } from './tmp_time_concepts.js'
import { PLACES_EXTENDED_ITEMS } from './tmp_places_extended.js'
import { JOBS_SAFETY_ITEMS } from './tmp_jobs_safety.js'
import { SPORTS_TOYS_MUSIC_ITEMS } from './tmp_sports_toys_music.js'
import { VEHICLES_NATURE_PLANTS_ITEMS } from './tmp_vehicles_nature_plants.js'
import { SPACE_INDIAN_ITEMS } from './tmp_space_indian.js'
import { COLORS_NUMBERS_ITEMS } from './tmp_colors_numbers.js'
import { WEATHER_FAMILY_ITEMS } from './tmp_weather_family.js'
import { AAC_SENSORY_BODYNEEDS_ITEMS } from './tmp_aac_sensory_bodyneeds.js'
import { CLASSROOM_HOUSEHOLD_ITEMS } from './tmp_classroom_household.js'
import { BEHAVIOR_NEEDS_ITEMS } from './tmp_behavior_needs.js'
import { SETTINGS_PUBLIC_ITEMS } from './tmp_settings_public.js'
import { SETTINGS_OUTDOOR_ITEMS } from './tmp_settings_outdoor.js'
import { SETTINGS_SCHOOL_ITEMS } from './tmp_settings_school.js'
import { CLEAN_HABITS_ITEMS } from './tmp_clean_habits.js'
import { AWARENESS_SURROUNDINGS_ITEMS } from './tmp_awareness_surroundings.js'

// ── Picture Section ───────────────────────────────────────────────────────────

export const PICTURE_CATEGORIES = [
  { id: 'all',                label: 'All' },
  { id: 'emotions',           label: '😊 Emotions' },
  { id: 'social',             label: '🤝 Social Skills' },
  { id: 'play',               label: '⚽ Play & Sports' },
  { id: 'nature',             label: '🌿 Nature & Weather' },
  { id: 'people',             label: '👥 Family & Friends' },
  { id: 'routines',           label: '🌅 Daily Routines' },
  { id: 'school',             label: '🏫 School' },
  { id: 'food',               label: '🍎 Food' },
  { id: 'transport',          label: '🚗 Transport' },
  { id: 'community',          label: '🏘️ Community' },
  { id: 'home',               label: '🏠 Home' },
  { id: 'animals',            label: '🐾 Animals' },
  { id: 'birds',              label: '🐦 Birds' },
  { id: 'insects',            label: '🦋 Insects' },
  { id: 'body',               label: '🫀 Body Parts' },
  { id: 'health',             label: '🏥 Health' },
  { id: 'clothing',           label: '👕 Clothing' },
  { id: 'selfcare',           label: '🧴 Self Care' },
  { id: 'time',               label: '🕐 Time' },
  { id: 'concepts',           label: '🔄 Concepts' },
  { id: 'places',             label: '📍 Places' },
  { id: 'jobs',               label: '👷 Jobs' },
  { id: 'safety',             label: '⛑️ Safety' },
  { id: 'sports',             label: '🏏 Sports' },
  { id: 'toys',               label: '🧸 Toys' },
  { id: 'music',              label: '🎵 Music' },
  { id: 'vehicles',           label: '🚁 Vehicles' },
  { id: 'nature_ext',         label: '🏔️ Nature' },
  { id: 'plants',             label: '🌱 Plants' },
  { id: 'space',              label: '🚀 Space' },
  { id: 'indian_food',        label: '🍛 Indian Food' },
  { id: 'festivals',          label: '🎆 Festivals' },
  { id: 'colors',             label: '🎨 Colours' },
  { id: 'numbers',            label: '🔢 Numbers' },
  { id: 'weather',            label: '⛈️ Weather' },
  { id: 'family',             label: '👨‍👩‍👧 Family & People' },
  { id: 'aac',                label: '💬 AAC Communication' },
  { id: 'sensory',            label: '👂 Sensory' },
  { id: 'body_feelings',      label: '🤒 Body Feelings' },
  { id: 'classroom',          label: '📐 Classroom' },
  { id: 'household',          label: '🛋️ Household' },
  { id: 'kitchen',            label: '🍳 Kitchen' },
  { id: 'bathroom',           label: '🚿 Bathroom' },
  { id: 'behavior',           label: '🧘 Behaviour' },
  { id: 'needs_comm',         label: '🗣️ My Needs' },
  { id: 'sensory_tools',      label: '🎧 Sensory Tools' },
  { id: 'problem',            label: '🔧 Problem Situations' },
  { id: 'settings_awareness', label: '🌍 Settings & Awareness' },
]

export const PICTURE_ITEMS = [
  ...RECOVERED_INLINE_ITEMS,
  ...EMO_SOCIAL_ITEMS,
  ...PLAY_NATURE_PEOPLE_ITEMS,
  ...ROUTINES_SCHOOL_ITEMS,
  ...FOOD_TRANSPORT_COMMUNITY_HOME_ITEMS,
  ...ANIMALS_NEW_ITEMS,
  ...BODY_HEALTH_ITEMS,
  ...CLOTHING_SELFCARE_ITEMS,
  ...EMOTIONS_EXTENDED_ITEMS,
  ...TIME_CONCEPTS_ITEMS,
  ...PLACES_EXTENDED_ITEMS,
  ...JOBS_SAFETY_ITEMS,
  ...SPORTS_TOYS_MUSIC_ITEMS,
  ...VEHICLES_NATURE_PLANTS_ITEMS,
  ...SPACE_INDIAN_ITEMS,
  ...COLORS_NUMBERS_ITEMS,
  ...WEATHER_FAMILY_ITEMS,
  ...AAC_SENSORY_BODYNEEDS_ITEMS,
  ...CLASSROOM_HOUSEHOLD_ITEMS,
  ...BEHAVIOR_NEEDS_ITEMS,
  ...SETTINGS_PUBLIC_ITEMS,
  ...SETTINGS_OUTDOOR_ITEMS,
  ...SETTINGS_SCHOOL_ITEMS,
  ...CLEAN_HABITS_ITEMS,
  ...AWARENESS_SURROUNDINGS_ITEMS,
]
