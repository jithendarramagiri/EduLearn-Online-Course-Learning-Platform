import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Users, IndianRupee, TrendingUp, Sparkles, Plus, Loader, 
  CheckCircle, Zap, Search, Trash2, ExternalLink, X, Filter, ShieldCheck, Check, Eye
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { fetchAdminStats, fetchCourses, addCourse, deleteCourse, getTotalCoursesCount, getEnrolledCourses } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine current tab from URL path
  const currentTab = location.pathname === '/admin/courses' ? 'courses'
    : location.pathname === '/admin/users' ? 'users'
    : location.pathname === '/admin/settings' ? 'settings'
    : 'overview';

  const [topicInput, setTopicInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState(null);
  const [totalCoursesCount, setTotalCoursesCount] = useState(() => getTotalCoursesCount());
  
  const [dashboardStats, setDashboardStats] = useState(() => ({
    totalRevenue: '₹84,52,430.50', 
    revenueChange: '+24.6% this month',
    activeCourses: getTotalCoursesCount().toLocaleString(), 
    coursesChange: '+45 new courses added',
    totalStudents: '38,420', 
    studentsChange: '+2,850 this week',
    completionRate: '74%', 
    completionChange: '+6.2% from last month'
  }));

  // Courses tab state
  const [courseList, setCourseList] = useState([]);
  const [courseSearch, setCourseSearch] = useState('');
  const [courseCategory, setCourseCategory] = useState('All');
  const [coursePage, setCoursePage] = useState(1);
  const [totalFilteredCourses, setTotalFilteredCourses] = useState(0);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const coursesPerPage = 10;

  // Add course modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCourseForm, setNewCourseForm] = useState({
    title: '',
    category: 'Programming',
    instructor: 'Admin Instructor',
    level: 'Beginner',
    price: '₹4,999',
    duration: '6 weeks',
    description: ''
  });

  // Notification state
  const [actionMessage, setActionMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const showNotification = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 4000);
  };

  // Load stats helper
  const refreshStats = async () => {
    try {
      const data = await fetchAdminStats();
      const count = getTotalCoursesCount();
      setTotalCoursesCount(count);
      setDashboardStats({
        ...data,
        activeCourses: count.toLocaleString()
      });
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  useEffect(() => {
    let active = true;
    fetchAdminStats().then(data => {
      if (!active) return;
      const count = getTotalCoursesCount();
      setTotalCoursesCount(count);
      setDashboardStats({
        ...data,
        activeCourses: count.toLocaleString()
      });
    }).catch(console.error);
    return () => { active = false; };
  }, []);

  // Reload courses list for courses tab
  const refreshCoursesList = async () => {
    setCoursesLoading(true);
    try {
      const offset = (coursePage - 1) * coursesPerPage;
      const data = await fetchCourses({
        category: courseCategory,
        search: courseSearch,
        limit: coursesPerPage,
        offset
      });
      setCourseList(data.courses);
      setTotalFilteredCourses(data.total);
      setTotalCoursesCount(getTotalCoursesCount());
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    if (currentTab !== 'courses') return;
    let active = true;
    const offset = (coursePage - 1) * coursesPerPage;
    fetchCourses({
      category: courseCategory,
      search: courseSearch,
      limit: coursesPerPage,
      offset
    }).then(data => {
      if (!active) return;
      setCourseList(data.courses);
      setTotalFilteredCourses(data.total);
      setTotalCoursesCount(getTotalCoursesCount());
      setCoursesLoading(false);
    }).catch(err => {
      if (!active) return;
      console.error('Failed to load courses', err);
      setCoursesLoading(false);
    });
    return () => { active = false; };
  }, [currentTab, courseSearch, courseCategory, coursePage]);

  const stats = [
    { title: 'Total Revenue', value: dashboardStats.totalRevenue, change: dashboardStats.revenueChange, icon: <IndianRupee size={20} className="text-green" /> },
    { title: 'Total Courses', value: `${totalCoursesCount.toLocaleString()} Courses`, change: `${totalCoursesCount} Active in Catalog`, icon: <BookOpen size={20} className="text-blue" /> },
    { title: 'Total Students', value: dashboardStats.totalStudents, change: dashboardStats.studentsChange, icon: <Users size={20} className="text-purple" /> },
    { title: 'Completion Rate', value: dashboardStats.completionRate, change: dashboardStats.completionChange, icon: <TrendingUp size={20} className="text-orange" /> }
  ];

  // AI Course Architect
  const handleGenerate = (e) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    
    setIsGenerating(true);
    setGeneratedCourse(null);

    setTimeout(() => {
      const formattedTopic = topicInput.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      setGeneratedCourse({
        title: `Mastering ${formattedTopic}`,
        category: 'Programming',
        instructor: 'Sarah Drasner',
        description: `An AI-generated comprehensive curriculum designed to take students from fundamentals to advanced concepts in ${topicInput} through hands-on projects.`,
        price: '₹' + Math.floor(Math.random() * (12000 - 3000) + 3000).toLocaleString('en-IN'),
        duration: '4 Weeks',
        level: 'Intermediate',
        modules: [
          `1. Fundamentals of ${topicInput}`,
          `2. Deep Dive & Core Architecture`,
          `3. Real-World Applications & Tooling`,
          `4. Capstone Project & Deployment`
        ]
      });
      setIsGenerating(false);
    }, 1800);
  };

  const publishCourse = () => {
    if (!generatedCourse) return;
    const added = addCourse({
      ...generatedCourse,
      whatYouWillLearn: [
        `Master fundamental principles of ${generatedCourse.title}`,
        'Build production-grade real world applications',
        'Learn testing, deployment, and optimization techniques',
        'Follow industry best practices and clean architecture'
      ]
    });
    
    setGeneratedCourse(null);
    setTopicInput('');
    refreshStats();
    showNotification(`Success! "${added.title}" was published to the catalog. Total courses: ${getTotalCoursesCount()}`);
  };

  // Add course manually
  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourseForm.title.trim()) return;

    const created = addCourse(newCourseForm);
    setIsAddModalOpen(false);
    setNewCourseForm({
      title: '',
      category: 'Programming',
      instructor: 'Admin Instructor',
      level: 'Beginner',
      price: '₹4,999',
      duration: '6 weeks',
      description: ''
    });
    refreshStats();
    if (currentTab === 'courses') {
      refreshCoursesList();
    }
    showNotification(`Course "${created.title}" added successfully! Total courses now: ${getTotalCoursesCount()}`);
  };

  // Delete course
  const handleDeleteCourse = (id, title) => {
    if (window.confirm(`Are you sure you want to delete course "${title}"?`)) {
      deleteCourse(id);
      refreshStats();
      if (currentTab === 'courses') {
        refreshCoursesList();
      }
      showNotification(`Course #${id} "${title}" has been deleted. Total courses: ${getTotalCoursesCount()}`);
    }
  };

  const categories = ['All', 'Programming', 'Design', 'Data Science', 'Business', 'IT & Software', 'Photography', 'Personal Development', 'Marketing', 'Music', 'Health & Fitness'];

  const realEnrolled = getEnrolledCourses();

  // Mock users list for users tab with full enrollment histories
  const mockUsers = [
    { 
      id: 1, 
      name: 'Active Learner', 
      email: 'student@edulearn.com', 
      role: 'Student', 
      status: 'Active', 
      joined: 'Today',
      enrollments: realEnrolled.map(c => ({
        id: c.courseId,
        title: c.title,
        category: c.category,
        progress: c.progress || 25,
        date: c.enrolledAt || '2025-01-15'
      }))
    },
    { 
      id: 2, 
      name: 'Priya Sharma', 
      email: 'priya.s@example.com', 
      role: 'Student', 
      status: 'Active', 
      joined: 'May 2024',
      enrollments: [
        { id: 1, title: 'Advanced React 19 & Next.js 15 Patterns', category: 'Programming', progress: 100, date: '2024-11-20' },
        { id: 2, title: 'UI/UX Masterclass & Design Systems', category: 'Design & UI/UX', progress: 75, date: '2024-12-10' },
        { id: 3, title: 'Full-Stack Generative AI & Autonomous Agents', category: 'Artificial Intelligence', progress: 40, date: '2025-01-05' }
      ]
    },
    { 
      id: 3, 
      name: 'Rahul Verma', 
      email: 'rahul.v@example.com', 
      role: 'Student', 
      status: 'Active', 
      joined: 'Jun 2024',
      enrollments: [
        { id: 5, title: 'Cloud Architecture on AWS', category: 'Cloud & DevOps', progress: 60, date: '2025-01-18' },
        { id: 7, title: 'Kubernetes & Docker in Production', category: 'Cloud & DevOps', progress: 20, date: '2025-02-01' }
      ]
    },
    { 
      id: 4, 
      name: 'Elena Rostova', 
      email: 'elena.r@example.com', 
      role: 'Student', 
      status: 'Active', 
      joined: 'Jul 2024',
      enrollments: [
        { id: 3, title: 'Full-Stack Generative AI & Autonomous Agents', category: 'Artificial Intelligence', progress: 95, date: '2024-10-12' },
        { id: 8, title: 'Rust for High-Performance Systems', category: 'Software Systems', progress: 40, date: '2024-12-28' }
      ]
    },
    { 
      id: 5, 
      name: 'Sarah Drasner', 
      email: 'sarah.d@edulearn.com', 
      role: 'Instructor', 
      status: 'Active', 
      joined: 'Feb 2024',
      enrollments: [
        { id: 1, title: 'Advanced React 19 & Next.js 15 Patterns', category: 'Programming', progress: 100, date: '2024-02-15' }
      ]
    },
    { 
      id: 6, 
      name: 'Admin User', 
      email: 'admin@edulearn.com', 
      role: 'Admin', 
      status: 'Active', 
      joined: 'Jan 2024',
      enrollments: [
        { id: 1, title: 'Advanced React 19 & Next.js 15 Patterns', category: 'Programming', progress: 100, date: '2024-01-10' }
      ]
    }
  ];

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        {/* Toast Notification */}
        {actionMessage && (
          <div className="admin-toast animate-fade-in">
            <CheckCircle size={18} className="text-green" />
            <span>{actionMessage}</span>
          </div>
        )}

        <header className="admin-header">
          <div>
            <h1>
              {currentTab === 'overview' && 'Dashboard Overview'}
              {currentTab === 'courses' && 'Course Catalog Management'}
              {currentTab === 'users' && 'User & Student Directory'}
              {currentTab === 'settings' && 'Platform Settings'}
            </h1>
            <p className="text-secondary">
              {currentTab === 'overview' && `Welcome back, Admin! Managing ${totalCoursesCount.toLocaleString()} courses across 10 categories.`}
              {currentTab === 'courses' && `Browse, search, edit, or add courses. Total active courses: ${totalCoursesCount.toLocaleString()}`}
              {currentTab === 'users' && `Manage platform students, instructors, and administrator permissions.`}
              {currentTab === 'settings' && `Configure platform general settings, notifications, and branding.`}
            </p>
          </div>
          <div className="admin-header-actions">
            <a 
              href="http://localhost:5000" 
              target="_blank" 
              rel="noreferrer" 
              className="backend-status-pill online" 
              title="Admin Only: View Port 5000 Backend & Database"
              style={{ textDecoration: 'none' }}
            >
              <span className="backend-dot online"></span>
              <span>Port 5000 Backend</span>
            </a>
            <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={18} />
              New Course
            </button>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {currentTab === 'overview' && (
          <>
            <div className="stats-grid animate-fade-in">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card glass-panel" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="stat-header">
                    <span className="stat-title">{stat.title}</span>
                    <div className="stat-icon">{stat.icon}</div>
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-change">{stat.change}</div>
                </div>
              ))}
            </div>

            {/* Quick Courses Banner */}
            <div className="courses-quick-banner glass-panel animate-fade-in">
              <div className="quick-banner-info">
                <BookOpen size={24} className="text-blue" />
                <div>
                  <h4>Live Platform Course Catalog</h4>
                  <p>Currently serving <strong>{totalCoursesCount.toLocaleString()} courses</strong> with high-definition video modules & verified certificates.</p>
                </div>
              </div>
              <button className="btn-outline btn-small" onClick={() => navigate('/admin/courses')}>
                Manage Courses ({totalCoursesCount.toLocaleString()})
              </button>
            </div>

            <div className="dashboard-row animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {/* Revenue Chart Panel */}
              <div className="dashboard-panel glass-panel flex-2">
                <h3 className="panel-title">Revenue Growth (Last 6 Months)</h3>
                <div className="css-chart">
                  <div className="bar-wrapper"><div className="bar" style={{ height: '40%' }}></div><span className="bar-label">Mar</span></div>
                  <div className="bar-wrapper"><div className="bar" style={{ height: '55%' }}></div><span className="bar-label">Apr</span></div>
                  <div className="bar-wrapper"><div className="bar" style={{ height: '45%' }}></div><span className="bar-label">May</span></div>
                  <div className="bar-wrapper"><div className="bar" style={{ height: '70%' }}></div><span className="bar-label">Jun</span></div>
                  <div className="bar-wrapper"><div className="bar" style={{ height: '85%' }}></div><span className="bar-label">Jul</span></div>
                  <div className="bar-wrapper"><div className="bar" style={{ height: '100%' }}></div><span className="bar-label">Aug</span></div>
                </div>
              </div>

              {/* Smart Insights Panel */}
              <div className="dashboard-panel glass-panel flex-1 insights-panel">
                <div className="panel-title-wrapper">
                  <Zap size={20} className="text-orange" />
                  <h3 className="panel-title">AI Smart Insights</h3>
                </div>
                <div className="insight-item">
                  <span className="insight-dot dot-green"></span>
                  <p><strong>{totalCoursesCount.toLocaleString()} courses</strong> active. Programming & Data Science lead enrollment by 34%.</p>
                </div>
                <div className="insight-item">
                  <span className="insight-dot dot-orange"></span>
                  <p>High drop-off detected in "Design Fundamentals" Module 3. Review content pacing.</p>
                </div>
                <div className="insight-item">
                  <span className="insight-dot dot-blue"></span>
                  <p>Mobile traffic increased by 22% this week. Ensure all new video assets are optimized.</p>
                </div>
              </div>
            </div>

            {/* AI Course Architect Panel */}
            <div className="ai-architect-panel glass-panel animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="ai-header">
                <div className="ai-title-wrapper">
                  <Sparkles size={28} className="text-gradient-primary" />
                  <h2>AI Course Architect</h2>
                </div>
                <p>Type any subject and our AI will instantly generate a structured curriculum ready to be published to your <strong>{totalCoursesCount.toLocaleString()} courses</strong> catalog.</p>
              </div>

              <form onSubmit={handleGenerate} className="ai-input-wrapper">
                <input 
                  type="text" 
                  placeholder="E.g., 'Full-Stack Next.js 15', 'Machine Learning with PyTorch', or 'Docker Masterclass'"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  className="ai-input"
                  disabled={isGenerating}
                />
                <button type="submit" className="btn-primary" disabled={isGenerating || !topicInput.trim()}>
                  {isGenerating ? <><Loader size={18} className="spin" /> Generating...</> : 'Generate Magic'}
                </button>
              </form>

              {isGenerating && (
                <div className="ai-loading">
                  <div className="loading-pulse"></div>
                  <p>Analyzing learning tracks and curriculum data to structure the course...</p>
                </div>
              )}

              {generatedCourse && (
                <div className="generated-course-preview animate-fade-in">
                  <div className="preview-header">
                    <div>
                      <h3>{generatedCourse.title}</h3>
                      <span className="preview-category-badge">{generatedCourse.category}</span>
                    </div>
                    <div className="preview-badges">
                      <span className="badge-duration">{generatedCourse.duration}</span>
                      <span className="badge-price">Est. {generatedCourse.price}</span>
                    </div>
                  </div>
                  <p className="preview-desc">{generatedCourse.description}</p>
                  
                  <div className="preview-modules">
                    <h4>Generated Curriculum</h4>
                    <div className="modules-grid">
                      {generatedCourse.modules.map((mod, i) => (
                        <div key={i} className="module-item-ai">
                          <CheckCircle size={16} className="text-success" />
                          <span>{mod}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button className="btn-primary w-full publish-btn" onClick={publishCourse}>
                    <Check size={18} />
                    Approve & Publish to Course Catalog (+1 Course)
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: COURSES MANAGEMENT */}
        {/* ========================================================================= */}
        {currentTab === 'courses' && (
          <div className="courses-management-view animate-fade-in">
            <div className="courses-controls-bar glass-panel">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by title or instructor..." 
                  value={courseSearch}
                  onChange={(e) => { setCourseSearch(e.target.value); setCoursePage(1); }}
                  className="input-field"
                />
              </div>

              <div className="filter-box">
                <Filter size={18} className="filter-icon" />
                <select 
                  value={courseCategory} 
                  onChange={(e) => { setCourseCategory(e.target.value); setCoursePage(1); }}
                  className="select-field"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="count-badge">
                <BookOpen size={16} />
                <span>Showing <strong>{totalFilteredCourses}</strong> of <strong>{totalCoursesCount.toLocaleString()}</strong> courses</span>
              </div>
            </div>

            {coursesLoading ? (
              <div className="loading-state glass-panel">
                <Loader size={36} className="spin text-primary" style={{ margin: '0 auto 1rem' }} />
                <p>Loading course catalog...</p>
              </div>
            ) : (
              <div className="admin-table-wrapper glass-panel">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Course Title</th>
                      <th>Category</th>
                      <th>Instructor</th>
                      <th>Level</th>
                      <th>Price</th>
                      <th>Rating / Students</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseList.length > 0 ? (
                      courseList.map((c) => (
                        <tr key={c.id}>
                          <td className="font-mono text-secondary">#{c.id}</td>
                          <td>
                            <div className="course-title-cell">
                              <img src={c.image} alt={c.title} className="course-thumb" />
                              <span className="course-name">{c.title}</span>
                            </div>
                          </td>
                          <td><span className="category-tag">{c.category}</span></td>
                          <td>{c.instructor}</td>
                          <td><span className={`level-tag ${c.level?.toLowerCase()}`}>{c.level}</span></td>
                          <td className="font-bold text-green">{c.price}</td>
                          <td>⭐ {c.rating} <span className="text-secondary">({c.students})</span></td>
                          <td>
                            <div className="table-actions">
                              <Link to={`/courses/${c.id}`} target="_blank" className="action-icon-btn text-blue" title="View Course Details">
                                <ExternalLink size={16} />
                              </Link>
                              <button 
                                className="action-icon-btn text-danger" 
                                title="Delete Course"
                                onClick={() => handleDeleteCourse(c.id, c.title)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-6 text-secondary">
                          No courses matching your filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="admin-pagination">
                  <span className="text-secondary text-sm">
                    Page {coursePage} of {Math.ceil(totalFilteredCourses / coursesPerPage) || 1}
                  </span>
                  <div className="pagination-buttons">
                    <button 
                      className="btn-outline btn-small"
                      disabled={coursePage <= 1}
                      onClick={() => setCoursePage(p => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>
                    <button 
                      className="btn-outline btn-small"
                      disabled={coursePage >= Math.ceil(totalFilteredCourses / coursesPerPage)}
                      onClick={() => setCoursePage(p => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: USERS DIRECTORY */}
        {/* ========================================================================= */}
        {currentTab === 'users' && (
          <div className="users-management-view animate-fade-in">
            <div className="admin-table-wrapper glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Enrolled Courses</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="font-semibold">{u.name}</td>
                      <td className="text-secondary">{u.email}</td>
                      <td>
                        <span className={`role-tag ${u.role.toLowerCase()}`}>
                          {u.role === 'Admin' && <ShieldCheck size={14} />}
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span className="font-semibold" style={{ color: '#38bdf8' }}>
                          {u.enrollments?.length || 0} courses
                        </span>
                      </td>
                      <td><span className="status-pill active">{u.status}</span></td>
                      <td className="text-secondary">{u.joined}</td>
                      <td>
                        <button 
                          className="btn-outline btn-small"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => setSelectedUser(u)}
                        >
                          <Eye size={14} />
                          <span>View Enrolled ({u.enrollments?.length || 0})</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SETTINGS */}
        {/* ========================================================================= */}
        {currentTab === 'settings' && (
          <div className="admin-settings-view animate-fade-in">
            <div className="settings-card glass-panel">
              <h3>Platform Configuration</h3>
              <p className="text-secondary mb-4">Manage general platform settings and course publishing rules.</p>
              
              <div className="settings-row">
                <div>
                  <h4>Platform Title</h4>
                  <p className="text-secondary text-sm">Displayed on navbar and browser tab</p>
                </div>
                <input type="text" className="input-field" defaultValue="EduLearn Platform" style={{ maxWidth: '300px' }} />
              </div>

              <div className="settings-row">
                <div>
                  <h4>Public Registration</h4>
                  <p className="text-secondary text-sm">Allow new students to register through the signup page</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle-switch" />
              </div>

              <div className="settings-row">
                <div>
                  <h4>Total Catalog Courses Display</h4>
                  <p className="text-secondary text-sm">Display total active count ({totalCoursesCount.toLocaleString()} courses) in header</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle-switch" />
              </div>

              <div className="settings-row">
                <div>
                  <h4>Currency Display</h4>
                  <p className="text-secondary text-sm">Default currency for all course listings</p>
                </div>
                <select className="select-field" style={{ maxWidth: '200px' }} defaultValue="INR">
                  <option value="INR">₹ INR (Indian Rupee)</option>
                  <option value="USD">$ USD (US Dollar)</option>
                  <option value="EUR">€ EUR (Euro)</option>
                </select>
              </div>

              <button className="btn-primary mt-4" onClick={() => showNotification('Settings saved successfully!')}>
                Save Platform Settings
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: ADD NEW COURSE */}
        {/* ========================================================================= */}
        {isAddModalOpen && (
          <div className="modal-backdrop">
            <div className="modal-content glass-panel animate-fade-in">
              <div className="modal-header">
                <h3>Add New Course to Platform</h3>
                <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="modal-form">
                <div className="form-group">
                  <label>Course Title *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="E.g., Complete Python Bootcamp" 
                    value={newCourseForm.title}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Category</label>
                    <select 
                      className="select-field"
                      value={newCourseForm.category}
                      onChange={(e) => setNewCourseForm({ ...newCourseForm, category: e.target.value })}
                    >
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group flex-1">
                    <label>Instructor</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Instructor name"
                      value={newCourseForm.instructor}
                      onChange={(e) => setNewCourseForm({ ...newCourseForm, instructor: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Level</label>
                    <select 
                      className="select-field"
                      value={newCourseForm.level}
                      onChange={(e) => setNewCourseForm({ ...newCourseForm, level: e.target.value })}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>

                  <div className="form-group flex-1">
                    <label>Price (INR)</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="₹4,999"
                      value={newCourseForm.price}
                      onChange={(e) => setNewCourseForm({ ...newCourseForm, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label>Duration</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="6 weeks"
                      value={newCourseForm.duration}
                      onChange={(e) => setNewCourseForm({ ...newCourseForm, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Course Description</label>
                  <textarea 
                    className="input-field" 
                    rows="3"
                    placeholder="Detailed overview of what the course covers..."
                    value={newCourseForm.description}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, description: e.target.value })}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <Plus size={18} />
                    Add Course to Catalog
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User Enrolled Courses Inspector Modal */}
        {selectedUser && (
          <div className="modal-overlay animate-fade-in" onClick={() => setSelectedUser(null)}>
            <div className="modal-card glass-panel" style={{ maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3>{selectedUser.name}&apos;s Enrolled Courses</h3>
                  <p className="text-secondary text-sm">{selectedUser.email} • {selectedUser.enrollments?.length || 0} enrolled courses</p>
                </div>
                <button className="modal-close" onClick={() => setSelectedUser(null)}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', margin: '1.2rem 0' }}>
                {(!selectedUser.enrollments || selectedUser.enrollments.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                    <BookOpen size={40} className="text-secondary" style={{ opacity: 0.5, margin: '0 auto 0.75rem' }} />
                    <h4 style={{ color: '#cbd5e1', marginBottom: '0.35rem' }}>No Active Enrollments</h4>
                    <p className="text-secondary text-sm">This user hasn&apos;t enrolled in any courses yet.</p>
                  </div>
                ) : (
                  selectedUser.enrollments.map((en, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        padding: '1rem', 
                        background: 'rgba(255,255,255,0.03)', 
                        borderRadius: '12px', 
                        border: '1px solid rgba(255,255,255,0.08)' 
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <h4 style={{ fontSize: '0.98rem', fontWeight: '600', color: '#f8fafc', marginBottom: '0.25rem' }}>
                            {en.title}
                          </h4>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: '500' }}>
                            {en.category || 'General'}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: (en.progress || 0) >= 100 ? '#10b981' : '#38bdf8' }}>
                          {(en.progress || 0) >= 100 ? 'Completed' : `${en.progress || 0}% Progress`}
                        </span>
                      </div>

                      <div style={{ width: '100%', height: '7px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', margin: '0.65rem 0' }}>
                        <div 
                          style={{ 
                            width: `${Math.min(100, Math.max(5, en.progress || 10))}%`, 
                            height: '100%', 
                            background: (en.progress || 0) >= 100 
                              ? 'linear-gradient(90deg, #10b981, #059669)' 
                              : 'linear-gradient(90deg, #3b82f6, #06b6d4)', 
                            borderRadius: '4px',
                            transition: 'width 0.4s ease'
                          }} 
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
                        <span>Enrolled Date: {en.date || 'Active'}</span>
                        {(en.progress || 0) >= 100 ? (
                          <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600' }}>
                            <CheckCircle size={14} /> Certificate Issued
                          </span>
                        ) : (
                          <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Zap size={13} /> In Progress
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-primary" onClick={() => setSelectedUser(null)}>
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
