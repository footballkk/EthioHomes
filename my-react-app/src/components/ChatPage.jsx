import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MessageForm from './MessageForm'; // Reuse your form
import '../../home.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChatPage = () => {
const { id: receiverId } = useParams();
 const [currentUser, setCurrentUser] = useState(null); 
 const [messages, setMessages] = useState([]);

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

  // Ensure user has the required fields
  if (!user.userId || !user.token) {
    toast.error('Invalid user data. Please log in again.');
    return;
  }

  setCurrentUser(user);

  if (!receiverId) {
    toast.error('Receiver ID missing from URL');
    return;
  }

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `https://homeeasebackend.onrender.com/api/messages/${user.userId}/${receiverId}/direct`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      console.log('Fetched messages:', res.data);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
      toast.error('Failed to load messages');
    }
  };

  fetchMessages();
}, [receiverId]);


  return (
<div className="chat-container">
  <ToastContainer />
  <h2>💬 Chat with {currentUser?.role === 'seller' ? 'Buyer' : 'Seller'}</h2>

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
