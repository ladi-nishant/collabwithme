# CollaborateX - Real-Time Collaborative Whiteboard

CollaborateX is a full-stack real-time collaborative whiteboard application built with the MERN stack and Socket.io. It allows multiple users to draw on a shared canvas, chat, and share files in real-time.

## features

### 🎨 Core Capabilities
- **Real-Time Drawing**: Simultaneous drawing with multiple users via Socket.io.
- **Canvas Tools**: Pencil, Eraser, and Clear Board.
- **Customization**: Color picker and brush size selection.
- **Room System**: Create and join private sessions via unique Room IDs.

### 🔐 Security & Persistence
- **Authentication**: Secure JWT-based Register / Login / Logout.
- **Protected Routes**: Ensuring board access only to authenticated users.
- **Session Persistence**: Whiteboard strokes and chat history are saved in MongoDB.

### 🚀 Intermediate & Advanced Features
- **Collaboration Panel**: Real-time chat with user presence indicators.
- **File Sharing**: Share images and documents directly inside the room.
- **Undo / Redo**: Local history for drawing actions.
- **Image Export**: Save your whiteboard as a PNG file.
- **Dark / Light Mode**: Seamless theme switching for better experience.
- **Role-Based Permissions**: Host-only control for clearing the board.

## Tech Stack
- **Frontend**: React.js (Vite), Framer Motion, Lucide React, Axios.
- **Backend**: Node.js, Express.js.
- **Real-Time**: Socket.io.
- **Database**: MongoDB (Mongoose).
- **Styling**: Vanilla CSS (Premium Glassmorphic Design).

## Setup Instructions

### Prerequisites
- Node.js installed.
- MongoDB running locally or a MongoDB Atlas URI.

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Folder Architecture (MVC)
```text
collabwithme/
├── client/           # React Frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Main application views
│   │   ├── context/    # State management
│   │   └── index.css   # Main design system
├── server/           # Express Backend
│   ├── models/       # Mongoose Schemas
│   ├── routes/       # API endpoints
│   ├── controllers/  # Business logic
│   └── index.js      # Server entry point
```
