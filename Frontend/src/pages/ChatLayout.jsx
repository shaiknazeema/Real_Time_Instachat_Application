import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getMe, acceptFriendRequest, rejectFriendRequest } from '../api/user';
import Sidebar from '../components/Sidebar';

export default function ChatLayout() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const res = await getMe(token);
      setUser(res.data);
    } catch (err) {
      console.error('AxiosError:', err);
    }
  };

  const handleAccept = async (requesterId) => {
    try {
      const token = localStorage.getItem('token');
      await acceptFriendRequest(token, requesterId);
      loadUser(); // reload user after accepting
    } catch (err) {
      console.error('Failed to accept friend:', err);
    }
  };

  const handleReject = async (requesterId) => {
    try {
      const token = localStorage.getItem('token');
      await rejectFriendRequest(token, requesterId);
      loadUser(); // reload user after rejecting
    } catch (err) {
      console.error('Failed to reject friend:', err);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        friends={user.friends}
        friendRequests={user.friendRequests}
        onAccept={handleAccept}
        onReject={handleReject}
      />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}
