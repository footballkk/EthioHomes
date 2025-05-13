import React, { useState } from 'react';
import axios from '../utils/axiosInstance'; // ✅ JWT-authenticated Axios

const MessageForm = ({ receiverId }) => {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();

    // ✅ Get sender info from localStorage
    const senderId = localStorage.getItem('buyer_id') || localStorage.getItem('seller_id');
    const senderName = localStorage.getItem('buyer_name') || localStorage.getItem('seller_name');
    const senderEmail = localStorage.getItem('buyer_email') || localStorage.getItem('seller_email');
    const userRole = localStorage.getItem('role'); // Check if the user is a buyer or seller

    // ✅ Check if user is logged in and has the correct role
    if (!senderId || !senderName || !senderEmail || !userRole) {
      console.error('No logged-in user found or incorrect role.');
      alert('Please log in to send a message.');
      return;
    }

    // ✅ Make sure the role is either buyer or seller
    if (userRole !== 'buyer' && userRole !== 'seller') {
      console.error('Invalid role detected.');
      alert('Invalid user role.');
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
      setContent(''); // Clear the content after sending
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
