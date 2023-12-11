import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

const rootElement = document.getElementById('root');

const renderApp = () => {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
};

// Render the app
renderApp();

// Report web vitals
reportWebVitals();
