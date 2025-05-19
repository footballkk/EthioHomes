import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MessageForm from './MessageForm'; // Reuse your form
import '../../home.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChatPage = () => {
const { id: receiverId } = useParams();
 const [currentUser, setCurrentUser] = useState(null); 
 const [messages, setMessages] = useState([]);
 const [conversationId, setConversationId] = useState(null);
const navigate = useNavigate();
useEffect(() => {
    const userData = localStorage.getItem('user');

    if (!userData) {
      toast.error('Please log in to view this page');
      return;
    }

    let user;
    try {
      user = JSON.parse(userData);
    } catch (e) {
      toast.error('Corrupted login data. Please log in again.');
      return;
    }

    if (!user.userId || !user.token) {
      toast.error('Invalid user data. Please log in again.');
      return;
    }

    setCurrentUser(user);
  }, []);

  // 2️⃣ Fetch messages once currentUser and receiverId are set
  useEffect(() => {
    if (!currentUser || !receiverId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://homeeasebackend.onrender.com/api/messages/${currentUser.userId}/${receiverId}/direct`,
          {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }
        );
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch messages', err);
        toast.error('Failed to load messages');
      }
    };

    fetchMessages();
  }, [currentUser, receiverId]);

  // 3️⃣ Fetch conversationId based on users
  useEffect(() => {
    if (!currentUser || !receiverId) return;

    const fetchConversationId = async () => {
      try {
        const res = await axios.get(
          `https://homeeasebackend.onrender.com/api/conversations/${currentUser.userId}/${receiverId}`,
          {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }
        );
        setConversationId(res.data._id);
      } catch (err) {
        console.error('Failed to fetch conversation ID', err);
      }
    };

    fetchConversationId();
  }, [currentUser, receiverId]);

  // 4️⃣ Mark messages as seen when conversationId is available
useEffect(() => {
  if (!conversationId || !currentUser) return;

  const markAsSeenAndRefresh = async () => {
    try {
      await axios.put(
        `https://homeeasebackend.onrender.com/api/messages/markAsSeen/${conversationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      // ✅ Re-fetch messages to reflect new seen statuses
      const res = await axios.get(
        `https://homeeasebackend.onrender.com/api/messages/${currentUser.userId}/${receiverId}/direct`,
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to mark messages as seen or fetch updated messages', err);
    }
  };

  markAsSeenAndRefresh();
}, [conversationId, currentUser, receiverId]);


  return (
<div className="chat-container">
  <ToastContainer />
   <div className="chat-header">
    <button className="back-button" onClick={() => navigate(-1)}>←</button>
    <h2>💬 Chat with {currentUser?.role === 'seller' ? 'Buyer' : 'Seller'}</h2>
  </div>
  <div className="chat-box">
    {messages.length === 0 ? (
      <p>No messages yet.</p>
    ) : (
messages.map((msg, index) => (
  <div
    key={index}
    className={`message-bubble ${msg.senderId === currentUser?._id ? 'sent' : 'received'}`}
  >
    <span>{msg.text}</span>

    {/* Only show ✓ or ✓✓ for messages sent by the current user */}
    {msg.senderId === currentUser?._id && (
      <small style={{ fontSize: '10px', marginLeft: '8px', color: 'blue' }}>
        {msg.seen ? '✓✓' : '✓'}
      </small>
    )}
  </div>
))

    )}
  </div>

  {currentUser && (
    <MessageForm senderId={currentUser.userId} receiverId={receiverId} />
  )}
</div>

  );
};

export default ChatPage;
