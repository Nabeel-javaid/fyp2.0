import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateMarket from "./pages/CreateMarket";
import ViewMarkets from './pages/ViewMarkets';
import CreateLoan from './pages/CreateLoan';
import ViewLoan from './pages/ViewLoan';
import UserProfile from './pages/UserProfile';
import MarketData from './pages/MarketData';
import { ToastProvider } from 'react-toast-notifications';

function App() {
  return (
    <BrowserRouter>
    <ToastProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/view-market" element={<ViewMarkets />} />
        <Route path="/create-market" element={<CreateMarket />} />
        <Route path="/view-loan" element={<ViewLoan />} />
        <Route path="/create-loan" element={<CreateLoan />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/market/:id" element={<MarketData />} />
      </Routes>
      </ToastProvider>
    </BrowserRouter>

  );

}
export default App;