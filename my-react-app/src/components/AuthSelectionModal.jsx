import React from 'react';
import Modal from 'react-modal';

// Set the root element for accessibility
Modal.setAppElement('#root');

const AuthSelectionModal = ({ isOpen, onClose, onSelect }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Select Role"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Continue as:</h2>
      <button onClick={() => onSelect('buyer')}>Buyer</button>
      <button onClick={() => onSelect('seller')}>Seller</button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
};

export default AuthSelectionModal;
