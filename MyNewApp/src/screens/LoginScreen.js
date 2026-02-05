import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth, GOOGLE_SIGN_IN_KEY, GOOGLE_SIGN_IN_IOS_KEY, GOOGLE_SIGN_IN_ANDROID_KEY } from '../firebase';
import { useTheme } from '../context/ThemeContext';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get the correct client ID based on platform
  const getClientId = () => {
    if (Platform.OS === 'ios') {
      return GOOGLE_SIGN_IN_IOS_KEY;
    } else if (Platform.OS === 'android') {
      return GOOGLE_SIGN_IN_ANDROID_KEY;
    }
    return GOOGLE_SIGN_IN_KEY; // Web fallback
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: getClientId(),
    iosClientId: GOOGLE_SIGN_IN_IOS_KEY,
    androidClientId: GOOGLE_SIGN_IN_ANDROID_KEY,
    webClientId: GOOGLE_SIGN_IN_KEY,
    redirectUrl: Platform.select({
      web: 'https://auth.expo.io/',
      default: `${Constants.expoConfig?.scheme}://redirect`,
    }),
    scopes: ['profile', 'email'],
    usePKCE: true,
  });

  // Handle Google Sign-In response
  useEffect(() => {
    // console.log('Google Auth Response:', response);
    if (response?.type === 'success') {
      // console.log('Google Sign-In successful, processing response...');
      handleGoogleSignInResponse(response);
    } else if (response?.type === 'error') {
      // console.log('Google Sign-In error:', response.params);
      Alert.alert('Error', 'Google Sign-In failed: ' + response.params?.error);
      setLoading(false);
    }
  }, [response]);

  useEffect(() => {
    // console.log('Google Auth Request ready:', !!request);
  }, [request]);

  /**
   * Handle Firebase Email/Password Login
   */
  const handleLogin = async () => {
    // console.log('handleLogin called with email:', email);
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      // console.log('Attempting Firebase email/password login...');
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      // console.log('Email login successful, user:', result.user?.uid);
      // Navigation will be handled automatically by AppNavigator when auth state changes
    } catch (error) {
      console.error('Email login error:', error);
      Alert.alert('Login Failed', error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Google Sign-In Response
   */
  const handleGoogleSignInResponse = async (result) => {
    // console.log('handleGoogleSignInResponse called');
    // console.log('Platform:', Platform.OS);
    // console.log('Result params:', result?.params);
    // console.log('Result authentication:', result?.authentication);
    
    // Try to get id_token from authentication or params
    let idToken = result?.params?.id_token || result?.authentication?.idToken;
    // console.log('ID Token found:', !!idToken);
    
    // Try access token as fallback
    let accessToken = result?.params?.access_token || result?.authentication?.accessToken;
    // console.log('Access Token found:', !!accessToken);
    
    if (!idToken && !accessToken) {
      console.error('No id_token or access_token in response');
      Alert.alert('Error', 'Failed to get authentication token from Google');
      setLoading(false);
      return;
    }

    try {
      // If we have idToken, use it directly
      if (idToken) {
        // console.log('Creating credential with id_token...');
        const credential = GoogleAuthProvider.credential(idToken);
        const authResult = await signInWithCredential(auth, credential);
        // console.log('Google Sign-In successful with id_token, user:', authResult.user?.uid);
        setLoading(false);
        return;
      }

      // Fallback: use access token
      if (accessToken) {
        // console.log('Using access token for authentication...');
        const credential = GoogleAuthProvider.credential(null, accessToken);
        const authResult = await signInWithCredential(auth, credential);
        // console.log('Google Sign-In successful with access_token, user:', authResult.user?.uid);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Google Sign-In Firebase error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      Alert.alert('Google Sign-In Error', error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initiate Google Sign-In
   */
  const handleGoogleSignIn = async () => {
    // console.log('handleGoogleSignIn called, request ready:', !!request);
    
    if (!request) {
      console.error('Google auth request not ready yet');
      Alert.alert('Error', 'Google Sign-In is not ready. Please try again.');
      return;
    }

    setLoading(true);
    try {
      // console.log('Calling promptAsync()...');
      const result = await promptAsync();
      // console.log('promptAsync result:', result);
      // Response is handled by useEffect hook
    } catch (error) {
      console.error('Google Sign-In promptAsync error:', error);
      setLoading(false);
      Alert.alert('Error', error.message || 'Failed to initiate Google Sign-In');
    }
  };

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const SocialButton = ({ icon, onPress, disabled }) => {
    const logoMap = {
      'logo-google': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/500px-Google_%22G%22_logo.svg.png',
      'logo-facebook': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png',
      'logo-apple': null,
    };

    if (icon === 'logo-apple') {
      return (
        <TouchableOpacity style={styles.socialBtn} onPress={onPress} disabled={disabled}>
          <Ionicons name={icon} size={22} color={theme.colors.text} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.socialBtn} onPress={onPress} disabled={disabled}>
        <Image 
          source={{ uri: logoMap[icon] }} 
          style={{ width: 24, height: 24, resizeMode: 'contain' }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.dark ? '#2d3e50' : '#fbfdfe']}
      style={styles.container}
    >
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      
        {/* Title */}
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.brand}>NEETWise</Text>
        <Text style={styles.subtitle}>
          Sign in or create an account to continue
        </Text>

        {/* Email */}
        <Text style={styles.label}>Email ID</Text>
        <TextInput
          placeholder="you@example.com"
          placeholderTextColor={theme.colors.softtext}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor={theme.colors.softtext}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
  <Ionicons
    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
    size={18}
    color={theme.colors.softtext}
  />
</TouchableOpacity>

        </View>

        {/* Sign In */}
        <TouchableOpacity activeOpacity={0.8} onPress={handleLogin} disabled={loading}>
            <LinearGradient
            colors={[theme.colors.primary, theme.colors.notification || '#FF5F00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.signInBtn, loading && styles.disabledBtn]}
          >
            <Text style={styles.signInText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Create Account */}
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation.navigate('Signup')}
          disabled={loading}
        >
          <Text style={styles.createText}>Create Account</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        {/* Social Buttons (UI Only for now) */}
        <View style={styles.socialRow}>
          <SocialButton icon="logo-google" onPress={handleGoogleSignIn} disabled={loading} />
          <SocialButton icon="logo-facebook" disabled={loading} />
          <SocialButton icon="logo-apple" disabled={loading} />
        </View>
      
    </LinearGradient>
  );
};

  

export default LoginScreen;

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: 16,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.dark ? 'rgba(14,26,36,0.8)' : 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 26,
    padding: 24,
  },

  title: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: '700',
  },

  brand: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 4,
  },

  subtitle: {
    color: theme.colors.text,
    fontSize: 13,
    marginBottom: 28,
  },

  label: {
    color: theme.colors.text,
    fontSize: 12,
    marginBottom: 6,
  },

  input: {
    height: 48,
    borderRadius: 10,
    backgroundColor: theme.dark ? '#34495e' : '#ffffff',
    paddingHorizontal: 14,
    color: theme.colors.text,
    marginBottom: 18,
    borderColor: theme.colors.border,
    borderWidth: 0.5,
  },

  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 10,
    backgroundColor: theme.dark ? '#34495e' : '#ffffff',
    paddingHorizontal: 14,
    marginBottom: 24,
    borderColor: theme.colors.border,
    borderWidth: 0.5,
  },

  passwordInput: {
    flex: 1,
    color: theme.colors.text,
  },

  signInBtn: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  disabledBtn: {
    opacity: 0.7,
  },

  signInText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  createBtn: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  createText: {
    color: theme.colors.text,
    fontWeight: '600',
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.dark ? '#4c5e70' : '#e6ecf0',
  },

  orText: {
    color: theme.colors.border,
    marginHorizontal: 10,
    fontSize: 12,
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  socialBtn: {
    width: 110,
    height: 52,
    borderRadius: 12,
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
