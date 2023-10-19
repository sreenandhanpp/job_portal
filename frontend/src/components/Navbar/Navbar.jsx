import React, { useEffect, useState } from 'react';
import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import { clearStorage } from '../../../localStorage/clearStorage';

const Navbar = () => {
  const navigate = useNavigate();
  const HandleLogout  = () => {
    clearStorage();
    navigate('')
  }
  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
      <Link to={'/'} className="navbar-brand d-flex align-items-center text-center py-0 px-4 px-lg-5">
        <h1 className="m-0 text-primary">JobEntry</h1>
      </Link>
      <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto p-4 p-lg-0">
          <Link className="nav-item nav-link active">Home</Link>
          <Link  className="nav-item nav-link">About</Link>
          <div className="nav-item dropdown">
            <Link className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Jobs</Link>
            <div className="dropdown-menu rounded-0 m-0">
              <Link className="dropdown-item">Job List</Link>
              <Link className="dropdown-item">Job Detail</Link>
            </div>
          </div>
          <div className="nav-item dropdown">
            <Link href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</Link>
            <div className="dropdown-menu rounded-0 m-0">
              <Link  className="dropdown-item">Job Category</Link>
              <Link  className="dropdown-item">Testimonial</Link>
              <Link  className="dropdown-item">404</Link>
            </div>
          </div>
          <Link className="nav-item nav-link" onClick={HandleLogout}>Log out</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar