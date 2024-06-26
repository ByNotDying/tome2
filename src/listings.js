import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';  // Make sure to import Link
import Navbar from './Navbar.js';
import { useNavigate } from 'react-router-dom';
import './listings.css';
import { app, analytics } from './firebase.js';
import { getFirestore, doc, getDoc, getDocs, updateDoc, addDoc, collection} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, getMetadata, deleteObject } from 'firebase/storage'




function Listings() {
  const [pageStructure, setPageStructure] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleAddNewEntry = async () => {
    const db = getFirestore();
    try {
      const docRef = await addDoc(collection(db, "pages"), {
        title: newTitle,
        content: "This is a newly created page. Please click the 'edit' button above to start adding text to this page, and 'save' when done in order to save the edits. You can upload a background to this page while you are on this page."
      });
      console.log("New page added with ID: ", docRef.id);
      setNewTitle('');  // Clear input after adding
    } catch (error) {
      console.error("Error adding new page: ", error);
    }
  };


  useEffect(() => {
    const fetchPages = async () => {
      const db = getFirestore();
      const pagesCollection = collection(db, "pages");
      const pagesSnapshot = await getDocs(pagesCollection);
      let structure = pagesSnapshot.docs.map(doc => ({
        id: doc.id,
        fields: Object.keys(doc.data()),
        title: doc.data().title
      }));

      setPageStructure(structure);
      console.log("Pages structure:", structure);  // Debug: log the structure
    };

    fetchPages().catch(console.error);
  }, []);

  // State to track if the page is in edit mode
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState('');
  const [editableContent, setEditableContent] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  const [backgroundImageHeight, setBackgroundImageHeight] = useState(0)


  const backgroundRef = useRef(null);
  const mainContentBorderRef = useRef(null);
  const mainContentRef = useRef(null);
  const nonEditRef = useRef(null);
  const textBoxRef = useRef(null);
  



  //print statement to check for crashes
  console.log("Re-rendering...");

  //get firebase content, set content to document content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const db = getFirestore(app);
        const docRef = doc(db, 'test', 'test0');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setContent(docSnap.data().content); // content = firebase document content
          setEditableContent(docSnap.data().content); // Initialize editableContent with the fetched content, this is in the text box
          setPageTitle(docSnap.data().title); //title = firebase document content
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchContent();
  }, []); //with empty dependency array, should run once on mount

  //fetch background image url from firebase storage
  useEffect(() => {
    const fetchBackgroundImageUrl = async () => {
      console.log("pageTitle: '" + pageTitle + "'");
      const storage = getStorage(); // Get the Firebase storage instance
      const imageRef = ref(storage, `backgrounds/index`); // Create a reference to the file

      try {
        const url = await getDownloadURL(imageRef); // Fetch the URL
        setBackgroundImageUrl(url); // Set the URL in state
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    if(pageTitle){
    fetchBackgroundImageUrl();
    }
  }, [pageTitle]); // Should hopefully run only once pageTitle is set


  useEffect(() => {
    const updateBackgroundImageHeight = () => {
      const img = new Image();
      img.src = backgroundImageUrl;
      img.onload = () => {
      setBackgroundImageHeight(img.height);
      };
    };
    
    if (backgroundImageUrl){
      updateBackgroundImageHeight();
      console.log(backgroundImageHeight);
    }
  }, [backgroundImageUrl]); // This effect depends on backgroundImageUrl
  
  
  /*
  useEffect(() => {
    const nonEditableContent = nonEditRef.current;
    if (nonEditableContent) {
      nonEditableContent.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (nonEditableContent) {
        nonEditableContent.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);


  const handleScroll = () => {
    const nonEditableContent = nonEditRef.current;
    const backgroundImage = backgroundRef.current;
  
    if (nonEditableContent && backgroundImage) {
      const scrollPercentage = nonEditableContent.scrollTop / (nonEditableContent.scrollHeight - nonEditableContent.clientHeight);
      const backgroundScrollPosition = (backgroundImage.height - nonEditableContent.clientHeight) * scrollPercentage;
  
      backgroundImage.style.transform = `translateY(-${backgroundScrollPosition}px)`;
    }
  };
  */

  useEffect(() => {
    const contentDiv = editMode ? textBoxRef.current : nonEditRef.current;
    if (contentDiv) {
      contentDiv.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (contentDiv) {
        contentDiv.removeEventListener('scroll', handleScroll);
      }
    };
  }, [editMode]);
  
  const handleScroll = () => {
    const contentDiv = editMode ? textBoxRef.current : nonEditRef.current;
    const backgroundImage = backgroundRef.current;
  
    if (contentDiv && backgroundImage) {
      const scrollPercentage = contentDiv.scrollTop / (contentDiv.scrollHeight - contentDiv.clientHeight);
      const backgroundScrollPosition = (backgroundImage.height - contentDiv.clientHeight) * scrollPercentage;
  
      backgroundImage.style.transform = `translateY(-${backgroundScrollPosition}px)`;
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="page-content">
          <div className="background-container">
            <img src={backgroundImageUrl} ref={backgroundRef} alt="Background" style={{width: '100vw', height: {backgroundImageHeight}, minHeight:'110vh', objectFit: 'cover'}} />
          </div>
        <div className="main-content">
          <div className="non-editable-content">
          <div>
            <h1>Listings</h1>
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Title" />
            <button onClick={handleAddNewEntry}>Add New Page</button>
          </div>
          <strong>Pages</strong>
          {pageStructure.map(page => (
            <div key={page.id}>
              |_ <Link to={`/pages/${page.id}`}><strong>{page.title}</strong></Link>  
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Listings;