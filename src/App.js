import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateMarket from "./pages/CreateMarket";
import ViewMarkets from "./pages/ViewMarkets";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element=<HomePage /> />
        <Route path="/create-market" element=<CreateMarket /> />
        <Route path="/view-markets" element=<ViewMarkets /> />
      </Routes>
    </BrowserRouter>
  );  
}

export default App;
