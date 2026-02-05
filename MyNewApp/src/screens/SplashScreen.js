import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const SplashScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    // PanResponder to detect mostly-horizontal swipes (right -> left)
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (_, gs) => {
                const { dx, dy } = gs;
                return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
            },
            onPanResponderRelease: (_, gs) => {
                const { dx, vx } = gs;
                if (dx <= -50 || vx < -0.3) {
                    navigation.replace('Login');
                }
            },
        })
    ).current;

    useEffect(() => {
        // Optional auto navigation
        // const timer = setTimeout(() => {
        //     navigation.replace('Login');
        // }, 3000);
        // return () => clearTimeout(timer);
    }, [navigation]);

    const handleGetStarted = () => {
        navigation.replace('Login');
    };

    const FeatureBox = ({ icon, title }) => (
        <View style={styles.featureBox}>
            <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.iconContainer}
            >
                <MaterialIcons
                    name={icon}
                    size={26}
                    color="#fff"
                />
            </LinearGradient>

            <Text style={styles.featureTitle}>{title}</Text>
        </View>
    );

    return (
        <LinearGradient
            colors={[theme.colors.background, theme.dark ? '#1f2a36' : '#fdfdfd']}
            style={styles.container}
        >
            <ScrollView
                {...panResponder.panHandlers}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.secondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.logoBox}
                    >
                        <MaterialIcons
                            name="add-circle"
                            size={80}
                            color="#fff"
                        />
                    </LinearGradient>

                    <Text style={styles.appTitle}>NEETWise</Text>
                    <Text style={styles.tagline}>
                        Predict Your Future.{'\n'}Plan Your Admission.
                    </Text>
                </View>

                {/* Features */}
                <View style={styles.featuresContainer}>
                    <FeatureBox
                        icon="task-alt"
                        title="Accurate college predictions based on your NEET rank"
                    />

                    <FeatureBox
                        icon="attach-money"
                        title="3+ years of historical cutoff data & trends"
                    />

                    <FeatureBox
                        icon="people"
                        title="Smart filters for quota, category & domicile"
                    />

                    <View style={styles.dotsContainer}>
                        <View style={styles.activeDot} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>

                    <Text style={styles.bottomText}>
                        For 1.5M+ NEET Aspirants across India
                    </Text>
                </View>

                {/* Button */}
                {/* <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleGetStarted}>
                        <LinearGradient
                            colors={[theme.colors.primary, theme.colors.secondary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.getStartedButton}
                        >
                            <Text style={styles.buttonText}>Get Started</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View> */}
            </ScrollView>
        </LinearGradient>
    );
};

const createStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        scrollContent: {
            flexGrow: 1,
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 40,
        },
        logoSection: {
            alignItems: 'center',
            marginTop: 70,
            marginBottom: 30,
        },
        logoBox: {
            width: 120,
            height: 120,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
        },
        appTitle: {
            fontSize: 36,
            fontWeight: '700',
            color: theme.colors.text,
            marginBottom: 10,
        },
        tagline: {
            fontSize: 16,
            color: theme.dark ? '#cfd8dc' : '#666',
            textAlign: 'center',
            lineHeight: 24,
        },
        featuresContainer: {
            marginVertical: 20,
        },
        featureBox: {
            flexDirection: 'row',
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            borderWidth: 0.5,
            borderRadius: 12,
            padding: 15,
            marginBottom: 15,
            alignItems: 'center',
        },
        iconContainer: {
            width: 50,
            height: 50,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        featureTitle: {
            fontSize: 15,
            fontWeight: '400',
            color: theme.colors.text,
            flex: 1,
        },
        dotsContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
            gap: 8,
        },
        dot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.colors.primary,
            opacity: 0.3,
        },
        activeDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.colors.primary,
        },
        bottomText: {
            fontSize: 12,
            color: theme.colors.text,
            textAlign: 'center',
            marginTop: 50,
        },
        buttonContainer: {
            marginTop: 20,
            marginBottom: 20,
        },
        getStartedButton: {
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
        },
    });

export default SplashScreen;
