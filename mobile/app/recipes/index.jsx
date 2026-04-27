import { useState, useMemo, useCallback } from 'react'
import {
  View, Text, TextInput, FlatList, SectionList, Pressable,
  StyleSheet, SafeAreaView, ActivityIndicator, Modal, ScrollView,
  Alert, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useQuery, useMutation } from '@apollo/client/react'
import { useSelector, useDispatch } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GET_RECIPES, CREATE_RECIPE, UPDATE_RECIPE, DELETE_RECIPE } from '../../src/apollo/queries'
import { setSearchQuery, setSortBy } from '../../src/store/slices/recipesSlice'

// ─── Constants ────────────────────────────────────────────────────────────────

const COMPLEXITY_LABELS = ['', 'Very Easy', 'Easy', 'Medium', 'Hard', 'Expert']
const HEALTH_SCORES = {
  'Soups & Rasam': 5, 'Dals & Lentils': 5, 'Chutneys & Raitas': 4,
  'Curries & Gravies': 3, 'Breakfast & Tiffin': 3, 'Rice & Pulao': 3,
  'Indo-Chinese': 2, 'Snacks & Street Food': 2, 'Breads': 2, 'Sweets & Desserts': 1,
}
const HEALTH_META = [
  null,
  { label: 'Indulgent',    color: '#ef4444' },
  { label: 'Less Healthy', color: '#f97316' },
  { label: 'Moderate',     color: '#f59e0b' },
  { label: 'Healthy',      color: '#84cc16' },
  { label: 'Very Healthy', color: '#4ade80' },
]
const SORT_OPTIONS = [
  { key: 'alphabetical', label: 'A–Z' },
  { key: 'category',     label: 'Category' },
  { key: 'complexity',   label: 'Difficulty' },
  { key: 'cuisine',      label: 'Cuisine' },
]
const CATEGORIES = [
  'Breakfast & Tiffin','Breads','Chutneys & Raitas','Curries & Gravies',
  'Dals & Lentils','Indo-Chinese','Rice & Pulao','Snacks & Street Food',
  'Soups & Rasam','Sweets & Desserts',
]
const CUISINES = [
  'Andhra','Bengali','Chinese','Chettinad','Goan','Gujarati','Hyderabadi',
  'Indo-Chinese','Jain','Kannada','Kashmiri','Kerala','Maharashtrian',
  'North Indian','Punjabi','Rajasthani','South Indian','Tamil Nadu',
  'Telugu','Udupi','Vegan','Vegetarian',
]
const TABS = ['Browse', 'Pantry']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function healthScore(cat) { return HEALTH_SCORES[cat] ?? 3 }
function healthMeta(cat) { return HEALTH_META[healthScore(cat)] }

function buildSections(recipes, sortBy) {
  const sorted = [...recipes].sort((a, b) => a.name.localeCompare(b.name))
  const group = (key) => {
    const map = {}
    for (const r of sorted) { const k = r[key] || 'Other'; if (!map[k]) map[k] = []; map[k].push(r) }
    return Object.entries(map).sort(([a],[b]) => a.localeCompare(b)).map(([title, data]) => ({ title, data }))
  }
  if (sortBy === 'category')   return group('category')
  if (sortBy === 'cuisine')    return group('cuisine')
  if (sortBy === 'complexity') {
    const labels = {}
    for (const r of sorted) { const l = COMPLEXITY_LABELS[r.complexity] || 'Unknown'; if (!labels[l]) labels[l]=[]; labels[l].push(r) }
    const order = ['Very Easy','Easy','Medium','Hard','Expert']
    return order.filter(k => labels[k]).map(title => ({ title, data: labels[title] }))
  }
  const map = {}
  for (const r of sorted) { const l = r.name[0].toUpperCase(); if (!map[l]) map[l]=[]; map[l].push(r) }
  return Object.entries(map).sort(([a],[b]) => a.localeCompare(b)).map(([title, data]) => ({ title, data }))
}

function extractIngredients(recipes) {
  const seen = new Map()
  for (const r of recipes) {
    for (const ing of (r.ingredients || [])) {
      if (ing.name) seen.set(ing.name.toLowerCase(), ing.name)
    }
  }
  return [...seen.values()].sort((a,b) => a.localeCompare(b))
}

function computeMatches(recipes, selected) {
  if (!selected.size) return []
  const sel = new Set([...selected].map(s => s.toLowerCase()))
  return recipes.map(r => {
    const ings = (r.ingredients || []).map(i => i.name).filter(Boolean)
    const matched = ings.filter(n => sel.has(n.toLowerCase())).length
    const missing = ings.filter(n => !sel.has(n.toLowerCase()))
    return { ...r, matched, missing: missing.length, total: ings.length, missingIngredients: missing }
  }).filter(r => r.matched > 0).sort((a,b) => a.missing - b.missing || b.matched - a.matched)
}

// ─── RecipeForm Modal ─────────────────────────────────────────────────────────

function RecipeFormModal({ visible, recipe, onClose }) {
  const isEdit = !!recipe
  const [form, setForm] = useState({
    name: recipe?.name ?? '',
    category: recipe?.category ?? CATEGORIES[0],
    cuisine: recipe?.cuisine ?? CUISINES[0],
    servings: recipe?.servings ?? '',
    prepTime: recipe?.prepTime ?? '',
    cookTime: recipe?.cookTime ?? '',
    complexity: recipe?.complexity ?? 3,
    imageUrl: recipe?.imageUrl ?? '',
    ingredients: recipe ? (recipe.ingredients || []).map(i => ({ name: i.name||'', quantity: i.quantity||'' })) : [{ name:'', quantity:'' }],
    instructions: recipe ? JSON.parse(recipe.instructions || '[]') : [''],
  })

  const [createRecipe, { loading: creating }] = useMutation(CREATE_RECIPE, { refetchQueries: [{ query: GET_RECIPES }] })
  const [updateRecipe, { loading: updating }] = useMutation(UPDATE_RECIPE, { refetchQueries: [{ query: GET_RECIPES }] })
  const saving = creating || updating

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function submit() {
    if (!form.name.trim() || !form.category || !form.cuisine) {
      Alert.alert('Required', 'Name, category and cuisine are required.')
      return
    }
    const vars = {
      name: form.name.trim(), category: form.category, cuisine: form.cuisine,
      ingredients: form.ingredients.filter(i => i.name.trim()).map(i => ({ name: i.name.trim(), quantity: i.quantity.trim()||null })),
      instructions: JSON.stringify(form.instructions.filter(s => s.trim())),
      servings: form.servings||null, prepTime: form.prepTime||null, cookTime: form.cookTime||null,
      complexity: parseInt(form.complexity, 10), imageUrl: form.imageUrl||null,
    }
    if (isEdit) await updateRecipe({ variables: { id: recipe.id, ...vars } })
    else        await createRecipe({ variables: vars })
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={sf.container}>
        <View style={sf.header}>
          <Text style={sf.title}>{isEdit ? 'Edit Recipe' : 'Add Recipe'}</Text>
          <Pressable onPress={onClose}><Ionicons name="close" size={26} color="#fff" /></Pressable>
        </View>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
          <ScrollView style={sf.scroll} contentContainerStyle={sf.content}>
            <Field label="Name *"><TextInput style={sf.input} value={form.name} onChangeText={v=>set('name',v)} placeholderTextColor="#555" placeholder="Recipe name" /></Field>
            <Row>
              <PickerField label="Category" value={form.category} options={CATEGORIES} onChange={v=>set('category',v)} />
              <PickerField label="Cuisine"  value={form.cuisine}  options={CUISINES}   onChange={v=>set('cuisine',v)}  />
            </Row>
            <Row>
              <Field label="Servings"><TextInput style={sf.input} value={form.servings} onChangeText={v=>set('servings',v)} placeholder="4" placeholderTextColor="#555" /></Field>
              <Field label="Prep"><TextInput style={sf.input} value={form.prepTime} onChangeText={v=>set('prepTime',v)} placeholder="20 min" placeholderTextColor="#555" /></Field>
              <Field label="Cook"><TextInput style={sf.input} value={form.cookTime} onChangeText={v=>set('cookTime',v)} placeholder="30 min" placeholderTextColor="#555" /></Field>
            </Row>
            <Field label="Difficulty">
              <View style={sf.stars}>
                {[1,2,3,4,5].map(n=>(
                  <Pressable key={n} onPress={()=>set('complexity',n)}>
                    <Text style={[sf.star, n<=form.complexity && sf.starOn]}>★</Text>
                  </Pressable>
                ))}
                <Text style={sf.complexityLabel}>{COMPLEXITY_LABELS[form.complexity]}</Text>
              </View>
            </Field>

            <Text style={sf.sectionLabel}>Ingredients</Text>
            {form.ingredients.map((ing,i) => (
              <View key={i} style={sf.ingRow}>
                <TextInput style={[sf.input,{width:70}]} value={ing.quantity} onChangeText={v=>{const a=[...form.ingredients];a[i]={...a[i],quantity:v};set('ingredients',a)}} placeholder="Qty" placeholderTextColor="#555" />
                <TextInput style={[sf.input,{flex:1}]} value={ing.name} onChangeText={v=>{const a=[...form.ingredients];a[i]={...a[i],name:v};set('ingredients',a)}} placeholder="Ingredient" placeholderTextColor="#555" />
                <Pressable onPress={()=>set('ingredients',form.ingredients.filter((_,j)=>j!==i))} disabled={form.ingredients.length===1}>
                  <Ionicons name="remove-circle-outline" size={22} color={form.ingredients.length===1?'#333':'#f87171'} />
                </Pressable>
              </View>
            ))}
            <Pressable style={sf.addBtn} onPress={()=>set('ingredients',[...form.ingredients,{name:'',quantity:''}])}>
              <Text style={sf.addBtnText}>+ Add Ingredient</Text>
            </Pressable>

            <Text style={sf.sectionLabel}>Instructions</Text>
            {form.instructions.map((step,i) => (
              <View key={i} style={sf.stepRow}>
                <Text style={sf.stepNum}>{i+1}.</Text>
                <TextInput style={[sf.input,{flex:1}]} value={step} onChangeText={v=>{const a=[...form.instructions];a[i]=v;set('instructions',a)}} placeholder={`Step ${i+1}`} placeholderTextColor="#555" multiline />
                <Pressable onPress={()=>set('instructions',form.instructions.filter((_,j)=>j!==i))} disabled={form.instructions.length===1}>
                  <Ionicons name="remove-circle-outline" size={22} color={form.instructions.length===1?'#333':'#f87171'} />
                </Pressable>
              </View>
            ))}
            <Pressable style={sf.addBtn} onPress={()=>set('instructions',[...form.instructions,''])}>
              <Text style={sf.addBtnText}>+ Add Step</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={sf.footer}>
          <Pressable style={sf.saveBtn} onPress={submit} disabled={saving}>
            <Text style={sf.saveBtnText}>{saving?'Saving…': isEdit?'Save Changes':'Add Recipe'}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

function Field({ label, children }) {
  return (
    <View style={sf.field}>
      <Text style={sf.fieldLabel}>{label}</Text>
      {children}
    </View>
  )
}

function Row({ children }) { return <View style={sf.row}>{children}</View> }

function PickerField({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <View style={[sf.field,{flex:1}]}>
      <Text style={sf.fieldLabel}>{label}</Text>
      <Pressable style={sf.picker} onPress={()=>setOpen(true)}>
        <Text style={sf.pickerText} numberOfLines={1}>{value}</Text>
        <Ionicons name="chevron-down" size={14} color="#888" />
      </Pressable>
      <Modal visible={open} animationType="slide" presentationStyle="formSheet">
        <SafeAreaView style={{flex:1,backgroundColor:'#1a1a1a'}}>
          <View style={sf.pickerHeader}>
            <Text style={sf.pickerTitle}>{label}</Text>
            <Pressable onPress={()=>setOpen(false)}><Ionicons name="close" size={24} color="#fff"/></Pressable>
          </View>
          <ScrollView>
            {options.map(o=>(
              <Pressable key={o} style={sf.pickerOption} onPress={()=>{onChange(o);setOpen(false)}}>
                <Text style={[sf.pickerOptionText, value===o&&{color:'#646cff'}]}>{o}</Text>
                {value===o && <Ionicons name="checkmark" size={18} color="#646cff"/>}
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  )
}

const sf = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#0f0f0f' },
  header:          { flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:16, borderBottomWidth:1, borderBottomColor:'#2a2a2a' },
  title:           { fontSize:18, fontWeight:'700', color:'#fff' },
  scroll:          { flex:1 },
  content:         { padding:16, gap:12 },
  sectionLabel:    { fontSize:13, fontWeight:'700', color:'#888', textTransform:'uppercase', letterSpacing:1, marginTop:8 },
  field:           { gap:4, flex:1 },
  fieldLabel:      { fontSize:11, fontWeight:'600', color:'#888', textTransform:'uppercase' },
  input:           { backgroundColor:'#1e1e1e', borderWidth:1, borderColor:'#2a2a2a', borderRadius:8, padding:10, color:'#fff', fontSize:14 },
  row:             { flexDirection:'row', gap:10 },
  stars:           { flexDirection:'row', alignItems:'center', gap:4 },
  star:            { fontSize:22, color:'#444' },
  starOn:          { color:'#f59e0b' },
  complexityLabel: { fontSize:12, color:'#888', marginLeft:6 },
  ingRow:          { flexDirection:'row', gap:8, alignItems:'center' },
  stepRow:         { flexDirection:'row', gap:8, alignItems:'flex-start' },
  stepNum:         { color:'#888', fontSize:14, marginTop:10 },
  addBtn:          { paddingVertical:8 },
  addBtnText:      { color:'#646cff', fontSize:14, fontWeight:'600' },
  footer:          { padding:16 },
  saveBtn:         { backgroundColor:'#646cff', borderRadius:12, padding:14, alignItems:'center' },
  saveBtnText:     { color:'#fff', fontSize:16, fontWeight:'700' },
  picker:          { backgroundColor:'#1e1e1e', borderWidth:1, borderColor:'#2a2a2a', borderRadius:8, padding:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  pickerText:      { color:'#fff', fontSize:13, flex:1 },
  pickerHeader:    { flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:16 },
  pickerTitle:     { fontSize:18, fontWeight:'700', color:'#fff' },
  pickerOption:    { padding:16, borderBottomWidth:1, borderBottomColor:'#1a1a1a', flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  pickerOptionText:{ fontSize:15, color:'#ccc' },
})

// ─── Pantry Tab ───────────────────────────────────────────────────────────────

function PantryTab({ recipes, onSelectRecipe }) {
  const [selected, setSelected] = useState(new Set())
  const [search, setSearch] = useState('')

  const all = useMemo(() => extractIngredients(recipes), [recipes])
  const visible = useMemo(() => {
    const q = search.toLowerCase()
    return all.filter(i => !selected.has(i) && (!q || i.toLowerCase().includes(q)))
  }, [all, selected, search])
  const matches = useMemo(() => computeMatches(recipes, selected), [recipes, selected])
  const ready   = matches.filter(r => r.missing === 0)
  const rest    = matches.filter(r => r.missing > 0)

  function toggle(name) {
    setSelected(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n })
  }

  return (
    <View style={p.container}>
      <TextInput style={p.search} placeholder="Search ingredients…" placeholderTextColor="#555" value={search} onChangeText={setSearch} />
      {selected.size > 0 && (
        <View style={p.selectedRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:6,paddingHorizontal:12}}>
            {[...selected].map(name => (
              <Pressable key={name} style={p.selPill} onPress={() => toggle(name)}>
                <Text style={p.selPillText}>{name} ×</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
      {selected.size === 0 ? (
        <>
          <ScrollView contentContainerStyle={p.pillsContainer}>
            {visible.map(name => (
              <Pressable key={name} style={p.pill} onPress={() => toggle(name)}>
                <Text style={p.pillText}>{name}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={p.hint}>
            <Text style={p.hintIcon}>👨‍🍳</Text>
            <Text style={p.hintText}>Select ingredients to find recipes you can cook</Text>
          </View>
        </>
      ) : (
        <ScrollView contentContainerStyle={{paddingBottom:20}}>
          <View style={p.pillsRow}>
            {visible.slice(0,30).map(name => (
              <Pressable key={name} style={p.pill} onPress={() => toggle(name)}>
                <Text style={p.pillText}>{name}</Text>
              </Pressable>
            ))}
          </View>
          {ready.length > 0 && (
            <>
              <View style={p.groupHeader}><Text style={p.groupTitle}>★ Ready to cook</Text><Text style={p.groupCount}>{ready.length}</Text></View>
              {ready.map(r => <MatchCard key={r.id} recipe={r} onPress={() => onSelectRecipe(r.id)} />)}
            </>
          )}
          {rest.length > 0 && (
            <>
              <View style={p.groupHeader}><Text style={p.groupTitle}>Need a few more</Text><Text style={p.groupCount}>{rest.length}</Text></View>
              {rest.map(r => <MatchCard key={r.id} recipe={r} onPress={() => onSelectRecipe(r.id)} />)}
            </>
          )}
        </ScrollView>
      )}
    </View>
  )
}

function MatchCard({ recipe: r, onPress }) {
  const meta = healthMeta(r.category)
  return (
    <Pressable style={p.matchCard} onPress={onPress}>
      <View style={p.matchInfo}>
        <Text style={p.matchName} numberOfLines={1}>{r.name}</Text>
        <Text style={p.matchMeta}>{r.category} · {r.cuisine}</Text>
        {r.missingIngredients?.length > 0 && (
          <Text style={p.matchMissing}>Need: {r.missingIngredients.slice(0,3).join(', ')}{r.missingIngredients.length>3?'…':''}</Text>
        )}
      </View>
      <View style={p.matchRight}>
        <Text style={[p.matchScore, {color:meta?.color??'#888'}]}>{r.matched}/{r.total}</Text>
        <Text style={[p.matchHealth, {color:meta?.color??'#888'}]}>{meta?.label}</Text>
      </View>
    </Pressable>
  )
}

const p = StyleSheet.create({
  container:    { flex:1 },
  search:       { margin:12, backgroundColor:'#1e1e1e', borderWidth:1, borderColor:'#2a2a2a', borderRadius:10, padding:12, color:'#fff', fontSize:14 },
  selectedRow:  { marginBottom:8 },
  selPill:      { backgroundColor:'#646cff22', borderWidth:1, borderColor:'#646cff', borderRadius:20, paddingHorizontal:12, paddingVertical:5 },
  selPillText:  { color:'#646cff', fontSize:13, fontWeight:'600' },
  pillsContainer:{ flexDirection:'row', flexWrap:'wrap', gap:8, paddingHorizontal:12, paddingBottom:12 },
  pillsRow:     { flexDirection:'row', flexWrap:'wrap', gap:8, paddingHorizontal:12, paddingVertical:8 },
  pill:         { backgroundColor:'#1e1e1e', borderWidth:1, borderColor:'#2a2a2a', borderRadius:20, paddingHorizontal:12, paddingVertical:5 },
  pillText:     { color:'#ccc', fontSize:13 },
  hint:         { alignItems:'center', padding:40, gap:12 },
  hintIcon:     { fontSize:48 },
  hintText:     { color:'#666', textAlign:'center', fontSize:14 },
  groupHeader:  { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:12, paddingVertical:8, backgroundColor:'#1a1a1a' },
  groupTitle:   { color:'#aaa', fontWeight:'700', fontSize:13 },
  groupCount:   { color:'#666', fontSize:12 },
  matchCard:    { flexDirection:'row', padding:12, marginHorizontal:12, marginBottom:8, backgroundColor:'#1e1e1e', borderRadius:10, borderWidth:1, borderColor:'#2a2a2a' },
  matchInfo:    { flex:1, gap:2 },
  matchName:    { color:'#fff', fontSize:14, fontWeight:'600' },
  matchMeta:    { color:'#888', fontSize:12 },
  matchMissing: { color:'#f97316', fontSize:11, marginTop:2 },
  matchRight:   { alignItems:'flex-end', gap:4 },
  matchScore:   { fontSize:13, fontWeight:'700' },
  matchHealth:  { fontSize:10 },
})

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function RecipesScreen() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { searchQuery, sortBy } = useSelector(s => s.recipes)
  const { data, loading } = useQuery(GET_RECIPES)
  const [tab, setTab] = useState(0)
  const [formModal, setFormModal] = useState(null)

  const all = data?.recipes ?? []
  const filtered = searchQuery ? all.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())) : all
  const sections = useMemo(() => buildSections(filtered, sortBy), [filtered, sortBy])

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="light" />

      {/* Search */}
      <View style={s.searchBar}>
        <Ionicons name="search-outline" size={16} color="#888" style={{marginRight:6}} />
        <TextInput
          style={s.searchInput}
          placeholder="Search recipes…"
          placeholderTextColor="#555"
          value={searchQuery}
          onChangeText={v => dispatch(setSearchQuery(v))}
        />
        {searchQuery ? (
          <Pressable onPress={() => dispatch(setSearchQuery(''))}><Ionicons name="close-circle" size={18} color="#888"/></Pressable>
        ) : null}
        <Text style={s.count}>{all.length}</Text>
        <Pressable style={s.addBtn} onPress={() => setFormModal({ recipe: null })}>
          <Ionicons name="add" size={20} color="#fff" />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        {TABS.map((t,i) => (
          <Pressable key={t} style={[s.tab, tab===i && s.tabActive]} onPress={() => setTab(i)}>
            <Text style={[s.tabText, tab===i && s.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {tab === 0 ? (
        <>
          {/* Sort chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.sortScroll} contentContainerStyle={{gap:8,paddingHorizontal:12}}>
            {SORT_OPTIONS.map(o => (
              <Pressable key={o.key} style={[s.sortChip, sortBy===o.key && s.sortChipActive]} onPress={() => dispatch(setSortBy(o.key))}>
                <Text style={[s.sortChipText, sortBy===o.key && s.sortChipTextActive]}>{o.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {loading ? (
            <ActivityIndicator style={{marginTop:40}} color="#646cff" />
          ) : (
            <SectionList
              sections={sections}
              keyExtractor={r => r.id}
              renderSectionHeader={({ section: { title, data } }) => (
                <View style={s.sectionHdr}>
                  <Text style={s.sectionHdrText}>{title}</Text>
                  <Text style={s.sectionCount}>{data.length}</Text>
                </View>
              )}
              renderItem={({ item: r }) => (
                <Pressable style={s.recipeRow} onPress={() => router.push(`/recipes/${r.id}`)}>
                  <View style={s.recipeInfo}>
                    <Text style={s.recipeName} numberOfLines={1}>{r.name}</Text>
                    <Text style={s.recipeMeta}>{r.category} · {r.cuisine}</Text>
                  </View>
                  <View style={s.recipeRight}>
                    <Text style={s.stars}>{'★'.repeat(r.complexity)}{'☆'.repeat(5-r.complexity)}</Text>
                    <Text style={[s.healthLabel, {color: healthMeta(r.category)?.color??'#888'}]}>
                      {healthMeta(r.category)?.label}
                    </Text>
                  </View>
                </Pressable>
              )}
              contentContainerStyle={{ paddingBottom: 80 }}
            />
          )}
        </>
      ) : (
        <PantryTab recipes={all} onSelectRecipe={id => router.push(`/recipes/${id}`)} />
      )}

      {formModal && (
        <RecipeFormModal
          visible
          recipe={formModal.recipe}
          onClose={() => setFormModal(null)}
        />
      )}
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: '#0f0f0f' },
  searchBar:         { flexDirection:'row', alignItems:'center', margin:12, backgroundColor:'#1e1e1e', borderRadius:10, paddingHorizontal:12, gap:4 },
  searchInput:       { flex:1, color:'#fff', fontSize:14, paddingVertical:10 },
  count:             { color:'#555', fontSize:12, marginHorizontal:4 },
  addBtn:            { backgroundColor:'#646cff', borderRadius:8, padding:5, marginLeft:4 },
  tabs:              { flexDirection:'row', marginHorizontal:12, marginBottom:6, backgroundColor:'#1a1a1a', borderRadius:10, padding:3 },
  tab:               { flex:1, alignItems:'center', paddingVertical:7, borderRadius:8 },
  tabActive:         { backgroundColor:'#2a2a2a' },
  tabText:           { color:'#666', fontSize:13, fontWeight:'600' },
  tabTextActive:     { color:'#fff' },
  sortScroll:        { maxHeight:44, marginBottom:4 },
  sortChip:          { paddingHorizontal:14, paddingVertical:6, borderRadius:20, borderWidth:1, borderColor:'#2a2a2a', backgroundColor:'#1e1e1e' },
  sortChipActive:    { borderColor:'#646cff', backgroundColor:'rgba(100,108,255,0.12)' },
  sortChipText:      { color:'#666', fontSize:13, fontWeight:'600' },
  sortChipTextActive:{ color:'#646cff' },
  sectionHdr:        { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:12, paddingVertical:6, backgroundColor:'#0f0f0f' },
  sectionHdrText:    { color:'#888', fontSize:11, fontWeight:'700', textTransform:'uppercase', letterSpacing:1 },
  sectionCount:      { color:'#444', fontSize:11 },
  recipeRow:         { flexDirection:'row', alignItems:'center', paddingVertical:12, paddingHorizontal:14, borderBottomWidth:1, borderBottomColor:'#1a1a1a', justifyContent:'space-between' },
  recipeInfo:        { flex:1 },
  recipeName:        { color:'#fff', fontSize:15, fontWeight:'600' },
  recipeMeta:        { color:'#666', fontSize:12, marginTop:2 },
  recipeRight:       { alignItems:'flex-end', gap:3 },
  stars:             { color:'#f59e0b', fontSize:11 },
  healthLabel:       { fontSize:11 },
})
