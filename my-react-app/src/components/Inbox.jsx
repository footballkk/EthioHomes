import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
        const res = await axios.get('https://homeeasebackend.onrender.com/conversations', {
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
    <div style={{ padding: '20px' }}>
      <ToastContainer />
      <h2>📥 Inbox</h2>
      {conversations.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {conversations.map((conv) => {
            // adjust user id key to your actual data
            const currentUserId = currentUser?._id || currentUser?.userId || '';
            const otherUser = conv.participants.find((p) => p !== currentUserId);
            return (
              <li key={conv._id} style={{ marginBottom: '10px' }}>
                <Link to={`/chat/${otherUser}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                  Message with {otherUser}
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
