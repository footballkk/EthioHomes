import React, { useState, useEffect } from 'react';
import '../home.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer'; // adjust the path if needed

function SellerDashboard() {
const [paymentMade, setPaymentMade] = useState(localStorage.getItem('paymentMade') === 'true');
const [loading, setLoading] = useState(false);
// const handleMockPayment = () => {
// alert("Payment successful!");
// setPaymentMade(true);
// };
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
const seller_id = localStorage.getItem('seller_id');
const navigate = useNavigate();
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  if (status === 'success' || localStorage.getItem('paymentMade') === 'true') {
    setPaymentMade(true);
    localStorage.setItem('paymentMade', 'true');
    toast.success('Payment confirmed. You can now post your home!');
  }
}, []);
const handleLogout = () => {
localStorage.removeItem('seller_id');
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
data.append('seller_id', seller_id);
data.append('location', formData.location);
data.append('title', formData.title);
data.append('size', formData.size);
data.append('minPrice', formData.minPrice);
data.append('maxPrice', formData.maxPrice);
data.append('description', formData.description);
data.append('image', formData.image);
try {
const response = await fetch('https://homeeasebackend.onrender.com/api/properties', {
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
return (
<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
<ToastContainer />
<main style={{ flex: 1 }} className="sellerPage">
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <h1>🏘️ Welcome, Seller!</h1>
  <button
    onClick={handleLogout}
    style={{ padding: '2px 4px', lineHeight: '1.2', width: 'auto', minWidth: 'unset', fontSize: '14px' }}
    className="btn btn-danger"
  >
    Logout
  </button>
</div>
<p>This is your dashboard where you can list and manage your properties.</p>
{!paymentMade && (
  <div style={{ backgroundColor: '#ffe0e0', padding: '10px', border: '1px solid red', marginBottom: '1rem' }}>
    <p><strong>Payment Required:</strong> Please pay <strong>100 ETB</strong> to list this property.</p>
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing Payment...' : 'Pay Now'}
    </button>
  </div>
)}
<form onSubmit={handleSubmit} encType="multipart/form-data">
  <select
    name="type"
    value={formData.type}
    onChange={handleChange}
    required>
    <option value="">Select Property Type</option>
    <option value="apartment">Apartment</option>
    <option value="house">House</option>
    <option value="villa">Villa</option>
  </select><br />
  <input
    type="text"
    name="location"
    placeholder="Location"
    value={formData.location}
    onChange={handleChange}
    required /><br />
  <input
    type="text"
    name="title"
    placeholder="Property Title"
    value={formData.title}
    onChange={handleChange}
    required
  /><br />
  <input
    type="text"
    name="size"
    placeholder="Size (e.g. 3 bed, 120sqm)"
    value={formData.size}
    onChange={handleChange}
    required /><br />
  <input
    type="number"
    name="minPrice"
    placeholder="Min Price"
    value={formData.minPrice}
    onChange={handleChange} /><br />
  <input
    type="number"
    name="maxPrice"
    placeholder="Max Price"
    value={formData.maxPrice}
    onChange={handleChange} /><br />
  <textarea
    name="description"
    placeholder="Additional details"
    value={formData.description}
    onChange={handleChange}></textarea><br />
  <label>Upload Home Image:</label><br />
  <input
    type="file"
    name="image"
    accept="image/*"
    onChange={handleChange}
    required /><br /><br />
  <button type="submit">Post Home</button>
</form>
</main>
<Footer />
</div>
);
}
export default SellerDashboard;
