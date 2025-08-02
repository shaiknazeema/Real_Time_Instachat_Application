import { useEffect } from 'react';

export default function VideoCallPage({ roomID }) {
  useEffect(() => {
    const appID = 1576726020; 
    const serverSecret = '20269e7d7408b605899b9ee995546857'; 

    const userID = 'user' + Date.now();
    const userName = userID;

    const kitToken = window.ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName
    );

    const zp = window.ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: document.getElementById('videoContainer'),
      scenario: { mode: window.ZegoUIKitPrebuilt.OneONoneCall },
      showPreJoinView: false
    });
  }, [roomID]);

  return <div id="videoContainer" style={{ width: '100%', height: '100vh' }}></div>;
}
