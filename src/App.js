// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import AuthPage from './AuthPage';
import HomePage from './HomePage';
import StoryPage from './StoryPage'
import Page from './Page'
import './App.css';

function App() {
  // You can still maintain any global state or handlers here
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pages/:documentId" element={<StoryPage />} />
          <Route path="/page" element={<Page />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
