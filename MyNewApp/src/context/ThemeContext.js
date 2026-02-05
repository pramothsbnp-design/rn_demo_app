import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { Appearance } from 'react-native';
import { createGlobalStyles } from '../styles/globalStyles';

// Create Theme Context
const ThemeContext = createContext(null);

// Light theme configuration
export const lightTheme = {
  dark: false,
  colors: {
    primary: '#f36e32',
    secondary: '#fb8926',
    background: '#fbfdfe',
    card: '#ffffff',
    text: '#000000',
    softtext: '#6f6e6e',
    border: '#C6C6C8',
    notification: '#f36e32',
  },
    gradients: {
    main: ['#f36e32', '#fb8926'], // 👈 main app gradient
    reverse: ['#fb8926', '#f36e32'], // 👈 reverse gradient
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '900',
    },
  },
};

// Dark theme configuration
export const darkTheme = {
  dark: true,
  colors: {
    primary: '#f36e32',
    secondary: '#fb8926',
    background: '#2d3e50',
    card: '#34495e',
    text: '#FFFFFF',
    softtext: '#d4d3d3',
    border: '#5c5c5c',
    notification: '#f36e32',
  },
    gradients: {
    main: ['#f36e32', '#fb8926'], // 👈 main app gradient
    reverse: ['#fb8926', '#f36e32'], // 👈 reverse gradient
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '900',
    },
  },
};

/**
 * Custom hook to access theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

/**
 * Custom hook to access global styles
 */
export const useStyles = () => {
  const { styles } = useTheme();
  return styles;
};

/**
 * ThemeProvider component
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);

  // Memoize the global styles to avoid unnecessary recalculations
  const styles = useMemo(() => createGlobalStyles(theme), [theme]);

  // Set initial theme + listen for system theme changes
  useEffect(() => {
    const applyTheme = scheme => {
      setTheme(scheme === 'dark' ? darkTheme : lightTheme);
    };

    applyTheme(Appearance.getColorScheme());

    const subscription = Appearance.addChangeListener(
      ({ colorScheme }) => applyTheme(colorScheme)
    );

    return () => subscription.remove();
  }, []);

  /**
   * Manually toggle theme
   */
  const toggleTheme = () => {
    setTheme(prev =>
      prev.dark ? lightTheme : darkTheme
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, styles, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
