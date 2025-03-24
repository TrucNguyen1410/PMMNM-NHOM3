import React, { useState, useEffect } from "react";
import "./Chatbot.css"; // Import file CSS

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/chats/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setMessages(Array.isArray(data.messages) ? data.messages : []);
      })
      .catch((err) => console.error("Error fetching chat history:", err));
  }, []);

  const sendMessage = async () => {
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
      console.log("Response from API:", data);

      if (data && data.response) {
        const botMessage = { sender: "bot", message: data.response };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="chat-header">CHATBOT AI</div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
          />
          <button onClick={sendMessage}>📤</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
