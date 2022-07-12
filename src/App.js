import React, { useState, useEffect, useContext, useMemo } from 'react'
import { View } from 'react-native'
import { Provider } from 'react-redux'
import store from 'utils/store'
import { imageAssets } from 'theme/images'
import { fontAssets } from 'theme/fonts'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import 'utils/ignore'

import { ThemeProvider } from 'react-native-elements'
import FlashMessage from 'react-native-flash-message'
import WelcomeScreen from './screens/WelcomeScreen'
import SigninScreen from './screens/SigninScreen'
import SignupScreen from './screens/SignupScreen'

import { AuthProvider, AuthContext } from './providers/AuthProvider'
import { CustomApolloProvider } from './providers/CustomApolloProvider'
import Drawer from './routes/navigation/drawer/Drawer.js'

import theme from '../assets/styles/theme'

const MyAppNavigation = () => {
  const Stack = createNativeStackNavigator()
  const { token } = useContext(AuthContext)

  const isAuthenticated = useMemo(
    () => {
      console.log('token', token)
      return token === null
    }, [token],
  )
  console.log('token', token)

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name='Welcome screen' component={WelcomeScreen} />
            <Stack.Screen name='Sign in' component={SigninScreen} />
            <Stack.Screen name='Sign up' component={SignupScreen} />
          </>
        ) : (
          <Stack.Screen
            name='Root'
            component={Drawer}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const App = () => {
  // state
  const [didLoad, setDidLoad] = useState(false)

  // handler
  const handleLoadAssets = async () => {
    // assets preloading
    await Promise.all([...imageAssets, ...fontAssets])
    setDidLoad(true)
  }

  // lifecycle
  useEffect(() => {
    handleLoadAssets()
  }, [])

  // rendering
  if (!didLoad) return <View />
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <CustomApolloProvider>
          <AuthProvider>
            <MyAppNavigation />
          </AuthProvider>
        </CustomApolloProvider>
        <FlashMessage />
      </Provider>
    </ThemeProvider>
  )
}

export default App
