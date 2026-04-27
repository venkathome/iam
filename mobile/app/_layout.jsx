import { Stack } from 'expo-router'
import { ApolloProvider } from '@apollo/client/react'
import { Provider as ReduxProvider } from 'react-redux'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import { client } from '../src/apollo/client'
import { store } from '../src/store'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ReduxProvider store={store}>
        <ApolloProvider client={client}>
          <Stack
            screenOptions={{
              headerStyle:      { backgroundColor: '#1a1a1a' },
              headerTintColor:  '#ffffff',
              headerTitleStyle: { fontWeight: '600' },
              contentStyle:     { backgroundColor: '#0f0f0f' },
            }}
          >
            <Stack.Screen name="index"        options={{ title: 'IAM', headerShown: false }} />
            <Stack.Screen name="recipes/index" options={{ title: 'Recipes' }} />
            <Stack.Screen name="recipes/[id]"  options={{ title: 'Recipe' }} />
            <Stack.Screen name="family-tree/index"       options={{ title: 'Family Tree' }} />
            <Stack.Screen name="family-tree/[personId]"  options={{ title: 'Person' }} />
            <Stack.Screen name="diary"         options={{ title: 'Diary', headerShown: false }} />
            <Stack.Screen name="learning/index"          options={{ title: 'Learning' }} />
            <Stack.Screen name="learning/[profileId]/index"      options={{ title: 'Learning' }} />
            <Stack.Screen name="learning/[profileId]/spellings"  options={{ title: 'Spellings' }} />
            <Stack.Screen name="learning/[profileId]/tamil/index"        options={{ title: 'Tamil' }} />
            <Stack.Screen name="learning/[profileId]/tamil/thirukkural"  options={{ title: 'Thirukkural' }} />
          </Stack>
        </ApolloProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
})
