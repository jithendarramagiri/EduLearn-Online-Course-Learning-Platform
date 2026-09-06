import express from 'express';
import cors from 'cors';
import { coursesData as sharedCoursesData } from '../data/courses.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Persistent database path in src/data/users.json
const dataPath = path.resolve(__dirname, '../data/users.json');

// Helper to ensure data directory exists and save users atomically
const saveUsersToFile = (userList) => {
  try {
    const dir = path.dirname(dataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataPath, JSON.stringify(userList, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[DATABASE ERROR] Failed to write users file:', err);
    return false;
  }
};

// Seed clean default users
const seedUsers = [
  {
    "id": 1,
    "name": "Admin User",
    "email": "admin@edulearn.com",
    "password": "admin123",
    "role": "admin",
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Student Demo",
    "email": "student@edulearn.com",
    "password": "student123",
    "role": "student",
    "createdAt": "2025-02-01T00:00:00.000Z"
  }
];

// Initialize users
let users = [];
try {
  if (fs.existsSync(dataPath)) {
    const file = fs.readFileSync(dataPath, 'utf-8');
    users = JSON.parse(file);
    if (!Array.isArray(users)) users = [...seedUsers];
  } else {
    users = [...seedUsers];
    saveUsersToFile(users);
  }
} catch (err) {
  console.warn('[DATABASE WARNING] Initializing with seed users:', err.message);
  users = [...seedUsers];
  saveUsersToFile(users);
}

// In-memory courses store
let coursesData = [...sharedCoursesData];

// ----------------------------------------------------
// API Routes
// ----------------------------------------------------

// 0. Live Backend Server & Database Dashboard (http://localhost:5000/)
app.get('/', (_req, res) => {
  let currentUsers = [];
  try {
    currentUsers = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  } catch {
    currentUsers = users;
  }

  const rows = currentUsers.map(u => `
    <tr>
      <td style="font-family: monospace; color: #94a3b8;">#${u.id}</td>
      <td style="font-weight: 600; color: #f8fafc;">${u.name || 'Learner'}</td>
      <td style="color: #38bdf8; font-weight: 600;">${u.email}</td>
      <td><span style="background: rgba(0,0,0,0.5); padding: 3px 8px; border-radius: 6px; font-family: monospace; color: #fcd34d; border: 1px solid rgba(255,255,255,0.1);">${u.password || '••••••'}</span></td>
      <td><span style="background: ${u.role === 'admin' ? 'rgba(168,85,247,0.2)' : 'rgba(14,165,233,0.2)'}; color: ${u.role === 'admin' ? '#c084fc' : '#38bdf8'}; border: 1px solid ${u.role === 'admin' ? 'rgba(168,85,247,0.4)' : 'rgba(14,165,233,0.4)'}; padding: 3px 9px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase;">${u.role || 'student'}</span></td>
      <td style="color: #93c5fd; font-size: 12px; font-weight: 500;">${u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}</td>
      <td style="color: #10b981; font-weight: 700; text-align: center;">${u.loginCount || 0}</td>
      <td style="color: #64748b; font-size: 12px;">${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>EduLearn Backend Server & Database (Port 5000)</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background: #060814;
          color: #f8fafc;
          padding: 2.5rem;
          min-height: 100vh;
        }
        .container { max-width: 1100px; margin: 0 auto; }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .title-box { display: flex; align-items: center; gap: 1rem; }
        .badge-live {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #34d399;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
        }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981; }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 1.25rem;
        }
        .stat-label { font-size: 13px; color: #94a3b8; font-weight: 500; }
        .stat-val { font-size: 24px; font-weight: 800; color: #f8fafc; margin-top: 6px; }
        .card {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(14, 165, 233, 0.3);
          border-radius: 14px;
          padding: 1.75rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .card-title { font-size: 1.25rem; font-weight: 700; color: #ffffff; }
        .btn-refresh {
          background: linear-gradient(135deg, #0ea5e9, #6366f1);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 13px;
          text-decoration: none;
        }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th {
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.04);
          color: #94a3b8;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        td {
          padding: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 14px;
          vertical-align: middle;
        }
        tr:hover { background: rgba(255, 255, 255, 0.02); }
        .nav-links { display: flex; gap: 1rem; margin-top: 1rem; }
        .nav-links a {
          color: #38bdf8;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          padding: 6px 12px;
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(14, 165, 233, 0.25);
          border-radius: 6px;
        }
        .nav-links a:hover { background: rgba(14, 165, 233, 0.2); }
        pre {
          background: #020617;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 1.25rem;
          overflow-x: auto;
          color: #38bdf8;
          font-size: 13px;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="title-box">
            <div>
              <h1 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.5px;">EduLearn Backend Server</h1>
              <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Node.js Express API & Database Engine</p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="badge-live">
              <span class="dot"></span>
              <span>Port 5000 Active</span>
            </div>
            <a href="http://localhost:5173" target="_blank" class="btn-refresh" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2);">
              Open Frontend (Port 5173) ↗
            </a>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total Users in Database</div>
            <div class="stat-val" style="color: #38bdf8;">${currentUsers.length}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Database File Storage</div>
            <div class="stat-val" style="font-size: 14px; font-weight: 600; color: #a78bfa; word-break: break-all; margin-top: 8px;">
              src/data/users.json
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Active Masterclass Courses</div>
            <div class="stat-val" style="color: #10b981;">${coursesData.length}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">HTTP Server Status</div>
            <div class="stat-val" style="color: #34d399; font-size: 18px;">200 OK</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Database Records (${currentUsers.length} Users)</div>
              <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Directly reading <code>${dataPath}</code></p>
            </div>
            <a href="/" class="btn-refresh">↻ Refresh Database</a>
          </div>

          <div style="overflow-x: auto;">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email Address</th>
                  <th>Stored Password</th>
                  <th>Role</th>
                  <th>Last Login Activity</th>
                  <th style="text-align: center;">Logins</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">Raw JSON Database View (/api/users)</div>
            <div class="nav-links" style="margin: 0;">
              <a href="/api/users" target="_blank">/api/users (JSON)</a>
              <a href="/api/health" target="_blank">/api/health (JSON)</a>
              <a href="/api/courses" target="_blank">/api/courses (JSON)</a>
            </div>
          </div>
          <pre>${JSON.stringify(currentUsers, null, 2)}</pre>
        </div>
      </div>
    </body>
    </html>
  `;
  res.send(html);
});

// 1. Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'EduLearn Backend is running',
    totalUsers: users.length,
    usersFile: dataPath
  });
});

// 2. GET all database users (For real-time Database Viewer in UI)
app.get('/api/users', (_req, res) => {
  res.json(users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    password: u.password,
    role: u.role,
    createdAt: u.createdAt || null,
    lastLogin: u.lastLogin || null,
    loginCount: u.loginCount || 0
  })));
});

// 3. DELETE user by ID (To remove any test email with 1-click)
app.delete('/api/users/:id', (req, res) => {
  const targetId = parseInt(req.params.id, 10);
  const initialCount = users.length;
  users = users.filter(u => u.id !== targetId);
  
  if (users.length < initialCount) {
    saveUsersToFile(users);
    console.log(`[DATABASE] User #${targetId} deleted from ${dataPath}`);
    return res.json({ message: 'User deleted from database', id: targetId });
  }
  return res.status(404).json({ error: 'User not found in database' });
});

// 4. POST Signup (Stores user details into backend users.json)
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Check if user already exists
  const existingUser = users.find(u => u.email.trim().toLowerCase() === cleanEmail);
  if (existingUser) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser = {
    id: Date.now(),
    name: name && name.trim() ? name.trim() : (cleanEmail.split('@')[0] || 'Learner'),
    email: cleanEmail,
    password: password,
    role: cleanEmail.includes('admin') ? 'admin' : 'student',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  const saved = saveUsersToFile(users);

  if (!saved) {
    return res.status(500).json({ error: 'Failed to write user to database' });
  }

  console.log(`[AUTH] User registered and saved to ${dataPath}: ${cleanEmail}`);
  return res.status(201).json({
    message: 'Account created and saved to backend database!',
    token: `mock-token-${newUser.id}`,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      createdAt: newUser.createdAt
    }
  });
});

// 5. POST Login (Updates lastLogin timestamp and loginCount into users.json)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = users.find(u => u.email.trim().toLowerCase() === cleanEmail && u.password === password);

  if (user) {
    const role = user.role === 'admin' ? 'admin' : 'user';
    user.lastLogin = new Date().toISOString();
    user.loginCount = (user.loginCount || 0) + 1;
    saveUsersToFile(users);
    console.log(`[AUTH LOGIN] Login details updated and saved for ${user.email} (Count: ${user.loginCount}) -> ${dataPath}`);
    return res.json({
      message: 'Login successful and recorded in database',
      token: role === 'admin' ? 'mock-admin-token' : 'mock-user-token',
      role,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount
      }
    });
  }

  // Check if account exists with different password
  const accountWithEmail = users.find(u => u.email.trim().toLowerCase() === cleanEmail);
  if (accountWithEmail) {
    return res.status(401).json({ error: 'Invalid password for this account' });
  }

  // If email is not in database yet, automatically register and persist to users.json!
  const newUser = {
    id: Date.now(),
    name: cleanEmail.split('@')[0] || 'Learner',
    email: cleanEmail,
    password: password,
    role: cleanEmail.includes('admin') ? 'admin' : 'student',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    loginCount: 1
  };

  users.push(newUser);
  saveUsersToFile(users);
  console.log(`[AUTH LOGIN-AUTO-REGISTER] Stored new user on login: ${cleanEmail} -> ${dataPath}`);

  return res.status(200).json({
    message: 'Account registered and logged in successfully',
    token: `mock-token-${newUser.id}`,
    role: newUser.role,
    user: newUser
  });
});

// 6. Courses List
app.get('/api/courses', (req, res) => {
  const { search, category, limit, offset } = req.query;
  let filteredCourses = [...coursesData];

  if (category && category !== 'All') {
    filteredCourses = filteredCourses.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const s = search.toLowerCase();
    filteredCourses = filteredCourses.filter(c => 
      c.title.toLowerCase().includes(s) || (c.instructor && c.instructor.toLowerCase().includes(s))
    );
  }

  const limitNum = limit ? parseInt(limit, 10) : filteredCourses.length;
  const offsetNum = offset ? parseInt(offset, 10) : 0;
  
  const paginatedCourses = filteredCourses.slice(offsetNum, offsetNum + limitNum);

  setTimeout(() => {
    res.json({
      total: filteredCourses.length,
      courses: paginatedCourses
    });
  }, 100);
});

// 7. Course by ID
app.get('/api/courses/:id', (req, res) => {
  const course = coursesData.find(c => c.id === parseInt(req.params.id, 10));
  if (course) {
    res.json(course);
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

// 8. Admin Stats
app.get('/api/admin/stats', (_req, res) => {
  res.json({
    totalRevenue: '₹84,52,430.50',
    revenueChange: '+24.6% this month',
    activeCourses: coursesData.length.toLocaleString(),
    coursesChange: `+45 new courses added`,
    totalStudents: (38420 + users.length).toLocaleString(),
    studentsChange: `+${users.length} backend registered`,
    completionRate: '74%',
    completionChange: '+6.2% from last month'
  });
});

// Helper to print database records to backend terminal
const printDatabaseTable = (userList, reason = 'Database Records') => {
  console.log(`\n======================================================`);
  console.log(`  📊 [DATABASE] ${reason} (${userList.length} users)`);
  console.log(`  📁 Storage: ${dataPath}`);
  console.log(`======================================================`);
  if (!userList || userList.length === 0) {
    console.log('  (No users registered yet)');
  } else {
    console.table(userList.map(u => ({
      ID: u.id,
      Name: u.name || 'Learner',
      Email: u.email,
      Password: u.password,
      Role: u.role || 'student',
      Logins: u.loginCount || 0,
      LastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleTimeString() : 'Never'
    })));
  }
  console.log(`======================================================\n`);
};

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  🎓 EDULEARN BACKEND SERVER RUNNING`);
  console.log(`======================================================`);
  console.log(`  ⚡ Server URL:     http://localhost:${PORT}`);
  console.log(`  📊 Web Dashboard:  http://localhost:${PORT}/`);
  console.log(`  👥 Users JSON API: http://localhost:${PORT}/api/users`);
  console.log(`  📁 Database File:  ${dataPath}`);
  console.log(`======================================================`);
  printDatabaseTable(users, 'Backend Database Loaded');
});
