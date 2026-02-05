
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme, useStyles } from '../context/ThemeContext';
import { fetchColleges, subscribeToNewColleges, fetchUserProfile, filterCollegesByProfile } from '../api/collegesApi';
import NotificationBanner from '../components/NotificationBanner';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { designSystem } from '../styles/themeUtils';
import { LinearGradient } from 'expo-linear-gradient';

const { spacing } = designSystem;

const HomeScreen = ({ navigation }) => {
  // Theme context for light/dark mode
  const { theme, toggleTheme } = useTheme();
  const globalStyles = useStyles();
  // Array of colleges fetched from Firebase
  const [colleges, setColleges] = useState([]);
  // User profile data (contains score range and category)
  const [userProfile, setUserProfile] = useState(null);
  // Selected type filter: 'All', 'GOVT', or 'PRIVATE'
  const [selectedType, setSelectedType] = useState('All');
  // Visibility state for filter modal
  const [modalVisible, setModalVisible] = useState(false);
  // Last document reference for pagination
  const [lastDoc, setLastDoc] = useState(null);
  // Loading state for data fetching
  const [loading, setLoading] = useState(false);
  // Flag to indicate if more colleges are available for pagination
  const [hasMore, setHasMore] = useState(true);
  // Notification state
  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: 'success',
    collegeName: '',
    collegeState: '',
  });

  // Logout function
  /**
   * Handles user logout by signing out from Firebase Auth
   * @async
   */
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  // Fetch colleges
  /**
   * Fetches initial set of colleges from Firestore
   * @async
   */
  const loadColleges = async () => {
    setLoading(true);
    try {
      const data = await fetchColleges(15, null, selectedType);
      // Filter colleges based on user profile (score range and category)
      const filteredColleges = filterCollegesByProfile(data.colleges, userProfile);
      setColleges(filteredColleges);
      setLastDoc(data.lastDoc);
      setHasMore(data.colleges.length === 15);
    } catch (error) {
      console.log('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load more colleges
  /**
   * Loads additional colleges for pagination with a delay for better UX
   * @async
   */
  const loadMoreColleges = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const data = await fetchColleges(15, lastDoc, selectedType);
      // Filter the new colleges based on user profile
      const filteredNewColleges = filterCollegesByProfile(data.colleges, userProfile);
      // Add a 0.5 second delay before showing new items
      setTimeout(() => {
        setColleges(prev => {
          const combined = [...prev, ...filteredNewColleges];
          const unique = Array.from(
          new Map(combined.map(item => [item.docId, item])).values()
        );
  return unique;
});
        setLastDoc(data.lastDoc);
        setHasMore(data.colleges.length === 15);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.log('Error fetching more colleges:', error);
      setLoading(false);
    }
  };

  // Render single college
  /**
   * Renders a single college item in the FlatList
   * @param {Object} item - College object with name, state, course, etc.
   * @returns {JSX.Element} Touchable college card
   */
  
  // Calculate match percentage based on user profile and college cutoff
  const calculateMatchPercentage = (college) => {
    if (!userProfile || !college.cutoff) return null;
    
    const { expectedScoreFrom, expectedScoreTo, category } = userProfile;
    const categoryKey = category ? category.toLowerCase() : 'general';
    const cutoffScore = college.cutoff[categoryKey] || college.cutoff.general;
    
    if (!cutoffScore || !expectedScoreFrom || !expectedScoreTo) return null;
    
    const scoreFrom = parseInt(expectedScoreFrom, 10);
    const scoreTo = parseInt(expectedScoreTo, 10);
    const cutoff = parseInt(cutoffScore, 10);
    
    if (isNaN(scoreFrom) || isNaN(scoreTo) || isNaN(cutoff)) return null;
    
    const scoreRange = scoreTo - scoreFrom;
    if (scoreRange === 0) return 100; // Perfect match if single score
    
    // Calculate how well the cutoff fits in the score range
    // 100% if cutoff is at center, lower if at edges
    const centerScore = (scoreFrom + scoreTo) / 2;
    const distance = Math.abs(cutoff - centerScore);
    const maxDistance = scoreRange / 2;
    
    const matchPercentage = Math.max(0, 100 - (distance / maxDistance) * 100);
    return Math.round(matchPercentage);
  };

  const renderItem = ({ item }) => {
    const matchPercentage = calculateMatchPercentage(item);
    
    return (
      <TouchableOpacity
        style={globalStyles.collegeCard}
        onPress={() => navigation.navigate('Detail', { college: item })}
      >
        <View style={globalStyles.collegeHeader}>
          <View style={{ flex: 1 }}>
            <Text style={globalStyles.collegeName}>{item.name}</Text>
            <Text style={globalStyles.collegeState}>{item.state}, {item.course}</Text>
          </View>
          <View style={[globalStyles.typeTag, { backgroundColor: item.type === 'GOVT' ? '#27AE60' : '#E67E22' }]}>
            <Text style={globalStyles.typeTagText}>{item.type}</Text>
          </View>
        </View>
        {item.cutoff && (
          <View style={globalStyles.cutoffContainer}>
            <View style={globalStyles.cutoffItem}>
              <Text style={globalStyles.cutoffLabel}>General</Text>
              <Text style={globalStyles.cutoffValue}>{item.cutoff.general || 'N/A'}</Text>
            </View>
            <View style={globalStyles.cutoffItem}>
              <Text style={globalStyles.cutoffLabel}>OBC</Text>
              <Text style={globalStyles.cutoffValue}>{item.cutoff.obc || 'N/A'}</Text>
            </View>
            <View style={globalStyles.cutoffItem}>
              <Text style={globalStyles.cutoffLabel}>SC</Text>
              <Text style={globalStyles.cutoffValue}>{item.cutoff.sc || 'N/A'}</Text>
            </View>
          </View>
        )}
        {matchPercentage !== null && (
          <View style={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#27AE60' }}>
              {matchPercentage}% Match
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Load colleges on component mount
  useEffect(() => {
    // Fetch user profile first, then load colleges
    const initializeScreen = async () => {
      const profile = await fetchUserProfile();
      setUserProfile(profile);
      // Load colleges will use the profile state in the next effect
    };

    initializeScreen();

    // Set up real-time listener for new colleges
    const unsubscribe = subscribeToNewColleges((newCollege) => {
      // Filter the new college based on user profile
      const filteredCollege = filterCollegesByProfile([newCollege], userProfile);
      
      if (filteredCollege.length > 0) {
        // Show in-app notification when a new eligible college is added
        setNotification({
          visible: true,
          message: '✨ New College Added!',
          type: 'success',
          collegeName: newCollege.name,
          collegeState: newCollege.state,
        });

        // Auto-add to the colleges list
        setColleges(prev => {
          const exists = prev.find(c => c.docId === newCollege.docId);
          if (!exists) {
            return [newCollege, ...prev];
          }
          return prev;
        });
      }
    });

    // Cleanup: unsubscribe from listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Load colleges when user profile or type filter changes
  useEffect(() => {
    if (userProfile !== null) {
      // Profile has been fetched (even if null), load colleges
      loadColleges();
    }
  }, [userProfile, selectedType]);

  // Refetch user profile whenever HomeScreen comes into focus
  // This ensures that updated profile data is used to filter colleges
  useFocusEffect(
    React.useCallback(() => {
      const refreshProfile = async () => {
        const updatedProfile = await fetchUserProfile();
        setUserProfile(updatedProfile);
      };
      
      refreshProfile();
    }, [])
  );

  // Styles for the HomeScreen component
  const localStyles = StyleSheet.create({
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
      marginHorizontal: spacing.lg,
    },
    filterSection: {
      flex: 1,
      marginHorizontal: spacing.sm,
    },
    filterLabel: {
      ...globalStyles.inputLabel,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    checkboxText: {
      marginLeft: spacing.md,
      color: theme.colors.text,
      fontSize: 14,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      backgroundColor: theme.dark ? '#2A3F52' : '#FFF',
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.dark ? '#3A4B5C' : '#E0E6ED',
      paddingHorizontal: spacing.md,
    },
    footerTab: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      flex: 1,
    },
    footerLabel: {
      fontSize: 12,
      fontWeight: '600',
      marginTop: spacing.xs,
      color: theme.dark ? '#A8B5C2' : '#666',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      minHeight: 500,
    },
    emptyIconWrapper: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 3,
      borderStyle: 'dashed',
      borderColor: theme.dark ? '#4A5B6C' : '#DDD',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    emptyIcon: {
      fontSize: 50,
      color: '#FF8A00',
    },
    emptyTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.dark ? '#A8B5C2' : '#666',
      marginBottom: spacing.lg,
      textAlign: 'center',
      lineHeight: 20,
      maxWidth: 280,
    },
    suggestionBox: {
      backgroundColor: theme.dark ? '#34495e' : '#f4f8fd',
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.lg,
      width: '100%',
    },
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    suggestionTitle: {
      fontSize: 13,
      fontWeight: '800',
      fontStyle:'bold',
      color: theme.dark ? '#A8B5C2' : '#666',
      marginLeft: spacing.md,
      flex: 1,
      lineHeight: 18,
    },
    suggestionItemLast: {
      marginBottom: 0,
    },
    suggestionText: {
      fontSize: 13,
      color: theme.dark ? '#A8B5C2' : '#666',
      marginLeft: spacing.md,
      flex: 1,
      lineHeight: 18,
    },
    updateButton: {
      paddingVertical: 14,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      alignItems: 'center',
      width: '100%',
    },
    updateButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  // Main render function
  return (
    <View style={[globalStyles.container, { paddingBottom: 0 }]}>
      {/* In-app notification banner */}
      {notification.visible && (
        <NotificationBanner
          message={notification.message}
          type={notification.type}
          duration={3000}
          onDismiss={() =>
            setNotification({ ...notification, visible: false })
          }
          productTitle={notification.productTitle}
          productPrice={notification.productPrice}
        />
      )}
      {/* Header section with title and action buttons */}
      <View style={globalStyles.header}>
        <Text style={globalStyles.heading2}></Text>
        <View style={globalStyles.row}>
          <TouchableOpacity 
            style={{
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              backgroundColor: '#fe6e32',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="filter" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Product list with infinite scroll */}
      <FlatList
        data={colleges}
        keyExtractor={item => item.docId}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreColleges}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingHorizontal: spacing.md, flexGrow: 1 }}
        ListFooterComponent={loading ? <View style={globalStyles.loaderContainer}><Text style={globalStyles.body}>Loading...</Text></View> : null}
        ListEmptyComponent={
          !loading ? (
            <View style={localStyles.emptyContainer}>
              <View style={localStyles.emptyIconWrapper}>
                <Text style={localStyles.emptyIcon}>✓</Text>
              </View>
              <Text style={localStyles.emptyTitle}>No Colleges Found</Text>
              <Text style={localStyles.emptySubtitle}>
                We couldn't find any colleges matching your current filters.
              </Text>
              
              <View style={localStyles.suggestionBox}>
                <View style={localStyles.suggestionItem}>
                  <Text style={localStyles.suggestionTitle}>Try these options:</Text>
                </View> 
                <View style={localStyles.suggestionItem}>
                  <Ionicons name="timer" size={18} color="#FF8A00" />
                  <Text style={localStyles.suggestionText}>Adjust college type filter</Text>
                </View>
                <View style={localStyles.suggestionItem}>
                  <Ionicons name="layers" size={18} color="#FF8A00" />
                  <Text style={localStyles.suggestionText}>Browse all colleges</Text>
                </View>
                <View style={[localStyles.suggestionItem, localStyles.suggestionItemLast]}>
                  <Ionicons name="filter" size={18} color="#FF8A00" />
                  <Text style={localStyles.suggestionText}>Clear all filters</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={localStyles.updateButton}
                onPress={() => navigation.navigate('CompleteProfile')}
              >
                <LinearGradient
                  colors={['#fe6e32', '#fb8926']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={localStyles.updateButton}
                >
                <Text style={localStyles.updateButtonText}>Update My Profile</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
      {/* Footer Navigation */}
      <View style={localStyles.footer}>
        <TouchableOpacity
          style={localStyles.footerTab}
          onPress={() => {}}
        >
          <Ionicons name="home" size={24} color='#f36e32' />
          <Text style={[localStyles.footerLabel, { color: "#f36e32"}]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={localStyles.footerTab}
          onPress={() => navigation.navigate('Search') || console.log('Search')}
        >
          <Ionicons name="search" size={24} color={theme.dark ? '#A8B5C2' : '#999'} />
          <Text style={[localStyles.footerLabel, { color: theme.dark ? '#A8B5C2' : '#999' }]}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={localStyles.footerTab}
          onPress={() => navigation.navigate('Saved') || console.log('Saved')}
        >
          <Ionicons name="bookmark" size={24} color={theme.dark ? '#A8B5C2' : '#999'} />
          <Text style={[localStyles.footerLabel, { color: theme.dark ? '#A8B5C2' : '#999' }]}>Saved</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={localStyles.footerTab}
          onPress={() => navigation.navigate('CompleteProfile')}
        >
          <Ionicons name="person" size={24} color={theme.dark ? '#A8B5C2' : '#999'} />
          <Text style={[localStyles.footerLabel, { color: theme.dark ? '#A8B5C2' : '#999' }]}>Profile</Text>
        </TouchableOpacity>
      </View>
      {/* Filter modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={globalStyles.modal}>
          <View style={globalStyles.modalContent}>
            <Text style={globalStyles.heading2}>Filters</Text>
            <View style={localStyles.filterContainer}>
              <View style={localStyles.filterSection}>
                <Text style={localStyles.filterLabel}>College Type:</Text>
                {['All', 'GOVT', 'PRIVATE'].map(type => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => {
                      setSelectedType(type);
                      setModalVisible(false);
                    }}
                    style={localStyles.checkboxContainer}
                  >
                    <Ionicons
                      name={selectedType === type ? 'checkmark-circle' : 'radio-button-off'}
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={localStyles.checkboxText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity style={globalStyles.primaryButton} onPress={() => setModalVisible(false)}>
              <Text style={globalStyles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
