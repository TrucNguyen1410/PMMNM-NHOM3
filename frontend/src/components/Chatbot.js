import React, { useState, useEffect } from "react";
import "./Chatbot.css";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Kiểm tra trạng thái đăng nhập

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token); // Nếu có token, người dùng đã đăng nhập

    fetch("http://127.0.0.1:8000/api/chats/")
      .then((res) => res.json())
      .then((data) => {
        setMessages(Array.isArray(data.messages) ? data.messages : []);
      })
      .catch((err) => console.error("Error fetching chat history:", err));

    if (!token) {
      setMessages([{ sender: "bot", message: "Bạn phải đăng nhập mới được chat với botchat." }]);
    }
  }, []);

  const sendMessage = async () => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      setMessages([...messages, { sender: "bot", message: "Bạn phải đăng nhập mới được chat với botchat." }]);
      return;
    }

    if (!input.trim()) return;
    const userMessage = { sender: "user", message: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data && data.response) {
        const botMessage = { sender: "bot", message: data.response };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      const firstUserMessage = messages.find((msg) => msg.sender === "user")?.message || "Không có tin nhắn";
      const newConversation = {
        id: conversations.length + 1,
        firstMessage: firstUserMessage,
        history: messages,
      };
      setConversations((prev) => [...prev, newConversation]);
    }

    setMessages([]);
    setMessages([{ sender: "bot", message: "Chào bạn! Tôi là Chatbot AI, rất vui được trò chuyện với bạn!" }]);
  };

  const handleConversationClick = (conversation) => {
    setMessages(conversation.history);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    setMessages([{ sender: "bot", message: "Bạn đã đăng xuất. Đăng nhập để tiếp tục chat." }]);
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="sidebar-header">Trang chủ</div>
        <button onClick={handleNewChat}>Tạo cuộc trò chuyện mới</button>

        {conversations.length > 0 && (
          <div className="conversation-list">
            <h4>Lịch sử trò chuyện</h4>
            {conversations.map((conversation) => (
              <div key={conversation.id} className="conversation-item" onClick={() => handleConversationClick(conversation)}>
                {conversation.firstMessage}
              </div>
            ))}
          </div>
        )}

        {isLoggedIn ? (
          <button className="close-button" onClick={handleLogout}>
            Đăng xuất
          </button>
        ) : (
          <button className="close-button" onClick={handleLogin}>
            Đăng nhập
          </button>
        )}
      </div>

      <div className="chat-box">
        <div className="chat-header">CHATBOT AI</div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.sender === "bot" ? <ReactMarkdown>{msg.message}</ReactMarkdown> : <p>{msg.message}</p>}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Nhập tin nhắn..." />
          <button onClick={sendMessage}>📤</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
