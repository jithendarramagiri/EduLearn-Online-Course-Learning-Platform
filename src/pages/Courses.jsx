import { useState, useEffect } from 'react';
import { 
  Search, Filter, Star, Clock, ChevronLeft, ChevronRight, Loader, 
  Heart, Eye, Sparkles, CheckCircle, ArrowRight, X, PlayCircle, BookOpen, Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { fetchCourses } from '../services/api';
import './Courses.css';

const careerPathways = [
  { id: 'all', title: 'All Disciplines', icon: '🌐', category: 'All' },
  { id: 'ai', title: 'AI & Machine Learning', icon: '🤖', category: 'Artificial Intelligence' },
  { id: 'web', title: 'Full-Stack Architecture', icon: '💻', category: 'Programming' },
  { id: 'design', title: 'UI/UX & Product Design', icon: '🎨', category: 'Design & UI/UX' },
  { id: 'cloud', title: 'Cloud & Kubernetes', icon: '☁️', category: 'Cloud & DevOps' },
  { id: 'security', title: 'Cyber Defense', icon: '🛡️', category: 'Cybersecurity' }
];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLevel, setActiveLevel] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Quick Preview Modal state
  const [previewCourse, setPreviewCourse] = useState(null);

  // Saved/Wishlist state in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('edulearn_wishlist') || '[]');
    } catch {
      return [];
    }
  });

  const [toastMsg, setToastMsg] = useState('');

  const coursesPerPage = 12;

  const categories = [
    'All',
    'Artificial Intelligence',
    'Programming',
    'Design & UI/UX',
    'Data Science',
    'Cloud & DevOps',
    'Cybersecurity',
    'Mobile Development',
    'Business & Leadership',
    'Game Development',
    'Marketing'
  ];

  const toggleBookmark = (e, courseId, title) => {
    e.preventDefault();
    e.stopPropagation();
    let updated;
    if (bookmarkedIds.includes(courseId)) {
      updated = bookmarkedIds.filter(id => id !== courseId);
      showToast(`Removed "${title}" from wishlist.`);
    } else {
      updated = [...bookmarkedIds, courseId];
      showToast(`Saved "${title}" to your wishlist!`);
    }
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('edulearn_wishlist', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * coursesPerPage;
        const data = await fetchCourses({
          category: activeCategory,
          search: searchTerm,
          limit: coursesPerPage,
          offset
        });
        
        let list = data.courses || [];
        
        // Filter by level if specified
        if (activeLevel !== 'All') {
          list = list.filter(c => c.level.toLowerCase() === activeLevel.toLowerCase());
        }

        // Sort
        if (sortBy === 'rating') {
          list = [...list].sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'price-low') {
          list = [...list].sort((a, b) => parseInt(a.price.replace(/\D/g, '') || 0, 10) - parseInt(b.price.replace(/\D/g, '') || 0, 10));
        } else if (sortBy === 'price-high') {
          list = [...list].sort((a, b) => parseInt(b.price.replace(/\D/g, '') || 0, 10) - parseInt(a.price.replace(/\D/g, '') || 0, 10));
        }

        setCourses(list);
        setTotalCourses(data.total);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [activeCategory, activeLevel, searchTerm, sortBy, currentPage]);

  const totalPages = Math.ceil(totalCourses / coursesPerPage) || 1;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="courses-page-container">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="course-floating-toast animate-fade-in">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="courses-hero-spotlight animate-fade-in">
        <div className="courses-spotlight-content">
          <div className="spotlight-pill">
            <Sparkles size={16} className="text-cyan" />
            <span>Over {totalCourses.toLocaleString()} Verified Courses</span>
          </div>
          <h1>
            Architect Your Future with <br />
            <span className="text-gradient-aurora">World-Class Masterclasses</span>
          </h1>
          <p>
            From Artificial Intelligence & Systems Architecture to Product Design and Cloud Engineering. 
            Taught by proven industry leaders with project-based certifications.
          </p>

          {/* Interactive Career Pathways Chips */}
          <div className="career-pathways-bar">
            <span className="pathway-label">Featured Pathways:</span>
            <div className="pathway-chips">
              {careerPathways.map((path) => (
                <button
                  key={path.id}
                  className={`pathway-chip ${activeCategory === path.category ? 'active' : ''}`}
                  onClick={() => { setActiveCategory(path.category); setCurrentPage(1); }}
                >
                  <span className="pathway-icon">{path.icon}</span>
                  <span>{path.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Controls */}
      <div className="courses-toolbar-section">
        <div className="search-bar-unified glass-panel">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search by course topic, technology (e.g. Next.js, PyTorch, Docker), or instructor..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="search-unified-input"
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="toolbar-sub-controls">
          <div className="level-pills-row">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
              <button
                key={lvl}
                className={`level-pill-btn ${activeLevel === lvl ? 'active' : ''}`}
                onClick={() => { setActiveLevel(lvl); setCurrentPage(1); }}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="sort-selector-wrapper">
            <label htmlFor="course-sort">Sort by:</label>
            <select 
              id="course-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-dropdown"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="courses-layout-container">
        {/* Left Category Sidebar */}
        <aside className="categories-sidebar-panel glass-panel animate-fade-in">
          <div className="filter-header-block">
            <Filter size={18} className="text-primary" />
            <h3>Catalog Domains</h3>
          </div>
          <ul className="category-nav-list">
            {categories.map((category) => (
              <li 
                key={category} 
                className={`cat-item ${activeCategory === category ? 'active' : ''}`}
                onClick={() => { setActiveCategory(category); setCurrentPage(1); }}
              >
                <span>{category}</span>
                {category === 'All' && <span className="cat-badge">{totalCourses.toLocaleString()}</span>}
              </li>
            ))}
          </ul>
        </aside>

        {/* Right Courses Grid */}
        <main className="courses-catalog-main">
          <div className="catalog-meta-bar">
            <span className="results-count">
              Showing <strong>{totalCourses === 0 ? 0 : ((currentPage - 1) * coursesPerPage) + 1}–{Math.min(currentPage * coursesPerPage, totalCourses)}</strong> of <strong>{totalCourses.toLocaleString()} courses</strong>
            </span>
            {activeCategory !== 'All' && (
              <span className="active-filter-badge">
                Domain: {activeCategory}
                <X size={14} className="cursor-pointer" onClick={() => setActiveCategory('All')} />
              </span>
            )}
          </div>

          {loading ? (
            <div className="loading-state-box glass-panel">
              <Loader size={44} className="spin text-primary" />
              <p>Curating real-time course catalog...</p>
            </div>
          ) : (
            <>
              <div className="courses-card-grid animate-fade-in">
                {courses.length > 0 ? (
                  courses.map((course) => {
                    const isBookmarked = bookmarkedIds.includes(course.id);
                    return (
                      <div key={course.id} className="course-card-premium glass-panel">
                        <div className="card-thumb-wrapper">
                          <img src={course.image} alt={course.title} loading="lazy" className="card-thumb-img" />
                          <span className={`badge-pill ${course.badge?.toLowerCase().replace(/\s+/g, '-') || 'bestseller'}`}>
                            {course.badge || 'Bestseller'}
                          </span>
                          
                          {/* Bookmark Action */}
                          <button 
                            className={`wishlist-icon-btn ${isBookmarked ? 'active' : ''}`}
                            title={isBookmarked ? 'Remove from wishlist' : 'Save course'}
                            onClick={(e) => toggleBookmark(e, course.id, course.title)}
                          >
                            <Heart size={16} fill={isBookmarked ? '#f43f5e' : 'none'} color={isBookmarked ? '#f43f5e' : '#ffffff'} />
                          </button>

                          {/* Quick Preview Action */}
                          <button 
                            className="quick-preview-btn"
                            title="Quick Syllabus Preview"
                            onClick={() => setPreviewCourse(course)}
                          >
                            <Eye size={15} />
                            <span>Preview</span>
                          </button>
                        </div>

                        <div className="card-body-wrapper">
                          <div className="card-subhead">
                            <span className="course-category-tag">{course.category}</span>
                            <span className={`level-pill-tag ${course.level?.toLowerCase()}`}>{course.level}</span>
                          </div>

                          <h3 className="course-card-title">
                            <Link to={`/courses/${course.id}`}>{course.title}</Link>
                          </h3>

                          <p className="card-instructor">by <strong>{course.instructor}</strong></p>

                          <div className="card-rating-row">
                            <div className="rating-pill">
                              <Star size={15} className="star-icon" fill="#f59e0b" color="#f59e0b" />
                              <span className="rating-num">{course.rating}</span>
                            </div>
                            <span className="students-num">({course.students ? course.students.toLocaleString() : '1,200'} students)</span>
                            <div className="duration-pill">
                              <Clock size={14} />
                              <span>{course.duration}</span>
                            </div>
                          </div>

                          <div className="card-pricing-footer">
                            <div className="price-block">
                              <span className="price-current">{course.price}</span>
                              {course.originalPrice && (
                                <span className="price-original">{course.originalPrice}</span>
                              )}
                            </div>
                            <Link to={`/courses/${course.id}`} className="btn-explore-course">
                              <span>Enroll</span>
                              <ArrowRight size={15} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-courses-found glass-panel">
                    <BookOpen size={48} className="text-secondary" />
                    <h3>No matching courses found</h3>
                    <p>Try modifying your search keywords or switching category filters.</p>
                    <button className="btn-outline mt-4" onClick={() => { setActiveCategory('All'); setActiveLevel('All'); setSearchTerm(''); }}>
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-wrapper-premium">
                  <button 
                    className="pagination-arrow-btn" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={20} />
                    <span>Prev</span>
                  </button>
                  
                  <div className="pagination-numbers">
                    <span className="page-indicator">
                      Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                    </span>
                  </div>
                  
                  <button 
                    className="pagination-arrow-btn" 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <span>Next</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* QUICK PREVIEW MODAL */}
      {previewCourse && (
        <div className="modal-backdrop" onClick={() => setPreviewCourse(null)}>
          <div className="preview-modal-box glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <div className="preview-modal-title">
                <span className="course-category-tag">{previewCourse.category}</span>
                <h2>{previewCourse.title}</h2>
                <p className="text-secondary">Instructor: <strong>{previewCourse.instructor}</strong> • {previewCourse.duration} • Level: {previewCourse.level}</p>
              </div>
              <button className="close-btn" onClick={() => setPreviewCourse(null)}>
                <X size={22} />
              </button>
            </div>

            <div className="preview-modal-body">
              <div className="preview-video-mockup">
                <img src={previewCourse.image} alt={previewCourse.title} />
                <div className="play-overlay">
                  <PlayCircle size={60} className="play-icon" />
                  <span>Interactive Curriculum Preview</span>
                </div>
              </div>

              <div className="preview-info-column">
                <h4>What You'll Learn</h4>
                <div className="preview-learn-grid">
                  {previewCourse.whatYouWillLearn?.map((point, idx) => (
                    <div key={idx} className="preview-point">
                      <CheckCircle size={16} className="text-emerald" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                <h4>Course Modules</h4>
                <div className="preview-modules-list">
                  {previewCourse.modules?.map((mod, idx) => (
                    <div key={idx} className="preview-module-pill">
                      <Layers size={16} className="text-primary" />
                      <span className="mod-title">{mod.title}</span>
                      <span className="mod-duration">{mod.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="preview-modal-footer">
              <div className="preview-footer-price">
                <span className="price-big">{previewCourse.price}</span>
                {previewCourse.originalPrice && <span className="price-strike">{previewCourse.originalPrice}</span>}
              </div>
              <div className="preview-footer-actions">
                <button className="btn-outline" onClick={() => setPreviewCourse(null)}>Close</button>
                <Link to={`/courses/${previewCourse.id}`} className="btn-primary">
                  View Complete Masterclass Details
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
