import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  Briefcase, CheckCircle, 
  ArrowRight, Sparkles, Layers, Cpu, Shield, Database, 
  Cloud, Smartphone, Code, BookOpen, Star, Zap
} from 'lucide-react';
import { enrollInCourse } from '../services/api';
import './CareerCompass.css';

const CAREER_TRACKS = [
  {
    id: 'ai-architect',
    title: 'Full-Stack GenAI & Autonomous Agent Architect',
    icon: <Cpu className="track-icon text-cyan" size={28} />,
    category: 'Artificial Intelligence',
    demand: 'Explosive (Top 1% Growth)',
    salaryInr: { min: 14, max: 42 },
    salaryUsd: { min: 130, max: 230 },
    timeline: '16 Weeks • 6h/week',
    description: 'Master Large Language Models, Transformer architectures, LangChain, vector retrieval (RAG), and multi-agent coordination frameworks to build enterprise-grade autonomous AI systems.',
    skills: ['Transformers', 'LangChain', 'LlamaIndex', 'Pinecone & ChromaDB', 'Python', 'FastAPI', 'Agentic Workflows'],
    milestones: [
      { step: 'Phase 1: Foundations', courseId: 101, title: 'Python for AI & Deep Learning Mathematics', duration: '3 Weeks', level: 'Beginner', badge: 'Core' },
      { step: 'Phase 2: Transformers & LLMs', courseId: 102, title: 'Hugging Face & Fine-Tuning Open-Weights Models', duration: '4 Weeks', level: 'Intermediate', badge: 'Crucial' },
      { step: 'Phase 3: RAG & Vector Search', courseId: 103, title: 'Enterprise RAG Architectures & Vector DBs', duration: '4 Weeks', level: 'Advanced', badge: 'High Value' },
      { step: 'Phase 4: Capstone Project', courseId: 104, title: 'Building Multi-Agent Autonomous Coding & Research Systems', duration: '5 Weeks', level: 'Mastery', badge: 'Portfolio' }
    ]
  },
  {
    id: 'cloud-devops',
    title: 'Cloud Infrastructure & DevOps Platform Engineer',
    icon: <Cloud className="track-icon text-purple" size={28} />,
    category: 'Cloud Computing',
    demand: 'Very High (18% YoY)',
    salaryInr: { min: 12, max: 34 },
    salaryUsd: { min: 115, max: 195 },
    timeline: '14 Weeks • 5h/week',
    description: 'Design and automate resilient, auto-scaling multi-cloud architectures using Kubernetes, Terraform, Docker, and GitOps CI/CD pipelines.',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS & Azure', 'GitHub Actions', 'Prometheus', 'Linux Kernel'],
    milestones: [
      { step: 'Phase 1: Linux & Containers', courseId: 201, title: 'Enterprise Linux Administration & Containerization with Docker', duration: '3 Weeks', level: 'Beginner', badge: 'Core' },
      { step: 'Phase 2: Kubernetes Orchestration', courseId: 202, title: 'Production Kubernetes Cluster Management & Helm', duration: '4 Weeks', level: 'Intermediate', badge: 'Crucial' },
      { step: 'Phase 3: Infrastructure as Code', courseId: 203, title: 'Terraform Multi-Cloud Automation & GitOps CI/CD', duration: '4 Weeks', level: 'Advanced', badge: 'High Value' },
      { step: 'Phase 4: Site Reliability & SRE', courseId: 204, title: 'Observability, Distributed Tracing & Chaos Engineering', duration: '3 Weeks', level: 'Mastery', badge: 'Portfolio' }
    ]
  },
  {
    id: 'cyber-defense',
    title: 'Zero-Trust Cybersecurity & Ethical Threat Hunter',
    icon: <Shield className="track-icon text-green" size={28} />,
    category: 'Cybersecurity',
    demand: 'Critical (Zero Unemployment)',
    salaryInr: { min: 11, max: 32 },
    salaryUsd: { min: 110, max: 185 },
    timeline: '15 Weeks • 6h/week',
    description: 'Protect critical digital assets, execute advanced penetration tests, audit smart contracts, and build Zero-Trust SOC automated defense protocols.',
    skills: ['Kali Linux', 'Penetration Testing', 'Wireshark', 'SOC Operations', 'OWASP Top 10', 'Cryptography', 'SIEM'],
    milestones: [
      { step: 'Phase 1: Networking & Systems', courseId: 301, title: 'Offensive Networking Protocols & Packet Analysis', duration: '3 Weeks', level: 'Beginner', badge: 'Core' },
      { step: 'Phase 2: Ethical Hacking & Web Sec', courseId: 302, title: 'Hands-on Web Exploitation & OWASP Defense', duration: '4 Weeks', level: 'Intermediate', badge: 'Crucial' },
      { step: 'Phase 3: SOC & Threat Hunting', courseId: 303, title: 'Splunk SIEM, Incident Response & Digital Forensics', duration: '4 Weeks', level: 'Advanced', badge: 'High Value' },
      { step: 'Phase 4: Cloud & Zero-Trust Defense', courseId: 304, title: 'Zero Trust Architecture & Enterprise IAM Hardening', duration: '4 Weeks', level: 'Mastery', badge: 'Portfolio' }
    ]
  },
  {
    id: 'fullstack-web',
    title: 'Modern Full-Stack React & Node Enterprise Architect',
    icon: <Code className="track-icon text-blue" size={28} />,
    category: 'Web Development',
    demand: 'Constant High Volume',
    salaryInr: { min: 10, max: 28 },
    salaryUsd: { min: 100, max: 170 },
    timeline: '12 Weeks • 6h/week',
    description: 'Architect scalable web platforms using React 19, TypeScript, Next.js 15, PostgreSQL, Redis caching, and microservices.',
    skills: ['React 19', 'Next.js 15', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'GraphQL', 'Tailwind CSS'],
    milestones: [
      { step: 'Phase 1: Modern Frontend', courseId: 401, title: 'React 19, Hooks & Server Actions Deep Dive', duration: '3 Weeks', level: 'Beginner', badge: 'Core' },
      { step: 'Phase 2: Scalable Backends', courseId: 402, title: 'High-Throughput Node.js & Distributed Systems', duration: '3 Weeks', level: 'Intermediate', badge: 'Crucial' },
      { step: 'Phase 3: Database & Caching', courseId: 403, title: 'PostgreSQL Query Optimization & Redis Caching', duration: '3 Weeks', level: 'Advanced', badge: 'High Value' },
      { step: 'Phase 4: Full-Stack SaaS Capstone', courseId: 404, title: 'Building & Deploying a Production B2B SaaS with Next.js', duration: '3 Weeks', level: 'Mastery', badge: 'Portfolio' }
    ]
  },
  {
    id: 'data-science',
    title: 'Data Science & Machine Learning Systems Lead',
    icon: <Database className="track-icon text-amber" size={28} />,
    category: 'Data Science',
    demand: 'High (22% Growth)',
    salaryInr: { min: 13, max: 36 },
    salaryUsd: { min: 120, max: 205 },
    timeline: '15 Weeks • 5h/week',
    description: 'Transform petabytes of raw data into predictive intelligence with PyTorch, Scikit-Learn, MLOps, and automated data pipelines.',
    skills: ['Python Data Stack', 'PyTorch', 'Pandas & Polars', 'Feature Store', 'MLflow', 'BigQuery', 'A/B Testing'],
    milestones: [
      { step: 'Phase 1: Data Analytics & Wrangling', courseId: 501, title: 'Modern Data Engineering with Polars & DuckDB', duration: '3 Weeks', level: 'Beginner', badge: 'Core' },
      { step: 'Phase 2: Classical Machine Learning', courseId: 502, title: 'Statistical Modeling & Predictive Algorithms', duration: '4 Weeks', level: 'Intermediate', badge: 'Crucial' },
      { step: 'Phase 3: Deep Learning & Neural Nets', courseId: 503, title: 'PyTorch Architecture & Computer Vision / NLP', duration: '4 Weeks', level: 'Advanced', badge: 'High Value' },
      { step: 'Phase 4: Production MLOps Capstone', courseId: 504, title: 'End-to-End MLOps Pipeline & Model Monitoring', duration: '4 Weeks', level: 'Mastery', badge: 'Portfolio' }
    ]
  },
  {
    id: 'mobile-app',
    title: 'Cross-Platform Mobile Application Architect',
    icon: <Smartphone className="track-icon text-pink" size={28} />,
    category: 'Mobile Development',
    demand: 'Strong Steady Growth',
    salaryInr: { min: 9, max: 26 },
    salaryUsd: { min: 95, max: 160 },
    timeline: '12 Weeks • 5h/week',
    description: 'Build fluid 60fps native iOS & Android applications using Flutter and React Native with offline-first sync and biometric auth.',
    skills: ['Flutter & Dart', 'React Native', 'SwiftUI Basics', 'Offline Sync', 'Biometrics', 'App Store CI/CD'],
    milestones: [
      { step: 'Phase 1: Cross-Platform Core', courseId: 601, title: 'Flutter & Dart State Management Masterclass', duration: '3 Weeks', level: 'Beginner', badge: 'Core' },
      { step: 'Phase 2: Native Device APIs', courseId: 602, title: 'Camera, Geolocation & Offline Storage Architecture', duration: '3 Weeks', level: 'Intermediate', badge: 'Crucial' },
      { step: 'Phase 3: Performance & Polish', courseId: 603, title: 'Smooth 60fps Animations & Memory Optimization', duration: '3 Weeks', level: 'Advanced', badge: 'High Value' },
      { step: 'Phase 4: App Store Launch Capstone', courseId: 604, title: 'Publishing to Apple App Store & Google Play Store', duration: '3 Weeks', level: 'Mastery', badge: 'Portfolio' }
    ]
  }
];

const CareerCompass = () => {
  const navigate = useNavigate();
  const [selectedTrack, setSelectedTrack] = useState(CAREER_TRACKS[0]);
  const [experienceYears, setExperienceYears] = useState(2);
  const [currency, setCurrency] = useState('INR'); // 'INR' | 'USD'
  const [enrolledNotice, setEnrolledNotice] = useState('');

  // Calculate salary with experience curve
  const calculateSalary = (min, max) => {
    const factor = 1 + (experienceYears * 0.18);
    const low = Math.round(min * factor);
    const high = Math.round(max * factor);
    return { low, high };
  };

  const handleEnrollCareerPath = () => {
    selectedTrack.milestones.forEach((m) => {
      enrollInCourse({
        id: m.courseId,
        title: m.title,
        category: selectedTrack.category,
        instructor: 'Industry Veteran',
        rating: 4.9,
        duration: m.duration,
        level: m.level,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
      });
    });

    setEnrolledNotice(`🎉 Successfully enrolled in all 4 courses for "${selectedTrack.title}"! Redirecting to My Learning...`);
    setTimeout(() => {
      navigate('/my-learning');
    }, 1800);
  };

  const salaryData = currency === 'INR' 
    ? calculateSalary(selectedTrack.salaryInr.min, selectedTrack.salaryInr.max)
    : calculateSalary(selectedTrack.salaryUsd.min, selectedTrack.salaryUsd.max);

  return (
    <div className="career-compass-page">
      <Navbar />

      <main className="compass-container">
        {/* Hero Section */}
        <section className="compass-hero animate-fade-in">
          <div className="compass-hero-badge">
            <Sparkles size={16} className="text-amber" />
            <span>EduLearn AI Career Compass & Skill Matrix</span>
          </div>
          <h1>Map Your High-Income Tech Career Path</h1>
          <p className="hero-subtitle">
            Move beyond random courses. Explore structured industry roadmaps, calculate your real salary growth, and master skills verified by top tech employers.
          </p>
        </section>

        {/* Track Selector Bar */}
        <section className="tracks-grid animate-fade-in">
          {CAREER_TRACKS.map((t) => {
            const isSelected = selectedTrack.id === t.id;
            return (
              <div 
                key={t.id} 
                className={`track-card glass-panel ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedTrack(t)}
              >
                <div className="track-card-header">
                  {t.icon}
                  <span className="track-demand-badge">{t.demand}</span>
                </div>
                <h3>{t.title}</h3>
                <p className="track-category-label">{t.category}</p>
                <div className="track-card-footer">
                  <span className="track-timeline-text">{t.timeline}</span>
                  <span className="track-select-hint">
                    {isSelected ? 'Selected' : 'Explore Track'} &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Active Track Deep Dive */}
        <section className="track-deepdive animate-scale-up">
          {enrolledNotice && (
            <div className="enroll-success-banner animate-fade-in">
              <CheckCircle size={22} className="text-green" />
              <span>{enrolledNotice}</span>
            </div>
          )}

          <div className="deepdive-header glass-panel">
            <div className="deepdive-info">
              <div className="deepdive-title-row">
                {selectedTrack.icon}
                <div>
                  <h2>{selectedTrack.title}</h2>
                  <p className="text-secondary">{selectedTrack.description}</p>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="skills-checklist">
                <span className="skills-label">Mastery Skills:</span>
                <div className="skills-tags-wrap">
                  {selectedTrack.skills.map((s, idx) => (
                    <span key={idx} className="skill-pill">
                      <CheckCircle size={13} className="text-cyan" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Salary Calculator Widget */}
            <div className="salary-widget">
              <div className="salary-widget-top">
                <div className="salary-label-group">
                  <Briefcase size={16} className="text-amber" />
                  <span>Projected Annual Salary</span>
                </div>
                <div className="currency-toggle">
                  <button 
                    className={`curr-btn ${currency === 'INR' ? 'active' : ''}`}
                    onClick={() => setCurrency('INR')}
                  >
                    INR (₹)
                  </button>
                  <button 
                    className={`curr-btn ${currency === 'USD' ? 'active' : ''}`}
                    onClick={() => setCurrency('USD')}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              <div className="salary-display">
                {currency === 'INR' ? (
                  <span className="salary-number">
                    ₹{salaryData.low} - ₹{salaryData.high} <span className="salary-unit">LPA</span>
                  </span>
                ) : (
                  <span className="salary-number">
                    ${salaryData.low}k - ${salaryData.high}k <span className="salary-unit">/ year</span>
                  </span>
                )}
              </div>

              {/* Experience Slider */}
              <div className="experience-slider-group">
                <div className="slider-meta">
                  <span>Experience: <strong>{experienceYears === 0 ? 'Entry-Level (Fresher)' : `${experienceYears} Years`}</strong></span>
                  <span className="text-secondary text-xs">{experienceYears >= 5 ? 'Senior Lead' : 'Mid-Level'}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="6" 
                  step="1" 
                  value={experienceYears} 
                  onChange={(e) => setExperienceYears(parseInt(e.target.value))}
                  className="salary-slider"
                />
              </div>

              {/* 1-Click Track Enroll Button */}
              <button 
                className="btn-enroll-full-path" 
                onClick={handleEnrollCareerPath}
              >
                <Zap size={18} />
                <span>Enroll in Full 4-Course Career Path</span>
              </button>
            </div>
          </div>

          {/* Interactive Visual Skill Tree / Milestones */}
          <div className="milestones-section glass-panel">
            <div className="milestones-header">
              <div className="flex items-center gap-2">
                <Layers size={20} className="text-cyan" />
                <h3>Structured Step-by-Step Curriculum Roadmap</h3>
              </div>
              <span className="text-secondary text-sm">4 Comprehensive Phases • Verified Certificate on Completion</span>
            </div>

            <div className="milestones-timeline">
              {selectedTrack.milestones.map((m, mIdx) => (
                <div key={mIdx} className="milestone-item">
                  <div className="milestone-indicator">
                    <div className="milestone-number">{mIdx + 1}</div>
                    {mIdx < selectedTrack.milestones.length - 1 && <div className="milestone-connector"></div>}
                  </div>

                  <div className="milestone-content-card">
                    <div className="milestone-card-top">
                      <span className="milestone-phase-name">{m.step}</span>
                      <span className="milestone-badge-pill">{m.badge}</span>
                    </div>

                    <h4 className="milestone-course-title">{m.title}</h4>

                    <div className="milestone-card-bottom">
                      <span className="milestone-meta-item">
                        <BookOpen size={14} className="text-secondary" />
                        {m.duration}
                      </span>
                      <span className="milestone-meta-item">
                        <Star size={14} className="text-amber" />
                        Level: {m.level}
                      </span>
                      <button 
                        className="btn-link-view-course"
                        onClick={() => {
                          enrollInCourse({
                            id: m.courseId,
                            title: m.title,
                            category: selectedTrack.category,
                            duration: m.duration,
                            level: m.level
                          });
                          navigate('/my-learning');
                        }}
                      >
                        <span>Enroll Single Course</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CareerCompass;
