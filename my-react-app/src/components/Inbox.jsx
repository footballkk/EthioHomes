import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
      return; // Important to return early!
    }
    setCurrentUser(user);

    const fetchConversations = async () => {
      try {
        const res = await axios.get('https://homeeasebackend.onrender.com/api/conversations', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setConversations(res.data);
      } catch (err) {
        toast.error('Failed to load conversations');
        console.error(err);
      }
    };

    fetchConversations();
  }, []);

  return (
 <div className="inbox-container">
  <ToastContainer />
  <h2 className="inbox-header">📥 Inbox</h2>
  {conversations.length === 0 ? (
    <p>No conversations yet.</p>
  ) : (
    <ul className="inbox-list">
      {conversations.map((conv) => {
        const currentUserId = currentUser?._id || currentUser?.userId || '';
        const otherUser = conv.participants.find((p) => p._id !== currentUserId);
        return (
          <li key={conv._id}>
            <Link to={`/chat/${conv._id}`} className="inbox-link">
              Message with {otherUser?.email || 'User'}
            </Link>
          </li>
        );
      })}
    </ul>
  )}
</div>
  );
};

export default Inbox;
