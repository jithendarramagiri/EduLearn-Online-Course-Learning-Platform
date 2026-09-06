import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, ArrowRight, Lock, Mail, User, Quote, 
  Loader, Eye, EyeOff, ShieldCheck, X 
} from 'lucide-react';
import { signupUser } from '../services/api';
import DatabaseViewer from '../components/DatabaseViewer';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await signupUser(name, email, password);
      alert(data.message || 'Account created successfully! Welcome to EduLearn.');
      navigate('/courses');
    } catch (err) {
      console.error('Signup failed', err);
      setErrorMessage(err.message || 'Failed to create account. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-container" style={{ minHeight: '100vh', alignItems: 'center' }}>
      {/* Left Side: Branding / Visual */}
      <div className="login-visual-side" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop')" }}>
        <div className="visual-content">
          <Link to="/" className="brand-link">
            <BookOpen className="brand-icon text-white" />
            <span className="brand-text text-white">EduLearn</span>
          </Link>
          
          <div className="testimonial-box">
            <Quote size={40} className="text-purple-300 opacity-50 mb-4" />
            <p className="testimonial-text">
              "Joining this community was the best decision for my engineering career. The hands-on curriculum helped me land my dream role!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div>
                <p className="author-name">Jithendar Ramagiri</p>
                <p className="author-role">Founder & Lead Architect</p>
              </div>
            </div>
          </div>

          <div className="platform-highlights">
            <div className="highlight-pill">
              <ShieldCheck size={16} className="text-green" />
              <span>Industry-Recognized Certificates</span>
            </div>
          </div>
        </div>
        
        {/* Background Overlay */}
        <div className="visual-overlay"></div>
      </div>

      {/* Right Side: Form (Clean, without database table showing by default) */}
      <div className="login-form-side">
        <div className="form-wrapper animate-fade-in">
          
          <div className="login-header">
            <h2>Create Your Account</h2>
            <p>Join millions of students and professionals learning on EduLearn.</p>
          </div>

          {errorMessage && (
            <div className="error-alert animate-fade-in" style={{ marginBottom: '1.25rem', padding: '0.85rem 1.1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.9rem' }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSignup} className="login-form" autoComplete="off">
            <div className="form-group relative">
              <label htmlFor="name">Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  id="name" 
                  className="input-field pl-10" 
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
            </div>

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
              <label htmlFor="password">Password</label>
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
                  minLength={6}
                  autoComplete="new-password"
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="password-hint">Minimum 6 characters</p>
            </div>

            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? (
                <><Loader size={18} className="spin" /> Creating Account...</>
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>
          
          <div className="login-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0 }}>Already have an account? <Link to="/login" className="text-primary hover-underline">Sign in</Link></p>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', userSelect: 'none' }} title="Press Ctrl+Shift+D to inspect database">
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

export default Signup;
