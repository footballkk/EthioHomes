import React, { useState } from 'react';
import '../home.css';

function SellerDashboard() {
  const [formData, setFormData] = useState({
    type: '', 
    location: '',
    size: '',
    minPrice: '', // Min price filter
    maxPrice: '', // Max price filter
    description: '',
    image: null,
  });

  // Replace this with real seller_id from auth context or storage
  const seller_id = localStorage.getItem('seller_id');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Seller ID from localStorage:', seller_id);

    const data = new FormData();
    data.append('type', formData.type); // Property type
    data.append('seller_id', seller_id);
    data.append('location', formData.location);
    data.append('size', formData.size);
    data.append('minPrice', formData.minPrice); // Min price
    data.append('maxPrice', formData.maxPrice); // Max price
    data.append('description', formData.description);
    data.append('image', formData.image);
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }
    try {
      const response = await fetch('http://localhost:5001/properties', {
        method: 'POST',
        body: data,
      });
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        if (response.ok) {
          alert('Home posted successfully!');
          setFormData({
            type: '',
            location: '',
            size: '',
            minPrice: '',
            maxPrice: '',
            description: '',
            image: null,
          });
        } else {
          alert('Error: ' + result.error);
        }
      } else {
        const text = await response.text();
        console.error('Unexpected response:', text);
        alert('Server returned unexpected response.');
      }
    } catch (error) {
      console.error('Error posting home:', error);
      alert('An error occurred while posting the home.');
    }
  };

  return (
    <div className="sellerPage">
      <h1>🏘️ Welcome, Seller!</h1>
      <p>This is your dashboard where you can list and manage your properties.</p>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Property Type at the top */}
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
          name="size"
          placeholder="Size (e.g. 3 bed, 120sqm)"
          value={formData.size}
          onChange={handleChange}
          required /><br />

        {/* Min Price and Max Price Inputs - Positioned next to Size */}
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
    </div>
  );
}

export default SellerDashboard;
