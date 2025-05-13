import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ADDED
import Footer from './Footer'; // adjust the path if needed
// New code
const AuthForm = () => {
const navigate = useNavigate(); // ✅ ADDED
const [isLogin, setIsLogin] = useState(true); // true = show login, false = show register
const [formData, setFormData] = useState({
  fullName: '',
  email: '',
  password: '',
});
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
const toggleForms = () => {
  setIsLogin(!isLogin);
};
const handleSubmit = async (e) => {
  e.preventDefault();
  const apiUrl = 'https://homeeasebackend.onrender.com';
  try {
if (isLogin) {
  // Login
  const response = await axios.post(`${apiUrl}/login`, {
    email: formData.email,
    password: formData.password,
  });

  const { role, token, user } = response.data;

  alert('Login successful!');
  console.log(user.id);

  // ✅ Store role and token in localStorage
  localStorage.setItem('role', role); // Store the role (buyer or seller)
  localStorage.setItem('token', token); // Store the JWT token

  // Store user info based on role
  if (role === 'buyer') {
    localStorage.setItem('buyer_id', user.id || user._id);
    localStorage.setItem('buyer_name', user.full_name || user.name);
    localStorage.setItem('buyer_email', user.email);
  } else {
    localStorage.setItem('seller_id', user.id || user._id);
    localStorage.setItem('seller_name', user.full_name || user.name);
    localStorage.setItem('seller_email', user.email);
  }

  // ✅ Navigate to correct dashboard based on role
  if (role === 'buyer') {
    navigate('/buyer-dashboard');
  } else {
    navigate('/seller-dashboard');
  }
}

 else {
      // Register
    const role = window.location.pathname.includes('seller') ? 'seller' : 'buyer';   
    const response = await axios.post(`${apiUrl}/register`, {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role,
      });
      alert('Registration successful!');
      console.log(response.data);
    }
  } catch (error) {
    console.error('Error:', error);
  
    if (error.response) {
      console.error('Server Error Response:', error.response.data);
      alert(error.response.data.message || 'Something went wrong!');
    } else {
      alert('Incorrect email or password!');
    }
  }  
};

return (
<div style={styles.body}>
<div style={styles.container}>
{isLogin ? (
<div style={styles.formBox}>
<h2>Login</h2>
<form onSubmit={handleSubmit}>
<label>Email</label><br />
<input
type="email"
name="email"
placeholder="Enter your email"
value={formData.email}
onChange={handleChange}
required
/><br/>
<label>Password</label><br />
<input 
  type="password"
  name="password"
  placeholder="Enter your password"
  value={formData.password}
  onChange={handleChange}
  required
    /><br />
<button type="submit">Login</button>
</form>
<p>
Don't have an account?{' '}
<button onClick={toggleForms} style={styles.linkButton}>Sign up</button>
</p>
</div>
) : (
<div style={styles.formBox}>
<h2>Register</h2>
<form onSubmit={handleSubmit}>
<label>Full Name</label><br />
<input
  type="text"
  name="fullName"
  placeholder="Full Name"
  value={formData.fullName}
  onChange={handleChange}
  required
/><br />
<label>Email</label><br />
<input
  type="email"
  name="email"
  placeholder="Email"
  value={formData.email}
  onChange={handleChange}
  required
/><br />
<label>Password</label><br />
<input
  type="password"
  name="password"
  placeholder="Password"
  value={formData.password}
  onChange={handleChange}
  required
/><br />
<button type="submit">Sign Up</button>
</form>
<p>
Already have an account?{' '}
<button onClick={toggleForms} style={styles.linkButton}>Login</button>
</p>
</div>
)}
</div>
<Footer />
</div>
);
};
const styles = {
body: {
fontFamily: 'Arial, sans-serif',
textAlign: 'center',
marginTop: '50px',
},
container: {
maxWidth: '400px',
margin: 'auto',
backgroundColor: 'hsl(0, 0%, 90%)',
padding: '20px',
borderRadius: '8px',
},
formBox: {
padding: '10px',
},
linkButton: {
background: 'none',
border: 'none',
color: 'blue',
textDecoration: 'underline',
cursor: 'pointer',
},
};

export default AuthForm;
