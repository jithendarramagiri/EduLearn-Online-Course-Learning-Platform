import { useState, useEffect } from 'react';
import { Database, RefreshCw, Eye, EyeOff, CheckCircle2, User, FileCode, Trash2 } from 'lucide-react';
import { fetchAllBackendUsers, getBackendHealth, deleteBackendUser } from '../services/api';
import './DatabaseViewer.css';

const DatabaseViewer = ({ highlightEmail = '', title = 'Live Backend Database' }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'json'
  const [lastRefreshed, setLastRefreshed] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllBackendUsers();
      setUsers(data || []);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to load database users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 6000);
    const handleDbUpdate = () => loadData();
    window.addEventListener('edulearn_db_updated', handleDbUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('edulearn_db_updated', handleDbUpdate);
    };
  }, [highlightEmail]);

  const handleDelete = async (id, email) => {
    if (window.confirm(`Delete user ${email} from backend database?`)) {
      await deleteBackendUser(id);
      setStatusMsg(`User ${email} removed from database.`);
      loadData();
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  return (
    <div className="db-viewer-card glass-panel animate-fade-in">
      {/* Top Header */}
      <div className="db-viewer-header">
        <div className="db-header-left">
          <div className="db-icon-wrap">
            <Database size={20} className="text-cyan" />
            <span className="db-pulse-dot"></span>
          </div>
          <div>
            <div className="db-title-row">
              <h3>{title}</h3>
              <span className="db-badge-count">{users.length} Records</span>
              <span className="db-badge-online">🟢 users.json</span>
            </div>
            <p className="db-path-hint">
              Storage: <code>src/data/users.json</code>
            </p>
          </div>
        </div>

        <div className="db-header-actions">
          <button 
            type="button" 
            className={`btn-db-action ${showPasswords ? 'active' : ''}`}
            onClick={() => setShowPasswords(!showPasswords)}
            title="Toggle showing plain text passwords"
          >
            {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
            <span>{showPasswords ? 'Hide Passwords' : 'Show Passwords'}</span>
          </button>

          <button 
            type="button" 
            className="btn-db-action"
            onClick={() => setViewMode(viewMode === 'table' ? 'json' : 'table')}
            title="Switch between Table and raw JSON view"
          >
            <FileCode size={15} />
            <span>{viewMode === 'table' ? 'Raw JSON' : 'Table View'}</span>
          </button>

          <button 
            type="button" 
            className="btn-db-refresh"
            onClick={loadData}
            disabled={loading}
            title="Refresh database records"
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Status banner */}
      {statusMsg && (
        <div className="db-new-user-banner animate-fade-in" style={{ borderColor: '#38bdf8', color: '#38bdf8' }}>
          <CheckCircle2 size={18} />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Success banner if a newly entered email is highlighted */}
      {highlightEmail && !statusMsg && (
        <div className="db-new-user-banner animate-fade-in">
          <CheckCircle2 size={18} className="text-green" />
          <span>
            User with email <strong>{highlightEmail}</strong> successfully stored in backend database!
          </span>
        </div>
      )}

      {/* Main Content: Table or Raw JSON */}
      {viewMode === 'table' ? (
        <div className="db-table-wrapper">
          <table className="db-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Stored Password</th>
                <th>Role</th>
                <th>Last Login Activity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => {
                  const isHighlighted = highlightEmail && u.email?.toLowerCase() === highlightEmail.toLowerCase();
                  return (
                    <tr key={u.id} className={isHighlighted ? 'row-highlighted' : ''}>
                      <td className="cell-id">#{u.id}</td>
                      <td className="cell-name">
                        <div className="name-with-icon">
                          <User size={14} className="text-secondary" />
                          <span>{u.name || 'Anonymous'}</span>
                        </div>
                      </td>
                      <td className="cell-email">
                        <strong>{u.email}</strong>
                        {isHighlighted && <span className="just-added-tag">Just Active</span>}
                      </td>
                      <td className="cell-password">
                        <span className="password-pill">
                          {showPasswords ? (
                            u.password || '••••••••'
                          ) : (
                            '••••••••'
                          )}
                        </span>
                      </td>
                      <td className="cell-role">
                        <span className={`role-badge ${u.role === 'admin' ? 'role-admin' : 'role-student'}`}>
                          {u.role || 'student'}
                        </span>
                      </td>
                      <td className="cell-date">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span style={{ color: u.lastLogin ? '#38bdf8' : '#94a3b8', fontWeight: 600 }}>
                            {u.lastLogin ? new Date(u.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Never'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {u.loginCount ? `${u.loginCount} login${u.loginCount > 1 ? 's' : ''}` : 'New account'}
                          </span>
                        </div>
                      </td>
                      <td className="cell-action">
                        <button 
                          type="button" 
                          className="btn-delete-row"
                          onClick={() => handleDelete(u.id, u.email)}
                          title="Delete user from database"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-secondary">
                    No users stored in database yet. Sign up to add one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="db-json-view animate-fade-in">
          <pre>{JSON.stringify(users, null, 2)}</pre>
        </div>
      )}

      {/* Footer info */}
      <div className="db-viewer-footer">
        <span>Auto-synced with Node.js Express server on <code>http://localhost:5000/api/users</code></span>
        {lastRefreshed && <span>Last sync: {lastRefreshed}</span>}
      </div>
    </div>
  );
};

export default DatabaseViewer;
