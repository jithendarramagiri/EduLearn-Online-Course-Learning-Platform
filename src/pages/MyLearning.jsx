import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, PlayCircle, Award, CheckCircle, Clock, 
  ArrowRight, Sparkles, TrendingUp, Compass, Check
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getEnrolledCourses, updateCourseProgress, getAuthSession } from '../services/api';
import './MyLearning.css';

const MyLearning = () => {
  const [enrolledList, setEnrolledList] = useState(() => getEnrolledCourses());
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'in-progress' | 'completed'
  const [session, setSession] = useState(() => getAuthSession());
  const [toastMsg, setToastMsg] = useState('');

  const refreshEnrollments = () => {
    setEnrolledList(getEnrolledCourses());
  };

  useEffect(() => {
    const handleUpdate = () => {
      setEnrolledList(getEnrolledCourses());
      setSession(getAuthSession());
    };
    window.addEventListener('edulearn_enrollment_updated', handleUpdate);
    return () => window.removeEventListener('edulearn_enrollment_updated', handleUpdate);
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleAdvanceProgress = (courseId, currentProgress, title) => {
    const nextProgress = Math.min(100, currentProgress + 25);
    updateCourseProgress(courseId, nextProgress);
    refreshEnrollments();
    if (nextProgress === 100) {
      showToast(`🎉 Congratulations! You completed "${title}" and unlocked your certificate!`);
    } else {
      showToast(`Progress saved: ${nextProgress}% complete in "${title}".`);
    }
  };

  const inProgressCount = enrolledList.filter(c => (c.progress || 0) < 100).length;
  const completedCount = enrolledList.filter(c => (c.progress || 0) >= 100).length;

  const filteredCourses = enrolledList.filter(c => {
    if (filterTab === 'in-progress') return (c.progress || 0) < 100;
    if (filterTab === 'completed') return (c.progress || 0) >= 100;
    return true;
  });

  return (
    <div className="app-container">
      <Navbar />

      {/* Floating toast */}
      {toastMsg && (
        <div className="learning-toast animate-fade-in">
          <Check size={18} className="text-green" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="main-content">
        <div className="my-learning-container animate-fade-in">
          
          {/* Header Banner */}
          <header className="my-learning-header">
            <div className="header-info-block">
              <div className="student-badge">
                <Sparkles size={16} className="text-primary" />
                <span>Student Hub • {session.user?.name || 'Learner'}</span>
              </div>
              <h1>My Enrolled Masterclasses</h1>
              <p className="text-secondary">
                Track your active curricula, module completions, and professional certifications.
              </p>
            </div>

            <Link to="/courses" className="btn-outline btn-catalog-link">
              <Compass size={18} />
              <span>Browse 5,000+ Courses</span>
            </Link>
          </header>

          {/* Top Progress Metrics */}
          <div className="learning-stats-row">
            <div className="learning-stat-card glass-panel">
              <div className="stat-card-icon bg-purple">
                <BookOpen size={22} />
              </div>
              <div className="stat-card-text">
                <span className="stat-num">{enrolledList.length}</span>
                <span className="stat-title">Enrolled Courses</span>
              </div>
            </div>

            <div className="learning-stat-card glass-panel">
              <div className="stat-card-icon bg-cyan">
                <TrendingUp size={22} />
              </div>
              <div className="stat-card-text">
                <span className="stat-num">{inProgressCount}</span>
                <span className="stat-title">In Progress</span>
              </div>
            </div>

            <div className="learning-stat-card glass-panel">
              <div className="stat-card-icon bg-emerald">
                <Award size={22} />
              </div>
              <div className="stat-card-text">
                <span className="stat-num">{completedCount}</span>
                <span className="stat-title">Certificates Earned</span>
              </div>
            </div>

            <div className="learning-stat-card glass-panel">
              <div className="stat-card-icon bg-amber">
                <Clock size={22} />
              </div>
              <div className="stat-card-text">
                <span className="stat-num">{(enrolledList.length * 9.5).toFixed(1)} hrs</span>
                <span className="stat-title">Learning Time Logged</span>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="learning-filter-tabs">
            <button 
              className={`filter-tab-btn ${filterTab === 'all' ? 'active' : ''}`}
              onClick={() => setFilterTab('all')}
            >
              All Enrolled ({enrolledList.length})
            </button>
            <button 
              className={`filter-tab-btn ${filterTab === 'in-progress' ? 'active' : ''}`}
              onClick={() => setFilterTab('in-progress')}
            >
              In Progress ({inProgressCount})
            </button>
            <button 
              className={`filter-tab-btn ${filterTab === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterTab('completed')}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Enrolled Courses List / Grid */}
          <div className="enrolled-courses-grid">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((item) => {
                const progress = item.progress || 0;
                const isComplete = progress >= 100;
                return (
                  <div key={item.courseId} className="enrolled-card glass-panel animate-fade-in">
                    <div className="enrolled-thumb-wrapper">
                      <img src={item.image} alt={item.title} className="enrolled-thumb-img" />
                      <div className="thumb-status-overlay">
                        {isComplete ? (
                          <span className="status-badge-complete">
                            <CheckCircle size={14} /> Completed
                          </span>
                        ) : (
                          <span className="status-badge-active">
                            <PlayCircle size={14} /> Active Track
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="enrolled-card-body">
                      <div className="enrolled-card-header">
                        <span className="enrolled-category">{item.category}</span>
                        <span className="enrolled-date">Enrolled: {item.enrolledAt}</span>
                      </div>

                      <h3 className="enrolled-title">
                        <Link to={`/courses/${item.courseId}`}>{item.title}</Link>
                      </h3>

                      <p className="enrolled-instructor">Instructor: <strong>{item.instructor}</strong></p>

                      {/* Interactive Progress Bar */}
                      <div className="enrolled-progress-section">
                        <div className="progress-labels">
                          <span className="progress-pct">{progress}% Completed</span>
                          <span className="progress-modules">
                            {isComplete ? 'All Modules Finished' : `${Math.ceil((progress / 100) * (item.totalModules || 4))} of ${item.totalModules || 4} Modules`}
                          </span>
                        </div>
                        <div className="progress-track">
                          <div 
                            className={`progress-fill ${isComplete ? 'complete' : ''}`} 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="enrolled-card-footer">
                        {isComplete ? (
                          <button 
                            className="btn-certificate" 
                            onClick={() => alert(`Certificate verified for ${session.user?.name || 'Student'}: "${item.title}"! Generated with ID: EDU-${item.courseId}-2025`)}
                          >
                            <Award size={16} />
                            <span>Download Certificate</span>
                          </button>
                        ) : (
                          <button 
                            className="btn-advance-progress"
                            onClick={() => handleAdvanceProgress(item.courseId, progress, item.title)}
                            title="Simulate completing the next module"
                          >
                            <Check size={16} />
                            <span>+25% Progress</span>
                          </button>
                        )}

                        <Link to={`/courses/${item.courseId}`} className="btn-resume-course">
                          <span>{isComplete ? 'Review Course' : 'Resume Masterclass'}</span>
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-enrolled-box glass-panel">
                <BookOpen size={54} className="text-secondary mb-3" />
                <h3>No courses found in this category</h3>
                <p className="text-secondary">
                  {filterTab === 'completed' 
                    ? 'You have not completed any courses yet. Advance your progress on in-progress masterclasses!'
                    : 'You are not currently enrolled in any courses. Explore our catalog of 5,000+ masterclasses!'}
                </p>
                <Link to="/courses" className="btn-primary mt-4">
                  Explore 5,000+ Courses & Enroll
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLearning;
