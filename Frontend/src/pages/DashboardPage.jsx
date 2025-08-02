// src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getMe, acceptFriendRequest } from '../api/user';
import Sidebar from '../components/Sidebar';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      loadData();
      loadAllUsers();
    }
  }, []);

  const loadData = async () => {
  try {
    const res = await getMe(token);
    setUser(res.data);
    localStorage.setItem('userId', res.data._id);

    // ✅ Join socket room after loading
    socket.emit('join', res.data._id);
  } catch (err) {
    setMsg('Failed to load data');
  }
};


  const loadAllUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllUsers(res.data);
    } catch {}
  };

  const handleAccept = async (requesterId) => {
    try {
      await acceptFriendRequest(token, requesterId);
      setMsg('Friend request accepted!');
      loadData();
      loadAllUsers();
    } catch {
      setMsg('Failed to accept request');
    }
  };

  const handleReject = async (requesterId) => {
    try {
      await axios.post('http://localhost:5000/api/friends/reject', { requesterId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('Friend request rejected!');
      loadData();
      loadAllUsers();
    } catch {
      setMsg('Failed to reject request');
    }
  };

  const handleSendRequest = async (targetUserId) => {
    try {
      await axios.post('http://localhost:5000/api/friends/send', { targetUserId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('Friend request sent!');
      loadAllUsers();
    } catch {
      setMsg('Failed to send request');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="d-flex">
      <Sidebar
        friends={user.friends}
        friendRequests={user.friendRequests}
        onAccept={handleAccept}
        onReject={handleReject}
        currentUser={user} // ✅ pass user as currentUser
      />

      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Welcome, {user.name} 👋</h2>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>

        {msg && <div className="alert alert-info">{msg}</div>}

        <h4>All Users</h4>
        <ul className="list-group mb-4">
          {allUsers.length === 0 && <li className="list-group-item">No users to add</li>}
          {allUsers.map(u => (
            <li key={u._id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{u.name} ({u.email})</span>
              <button className="btn btn-primary btn-sm" onClick={() => handleSendRequest(u._id)}>
                Send Request
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
