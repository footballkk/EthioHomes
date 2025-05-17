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
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.error('Please log in to view this page');
      return;
    }
    setCurrentUser(user);

    if (!receiverId) {
      toast.error('Receiver ID missing from URL');
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`https://homeeasebackend.onrender.com/api/messages/${user._id}/${receiverId}/direct`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
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
    <MessageForm senderId={currentUser._id} receiverId={receiverId} />
  )}
</div>

  );
};

export default ChatPage;
