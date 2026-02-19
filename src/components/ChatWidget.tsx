import { useState } from "react";
import "../style/chatbot.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};


const WORKER_URL = "https://barsonar-ai.ifj-sarkadi-g.workers.dev";

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Szia! Én egy AI Chatbot vagyok! 😊 Miben segíthetek? 🍻",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
      onKeyDown={(e) => !open && (e.key === "Enter" || e.key === " ") && setOpen(true)}
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

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.role === "user" ? "user" : "bot"}`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="message bot">Gondolkodom...</div>
            )}
          </div>

          <div
            className="chat-footer"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
