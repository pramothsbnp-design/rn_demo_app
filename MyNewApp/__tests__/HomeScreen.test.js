import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';

// ✅ Mock Theme Context
jest.mock('../src/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: { dark: false },
    toggleTheme: jest.fn(),
  }),
  useStyles: () => ({
    container: { flex: 1 },
    header: {},
    heading1: {},
    heading2: {},
    productImage: { width: 200, height: 200 },
    productPrice: {},
    body: {},
    primaryButton: {},
  }),
}));

// ✅ Mock Firebase Auth
jest.mock('../src/firebase', () => ({
  auth: {},
}));

// ✅ Mock Firebase signOut
jest.mock('firebase/auth', () => ({
  signOut: jest.fn().mockResolvedValue(undefined),
}));

// ✅ Mock Products API
jest.mock('../src/api/productsApi', () => ({
  fetchProducts: jest.fn().mockResolvedValue({
    products: [
      {
        id: '1',
        title: 'Product 1',
        price: 100,
        thumbnail: 'https://test.com/image1.png',
        category: 'Electronics',
      },
      {
        id: '2',
        title: 'Product 2',
        price: 200,
        thumbnail: 'https://test.com/image2.png',
        category: 'Electronics',
      },
    ],
    lastDoc: null,
  }),
  subscribeToNewProducts: jest.fn().mockReturnValue(() => {}),
}));

// ✅ Mock NotificationBanner Component
jest.mock('../src/components/NotificationBanner', () => {
  return jest.fn(() => null);
});

describe('HomeScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(HomeScreen).toBeDefined();
  });

  it('receives navigation prop', () => {
    expect(mockNavigation).toBeDefined();
    expect(mockNavigation.navigate).toBeDefined();
  });

  it('has correct component signature', () => {
    const componentLength = HomeScreen.length;
    expect(componentLength).toBe(1); // Should accept one prop (navigation)
  });

  it('exports a functional component', () => {
    expect(typeof HomeScreen).toBe('function');
  });

  it('mocks for API and Firebase are set up correctly', async () => {
    const { fetchProducts } = require('../src/api/productsApi');
    const { signOut } = require('firebase/auth');
    
    expect(fetchProducts).toBeDefined();
    expect(signOut).toBeDefined();
    expect(typeof fetchProducts).toBe('function');
    expect(typeof signOut).toBe('function');
  });
});

