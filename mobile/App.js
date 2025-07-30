import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ActivityIndicator, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


import LoginScreen from './components/LoginScreen';
import TodoScreen from './components/TodoScreen';

const Stack = createStackNavigator();

const httpLink = createHttpLink({
  uri: 'http://192.168.0.3:4000/graphql', // ✅ Correct for mobile on same Wi-Fi
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    // Enhanced caching for better performance
    typePolicies: {
      Todo: {
        fields: {
          createdAt: {
            read(existing) {
              return existing ? new Date(existing) : null;
            }
          }
        }
      }
    }
  }),
  // Default error handling
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Loading Screen Component
const LoadingScreen = () => (
  <View style={{ flex: 1 }}>
    <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
    <LinearGradient
      colors={['#f8fafc', '#ffffff', '#dbeafe']}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
      }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <View style={{ marginTop: 16 }}>
        <Text style={{
  fontSize: 16,
  color: '#6b7280',
  fontWeight: '500',
}}>
  Loading TaskFlow...
</Text>
        </View>
      </View>
    </LinearGradient>
  </View>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      // Add a small delay to show the loading screen
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            cardStyle: { backgroundColor: '#f8fafc' },
            // Add smooth transitions
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                  opacity: current.progress.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0.5, 1],
                  }),
                },
              };
            },
          }}
        >
          {!isAuthenticated ? (
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Todo">
              {(props) => <TodoScreen {...props} onLogout={handleLogout} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}