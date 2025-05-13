import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance'; // Import the axios instance
import MessageForm from './MessageForm'; // Make sure it's imported

const Inbox = ({ userId, otherUserId }) => {
  const [messages, setMessages] = useState([]);
  const [replyToId, setReplyToId] = useState(null);
  const [page, setPage] = useState(1); // State for page number
  const [loading, setLoading] = useState(false); // State to handle loading
  const [hasMore, setHasMore] = useState(true); // State to check if there are more messages

  // Fetch messages whenever userId, otherUserId, or page changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!otherUserId) return; // Don't try fetching if there's no other userId

      setLoading(true);

      try {
        const res = await axios.get(`/messages/conversation/${userId}/${otherUserId}?page=${page}&limit=20`);
        setMessages((prevMessages) => [...prevMessages, ...res.data]);
        setHasMore(res.data.length === 20); // If we received less than 20 messages, we might be at the last page
      } catch (err) {
        console.error('Failed to load messages', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId, otherUserId, page]); // Fetch messages whenever userId, otherUserId, or page changes

  const loadMoreMessages = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment page to load more
    }
  };

  return (
    <div>
      <h2>Inbox</h2>

      {/* Render messages */}
      {messages.map((msg) => (
        <div key={msg._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '1rem' }}>
          <strong>{msg.senderId === userId ? 'You' : 'Other'}:</strong>
          <p>{msg.content}</p>
          <small>{new Date(msg.timestamp).toLocaleString()}</small>

          {/* Reply button */}
          <button onClick={() => setReplyToId(replyToId === msg._id ? null : msg._id)}>
            {replyToId === msg._id ? 'Cancel Reply' : 'Reply'}
          </button>

          {/* Reply form */}
          {replyToId === msg._id && (
            <div style={{ marginTop: '10px' }}>
              <MessageForm senderId={userId} receiverId={otherUserId} />
            </div>
          )}
        </div>
      ))}

      {/* Button to load more messages */}
      {hasMore && (
        <button onClick={loadMoreMessages} disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? 'Loading...' : 'Load More Messages'}
        </button>
      )}
    </div>
  );
};

export default Inbox;
