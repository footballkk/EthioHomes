import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';

const Inbox = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedThread, setSelectedThread] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  const userId = localStorage.getItem('buyer_id') || localStorage.getItem('seller_id');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`/messages/conversations/${userId}`);
        setConversations(res.data);
      } catch (err) {
        console.error('Error loading conversations:', err);
      }
    };

    fetchConversations();
  }, [userId]);

  const openThread = async (participantId, propertyId) => {
    try {
      const res = await axios.get(`/messages/thread/${userId}/${participantId}/${propertyId}`);
      setSelectedThread(res.data);
      setActiveConversation({ participantId, propertyId });
    } catch (err) {
      console.error('Error loading thread:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Your Inbox</h3>
      <div className="row">
        <div className="col-md-4">
          <ul className="list-group">
            {conversations.map((conv, idx) => (
              <li
                key={idx}
                className="list-group-item list-group-item-action"
                onClick={() => openThread(conv.participant._id, conv.property._id)}
              >
                💬 {conv.participant.full_name} – 🏠 {conv.property.location}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-8">
          {activeConversation && (
            <>
              <h5>Conversation with {conversations.find(c => c.participant._id === activeConversation.participantId)?.participant.full_name}</h5>
              <div style={{ border: '1px solid #ccc', padding: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                {selectedThread.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      textAlign: msg.senderId === userId ? 'right' : 'left',
                      marginBottom: '10px'
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '8px',
                        borderRadius: '10px',
                        backgroundColor: msg.senderId === userId ? '#DCF8C6' : '#F1F0F0'
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
