'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <nav className="nav">
        <div className="container">
          <div className="nav-content">
            <Link href="/" className="nav-brand">
              🤖 CryptoBot
            </Link>
            <ul className="nav-links">
              <li><Link href="/" className="nav-link">Home</Link></li>
              <li><Link href="#prices" className="nav-link">Prices</Link></li>
              <li><Link href="#about" className="nav-link">About</Link></li>
              <li><Link href="#contact" className="nav-link">Contact</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-content">
          <Link href="/" className="nav-brand">
            🤖 CryptoBot
          </Link>
          <ul className="nav-links">
            <li><Link href="/" className="nav-link">Home</Link></li>
            <li><Link href="#prices" className="nav-link">Prices</Link></li>
            <li><Link href="#about" className="nav-link">About</Link></li>
            <li><Link href="#contact" className="nav-link">Contact</Link></li>
            
            {isAuthenticated ? (
              <>
                <li className="user-info">
                  <span className="user-greeting">Hello, {user?.email}</span>
                </li>
                <li>
                  <Link href="/dashboard" className="nav-link profile-nav-link">
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="nav-link logout-nav-link">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/auth/login" className="nav-link auth-nav-link">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="nav-link signup-nav-link">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}