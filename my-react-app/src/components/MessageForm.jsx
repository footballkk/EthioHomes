import React, { useState } from 'react';
import axios from '../utils/axiosInstance'; // ✅ use JWT-authenticated Axios

const MessageForm = ({ senderId, receiverId }) => {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/messages', {
        senderId,
        receiverId,
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
      {status && <p style={{ marginTop: '8px', color: status.includes('Failed') ? 'red' : 'green' }}>{status}</p>}
    </form>
  );
};

export default MessageForm;
