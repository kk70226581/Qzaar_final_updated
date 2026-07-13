import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, SearchX } from 'lucide-react';
import Navbar from './Navbar';
import './NotFoundPage.css';

function NotFoundPage() {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true' || Boolean(localStorage.getItem('shopId'));

  return (
    <>
      <Navbar />
      <main className="not-found">
        <div className="not-found__panel">
          <span className="not-found__icon"><SearchX size={30} /></span>
          <p className="not-found__code">404</p>
          <h1>This page is not on the menu.</h1>
          <p>The link may be outdated, but your workspace and menu data are still available.</p>
          <div className="not-found__actions">
            <Link className="not-found__primary" to={isLoggedIn ? '/dashboard' : '/'}>
              {isLoggedIn ? <LayoutDashboard size={18} /> : <ArrowLeft size={18} />}
              {isLoggedIn ? 'Open dashboard' : 'Back to home'}
            </Link>
            <Link className="not-found__secondary" to="/about">Explore Qzaar</Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default NotFoundPage;
