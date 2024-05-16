// App.js
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import AuthPage from './AuthPage';
//import ImportingItemThatDoesNotExist from './listings';
import StoryPage from './StoryPage'
import Page from './Page'
import Listings from './listings';

function App() {
  // You can still maintain any global state or handlers here
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Page />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pages/:documentId" element={<StoryPage />} />
          <Route path="/listings" element={<Listings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
