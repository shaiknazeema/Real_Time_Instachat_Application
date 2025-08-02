// src/api/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');  // adjust if backend changes

export default socket;
