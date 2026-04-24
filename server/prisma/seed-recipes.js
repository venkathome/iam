import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import os from 'os';

const prisma = new PrismaClient();
const RECIPES_DIR = path.join(os.homedir(), 'Downloads', 'Recipes');

const DISPLAY_NAMES = {
  'Saaru_20260101': 'Saaru Classic',
  'Sambar for idli': 'Sambar for Idli',
  'Sambar for Rava Dosa': 'Sambar for Rava Dosa',
  'Slv Style Chutney': 'SLV Style Chutney',
};

const CATEGORY_MAP = {
  'Adhraki Gobhi': 'Curries & Gravies',
  'Beans': 'Curries & Gravies',
  'Biryani': 'Rice & Pulao',
  'Boiled Peanut Chaat': 'Snacks & Street Food',
  'Boondhi Raita': 'Chutneys & Raitas',
  'Bun Dosa': 'Breakfast & Tiffin',
  'Butter Naan': 'Breads',
  'Capsicum Lemon Rice': 'Rice & Pulao',
  'Chakka Payasam': 'Sweets & Desserts',
  'Channa Masala': 'Curries & Gravies',
  'Chilli Bajji': 'Snacks & Street Food',
  'Chowmein': 'Indo-Chinese',
  'Chutney': 'Chutneys & Raitas',
  'Curd Rice': 'Rice & Pulao',
  'Dal Fry': 'Dals & Lentils',
  'Erissery': 'Curries & Gravies',
  'Fried Rice': 'Indo-Chinese',
  'Ghee Rice': 'Rice & Pulao',
  'Gulab Jamoon': 'Sweets & Desserts',
  'Halkova': 'Sweets & Desserts',
  'Honey Chilli Potato': 'Snacks & Street Food',
  'Jeera Rice': 'Rice & Pulao',
  'Kadhi': 'Soups & Rasam',
  'Kaju Masala': 'Curries & Gravies',
  'Kalyana Rasam': 'Soups & Rasam',
  'Karachi Halwa': 'Sweets & Desserts',
  'Kesari': 'Sweets & Desserts',
  'Kundapura Saaru': 'Soups & Rasam',
  'Masala Toast': 'Breakfast & Tiffin',
  'Mexican Fried Rice': 'Indo-Chinese',
  'Navratan Kurma': 'Curries & Gravies',
  'Obbattu': 'Sweets & Desserts',
  'Panagam': 'Sweets & Desserts',
  'Poori Bhaaji': 'Curries & Gravies',
  'Poori': 'Breads',
  'Pulao': 'Rice & Pulao',
  'Puliyogare': 'Rice & Pulao',
  'Ragda Masala': 'Curries & Gravies',
  'Ragda Pattice': 'Snacks & Street Food',
  'Raita': 'Chutneys & Raitas',
  'Rava Dosa': 'Breakfast & Tiffin',
  'Saaru': 'Soups & Rasam',
  'Saaru Classic': 'Soups & Rasam',
  'Sambar': 'Soups & Rasam',
  'Sambar for Idli': 'Soups & Rasam',
  'Sambar for Rava Dosa': 'Soups & Rasam',
  'Samosa': 'Snacks & Street Food',
  'SLV Style Chutney': 'Chutneys & Raitas',
  'Sweet Avalakki': 'Breakfast & Tiffin',
  'Sweet Corn Soup': 'Soups & Rasam',
  'Temple Style Sambar': 'Soups & Rasam',
  'Thili Saaru': 'Soups & Rasam',
  'Tiffin Sambar': 'Soups & Rasam',
  'Tomato Rice': 'Rice & Pulao',
  'Vada Pav': 'Snacks & Street Food',
  'Veg Kurma': 'Curries & Gravies',
  'Veg Machurian': 'Indo-Chinese',
  'Veg Manchow Soup': 'Indo-Chinese',
  'Vettha Kozhambu': 'Curries & Gravies',
};

const CUISINE_MAP = {
  'Adhraki Gobhi': 'North Indian',
  'Beans': 'South Indian',
  'Biryani': 'North Indian',
  'Boiled Peanut Chaat': 'South Indian',
  'Boondhi Raita': 'North Indian',
  'Bun Dosa': 'South Indian',
  'Butter Naan': 'North Indian',
  'Capsicum Lemon Rice': 'South Indian',
  'Chakka Payasam': 'South Indian',
  'Channa Masala': 'North Indian',
  'Chilli Bajji': 'South Indian',
  'Chowmein': 'Indo-Chinese',
  'Chutney': 'South Indian',
  'Curd Rice': 'South Indian',
  'Dal Fry': 'North Indian',
  'Erissery': 'South Indian',
  'Fried Rice': 'Indo-Chinese',
  'Ghee Rice': 'South Indian',
  'Gulab Jamoon': 'North Indian',
  'Halkova': 'South Indian',
  'Honey Chilli Potato': 'Indo-Chinese',
  'Jeera Rice': 'North Indian',
  'Kadhi': 'North Indian',
  'Kaju Masala': 'North Indian',
  'Kalyana Rasam': 'South Indian',
  'Karachi Halwa': 'North Indian',
  'Kesari': 'South Indian',
  'Kundapura Saaru': 'South Indian',
  'Masala Toast': 'Fusion',
  'Mexican Fried Rice': 'Indo-Chinese',
  'Navratan Kurma': 'North Indian',
  'Obbattu': 'South Indian',
  'Panagam': 'South Indian',
  'Poori Bhaaji': 'North Indian',
  'Poori': 'North Indian',
  'Pulao': 'North Indian',
  'Puliyogare': 'South Indian',
  'Ragda Masala': 'North Indian',
  'Ragda Pattice': 'North Indian',
  'Raita': 'North Indian',
  'Rava Dosa': 'South Indian',
  'Saaru': 'South Indian',
  'Saaru Classic': 'South Indian',
  'Sambar': 'South Indian',
  'Sambar for Idli': 'South Indian',
  'Sambar for Rava Dosa': 'South Indian',
  'Samosa': 'North Indian',
  'SLV Style Chutney': 'South Indian',
  'Sweet Avalakki': 'South Indian',
  'Sweet Corn Soup': 'Indo-Chinese',
  'Temple Style Sambar': 'South Indian',
  'Thili Saaru': 'South Indian',
  'Tiffin Sambar': 'South Indian',
  'Tomato Rice': 'South Indian',
  'Vada Pav': 'North Indian',
  'Veg Kurma': 'South Indian',
  'Veg Machurian': 'Indo-Chinese',
  'Veg Manchow Soup': 'Indo-Chinese',
  'Vettha Kozhambu': 'South Indian',
};

function parseRTF(rawBuffer) {
  let text = rawBuffer.toString('binary');

  // Decode hex character entities
  const hexMap = {
    '91': "'", '92': "'", '93': '"', '94': '"',
    '95': '-', '96': '-', '97': '-', 'a0': ' ',
  };
  text = text.replace(/\\'([0-9a-fA-F]{2})/g,
    (_, h) => {
      const lower = h.toLowerCase();
      if (hexMap[lower]) return hexMap[lower];
      const code = parseInt(h, 16);
      return code >= 32 && code < 128 ? String.fromCharCode(code) : '';
    });

  // Remove groups that are definitely RTF metadata (fonttbl, colortbl, optional destinations)
  function removeMetaGroups(s) {
    let out = '';
    let i = 0;
    while (i < s.length) {
      if (s[i] === '{') {
        const peek = s.slice(i + 1, i + 80);
        const isMeta =
          /^\\fonttbl/.test(peek) ||
          /^\\colortbl/.test(peek) ||
          /^\\\*/.test(peek);
        if (isMeta) {
          let depth = 1;
          i++;
          while (i < s.length && depth > 0) {
            if (s[i] === '{') depth++;
            else if (s[i] === '}') depth--;
            i++;
          }
          continue;
        }
      }
      out += s[i];
      i++;
    }
    return out;
  }
  text = removeMetaGroups(text);

  // Soft line break in RTF: \ followed by newline
  text = text.replace(/\\\r?\n/g, '\n');
  text = text.replace(/\\par\b/g, '\n');
  text = text.replace(/\\line\b/g, '\n');

  // Protect escaped literals before stripping
  text = text.replace(/\\\\/g, '\x01');
  text = text.replace(/\\\{/g, '\x02');
  text = text.replace(/\\\}/g, '\x03');

  // Remove RTF control words (e.g. \f0, \fs24, \cf0, \pard, \tx720)
  text = text.replace(/\\[a-zA-Z*]+\*?-?[0-9]* ?/g, '');
  // Remove any remaining backslash sequences
  text = text.replace(/\\./g, '');
  // Remove braces
  text = text.replace(/[{}]/g, '');

  // Restore escaped literals
  text = text.replace(/\x01/g, '\\');
  text = text.replace(/\x02/g, '{');
  text = text.replace(/\x03/g, '}');

  // Normalise whitespace
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\n[ \t]+/g, '\n');
  text = text.replace(/[ \t]+\n/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');

  // Strip residual RTF metadata artefacts (font names, colour definitions)
  const lines = text.split('\n').filter(l => {
    const t = l.trim();
    if (!t) return false;
    if (/Helvetica|ArialMT|TimesRoman|Times-Roman|Courier/.test(t)) return false;
    if (/^(red|green|blue)\d/.test(t)) return false;
    if (/cssrgb/.test(t)) return false;
    if (/^;+$/.test(t)) return false;
    return true;
  });

  return lines.join('\n').trim();
}

function extractMeta(lines) {
  const meta = { servings: null, prepTime: null, cookTime: null };
  const rest = [];
  for (const line of lines) {
    if (/^prep\s*time\s*:/i.test(line)) {
      meta.prepTime = line.replace(/^[^:]+:\s*/, '').trim();
    } else if (/^cook(ing)?\s*time\s*:/i.test(line)) {
      meta.cookTime = line.replace(/^[^:]+:\s*/, '').trim();
    } else if (/^serves?\s*:/i.test(line)) {
      meta.servings = line.replace(/^[^:]+:\s*/, '').trim();
    } else {
      rest.push(line);
    }
  }
  return { meta, lines: rest };
}

function separateRecipe(lines) {
  // Explicit section markers
  const methodIdx = lines.findIndex(l =>
    /^(method|instructions?|how\s+to(\s+(make|cook|prepare))?|steps?)\s*:?\s*$/i.test(l)
  );
  if (methodIdx >= 0) {
    return {
      ingredients: lines.slice(0, methodIdx),
      instructions: lines.slice(methodIdx + 1),
    };
  }

  // Detect ingredient-like lines: "Item: qty" or "qty item" (digit-first)
  const hasIngredientLines = lines.some(
    l => /^[^:\n]+:\s*[\d¼½¾]/.test(l) || /^[\d¼½¾]/.test(l)
  );
  if (!hasIngredientLines) {
    return { ingredients: [], instructions: lines };
  }

  // Find transition: first line longer than 45 chars signals start of instruction prose
  const splitIdx = lines.findIndex(l => l.length > 45);
  if (splitIdx >= 0) {
    return {
      ingredients: lines.slice(0, splitIdx),
      instructions: lines.slice(splitIdx),
    };
  }

  return { ingredients: lines, instructions: [] };
}

function calcComplexity(ingredients) {
  const n = ingredients.length;
  if (n <= 5) return 1;
  if (n <= 10) return 2;
  if (n <= 15) return 3;
  if (n <= 20) return 4;
  return 5;
}

async function main() {
  const files = fs.readdirSync(RECIPES_DIR).filter(f => f.endsWith('.rtf'));
  console.log(`Found ${files.length} recipe files.`);

  let seeded = 0;
  let skipped = 0;

  for (const file of files) {
    const baseName = file.replace(/\.rtf$/i, '');
    const displayName = DISPLAY_NAMES[baseName] || baseName;
    const category = CATEGORY_MAP[displayName] || 'Other';
    const cuisine = CUISINE_MAP[displayName] || 'Indian';

    const rawBuffer = fs.readFileSync(path.join(RECIPES_DIR, file));
    const text = parseRTF(rawBuffer);

    if (!text.trim()) {
      console.log(`  Skipping ${file} (empty after parse)`);
      skipped++;
      continue;
    }

    const allLines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const { meta, lines: contentLines } = extractMeta(allLines);
    const { ingredients, instructions } = separateRecipe(contentLines);

    const complexity = calcComplexity(ingredients);

    await prisma.recipe.upsert({
      where: { name: displayName },
      update: {
        category,
        cuisine,
        ingredients: JSON.stringify(ingredients),
        instructions: JSON.stringify(instructions),
        servings: meta.servings,
        prepTime: meta.prepTime,
        cookTime: meta.cookTime,
        complexity,
      },
      create: {
        name: displayName,
        category,
        cuisine,
        ingredients: JSON.stringify(ingredients),
        instructions: JSON.stringify(instructions),
        servings: meta.servings,
        prepTime: meta.prepTime,
        cookTime: meta.cookTime,
        complexity,
      },
    });

    console.log(`  Seeded: ${displayName} (${ingredients.length} ingredients, ${instructions.length} steps)`);
    seeded++;
  }

  console.log(`\nDone. ${seeded} seeded, ${skipped} skipped.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
