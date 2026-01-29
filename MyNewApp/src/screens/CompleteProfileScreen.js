import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { db, auth } from '../firebase';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

const CompleteProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [fullName, setFullName] = useState('');
  const [batchName, setBatchName] = useState('');
  const [scoresFrom, setScoresFrom] = useState('');
  const [scoresTo, setScoresTo] = useState('');
  const [isNEETRepeater, setIsNEETRepeater] = useState(false);
  const [domicile, setDomicile] = useState('');
  const [category, setCategory] = useState('');
  const [notifyAdditions, setNotifyAdditions] = useState(true);
  const [notifyUpdates, setNotifyUpdates] = useState(true);
  const [notifyAdmission, setNotifyAdmission] = useState(false);
  const [preferredDistance, setPreferredDistance] = useState('Any Distance');
  const [currentStep, setCurrentStep] = useState(1);
  const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);
  const [domicileDropdownOpen, setDomicileDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [distanceDropdownOpen, setDistanceDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);

  const batchOptions = ['Alpha', 'Beta', 'Gamma', 'Omega', 'Achievers', 'Toppers'];
  const domicileOptions = ['Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Telangana', 'Maharashtra', 'Delhi', 'Other'];
  const categoryOptions = ['General', 'OBC', 'SC', 'ST'];
  const distanceOptions = ['Any Distance', 'Within 100 km', 'Within 200 km', 'Within 500 km', 'Within State'];

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          setIsFetchingProfile(false);
          return;
        }

        const docRef = doc(db, 'userProfiles', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const profileData = docSnap.data();
          
          // Populate form with fetched data
          setFullName(profileData.fullName || '');
          setBatchName(profileData.batchName || '');
          setScoresFrom(profileData.expectedScoreFrom || '');
          setScoresTo(profileData.expectedScoreTo || '');
          setIsNEETRepeater(profileData.isNEETRepeater || false);
          setDomicile(profileData.domicile || '');
          setCategory(profileData.category || '');
          setNotifyAdditions(profileData.notifyAdditions !== undefined ? profileData.notifyAdditions : true);
          setNotifyUpdates(profileData.notifyUpdates !== undefined ? profileData.notifyUpdates : true);
          setNotifyAdmission(profileData.notifyAdmission || false);
          setPreferredDistance(profileData.preferredDistance || 'Any Distance');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsFetchingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleContinue = () => {
    if (currentStep === 1) {
      if (!fullName || !batchName) {
        Alert.alert('Validation', 'Please fill in all fields');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!domicile || !category) {
        Alert.alert('Validation', 'Please select both domicile and category');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleComplete = () => {
    saveProfileToFirebase();
  };

  const saveProfileToFirebase = async () => {
    try {
      setIsLoading(true);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const profileData = {
        userId: currentUser.uid,
        email: currentUser.email,
        fullName: fullName,
        batchName: batchName,
        expectedScoreFrom: scoresFrom,
        expectedScoreTo: scoresTo,
        isNEETRepeater: isNEETRepeater,
        domicile: domicile,
        category: category,
        notifyAdditions: notifyAdditions,
        notifyUpdates: notifyUpdates,
        notifyAdmission: notifyAdmission,
        preferredDistance: preferredDistance,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to Firestore
      await setDoc(doc(db, 'userProfiles', currentUser.uid), profileData);

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Complete Your Profile';
      case 2:
        return 'Domicile & Category';
      case 3:
        return 'Your Preferences';
      default:
        return '';
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return 'This helps us personalize your college predictions.';
      case 2:
        return 'Select your domicile and category for better predictions.';
      case 3:
        return 'Customize your college search experience.';
      default:
        return '';
    }
  };

  // Create theme-aware styles
  const themedStyles = StyleSheet.create({
    ...styles,
    flex: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: theme.dark ? '#36475a' : '#F5F7FA',
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingVertical: 24,
    },
    stepHeader: {
      marginBottom: 16,
    },
    stepTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 8,
    },
    stepSubtitle: {
      fontSize: 14,
      fontWeight: '400',
      color: theme.dark ? '#A8B5C2' : '#666',
      lineHeight: 20,
    },
    progressContainer: {
      height: 4,
      backgroundColor: theme.dark ? '#3A4B5C' : '#E0E6ED',
      borderRadius: 2,
      marginBottom: 12,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
    },
    stepCounter: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.dark ? '#7A8B9B' : '#999',
      marginBottom: 24,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 10,
    },
    input: {
      backgroundColor: theme.dark ? '#2A3F52' : '#FFF',
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 14,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.dark ? '#3A4B5C' : '#E0E6ED',
    },
    dropdownButton: {
      backgroundColor: theme.dark ? '#2A3F52' : '#FFF',
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 14,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.dark ? '#3A4B5C' : '#E0E6ED',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dropdownButtonText: {
      fontSize: 14,
      color: theme.colors.text,
      flex: 1,
    },
    dropdownBox: {
      backgroundColor: theme.dark ? '#2A3F52' : '#FFF',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.dark ? '#3A4B5C' : '#E0E6ED',
      marginTop: 8,
      overflow: 'hidden',
      maxHeight: 200,
    },
    dropdownOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.dark ? '#1E2D3A' : '#E0E6ED',
    },
    dropdownOptionText: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.dark ? '#A8B5C2' : '#666',
      flex: 1,
    },
    dropdownOptionActive: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    switchRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 8,
    },
    switchLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.dark ? '#7A8B9B' : '#999',
      minWidth: 30,
      textAlign: 'center',
    },
    switchLabelActive: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    profileInfoBox: {
      backgroundColor: theme.dark ? '#2A3F52' : '#FFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      padding: 16,
      marginBottom: 24,
    },
    profileInfoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    profileInfoTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginLeft: 8,
    },
    profileInfoLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.dark ? '#A8B5C2' : '#666',
    },
    profileInfoValue: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.text,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: theme.dark ? '#3A4B5C' : '#E0E6ED',
      backgroundColor: theme.dark ? '#2A3F52' : '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    checkboxChecked: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    checkboxLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.colors.text,
      flex: 1,
    },
    continueBtn: {
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    continueBtnText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFF',
    },
    backText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.primary,
      textAlign: 'center',
      paddingVertical: 12,
    },
    skipText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.primary,
      textAlign: 'center',
      paddingVertical: 12,
    },
  });

  return (
    <LinearGradient
      colors={theme.dark ? ['#36475a', '#36475a'] : ['#F5F7FA', '#F5F7FA']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={themedStyles.flex}
       >
        {isFetchingProfile ? (
          <View style={[themedStyles.flex, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[themedStyles.label, { marginTop: 16, textAlign: 'center' }]}>Loading your profile...</Text>
          </View>
        ) : (
        <ScrollView
          contentContainerStyle={themedStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Step Header */}
          <View style={themedStyles.stepHeader}>
            <Text style={themedStyles.stepTitle}>{getStepTitle()}</Text>
            <Text style={themedStyles.stepSubtitle}>{getStepSubtitle()}</Text>
          </View>

          {/* Progress Bar */}
          <View style={themedStyles.progressContainer}>
            <View
              style={[
                themedStyles.progressBar,
                { width: `${(currentStep / 3) * 100}%` },
              ]}
            />
          </View>

          {/* Step Counter */}
          <Text style={themedStyles.stepCounter}>Step {currentStep} of 3</Text>

          {currentStep === 1 ? (
            <View style={styles.formContainer}>
              {/* Full Name */}
              <View style={styles.formGroup}>
                <Text style={themedStyles.label}>Full Name (Optional)</Text>
                <TextInput
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.dark ? '#8FA1B2' : '#999'}
                  style={themedStyles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>

              {/* Batch Name */}
              <View style={styles.formGroup}>
                <Text style={themedStyles.label}>Batch Name</Text>
                <TouchableOpacity
                  style={themedStyles.dropdownButton}
                  onPress={() => setBatchDropdownOpen(!batchDropdownOpen)}
                >
                  <Text style={[styles.dropdownButtonText, !batchName && { color: theme.dark ? '#8FA1B2' : '#999' }, { color: theme.colors.text }]}>
                    {batchName || 'Select Batch'}
                  </Text>
                  <Ionicons
                    name={batchDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.dark ? '#8FA1B2' : '#999'}
                  />
                </TouchableOpacity>

                {batchDropdownOpen && (
                  <View style={themedStyles.dropdownBox}>
                    <ScrollView scrollEnabled={true} nestedScrollEnabled={true}>
                      {batchOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[styles.dropdownOption, { borderBottomColor: theme.dark ? '#1E2D3A' : '#E0E6ED' }]}
                          onPress={() => {
                            setBatchName(option);
                            setBatchDropdownOpen(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.dropdownOptionText,
                              { color: theme.dark ? '#A8B5C2' : '#666' },
                              batchName === option && styles.dropdownOptionActive,
                            ]}
                          >
                            {option}
                          </Text>
                          {batchName === option && (
                            <Ionicons name="checkmark" size={18} color={theme.colors.primary} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Score Range */}
              <View style={styles.formGroup}>
                <Text style={themedStyles.label}>Expected Score Range</Text>
                <View style={styles.scoreRangeContainer}>
                  <TextInput
                    placeholder="From"
                    placeholderTextColor={theme.dark ? '#8FA1B2' : '#999'}
                    style={[themedStyles.input, styles.scoreInput]}
                    keyboardType="number-pad"
                    maxLength={3}
                    value={scoresFrom}
                    onChangeText={setScoresFrom}
                  />
                  <Text style={[styles.toText, { color: theme.dark ? '#A8B5C2' : '#666' }]}>To</Text>
                  <TextInput
                    placeholder="To"
                    placeholderTextColor={theme.dark ? '#8FA1B2' : '#999'}
                    style={[themedStyles.input, styles.scoreInput]}
                    keyboardType="number-pad"
                    maxLength={3}
                    value={scoresTo}
                    onChangeText={setScoresTo}
                  />
                </View>
                <Text style={[styles.scoreHint, { color: theme.dark ? '#7A8B9B' : '#999' }]}>Enter score between 0-720</Text>
              </View>

              {/* NEET Repeater Toggle */}
              <View style={styles.formGroup}>
                <Text style={themedStyles.label}>Are you a NEET Repeater?</Text>
                <View style={themedStyles.switchRowContainer}>
                  <Text style={[styles.switchLabel, !isNEETRepeater && styles.switchLabelActive, { color: !isNEETRepeater ? theme.colors.primary : theme.dark ? '#7A8B9B' : '#999' }]}>
                    No
                  </Text>
                  <Switch
                    value={isNEETRepeater}
                    onValueChange={setIsNEETRepeater}
                    trackColor={{ false: theme.dark ? '#3A4B5C' : '#E0E6ED', true: theme.colors.primary }}
                    thumbColor={isNEETRepeater ? '#FFF' : theme.dark ? '#A8B5C2' : '#CCC'}
                    style={styles.switch}
                  />
                  <Text style={[styles.switchLabel, isNEETRepeater && styles.switchLabelActive, { color: isNEETRepeater ? theme.colors.primary : theme.dark ? '#7A8B9B' : '#999' }]}>
                    Yes
                  </Text>
                </View>
              </View>
            </View>
          ) : currentStep === 2 ? (
            <View style={styles.formContainer}>
              {/* Domicile Selection */}
              <View style={styles.formGroup}>
                <Text style={themedStyles.label}>Select Domicile</Text>
                <TouchableOpacity
                  style={themedStyles.dropdownButton}
                  onPress={() => setDomicileDropdownOpen(!domicileDropdownOpen)}
                >
                  <Text style={[themedStyles.dropdownButtonText, !domicile && { color: theme.dark ? '#8FA1B2' : '#999' }]}>
                    {domicile || 'Choose your domicile'}
                  </Text>
                  <Ionicons
                    name={domicileDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.dark ? '#8FA1B2' : '#999'}
                  />
                </TouchableOpacity>

                {domicileDropdownOpen && (
                  <View style={themedStyles.dropdownBox}>
                    <ScrollView scrollEnabled={true} nestedScrollEnabled={true}>
                      {domicileOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[themedStyles.dropdownOption, domicile === option && { backgroundColor: theme.dark ? '#1E2D3A' : '#F5F7FA' }]}
                          onPress={() => {
                            setDomicile(option);
                            setDomicileDropdownOpen(false);
                          }}
                        >
                          <Text
                            style={[
                              themedStyles.dropdownOptionText,
                              domicile === option && themedStyles.dropdownOptionActive,
                            ]}
                          >
                            {option}
                          </Text>
                          {domicile === option && (
                            <Ionicons name="checkmark" size={18} color={theme.colors.primary} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Category Selection */}
              <View style={styles.formGroup}>
                <Text style={themedStyles.label}>Category</Text>
                <TouchableOpacity
                  style={themedStyles.dropdownButton}
                  onPress={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                >
                  <Text style={[themedStyles.dropdownButtonText, !category && { color: theme.dark ? '#8FA1B2' : '#999' }]}>
                    {category || 'Select Category'}
                  </Text>
                  <Ionicons
                    name={categoryDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.dark ? '#8FA1B2' : '#999'}
                  />
                </TouchableOpacity>

                {categoryDropdownOpen && (
                  <View style={themedStyles.dropdownBox}>
                    <ScrollView scrollEnabled={true} nestedScrollEnabled={true}>
                      {categoryOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[themedStyles.dropdownOption, category === option && { backgroundColor: theme.dark ? '#1E2D3A' : '#F5F7FA' }]}
                          onPress={() => {
                            setCategory(option);
                            setCategoryDropdownOpen(false);
                          }}
                        >
                          <Text
                            style={[
                              themedStyles.dropdownOptionText,
                              category === option && themedStyles.dropdownOptionActive,
                            ]}
                          >
                            {option}
                          </Text>
                          {category === option && (
                            <Ionicons name="checkmark" size={18} color={theme.colors.primary} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.formContainer}>
              {/* Your Profile Info Box */}
              <View style={themedStyles.profileInfoBox}>
                <View style={themedStyles.profileInfoHeader}>
                  <Ionicons name="person-circle" size={24} color={theme.colors.primary} />
                  <Text style={themedStyles.profileInfoTitle}>Your Profile</Text>
                </View>
                <View style={styles.profileInfoContent}>
                  <View style={styles.profileInfoRow}>
                    <Text style={themedStyles.profileInfoLabel}>Expected Score:</Text>
                    <Text style={themedStyles.profileInfoValue}>{scoresFrom || '0'} - {scoresTo || '0'}</Text>
                  </View>
                  <View style={styles.profileInfoRow}>
                    <Text style={themedStyles.profileInfoLabel}>Domicile:</Text>
                    <Text style={themedStyles.profileInfoValue}>{domicile || 'N/A'}</Text>
                  </View>
                  <View style={styles.profileInfoRow}>
                    <Text style={themedStyles.profileInfoLabel}>Category:</Text>
                    <Text style={themedStyles.profileInfoValue}>{category || 'N/A'}</Text>
                  </View>
                </View>
              </View>

              {/* Notification Preferences */}
              <View style={styles.formGroup}>
                <Text style={themedStyles.label}>Notification Preferences</Text>
                
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setNotifyAdditions(!notifyAdditions)}
                >
                  <View style={[themedStyles.checkbox, notifyAdditions && themedStyles.checkboxChecked]}>
                    {notifyAdditions && <Ionicons name="checkmark" size={16} color="#FFF" />}
                  </View>
                  <Text style={themedStyles.checkboxLabel}>Notify me about new college additions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setNotifyUpdates(!notifyUpdates)}
                >
                  <View style={[themedStyles.checkbox, notifyUpdates && themedStyles.checkboxChecked]}>
                    {notifyUpdates && <Ionicons name="checkmark" size={16} color="#FFF" />}
                  </View>
                  <Text style={themedStyles.checkboxLabel}>Send cutoff updates and alerts</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setNotifyAdmission(!notifyAdmission)}
                >
                  <View style={[themedStyles.checkbox, notifyAdmission && themedStyles.checkboxChecked]}>
                    {notifyAdmission && <Ionicons name="checkmark" size={16} color="#FFF" />}
                  </View>
                  <Text style={themedStyles.checkboxLabel}>Admission counseling tips</Text>
                </TouchableOpacity>
              </View>

              {/* Preferred College Distance */}
              <View style={styles.formGroup}>
                <Text style={themedStyles.label}>Preferred College Distance</Text>
                <TouchableOpacity
                  style={themedStyles.dropdownButton}
                  onPress={() => setDistanceDropdownOpen(!distanceDropdownOpen)}
                >
                  <Text style={[themedStyles.dropdownButtonText, !preferredDistance && { color: theme.dark ? '#8FA1B2' : '#999' }]}>
                    {preferredDistance || 'Select Distance'}
                  </Text>
                  <Ionicons
                    name={distanceDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.dark ? '#8FA1B2' : '#999'}
                  />
                </TouchableOpacity>

                {distanceDropdownOpen && (
                  <View style={themedStyles.dropdownBox}>
                    <ScrollView scrollEnabled={true} nestedScrollEnabled={true}>
                      {distanceOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[themedStyles.dropdownOption, preferredDistance === option && { backgroundColor: theme.dark ? '#1E2D3A' : '#F5F7FA' }]}
                          onPress={() => {
                            setPreferredDistance(option);
                            setDistanceDropdownOpen(false);
                          }}
                        >
                          <Text
                            style={[
                              themedStyles.dropdownOptionText,
                              preferredDistance === option && themedStyles.dropdownOptionActive,
                            ]}
                          >
                            {option}
                          </Text>
                          {preferredDistance === option && (
                            <Ionicons name="checkmark" size={18} color={theme.colors.primary} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setCurrentStep(currentStep - 1)}
                style={styles.buttonSpacing}
              >
                <Text style={themedStyles.backText}>Back</Text>
              </TouchableOpacity>
            )}

            {currentStep < 3 ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleContinue}
                style={styles.buttonSpacing}
              >
                <LinearGradient
                  colors={theme.dark ? ['#FF8A00', '#FF5F00'] : ['#FF9E24', '#FF8A00']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={themedStyles.continueBtn}
                >
                  <Text style={themedStyles.continueBtnText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleComplete}
                  style={[styles.buttonSpacing, { opacity: isLoading ? 0.6 : 1 }]}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={theme.dark ? ['#FF8A00', '#FF5F00'] : ['#FF9E24', '#FF8A00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={themedStyles.continueBtn}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <Text style={themedStyles.continueBtnText}>View My College Predictions</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Home')}>
                  <Text style={themedStyles.skipText}>Skip for now</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  stepHeader: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#A8B5C2',
    lineHeight: 20,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#3A4B5C',
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF8A00',
    borderRadius: 2,
  },
  stepCounter: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7A8B9B',
    marginBottom: 24,
  },
  formContainer: {
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E0E8F0',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#2A3F52',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#3A4B5C',
  },
  pickerContainer: {
    backgroundColor: '#2A3F52',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3A4B5C',
  },
  picker: {
    height: 50,
    color: '#FFF',
  },
  scoreRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreInput: {
    flex: 1,
  },
  toText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A8B5C2',
  },
  scoreHint: {
    fontSize: 12,
    fontWeight: '400',
    color: '#7A8B9B',
    marginTop: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2A3F52',
    borderWidth: 1,
    borderColor: '#3A4B5C',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#1E2D3A',
    borderColor: '#FF8A00',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A8B5C2',
  },
  toggleTextActive: {
    color: '#FF8A00',
  },
  profileInfoBox: {
    backgroundColor: '#2A3F52',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF8A00',
    padding: 16,
    marginBottom: 24,
  },
  profileInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E0E8F0',
    marginLeft: 8,
  },
  profileInfoContent: {
    gap: 8,
  },
  profileInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A8B5C2',
  },
  profileInfoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E0E8F0',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#3A4B5C',
    backgroundColor: '#2A3F52',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#FF8A00',
    borderColor: '#FF8A00',
  },
  checkboxLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E0E8F0',
    flex: 1,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  buttonSpacing: {
    marginBottom: 16,
  },
  continueBtn: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  backText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF8A00',
    textAlign: 'center',
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF8A00',
    textAlign: 'center',
    paddingVertical: 12,
  },
  dropdownButton: {
    backgroundColor: '#2A3F52',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#3A4B5C',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#FFF',
    flex: 1,
  },
  dropdownBox: {
    backgroundColor: '#2A3F52',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3A4B5C',
    marginTop: 8,
    overflow: 'hidden',
    maxHeight: 200,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2D3A',
  },
  dropdownOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#A8B5C2',
    flex: 1,
  },
  dropdownOptionActive: {
    color: '#FF8A00',
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A3F52',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#3A4B5C',
    gap: 8,
  },
  switchRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  switch: {
    marginHorizontal: 0,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#7A8B9B',
    minWidth: 30,
    textAlign: 'center',
  },
  switchLabelActive: {
    color: '#FF8A00',
    fontWeight: '600',
  },
});

export default CompleteProfileScreen;
