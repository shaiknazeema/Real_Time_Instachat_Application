import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../api/socket';
import axios from '../api/axios';

export default function GroupChatPage() {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    // Load existing messages
    axios.get(`/groups/my`).then(res => {
      const group = res.data.find(g => g._id === groupId);
      if (group) setMessages(group.messages);
    });

    // Listen for new messages
    socket.on(`groupMessage:${groupId}`, (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socket.off(`groupMessage:${groupId}`);
  }, [groupId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(`/groups/${groupId}/message`, { text });
      socket.emit('sendGroupMessage', { groupId, msg: res.data });
      setText('');
    } catch {
      alert('Failed to send message');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Group Chat</h3>
      <div className="border p-3 mb-3" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <strong>{m.sender.name || m.sender}:</strong> {m.text}
          </div>
        ))}
      </div>
      <div className="input-group">
        <input value={text} onChange={e => setText(e.target.value)} className="form-control" />
        <button onClick={handleSend} className="btn btn-primary">Send</button>
      </div>
    </div>
  );
}
