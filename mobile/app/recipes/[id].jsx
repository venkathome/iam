import { useState, useEffect } from 'react'
import {
  View, Text, ScrollView, Pressable, StyleSheet, Alert,
  ActivityIndicator, Image, Modal, TextInput, FlatList,
} from 'react-native'
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router'
import { useQuery, useMutation } from '@apollo/client/react'
import { Ionicons } from '@expo/vector-icons'
import {
  GET_RECIPE, GET_RECIPES, UPDATE_RECIPE, DELETE_RECIPE, CREATE_RECIPE,
} from '../../src/apollo/queries'

const COMPLEXITY_LABELS = ['', 'Very Easy', 'Easy', 'Medium', 'Hard', 'Expert']
const CATEGORIES = [
  'Breakfast & Tiffin', 'Breads', 'Chutneys & Raitas', 'Curries & Gravies',
  'Dals & Lentils', 'Indo-Chinese', 'Rice & Pulao', 'Snacks & Street Food',
  'Soups & Rasam', 'Sweets & Desserts',
]
const CUISINES = [
  'Andhra', 'Bengali', 'Chinese', 'Chettinad', 'Goan', 'Gujarati', 'Hyderabadi',
  'Indo-Chinese', 'Jain', 'Kannada', 'Kashmiri', 'Kerala', 'Maharashtrian',
  'North Indian', 'Punjabi', 'Rajasthani', 'South Indian', 'Tamil Nadu',
  'Telugu', 'Udupi', 'Vegan', 'Vegetarian',
]
const HEALTH_SCORES = {
  'Soups & Rasam': 5, 'Dals & Lentils': 5, 'Chutneys & Raitas': 4,
  'Curries & Gravies': 3, 'Breakfast & Tiffin': 3, 'Rice & Pulao': 3,
  'Indo-Chinese': 2, 'Snacks & Street Food': 2, 'Breads': 2, 'Sweets & Desserts': 1,
}
const HEALTH_META = [
  null,
  { label: 'Indulgent', color: '#ef4444' },
  { label: 'Less Healthy', color: '#f97316' },
  { label: 'Moderate', color: '#f59e0b' },
  { label: 'Healthy', color: '#84cc16' },
  { label: 'Very Healthy', color: '#4ade80' },
]

// ── PickerModal ───────────────────────────────────────────────────────────────

function PickerModal({ visible, title, options, selected, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={pm.overlay}>
        <View style={pm.sheet}>
          <View style={pm.header}>
            <Text style={pm.title}>{title}</Text>
            <Pressable onPress={onClose}><Text style={pm.close}>Done</Text></Pressable>
          </View>
          <FlatList
            data={options}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <Pressable
                style={[pm.option, selected === item && pm.optionSelected]}
                onPress={() => { onSelect(item); onClose() }}
              >
                <Text style={[pm.optionText, selected === item && pm.optionTextSelected]}>
                  {item}
                </Text>
                {selected === item && <Ionicons name="checkmark" size={18} color="#646cff" />}
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  )
}
const pm = StyleSheet.create({
  overlay:            { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet:              { backgroundColor: '#1e1e1e', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  header:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#333' },
  title:              { color: '#fff', fontSize: 17, fontWeight: '600' },
  close:              { color: '#646cff', fontSize: 16, fontWeight: '600' },
  option:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  optionSelected:     { backgroundColor: 'rgba(100,108,255,0.08)' },
  optionText:         { color: '#ccc', fontSize: 15 },
  optionTextSelected: { color: '#646cff', fontWeight: '600' },
})

// ── EditModal ─────────────────────────────────────────────────────────────────

function EditModal({ recipe, visible, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: '', category: '', cuisine: '', servings: '', prepTime: '', cookTime: '',
    complexity: 3, imageUrl: '',
    ingredients: [{ name: '', quantity: '' }],
    instructions: [''],
  })
  const [showCatPicker, setShowCatPicker] = useState(false)
  const [showCuiPicker, setShowCuiPicker] = useState(false)

  useEffect(() => {
    if (recipe) {
      setForm({
        name:        recipe.name ?? '',
        category:    recipe.category ?? '',
        cuisine:     recipe.cuisine ?? '',
        servings:    recipe.servings ?? '',
        prepTime:    recipe.prepTime ?? '',
        cookTime:    recipe.cookTime ?? '',
        complexity:  recipe.complexity ?? 3,
        imageUrl:    recipe.imageUrl ?? '',
        ingredients: (recipe.ingredients?.length ? recipe.ingredients : [{ name: '', quantity: '' }])
                       .map(i => ({ name: i.name || '', quantity: i.quantity || '' })),
        instructions: (() => {
          try { const p = JSON.parse(recipe.instructions || '[]'); return p.length ? p : [''] }
          catch { return [''] }
        })(),
      })
    }
  }, [recipe])

  const [updateRecipe, { loading }] = useMutation(UPDATE_RECIPE, {
    refetchQueries: [{ query: GET_RECIPES }, { query: GET_RECIPE, variables: { id: recipe?.id } }],
  })

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  function setIngField(i, field, val) {
    setForm(f => {
      const arr = [...f.ingredients]; arr[i] = { ...arr[i], [field]: val }; return { ...f, ingredients: arr }
    })
  }
  function addIng() { setForm(f => ({ ...f, ingredients: [...f.ingredients, { name: '', quantity: '' }] })) }
  function removeIng(i) { setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, idx) => idx !== i) })) }

  function setStep(i, val) {
    setForm(f => { const arr = [...f.instructions]; arr[i] = val; return { ...f, instructions: arr } })
  }
  function addStep() { setForm(f => ({ ...f, instructions: [...f.instructions, ''] })) }
  function removeStep(i) { setForm(f => ({ ...f, instructions: f.instructions.filter((_, idx) => idx !== i) })) }

  async function save() {
    if (!form.name.trim() || !form.category || !form.cuisine) {
      Alert.alert('Required', 'Name, category, and cuisine are required.'); return
    }
    await updateRecipe({
      variables: {
        id: recipe.id,
        name:        form.name.trim(),
        category:    form.category,
        cuisine:     form.cuisine,
        servings:    form.servings.trim() || null,
        prepTime:    form.prepTime.trim() || null,
        cookTime:    form.cookTime.trim() || null,
        complexity:  parseInt(form.complexity, 10),
        imageUrl:    form.imageUrl.trim() || null,
        ingredients: form.ingredients.filter(i => i.name.trim()).map(i => ({ name: i.name.trim(), quantity: i.quantity.trim() || null })),
        instructions: JSON.stringify(form.instructions.filter(s => s.trim())),
      },
    })
    onSaved?.()
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet" onRequestClose={onClose}>
      <View style={em.root}>
        <View style={em.nav}>
          <Pressable onPress={onClose}><Text style={em.navCancel}>Cancel</Text></Pressable>
          <Text style={em.navTitle}>Edit Recipe</Text>
          <Pressable onPress={save} disabled={loading}>
            <Text style={[em.navSave, loading && em.navSaveDis]}>{loading ? 'Saving…' : 'Save'}</Text>
          </Pressable>
        </View>

        <ScrollView style={em.scroll} keyboardShouldPersistTaps="handled">
          <Text style={em.sectionLabel}>Basic Info</Text>

          <View style={em.field}>
            <Text style={em.label}>Recipe Name *</Text>
            <TextInput style={em.input} value={form.name} onChangeText={v => set('name', v)}
              placeholder="e.g. Chicken Tikka Masala" placeholderTextColor="#555" />
          </View>

          <Pressable style={em.field} onPress={() => setShowCatPicker(true)}>
            <Text style={em.label}>Category *</Text>
            <View style={em.picker}>
              <Text style={[em.pickerText, !form.category && em.pickerPlaceholder]}>
                {form.category || 'Select category…'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#888" />
            </View>
          </Pressable>

          <Pressable style={em.field} onPress={() => setShowCuiPicker(true)}>
            <Text style={em.label}>Cuisine *</Text>
            <View style={em.picker}>
              <Text style={[em.pickerText, !form.cuisine && em.pickerPlaceholder]}>
                {form.cuisine || 'Select cuisine…'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#888" />
            </View>
          </Pressable>

          <View style={em.row}>
            <View style={[em.field, { flex: 1 }]}>
              <Text style={em.label}>Servings</Text>
              <TextInput style={em.input} value={form.servings} onChangeText={v => set('servings', v)} placeholder="e.g. 4" placeholderTextColor="#555" />
            </View>
            <View style={[em.field, { flex: 1 }]}>
              <Text style={em.label}>Prep Time</Text>
              <TextInput style={em.input} value={form.prepTime} onChangeText={v => set('prepTime', v)} placeholder="20 mins" placeholderTextColor="#555" />
            </View>
            <View style={[em.field, { flex: 1 }]}>
              <Text style={em.label}>Cook Time</Text>
              <TextInput style={em.input} value={form.cookTime} onChangeText={v => set('cookTime', v)} placeholder="30 mins" placeholderTextColor="#555" />
            </View>
          </View>

          <View style={em.field}>
            <Text style={em.label}>Difficulty</Text>
            <View style={em.stars}>
              {[1,2,3,4,5].map(n => (
                <Pressable key={n} onPress={() => set('complexity', n)}>
                  <Text style={[em.star, n <= form.complexity && em.starOn]}>★</Text>
                </Pressable>
              ))}
              <Text style={em.starLabel}>{COMPLEXITY_LABELS[form.complexity]}</Text>
            </View>
          </View>

          <View style={em.field}>
            <Text style={em.label}>Image URL</Text>
            <TextInput style={em.input} value={form.imageUrl} onChangeText={v => set('imageUrl', v)} placeholder="https://…" placeholderTextColor="#555" autoCapitalize="none" />
          </View>

          <Text style={em.sectionLabel}>Ingredients</Text>
          {form.ingredients.map((ing, i) => (
            <View key={i} style={em.listRow}>
              <Text style={em.listIdx}>{i + 1}</Text>
              <TextInput style={[em.input, em.qtyInput]} value={ing.quantity}
                onChangeText={v => setIngField(i, 'quantity', v)} placeholder="Qty" placeholderTextColor="#555" />
              <TextInput style={[em.input, { flex: 1 }]} value={ing.name}
                onChangeText={v => setIngField(i, 'name', v)} placeholder="Ingredient" placeholderTextColor="#555" />
              <Pressable onPress={() => removeIng(i)} disabled={form.ingredients.length === 1}>
                <Text style={[em.removeBtn, form.ingredients.length === 1 && em.removeBtnDis]}>×</Text>
              </Pressable>
            </View>
          ))}
          <Pressable style={em.addRowBtn} onPress={addIng}>
            <Text style={em.addRowText}>+ Add Ingredient</Text>
          </Pressable>

          <Text style={em.sectionLabel}>Instructions</Text>
          {form.instructions.map((step, i) => (
            <View key={i} style={em.listRow}>
              <Text style={em.listIdx}>{i + 1}</Text>
              <TextInput style={[em.input, { flex: 1 }]} value={step}
                onChangeText={v => setStep(i, v)} placeholder={`Step ${i + 1}…`}
                placeholderTextColor="#555" multiline />
              <Pressable onPress={() => removeStep(i)} disabled={form.instructions.length === 1}>
                <Text style={[em.removeBtn, form.instructions.length === 1 && em.removeBtnDis]}>×</Text>
              </Pressable>
            </View>
          ))}
          <Pressable style={em.addRowBtn} onPress={addStep}>
            <Text style={em.addRowText}>+ Add Step</Text>
          </Pressable>

          <View style={{ height: 60 }} />
        </ScrollView>

        <PickerModal visible={showCatPicker} title="Category" options={CATEGORIES}
          selected={form.category} onSelect={v => set('category', v)} onClose={() => setShowCatPicker(false)} />
        <PickerModal visible={showCuiPicker} title="Cuisine" options={CUISINES}
          selected={form.cuisine} onSelect={v => set('cuisine', v)} onClose={() => setShowCuiPicker(false)} />
      </View>
    </Modal>
  )
}
const em = StyleSheet.create({
  root:             { flex: 1, backgroundColor: '#0f0f0f' },
  nav:              { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  navTitle:         { color: '#fff', fontSize: 17, fontWeight: '600' },
  navCancel:        { color: '#888', fontSize: 15 },
  navSave:          { color: '#646cff', fontSize: 15, fontWeight: '600' },
  navSaveDis:       { opacity: 0.5 },
  scroll:           { flex: 1, padding: 16 },
  sectionLabel:     { color: '#646cff', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 24, marginBottom: 8 },
  field:            { marginBottom: 14 },
  label:            { color: '#999', fontSize: 12, marginBottom: 4 },
  input:            { backgroundColor: '#1e1e1e', borderWidth: 1, borderColor: '#333', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', fontSize: 15 },
  row:              { flexDirection: 'row', gap: 8 },
  picker:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e1e', borderWidth: 1, borderColor: '#333', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 11 },
  pickerText:       { color: '#fff', fontSize: 15 },
  pickerPlaceholder:{ color: '#555' },
  stars:            { flexDirection: 'row', alignItems: 'center', gap: 6 },
  star:             { fontSize: 24, color: '#333' },
  starOn:           { color: '#f59e0b' },
  starLabel:        { color: '#888', fontSize: 13, marginLeft: 8 },
  listRow:          { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  listIdx:          { color: '#555', fontSize: 13, width: 20, textAlign: 'right' },
  qtyInput:         { width: 70 },
  removeBtn:        { color: '#ef4444', fontSize: 22, paddingHorizontal: 4 },
  removeBtnDis:     { opacity: 0.3 },
  addRowBtn:        { paddingVertical: 10 },
  addRowText:       { color: '#646cff', fontSize: 14, fontWeight: '600' },
})

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams()
  const router  = useRouter()
  const nav     = useNavigation()

  const [hiddenIngredients, setHiddenIngredients] = useState(new Set())
  const [showHidden, setShowHidden] = useState(false)
  const [editVisible, setEditVisible] = useState(false)

  const { data, loading } = useQuery(GET_RECIPE, { variables: { id }, skip: !id })
  const [deleteRecipe, { loading: deleting }] = useMutation(DELETE_RECIPE, {
    refetchQueries: [{ query: GET_RECIPES }],
    onCompleted: () => router.back(),
  })

  const recipe = data?.recipe

  useEffect(() => {
    if (recipe) nav.setOptions({ title: recipe.name })
  }, [recipe])

  if (loading) return (
    <View style={s.center}>
      <ActivityIndicator color="#646cff" size="large" />
    </View>
  )
  if (!recipe) return (
    <View style={s.center}>
      <Text style={s.emptyText}>Recipe not found.</Text>
    </View>
  )

  const ingredients  = recipe.ingredients || []
  const instructions = (() => { try { return JSON.parse(recipe.instructions || '[]') } catch { return [] } })()
  const score        = HEALTH_SCORES[recipe.category] ?? 3
  const health       = HEALTH_META[score]

  const visibleIngredients = ingredients.filter(i => !hiddenIngredients.has((i.name || '').toLowerCase()))
  const hiddenList          = ingredients.filter(i =>  hiddenIngredients.has((i.name || '').toLowerCase()))

  function toggleHide(name) {
    setHiddenIngredients(prev => {
      const next = new Set(prev)
      const key  = name.toLowerCase()
      if (next.has(key)) next.delete(key); else next.add(key)
      return next
    })
  }

  function confirmDelete() {
    Alert.alert('Delete Recipe', 'Are you sure you want to delete this recipe?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteRecipe({ variables: { id } }) },
    ])
  }

  return (
    <ScrollView style={s.root} contentContainerStyle={s.container}>
      {/* Hero image */}
      {recipe.imageUrl ? (
        <Image source={{ uri: recipe.imageUrl }} style={s.heroImage} />
      ) : (
        <View style={s.heroPlaceholder}>
          <Ionicons name="restaurant" size={48} color="#444" />
        </View>
      )}

      {/* Title + health badge */}
      <View style={s.titleRow}>
        <Text style={s.recipeName}>{recipe.name}</Text>
        <View style={[s.healthBadge, { backgroundColor: health.color + '22', borderColor: health.color + '66' }]}>
          <Text style={[s.healthText, { color: health.color }]}>{health.label}</Text>
        </View>
      </View>

      {/* Meta chips */}
      <View style={s.metaRow}>
        {[recipe.category, recipe.cuisine, recipe.servings && `Serves ${recipe.servings}`, recipe.prepTime && `Prep ${recipe.prepTime}`, recipe.cookTime && `Cook ${recipe.cookTime}`].filter(Boolean).map(tag => (
          <View key={tag} style={s.metaChip}>
            <Text style={s.metaChipText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Difficulty */}
      <View style={s.diffRow}>
        {Array.from({ length: 5 }, (_, i) => (
          <Text key={i} style={[s.star, i < recipe.complexity && s.starOn]}>★</Text>
        ))}
        <Text style={s.diffLabel}>{COMPLEXITY_LABELS[recipe.complexity]}</Text>
      </View>

      {/* Action buttons */}
      <View style={s.actionRow}>
        <Pressable style={s.editBtn} onPress={() => setEditVisible(true)}>
          <Ionicons name="create-outline" size={16} color="#646cff" />
          <Text style={s.editBtnText}>Edit</Text>
        </Pressable>
        <Pressable style={s.deleteBtn} onPress={confirmDelete} disabled={deleting}>
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
          <Text style={s.deleteBtnText}>{deleting ? 'Deleting…' : 'Delete'}</Text>
        </Pressable>
      </View>

      {/* Ingredients */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>
          🧂 Ingredients
          <Text style={s.sectionCount}> {ingredients.length}</Text>
        </Text>
        {ingredients.length === 0 ? (
          <Text style={s.emptyNote}>See cooking steps for ingredient details.</Text>
        ) : (
          <>
            {visibleIngredients.map((ing, i) => (
              <View key={i} style={s.ingRow}>
                {ing.quantity ? <Text style={s.ingQty}>{ing.quantity}</Text> : null}
                <Text style={s.ingName}>{ing.name}</Text>
                <Pressable onPress={() => toggleHide(ing.name)} style={s.hideBtn}>
                  <Text style={s.hideBtnText}>—</Text>
                </Pressable>
              </View>
            ))}

            {hiddenIngredients.size > 0 && (
              <>
                <Pressable style={s.hiddenToggle} onPress={() => setShowHidden(v => !v)}>
                  <Text style={s.hiddenToggleText}>
                    {showHidden ? '▲' : '▼'} {hiddenIngredients.size} hidden
                  </Text>
                </Pressable>
                {showHidden && hiddenList.map((ing, i) => (
                  <View key={i} style={[s.ingRow, s.ingRowHidden]}>
                    {ing.quantity ? <Text style={s.ingQty}>{ing.quantity}</Text> : null}
                    <Text style={[s.ingName, { opacity: 0.4 }]}>{ing.name}</Text>
                    <Pressable onPress={() => toggleHide(ing.name)} style={s.hideBtn}>
                      <Text style={[s.hideBtnText, { color: '#4ade80' }]}>↩</Text>
                    </Pressable>
                  </View>
                ))}
              </>
            )}
          </>
        )}
      </View>

      {/* Instructions */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>
          👨‍🍳 How to Cook
          {instructions.length > 0 && <Text style={s.sectionCount}> {instructions.length} steps</Text>}
        </Text>
        {instructions.length === 0 ? (
          <Text style={s.emptyNote}>No separate cooking steps — follow the ingredient order above.</Text>
        ) : (
          instructions.map((step, i) => (
            <View key={i} style={s.stepRow}>
              <View style={s.stepNum}>
                <Text style={s.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={s.stepText}>{step}</Text>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 40 }} />

      <EditModal
        recipe={recipe}
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        onSaved={() => setEditVisible(false)}
      />
    </ScrollView>
  )
}

const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: '#0f0f0f' },
  container:     { paddingBottom: 40 },
  center:        { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f0f' },
  heroImage:     { width: '100%', height: 240, resizeMode: 'cover' },
  heroPlaceholder: { width: '100%', height: 200, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' },
  titleRow:      { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: 16, paddingBottom: 8 },
  recipeName:    { flex: 1, color: '#fff', fontSize: 24, fontWeight: '700', marginRight: 12 },
  healthBadge:   { borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  healthText:    { fontSize: 12, fontWeight: '600' },
  metaRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16, paddingBottom: 8 },
  metaChip:      { backgroundColor: '#1e1e1e', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  metaChipText:  { color: '#aaa', fontSize: 12 },
  diffRow:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, gap: 2 },
  star:          { fontSize: 18, color: '#333' },
  starOn:        { color: '#f59e0b' },
  diffLabel:     { color: '#888', fontSize: 13, marginLeft: 6 },
  actionRow:     { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingBottom: 16 },
  editBtn:       { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: 'rgba(100,108,255,0.1)', borderWidth: 1, borderColor: 'rgba(100,108,255,0.3)', borderRadius: 10, paddingVertical: 10 },
  editBtnText:   { color: '#646cff', fontWeight: '600' },
  deleteBtn:     { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', borderRadius: 10, paddingVertical: 10 },
  deleteBtnText: { color: '#ef4444', fontWeight: '600' },
  section:       { marginHorizontal: 16, marginBottom: 24, backgroundColor: '#1a1a1a', borderRadius: 16, padding: 16 },
  sectionTitle:  { color: '#fff', fontSize: 17, fontWeight: '700', marginBottom: 14 },
  sectionCount:  { color: '#888', fontSize: 14, fontWeight: '400' },
  emptyNote:     { color: '#555', fontSize: 14, fontStyle: 'italic' },
  ingRow:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#252525', gap: 8 },
  ingRowHidden:  { opacity: 0.5 },
  ingQty:        { color: '#888', fontSize: 14, minWidth: 50 },
  ingName:       { flex: 1, color: '#ddd', fontSize: 15 },
  hideBtn:       { padding: 4 },
  hideBtnText:   { color: '#888', fontSize: 18 },
  hiddenToggle:  { paddingTop: 10 },
  hiddenToggleText: { color: '#646cff', fontSize: 13 },
  stepRow:       { flexDirection: 'row', gap: 12, marginBottom: 14, alignItems: 'flex-start' },
  stepNum:       { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(100,108,255,0.15)', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  stepNumText:   { color: '#646cff', fontSize: 13, fontWeight: '700' },
  stepText:      { flex: 1, color: '#ccc', fontSize: 15, lineHeight: 22 },
  emptyText:     { color: '#888', fontSize: 16 },
})
