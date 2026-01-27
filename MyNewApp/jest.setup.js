// Define global variables needed by React Native
globalThis.__DEV__ = true;
globalThis.performance = { now: () => Date.now() };

import '@testing-library/jest-native/extend-expect';

// Mock @expo/vector-icons  
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, size, color }) => null,
}));

// Mock @react-native-picker/picker
jest.mock('@react-native-picker/picker', () => ({
  Picker: {
    Item: 'PickerItem',
  },
}));

// Mock Image component properly
jest.mock('react-native/Libraries/Image/Image', () => 'Image');

// Set up NativeModules mock
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
  })),
}));











