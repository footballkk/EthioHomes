import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MessageForm from './MessageForm'; // 👈 Make sure it's imported

const Inbox = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [replyToId, setReplyToId] = useState(null);

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
      {messages.map((msg) => {
        const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
        return (
          <div key={msg._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '1rem' }}>
            <strong>{msg.senderId === userId ? 'You' : 'Other'}:</strong>
            <p>{msg.content}</p>
            <small>{new Date(msg.timestamp).toLocaleString()}</small>

            {/* 👇 Toggle reply box */}
            <button onClick={() => setReplyToId(replyToId === msg._id ? null : msg._id)}>
              {replyToId === msg._id ? 'Cancel Reply' : 'Reply'}
            </button>

            {replyToId === msg._id && (
              <div style={{ marginTop: '10px' }}>
                <MessageForm senderId={userId} receiverId={otherUserId} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default Inbox;
