import React, { useState, useEffect } from 'react';
import { app } from './firebase'; 
import { getFirestore, doc, getDoc } from 'firebase/firestore';

function App() {
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const db = getFirestore(app);
        const docRef = doc(db, 'test', 'test0');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setContent(docSnap.data().content);
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchContent();
  }, []);

  return <p>{content}</p>;
}

export default App;