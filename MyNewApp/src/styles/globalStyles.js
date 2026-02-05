/**
 * Global styles and theme configuration for the entire application
 * This file contains all shared styling, spacing, typography, and colors
 */

import { StyleSheet } from 'react-native';

// Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// Border radius system
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  circle: 50,
};

// Font sizes
export const fontSizes = {
  xs: 10,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  huge: 32,
};

// Font weights
export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

// Shadow styles
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

/**
 * Create theme-aware global styles
 * @param {Object} theme - Theme object containing colors and fonts
 * @returns {Object} StyleSheet with all global styles
 */
export const createGlobalStyles = (theme) => {
  return StyleSheet.create({
    // Container styles
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    safeContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: spacing.lg,
    },

    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },

    screenContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: spacing.lg,
    },

    // Typography styles
    heading1: {
      fontSize: fontSizes.xxxl,
      fontWeight: fontWeights.bold,
      color: theme.colors.text,
      marginBottom: spacing.lg,
    },

    heading2: {
      fontSize: fontSizes.xxl,
      fontWeight: fontWeights.semibold,
      color: theme.colors.text,
      marginBottom: spacing.md,
    },

    heading3: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.semibold,
      color: theme.colors.text,
      marginBottom: spacing.md,
    },

    subtitle: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.medium,
      color: theme.colors.text,
      marginBottom: spacing.sm,
    },

    body: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.regular,
      color: theme.colors.text,
      lineHeight: 22,
    },

    bodySecondary: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.regular,
      color: theme.colors.text,
      opacity: 0.7,
    },

    caption: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.regular,
      color: theme.colors.text,
      opacity: 0.6,
    },

    // Button styles
    button: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
      ...shadows.small,
    },

    primaryButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
      ...shadows.small,
    },

    secondaryButton: {
      backgroundColor: theme.colors.card,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    outlineButton: {
      backgroundColor: 'transparent',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.primary,
      minHeight: 48,
    },

    buttonText: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.semibold,
      color: '#FFFFFF',
    },

    secondaryButtonText: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.semibold,
      color: theme.colors.text,
    },

    // Card styles
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...shadows.small,
    },

    cardElevated: {
      backgroundColor: theme.colors.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      ...shadows.medium,
    },

    // Input styles
    input: {
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: fontSizes.base,
      color: theme.colors.text,
      minHeight: 44,
    },

    inputFocused: {
      backgroundColor: theme.colors.card,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: fontSizes.base,
      color: theme.colors.text,
      minHeight: 44,
    },

    inputLabel: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: theme.colors.text,
      marginBottom: spacing.xs,
    },

    // Layout utilities
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    column: {
      flexDirection: 'column',
    },

    // Spacing utilities
    flexGrow: {
      flex: 1,
    },

    flex: {
      flex: 1,
    },

    flex2: {
      flex: 2,
    },

    flex3: {
      flex: 3,
    },

    // Divider
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: spacing.md,
    },

    thinDivider: {
      height: 0.5,
      backgroundColor: theme.colors.border,
      marginVertical: spacing.sm,
    },

    // Badge/Tag styles
    badge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.circle,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    badgeText: {
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.bold,
      color: '#FFFFFF',
    },

    // Notification/Error styles
    errorText: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.regular,
      color: theme.colors.notification,
      marginTop: spacing.xs,
    },

    successText: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.regular,
      color: '#34C759',
      marginTop: spacing.xs,
    },

    // Modal styles
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },

    modalContent: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxl,
    },

    // Header styles
    header: {
      backgroundColor: theme.colors.card,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    // Product card styles (Legacy)
    productCard: {
      backgroundColor: theme.colors.card,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      marginHorizontal: spacing.sm,
      marginVertical: spacing.sm,
      ...shadows.small,
    },

    productImage: {
      width: '100%',
      height: 180,
      backgroundColor: theme.colors.border,
    },

    productInfo: {
      padding: spacing.md,
    },

    productTitle: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.semibold,
      color: theme.colors.text,
      marginBottom: spacing.xs,
    },

    productPrice: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: theme.colors.text,
      marginBottom: spacing.sm,
    },

    // College card styles
    collegeCard: {
      backgroundColor: theme.colors.card,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      marginHorizontal: spacing.sm,
      marginVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderWidth: 1,
      borderColor: theme.dark ? '#3A4B5C' : '#E0E6ED',
      ...shadows.small,
    },

    collegeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },

    collegeName: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: theme.colors.text,
      marginBottom: spacing.xs,
      flex: 1,
    },

    collegeState: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.regular,
      color: theme.dark ? '#A8B5C2' : '#666',
    },

    typeTag: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },

    typeTagText: {
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.bold,
      color: '#FFF',
    },

    cutoffContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    cutoffItem: {
      flex: 1,
      marginHorizontal: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      backgroundColor: theme.dark ? '#2A3F52' : '#F5F7FA',
      borderRadius: borderRadius.md,
      alignItems: 'center',
    },

    cutoffLabel: {
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      color: theme.dark ? '#A8B5C2' : '#666',
      marginBottom: spacing.xs,
    },

    cutoffValue: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: '#fe6e32',
    },

    // Loader styles
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },

    // Tab bar styles
    tabBar: {
      backgroundColor: theme.colors.card,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },

    // List styles
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    listItemText: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.regular,
      color: theme.colors.text,
      flex: 1,
    },

    // Link styles
    link: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      color: theme.colors.primary,
    },
  });
};

/**
 * Color palette constants
 */
export const colors = {
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#0A84FF',
};
