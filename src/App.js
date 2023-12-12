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
import CreateInstantLoan from './pages/CreateInstantLoan';
import ViewInstantLoan from './pages/ViewInstantLoan';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";



function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/view-market" element={<ViewMarkets />} />
          <Route path="/create-market" element={<CreateMarket />} />
          <Route path="/view-loan" element={<ViewLoan />} />
          <Route path="/profile" element={<UserProfile />} />

          <Route path="/market/:id" element={<MarketData />} />
          
          <Route path="/create-loan/:market" element={<CreateLoan/>}/>
          <Route path="/view-loans/:market" element={<ViewLoan/>} />
          
          <Route path="/pre-commit-loan/:market" element={<CreateInstantLoan/>} />
          <Route path="/view-instant-loans/:market" element={<ViewInstantLoan/>} />
        </Routes>
        <Analytics />
        <SpeedInsights />


    </BrowserRouter>

  );

}
export default App;
