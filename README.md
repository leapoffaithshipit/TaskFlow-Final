# Todo Application

A full-stack To-do application with web and mobile clients, built with modern web technologies.

## Project Structure

- `backend/` - GraphQL API server
- `web/` - React web application
- `mobile/` - React Native mobile application

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- For mobile development: Expo CLI and Expo Go app

## Getting Started

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

The GraphQL Playground will be available at `http://localhost:4000`

### 2. Web Client Setup

1. Open a new terminal and navigate to the web directory:
   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The web app will be available at `http://localhost:3009`

### 3. Mobile Client Setup

1. Open a new terminal and navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API URL in `App.js` to use your computer's local IP address

4. Start the development server:
   ```bash
   npm start
   ```

5. Scan the QR code with the Expo Go app on your mobile device

## Features

- **Backend**
  - GraphQL API
  - In-memory database with lowdb
  - Real-time updates with subscriptions

- **Web Client**
  - Responsive design with Tailwind CSS
  - Optimistic UI updates
  - Offline support

- **Mobile Client**
  - Cross-platform (iOS and Android)
  - Native-like performance
  - Smooth animations

## Technology Stack

- **Backend**
  - Node.js
  - Apollo Server
  - GraphQL
  - lowdb

- **Web**
  - React
  - Apollo Client
  - Tailwind CSS
  - React Hooks

- **Mobile**
  - React Native
  - Expo
  - React Navigation
  - Apollo Client

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
