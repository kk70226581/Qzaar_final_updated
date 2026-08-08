import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-warning py-3 shadow-sm">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-1 fw-bold text-dark">Qzaar</h1>
          <p className="mb-0 text-dark">Digital menus and QR ordering for food businesses</p>
        </div>
        <nav className="mt-3 mt-md-0" aria-label="Quick links">
          <ul className="nav">
            <li className="nav-item">
              <Link className="nav-link text-dark fw-semibold" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-semibold" to="/dashboard">Owner workspace</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-semibold" to="/modern/menu">View menu</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
