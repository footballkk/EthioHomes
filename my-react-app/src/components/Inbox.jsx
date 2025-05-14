import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import MessageForm from './MessageForm';

const Inbox = ({ userId, otherUserId }) => {
  const [messages, setMessages] = useState([]);
  const [replyToId, setReplyToId] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!otherUserId) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `/messages/conversation/${userId}/${otherUserId}?page=${page}&limit=20`
        );
        setMessages(prev => page === 1 ? res.data : [...prev, ...res.data]);
        setHasMore(res.data.length === 20);
      } catch (err) {
        console.error('Failed to load messages', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId, otherUserId, page]);

  const loadMoreMessages = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div>
      <h2>Inbox</h2>
      {messages.map((msg) => (
        <div key={msg._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '1rem' }}>
          <strong>{msg.senderId === userId ? 'You' : 'Other'}:</strong>
          <p>{msg.content}</p>
          <small>{new Date(msg.timestamp).toLocaleString()}</small>
          
          <button onClick={() => setReplyToId(replyToId === msg._id ? null : msg._id)}>
            {replyToId === msg._id ? 'Cancel Reply' : 'Reply'}
          </button>

          {replyToId === msg._id && (
            <div style={{ marginTop: '10px' }}>
              <MessageForm receiverId={otherUserId} />
            </div>
          )}
        </div>
      ))}

      {hasMore && (
        <button onClick={loadMoreMessages} disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? 'Loading...' : 'Load More Messages'}
        </button>
      )}
    </div>
  );
};

export default Inbox;