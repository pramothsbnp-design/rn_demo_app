# MyNewApp

A React Native Expo application featuring a product catalog with Firebase integration, user authentication, and theme switching.

## Features

- **User Authentication**: Login and logout functionality using Firebase Auth
- **Product Catalog**: Browse products with pagination, sorting, and category filtering
- **Theme Support**: Light and dark theme toggle
- **Responsive Design**: Optimized for mobile devices
- **Firebase Integration**: Real-time database for products and user data
- **Navigation**: Stack and drawer navigation for seamless user experience

## Technologies Used

- **React Native**: Framework for building native apps
- **Expo**: Platform for universal React applications
- **Firebase**: Backend services for authentication and database
- **React Navigation**: Navigation library for React Native
- **Context API**: State management for theme

## Prerequisites

- Node.js (version 14 or later)
- npm or yarn
- Expo CLI
- Firebase project setup

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore Database
   - Copy your Firebase config to `src/firebase.js`

3. Start the development server:
   ```bash
   npm start
   ```

# MyNewApp

A React Native Expo application showcasing a product catalog with Firebase integration, user authentication, and a light/dark theme toggle.

## Quick Start

Prerequisites:
- Node.js (v14+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- A Firebase project (Auth + Firestore enabled)

Install dependencies and start the dev server:

```bash
npm install
npm run start
```

Common scripts:

- `npm run start` — Start Expo dev server
- `npm run ios` — Run on iOS simulator (macOS + Xcode required)
- `npm run android` — Run on Android emulator
- `npm run web` — Run in web browser
- `npm test` — Run Jest tests

## Firebase Setup

1. Create a project at https://console.firebase.google.com/
2. Enable **Authentication** (Email/Password) and **Firestore**
3. Copy your Firebase config and export it from `src/firebase.js`. Example:

```js
// src/firebase.js
import { initializeApp } from 'firebase/app';
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  // ...other keys
};
export default initializeApp(firebaseConfig);
```

Note: Do not commit secrets — use environment variables or a secrets manager for production.

## Features

- User authentication (Firebase Auth)
- Product catalog with pagination and filters
- Theme toggle (light / dark) via Context API
- Navigation: stack + drawer

## Testing

Unit tests use Jest and React Native Testing Library. Run:

```bash
npm test
```

## Project Structure

```
MyNewApp/
├── App.js
├── app.json
├── index.js
├── assets/            # Images and icons
├── src/
│   ├── api/           # API wrappers (productsApi)
│   ├── components/    # Reusable components (ProductCard, Loader)
│   ├── context/       # ThemeContext
│   ├── navigation/    # App navigators
│   ├── screens/       # Screen components
│   └── firebase.js    # Firebase initialization (local)
├── __tests__/         # Jest tests
└── package.json
```

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit, push, and open a PR

Please follow the existing code style and add tests for new logic.

## License

MIT — see the `LICENSE` file for details.