import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from "./src/Auth/AuthContext";
import AppTabs from './src/navigation/AppTab';
import { CartProvider } from './src/context/CartContext';
import { initDatabase } from './src/database/data';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    initDatabase()
      .then(() => console.log('✅ Database ready'))
      .catch(err => console.error('❌ Database error:', err));
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      <AppContent />
    </>
  );
}

function AppContent() {
  return (
    <View style={styles.container}>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <AppTabs />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    marginTop: 0,
  },
});

export default App;