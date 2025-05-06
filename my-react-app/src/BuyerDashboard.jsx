import React, { useEffect, useState } from 'react';
import '../home.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer'; // adjust the path if needed
const BuyerDashboard = () => {
const [properties, setProperties] = useState([]);
const navigate = useNavigate();
const handleLogout = () => {
localStorage.removeItem('user');
toast.success('Logged out successfully!', {
onClose: () => navigate('/'),
autoClose: 1500,
});
};
useEffect(() => {
const fetchProperties = async () => {
try {
const response = await axios.get('https://homeeasebackend.onrender.com/apiproperties');
setProperties(response.data);
} catch (error) {
console.error('Failed to fetch properties:', error);
}
};
fetchProperties();
}, []);

return (
<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
<ToastContainer />
<main style={{ flex: 1 }} className="buyerPage">
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
<h1>🏠 Welcome, Buyer!</h1>
<button
onClick={handleLogout}
style={{ padding: '2px 4px', fontSize: '14px',width:'auto', minWidth:'unset'}}
className="btn btn-danger"
>
Logout
</button>
</div>
<p>This is your dashboard where you can browse available homes.</p>
<div className="property-list">
{properties.length === 0 ? (
<p>No properties available yet.</p>
) : (
properties.map((property) => (
<div key={property._id} className="property-card">
{property.title && (
      <h3 className="property-title">{property.title}</h3>
)}
{property.image && (
<img
src={property.image}
alt="Home"
className="property-image"
/>
)}
<p><strong>Type:</strong> {property.type || "Not specified"}</p>
<p><strong>Location:</strong> {property.location}</p>
<p><strong>Size:</strong> {property.size}</p>
<p><strong>Min Price:</strong> {property.minPrice ? `ETB ${property.minPrice}` : "N/A"}</p>
<p><strong>Max Price:</strong> {property.maxPrice ? `ETB ${property.maxPrice}` : "N/A"}</p>
<p><strong>Description:</strong> 
{(property.description && property.description !== "null" && property.description !== "undefined" && property.description.trim() !== "")
? property.description
: "No description provided."}
</p>
</div>
))
)}
</div>
</main>
<Footer />
</div>
);
};
export default BuyerDashboard;
