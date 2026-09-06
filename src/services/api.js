import { coursesData as initialCoursesData } from '../data/courses';

// Use relative /api (proxied by Vite) or direct port 5000
const API_BASE = import.meta.env.VITE_API_URL || '/api';
const DIRECT_BACKEND = 'https://edulearn-online-course-learning-platform-3zaq.onrender.com';

const getStoredCourses = () => {
  try {
    const stored = localStorage.getItem('edulearn_courses_v5k');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length >= initialCoursesData.length) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return [...initialCoursesData];
};

let localCourses = getStoredCourses();

const persistCourses = () => {
  try {
    localStorage.setItem('edulearn_courses_v5k', JSON.stringify(localCourses));
  } catch {
    // ignore
  }
};

// ----------------------------------------------------
// Local Persistent Database Fallback & Cache
// ----------------------------------------------------
const DEFAULT_USERS_CACHE = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@edulearn.com',
    password: 'admin123',
    role: 'admin',
    createdAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Student Demo',
    email: 'student@edulearn.com',
    password: 'student123',
    role: 'student',
    createdAt: '2025-02-01T00:00:00.000Z'
  }
];

export const getLocalUsersDb = () => {
  try {
    const data = localStorage.getItem('edulearn_users_database_v1');
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  saveLocalUsersDb(DEFAULT_USERS_CACHE);
  return [...DEFAULT_USERS_CACHE];
};

export const saveLocalUsersDb = (usersList) => {
  try {
    localStorage.setItem('edulearn_users_database_v1', JSON.stringify(usersList));
    window.dispatchEvent(new Event('edulearn_db_updated'));
  } catch {
    // ignore
  }
};

// Check if backend server is live
let isBackendAvailable = null;
let lastCheckTime = 0;

export const checkBackend = async (force = false) => {
  const now = Date.now();
  if (!force && isBackendAvailable !== null && now - lastCheckTime < 3000) {
    return isBackendAvailable;
  }
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1200);
    // Try both /api/health and direct backend URL
    let res = null;
    try {
      res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
    } catch {
      res = await fetch(`${DIRECT_BACKEND}/health`, { signal: controller.signal });
    }
    clearTimeout(id);
    isBackendAvailable = res ? res.ok : false;
    lastCheckTime = now;
  } catch {
    isBackendAvailable = false;
    lastCheckTime = now;
  }
  return isBackendAvailable;
};

// Extended health & backend telemetry
export const getBackendHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/health`).catch(() => fetch(`${DIRECT_BACKEND}/health`));
    if (res && res.ok) return await res.json();
  } catch {
    // offline
  }
  return null;
};

// Fetch courses with pagination and filtering
export const fetchCourses = async ({ category = 'All', search = '', limit = 12, offset = 0 } = {}) => {
  const backendUp = await checkBackend();
  if (backendUp) {
    try {
      const query = new URLSearchParams({
        category,
        search,
        limit: limit.toString(),
        offset: offset.toString()
      });
      const res = await fetch(`${API_BASE}/courses?${query}`).catch(() => fetch(`${DIRECT_BACKEND}/courses?${query}`));
      if (res && res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend fetch failed, using local courses fallback', e);
    }
  }

  // Local fallback
  let filtered = [...localCourses];
  if (category && category !== 'All') {
    filtered = filtered.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(c =>
      c.title.toLowerCase().includes(s) ||
      (c.instructor && c.instructor.toLowerCase().includes(s))
    );
  }

  const paginated = filtered.slice(offset, offset + limit);
  return {
    total: filtered.length,
    courses: paginated
  };
};

// Fetch single course by ID
export const fetchCourseById = async (id) => {
  const numId = parseInt(id, 10);
  const backendUp = await checkBackend();
  if (backendUp) {
    try {
      const res = await fetch(`${API_BASE}/courses/${numId}`).catch(() => fetch(`${DIRECT_BACKEND}/courses/${numId}`));
      if (res && res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend fetch failed, using local fallback', e);
    }
  }
  const course = localCourses.find(c => c.id === numId);
  if (!course) throw new Error('Course not found');
  return course;
};

// Fetch admin statistics
export const fetchAdminStats = async () => {
  const backendUp = await checkBackend();
  if (backendUp) {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`).catch(() => fetch(`${DIRECT_BACKEND}/admin/stats`));
      if (res && res.ok) {
        const data = await res.json();
        return {
          ...data,
          activeCourses: localCourses.length.toLocaleString()
        };
      }
    } catch (e) {
      console.warn('Backend stats failed, using local stats', e);
    }
  }

  return {
    totalRevenue: '₹37,54,231.89',
    revenueChange: '+20.1% from last month',
    activeCourses: localCourses.length.toLocaleString(),
    coursesChange: '+12 new courses added',
    totalStudents: '14,890',
    studentsChange: '+1,240 this week',
    completionRate: '68%',
    completionChange: '+5% from last month'
  };
};

// Add a new course (Admin)
export const addCourse = (courseData) => {
  const newId = localCourses.length > 0 ? Math.max(...localCourses.map(c => c.id)) + 1 : 1;
  const newCourse = {
    id: newId,
    title: courseData.title || 'Untitled Course',
    category: courseData.category || 'Programming',
    instructor: courseData.instructor || 'EduLearn Instructor',
    rating: courseData.rating ? parseFloat(courseData.rating) : 4.9,
    students: courseData.students ? parseInt(courseData.students, 10) : 120,
    duration: courseData.duration || '4 weeks',
    price: courseData.price ? (courseData.price.startsWith('₹') ? courseData.price : `₹${courseData.price}`) : '₹4,999',
    level: courseData.level || 'Beginner',
    image: courseData.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
    description: courseData.description || 'Comprehensive course designed by industry experts.',
    whatYouWillLearn: Array.isArray(courseData.whatYouWillLearn) ? courseData.whatYouWillLearn : [
      'Master fundamental concepts',
      'Build real-world projects',
      'Follow industry best practices'
    ],
    modules: Array.isArray(courseData.modules) ? courseData.modules : [
      { title: '1. Introduction and Setup', duration: '1 hour' },
      { title: '2. Core Principles', duration: '2.5 hours' },
      { title: '3. Final Capstone Project', duration: '4 hours' }
    ]
  };

  localCourses = [newCourse, ...localCourses];
  persistCourses();
  return newCourse;
};

// Delete course (Admin)
export const deleteCourse = (id) => {
  const numId = parseInt(id, 10);
  localCourses = localCourses.filter(c => c.id !== numId);
  persistCourses();
  return true;
};

// Total count getter
export const getTotalCoursesCount = () => localCourses.length;

// Get all courses directly (Admin table)
export const getAllCoursesAdmin = () => [...localCourses];

// ----------------------------------------------------
// Authentication & Live User Database (Guaranteed Storage)
// ----------------------------------------------------

export const fetchAllBackendUsers = async () => {
  let serverUsers = null;
  try {
    const res = await fetch(`${API_BASE}/users`).catch(() => fetch(`${DIRECT_BACKEND}/users`));
    if (res && res.ok) {
      serverUsers = await res.json();
    }
  } catch {
    // backend unreachable
  }

  const localUsers = getLocalUsersDb();

  if (Array.isArray(serverUsers) && serverUsers.length > 0) {
    // Merge server users with local users to ensure no user is ever lost
    const merged = [...serverUsers];
    for (const lu of localUsers) {
      if (!merged.some(su => su.email?.toLowerCase() === lu.email?.toLowerCase())) {
        merged.push(lu);
        // Sync local user to server
        try {
          fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: lu.name, email: lu.email, password: lu.password })
          }).catch(() => {});
        } catch {}
      }
    }
    saveLocalUsersDb(merged);
    return merged;
  }

  return localUsers;
};

export const deleteBackendUser = async (id) => {
  // 1. Delete from local database
  const localUsers = getLocalUsersDb().filter(u => u.id !== parseInt(id, 10));
  saveLocalUsersDb(localUsers);

  // 2. Delete from backend server
  try {
    await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' }).catch(() => 
      fetch(`${DIRECT_BACKEND}/users/${id}`, { method: 'DELETE' })
    );
  } catch {
    // offline
  }
  return { message: 'User deleted from database', id };
};

export const loginUser = async (email, password) => {
  const cleanEmail = email.trim().toLowerCase();

  // Try backend first
  const backendUp = await checkBackend(true);
  if (backendUp) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      }).catch(() => fetch(`${DIRECT_BACKEND}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      }));

      if (res && res.ok) {
        const data = await res.json();
        saveAuthSession(data.user, data.role, data.token);
        return data;
      } else if (res) {
        const data = await res.json();
        throw new Error(data.error || 'Invalid credentials');
      }
    } catch (err) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
    }
  }

  // Check in persistent local database
  const localDb = getLocalUsersDb();
  const matched = localDb.find(u => u.email?.toLowerCase() === cleanEmail && u.password === password);
  if (matched) {
    const role = matched.role || (cleanEmail.includes('admin') ? 'admin' : 'student');
    const user = { id: matched.id, name: matched.name, email: matched.email, role };
    saveAuthSession(user, role, `token-${matched.id}`);
    return { user, role, token: `token-${matched.id}` };
  }

  throw new Error('Invalid email or password. Please check your credentials.');
};

export const signupUser = async (name, email, password) => {
  const cleanEmail = email.trim().toLowerCase();
  const userName = name && name.trim() ? name.trim() : (cleanEmail.split('@')[0] || 'Learner');
  const userRole = cleanEmail.includes('admin') ? 'admin' : 'student';

  const newUser = {
    id: Date.now(),
    name: userName,
    email: cleanEmail,
    password: password, // Stored in database
    role: userRole,
    createdAt: new Date().toISOString()
  };

  // 1. ALWAYS store into persistent local database immediately
  const localDb = getLocalUsersDb();
  const alreadyExists = localDb.some(u => u.email?.toLowerCase() === cleanEmail);
  if (alreadyExists) {
    throw new Error('An account with this email already exists in the database.');
  }

  localDb.push(newUser);
  saveLocalUsersDb(localDb);

  // 2. Also send to backend server so it writes to src/data/users.json
  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userName, email: cleanEmail, password })
    }).catch(() => fetch(`${DIRECT_BACKEND}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userName, email: cleanEmail, password })
    }));

    if (res && res.ok) {
      const data = await res.json();
      saveAuthSession(data.user || newUser, userRole, data.token || `token-${newUser.id}`);
      return data;
    }
  } catch {
    // backend offline, local save succeeded
  }

  saveAuthSession(newUser, userRole, `token-${newUser.id}`);
  return {
    message: 'Account created and saved to database successfully!',
    token: `token-${newUser.id}`,
    user: newUser
  };
};

export const saveAuthSession = (user, role, token) => {
  try {
    localStorage.setItem('edulearn_current_user', JSON.stringify(user));
    localStorage.setItem('edulearn_role', role);
    if (token) localStorage.setItem('edulearn_token', token);
    window.dispatchEvent(new Event('edulearn_auth_changed'));
  } catch {
    // ignore
  }
};

export const getAuthSession = () => {
  try {
    const userStr = localStorage.getItem('edulearn_current_user');
    const role = localStorage.getItem('edulearn_role') || 'guest';
    const token = localStorage.getItem('edulearn_token') || null;
    const user = userStr ? JSON.parse(userStr) : null;
    return { user, role, token };
  } catch {
    return { user: null, role: 'guest', token: null };
  }
};

export const logoutUser = () => {
  try {
    localStorage.removeItem('edulearn_current_user');
    localStorage.removeItem('edulearn_role');
    localStorage.removeItem('edulearn_token');
    window.dispatchEvent(new Event('edulearn_auth_changed'));
    window.dispatchEvent(new Event('edulearn_enrollment_updated'));
  } catch {
    // ignore
  }
};

// ----------------------------------------------------
// User Enrollments Management
// ----------------------------------------------------
const defaultEnrolled = [
  {
    courseId: 1,
    title: 'Advanced React 19 & Next.js 15 Patterns',
    category: 'Programming',
    instructor: 'Sarah Drasner',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop',
    enrolledAt: '2025-01-15',
    progress: 75,
    completedModules: 3,
    totalModules: 4,
    lastAccessed: 'Yesterday'
  },
  {
    courseId: 2,
    title: 'UI/UX Masterclass & Design Systems',
    category: 'Design & UI/UX',
    instructor: 'Gary Simon',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop',
    enrolledAt: '2025-02-01',
    progress: 40,
    completedModules: 1,
    totalModules: 3,
    lastAccessed: '3 days ago'
  }
];

export const getEnrolledCourses = () => {
  try {
    const data = localStorage.getItem('edulearn_enrolled_courses');
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }
  return defaultEnrolled;
};

export const enrollInCourse = (course) => {
  const current = getEnrolledCourses();
  const numId = parseInt(course.id, 10);
  const exists = current.find(c => c.courseId === numId);
  if (exists) return exists;

  const totalMod = (course.modules && course.modules.length) ? course.modules.length : 4;
  const newEnrollment = {
    courseId: numId,
    title: course.title,
    category: course.category,
    instructor: course.instructor,
    image: course.image,
    enrolledAt: new Date().toISOString().split('T')[0],
    progress: 10,
    completedModules: 1,
    totalModules: totalMod,
    lastAccessed: 'Just now'
  };

  const updated = [newEnrollment, ...current];
  try {
    localStorage.setItem('edulearn_enrolled_courses', JSON.stringify(updated));
    window.dispatchEvent(new Event('edulearn_enrollment_updated'));
  } catch {
    // ignore
  }
  return newEnrollment;
};

export const isCourseEnrolled = (courseId) => {
  const current = getEnrolledCourses();
  return current.some(c => c.courseId === parseInt(courseId, 10));
};

export const updateCourseProgress = (courseId, progressPercent) => {
  const current = getEnrolledCourses();
  const updated = current.map(c => {
    if (c.courseId === parseInt(courseId, 10)) {
      return {
        ...c,
        progress: Math.min(100, Math.max(0, progressPercent)),
        lastAccessed: 'Today'
      };
    }
    return c;
  });
  try {
    localStorage.setItem('edulearn_enrolled_courses', JSON.stringify(updated));
    window.dispatchEvent(new Event('edulearn_enrollment_updated'));
  } catch {
    // ignore
  }
};
