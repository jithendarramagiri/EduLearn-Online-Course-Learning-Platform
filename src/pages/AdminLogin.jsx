import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, ArrowRight, Lock, Mail, Quote, ShieldCheck, 
  Eye, EyeOff, Loader, CheckCircle2, GraduationCap, X 
} from 'lucide-react';
import { loginUser } from '../services/api';
import DatabaseViewer from '../components/DatabaseViewer';
import './Login.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@edulearn.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDbByCommand, setShowDbByCommand] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setShowDbByCommand((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const performLogin = async (loginEmail, loginPassword) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await loginUser(loginEmail, loginPassword);
      if (data && data.role === 'admin') {
        navigate('/admin');
      } else {
        // Logged in as student
        navigate('/admin');
      }
    } catch (err) {
      console.error('Admin login failed', err);
      setErrorMessage(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    performLogin(email, password);
  };

  const fillAdminDemo = () => {
    setEmail('admin@edulearn.com');
    setPassword('admin123');
    performLogin('admin@edulearn.com', 'admin123');
  };

  return (
    <div className="login-split-container">
      {/* Left Visual Branding Side */}
      <div className="login-visual-side">
        <div className="visual-content">
          <Link to="/" className="brand-link">
            <BookOpen className="brand-icon text-white" />
            <span className="brand-text text-white">EduLearn</span>
          </Link>
          
          <div className="testimonial-box">
            <Quote size={38} className="text-purple-300 opacity-60 mb-4" />
            <p className="testimonial-text">
              "Enterprise administration controls for catalog management, instructor allocations, AI curriculum synthesis, and platform telemetry."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div>
                <p className="author-name">Executive Console</p>
                <p className="author-role">Root Security & Governance</p>
              </div>
            </div>
          </div>

          <div className="platform-highlights">
            <div className="highlight-pill">
              <ShieldCheck size={16} className="text-purple-400" />
              <span>Full Catalog & Revenue Control</span>
            </div>
            <div className="highlight-pill">
              <CheckCircle2 size={16} className="text-green" />
              <span>AI Course Architect Suite</span>
            </div>
          </div>
        </div>
        
        <div className="visual-overlay"></div>
      </div>

      {/* Right Form Side: Executive Admin */}
      <div className="login-form-side">
        <div className="form-wrapper animate-fade-in">
          
          <div className="admin-portal-pill-btn" style={{ marginBottom: '1.25rem', width: 'fit-content' }}>
            <ShieldCheck size={18} className="shield-icon" />
            <span>Executive Admin Portal</span>
          </div>

          <div className="login-header">
            <h2>Admin Executive Sign In</h2>
            <p>
              Authenticate to access the 2,500+ course management console, revenue analytics, and curriculum builder.
            </p>
          </div>

          {/* 1-Click Fast Fill Banner for Admins */}
          <div className="fast-demo-banner admin-theme">
            <div className="demo-info-text">
              <span className="demo-label">Admin Demo:</span>
              <span className="demo-cred">admin@edulearn.com</span>
            </div>
            <button 
              type="button" 
              className="btn-fast-fill"
              onClick={fillAdminDemo}
              disabled={loading}
            >
              ⚡ 1-Click Admin Login
            </button>
          </div>

          {errorMessage && (
            <div className="error-alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form" autoComplete="off">
            <div className="form-group relative">
              <label htmlFor="email">Administrator Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  id="email" 
                  className="input-field pl-10" 
                  placeholder="admin@edulearn.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="form-group relative">
              <div className="password-header">
                <label htmlFor="password">Security Key / Password</label>
                <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); alert('Demo admin password is: admin123'); }}>Forgot?</a>
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="password" 
                  className="input-field pl-10 pr-10" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-2 btn-admin-submit" disabled={loading}>
              {loading ? (
                <><Loader size={18} className="spin" /> Verifying Admin Clearance...</>
              ) : (
                <>
                  <span>Enter Admin Console</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          
          <div className="login-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
            <p style={{ margin: 0 }}>
              Not an admin? <Link to="/login" className="text-primary hover-underline">Go to Student Login</Link>
            </p>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', userSelect: 'none' }}>
              ⌘ Ctrl+Shift+D
            </span>
          </div>

        </div>
      </div>

      {/* Database Modal: ONLY SHOWN BY COMMAND (Ctrl + Shift + D) */}
      {showDbByCommand && (
        <div className="db-modal-backdrop animate-fade-in" onClick={() => setShowDbByCommand(false)}>
          <div className="db-modal-dialog animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="db-modal-close-row">
              <span className="db-modal-title">Live Backend Users Database (Command Mode)</span>
              <button type="button" className="btn-close-db-modal" onClick={() => setShowDbByCommand(false)}>
                <X size={20} />
              </button>
            </div>
            <DatabaseViewer title="Live Backend Users Database" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
