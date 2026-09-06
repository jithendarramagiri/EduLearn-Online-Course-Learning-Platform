import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, Server } from 'lucide-react';
import { logoutUser } from '../services/api';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { path: '/admin/courses', icon: <BookOpen size={20} />, label: 'Courses' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    logoutUser();
    navigate('/');
  };

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <BookOpen className="brand-icon" />
        <span className="brand-text text-gradient">EduAdmin</span>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <a 
          href="http://localhost:5000" 
          target="_blank" 
          rel="noreferrer" 
          className="nav-item"
          title="Open Port 5000 Backend Server Dashboard"
          style={{ textDecoration: 'none', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem' }}
        >
          <Server size={18} />
          <span>Backend (5000)</span>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', marginLeft: 'auto' }}></span>
        </a>
        <button onClick={handleLogout} className="nav-item logout w-full text-left" style={{ width: '100%', border: 'none', background: 'none' }}>
          <LogOut size={20} />
          <span>Exit Admin</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
