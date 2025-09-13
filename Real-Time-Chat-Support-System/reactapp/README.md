# ChatSupport - Real-Time Chat Support System

A modern real-time chat support system built with React and Spring Boot.

## Features

- **Real-time messaging** with WebSocket support
- **User authentication** with JWT tokens
- **Role-based access control** (Admin, Agent, Customer)
- **Admin dashboard** for user and session management
- **Agent status management** (Available, Busy, Offline)
- **Responsive design** with Tailwind CSS
- **Modern UI** with glassmorphism effects

## Tech Stack

- **Frontend**: React 18, React Router, Tailwind CSS
- **Real-time**: WebSocket with STOMP protocol
- **HTTP Client**: Axios
- **Authentication**: JWT with jwt-decode
- **Styling**: Tailwind CSS with custom animations

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.js
│   ├── FloatingChatButton.js
│   ├── MessageBubble.js
│   └── TypingIndicator.js
├── contexts/           # React contexts
│   └── AuthContext.js
├── pages/             # Page components
│   ├── AdminDashboard.js
│   ├── ChatRoom.js
│   ├── Dashboard.js
│   ├── LoginPage.js
│   └── RegisterPage.js
├── utils/             # Utility functions
│   └── api.js
├── App.js             # Main app component
└── index.js           # Entry point
```

## User Roles

- **Customer**: Can create chat sessions and communicate with agents
- **Agent**: Can respond to customer inquiries and manage availability status
- **Admin**: Can manage users, view all sessions, and create new agents

## API Integration

The app connects to a Spring Boot backend running on `http://localhost:8080` with the following endpoints:

- `/api/auth/*` - Authentication endpoints
- `/api/chat-sessions/*` - Chat session management
- `/api/chat-messages/*` - Message handling
- `/api/agents/*` - Agent management
- `/api/admin/*` - Admin operations
- `/ws` - WebSocket endpoint for real-time communication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.