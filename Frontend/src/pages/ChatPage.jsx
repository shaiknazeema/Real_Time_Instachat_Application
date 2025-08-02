// src/pages/ChatPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import socket from '../api/socket';

export default function ChatPage() {
  const { otherUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      socket.emit('join', userId);
    }

    // Load previous messages
    api.get(`/messages/${otherUserId}`)
      .then(res => setMessages(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMessages([]));

    // Listen for new messages
    socket.on('receiveMessage', (msg) => {
      // show only if from or to this user
      if (msg.from === otherUserId || msg.from === userId) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => socket.off('receiveMessage');
  }, [otherUserId, userId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      // Save to DB
      const res = await api.post(`/messages/${otherUserId}`, { text });
      const savedMessage = res.data;

      // Add locally
      setMessages(prev => [...prev, savedMessage]);

      // Emit to recipient
      socket.emit('sendMessage', savedMessage);
      setText('');
    } catch {
      alert('Failed to send message');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post(`/messages/${otherUserId}/media`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const savedFileMessage = res.data;

      setMessages(prev => [...prev, savedFileMessage]);
      socket.emit('sendMessage', savedFileMessage);
      setFile(null);
    } catch {
      alert('Failed to upload file');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Chat with user: {otherUserId}</h3>
      <div className="border rounded p-3 mb-3" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded ${msg.from === userId ? 'bg-success text-white text-end' : 'bg-light text-start'}`}
          >
            {msg.text && <div>{msg.text}</div>}
            {msg.fileUrl && (
              <img
                src={`http://localhost:5000${msg.fileUrl}`}
                alt="sent file"
                style={{ maxWidth: '200px', borderRadius: '8px' }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="input-group mb-2">
        <input
          className="form-control"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />
        <button className="btn btn-success" onClick={handleSend}>Send</button>
      </div>

      <div className="input-group">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="form-control" />
        <button className="btn btn-primary" onClick={handleUpload}>Send Image</button>
      </div>
    </div>
  );
}
