# Real-Time Chat Application

A modern, real-time chat application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.IO for instant messaging capabilities.

## Features

- **Real-time messaging** using Socket.IO
- **User authentication** with JWT
- **Image sharing** in conversations
- **Online status indicators**
- **Profile customization**
- **Responsive design** for mobile and desktop
- **Secure communication** with encrypted passwords and protected routes

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional event-based communication
- **JWT** - JSON Web Tokens for authentication
- **bcrypt.js** - Password hashing
- **Cloudinary** - Cloud storage for images

### Frontend
- **React.js** - Frontend library
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication with server
- **React Router** - Navigation and routing
- **Zustand** - State management

## Application Flow

### Authentication Flow
1. User registers with email, full name, and password
2. Password is hashed using bcrypt before storage
3. Upon successful registration or login, JWT is generated and stored in HTTP-only cookie
4. Protected routes verify the JWT token before granting access
5. User can update profile information and upload profile pictures

### Messaging Flow
1. User selects another user from the sidebar to start a conversation
2. Previous messages are loaded from the database
3. New messages are:
   - Sent to the server via REST API
   - Stored in the MongoDB database
   - Delivered in real-time to the recipient via Socket.IO if online
4. Recipient receives instant notification of new message
5. Users can share images which are uploaded to Cloudinary
6. Online status is tracked and displayed in real-time

### Socket.IO Events
- `connection` - User connects to the server
- `disconnect` - User disconnects from the server
- `newMessage` - New message is sent
- `getOnlineUsers` - List of currently online users is updated


## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Cloudinary account

### Environment Variables
Create a `.env` file in the backend directory:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
 
Access the application at http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout the current user
- `PUT /api/auth/update-profile` - Update user profile
- `GET /api/auth/check` - Check authentication status

### Messages
- `GET /api/messages/users` - Get all users for the sidebar
- `GET /api/messages/:id` - Get conversation with specific user
- `POST /api/messages/send/:id` - Send a message to a user

## Deployment

For production deployment:

1. Set `NODE_ENV=production` in the backend .env file
2. Build the frontend
   ```bash
   cd frontend
   npm run build
   ```
3. Start the server
   ```bash
   cd ../backend
   npm start
   ```
# TalkSpace Architecture Diagram

```plaintext
                                         ┌───────────────┐
                                         │    Client     │
                                         │(React/Frontend)│
                                         └──────┬────────┘
                                                │
                                                ▼
                                  ┌─────────────────────────┐
                                  │        Backend          │
                                  │  (Express.js + Node.js) │
                                  └────────────┬────────────┘
                                               │
            ┌──────────────────────────────────┴──────────────────────────────────┐
            │                            Services                                 │
            │                                                                    │
┌──────────────────────┐         ┌──────────────────────┐              ┌──────────────────────┐
│ Authentication       │         │ Messaging           │              │ Cloudinary Service   │
│ (JWT, bcrypt.js)     │         │ (Socket.IO         │              │ (Image Upload/Deletion)│
│                      │         │ & MongoDB)         │              │                      │
└──────────────────────┘         └──────────────────────┘              └──────────────────────┘
             |
             └─────────────────────┬─────────────────────────────────────┘
                                   │
                            ┌──────┴──────┐
                            │   Database   │
                            │   MongoDB    │
                            └──────────────┘
```
