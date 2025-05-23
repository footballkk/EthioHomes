import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import AuthForm from './components/AuthForm.jsx';
import BuyerDashboard from './components/BuyerDashboard.jsx';
import SellerDashboard from './components/SellerDashboard.jsx';
import ChatPage from './components/ChatPage.jsx';
import Inbox from './components/Inbox.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/buyer-login" element={<AuthForm />} />
      <Route path="/auth/seller-login" element={<AuthForm />} />
      <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
      <Route path="/seller-dashboard" element={<SellerDashboard />} />
      <Route path="/chat/:id" element={<ChatPage />} />
       <Route path="/inbox" element={<Inbox />} />
       <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
}
export default App;
