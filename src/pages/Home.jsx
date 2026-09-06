import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, BookOpen, GraduationCap, Users, Star, Clock, 
  PlayCircle, ShieldCheck, Zap, Award, CheckCircle2, Flame, Compass, ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { fetchCourses, getTotalCoursesCount } from '../services/api';
import './Home.css';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [activeCareerPath, setActiveCareerPath] = useState('ai');
  const [totalCatalogCourses, setTotalCatalogCourses] = useState(() => getTotalCoursesCount());

  useEffect(() => {
    fetchCourses({ limit: 6, offset: 0 }).then(data => {
      if (data && data.courses) {
        setFeaturedCourses(data.courses);
        setTotalCatalogCourses(data.total);
      }
    }).catch(console.error);
  }, []);

  const careerTracks = [
    {
      id: 'ai',
      title: 'Autonomous AI Engineer',
      badge: 'Highest Demand in 2025',
      salary: '₹18 LPA – ₹45 LPA',
      skills: ['PyTorch', 'LangChain', 'RAG Pipelines', 'Vector DBs', 'Fine-Tuning'],
      coursesCount: 380,
      icon: <Zap size={22} className="text-amber" />
    },
    {
      id: 'fullstack',
      title: 'Full-Stack Web Architect',
      badge: 'Core Industry Standard',
      salary: '₹14 LPA – ₹38 LPA',
      skills: ['React 19', 'Next.js 15', 'Node.js', 'PostgreSQL', 'GraphQL'],
      coursesCount: 520,
      icon: <Sparkles size={22} className="text-cyan" />
    },
    {
      id: 'cloud',
      title: 'Cloud & DevOps Specialist',
      badge: 'Critical Infrastructure',
      salary: '₹16 LPA – ₹42 LPA',
      skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD Pipelines'],
      coursesCount: 410,
      icon: <Compass size={22} className="text-purple" />
    },
    {
      id: 'design',
      title: 'Lead Product & UI/UX Designer',
      badge: 'Creative Leadership',
      salary: '₹12 LPA – ₹32 LPA',
      skills: ['Figma Variables', 'Design Systems', 'Micro-interactions', 'User Research'],
      coursesCount: 290,
      icon: <Award size={22} className="text-emerald" />
    }
  ];

  const activeTrack = careerTracks.find(t => t.id === activeCareerPath) || careerTracks[0];

  return (
    <div className="app-container">
      <Navbar />

      <div className="main-content">
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section className="hero-section-unique animate-fade-in">
          <div className="hero-aurora-glow glow-1"></div>
          <div className="hero-aurora-glow glow-2"></div>

          <div className="hero-container">
            <div className="hero-header-badge">
              <span className="pulsing-dot"></span>
              <span>Next-Gen Learning Platform • {totalCatalogCourses.toLocaleString()}+ Live Courses</span>
            </div>

            <h1 className="hero-main-heading">
              Accelerate Your Career with <br />
              <span className="text-gradient">Industry-Grade Masterclasses</span>
            </h1>

            <p className="hero-description">
              Stop watching passive tutorials. Learn real-world production engineering, 
              scalable systems architecture, and product design with verifiable portfolio certificates.
            </p>

            <div className="hero-action-buttons">
              <Link to="/courses" className="btn-primary btn-hero">
                <span>Explore {totalCatalogCourses.toLocaleString()} Courses</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/career-compass" className="btn-hero compass-hero-btn" style={{ background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.4)', color: '#38bdf8' }}>
                <Compass size={18} />
                <span>AI Career Compass</span>
              </Link>
            </div>

            {/* Quick Metrics Strip */}
            <div className="metrics-strip glass-panel">
              <div className="metric-item">
                <span className="metric-number">{totalCatalogCourses.toLocaleString()}+</span>
                <span className="metric-label">Active Courses</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <span className="metric-number">38,400+</span>
                <span className="metric-label">Enrolled Learners</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <span className="metric-number">4.9 / 5.0</span>
                <span className="metric-label">Average Rating</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <span className="metric-number">94.2%</span>
                <span className="metric-label">Career Advancement</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* UNIQUE FEATURE: INTERACTIVE CAREER PATHWAY ARCHITECT */}
        {/* ========================================================================= */}
        <section className="career-architect-section animate-fade-in">
          <div className="section-container">
            <div className="section-header-left">
              <div className="section-tag">
                <Flame size={16} className="text-orange" />
                <span>Interactive Skill Path Finder</span>
              </div>
              <h2>Select Your Dream Engineering Track</h2>
              <p>Tailored curriculum paths engineered to take you from foundational syntax to staff-level architecture.</p>
            </div>

            <div className="career-tracks-grid">
              {/* Left selector buttons */}
              <div className="tracks-nav-column">
                {careerTracks.map((track) => (
                  <button
                    key={track.id}
                    className={`track-nav-card glass-panel ${activeCareerPath === track.id ? 'active' : ''}`}
                    onClick={() => setActiveCareerPath(track.id)}
                  >
                    <div className="track-card-top">
                      <div className="track-icon-wrap">{track.icon}</div>
                      <div>
                        <h4>{track.title}</h4>
                        <span className="track-badge-micro">{track.badge}</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="track-arrow" />
                  </button>
                ))}
              </div>

              {/* Right Detail Card */}
              <div className="track-details-display glass-panel">
                <div className="track-details-header">
                  <div>
                    <span className="track-salary-badge">Avg. Compensation: <strong>{activeTrack.salary}</strong></span>
                    <h3>{activeTrack.title} Roadmap</h3>
                  </div>
                  <Link to="/courses" className="btn-primary-small">
                    View {activeTrack.coursesCount}+ Track Courses
                  </Link>
                </div>

                <p className="track-overview-text">
                  Complete sequence designed in collaboration with top engineering leads from Google, Meta, and Stripe. 
                  Covers end-to-end modern architecture, code reviews, and hands-on capstone projects.
                </p>

                <div className="track-skills-list">
                  <span className="skills-heading">Core Skills You'll Master:</span>
                  <div className="skills-chips-row">
                    {activeTrack.skills.map((skill, i) => (
                      <span key={i} className="skill-chip">
                        <CheckCircle2 size={14} className="text-green" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="track-footer-perks">
                  <div className="perk-item">
                    <Award size={18} className="text-cyan" />
                    <span>Industry-Recognized Certificate</span>
                  </div>
                  <div className="perk-item">
                    <Users size={18} className="text-purple" />
                    <span>Private Peer Discord Community</span>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link to="/career-compass" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.25rem' }}>
                    <Compass size={17} />
                    <span>Open Interactive Skill Matrix & Roadmap</span>
                  </Link>
                  <Link to="/courses" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.25rem' }}>
                    <BookOpen size={17} />
                    <span>Explore {activeTrack.coursesCount} Courses</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* POPULAR CURATED COURSES SECTION */}
        {/* ========================================================================= */}
        <section className="featured-courses-section animate-fade-in">
          <div className="section-container">
            <div className="section-header-between">
              <div>
                <div className="section-tag">
                  <Sparkles size={16} className="text-primary" />
                  <span>Trending This Week</span>
                </div>
                <h2>Featured Masterclasses</h2>
                <p>Curated from our catalog of <strong>{totalCatalogCourses.toLocaleString()} courses</strong>.</p>
              </div>
              <Link to="/courses" className="btn-outline view-all-top-btn">
                <span>View All {totalCatalogCourses.toLocaleString()} Courses</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="courses-grid-featured">
              {featuredCourses.map((course) => (
                <Link to={`/courses/${course.id}`} key={course.id} className="featured-course-card glass-panel">
                  <div className="featured-thumb">
                    <img src={course.image} alt={course.title} loading="lazy" />
                    <span className="featured-level-badge">{course.level}</span>
                    <span className="featured-status-pill">{course.badge || 'Bestseller'}</span>
                  </div>

                  <div className="featured-info">
                    <span className="featured-category">{course.category}</span>
                    <h3>{course.title}</h3>
                    <p className="featured-instructor">by {course.instructor}</p>

                    <div className="featured-meta">
                      <div className="rating-wrap">
                        <Star size={15} fill="#f59e0b" color="#f59e0b" />
                        <span className="rating-val">{course.rating}</span>
                        <span className="text-secondary">({course.students ? course.students.toLocaleString() : '800'})</span>
                      </div>
                      <div className="duration-wrap">
                        <Clock size={14} />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    <div className="featured-card-footer">
                      <div className="featured-price">
                        <span className="price-bold">{course.price}</span>
                        {course.originalPrice && <span className="price-cut">{course.originalPrice}</span>}
                      </div>
                      <span className="btn-quick-view">Details &rarr;</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="view-more-banner">
              <Link to="/courses" className="btn-primary btn-large">
                Browse Complete Catalog ({totalCatalogCourses.toLocaleString()}+ Courses)
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PLATFORM VALUE PROPOSITION */}
        {/* ========================================================================= */}
        <section className="platform-features-section">
          <div className="section-container">
            <div className="value-grid">
              <div className="value-card glass-panel">
                <div className="value-icon-box bg-purple">
                  <BookOpen size={24} />
                </div>
                <h3>{totalCatalogCourses.toLocaleString()}+ Courses</h3>
                <p>Covers everything from foundational programming to bleeding-edge AI models, design systems, and cloud infrastructure.</p>
              </div>

              <div className="value-card glass-panel">
                <div className="value-icon-box bg-cyan">
                  <GraduationCap size={24} />
                </div>
                <h3>World-Class Instructors</h3>
                <p>Learn directly from engineers and designers who built the tools you use daily at top tech enterprises.</p>
              </div>

              <div className="value-card glass-panel">
                <div className="value-icon-box bg-emerald">
                  <PlayCircle size={24} />
                </div>
                <h3>Interactive Curriculum</h3>
                <p>Real-world projects, checkpoints, and automated feedback on every module you complete.</p>
              </div>

              <div className="value-card glass-panel">
                <div className="value-icon-box bg-amber">
                  <ShieldCheck size={24} />
                </div>
                <h3>Executive Admin Suite</h3>
                <p>Includes AI Course Architect to auto-generate and publish structured curricula into the platform in seconds.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
