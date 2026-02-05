import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  /**
   * Handle Firebase Signup
   */
  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert('Success', 'Account created successfully');
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    }
  };

  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.dark ? '#2d3e50' : '#fbfdfe']}
      style={styles.container}
    >
      
        {/* Title */}
        <Text style={styles.brand}>Create Account</Text>
        <Text style={styles.subtitle}>
          Join 1.5M+ NEET aspirants using NEETWise
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
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Create a strong password"
            placeholderTextColor={theme.colors.softtext}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={theme.colors.softtext}
            />
          </TouchableOpacity>
        </View>

        {/* Sign Up */}
        <TouchableOpacity activeOpacity={0.8} onPress={handleSignup}>
            <LinearGradient
            colors={[theme.colors.primary, theme.colors.notification || '#FF5F00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.signUpBtn}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Already have account */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginHighlight}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      
    </LinearGradient>
  );
};

export default SignupScreen;

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: 16,
  },

  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 26,
    padding: 24,
  },

  brand: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
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

  signUpBtn: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  signUpText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  loginLink: {
    alignItems: 'center',
  },

  loginText: {
    color: theme.colors.text,
    fontSize: 13,
  },

  loginHighlight: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});
