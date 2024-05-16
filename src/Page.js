import React, { useEffect, useState, useRef } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import './Page.css';
import { app, analytics } from './firebase.js';
import { getFirestore, doc, getDoc, updateDoc} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, getMetadata, deleteObject } from 'firebase/storage'



function Page() {
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
  

  //update text
  const handleContentChange = (e) => {
    setEditableContent(e.target.value);
  };

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
      const imageRef = ref(storage, `backgrounds/${pageTitle}`); // Create a reference to the file

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

  //handleSave
  const handleSave = async () => {
    try {
      const db = getFirestore(app);
      const docRef = doc(db, 'test', 'test0');
      await updateDoc(docRef, { content: editableContent });
      setContent(editableContent); // Update the content state with the saved value
      setEditMode(false); // Exit edit mode after saving
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const storage = getStorage();
    
    console.log("Attempting upload");
    console.log("Page title: " + pageTitle);
  
    // filename = page title for now, maybe add code to get file extension and append to end of this
    const fileName = `${pageTitle}`;
  
    // Create a reference to the Firebase Storage location
    const storageRef = ref(storage, `backgrounds/${fileName}`);
  
    try {
      // Check if a file with the same name already exists
      const fileMetadata = await getMetadata(storageRef);
  
      if (fileMetadata) {
        // File exists, delete it
        await deleteObject(storageRef);
        console.log('Existing file deleted');
      }
  
      // Upload the new file to Firebase Storage
      await uploadBytes(storageRef, file);
  
      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(storageRef);
  
      // Update the userBackgroundImage state with the download URL
      setBackgroundImageUrl(downloadURL);
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        // File doesn't exist, proceed with upload
        try {
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          setBackgroundImageUrl(downloadURL);
        } catch (uploadError) {
          console.error('Error uploading file:', uploadError);
        }
      } else {
        console.error('Error checking file existence:', error);
      }
    }
  };

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
      <Navbar editMode={editMode} setEditMode={setEditMode} handleSave={handleSave} handleFileUpload={handleFileUpload} />
      <div className="page-content">
        <div className="background-container">
          <img src={backgroundImageUrl} ref={backgroundRef} alt="Background" style={{width: '100vw', height: {backgroundImageHeight}, minHeight: '110vh', objectFit: 'cover'}} />
        </div>
            <div className="main-content" ref={mainContentRef}>
              {editMode ? (
                <textarea ref = {textBoxRef} className="editable-content" value={editableContent} onChange={handleContentChange}/>
              ) : (
                <div className="non-editable-content" ref={nonEditRef}>{content}</div>
              )}
            </div>
          </div>
    </div>
  );
}

export default Page;