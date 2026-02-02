import  { useState } from "react";
import "../style/chatbot.css";

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className={`chat-toggle logo-toggle ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle chat"
      >
        <img src="/cropped_icon_chatbot.png" alt="Chat" />
      </button>
      <div className={`chat-panel ${open ? "show" : ""}`}>
        <div className="chat-header">
          <span>Sonar AI</span>
        </div>

        <div className="chat-body">
          <div className="message bot">Szia! Én egy AI Chatbot vagyok!😊 Miben segíthetek?🍻</div>
        </div>

        <div className="chat-footer">
          <input placeholder="Írj valamit..." />
          <button>➤</button>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
