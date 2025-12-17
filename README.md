# SalonApp

SalonApp is a full-featured salon management and booking application built with Expo and React Native.

## Features

- Customer and Shop (Business) sides
- Modern UI with Expo Router navigation
- Shop side includes:
  - Service management with categories (add, edit, delete, filter)
  - Business hours management
  - Staff management (add, edit, activate/deactivate)
  - Analytics dashboard (revenue, bookings, top services, peak hours, customer insights)
  - Profile section with:
    - Business Info
    - Opening Hours
    - Location
    - Gallery
    - Reviews
    - Earnings
    - Payment Settings
    - Help Center
    - Contact Support
    - Settings

## Getting Started

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** and **src** directories. This project uses [file-based routing](https://docs.expo.dev/router/introduction) and a modular folder structure for screens, navigation, and business logic.

## Push Notifications

This app uses `expo-notifications` to register an Expo Push Token and store it in Firestore under `users/{uid}.pushToken`.

Install native modules with Expo to ensure compatible versions:

```bash
npx expo install expo-notifications expo-location
```

Notes:

- iOS and Android push require a development build or EAS build (not Expo Go).
- Build the app, sign in, and check Firestore for `pushToken` on your user document.
- To send a test push, use the Expo Push Tool: https://expo.dev/notifications

## Location-Based Search

We request foreground location permissions and use the Haversine formula to sort salons by distance on the Search screen. If permission is denied, the list still works without distance sorting.

Where to look:

- Request + token save: `app/index.tsx`, `src/services/notifications.ts`
- Location helpers: `src/services/locationService.ts`
- Distance sorting + display: `src/screens/customer/SearchScreen.tsx`

## Project Structure

- `app/` - Expo Router entry points
- `src/screens/` - All app screens (customer and shop)
- `src/navigation/` - Navigation setup
- `src/components/` - Reusable UI components
- `src/types/` - TypeScript types
- `src/constants/` - App-wide constants (e.g., service categories)
- `src/api/` - API and mock data

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native](https://reactnative.dev/)

---

© 2025 SalonApp
