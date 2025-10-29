'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

// Profile Tab Component
function ProfileTab({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    telegramId: user?.telegram_id || ''
  });

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/user/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsEditing(false);
        // Refresh user data
        window.location.reload();
      } else {
        alert('خطا در به‌روزرسانی پروفایل');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('خطا در ارتباط با سرور');
    }
  };

  return (
    <div className="dashboard-section">
      <h2 className="section-title">اطلاعات پروفایل</h2>
      <div className="profile-card">
        <div className="profile-field">
          <label>نام کاربر:</label>
          {isEditing ? (
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="profile-input"
            />
          ) : (
            <span>{user?.name}</span>
          )}
        </div>
        <div className="profile-field">
          <label>ایمیل:</label>
          <span>{user?.email}</span>
        </div>
        <div className="profile-field">
          <label>آیدی تلگرام (اختیاری):</label>
          {isEditing ? (
            <input 
              type="text" 
              value={formData.telegramId}
              onChange={(e) => setFormData({...formData, telegramId: e.target.value})}
              placeholder="مثال: 123456789"
              className="profile-input"
            />
          ) : (
            <span>{user?.telegram_id || 'تنظیم نشده'}</span>
          )}
        </div>
        <div className="profile-field">
          <label>شناسه کاربری:</label>
          <span className="text-xs text-gray-400">{user?.id}</span>
        </div>
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button onClick={handleUpdateProfile} className="auth-button primary">
                ذخیره
              </button>
              <button onClick={() => setIsEditing(false)} className="auth-button secondary">
                لغو
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="auth-button primary">
              ویرایش پروفایل
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Security Tab Component  
function SecurityTab() {
  const handleChangePassword = () => {
    window.location.href = '/auth/change-password';
  };

  const handleDeleteAccount = async () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید حساب خود را حذف کنید؟ این عمل غیرقابل برگشت است.')) {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('authToken');
        window.location.href = '/';
      } else {
        alert('خطا در حذف حساب');
      }
    }
  };

  return (
    <div className="dashboard-section">
      <h2 className="section-title">تنظیمات امنیتی</h2>
      <div className="security-card">
        <div className="security-item">
          <h3>تغییر رمز عبور</h3>
          <p>رمز عبور حساب خود را تغییر دهید</p>
          <button onClick={handleChangePassword} className="auth-button secondary">
            تغییر رمز عبور
          </button>
        </div>
        <div className="security-item">
          <h3>حذف حساب</h3>
          <p>حساب خود را برای همیشه حذف کنید</p>
          <button onClick={handleDeleteAccount} className="auth-button danger">
            حذف حساب
          </button>
        </div>
      </div>
    </div>
  );
}

// Settings Tab Component
function SettingsTab() {
  return (
    <div className="dashboard-section">
      <h2 className="section-title">تنظیمات عمومی</h2>
      <div className="settings-card">
        <div className="setting-item">
          <h3>اعلان‌ها</h3>
          <p>تنظیمات اعلان‌های خود را مدیریت کنید</p>
          <div className="setting-controls">
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
        <div className="setting-item">
          <h3>هشدار قیمت</h3>
          <p>هنگام تغییر قیمت مطلع شوید</p>
          <div className="setting-controls">
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

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
          <p className="dashboard-subtitle">Welcome back, {user?.name || user?.email}!</p>
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
          {activeTab === 'profile' && <ProfileTab user={user} />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'settings' && <SettingsTab />}

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