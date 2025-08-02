import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ChatLayout from './pages/ChatLayout';
import ChatPage from './pages/ChatPage';
import VideoCallPage from './pages/VideoCallPage';
import GroupChatPage from './pages/GroupChatPage';

// Wrapper to extract roomID from URL and pass as prop
function VideoCallPageWrapper() {
  const { roomID } = useParams();
  return <VideoCallPage roomID={roomID} />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/group/:groupId" element={<GroupChatPage />} />


        {/* Chat layout parent, ChatPage child */}
        <Route path="/chat" element={<ChatLayout />}>
          <Route path=":otherUserId" element={<ChatPage />} />
        </Route>

        {/* Video call route */}
        <Route path="/video/:roomID" element={<VideoCallPageWrapper />} />

        {/* Default fallback */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
