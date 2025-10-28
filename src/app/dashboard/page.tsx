'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need to be logged in to access this page.</p>
          <a href="/auth/login" className="auth-button primary">
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.email}!</p>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-nav">
          <button 
            className={`dashboard-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="dashboard-content">
          {activeTab === 'profile' && (
            <div className="dashboard-section">
              <h2 className="section-title">Profile Information</h2>
              <div className="profile-card">
                <div className="profile-field">
                  <label>Email:</label>
                  <span>{user?.email}</span>
                </div>
                <div className="profile-field">
                  <label>User ID:</label>
                  <span className="text-xs text-gray-400">{user?.id}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="dashboard-section">
              <h2 className="section-title">Security Settings</h2>
              <div className="security-card">
                <div className="security-item">
                  <h3>Password</h3>
                  <p>Change your account password</p>
                  <button className="auth-button secondary">Change Password</button>
                </div>
                <div className="security-item">
                  <h3>Account Deletion</h3>
                  <p>Permanently delete your account</p>
                  <button className="auth-button danger">Delete Account</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="dashboard-section">
              <h2 className="section-title">Account Settings</h2>
              <div className="settings-card">
                <div className="setting-item">
                  <h3>Notifications</h3>
                  <p>Manage your notification preferences</p>
                  <div className="setting-controls">
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="setting-item">
                  <h3>Price Alerts</h3>
                  <p>Get notified about price changes</p>
                  <div className="setting-controls">
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="dashboard-actions">
          <button onClick={handleLogout} className="auth-button danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}