import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, Clock, Users, PlayCircle, CheckCircle, 
  ArrowLeft, Loader, Check, Award 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { fetchCourseById, isCourseEnrolled, enrollInCourse } from '../services/api';
import './CourseDetails.css';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollToast, setEnrollToast] = useState('');

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      try {
        const data = await fetchCourseById(id);
        setCourse(data);
        setEnrolled(isCourseEnrolled(id));
      } catch (err) {
        setError(err.message || 'Course not found');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  const handleEnroll = () => {
    if (enrolled) {
      navigate('/my-learning');
      return;
    }

    if (course) {
      enrollInCourse(course);
      setEnrolled(true);
      setEnrollToast(`🎉 Success! You are now officially enrolled in "${course.title}". Access it anytime in My Learning.`);
      setTimeout(() => setEnrollToast(''), 4500);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="loading-state" style={{ marginTop: '100px', textAlign: 'center' }}>
          <Loader size={44} className="spin text-primary" style={{ margin: '0 auto 1rem' }} />
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="main-content flex-center" style={{ minHeight: '60vh', textAlign: 'center', padding: '3rem' }}>
          <h2>{error || 'Course not found'}</h2>
          <p className="text-secondary mt-2">The course you are looking for might have been moved or removed.</p>
          <Link to="/courses" className="btn-primary mt-4" style={{ display: 'inline-flex' }}>Back to Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />

      {/* Enrollment celebration toast */}
      {enrollToast && (
        <div className="course-floating-toast animate-fade-in" style={{ zIndex: 99999 }}>
          <Check size={18} style={{ color: '#10b981', marginRight: '0.5rem' }} />
          <span>{enrollToast}</span>
        </div>
      )}
      
      <div className="course-hero animate-fade-in">
        <Link to="/courses" className="back-link">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
        
        <div className="course-hero-content">
          <div className="course-hero-text">
            <span className="badge glass-panel">{course.category}</span>
            <h1>{course.title}</h1>
            <p className="course-hero-desc">{course.description}</p>
            
            <div className="course-hero-meta">
              <div className="meta-item">
                <Star size={18} className="text-orange" fill="#f59e0b" color="#f59e0b" />
                <span className="fw-bold">{course.rating}</span>
              </div>
              <div className="meta-item">
                <Users size={18} />
                <span>{course.students ? course.students.toLocaleString() : '1,200'} students</span>
              </div>
              <div className="meta-item">
                <Clock size={18} />
                <span>{course.duration}</span>
              </div>
            </div>
            
            <div className="instructor-info">
              <img src={`https://ui-avatars.com/api/?name=${course.instructor}&background=random`} alt={course.instructor} className="instructor-avatar" />
              <div>
                <p className="text-sm text-secondary">Created by</p>
                <p className="fw-bold">{course.instructor}</p>
              </div>
            </div>
          </div>
          
          <div className="course-hero-card glass-panel">
            <div className="video-preview">
              <img src={course.image} alt={course.title} />
              <div className="play-button"><PlayCircle size={48} /></div>
            </div>
            <div className="card-body">
              <h2 className="price-large">{course.price}</h2>

              {enrolled ? (
                <button 
                  className="btn-primary w-full btn-large mb-2" 
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                  onClick={handleEnroll}
                >
                  <Check size={18} />
                  <span>✓ Enrolled • Go to My Learning</span>
                </button>
              ) : (
                <button className="btn-primary w-full btn-large mb-2" onClick={handleEnroll}>
                  Enroll Now ({course.price})
                </button>
              )}

              <p className="text-sm text-center text-secondary">30-Day Money-Back Guarantee</p>
              
              <ul className="includes-list">
                <li><CheckCircle size={16} className="text-primary" /> Full lifetime access</li>
                <li><CheckCircle size={16} className="text-primary" /> Access on mobile and TV</li>
                <li><CheckCircle size={16} className="text-primary" /> Certificate of completion</li>
                <li><Award size={16} className="text-primary" /> Direct Instructor QA Support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="course-main-content">
        <div className="course-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2>What you'll learn</h2>
          <div className="learning-grid">
            {course.whatYouWillLearn && course.whatYouWillLearn.map((item, idx) => (
              <div key={idx} className="learning-item">
                <CheckCircle size={20} className="text-success" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="course-section animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2>Course Content & Modules</h2>
          <div className="modules-list">
            {course.modules && course.modules.map((mod, idx) => (
              <div key={idx} className="module-accordion glass-panel">
                <div className="module-header">
                  <h3>{mod.title}</h3>
                  <span className="text-sm text-secondary">{mod.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
