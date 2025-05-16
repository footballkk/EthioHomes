import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MessageForm from './MessageForm'; // Reuse your form
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChatPage = () => {
 const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.error('Please log in to view this page');
      return;
    }
    setCurrentUser(user);

    // Fetch messages between current user and receiver
    const fetchMessages = async () => {
      try {

const res = await axios.get(`https://homeeasebackend.onrender.com/api/messages/${user._id}`, {
  headers: { Authorization: `Bearer ${user.token}` }
});
    setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch messages', err);
        toast.error('Failed to load messages');
      }
    };

    fetchMessages();
  }, [id]);

  return (
    <div style={{ padding: '20px' }}>
      <ToastContainer />
      <h2>💬 Chat with Seller</h2>
      <div style={{ marginBottom: '20px', maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: '10px', textAlign: msg.senderId === currentUser?._id ? 'right' : 'left' }}>
              <span style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: '16px',
                background: msg.senderId === currentUser?._id ? '#DCF8C6' : '#EEE',
                maxWidth: '70%',
              }}>
                {msg.text}
              </span>
            </div>
          ))
        )}
      </div>

      {currentUser && (
        <MessageForm senderId={currentUser._id} conversationId={id} />
      )}
    </div>
  );
};

export default ChatPage;
