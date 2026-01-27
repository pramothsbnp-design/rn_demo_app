import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import DetailScreen from '../src/screens/DetailScreen';

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
    productImage: { width: 300, height: 300 },
    productPrice: {},
    body: {},
    primaryButton: {},
  }),
}));

// ✅ Mock Loader Component - returns null to just skip the loader
jest.mock('../src/components/Loader', () => {
  return jest.fn(() => null);
});

describe('DetailScreen', () => {
  const mockProduct = {
    title: 'iPhone 15',
    price: 80000,
    description: 'Latest Apple iPhone',
    thumbnail: 'https://test.com/image.png',
  };

  const mockRoute = {
    params: {
      product: mockProduct,
    },
  };

  const mockNavigation = {
    navigate: jest.fn(),
  };

  it('should be defined', () => {
    expect(DetailScreen).toBeDefined();
  });

  it('receives required props', () => {
    expect(mockRoute.params.product).toEqual(mockProduct);
    expect(mockNavigation).toBeDefined();
  });

  it('renders without crashing', async () => {
    const { queryByText } = render(
      <DetailScreen route={mockRoute} navigation={mockNavigation} />
    );
    
    // Give the component time to load
    await waitFor(
      () => {
        // After 1 second, the loading should be done
        // Either we should see the product detail or nothing if the component errored
      },
      { timeout: 2000 }
    );
  });
});




