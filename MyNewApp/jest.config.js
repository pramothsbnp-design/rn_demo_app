module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|expo|@expo|react-native-gesture-handler|react-native-safe-area-context|react-native-screens|firebase|react-dom)/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.expo/'],
  globals: {
    __DEV__: true,
  },
};
