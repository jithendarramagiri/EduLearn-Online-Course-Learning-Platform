import { useState, useRef, useEffect } from 'react';
import { 
  Bot, Sparkles, X, Send, Brain, Trophy, CheckCircle2, 
  AlertCircle, HelpCircle, Code2, RefreshCw, ChevronRight, MessageSquare
} from 'lucide-react';
import './EduAITutor.css';

// Pre-packaged rich AI knowledge base for instant offline answers & quizzes
const KNOWLEDGE_BASE = {
  react: {
    title: 'React 19 & Modern Web',
    explanation: `React 19 introduces major paradigm shifts:
• Server Actions: Run asynchronous server functions directly from client forms without manual API routes.
• use() Hook: Unwrap promises and read context conditionally inside loops and statements.
• Actions & useActionState: Automated pending states, optimistic UI updates, and error rollbacks.
• Compiler (React Forget): Automated memoization removing the constant need for useMemo and useCallback.`,
    quiz: [
      {
        question: 'What is the primary benefit of React Server Components (RSC)?',
        options: [
          'They eliminate the need for any CSS styling',
          'Zero client-side JavaScript bundle overhead for static and data-fetching components',
          'They run directly inside browser web workers',
          'They replace SQL databases entirely'
        ],
        answer: 1,
        explanation: 'RSC execute exclusively on the server, streaming HTML and serialized payloads without sending JS bundle code to the client.'
      },
      {
        question: 'Which new React 19 hook allows reading promises directly in render?',
        options: ['useAsyncEffect()', 'usePromise()', 'use()', 'useStream()'],
        answer: 2,
        explanation: 'The use() hook can be called inside conditional blocks and loops to read promises or context.'
      }
    ],
    interview: 'Explain how React Reconciliation works with the Fiber architecture and why Keys are essential for diffing arrays.'
  },
  ai: {
    title: 'Generative AI & LLMs',
    explanation: `Key components of Generative AI systems:
• Self-Attention Mechanism: Computes dynamic contextual weights between all tokens in an input sequence simultaneously.
• Vector Embeddings: High-dimensional mathematical representations capturing semantic meaning.
• RAG (Retrieval-Augmented Generation): Grounds LLMs with private company knowledge bases to prevent hallucinations.
• Agentic Workflows: Multi-step reasoning loops using tools, function calling, and structured memory.`,
    quiz: [
      {
        question: 'What does RAG stand for in modern AI architectures?',
        options: [
          'Recursive Algorithm Generator',
          'Retrieval-Augmented Generation',
          'Real-time Augmented Graph',
          'Rapid Artificial Generalization'
        ],
        answer: 1,
        explanation: 'Retrieval-Augmented Generation combines external vector database search with LLM generation for factual accuracy.'
      },
      {
        question: 'Which component calculates semantic relationships between tokens in a Transformer?',
        options: ['Gradient Descent', 'Multi-Head Self-Attention', 'Convolutional Kernel', 'ReLu Gate'],
        answer: 1,
        explanation: 'Multi-Head Attention enables models to jointly attend to information from different representation subspaces at different positions.'
      }
    ],
    interview: 'How do you mitigate catastrophic forgetting and hallucinations when fine-tuning an open-weight model vs using RAG?'
  },
  cloud: {
    title: 'Cloud & DevOps Architecture',
    explanation: `Modern Cloud Infrastructure pillars:
• Containerization & K8s: Package applications with exact dependencies; Kubernetes manages scheduling, auto-scaling, and self-healing.
• Infrastructure as Code (Terraform): Declarative configuration ensuring reproducible multi-cloud environments.
• CI/CD Pipelines: Continuous linting, testing, container building, and zero-downtime blue/green deployment.
• Observability: Distributed tracing (OpenTelemetry), metrics (Prometheus), and log aggregation.`,
    quiz: [
      {
        question: 'In Kubernetes, what is the smallest deployable computing unit?',
        options: ['Docker Container', 'Pod', 'Service', 'Deployment Replica'],
        answer: 1,
        explanation: 'A Pod encapsulates one or more co-located containers that share network and storage resources.'
      },
      {
        question: 'Which deployment strategy runs two identical production environments to allow instant rollback?',
        options: ['Canary Deployment', 'Rolling Update', 'Blue/Green Deployment', 'Recreate Strategy'],
        answer: 2,
        explanation: 'Blue/Green deployment runs active (Blue) and idle (Green) identical fleets, switching router traffic instantly with zero downtime.'
      }
    ],
    interview: 'Walk me through designing a multi-region highly available architecture with automatic failover and data replication.'
  },
  cyber: {
    title: 'Cybersecurity & Ethical Hacking',
    explanation: `Core Defensive & Offensive Security principles:
• Zero Trust Architecture: "Never trust, always verify" — strict identity validation for every user and service.
• OWASP Top 10: Broken Access Control, Injection, Cryptographic Failures, and SSRF.
• Public Key Cryptography: Asymmetric RSA/ECC for key exchange and digital certificates; AES-256 for data encryption.
• SOC Defense: Threat hunting, SIEM log correlation, and incident response playbooks.`,
    quiz: [
      {
        question: 'What is the most effective mitigation against Cross-Site Scripting (XSS)?',
        options: [
          'Increasing database timeout',
          'Context-aware output encoding and strict Content Security Policy (CSP)',
          'Using HTTP instead of HTTPS',
          'Disabling all cookies'
        ],
        answer: 1,
        explanation: 'Encoding output prevents browsers from executing injected script tags, complemented by CSP headers.'
      }
    ],
    interview: 'How does a Man-In-The-Middle (MITM) attack work and how does TLS certificate pinning protect mobile/web clients?'
  }
};

const DEFAULT_PROMPTS = [
  '🧠 Explain React 19 Server Actions',
  '🚀 How does RAG eliminate AI hallucinations?',
  '🛡️ What is Zero Trust in Cybersecurity?',
  '⚡ Test me with a 2-minute Quiz',
  '🎯 Give me a Senior Tech Interview Question'
];

const EduAITutor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('chat'); // 'chat' | 'quiz' | 'interview'
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "👋 Hi! I'm **EduAI**, your 24/7 intelligent study tutor. Ask me to explain any complex concept, take an interactive micro-quiz, or practice interview questions!"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Quiz state
  const [activeQuizCategory, setActiveQuizCategory] = useState('react');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const messagesEndRef = useRef(null);
  const msgCounterRef = useRef(100);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    msgCounterRef.current += 1;
    const userMsg = { id: msgCounterRef.current, sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // AI reasoning simulation
    setTimeout(() => {
      const lower = text.toLowerCase();
      let responseText = '';

      if (lower.includes('quiz') || lower.includes('test')) {
        setMode('quiz');
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setQuizFinished(false);
        setQuizScore(0);
        responseText = "🎯 I've launched the **Interactive Quiz Sandbox** for you! Select your answer on the quiz tab to test your mastery.";
      } else if (lower.includes('interview') || lower.includes('question')) {
        setMode('interview');
        responseText = "💼 **Senior Engineering Interview Challenge**:\n\n" + KNOWLEDGE_BASE.react.interview;
      } else if (lower.includes('react') || lower.includes('hook') || lower.includes('action') || lower.includes('frontend')) {
        responseText = KNOWLEDGE_BASE.react.explanation;
      } else if (lower.includes('ai') || lower.includes('rag') || lower.includes('llm') || lower.includes('model') || lower.includes('transformer')) {
        responseText = KNOWLEDGE_BASE.ai.explanation;
      } else if (lower.includes('cloud') || lower.includes('devops') || lower.includes('docker') || lower.includes('kubernetes')) {
        responseText = KNOWLEDGE_BASE.cloud.explanation;
      } else if (lower.includes('cyber') || lower.includes('security') || lower.includes('hack') || lower.includes('xss')) {
        responseText = KNOWLEDGE_BASE.cyber.explanation;
      } else {
        responseText = `💡 **Concept Breakdown for "${text}"**:\n\n• **Core Principle**: In production modern architecture, mastering ${text} unlocks high scalability and robust software design.\n• **Best Practice**: Break implementation down into modular, testable units with automated CI/CD coverage.\n• **Next Step**: Check out our catalog of 5,000+ interactive courses to build real hands-on projects around this!`;
      }

      msgCounterRef.current += 1;
      setMessages(prev => [...prev, { id: msgCounterRef.current, sender: 'ai', text: responseText }]);
      setIsTyping(false);
    }, 650);
  };

  const handleQuizAnswer = (optionIdx) => {
    if (selectedOption !== null) return; // already answered
    setSelectedOption(optionIdx);

    const activeList = KNOWLEDGE_BASE[activeQuizCategory]?.quiz || KNOWLEDGE_BASE.react.quiz;
    const currentQ = activeList[currentQuestionIndex];

    if (optionIdx === currentQ.answer) {
      setQuizScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    const activeList = KNOWLEDGE_BASE[activeQuizCategory]?.quiz || KNOWLEDGE_BASE.react.quiz;
    if (currentQuestionIndex + 1 < activeList.length) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = (cat) => {
    if (cat) setActiveQuizCategory(cat);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="edu-ai-wrapper">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button 
          className="edu-ai-launcher" 
          onClick={() => setIsOpen(true)}
          title="Open EduAI Smart Study Companion"
        >
          <div className="launcher-pulse"></div>
          <div className="launcher-icon-wrap">
            <Sparkles className="launcher-sparkle" size={16} />
            <Bot size={28} />
          </div>
          <span className="launcher-label">Ask EduAI</span>
          <span className="launcher-badge">24/7 AI</span>
        </button>
      )}

      {/* Floating AI Panel */}
      {isOpen && (
        <div className="edu-ai-panel glass-panel animate-scale-up">
          {/* Header */}
          <div className="edu-ai-header">
            <div className="ai-brand">
              <div className="ai-avatar">
                <Bot size={22} className="text-cyan" />
              </div>
              <div>
                <div className="ai-title-row">
                  <h4>EduAI Study Companion</h4>
                  <span className="ai-status-tag">Online</span>
                </div>
                <p className="ai-subtitle">Instant answers, smart quizzes & interview prep</p>
              </div>
            </div>
            <button className="ai-close-btn" onClick={() => setIsOpen(false)} title="Minimize AI Tutor">
              <X size={20} />
            </button>
          </div>

          {/* Mode Selector Tabs */}
          <div className="ai-mode-tabs">
            <button 
              className={`mode-tab ${mode === 'chat' ? 'active' : ''}`}
              onClick={() => setMode('chat')}
            >
              <MessageSquare size={14} />
              <span>Ask Tutor</span>
            </button>
            <button 
              className={`mode-tab ${mode === 'quiz' ? 'active' : ''}`}
              onClick={() => setMode('quiz')}
            >
              <Brain size={14} />
              <span>Quiz Sandbox</span>
            </button>
            <button 
              className={`mode-tab ${mode === 'interview' ? 'active' : ''}`}
              onClick={() => setMode('interview')}
            >
              <Trophy size={14} />
              <span>Interview Lab</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="ai-content-body">
            {/* TAB 1: CHAT */}
            {mode === 'chat' && (
              <div className="ai-chat-view">
                <div className="ai-messages-list">
                  {messages.map((m) => (
                    <div key={m.id} className={`ai-message ${m.sender}`}>
                      {m.sender === 'ai' && (
                        <div className="message-icon">
                          <Bot size={16} />
                        </div>
                      )}
                      <div className="message-bubble">
                        <div className="message-text" style={{ whiteSpace: 'pre-line' }}>
                          {m.text}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="ai-message ai">
                      <div className="message-icon"><Bot size={16} /></div>
                      <div className="message-bubble typing-dots">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Bar */}
                <div className="ai-quick-prompts">
                  <span className="quick-prompt-label">Quick Ask:</span>
                  <div className="prompts-scroll">
                    {DEFAULT_PROMPTS.map((p, i) => (
                      <button 
                        key={i} 
                        className="prompt-chip"
                        onClick={() => handleSendMessage(p.replace(/^[^\w\s]+\s*/, ''))}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Bar */}
                <form 
                  className="ai-input-form" 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                >
                  <input 
                    type="text" 
                    placeholder="Ask EduAI anything about code, courses, career..." 
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="ai-input"
                  />
                  <button type="submit" className="ai-send-btn" disabled={!inputVal.trim() || isTyping}>
                    <Send size={16} />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: INTERACTIVE QUIZ */}
            {mode === 'quiz' && (
              <div className="ai-quiz-view">
                <div className="quiz-category-picker">
                  {Object.keys(KNOWLEDGE_BASE).map((k) => (
                    <button 
                      key={k} 
                      className={`cat-chip ${activeQuizCategory === k ? 'active' : ''}`}
                      onClick={() => resetQuiz(k)}
                    >
                      {KNOWLEDGE_BASE[k].title}
                    </button>
                  ))}
                </div>

                {!quizFinished ? (
                  <div className="quiz-card">
                    {(() => {
                      const list = KNOWLEDGE_BASE[activeQuizCategory]?.quiz || KNOWLEDGE_BASE.react.quiz;
                      const q = list[currentQuestionIndex];
                      if (!q) return null;

                      return (
                        <>
                          <div className="quiz-meta">
                            <span className="quiz-step-count">
                              Question {currentQuestionIndex + 1} of {list.length}
                            </span>
                            <span className="quiz-category-name">{KNOWLEDGE_BASE[activeQuizCategory].title}</span>
                          </div>

                          <h4 className="quiz-question-title">{q.question}</h4>

                          <div className="quiz-options-grid">
                            {q.options.map((opt, oIdx) => {
                              let optClass = 'quiz-opt-btn';
                              if (selectedOption !== null) {
                                if (oIdx === q.answer) {
                                  optClass += ' correct';
                                } else if (selectedOption === oIdx) {
                                  optClass += ' incorrect';
                                } else {
                                  optClass += ' disabled';
                                }
                              }
                              return (
                                <button 
                                  key={oIdx}
                                  className={optClass}
                                  onClick={() => handleQuizAnswer(oIdx)}
                                  disabled={selectedOption !== null}
                                >
                                  <span className="opt-letter">
                                    {String.fromCharCode(65 + oIdx)}
                                  </span>
                                  <span className="opt-text">{opt}</span>
                                  {selectedOption !== null && oIdx === q.answer && (
                                    <CheckCircle2 size={16} className="text-green opt-status-icon" />
                                  )}
                                  {selectedOption === oIdx && oIdx !== q.answer && (
                                    <AlertCircle size={16} className="text-red opt-status-icon" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {selectedOption !== null && (
                            <div className="quiz-feedback-box animate-fade-in">
                              <div className="feedback-text">
                                <strong>{selectedOption === q.answer ? '🎉 Spot on!' : '💡 Explanation:'}</strong>{' '}
                                {q.explanation}
                              </div>
                              <button className="btn-next-quiz" onClick={handleNextQuestion}>
                                <span>Next Question</span>
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="quiz-complete-card animate-scale-up">
                    <Trophy size={48} className="text-amber" />
                    <h3>Quiz Completed!</h3>
                    <p className="text-secondary">
                      You scored <strong>{quizScore}</strong> out of{' '}
                      <strong>{KNOWLEDGE_BASE[activeQuizCategory]?.quiz.length || 2}</strong> questions.
                    </p>
                    <div className="quiz-complete-actions">
                      <button className="btn-primary" onClick={() => resetQuiz()}>
                        <RefreshCw size={16} />
                        <span>Retake Quiz</span>
                      </button>
                      <button className="btn-outline" onClick={() => setMode('chat')}>
                        <span>Ask AI Follow-up</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: INTERVIEW LAB */}
            {mode === 'interview' && (
              <div className="ai-interview-view">
                <div className="interview-intro">
                  <Code2 size={24} className="text-cyan" />
                  <div>
                    <h4>FAANG & Tier-1 Interview Simulator</h4>
                    <p className="text-secondary text-sm">Practice real scenario-based architectural questions</p>
                  </div>
                </div>

                <div className="interview-cards-list">
                  {Object.keys(KNOWLEDGE_BASE).map((k) => (
                    <div key={k} className="interview-card">
                      <div className="interview-card-top">
                        <span className="interview-topic-badge">{KNOWLEDGE_BASE[k].title}</span>
                        <span className="interview-difficulty">Senior Level</span>
                      </div>
                      <p className="interview-prompt">{KNOWLEDGE_BASE[k].interview}</p>
                      <button 
                        className="btn-practice-prompt"
                        onClick={() => {
                          setMode('chat');
                          handleSendMessage(`How do I answer this interview question: "${KNOWLEDGE_BASE[k].interview}"?`);
                        }}
                      >
                        <HelpCircle size={14} />
                        <span>Get Ideal Answer & Architecture Diagram</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EduAITutor;
