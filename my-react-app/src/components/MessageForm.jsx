import React, { useState } from 'react';
import axios from '../utils/axiosInstance'; // ✅ JWT-authenticated Axios

const MessageForm = ({ receiverId }) => {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();

    // ✅ Get sender (buyer) info from localStorage
    const senderId = localStorage.getItem('buyer_id');
    const senderName = localStorage.getItem('buyer_name');
    const senderEmail = localStorage.getItem('buyer_email');

    // ✅ Check if buyer is logged in
    if (!senderId || !senderName || !senderEmail) {
      console.error('No logged-in user found in localStorage.');
      alert('Please log in as a buyer to send a message.');
      return;
    }

    try {
      // ✅ Send message with complete info
      await axios.post('/messages', {
        sender_id: senderId,
        sender_name: senderName,
        sender_email: senderEmail,
        receiver_id: receiverId,
        content,
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
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your message..."
        required
        style={{ width: '100%', height: '80px', marginBottom: '8px' }}
      />
      <button type="submit" className="btn btn-primary">Send</button>
      {status && (
        <p style={{ marginTop: '8px', color: status.includes('Failed') ? 'red' : 'green' }}>
          {status}
        </p>
      )}
    </form>
  );
};

export default MessageForm;
