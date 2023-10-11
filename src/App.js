import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateMarket from './pages/CreateMarket';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-market" element={<CreateMarket />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
