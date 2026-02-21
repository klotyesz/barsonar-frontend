import { useState, useRef, useEffect } from "react";
import "../style/chatbot.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Szia! Én egy AI Chatbot vagyok! 😊 Miben segíthetek? 🍻",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      setTimeout(() => {
        chatBodyRef.current!.scrollTop = chatBodyRef.current!.scrollHeight;
      }, 0);
    }
  }, [messages, loading]);

  // Auto-grow input field
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 100) + "px";
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "assistant",
        content: data.response || "Hiba történt a válaszban 😢",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Hiba történt 😢" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`chat-widget ${open ? "open" : ""}`}
      onClick={!open ? () => setOpen(true) : undefined}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        !open && (e.key === "Enter" || e.key === " ") && setOpen(true)
      }
      aria-label={open ? undefined : "Open chat"}
    >
      <div className="chat-widget-inner">
        <div className="chat-bubble-icon">
          <img src="/cropped_icon_chatbot.png" alt="" />
        </div>

        <div className="chat-panel-content">
          <div className="chat-header">
            <span>Sonar AI</span>
            <button
              className="chat-close"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.role === "user" ? "user" : "bot"}`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="loading-animation">
                <DotLottieReact
                  src="https://lottie.host/8ceb8748-453e-47d2-98a8-363fc5b5e2b5/AKFj9xGtTQ.lottie"
                  loop
                  autoplay
                />
              </div>
            )}
          </div>

          <div className="chat-footer" onClick={(e) => e.stopPropagation()}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Írj valamit..."
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
