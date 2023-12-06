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
<<<<<<< HEAD
=======
import { ToastProvider } from 'react-toast-notifications';
>>>>>>> nabeel

function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/view-market" element={<ViewMarkets />} />
        <Route path="/create-market" element={<CreateMarket />} />
        <Route path="/view-loan" element={<ViewLoan />} />
        <Route path="/create-loan" element={<CreateLoan />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/market/:id" element={<MarketData />} />
      </Routes>
=======
      <ToastProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/view-market" element={<ViewMarkets />} />
          <Route path="/create-market" element={<CreateMarket />} />
          <Route path="/view-loan" element={<ViewLoan />} />
          
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/market/:id" element={<MarketData />} />
          <Route path="/create-loan/:market" element={<CreateLoan/>}/>
          <Route path="/view-loanS/:market" element={<ViewLoan/>} />
        </Routes>
      </ToastProvider>
>>>>>>> nabeel
    </BrowserRouter>

  );

}
export default App;