// src/components/Sidebar.jsx
import FriendList from './FriendList';

export default function Sidebar({ friends, friendRequests, onAccept, onReject, currentUser }) {
  return (
    <div className="p-3 border-end" style={{ width: '250px', height: '100vh' }}>
      <h5>Friend Requests</h5>
      {friendRequests.length === 0 && <div className="text-muted">No pending requests</div>}
      {friendRequests.map((req) => (
        <div key={req._id} className="mb-2 d-flex justify-content-between align-items-center">
          <span>{req.name}</span>
          <div>
            <button
              className="btn btn-sm btn-success me-1"
              onClick={() => onAccept(req._id)}
            >
              Accept
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onReject(req._id)}
            >
              Reject
            </button>
          </div>
        </div>
      ))}

      <h5 className="mt-4">Friends</h5>
      <FriendList friends={friends} currentUser={currentUser} />
    </div>
  );
}
