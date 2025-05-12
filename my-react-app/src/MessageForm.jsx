import React, { useState } from 'react';
import axios from 'axios';

const MessageForm = ({ senderId, receiverId }) => {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/messages', {
        senderId,
        receiverId,
        content,
      });
      setStatus('Message sent!');
      setContent('');
    } catch (error) {
      setStatus('Failed to send message.');
    }
  };

  return (
    <form onSubmit={handleSend}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your message..."
        required
      />
      <button type="submit">Send</button>
      <p>{status}</p>
    </form>
  );
};

export default MessageForm;
