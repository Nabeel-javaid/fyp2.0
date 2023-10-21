import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateMarket from "./pages/CreateMarket";
import ViewMarket from './pages/ViewMarket';
import CreateLoan from './pages/CreateLoan';
import ViewLoan from './pages/ViewLoan';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element=<HomePage /> />
        <Route path="/view-market" element=<ViewMarket /> />
        <Route path="/create-market" element=<CreateMarket /> />
        <Route path="/view-loan" element=<ViewLoan /> />
        <Route path="/create-loan" element=<CreateLoan /> />
      </Routes>
    </BrowserRouter>

  );

}
export default App;