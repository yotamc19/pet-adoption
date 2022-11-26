import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AuthContextProvider from './contexts/AuthContext';
import PetContextProvider from './contexts/PetContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <AuthContextProvider>
    <PetContextProvider>
      <App />
    </PetContextProvider>
  </AuthContextProvider>
  // </React.StrictMode>
);
