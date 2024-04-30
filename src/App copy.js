import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './App.css'; // Adjust the path as necessary
import {app,analytics} from './firebase.js' 
import { getFirestore, doc, getDoc } from 'firebase/firestore';


function App() {
  // State to track if the page is in edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');

  console.log("hello")

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const db = getFirestore(app);
        const docRef = doc(db, 'test', 'test0');
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          const fetchedContent = docSnap.data().content;
          console.log('Fetched content:', fetchedContent);
          setContent(fetchedContent);
        } else {
          console.log('Document does not exist');
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };
  }, []);

  return (
    <div className="app-container">
      <Navbar isEditing={isEditing} setIsEditing={setIsEditing} />
      <div className="main-content">
        {/* Render content conditionally based on isEditing */}
        {isEditing ? (
          // Render editable components like textarea for each text section
          <textarea className="editable-content">Editable text here</textarea>
        ) : (
          // Render static content
          <div>
            <h1>Welcome to Tome2</h1>
            {content}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
