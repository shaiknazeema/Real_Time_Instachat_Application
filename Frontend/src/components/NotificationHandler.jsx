// NotificationHandler.jsx
import { useEffect, useState } from 'react';
import socket from '../api/socket';

export default function NotificationHandler({ currentUser }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    // join room
    socket.emit('join', currentUser._id);

    // listen
    socket.on('notifyFriendRequest', (requesterName) => {
      setNotifications(prev => [...prev, { type: 'friendRequest', message: `New friend request from ${requesterName}` }]);
    });

    socket.on('notifyRequestAccepted', (acceptorName) => {
      setNotifications(prev => [...prev, { type: 'requestAccepted', message: `${acceptorName} accepted your friend request` }]);
    });

    socket.on('notifyMessage', ({ fromName }) => {
      setNotifications(prev => [...prev, { type: 'message', message: `New message from ${fromName}` }]);
    });

    // cleanup
    return () => {
      socket.off('notifyFriendRequest');
      socket.off('notifyRequestAccepted');
      socket.off('notifyMessage');
    };
  }, [currentUser]);

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map((n, idx) => (
        <div key={idx} className="bg-blue-500 text-white px-3 py-2 rounded shadow">
          {n.message}
        </div>
      ))}
    </div>
  );
}
