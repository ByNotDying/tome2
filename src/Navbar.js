import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = ({ editMode, setEditMode, handleSave, handleFileUpload }) => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Navigate to the AuthPage after successful logout
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    handleFileUpload(event);
  };

  const handleSaveClick = () => {
    if (editMode) {
      handleSave();
    }
  };

  const handleTomeTwoClick = () => {
    navigate('/listings');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLoginSignupClick = () => {
    navigate('/auth');
  };

  const isHomePage = location.pathname === '/';
  const isListingsPage = location.pathname === '/listings';

  return (
    <nav className="navbar fixed-top navbar-expand-md navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#logo" onClick={handleTomeTwoClick}>
          Listings
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
              <a className="nav-link" href="#home" onClick={handleHomeClick}>
                Static-Editable-Sample
              </a>
            </li>
            {isHomePage && (
              <>
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
              </>
            )}
          </ul>
          {!isListingsPage && (
            <ul className="navbar-nav" style={{ marginLeft: 'auto' }}>
              <li className="nav-item">
                {user ? (
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-primary dropdown-toggle"
                      type="button"
                      id="userDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {user.email || user.displayName}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="userDropdown">
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <button className="btn btn-outline-primary" onClick={handleLoginSignupClick}>
                    Login/Signup
                  </button>
                )}
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;