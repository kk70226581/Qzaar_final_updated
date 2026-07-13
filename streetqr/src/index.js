// Import Bootstrap first
import 'bootstrap/dist/css/bootstrap.min.css';


// React core imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/tokens.css';
import './styles/design-system.css';
import './index.css';



// App root component
import App from './App';


// Create root and render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <App />
  
);
