import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, AlertTriangle, Save, Trash2, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { getAuthSession, logoutUser } from '../services/api';
import './UserSettings.css';

const UserSettings = () => {
  const [name, setName] = useState(() => getAuthSession().user?.name || 'John Doe');
  const [email, setEmail] = useState(() => getAuthSession().user?.email || 'john.doe@example.com');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteAccount = () => {
    logoutUser();
    alert('Your account has been deleted permanently. We are sorry to see you go!');
    navigate('/');
  };

  return (
    <div className="app-container">
      <Navbar />
      
      <div className="main-content">
        <main className="settings-page animate-fade-in">
          <div className="settings-header">
            <h1>Account Settings</h1>
            <p>Manage your profile, preferences, and account security.</p>
          </div>

          {savedSuccess && (
            <div className="alert-success-banner glass-panel animate-fade-in" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <CheckCircle2 size={20} />
              <span>Your profile settings have been saved successfully!</span>
            </div>
          )}

          <div className="settings-content">
            <div className="settings-section glass-panel">
              <div className="section-title">
                <User className="section-icon text-primary" size={24} />
                <h2>Profile Information</h2>
              </div>
              
              <form onSubmit={handleSave} className="settings-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                      type="text" 
                      id="name" 
                      className="input-field" 
                      style={{ paddingLeft: '2.75rem' }}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                      type="email" 
                      id="email" 
                      className="input-field" 
                      style={{ paddingLeft: '2.75rem' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            <div className="settings-section glass-panel">
              <div className="section-title">
                <Shield className="section-icon text-warning" size={24} />
                <h2>Security & Password</h2>
              </div>
              <p className="section-desc">We recommend updating your password regularly to keep your account secure.</p>
              
              <button className="btn-outline" onClick={() => alert('Password change request sent to your email.')}>
                Change Password
              </button>
            </div>

            <div className="settings-section glass-panel danger-zone">
              <div className="section-title">
                <AlertTriangle className="section-icon text-danger" size={24} />
                <h2 className="text-danger">Danger Zone</h2>
              </div>
              
              <div className="danger-content">
                <div className="danger-text">
                  <h3>Delete Account</h3>
                  <p>Once you delete your account, there is no going back. All your courses, progress, and certificates will be permanently erased. Please be certain.</p>
                </div>
                
                {!showDeleteConfirm ? (
                  <button 
                    className="btn-danger" 
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 size={18} />
                    Delete My Account
                  </button>
                ) : (
                  <div className="delete-confirm-box">
                    <p>Are you absolutely sure you want to delete your account?</p>
                    <div className="confirm-actions">
                      <button className="btn-outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                      <button className="btn-danger-solid" onClick={handleDeleteAccount}>Yes, Delete Permanently</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserSettings;
