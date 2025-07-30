# Todo Web App

A responsive web application for managing your Todos, built with React and Apollo Client.

## Features

- View all your Todos in a clean, responsive interface
- Add new Todos
- Mark Todos as complete/incomplete
- Delete Todos
- Real-time updates with GraphQL
- Beautiful UI with Tailwind CSS

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- The backend server should be running (see backend/README.md)

## Getting Started

1. Install dependencies:
   ```bash
   cd web
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure

- `src/` - Source code
  - `App.js` - Main application component
  - `index.js` - Application entry point
  - `index.css` - Global styles
  - `components/` - Reusable UI components
  - `hooks/` - Custom React hooks

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling. The configuration can be found in `tailwind.config.js`.

## Environment Variables

Create a `.env` file in the root of the `web` directory to set environment-specific variables:

```
REACT_APP_API_URL=http://localhost:4000
```

## Deployment

### Building for Production

```bash
npm run build
```

This will create a `build` directory with the production build of your app.

### Deploying to Netlify

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build your project:
   ```bash
   npm run build
   ```

3. Deploy:
   ```bash
   netlify deploy --prod
   ```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
