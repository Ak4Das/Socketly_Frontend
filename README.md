# Socketly

Socketly is a modern and responsive real-time chat application built to provide seamless one-to-one communication with features such as real-time messaging, online/offline presence, typing indicators, message delivery/read status, reactions, and media/file sharing.

The application is built using a component-based React architecture on the frontend and a Node.js/Express backend with MongoDB for persistent data storage. Socket.io is used to establish real-time, bi-directional communication between clients and the server.

The project focuses on real-world frontend and backend engineering practices including centralized state management, optimized API communication, asynchronous event handling, error handling, scalable architecture, and efficient real-time updates.

## Demo Link

Deployed project **[Live Demo](YOUR_LIVE_DEMO_URL)**

## Frontend Setup

```bash
git clone YOUR_SOCKETLY_FRONTEND_REPOSITORY_URL

cd Socketly_Frontend

npm install

touch .env
```

Add the required environment variables to your `.env` file:

```env
VITE_MODE=DEVELOPMENT
VITE_BACKEND_URL=YOUR_BACKEND_URL
```

Then start the development server:

```bash
npm run dev
```

## Backend Setup

```bash
git clone YOUR_SOCKETLY_BACKEND_REPOSITORY_URL

cd Socketly_Backend

npm install

touch .env
```

Add the required environment variables to your `.env` file:

```env
MONGODB=YOUR_MONGODB_URI

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
REFRESH_TOKEN=YOUR_GOOGLE_REFRESH_TOKEN
GOOGLE_DRIVE_FOLDER_ID=YOUR_GOOGLE_DRIVE_FOLDER_ID
```

Then start the backend:

```bash
node index.js
```

## Tech Stack

### These are the main technologies used to build the application:

### _Frontend_

- **JavaScript (ES6+)**
- **React.js**
- **HTML5**
- **CSS3**
- **Bootstrap**

### _Backend_

- **Node.js**
- **Express.js**
- **Socket.io**

### _Database_

- **MongoDB**
- **Mongoose**

## Libraries & Tools

### These libraries and tools are used to implement specific features:

- **React Router** (_routing_)
- **Axios** (_HTTP client_)
- **Zustand** (_state management_)
- **Socket.io Client** (_real-time communication_)
- **Multer** (_multipart/form-data and file handling_)
- **Google APIs / googleapis** (_Google Drive file upload integration_)
- **React Toastify** (_notifications_)
- **Bootstrap Icons** (_icons_)
- **dotenv** (_environment variable management_)
- **CORS** (_cross-origin resource sharing_)

## Demo Video

Watch a walkthrough of the major features of this application:

**[Demo Video](YOUR_DEMO_VIDEO_URL)**

## Key Features

- Real-time one-to-one messaging
- Real-time message delivery using Socket.io
- Online/offline user presence
- Last seen information
- Typing indicators
- Message delivery status
- Message read status
- Message reactions
- Image and media/file sharing
- Conversation management
- Persistent message history
- Responsive chat interface
- Real-time UI updates
- Optimized API communication
- Centralized Zustand state management
- Error handling and loading states
- Socket event listener management
- Automatic socket reconnection
- Scalable and maintainable project architecture

## Detailed Features

The application provides a complete real-time messaging experience with persistent conversations, real-time presence updates, message status tracking, typing indicators, reactions, and file/media sharing.

### Authentication & User Management

- User authentication using JWT token and verify via OTP
- Persistent user state
- User-specific socket connection
- Automatic initialization of socket listeners after authentication

### Real-Time Messaging

- Users can send and receive messages in real time.
- Socket.io establishes a persistent connection between the client and server.
- Messages are emitted through socket events and delivered to the appropriate user.
- Messages are persisted in MongoDB.
- Existing conversation messages can be retrieved through REST APIs.

### Conversation (ChatWindow) Page

- Displays conversation history between users.
- Messages are loaded from the backend.
- New messages are received instantly through Socket.io.
- Messages update in the UI without requiring a page refresh.
- Supports text and media/file messages.
- Copy and delete message
- Send image (<1mib), video (<10mib), audio (<5mib), documents (<10mib)
- View and download image, video, audio, documents
- Clear chat and toggle theme
- Conversation state is managed through Zustand.

![Conversation Page](./screenshots/ConversationPage.png)

### Online / Offline Presence

- Displays whether a user is currently online.
- Updates user status in real time.
- Displays last seen information when a user goes offline.
- Server maintains connected users and their socket information.
- Presence updates are broadcast to relevant clients.

### Typing Indicator

- Detects when a user is typing.
- Sends typing state through Socket.io.
- Displays the typing indicator to the other participant.
- Typing state is cleared after 3s of the user stops typing.

### Message Delivery Status

The application supports message status tracking.

- **Sent** — Message has been sent by the sender (Represent using single tick).
- **Delivered** — Message has reached the recipient (Represent using double tick).
- **Read** — Message has been viewed by the recipient (Represent using double blue tick).

Message status can be updated in real time without requiring a page refresh.

### Unread count

- If user busy with another conversation then number of unread messages of the other conversations are displayed on contact.

### Message Reactions

- Users can react to messages.
- Reactions are synchronized through Socket.io.
- UI updates immediately when a reaction is added or changed.

### File & Media Sharing

- Users can send files and media through conversations.
- Files are handled using `Multer`.
- The backend processes uploaded files before storing them.
- Google Drive integration is used for document storage.
- Cloudinary integration is used for image, video, audio storage.
- File metadata and message information are associated with the corresponding chat message.

Supported media can include:

- Images
- Videos
- Audio
- Other supported files

### Message History

- Messages are persisted in MongoDB.
- Previous messages can be retrieved when opening a conversation.
- Conversation history remains available after reconnecting.
- Message data is associated with the appropriate conversation and users.

![Message History](./screenshots/MessageHistory.png)

### Real-Time User Status

The application listens for user status changes through Socket.io.

Example event:

```javascript
socket.on("user_status", ({ userId, isOnline, lastSeen }) => {
  // Update online user state
})
```

The frontend updates the corresponding user status without requiring a page refresh.

### Error Handling

- API errors are handled centrally.
- Loading states are maintained during asynchronous operations.
- Socket connection and disconnection states are tracked.
- Users receive appropriate feedback through notifications where required.

### Socket Connection Management

- Socket connection is initialized only when a valid authenticated user is available.
- Socket event listeners are registered through a centralized listener setup.
- Existing listeners are removed before registering new listeners to prevent duplicate event handlers.
- Socket reconnection is supported.
- Disconnect events are handled appropriately.

Example:

```javascript
socket.off("receive_message")
socket.off("message_read")
socket.off("reaction_update")
socket.off("message_deleted")
socket.off("message_error")
socket.off("user_typing")
socket.off("user_status")
```

This prevents multiple handlers from being attached to the same event.

### Zustand State Management

Zustand is used for centralized client-side state management.

Application state includes areas such as:

- Current user
- Authentication state
- Socket instance
- Connection state
- Current conversation
- Messages
- Online users
- Typing users
- User status
- Loading states
- Error states

The store also provides actions for updating and synchronizing real-time application state.

### Responsive Design

The application is designed to provide a consistent experience across different screen sizes.

- Desktop view
- Tablet view
- Mobile view

![Desktop View](./screenshots/DesktopView.png)

![Tablet View](./screenshots/TabletView.png)

![Mobile View](./screenshots/MobileView.png)

## Socket.io Events

The application uses Socket.io events for real-time communication between clients and the server.

### Client → Server

Examples include:

- Sending messages
- Typing state
- Message read events
- Message reactions
- User connection/status events

### Server → Client

Examples include:

- `receive_message`
- `message_send`
- `message_read`
- `reaction`
- `user_status`

The event-driven architecture allows the application to update the UI immediately when something changes on the server.

## Architecture Highlights

- Component-based React architecture
- Modular API service layer
- Centralized Zustand state management
- Feature-based project structure
- Reusable components
- Reusable API request functions
- Centralized socket listener management
- Real-time event-driven architecture
- MongoDB-based persistent message storage
- REST API + WebSocket communication
- Modular backend architecture
- Scalable and maintainable code structure

## Engineering Highlights

### **Real-Time Communication**

Socket.io is used to provide bidirectional, event-based communication between the frontend and backend.

### **Connection Management**

Socket connections are initialized based on the authenticated user and reused throughout the application to avoid unnecessary connections.

### **Event Listener Management**

Existing listeners are removed before registering new listeners to prevent duplicate event execution and memory leaks.

### **Request Cancellation**

`AbortController` is used to cancel unnecessary API requests, especially when the user changes conversations before a previous request has completed.

### **Asynchronous Event Handling**

Socket event handlers can perform asynchronous operations such as fetching updated conversation data and synchronizing Zustand state.

### **Persistent Data**

Messages and conversation information are stored in MongoDB using Mongoose.

### **File Upload Architecture**

The backend uses Multer to process incoming multipart/form-data requests and Google Drive integration for storing uploaded files.

### **State Synchronization**

Real-time events received from Socket.io are synchronized with Zustand so that multiple parts of the frontend can react to changes consistently.

### **User Presence**

The backend maintains information about connected users and broadcasts online/offline status changes to clients.

### **Loading & Error States**

Asynchronous operations maintain explicit loading and error states to provide better user feedback and prevent inconsistent UI states.

## API Reference

The application uses REST APIs for operations that require persistent data retrieval or modification, while Socket.io handles real-time communication.

### **GET /chats/conversations/:conversationId/messages**

Fetch messages belonging to a particular conversation.

Sample Response:

```javascript
{
    success: true,
    message: "Messages fetched successfully",
    data: [
        {
            _id,
            sender,
            receiver,
            message,
            messageStatus,
            createdAt,
            ...
        }
    ]
}
```

### **POST /chats/conversations/...**

Conversation-related operations are handled through the chat API layer.

### **Message APIs**

Message operations include:

- Creating messages
- Fetching conversation messages
- Updating message status
- Updating read status
- Managing message reactions

> The exact API routes depend on the backend implementation and can be expanded here as additional endpoints are finalized.

## Real-Time Message Flow

A typical message flow works as follows:

```text
User A
   │
   │ Send Message
   ▼
React Client
   │
   │ Socket.io
   ▼
Express + Socket.io Server
   │
   ├── Save message
   │
   ▼
MongoDB
   │
   │
   └──────────────► Socket.io
                         │
                         │ receive_message
                         ▼
                    React Client
                         │
                         ▼
                  Update Zustand
                         │
                         ▼
                    Chat UI
```

## Presence Flow

```text
User connects
      │
      ▼
Socket.io connection
      │
      ▼
Server identifies user
      │
      ▼
User added to online users
      │
      ▼
user_status event
      │
      ▼
Other clients receive update
      │
      ▼
Zustand state updated
      │
      ▼
UI displays Online
```

When the user disconnects, the server removes the user from the active users collection/map and broadcasts the corresponding offline status and last seen information.

## Project Structure

A simplified project structure:

```text
Socketly/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── socket/
│   ├── uploads/
│   ├── index.js
│   └── package.json
│
└── README.md
```

## Performance & Optimization

- Request cancellation using AbortController
- Prevention of unnecessary API requests
- Prevention of duplicate Socket.io event listeners
- Reuse of socket connection
- Centralized state management
- Efficient real-time state synchronization
- Persistent database storage
- Asynchronous API and socket operations
- Loading and error state management

## Security Considerations

- Sensitive credentials are stored in environment variables.
- MongoDB connection strings are not committed to the repository.
- Google API credentials are kept outside source code.
- CORS is configured on the backend.
- Authentication-related information is handled separately from application UI state.
- Environment files are excluded from version control.

## Goal of the Project

The goal of Socketly is to build a production-oriented real-time communication application that demonstrates practical frontend and backend engineering skills.

The project focuses on implementing real-world concepts such as:

- Real-time communication
- WebSocket-based architecture
- REST APIs
- State management
- Database persistence
- User presence
- Message delivery and read status
- File/media handling
- Request optimization
- Error handling
- Responsive UI
- Scalable application architecture

Socketly is designed not only as a chat application but also as a demonstration of how modern web technologies can be combined to build a responsive, scalable, and maintainable real-time application.

## Future Improvements

Potential improvements include:

- Group conversations
- Message search
- Message editing and deletion
- Push notifications
- Voice/video calling
- Advanced notification preferences
- Pagination/infinite scrolling for large conversations
- Message encryption
- Improved media preview and management

## Contact

For bugs, feature requests, or suggestions, please reach out to:

**[akashdas02052@gmail.com](mailto:akashdas02052@gmail.com)**
