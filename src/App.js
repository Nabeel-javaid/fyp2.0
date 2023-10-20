import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateMarket from "./pages/CreateMarket";
import ViewMarket from './pages/ViewMarket'; // Make sure to use the correct path

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element=<HomePage /> />
        <Route path="/View-market" element=<ViewMarket /> />
        <Route path="/create-market" element=<CreateMarket /> />
      </Routes>
    </BrowserRouter>

  );

}
export default App;