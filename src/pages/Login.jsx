import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, ArrowRight, Lock, Mail, Quote, 
  GraduationCap, Eye, EyeOff, Loader, CheckCircle2, ShieldCheck, X 
} from 'lucide-react';
import { loginUser } from '../services/api';
import DatabaseViewer from '../components/DatabaseViewer';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDbByCommand, setShowDbByCommand] = useState(false);
  const navigate = useNavigate();

  // Listen for command (Ctrl + Shift + D) to show database
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setShowDbByCommand((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.showDatabase = () => setShowDbByCommand(true);
    window.hideDatabase = () => setShowDbByCommand(false);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await loginUser(email, password);
      if (data && data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/courses');
      }
    } catch (err) {
      console.error('Login failed', err);
      setErrorMessage(err.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
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
              "EduLearn provides the most rigorous, production-grade engineering courses available online. 
              Our entire dev team uses it for upskilling in Next.js, AI, and Cloud Architecture."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div>
                <p className="author-name">Jithendar Ramagiri</p>
                <p className="author-role">Founder & Platform Architect</p>
              </div>
            </div>
          </div>

          <div className="platform-highlights">
            <div className="highlight-pill">
              <CheckCircle2 size={16} className="text-green" />
              <span>2,500+ Curated Courses</span>
            </div>
            <div className="highlight-pill">
              <CheckCircle2 size={16} className="text-green" />
              <span>Verifiable Certificates</span>
            </div>
          </div>
        </div>
        
        <div className="visual-overlay"></div>
      </div>

      {/* Right Form Side (Clean learner login) */}
      <div className="login-form-side">
        <div className="form-wrapper animate-fade-in">

          <div className="login-header">
            <h2>Welcome Back, Learner</h2>
            <p>Access your enrolled masterclasses, certificates, and learning tracks.</p>
          </div>

          {errorMessage && (
            <div className="error-alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form" autoComplete="off">
            <div className="form-group relative">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  id="email" 
                  className="input-field pl-10" 
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="form-group relative">
              <div className="password-header">
                <label htmlFor="password">Password</label>
                <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); alert('Hint: Demo password is student123.'); }}>Forgot?</a>
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

            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? (
                <><Loader size={18} className="spin" /> Verifying Credentials...</>
              ) : (
                <>
                  <span>Sign In to EduLearn</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          
          <div className="login-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'center', marginTop: '1.25rem' }}>
            <p style={{ margin: 0 }}>
              Need an account? <Link to="/signup" className="text-primary hover-underline">Create Student Account</Link>
            </p>
            <p style={{ margin: 0, fontSize: '0.82rem' }}>
              <Link to="/admin/login" className="text-secondary hover-underline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={14} className="text-purple-400" />
                <span>Executive Admin? Access Portal</span>
              </Link>
            </p>
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

export default Login;
