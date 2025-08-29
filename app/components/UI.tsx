import { useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { FaMicrophone } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

// Define interfaces
interface Message {
  text: string;
  animation?: string; // Optional animation for Avatar (e.g., "Idle", "Talking")
  expression?: string; // Optional facial expression for Avatar (e.g., "smile", "sad")
}

interface ChatContext {
  chat: (text: string, language: string) => void;
  loading: boolean;
  cameraZoomed: boolean;
  setCameraZoomed: (value: boolean) => void;
  message: Message | null;
}

interface UIProps {
  hidden?: boolean;
  [key: string]: any; // Allow additional props for flexibility
}

export const UI = ({ hidden, ...props }: UIProps) => {
  const input = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [language, setLanguage] = useState<"en" | "te" | "ur" | "hi">("en");
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat() as ChatContext;

  // Sends a message to the backend via the chat function, which triggers the AI response
  // The response is processed in ChatProvider and used to update the Avatar's state (e.g., animation, expression)
  const sendMessage = (text: string) => {
    if (!loading && !message && text && text.trim()) {
      chat(text, language); // Calls backend API to process AI response
      if (input.current) {
        input.current.value = "";
      }
    }
  };

  // Handles voice input using Web Speech API, converting speech to text and sending it to the AI
  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition() as SpeechRecognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === "te" ? "te-IN" : language === "ur" ? "ur-PK" : language === "hi" ? "hi-IN" : "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          if (input.current) {
            input.current.value = transcript;
          }
          setTimeout(() => {
            sendMessage(transcript); // Sends transcribed text to AI backend
          }, 2000);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  if (hidden) {
    return null;
  }

  return (
    <div className="overflow-hidden min-h-screen">
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        <div
          className="self-start backdrop-blur-md bg-white bg-opacity-50 p-3 sm:p-4 rounded-lg max-w-full sm:max-w-md"
          style={{ padding: '10px' }}
        >
          {/* Placeholder for additional UI elements if needed */}
        </div>
        <div className="w-full flex flex-col sm:flex-row items-end justify-center gap-4" style={{ display: 'grid', justifyItems: 'start', alignContent: 'stretch', justifyContent: 'end' }}>
          <select
            className="pointer-events-auto p-2 rounded-md bg-white text-black bg-opacity-75 text-sm"
            value={language}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value as "en" | "te" | "ur" | "hi")}
          >
            <option value="en">English</option>
            <option value="te">Telugu</option>
            <option value="ur">Urdu</option>
            <option value="hi">Hindi</option>
          </select>
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="pointer-events-auto bg-blue-200 hover:bg-blue-400 text-white p-3 sm:p-4 transition duration-200 group"
            id="btn"
          >
            {cameraZoomed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#333333"
                className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 group-hover:stroke-white svg-path"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#333333"
                className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 group-hover:stroke-white svg-path"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            )}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="pointer-events-auto bg-blue-200 hover:bg-blue-400 text-white p-3 sm:p-4 transition duration-200 group"
            id="btn"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 group-hover:stroke-white"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                className="svg-path"
                stroke="#333333"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              >
                <path d="M19.933 13.041a8 8 0 1 1-9.925-8.788c3.899-1 7.935 1.007 9.425 4.747" />
                <path d="M20 4v5h-5" />
              </g>
            </svg>
          </button>
          <style>{`
            #btn:hover .svg-path {
              stroke: white;
            }
          `}</style>
        </div>
        {message && message.text && (
          <div className="self-center bg-gray-100 bg-opacity-75 p-3 sm:p-4 rounded-lg mt-10 sm:mt-20 inline-block w-fit">
            <p className="text-xs sm:text-sm lg:text-base text-gray-900">{message.text}</p>
          </div>
        )}
        <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto mt-4">
          <input
            className="w-full placeholder:text-gray-800 placeholder:italic p-3 sm:p-4 rounded-md bg-opacity-50 bg-white text-black backdrop-blur-md text-xs sm:text-sm"
            placeholder={language === "te" ? "సందేశాన్ని టైప్ చేయండి..." : language === "ur" ? "ایک پیغام ٹائپ کریں..." : language === "hi" ? "एक संदेश टाइप करें..." : "Type a message..."}
            ref={input}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                sendMessage((e.target as HTMLInputElement).value);
              }
            }}
          />
          <button
            onClick={() => startVoiceInput()}
            className={`bg-red-200 hover:bg-red-400 text-gray-800 hover:text-white p-2 sm:p-4 rounded-md transition duration-200 ${
              isListening ? "animate-pulse" : ""
            }`}
          >
            <FaMicrophone className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            disabled={loading || !!message}
            onClick={() => input.current && sendMessage(input.current.value)}
            className={`bg-blue-200 hover:bg-blue-400 text-gray-800 hover:text-white p-2 sm:p-4 font-semibold uppercase rounded-md transition duration-200 flex items-center gap-2 ${
              loading || message ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <IoSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};