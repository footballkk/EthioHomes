// src/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../home.css';
import AuthSelectionModal from './AuthSelectionModal';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useTranslation } from 'react-i18next';
import Footer from './components/Footer'; // adjust the path if needed
import newLogo from '../newLogo.png'; // adjust path based on your folder
import axios from "axios";
const images = [
    "/images/home1.jfif",
    "/images/home2.jfif",
    "/images/home3.jfif",
    "/images/home4.jfif",
    "/images/home5.jfif",
  ];
const Home = () => {
const { i18n } = useTranslation();
 useEffect(() => {
  const savedLang = localStorage.getItem('lang');  // Get saved language from localStorage
  if (savedLang && savedLang !== i18n.language) {
    i18n.changeLanguage(savedLang);  // Change language to the saved one
  }
}, [i18n]);
const handleLangChange = (e) => {
  const newLang = e.target.value;
  i18n.changeLanguage(newLang);  // Change language in react-i18next
  localStorage.setItem('lang', newLang);  // Save the selected language in localStorage
};
const [modalIsOpen, setModalIsOpen] = useState(false);
const navigate = useNavigate();
// Function to open modal
const handleOpenModal = () => {
setModalIsOpen(true);
};
// Function to close modal without doing anything
const handleCloseModal = () => {
setModalIsOpen(false);
};
// Function to handle role selection and navigation
const handleRoleSelect = (role) => {
setModalIsOpen(false); // Close the modal after role selection
if (role === 'buyer') {
navigate('/auth/buyer-login'); // Navigate to buyer login page
} else if (role === 'seller') {
navigate('/auth/seller-login'); // Navigate to seller login page
}
};
const [showSearch, setShowSearch] = useState(false);
const [searchParams, setSearchParams] = useState({
location: "",
minPrice: "",
maxPrice: "",
size: "",
type: "",
});
const [results, setResults] = useState([]);
const handleInputChange = (e) => {
setSearchParams({
...searchParams,
[e.target.name]: e.target.value,
});
};
const handleSearchSubmit = async (e) => {
e.preventDefault();
const query = new URLSearchParams();
Object.entries(searchParams).forEach(([key, value]) => {
if (value) query.append(key, value);
});
try {
const res = await axios.get(`https://homeeasebackend.onrender.com/api/properties?${query.toString()}`);
setResults(res.data);
} catch (err) {
console.error("Search failed", err);
}
}; 
return(
<div>
<nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
<div className="container-fluid">
<a className="navbar-brand" href="#">
<img
className="awra"
src={newLogo}
alt="Logo"
style={{ width: '40px', height: '40px' }}
/>
<b>HomeEase</b>
</a>
<button
className="navbar-toggler"
type="button"
data-bs-toggle="collapse"
data-bs-target="#navbarNav"
aria-controls="navbarNav"
aria-expanded="false"
aria-label="Toggle navigation"
>
<span className="navbar-toggler-icon"></span>
</button>
<div className="collapse navbar-collapse" id="navbarNav">
<ul className="navbar-nav ms-auto">
<li className="nav-item">
<a className="nav-link active" href="#home">Home</a>
</li>
<li className="nav-item">
<a className="nav-link" href="#about1">About</a>
</li>
<li className="nav-item">
<a className="nav-link" href="#contact">Contact</a>
</li>
{/* Login Button */}
<li className="nav-item">
<button className="nav-link btn btn-link text-white" onClick={handleOpenModal}>
Login
</button>
</li>
{/* 🌐 Language Buttons */}
<li className="nav-item">
<select
  className="form-select form-select-sm"
  style={{ width: '150px' }}
  value={i18n.language}  // Bind the current language
  onChange={handleLangChange}  // Handle language change
>
  <option value="en">English</option>
  <option value="am">አማርኛ</option>
  <option value="om">Afaan Oromoo</option>
</select>
</li>
</ul>
</div>
</div>
</nav>

<div className="contain1">
<div className="text-center home1">
<h2 className="home line">Welcome to HomeEase</h2>
<p className="listing line">Find your dream house here!</p>
</div>
{!showSearch ? (
<div className="text-center mt-4">
<button className="btn btn-primary" onClick={() => setShowSearch(true)}>
🔍 Start Property Search 
</button>
</div>
) : (
<div className="col-lg-6 mx-auto mt-4 p-4">
<h3 className="text-center search line mb-4">Search Filters</h3>
<form>
<div className="mb-3">
<label>Property Type</label>
<select name="type" className="form-control" onChange={handleInputChange}>
<option value="">Any</option>
<option value="apartment">Apartment</option>
<option value="house">House</option>
<option value="villa">Villa</option>
</select>
<label>Location</label>
<input type="text" className="form-control" name="location" placeholder="Enter location" />
</div>
<div className="mb-3">
<label>Price Range</label>
<div className="d-flex gap-2">
<input type="number" className="form-control" name="minPrice" placeholder="Enter minPrice" />
<input type="number" className="form-control" name="maxPrice" placeholder="Enter maxPrice" />
</div>
</div>
<div className="mb-3">
<label>Size (sq. m)</label>
<input type="number" className="form-control" name="size" placeholder="Enter size" />
</div>
<div className="text-center">
<button type="submit" className="btn btn-primary">Search</button>
</div>
</form>
{results.length > 0 && (
<div className="search-results mt-5">
<h4 className="text-center mb-3">Search Results:</h4>
{results.map((property) => (
<div key={property._id} className="property-card mb-3 p-3 border rounded">
{property.image && (
<img
src={property.image}
alt="Home"
className="property-image mb-2"
style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
/>
)}
<p><strong>Title:</strong> {property.title || "No title"}</p>
<p><strong>Type:</strong> {property.type}</p>
<p><strong>Location:</strong> {property.location}</p>
<p><strong>Size:</strong> {property.size}</p>
<p><strong>Min Price:</strong> {property.minPrice ? `ETB ${property.minPrice}` : "N/A"}</p>
<p><strong>Max Price:</strong> {property.maxPrice ? `ETB ${property.maxPrice}` : "N/A"}</p>
<p><strong>Description:</strong> {property.description || "No description"}</p>
</div>
))}
</div>
)}
</div>
)}
</div>
<section className="home1" id="home">
<div className="row contain1" id="container">
<div className="col-md-12 col-lg-6 mb-4">
<div>
<center><em>What does HomeEase do?</em></center><br />
<div className="line home">
Connecting home buyers and sellers across Ethiopia through asmart, 
efficient, and easy to use platform designed for every region
</div>
<div className="line listing">
Sellers can effortlessly list their properties with comprehensive details including location, price, 
size, and amenities—making it easier to attract serious buyers.
</div>
<div className="line search">
Buyers can explore a wide range of homes, filter by their needs,
and receive instant notifications when new listings match their
preferences.
</div>
</div>
</div>
<div className="col-md-12 col-lg-6 mb-4">
<center><em>Why Choose HomeEase?</em></center><br />
<p>
🏠Easy Property Listing: Sellers can quickly upload home details
including location, price, and <br />
🔍Smart Home Search: Buyers can search by location, budget, or
features to find the perfect match.<br />
📩Custom Notifications: Buyers receive alerts when new homes meet
their preferences.<br />
🔐Secure Accounts: Separate registration for buyers and sellers
ensures a personalized experience.<br />
🌐Nationwide Access: Connecting users across Ethiopia, from Addis
Ababa to regional cities.
</p>
</div>
</div>
</section>
<div className="scroll-container">
      <div className="scroll-track">
        {images.concat(images).map((img, index) => (
          <img src={img} alt={`home-${index}`} key={index} className="scroll-image" />
        ))}
      </div>
    </div>
<section className="about" id="about1">
<div className="container mt-5">
<div className="row">
<div className="col-lg-6 mb-4">
<div className="about-card shadow-lg p-4 rounded">
<h2 className="text-center text-primary mb-4">About HomeEase</h2>
<p className="text-center mb-4 text-muted">
HomeEase is a leading platform designed to connect home buyers and sellers in Ethiopia.
Our goal is to make property transactions seamless, efficient, and secure for all.
</p>
<p>
HomeEase allows sellers to list their properties easily, with detailed information including location, price, size, and amenities.
Buyers can explore various listings, filter based on their needs, and receive instant notifications when new listings are posted.
</p>
<p>
Our mission is to revolutionize the property market in Ethiopia by making property transactions faster, easier, and more reliable for both buyers and sellers.
</p>
</div>
</div>
<div className="col-lg-6 mb-4">
<div className="about-card shadow-lg p-4 rounded">
<h2 className="text-center text-primary mb-4">Our Services</h2>
<div className="service-item mb-3">
<i className="fas fa-home service-icon"></i>
<p><strong>Property Listings:</strong> Sellers can easily list their properties with full details.</p>
</div>
<div className="service-item mb-3">
<i className="fas fa-search service-icon"></i>
<p><strong>Home Search:</strong> Buyers can search for homes by location, price, or features.</p>
</div>
<div className="service-item mb-3">
<i className="fas fa-bell service-icon"></i>
<p><strong>Instant Alerts:</strong> Buyers receive instant notifications for matching properties.</p>
</div>
<div className="service-item mb-3">
<i className="fas fa-shield-alt service-icon"></i>
<p><strong>Security:</strong> We ensure secure communication between buyers and sellers.</p>
</div>
<div className="service-item mb-3">
<i className="fas fa-globe service-icon"></i>
<p><strong>Nationwide Reach:</strong> Connecting users from all across Ethiopia.</p>
</div>
</div>
</div>
</div>
</div>
</section>
<section className="contact1" id="contact">
<div className="container mt-5">
<div className="row">
<div className="col-lg-6 mb-4">
<h2 className="text-center text-primary mb-4">Contact Us</h2>
<p className="text-center mb-4"><b>We'd love to hear from you. Feel free to reach out for any questions or inquiries!</b></p>
<form>
<div className="mb-3">
<label htmlFor="name" className="form-label">Full Name</label>
<input type="text" className="form-control" id="name" placeholder="Enter your full name" />
</div>
<div className="mb-3">
<label htmlFor="email" className="form-label">Email Address</label>
<input type="email" className="form-control" id="email" placeholder="Enter your email address" />
</div>
<div className="mb-3">
<label htmlFor="message" className="form-label">Your Message</label>
<textarea className="form-control" id="message" rows="4" placeholder="Write your message here..."></textarea>
</div>
<button type="submit" className="btn btn-primary w-100">Send Message</button>
</form>
</div>
<div className="col-lg-6 mb-4">
<h2 className="text-center text-primary mb-4">Our Office</h2>
<div className="card p-4 shadow-sm">
<h4 className="mb-3">Address</h4>
<p>HomeEase, Arba Minch, Ethiopia</p>
<h4 className="mt-3 mb-3">Contact Info</h4>
<p><strong>Phone:</strong> +251 949812674</p>
<p><strong>Email:</strong> seid21225@gmail.com</p>
<h4 className="mt-3 mb-3">Follow Us</h4>
<a href="https://facebook.com/@redwan.seid.353241" className="btn btn-outline-primary me-2">
<i className="fab fa-facebook-f"></i>
</a>
<a href="https://twitter.com" className="btn btn-outline-info me-2">
<i className="fab fa-twitter"></i>
</a>
<a href="https://instagram.com/@redwan1686/" className="btn btn-outline-danger">
<i className="fab fa-instagram"></i>
</a>
</div>
</div>
</div>
</div>
</section>
<Footer />
{/* Modal rendering */}
<AuthSelectionModal
isOpen={modalIsOpen}
onClose={handleCloseModal}
onSelect={handleRoleSelect}
/>
</div>
);
};
export default Home;