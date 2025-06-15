import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChatPage } from './pages/ChatPage';
import { PricingPage } from './pages/PricingPage';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
    </div>
  );
}

export default App;