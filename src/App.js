import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import HeroArea from './components/HeroArea';
import FeatureArea from './components/FeatureArea';
import CallAction from './components/CallAction';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <NavBar />
      <HeroArea />
      <FeatureArea />
      <CallAction />
      <Footer />
    </div>
  );
}

export default App;
