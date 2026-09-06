import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  LogIn,
  LogOut,
  GraduationCap,
  Menu
} from 'lucide-react';
import {
  getAuthSession,
  logoutUser,
  getEnrolledCourses
} from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const [session, setSession] = useState(() => getAuthSession());

  const [enrollCount, setEnrollCount] = useState(
    () => getEnrolledCourses().length
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setEnrollCount(getEnrolledCourses().length);
      setSession(getAuthSession());
    };

    window.addEventListener(
      'edulearn_enrollment_updated',
      handleUpdate
    );

    window.addEventListener(
      'edulearn_auth_changed',
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        'edulearn_enrollment_updated',
        handleUpdate
      );

      window.removeEventListener(
        'edulearn_auth_changed',
        handleUpdate
      );
    };
  }, []);

  const handleLogout = () => {
    logoutUser();

    setSession({
      user: null,
      role: 'guest'
    });

    navigate('/');
  };

  return (
    <nav className="navbar glass-panel">

      {/* Brand */}
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <BookOpen className="brand-icon" />

          <span className="brand-text text-gradient">
            EduLearn
          </span>
        </Link>
      </div>

      {/* Hamburger */}
      <button
        className="hamburger"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Menu"
      >
        <Menu size={24} />
      </button>

      {/* Desktop Navigation */}
      <div className="navbar-links">

        <Link to="/courses" className="nav-link">
          Courses
        </Link>

        <Link
          to="/my-learning"
          className="nav-link my-learning-nav-link"
        >
          <GraduationCap
            size={18}
            className="text-cyan"
          />

          <span>My Learning</span>

          <span className="nav-enroll-badge">
            {enrollCount}
          </span>
        </Link>

      </div>

      {/* Mobile Navigation */}
      <div
        className={`mobile-menu ${
          mobileOpen ? 'show' : ''
        }`}
      >

        <Link
          to="/courses"
          className="nav-link"
          onClick={() => setMobileOpen(false)}
        >
          Courses
        </Link>

        <Link
          to="/my-learning"
          className="nav-link my-learning-nav-link"
          onClick={() => setMobileOpen(false)}
        >
          <GraduationCap
            size={18}
            className="text-cyan"
          />

          <span>My Learning</span>

          <span className="nav-enroll-badge">
            {enrollCount}
          </span>
        </Link>

      </div>

      {/* Login / Logout */}
      <div className="navbar-actions">

        {session.user ? (

          <div className="user-nav-dropdown">

            <Link
              to="/settings"
              className="user-welcome hide-on-mobile"
              title="Account Settings"
            >
              Hi, <strong>
                {session.user.name || 'Student'}
              </strong>
            </Link>

            <button
              onClick={handleLogout}
              className="btn-logout"
              title="Sign Out"
            >
              <LogOut size={16} />

              <span className="hide-on-mobile">
                Logout
              </span>
            </button>

          </div>

        ) : (

          <div className="auth-buttons-nav">

            <Link
              to="/login"
              className="btn-primary-small-nav"
            >
              <LogIn size={16} />

              <span>Login</span>
            </Link>

          </div>

        )}

      </div>

    </nav>
  );
};

export default Navbar;