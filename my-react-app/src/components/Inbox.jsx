import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance'; // uses centralized token
import '../../home.css';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Inbox = () => {
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.error('Please log in to view your inbox');
      return;
    }
    setCurrentUser(user);

    const fetchConversations = async () => {
      try {
        const res = await axios.get('/api/conversations'); // no manual header
        setConversations(res.data);
      } catch (err) {
        toast.error('Failed to load conversations');
        console.error(err);
      }
    };

    fetchConversations();
  }, []);

  const currentUserId = currentUser?.userId || currentUser?._id || '';

  return (
    <div className="inbox-container">
      <ToastContainer />
      <h2 className="inbox-header">📥 Inbox</h2>
      {conversations.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <ul className="inbox-list">
          {conversations.map((conv) => {
            const otherUser = conv.participants.find((p) => p._id !== currentUserId);
            if (!otherUser) return null;

            return (
              <li key={conv._id}>
                <Link to={`/chat/${otherUser._id}`} className="inbox-link">
                  Message with {otherUser?.email || 'User'}
                </Link>
                <p>Property: {conv.property?.title || 'Unknown Property'}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Inbox;
