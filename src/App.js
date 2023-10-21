import React from 'react';
import './App.css';
<<<<<<< HEAD
import { BrowserRouter as Router, Route, Switch, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateMarket from "./pages/CreateMarket";
import ViewMarket from './pages/ViewMarket'; // Make sure to use the correct path
=======
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateMarket from "./pages/CreateMarket";
import ViewMarket from './pages/ViewMarket';
import CreateLoan from './pages/CreateLoan';
import ViewLoan from './pages/ViewLoan';
>>>>>>> MuhammadAhmed

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element=<HomePage /> />
<<<<<<< HEAD
        <Route path="/View-market" element=<ViewMarket /> />
        <Route path="/create-market" element=<CreateMarket /> />
=======
        <Route path="/view-market" element=<ViewMarket /> />
        <Route path="/create-market" element=<CreateMarket /> />
        <Route path="/view-loan" element=<ViewLoan /> />
        <Route path="/create-loan" element=<CreateLoan /> />
>>>>>>> MuhammadAhmed
      </Routes>
    </BrowserRouter>

  );

}
export default App;