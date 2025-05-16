import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Inbox from './Inbox';
import MessageForm from './MessageForm';
import '../../home.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer'; // adjust the path if needed

function SellerDashboard() {
const [currentUserId, setCurrentUserId] = useState('');
const [showInbox, setShowInbox] = useState(false);
const [selectedReceiverId, setSelectedReceiverId] = useState(null);
const [conversationId, setConversationId] = useState(null);
const [properties, setProperties] = useState([]);
const [paymentMade, setPaymentMade] = useState(localStorage.getItem('paymentMade') === 'true');
const [loading, setLoading] = useState(false);
const [formData, setFormData] = useState({
type: '',
location: '',
title: '',
size: '',
minPrice: '',
maxPrice: '',
description: '',
image: null,
});
const navigate = useNavigate();

const loggedInSeller = JSON.parse(localStorage.getItem("user"));
const userId = loggedInSeller?.userId || '';
setCurrentUserId(userId);

useEffect(() => {
const params = new URLSearchParams(window.location.search);
const status = params.get('status');
if (status === 'success' || localStorage.getItem('paymentMade') === 'true') {
  setPaymentMade(true);
  localStorage.setItem('paymentMade', 'true');
  toast.success('Payment confirmed. You can now post your home!');
}
// Fetch seller's own properties
if (userId) {
  axios.get(`https://homeeasebackend.onrender.com/properties?sellerId=${userId}`)
    .then(res => setProperties(res.data))
    .catch(err => {
      console.error(err);
      toast.error('Failed to load your properties');
    });
}
}, []);

useEffect(() => {
const fetchOrCreateConversation = async () => {
  if (!selectedReceiverId) {
    setConversationId(null);
    return;
  }

  try {
    const token = localStorage.getItem('token'); // or wherever you store JWT
    const res = await axios.post(
      'https://homeeasebackend.onrender.com/api/conversations/findOrCreate',
      {
        user1Id: currentUserId,
        user2Id: selectedReceiverId,
        // optionally send propertyId if you want to link the conversation to a property
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setConversationId(res.data._id);
  } catch (error) {
    console.error('Error fetching or creating conversation:', error);
  }
};

fetchOrCreateConversation();
}, [selectedReceiverId, currentUserId]);

const handleLogout = () => {
localStorage.removeItem('seller_id');
localStorage.removeItem('user');
toast.success('Logged out successfully!', {
  onClose: () => navigate('/'),
  autoClose: 1500,
});
};

const handleChange = (e) => {
const { name, value, files } = e.target;
if (name === 'image') {
  setFormData({ ...formData, image: files[0] });
} else {
  setFormData({ ...formData, [name]: value });
}
};

const handlePayment = () => {
toast.success('Mock payment successful!');
setPaymentMade(true);
localStorage.setItem('paymentMade', 'true');
};

const handleSubmit = async (e) => {
e.preventDefault();
if (!paymentMade) {
  alert("You must pay before submitting!");
  return;
}
const data = new FormData();
data.append('type', formData.type);
data.append('seller_id', userId);
data.append('location', formData.location);
data.append('title', formData.title);
data.append('size', formData.size);
data.append('minPrice', formData.minPrice);
data.append('maxPrice', formData.maxPrice);
data.append('description', formData.description);
data.append('image', formData.image);

try {
  const response = await fetch('https://homeeasebackend.onrender.com/properties', {
    method: 'POST',
    body: data,
  });
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const result = await response.json();
    if (response.ok) {
      toast.success('Home posted successfully!');
      setPaymentMade(false);
      localStorage.removeItem('paymentMade');
      setFormData({
        type: '',
        location: '',
        title: '',
        size: '',
        minPrice: '',
        maxPrice: '',
        description: '',
        image: null,
      });
    } else {
      toast.error('Error: ' + result.error);
    }
  } else {
    const text = await response.text();
    console.error('Unexpected response:', text);
    toast.error('Server returned unexpected response.');
  }
} catch (error) {
  console.error('Error posting home:', error);
  toast.error('An error occurred while posting the home.');
}
};

const startConversationWith = (buyerId) => {
setSelectedReceiverId(buyerId);
};

return (
<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
  <ToastContainer />
  <main style={{ flex: 1 }} className="sellerPage">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1>🏘️ Welcome, Seller!</h1>
      <button
        onClick={handleLogout}
        style={{ padding: '2px 4px', fontSize: '14px', width: 'auto', minWidth: 'unset' }}
        className="btn btn-danger"
      >
        Logout
      </button>
    </div>
    <p>This is your dashboard where you can list and manage your properties.</p>

    <button
      onClick={() => setShowInbox(!showInbox)}
      className="btn btn-secondary"
      style={{ margin: '10px 0' }}
    >
      {showInbox ? 'Hide Inbox' : 'View Inbox'}
    </button>

    {showInbox && (
      <div style={{ marginTop: '20px' }}>
        <h3>📥 Your Inbox</h3>
        <Inbox userId={currentUserId} />
      </div>
    )}

    {/* Your Posted Properties */}
    <h3>Your Properties</h3>
    {properties.length === 0 ? (
      <p>No properties listed yet.</p>
    ) : (
      properties.map(p => (
        <div key={p._id} style={{ border: '1px solid #ccc', marginBottom: '15px', padding: '10px' }}>
          <h4>{p.title}</h4>
          <p>{p.description}</p>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => startConversationWith('sampleBuyerUserId')} // Replace with actual buyer ID if available
          >
            Message Buyer
          </button>
        </div>
      ))
    )}

    {/* Payment section */}
    {!paymentMade && (
      <div style={{ backgroundColor: '#ffe0e0', padding: '10px', border: '1px solid red', marginBottom: '1rem' }}>
        <p><strong>Payment Required:</strong> Please pay <strong>100 ETB</strong> to list this property.</p>
        <button onClick={handlePayment} disabled={loading}>
          {loading ? 'Processing Payment...' : 'Pay Now'}
        </button>
      </div>
    )}

    {/* Post Home Form */}
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <select name="type" value={formData.type} onChange={handleChange} required>
        <option value="">Select Property Type</option>
        <option value="apartment">Apartment</option>
        <option value="house">House</option>
        <option value="villa">Villa</option>
      </select><br />
      <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required /><br />
      <input type="text" name="title" placeholder="Property Title" value={formData.title} onChange={handleChange} required /><br />
      <input type="text" name="size" placeholder="Size (e.g. 3 bed, 120sqm)" value={formData.size} onChange={handleChange} required /><br />
      <input type="number" name="minPrice" placeholder="Min Price" value={formData.minPrice} onChange={handleChange} /><br />
      <input type="number" name="maxPrice" placeholder="Max Price" value={formData.maxPrice} onChange={handleChange} /><br />
      <textarea name="description" placeholder="Additional details" value={formData.description} onChange={handleChange}></textarea><br />
      <label>Upload Home Image:</label><br />
      <input type="file" name="image" accept="image/*" onChange={handleChange} required /><br /><br />
      <button type="submit">Post Home</button>
    </form>

{selectedReceiverId && conversationId && (
<div style={{ marginTop: '20px' }}>
<h3>Send Message</h3>
<MessageForm
  senderId={currentUserId}
  receiverId={selectedReceiverId}
  conversationId={conversationId}  // Pass the real conversation ID here
/>
<button
  onClick={() => {
    setSelectedReceiverId(null);
    setConversationId(null);
  }}
  className="btn btn-link mt-2"
>
  Cancel
</button>
</div>
)}
  </main>
  <Footer />
</div>
);
}

export default SellerDashboard;
