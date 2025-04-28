import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home.jsx';
import AuthForm from './AuthForm.jsx';
import BuyerDashboard from './BuyerDashboard.jsx';
import SellerDashboard from './SellerDashboard.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/buyer-login" element={<AuthForm />} />
      <Route path="/auth/seller-login" element={<AuthForm />} />
      <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
      <Route path="/seller-dashboard" element={<SellerDashboard />} />
    </Routes>
  );
}
export default App;
