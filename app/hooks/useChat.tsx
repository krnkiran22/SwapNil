import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";

const backendUrl = "http://127.0.0.1:5000/chat";

// Define interfaces
interface Message {
  text: string;
  [key: string]: any; // Allow additional properties for flexibility
}

interface ChatContextValue {
  chat: (message: string, language: string) => Promise<void>;
  message: Message | null;
  onMessagePlayed: () => void;
  loading: boolean;
  cameraZoomed: boolean;
  setCameraZoomed: (value: boolean) => void;
}

interface ChatProviderProps {
  children: ReactNode;
}

// Create context with undefined as initial value, type will be enforced by provider
const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cameraZoomed, setCameraZoomed] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const processingRef = useRef<boolean>(false);

  const chat = async (message: string, language: string = "en") => {
    setLoading(true);

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, language }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
      }

      const resp = await response.json();
      // Assume backend response has a `response` field with `messages` array
      if (resp.response && Array.isArray(resp.response.messages)) {
        setMessages(prev => [...prev, ...resp.response.messages]);
      } else {
        setMessages(prev => [
          ...prev,
          { text: "Sorry, invalid response from server." },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { text: "Sorry, there was an error processing your message." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Process messages queue
  useEffect(() => {
    if (!isPlaying && messages.length > 0 && !processingRef.current) {
      processingRef.current = true;
      const nextMessage = messages[0];
      setMessage(nextMessage);
      setIsPlaying(true);
    }
  }, [messages, isPlaying]);

  const onMessagePlayed = () => {
    setIsPlaying(false);
    processingRef.current = false;
    setMessages(prev => prev.slice(1));
    setMessage(null);
  };

  const contextValue: ChatContextValue = {
    chat,
    message,
    onMessagePlayed,
    loading,
    cameraZoomed,
    setCameraZoomed,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextValue => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};