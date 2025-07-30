import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { useMutation, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

// Custom Icon Components
const TaskIcon = ({ size = 24, color = "#ffffff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const CheckIcon = ({ size = 16, color = "#22c55e" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M5 13l4 4L19 7" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const LightningIcon = ({ size = 16, color = "#3b82f6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M13 10V3L4 14h7v7l9-11h-7z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const LockIcon = ({ size = 16, color = "#8b5cf6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const ArrowRightIcon = ({ size = 20, color = "#ffffff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M13 7l5 5m0 0l-5 5m5-5H6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const BackIcon = ({ size = 20, color = "#6b7280" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M15 19l-7-7 7-7" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

export default function LoginScreen({ onLogin }) {
  const [showBranding, setShowBranding] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const [login, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [signup, { loading: signupLoading }] = useMutation(SIGNUP_MUTATION);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const mutation = isLogin ? login : signup;
      const { data } = await mutation({
        variables: { email, password }
      });

      const result = isLogin ? data.login : data.signup;
      await AsyncStorage.setItem('token', result.token);
      onLogin();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleContinue = () => {
    setShowBranding(false);
  };

  const handleBackToBranding = () => {
    setShowBranding(true);
  };

  if (showBranding) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <LinearGradient
          colors={['#f8fafc', '#ffffff', '#dbeafe']}
          style={styles.gradient}
        >
          <ScrollView contentContainerStyle={styles.brandingContainer}>
            {/* Animated Logo */}
            <Animated.View 
              style={[
                styles.logoContainer, 
                { 
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <LinearGradient
                colors={['#3b82f6', '#8b5cf6']}
                style={styles.logoGradient}
              >
                <TaskIcon size={48} color="#ffffff" />
              </LinearGradient>
            </Animated.View>

            {/* App Name */}
            <Animated.View style={[styles.titleContainer, { opacity: fadeAnim }]}>
              <Text style={styles.appTitle}>TaskFlow</Text>
            </Animated.View>

            {/* Description */}
            <Animated.View style={[styles.descriptionContainer, { opacity: fadeAnim }]}>
              <Text style={styles.description}>
                Your intelligent task management companion. Organize, prioritize, and accomplish your goals with ease.
              </Text>
            </Animated.View>

            {/* Features */}
            <Animated.View style={[styles.featuresContainer, { opacity: fadeAnim }]}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#dcfce7' }]}>
                  <CheckIcon size={16} color="#22c55e" />
                </View>
                <Text style={styles.featureText}>Simple & intuitive task management</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#dbeafe' }]}>
                  <LightningIcon size={16} color="#3b82f6" />
                </View>
                <Text style={styles.featureText}>Real-time progress tracking</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#e9d5ff' }]}>
                  <LockIcon size={16} color="#8b5cf6" />
                </View>
                <Text style={styles.featureText}>Secure cloud synchronization</Text>
              </View>
            </Animated.View>

            {/* Trust Indicators */}
            <Animated.View style={[styles.trustContainer, { opacity: fadeAnim }]}>
              <View style={styles.trustItem}>
                <Text style={[styles.trustNumber, { color: '#3b82f6' }]}>10k+</Text>
                <Text style={styles.trustLabel}>Happy Users</Text>
              </View>
              <View style={styles.trustItem}>
                <Text style={[styles.trustNumber, { color: '#22c55e' }]}>99.9%</Text>
                <Text style={styles.trustLabel}>Uptime</Text>
              </View>
              <View style={styles.trustItem}>
                <Text style={[styles.trustNumber, { color: '#8b5cf6' }]}>Free</Text>
                <Text style={styles.trustLabel}>Forever</Text>
              </View>
            </Animated.View>

            {/* Get Started Button */}
            <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
              <TouchableOpacity onPress={handleContinue}>
                <LinearGradient
                  colors={['#3b82f6', '#8b5cf6']}
                  style={styles.primaryButton}
                >
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                  <ArrowRightIcon size={20} color="#ffffff" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Footer */}
            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
              <Text style={styles.footerText}>
                © 2025 TaskFlow. Built for productivity enthusiasts.
              </Text>
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <LinearGradient
        colors={['#f8fafc', '#ffffff', '#dbeafe']}
        style={styles.gradient}
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBackToBranding}>
          <View style={styles.backButtonContainer}>
            <BackIcon size={16} color="#6b7280" />
            <Text style={styles.backButtonText}>Back to app info</Text>
          </View>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.loginContainer}>
          {/* Compact Branding */}
          <View style={styles.compactBrandingContainer}>
            <LinearGradient
              colors={['#3b82f6', '#8b5cf6']}
              style={styles.compactLogo}
            >
              <TaskIcon size={24} color="#ffffff" />
            </LinearGradient>
            <Text style={styles.compactTitle}>
              {isLogin ? 'Welcome Back!' : 'Join TaskFlow'}
            </Text>
            <Text style={styles.compactSubtitle}>
              {isLogin ? 'Sign in to access your workspace' : 'Create your account to get started'}
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loginLoading || signupLoading}
              style={[styles.submitButtonContainer, (loginLoading || signupLoading) && styles.disabledButton]}
            >
              <LinearGradient
                colors={['#3b82f6', '#8b5cf6']}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>
                  {(loginLoading || signupLoading) ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                </Text>
                {!(loginLoading || signupLoading) && <ArrowRightIcon size={20} color="#ffffff" />}
              </LinearGradient>
            </TouchableOpacity>

            {/* Toggle Auth Mode */}
            <TouchableOpacity
              style={styles.toggleContainer}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.toggleText}>
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Links */}
          <View style={styles.loginFooter}>
            <Text style={styles.footerLinkText}>Privacy Policy • Terms of Service</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  brandingContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoGradient: {
    width: 96,
    height: 96,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  titleContainer: {
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  descriptionContainer: {
    marginBottom: 40,
  },
  description: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 320,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#6b7280',
    flex: 1,
  },
  trustContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  trustItem: {
    alignItems: 'center',
  },
  trustNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  trustLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    zIndex: 10,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginLeft: 6,
  },
  loginContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },
  compactBrandingContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  compactLogo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  compactTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  compactSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  submitButtonContainer: {
    marginBottom: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  toggleContainer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  toggleText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  loginFooter: {
    alignItems: 'center',
  },
  footerLinkText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});