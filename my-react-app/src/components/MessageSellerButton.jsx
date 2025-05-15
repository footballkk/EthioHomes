import React, { useState } from 'react';
import MessageForm from './MessageForm';

const MessageSellerButton = ({ sellerId, buyerId }) => {
  const [showMessageBox, setShowMessageBox] = useState(false);

  const toggleMessageBox = () => {
    setShowMessageBox(!showMessageBox);
  };

  const conversationId = [buyerId, sellerId].sort().join('_'); // consistent ID generation

  return (
    <div>
      <button className="btn btn-primary btn-sm" onClick={toggleMessageBox}>
        {showMessageBox ? 'Cancel' : 'Message Seller'}
      </button>

      {showMessageBox && (
        <div style={{ marginTop: '10px' }}>
          <MessageForm
            receiverId={sellerId}
            conversationId={conversationId}
          />
        </div>
      )}
    </div>
  );
};

export default MessageSellerButton;
