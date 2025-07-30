# Todo Mobile App

A cross-platform mobile application built with React Native and Expo for managing your Todos.

## Features

- View all your Todos in a clean, organized list
- Add new Todos
- Mark Todos as complete/incomplete
- Delete Todos
- Offline support with optimistic UI updates
- Smooth animations and transitions

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

## Getting Started

1. Install dependencies:
   ```bash
   cd mobile
   npm install
   ```

2. Update the API URL:
   - Open `App.js`
   - Replace `http://YOUR_COMPUTER_IP:4000` with your computer's local IP address

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your device:
   - Scan the QR code with your phone's camera (iOS) or Expo Go app (Android)
   - Or press 'i' to open in iOS simulator, 'a' for Android emulator, or 'w' for web

## Project Structure

- `App.js` - Main application component with navigation setup
- `components/` - Reusable UI components
  - `TodoItem.js` - Component for rendering individual Todo items
- `app.json` - Expo configuration file

## Configuration

Update the `app.json` file with your app's information:
- `name` - Your app's display name
- `slug` - URL-friendly name for your app
- `android.package` - Your Android package name
- `ios.bundleIdentifier` - Your iOS bundle identifier

## Building for Production

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
