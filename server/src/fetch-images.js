import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Wikipedia article titles for dishes whose names don't match directly
const WIKI_SEARCH = {
  'Saaru':                 'Saaru',
  'Saaru Classic':         'Saaru',
  'Thili Saaru':           'Saaru',
  'Kundapura Saaru':       'Rasam',
  'Kalyana Rasam':         'Rasam',
  'Sambar for Idli':       'Sambar (dish)',
  'Sambar for Rava Dosa':  'Sambar (dish)',
  'Sambar':                'Sambar (dish)',
  'Temple Style Sambar':   'Sambar (dish)',
  'Tiffin Sambar':         'Sambar (dish)',
  'SLV Style Chutney':     'Chutney',
  'Chutney':               'Chutney',
  'Boondhi Raita':         'Boondi raita',
  'Raita':                 'Raita',
  'Veg Machurian':         'Manchurian (food)',
  'Veg Manchow Soup':      'Manchow soup',
  'Honey Chilli Potato':   'Chilli potato',
  'Mexican Fried Rice':    'Fried rice',
  'Capsicum Lemon Rice':   'Lemon rice',
  'Ragda Masala':          'Ragda',
  'Ragda Pattice':         'Ragda pattice',
  'Poori Bhaaji':          'Puri bhaji',
  'Poori':                 'Puri (food)',
  'Erissery':              'Erissery',
  'Vettha Kozhambu':       'Vatha kuzhambu',
  'Chakka Payasam':        'Chakka pradhaman',
  'Sweet Avalakki':        'Poha',
  'Bun Dosa':              'Dosa',
  'Karachi Halwa':         'Karachi halwa',
  'Kaju Masala':           'Cashew curry',
  'Halkova':               'Halwa',
  'Obbattu':               'Puran poli',
  'Panagam':               'Panakam',
  'Navratan Kurma':        'Navratan korma',
  'Adhraki Gobhi':         'Adraki gobi',
  'Channa Masala':         'Chana masala',
  'Gulab Jamoon':          'Gulab jamun',
  'Veg Kurma':             'Korma',
  'Sweet Corn Soup':       'Corn soup',
  'Masala Toast':          'Masala toast',
  'Beans':                 'Beans sabzi',
  'Chowmein':              'Chow mein',
  'Fried Rice':            'Fried rice',
  'Biryani':               'Biryani',
  'Puliyogare':            'Puliyogare',
  'Ghee Rice':             'Ghee rice',
  'Curd Rice':             'Curd rice',
  'Kesari':                'Kesari (food)',
  'Kadhi':                 'Kadhi',
  'Dal Fry':               'Dal fry',
  'Butter Naan':           'Naan',
  'Jeera Rice':            'Jeera rice',
  'Pulao':                 'Pilaf',
  'Rava Dosa':             'Rava dosa',
  'Samosa':                'Samosa',
  'Vada Pav':              'Vada pav',
  'Tomato Rice':           'Tomato rice',
  'Boiled Peanut Chaat':   'Chaat',
  'Chilli Bajji':          'Bajji',
};

async function fetchWikipediaImage(title) {
  const url =
    `https://en.wikipedia.org/w/api.php?action=query` +
    `&titles=${encodeURIComponent(title)}` +
    `&prop=pageimages` +
    `&format=json` +
    `&pithumbsize=1200` +
    `&origin=*`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const json = await res.json();
  const pages = json?.query?.pages;
  if (!pages) return null;

  const page = Object.values(pages)[0];
  return page?.thumbnail?.source ?? null;
}

async function main() {
  const recipes = await prisma.recipe.findMany({ select: { id: true, name: true, imageUrl: true } });
  console.log(`Processing ${recipes.length} recipes…\n`);

  for (const recipe of recipes) {
    if (recipe.imageUrl) {
      console.log(`  ✓ skip  ${recipe.name}  (already has image)`);
      continue;
    }

    const searchTitle = WIKI_SEARCH[recipe.name] ?? recipe.name;
    let imageUrl = await fetchWikipediaImage(searchTitle);

    // If the mapped title found nothing, try the raw recipe name
    if (!imageUrl && searchTitle !== recipe.name) {
      imageUrl = await fetchWikipediaImage(recipe.name);
    }

    if (imageUrl) {
      await prisma.recipe.update({ where: { id: recipe.id }, data: { imageUrl } });
      console.log(`  ✓ saved  ${recipe.name}`);
      console.log(`           ${imageUrl}`);
    } else {
      console.log(`  ✗ miss   ${recipe.name}  (no Wikipedia image)`);
    }

    // Polite delay to avoid hammering Wikipedia
    await new Promise(r => setTimeout(r, 150));
  }

  console.log('\nDone.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
