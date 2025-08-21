// const express = require('express');
// const http = require('http');
// const cors = require('cors');
// const { Server } = require('socket.io');
// const path = require('path');
// require('dotenv').config();

// const connectDB = require('./config'); // ✅ DB connection
// const authRoutes = require('./routes/authRoutes');
// const friendRoutes = require('./routes/friendRoutes');
// const messageRoutes = require('./routes/messageRoutes');
// const userRoutes = require('./routes/userRoutes');
// const groupRoutes = require('./routes/groupRoutes');

// const app = express();
// const server = http.createServer(app);

// // Connect to DB
// connectDB();

// // Middleware
// app.use(cors({
//   origin: [
//     'http://localhost:5173',
//     'http://localhost:5000',
//     'https://real-time-instachat-application-2dzt.onrender.com'
//   ],
//   credentials: true
// }));
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/friends', friendRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/groups', groupRoutes);

// // Setup Socket.io
// const io = new Server(server, { cors: { origin: '*' } });

// // ✅ Track online users: userId -> socketId
// const onlineUsers = {};

// io.on('connection', (socket) => {
//   console.log('✅ New socket connected:', socket.id);

//   // User joins (on dashboard load)
//   socket.on('join', (userId) => {
//     onlineUsers[userId] = socket.id;
//     console.log(`✅ User joined: ${userId} → socket ${socket.id}`);
//   });

//   // 📨 Private message with notification
//   socket.on('sendMessage', (msg) => {
//     console.log(`➡️ sendMessage from ${msg.from} to ${msg.to}`);
//     const targetSocketId = onlineUsers[msg.to];
//     if (targetSocketId) {
//       io.to(targetSocketId).emit('receiveMessage', msg);
//       io.to(targetSocketId).emit('notifyMessage', { fromName: msg.fromName });
//       console.log(`✅ Message delivered & notification sent to user ${msg.to}`);
//     } else {
//       console.log(`⚠️ User ${msg.to} is offline`);
//     }
//   });

//   // 📞 Start video call
//   socket.on('callUser', ({ toUserId, roomID, fromUserName }) => {
//     console.log(`📞 callUser: ${fromUserName} → user ${toUserId} roomID=${roomID}`);
//     const targetSocketId = onlineUsers[toUserId];
//     if (targetSocketId) {
//       io.to(targetSocketId).emit('incomingCall', { roomID, fromUserName });
//       console.log(`✅ Incoming call sent to ${toUserId}`);
//     } else {
//       console.log(`⚠️ User ${toUserId} is offline`);
//     }
//   });

//   // ❌ Reject video call
//   socket.on('rejectCall', ({ toUserId }) => {
//     console.log(`❌ rejectCall to user ${toUserId}`);
//     const targetSocketId = onlineUsers[toUserId];
//     if (targetSocketId) {
//       io.to(targetSocketId).emit('callRejected');
//       console.log(`✅ callRejected event sent to ${toUserId}`);
//     }
//   });

//   // 📢 Group chat messages
//   socket.on('sendGroupMessage', ({ groupId, msg }) => {
//     console.log(`📢 sendGroupMessage to group ${groupId}`);
//     io.emit(`groupMessage:${groupId}`, msg);
//   });

//   // ✅ Notifications: friend request & accept
//   socket.on('notifyFriendRequest', ({ targetUserId, requesterName }) => {
//     const targetSocketId = onlineUsers[targetUserId];
//     if (targetSocketId) {
//       io.to(targetSocketId).emit('notifyFriendRequest', requesterName);
//       console.log(`🔔 notifyFriendRequest sent to ${targetUserId}`);
//     }
//   });

//   socket.on('notifyRequestAccepted', ({ requesterId, acceptorName }) => {
//     const requesterSocketId = onlineUsers[requesterId];
//     if (requesterSocketId) {
//       io.to(requesterSocketId).emit('notifyRequestAccepted', acceptorName);
//       console.log(`✅ notifyRequestAccepted sent to ${requesterId}`);
//     }
//   });

//   // 📴 Handle disconnect
//   socket.on('disconnect', () => {
//     console.log('❌ Socket disconnected:', socket.id);
//     for (const userId in onlineUsers) {
//       if (onlineUsers[userId] === socket.id) {
//         delete onlineUsers[userId];
//         console.log(`🗑 Removed user ${userId} from onlineUsers`);
//         break;
//       }
//     }
//   });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// // Export if needed
// module.exports = { io, onlineUsers };


const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config'); // ✅ DB connection
const authRoutes = require('./routes/authRoutes');
const friendRoutes = require('./routes/friendRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');

const app = express();
const server = http.createServer(app);

// Connect to DB
connectDB();

// ✅ Allowed origins (local + deployed Vercel frontend)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://real-time-instachat-application.vercel.app/' // 🔥 replace with your real Vercel frontend URL
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/user', userRoutes);
app.use('/api/groups', groupRoutes);

// Setup Socket.io with same CORS whitelist
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ✅ Track online users: userId -> socketId
const onlineUsers = {};

io.on('connection', (socket) => {
  console.log('✅ New socket connected:', socket.id);

  // User joins (on dashboard load)
  socket.on('join', (userId) => {
    onlineUsers[userId] = socket.id;
    console.log(`✅ User joined: ${userId} → socket ${socket.id}`);
  });

  // 📨 Private message with notification
  socket.on('sendMessage', (msg) => {
    console.log(`➡️ sendMessage from ${msg.from} to ${msg.to}`);
    const targetSocketId = onlineUsers[msg.to];
    if (targetSocketId) {
      io.to(targetSocketId).emit('receiveMessage', msg);
      io.to(targetSocketId).emit('notifyMessage', { fromName: msg.fromName });
      console.log(`✅ Message delivered & notification sent to user ${msg.to}`);
    } else {
      console.log(`⚠️ User ${msg.to} is offline`);
    }
  });

  // 📞 Start video call
  socket.on('callUser', ({ toUserId, roomID, fromUserName }) => {
    console.log(`📞 callUser: ${fromUserName} → user ${toUserId} roomID=${roomID}`);
    const targetSocketId = onlineUsers[toUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit('incomingCall', { roomID, fromUserName });
      console.log(`✅ Incoming call sent to ${toUserId}`);
    } else {
      console.log(`⚠️ User ${toUserId} is offline`);
    }
  });

  // ❌ Reject video call
  socket.on('rejectCall', ({ toUserId }) => {
    console.log(`❌ rejectCall to user ${toUserId}`);
    const targetSocketId = onlineUsers[toUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit('callRejected');
      console.log(`✅ callRejected event sent to ${toUserId}`);
    }
  });

  // 📢 Group chat messages
  socket.on('sendGroupMessage', ({ groupId, msg }) => {
    console.log(`📢 sendGroupMessage to group ${groupId}`);
    io.emit(`groupMessage:${groupId}`, msg);
  });

  // ✅ Notifications: friend request & accept
  socket.on('notifyFriendRequest', ({ targetUserId, requesterName }) => {
    const targetSocketId = onlineUsers[targetUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit('notifyFriendRequest', requesterName);
      console.log(`🔔 notifyFriendRequest sent to ${targetUserId}`);
    }
  });

  socket.on('notifyRequestAccepted', ({ requesterId, acceptorName }) => {
    const requesterSocketId = onlineUsers[requesterId];
    if (requesterSocketId) {
      io.to(requesterSocketId).emit('notifyRequestAccepted', acceptorName);
      console.log(`✅ notifyRequestAccepted sent to ${requesterId}`);
    }
  });

  // 📴 Handle disconnect
  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        console.log(`🗑 Removed user ${userId} from onlineUsers`);
        break;
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// Export if needed
module.exports = { io, onlineUsers };
