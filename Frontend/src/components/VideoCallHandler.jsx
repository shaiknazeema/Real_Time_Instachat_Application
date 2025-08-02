import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../api/socket";

export default function VideoCallHandler({ currentUser }) {
  const [incomingCall, setIncomingCall] = useState(null); // { roomID, fromUserName }
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('incomingCall', ({ roomID, fromUserName }) => {
      setIncomingCall({ roomID, fromUserName });
    });

    socket.on('callRejected', () => {
      alert('Call rejected');
    });

    return () => {
      socket.off('incomingCall');
      socket.off('callRejected');
    };
  }, []);

  const acceptCall = () => {
    navigate(`/video/${incomingCall.roomID}`);
    setIncomingCall(null);
  };

  const rejectCall = () => {
    // send back reject to caller
    socket.emit('rejectCall', { toUserId: currentUser._id });
    setIncomingCall(null);
  };

  if (!incomingCall) return null;

  return (
    <div className="position-fixed top-50 start-50 translate-middle bg-white border rounded p-3 shadow" style={{ zIndex: 1000 }}>
      <p><strong>{incomingCall.fromUserName}</strong> is calling you...</p>
      <button onClick={acceptCall} className="btn btn-success me-2">Accept</button>
      <button onClick={rejectCall} className="btn btn-danger">Reject</button>
      <VideoCallHandler currentUser={user} />
    </div>
  );
}
