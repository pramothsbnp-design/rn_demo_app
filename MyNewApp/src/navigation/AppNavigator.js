import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import DrawerNavigator from './DrawerNavigator';
import AuthNavigator from './AuthNavigator';
import CompleteProfileScreen from '../screens/CompleteProfileScreen';

const Stack = createNativeStackNavigator();

/**
 * Check if user profile is complete
 */
const checkProfileCompletion = async (userId) => {
  try {
    const docRef = doc(db, 'userProfiles', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return false; // Profile doesn't exist
    }
    
    const profileData = docSnap.data();
    
    // Check if all required fields are filled
    const requiredFields = [
      'fullName',
      'batchName',
      'domicile',
      'category',
      'expectedScoreFrom',
      'expectedScoreTo'
    ];
    
    for (const field of requiredFields) {
      if (!profileData[field] || profileData[field] === '') {
        return false; // Required field is missing
      }
    }
    
    return true; // Profile is complete
  } catch (error) {
    console.error('Error checking profile completion:', error);
    return false; // Assume incomplete on error
  }
};

/**
 * Stack navigator for users with incomplete profiles
 */
const OnboardingNavigator = () => {
  const { theme } = useTheme();

  // Custom header for profile completion onboarding
  const OnboardingHeader = ({ navigation }) => (
    <LinearGradient
      colors={['#fe6e32', '#fb8926']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ paddingTop: 60, paddingBottom: 10, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Complete Profile</Text>
      </View>
    </LinearGradient>
  );

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CompleteProfileOnboarding" 
        component={CompleteProfileScreen}
        options={({ navigation }) => ({
          animationEnabled: false,
          headerShown: true,
          header: () => <OnboardingHeader navigation={navigation} />,
        })}
      />
      <Stack.Screen 
        name="HomeAfterProfile" 
        component={DrawerNavigator}
        options={{ animationEnabled: true, headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  // Theme context for navigation styling
  const { theme } = useTheme();
  // Current authenticated user
  const [user, setUser] = useState(null);
  // Loading state for auth check
  const [loading, setLoading] = useState(true);
  // Profile completion state
  const [profileComplete, setProfileComplete] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Check if profile is complete
        const isComplete = await checkProfileCompletion(user.uid);
        setProfileComplete(isComplete);
      } else {
        setProfileComplete(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Show nothing while checking auth state
  if (loading) {
    return null; // Or a loading screen
  }

  // Main render function
  return (
    <>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <NavigationContainer theme={theme}>
        {user ? (
          profileComplete ? <DrawerNavigator /> : <OnboardingNavigator />
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
    </>
  );
};

export default AppNavigator;
