import React, { useState } from 'react';
import Navbar from './Navbar';
import './App.css';

function App() {
  // Added state as per Model A's instructions
  const [isEditing, setIsEditing] = useState(false);  
  const [content, setContent] = useState(`Four score and seven years ago...`); 

  return (
    <div className="app-container">
      <Navbar isEditing={isEditing} setIsEditing={setIsEditing} />
      <div className="main-content">  <h1>Welcome to Tome2. Read or Edit the text below</h1>  {isEditing ? (    <textarea value={content} onChange={e => setContent(e.target.value)} />  ) : (    <div>      <h3>Gettysburg Address</h3>      <p>{content}</p>    </div>  )}</div>

    </div>
  );

}


    


export default App;
