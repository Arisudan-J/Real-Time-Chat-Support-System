# Real-Time Chat Support System

A complete real-time chat support system with React frontend and Spring Boot backend.

## Quick Start

### Option 1: Automated Setup (Windows)
1. Run: `start-project.bat`
2. This will start both backend and frontend automatically

### Option 2: Manual Setup

#### Backend (Spring Boot)
1. Navigate to `springapp` directory
2. Run: `./run.bat` (Windows) or `./mvnw spring-boot:run` (Linux/Mac)
3. Backend will start on http://localhost:8080

#### Frontend (React)
1. Navigate to `reactapp` directory
2. Run: `npm install`
3. Run: `npm start`
4. Frontend will start on http://localhost:3000

## Features

- **Real-time messaging** with WebSocket
- **User authentication** with JWT
- **Role-based access** (Customer/Agent)
- **Modern UI** with glassmorphism design
- **Responsive design** for all devices
- **Typing indicators** and message status
- **Session management** for chat conversations

## Database

The backend uses MySQL database. Make sure MySQL is running with:
- Database: `backend`
- Username: `root`
- Password: `Kingmaker@0602`
- Port: `3306`

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/chat-sessions` - Get all chat sessions
- `POST /api/chat-sessions` - Create new chat session
- `GET /api/chat-messages/{sessionId}` - Get messages for session
- `POST /api/chat-messages` - Send message
- `GET /api/agents/available` - Get available agents

## WebSocket

- Endpoint: `/ws`
- Chat messages: `/topic/chat/{sessionId}`
- Typing indicators: `/topic/typing/{sessionId}`

## Default Users

The system will create default users on startup:
- Customer: customer@example.com / password123
- Agent: agent@example.com / password123
- Admin: admin@example.com / admin123

## Prerequisites

- Java 17 or higher
- Node.js 14 or higher
- MySQL 8.0 or higher
- Maven (included with project)

## Setup Instructions

1. **Database Setup**:
   - Start MySQL server
   - Create database named `backend`
   - Update credentials in `springapp/src/main/resources/application.properties` if needed

2. **Backend Setup**:
   - The application will automatically create tables on first run
   - Default users will be created automatically

3. **Frontend Setup**:
   - All dependencies will be installed automatically
   - Tailwind CSS is pre-configured

## Troubleshooting

- **Database Connection Error**: Ensure MySQL is running and database `backend` exists
- **WebSocket Connection Error**: Make sure backend is running before starting frontend
- **Port Conflicts**: Backend uses 8080, frontend uses 3000
- **CORS Issues**: Already configured for localhost development

## Technology Stack

### Backend
- Spring Boot 3.4.0
- Spring Security with JWT
- Spring WebSocket
- H2 Database
- Lombok

### Frontend
- React 19
- Tailwind CSS
- Axios for API calls
- SockJS + STOMP for WebSocket
- React Router for navigation