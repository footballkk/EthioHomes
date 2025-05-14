// src/components/MessageThread.jsx
import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';

const MessageThread = ({ threadId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(false);

  const currentUserId = localStorage.getItem('buyer_id') || localStorage.getItem('seller_id');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/messages/thread/${threadId}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };
    fetchMessages();
  }, [threadId]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const senderId = currentUserId;
    const receiverId =
      messages.find(msg => msg.senderId !== currentUserId)?.senderId || messages[0]?.receiverId;
    const propertyId = messages[0]?.propertyId;

    try {
      setLoading(true);
      await axios.post('/messages', {
        senderId,
        receiverId,
        content: newContent,
        propertyId,
      });
      setNewContent('');
      const res = await axios.get(`/messages/thread/${threadId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="thread-container">
      <button onClick={onBack} className="btn btn-secondary mb-2">⬅ Back to Inbox</button>
      <div className="message-thread" style={{ border: '1px solid #ccc', padding: 12, borderRadius: 6 }}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            style={{
              textAlign: msg.senderId === currentUserId ? 'right' : 'left',
              margin: '8px 0',
            }}
          >
            <p
              style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: '12px',
                background: msg.senderId === currentUserId ? '#d1e7dd' : '#f8d7da',
              }}
            >
              {msg.content}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendReply} style={{ marginTop: '12px' }}>
        <textarea
          className="form-control"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Type your reply..."
          rows={3}
          required
        />
        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Reply'}
        </button>
      </form>
    </div>
  );
};

export default MessageThread;
