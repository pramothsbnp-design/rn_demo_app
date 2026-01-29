import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Modal, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import CompleteProfileScreen from '../screens/CompleteProfileScreen';

// Create stack navigator instance
const Stack = createNativeStackNavigator();

/**
 * Stack navigator for main app screens
 */
const DrawerNavigator = () => {
  const { theme, toggleTheme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  // Header right component with three icons
  const headerRight = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
      
      <TouchableOpacity style={{ padding: 8 }} onPress={toggleTheme}>
        <Ionicons name={theme.dark ? 'sunny' : 'moon'} size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={{ padding: 8 }} onPress={handleLogout}>
        <Ionicons name="log-out" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  // Custom header with gradient
  const CustomHeader = () => (
    <LinearGradient
      colors={['#fe6e32', '#fb8926']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ paddingTop: 60, paddingBottom: 10, paddingHorizontal: 15 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Home</Text>
        {headerRight()}
      </View>
    </LinearGradient>
  );

  // Custom header for Detail screen with back button
  const DetailHeader = ({ navigation }) => (
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
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Product Details</Text>
      </View>
      {headerRight()}
    </LinearGradient>
  );

  // Main render function
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <CustomHeader />,
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: 'white',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Home',
          header: () => <CustomHeader />,
        }}
      />
      <Stack.Screen 
        name="Detail" 
        component={DetailScreen}
        options={({ navigation }) => ({
          title: 'Product Details',
          header: () => <DetailHeader navigation={navigation} />,
        })}
      />
      <Stack.Screen 
        name="CompleteProfile" 
        component={CompleteProfileScreen}
        options={({ navigation }) => ({
          title: 'Complete Profile',
          header: () => (
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
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Your Profile</Text>
              </View>
              {headerRight()}
            </LinearGradient>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default DrawerNavigator;