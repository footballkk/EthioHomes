import React, { useState } from 'react';
import MessageForm from './MessageForm';

const MessageSellerButton = ({ sellerId, buyerId, propertyId }) => {
  const [showMessageBox, setShowMessageBox] = useState(false);

  const toggleMessageBox = () => {
    setShowMessageBox(!showMessageBox);
  };

  return (
    <div>
      <button className="btn btn-primary btn-sm" onClick={toggleMessageBox}>
        {showMessageBox ? 'Cancel' : 'Message Seller'}
      </button>

      {showMessageBox && (
        <div style={{ marginTop: '10px' }}>
          <MessageForm senderId={buyerId} receiverId={sellerId} propertyId={propertyId} />
        </div>
      )}
    </div>
  );
};

export default MessageSellerButton;
