import { Link, useNavigate } from 'react-router-dom';
import { FaVideo } from 'react-icons/fa';

export default function FriendItem({ friend }) {
  const navigate = useNavigate();

  const handleVideoCall = () => {
    navigate(`/video/${friend._id}`);
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-2">
      <span>{friend.name}</span>
      <div>
        <Link to={`/chat/${friend._id}`} className="btn btn-sm btn-primary me-1">Chat</Link>
        <button onClick={handleVideoCall} className="btn btn-sm btn-outline-primary">
          <FaVideo />
        </button>
      </div>
    </div>
  );
}
