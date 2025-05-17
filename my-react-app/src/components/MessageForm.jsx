import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MessageForm = ({ receiverId, propertyId }) => {
  const [text, setText] = useState('');
  const [conversationId, setConversationId] = useState(null);

const currentUser = JSON.parse(localStorage.getItem('user'));
const currentUserId = currentUser?.userId;
const token = currentUser?.token;

  // 🔧 Step 1: Get or create the conversation when the component mounts
useEffect(() => {
  const getOrCreateConversation = async () => {
    try {
      console.log('📤 Sending to backend:', {
        sellerId: receiverId,
        propertyId: propertyId,
      });
      const res = await axios.post(
        'https://homeeasebackend.onrender.com/api/conversations/findOrCreate',
        {
          sellerId: receiverId,      // ✅ Match backend expectations
          propertyId: propertyId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('✅ Conversation created/found:', res.data);
      setConversationId(res.data._id);
    } catch (err) {
      console.error('❌ Error getting/creating conversation:', err);
      toast.error('Failed to create/find conversation');
    }
  };
  if (currentUserId && receiverId && propertyId) {
    getOrCreateConversation();
  }
}, [currentUserId, receiverId, propertyId, token]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.warning('Please enter a message');
      return;
    }

    if (!conversationId) {
      toast.error('Conversation not ready yet');
      return;
    }

    const payload = {
      conversationId,
      receiverId,
      senderId: currentUserId, // ✅ Add this
      text,
    };

    console.log("📤 Sending message payload:", payload);

    try {
      const res = await axios.post(
        'https://homeeasebackend.onrender.com/api/messages',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Message sent!');
      setText('');
    } catch (err) {
      console.error('❌ Error sending message:', err);
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
