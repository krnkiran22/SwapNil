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

  // Optionally, you can persist conversation_id in state if you want to keep the conversation going
  const [conversationId, setConversationId] = useState<string | null>(null);

  const chat = async (message: string, language: string = "en") => {
    setLoading(true);

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: message, conversation_id: conversationId }),
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

      // If backend returns a new conversation_id, update it
      if (resp.conversation_id) {
        setConversationId(resp.conversation_id);
      }
      // Assume backend response has a `response` field with `messages` array
      
      // Function to parse HTML and extract text content
      const parseHtmlToText = (html: string): string => {
        if (typeof window !== 'undefined') {
          // Create a temporary div to parse HTML and extract text
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;
          return tempDiv.textContent || tempDiv.innerText || html;
        }
        // Fallback for server-side rendering - simple HTML tag removal
        return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
      };
      

      if (resp.response && Array.isArray(resp.response.messages)) {
        // Combine all text from messages array and create a single message
        const combinedText = resp.response.messages
          .map((msg: any) => msg.text || "")
          .filter((text: string) => text.trim() !== "")
          .join(" ");
        
        const cleanText = parseHtmlToText(combinedText);
        
        if (cleanText.trim()) {
          setMessages(prev => [...prev, { text: cleanText }]);
        }
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