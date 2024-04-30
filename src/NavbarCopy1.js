import React from 'react';

const Navbar = ({ isEditing, setIsEditing }) => { // Props to manage editing state
  return (
    <nav className="navbar fixed-top navbar-expand-md navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Tome2</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#home">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#features">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">About</a>
            </li>
            <li className="nav-item">
              {/* Handle Edit Button: Toggle editing state */}
              <button className="btn btn-outline-primary" onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Save' : 'Edit'} </button>            
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};




export default Navbar;
