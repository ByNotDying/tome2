import React, { useRef } from 'react';
import {useNavigate} from 'react-router-dom'

const Navbar = ({ editMode, setEditMode, handleSave, handleFileUpload }) => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    handleFileUpload(event);
  };

  const handleSaveClick = () => {
    if (editMode) {
      handleSave(); // Call the handleSave function from the parent component
    }
  };

  const handleLoginSignupClick = () => {
    navigate('/auth'); // Navigate to the AuthPage
  };
  
  
  return (
    <nav className="navbar fixed-top navbar-expand-md navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#logo">
          Tome2
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#home">
                Home
              </a>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-primary" onClick={handleFileUploadClick}>
                Upload Background
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </li>
            <li className="nav-item">
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  if (!editMode) {
                    setEditMode(!editMode);
                  } else {
                    handleSaveClick();
                  }
                }}
              >
                {editMode ? 'Save' : 'Edit'}
              </button>
            </li>
          </ul>
          <ul className="navbar-nav" style={{ marginLeft: 'auto' }}>
            <li className="nav-item">
              <button className="btn btn-outline-primary" onClick={handleLoginSignupClick}>
                Login/Signup
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;