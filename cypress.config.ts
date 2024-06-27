import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    viewportWidth: 1280,
    viewportHeight: 720,
    baseUrl: 'http://localhost:5173/card-shop-search/',
    env: {
      firebaseEmulatorHost: process.env.CYPRESS_FIREBASE_EMULATOR_HOST,
      firebaseApiKey: process.env.CYPRESS_FIREBASE_API_KEY,
    },
  },
});
