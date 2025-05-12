import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Inbox = ({ userId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/${userId}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to load messages', err);
      }
    };
    fetchMessages();
  }, [userId]);

  return (
    <div>
      <h2>Inbox</h2>
      {messages.map((msg) => (
        <div key={msg._id}>
          <strong>{msg.senderId === userId ? 'You' : 'Other'}:</strong>
          <p>{msg.content}</p>
          <small>{new Date(msg.timestamp).toLocaleString()}</small>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Inbox;
