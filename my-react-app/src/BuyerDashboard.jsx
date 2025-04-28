import React, { useEffect, useState } from 'react';
import '../home.css';
import axios from 'axios';
const BuyerDashboard = () => {
const [properties, setProperties] = useState([]);
useEffect(() => {
const fetchProperties = async () => {
try {
  const response = await axios.get('http://localhost:5001/properties');
  setProperties(response.data);
} catch (error) {
  console.error('Failed to fetch properties:', error);
}
};
fetchProperties();
}, []);
return (
<div className='buyerPage'>
<h1>🏠 Welcome, Buyer!</h1>
<p>This is your dashboard where you can browse available homes.</p>
<div className="property-list">
{properties.length === 0 ? (
<p>No properties available yet.</p>
) : (
properties.map((property) => (
<div key={property._id} className="property-card">
{property.image && (
  <img
    src={`http://localhost:5001${property.image}`}
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
</div>
);
};
export default BuyerDashboard;
