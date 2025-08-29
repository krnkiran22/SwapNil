"use client";
import { useEffect } from 'react';
import { Loader } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import { Experience } from '../components/Experience';
import { UI } from '../components/UI';
import { ChatProvider } from '../hooks/useChat';  
import "./AiAgent.css"; 

function AiAgent() {
  useEffect(() => {
    // Extract the `userid` from the URL
    const urlParts: string[] = window.location.pathname.split('/');
    const userid: string | undefined = urlParts[1];
    console.log(userid, urlParts);
    if (userid) {
      localStorage.setItem('gfuserid', userid);
      console.log('userid stored in localStorage: ', userid);
    } else {
      console.log('User not found..!');
    }
  }, []); // Empty dependency array

  return (
    <ChatProvider>
      <div className="aiagent-root">
        <Loader />
        <Leva hidden />
        <div className="relative w-full h-full">
          <Canvas
            shadows
            camera={{ position: [0, 0, 1], fov: 30 }}
            className="absolute inset-0 z-0"
          >
            <Experience />
          </Canvas>
          <div className="absolute inset-0 z-10 pointer-events-none">
            <UI />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}

export default AiAgent;