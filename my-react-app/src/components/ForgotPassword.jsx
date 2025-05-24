// src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css'; // Make sure this path matches your file structure

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://homeeasebackend.onrender.com/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="forgot-password-container">
      {/* <button className="back-button" onClick={() => navigate(-1)}>←</button> */}
      <h2 className='reset-header'>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        /><br /><br />
        <button type="submit">Send Reset Link</button>
      </form>
     {message && <p className="reset-message">{message}</p>}

    </div>
  );
};

export default ForgotPassword;
