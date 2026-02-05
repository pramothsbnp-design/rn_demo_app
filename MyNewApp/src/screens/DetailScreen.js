import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useStyles } from '../context/ThemeContext';
import Loader from '../components/Loader';

export default function DetailScreen({ route, navigation }) {
  // Theme context for styling
  const { theme, toggleTheme } = useTheme();
  const globalStyles = useStyles();
  // College data passed from navigation
  const { college } = route.params;
  // Loading state for initial render delay
  const [loading, setLoading] = useState(true);

  // Simulate loading delay for better UX
  useEffect(() => {
    // Wait 1 second after navigation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Local styles for college details
  const localStyles = StyleSheet.create({
    collegeHeader: {
      padding: 16,
      backgroundColor: '#fe6e32',
    },
    collegeName: {
      fontSize: 28,
      fontWeight: '700',
      color: '#FFF',
      marginBottom: 8,
    },
    collegeLocation: {
      fontSize: 16,
      color: '#FFF',
      opacity: 0.9,
    },
    typeTag: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      marginTop: 8,
    },
    typeTagText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFF',
    },
    section: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.dark ? '#3A4B5C' : '#E0E6ED',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 12,
    },
    courseInfo: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 4,
    },
    courseLabel: {
      fontSize: 12,
      color: theme.dark ? '#A8B5C2' : '#666',
      marginBottom: 4,
    },
    cutoffGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    cutoffCard: {
      flex: 1,
      marginHorizontal: 4,
      padding: 12,
      backgroundColor: theme.dark ? '#2A3F52' : '#F5F7FA',
      borderRadius: 8,
      alignItems: 'center',
    },
    cutoffLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.dark ? '#A8B5C2' : '#666',
      marginBottom: 8,
    },
    cutoffValue: {
      fontSize: 18,
      fontWeight: '700',
      color: '#fe6e32',
    },
  });

  // Show loader while simulating loading
  if (loading) {
    return <Loader />;
  }

  // Main render function
  return (
    <ScrollView style={globalStyles.container}>
      {/* College Header */}
      <View style={localStyles.collegeHeader}>
        <Text style={localStyles.collegeName}>{college.name}</Text>
        <Text style={localStyles.collegeLocation}>{college.state}</Text>
        <View style={localStyles.typeTag}>
          <Text style={[localStyles.typeTagText, { backgroundColor: college.type === 'GOVT' ? '#27AE60' : '#E67E22' }]}>
            {college.type}
          </Text>
        </View>
      </View>

      {/* Course Information */}
      <View style={localStyles.section}>
        <Text style={localStyles.sectionTitle}>Course Information</Text>
        <Text style={localStyles.courseLabel}>Course</Text>
        <Text style={localStyles.courseInfo}>{college.course}</Text>
      </View>

      {/* Cutoff Information */}
      {college.cutoff && (
        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>Cutoff Scores</Text>
          <View style={localStyles.cutoffGrid}>
            <View style={localStyles.cutoffCard}>
              <Text style={localStyles.cutoffLabel}>General</Text>
              <Text style={localStyles.cutoffValue}>{college.cutoff.general || 'N/A'}</Text>
            </View>
            <View style={localStyles.cutoffCard}>
              <Text style={localStyles.cutoffLabel}>OBC</Text>
              <Text style={localStyles.cutoffValue}>{college.cutoff.obc || 'N/A'}</Text>
            </View>
            <View style={localStyles.cutoffCard}>
              <Text style={localStyles.cutoffLabel}>SC</Text>
              <Text style={localStyles.cutoffValue}>{college.cutoff.sc || 'N/A'}</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}



