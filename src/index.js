import React from 'react';
import ReactDOM from 'react-dom/client';
import Game from './game.js';
import './css/index.css';

  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game rows={8} columns={8} />);
  