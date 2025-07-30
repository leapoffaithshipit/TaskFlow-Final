# TaskFlow - To-Do List Application

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

☁️ AWS Deployment Plan
🔧 Architecture Overview
Deploy the TaskFlow backend as a serverless GraphQL API using:

AWS Lambda – to host the Node.js GraphQL server

Amazon API Gateway – to expose the HTTP endpoint (/graphql)

Amazon DynamoDB or S3 + lowdb (for file-based storage) – for persistent task and user data (optional)

AWS IAM – for access control

AWS CloudWatch – for logs and monitoring

🛠️ Services Used
AWS Service	Purpose
Lambda	Host the Node.js GraphQL handler
API Gateway	Route HTTP requests to Lambda
S3 (optional)	Store db.json if using lowdb
DynamoDB (alt)	Scalable NoSQL for task/user data
CloudWatch	Logging and debugging
IAM	Permissions and role management

💰 Estimated Costs (AWS Free Tier Eligible)
Service	Free Tier Limit	Monthly Cost (Est.)
Lambda	1M requests + 400K GB-seconds	$0
API Gateway	1M HTTP requests	$0
S3 / DynamoDB	5GB + 25GB-month read/write	$0
CloudWatch Logs	5GB storage + basic metrics	$0


Made by | Hafiz Ridwan |
