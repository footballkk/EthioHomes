import React, { useState } from 'react';
import axios from '../utils/axiosInstance';

const MessageForm = ({ receiverId, propertyId }) => {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();

    // const senderId = localStorage.getItem('buyer_id') || localStorage.getItem('seller_id');
    const role = localStorage.getItem('role');

    if (!senderId || !role) {
      alert('Please log in.');
      return;
    }

    try {
      await axios.post('/messages', {
        senderId,
        receiverId,
        content,
        propertyId
      });
      setStatus('✅ Message sent!');
      setContent('');
    } catch (err) {
      console.error('Message sending failed:', err);
      setStatus('❌ Failed to send message.');
    }
  };

  return (
    <form onSubmit={handleSend}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        placeholder="Write a message..."
        style={{ width: '100%', height: '80px' }}
      />
      <button type="submit">Send</button>
      {status && <p style={{ color: status.includes('❌') ? 'red' : 'green' }}>{status}</p>}
    </form>
  );
};

export default MessageForm;
