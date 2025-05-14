import React, { useState } from 'react';
import axios from '../utils/axiosInstance';

const MessageForm = ({ receiverId }) => {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();

    const senderId = localStorage.getItem('buyer_id') || localStorage.getItem('seller_id');
    const userRole = localStorage.getItem('role');

    if (!senderId || !userRole) {
      alert('Please log in to send a message.');
      return;
    }

    if (userRole !== 'buyer' && userRole !== 'seller') {
      alert('Invalid user role.');
      return;
    }

    try {
      await axios.post('/messages', {
        senderId,
        receiverId,
        content
      });

      setStatus('✅ Message sent!');
      setContent('');
    } catch (error) {
      console.error('Message sending failed:', error);
      setStatus('❌ Failed to send message.');
    }
  };

  return (
    <form onSubmit={handleSend} style={{ marginTop: '10px' }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.targetValue)}
        placeholder="Write your message..."
        required
        style={{ width: '100%', height: '80px', marginBottom: '8px' }}
      />
      <button type="submit" className="btn btn-primary">Send</button>
      {status && (
        <p style={{ marginTop: '8px', color: status.includes('❌') ? 'red' : 'green' }}>
          {status}
        </p>
      )}
    </form>
  );
};

export default MessageForm;