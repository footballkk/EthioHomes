import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import AuthForm from './components/AuthForm.jsx';
import BuyerDashboard from './components/BuyerDashboard.jsx';
import SellerDashboard from './components/SellerDashboard.jsx';
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
