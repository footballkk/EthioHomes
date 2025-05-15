import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MessageForm = ({ senderId, receiverId, propertyId }) => {
  const [text, setText] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.warning('Please enter a message');
      return;
    }
console.log("Sending message payload:", {
    senderId,
    receiverId,
    propertyId,
    text,
  });
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const res = await axios.post('https://homeeasebackend.onrender.com/api/messages', {
        text,
        receiverId,
        propertyId,
        // Backend expects a conversationId, so we create a new or existing one automatically
        conversationId: `${[senderId, receiverId].sort().join('_')}` // unique & consistent
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Message sent!');
      setText('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
    }
  };

  return (
    <form onSubmit={handleSend} style={{ display: 'flex', marginTop: '10px' }}>
      <input
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="form-control"
        style={{ marginRight: '10px' }}
      />
      <button type="submit" className="btn btn-success">Send</button>
    </form>
  );
};

export default MessageForm;
