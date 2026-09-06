const categories = [
  'Artificial Intelligence',
  'Programming',
  'Design & UI/UX',
  'Data Science',
  'Cloud & DevOps',
  'Cybersecurity',
  'Mobile Development',
  'Business & Leadership',
  'Game Development',
  'Marketing',
  'Blockchain & Web3',
  'Software Systems'
];

const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const instructors = [
  'Puneeth Srinivasan', 'Urekha', 'Shareef', 'Saketh', 'Jani Pasha', 
  'Sowmya', 'Vivek', 'Nandini', 'Jithendar', 'HariKrishna', 
  'Lakshmi', 'Poorna', 'Urekha', 'Jani Pasha', 
  'Stephen Grider', 'Suresh', 'Rajesh', 'Vinay', 'Lavanya', 
  'Harish', 'Ritisha', 'Shyam', 'Sai Pavan', 'Brad Traversy', 
  'Vivek', 'John Smilga', 'Hitesh Choudhary', 'Avinash', 'Jithendar',
  'Anitha', 'Praveen'
];

const images = [
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop'
];

const adjectives = [
  'Advanced', 'Complete', 'Modern', 'Practical', 'Ultimate', 'Professional', 
  'Essential', 'Mastering', 'Deep Dive:', 'Fundamentals of', 'Architecting', 
  'Hands-on', 'Enterprise', 'Zero-to-Hero:', 'Scalable', 'Production-Ready',
  'High-Performance', 'Next-Gen', 'The Definitive Guide to', 'Accelerated'
];

const topics = [
  'Generative AI & LLMs', 'Next.js 15 Full-Stack', 'UI/UX Design Systems', 'Machine Learning with PyTorch',
  'Cloud Architecture on AWS', 'Ethical Hacking & Red Teaming', 'React 19 & State Patterns', 'Kubernetes & Docker',
  'Microservices Architecture', 'Python for Financial Modeling', 'Flutter & Cross-Platform Mobile',
  'Rust for High-Performance Systems', 'PostgreSQL & Database Optimization', 'Cyber Security Defense',
  'Product Design with Figma', 'Prompt Engineering & Agents', 'Unreal Engine 5 Game Dev', 'Data Engineering with Spark',
  'Deep Learning with TensorFlow', 'DevOps CI/CD Pipelines', 'Golang Microservices', 'TypeScript Deep Dive',
  'GraphQL & Apollo Federation', 'Solidity & Smart Contracts', 'Computer Vision with OpenCV', 'Natural Language Processing',
  'Vue 3 & Nuxt.js', 'Angular Enterprise Architecture', 'iOS Development with Swift', 'Android with Jetpack Compose',
  'Penetration Testing & Kali Linux', 'Cisco Network Security', 'Information Security & CISSP', 'Apache Kafka & Real-Time Streams',
  'Snowflake & Modern Data Stacks', 'Power BI & Advanced Analytics', 'Executive Product Management', 'Agile & Scrum Leadership',
  'Technical SEO & Content Strategy', 'Digital Marketing & Growth Hacking', 'Blender 3D Modeling & Animation', 'Unity 3D Game Engine',
  'Terraform & Infrastructure as Code', 'System Design & Distributed Systems', 'C++ Game Engine Architecture', 'Linux Kernel & System Programming'
];

const badges = ['Bestseller', 'Trending', 'Highest Rated', 'Featured', 'Hot-New'];

// Seed random generator
const seededRandom = (min, max, seed) => {
  const x = Math.sin(seed++) * 10000;
  const random = x - Math.floor(x);
  return Math.floor(random * (max - min + 1)) + min;
};

// Generate 5,000 courses programmatically
export const coursesData = Array.from({ length: 5000 }).map((_, i) => {
  const id = i + 1;
  const seed = id * 1337;
  
  const adj = adjectives[seededRandom(0, adjectives.length - 1, seed)];
  const topic = topics[seededRandom(0, topics.length - 1, seed + 1)];
  const category = categories[seededRandom(0, categories.length - 1, seed + 2)];
  const instructor = instructors[seededRandom(0, instructors.length - 1, seed + 3)];
  const level = levels[seededRandom(0, levels.length - 1, seed + 4)];
  const image = images[seededRandom(0, images.length - 1, seed + 5)];
  const badge = badges[seededRandom(0, badges.length - 1, seed + 6)];
  
  const rating = (seededRandom(41, 50, seed + 7) / 10).toFixed(1);
  const students = seededRandom(250, 68000, seed + 8);
  const durationNum = seededRandom(4, 52, seed + 9);
  const duration = durationNum > 14 ? `${Math.floor(durationNum / 3)} weeks` : `${durationNum} hours`;
  
  // Price formatting in INR
  const priceValue = seededRandom(1499, 19999, seed + 10);
  const originalPriceValue = Math.floor(priceValue * 1.6);
  const price = `₹${priceValue.toLocaleString('en-IN')}`;
  const originalPrice = `₹${originalPriceValue.toLocaleString('en-IN')}`;

  // Custom detailed data for top showcase courses
  if (id === 1) {
    return {
      id,
      title: 'Advanced React 19 & Next.js 15 Patterns',
      category: 'Programming',
      instructor: 'Puneeth Srinivasan',
      rating: 4.9,
      students: 2000,
      duration: '8 weeks',
      price: '₹7,999',
      originalPrice: '₹14,999',
      level: 'Advanced',
      badge: 'Bestseller',
      image: images[0],
      description: 'Master advanced React concepts including Server Components, Server Actions, Context, Suspense, and Concurrent rendering. Build production-grade enterprise applications with confidence.',
      whatYouWillLearn: [
        'Implement advanced React 19 design patterns and hooks',
        'Master Next.js 15 App Router and Server Actions',
        'Optimize Web Vitals and SSR performance benchmarks',
        'Build scalable micro-frontend architectures'
      ],
      modules: [
        { title: '1. React 19 Architecture & Compiler Internals', duration: '1.5 hours' },
        { title: '2. Next.js 15 Full-Stack App Router Deep Dive', duration: '3.5 hours' },
        { title: '3. State Orchestration & Custom Hooks Ecosystem', duration: '2.5 hours' },
        { title: '4. Production Deployment & Zero-Downtime CI/CD', duration: '2 hours' }
      ]
    };
  }

  if (id === 2) {
    return {
      id,
      title: 'UI/UX Masterclass & Design Systems',
      category: 'Design & UI/UX',
      instructor: 'Shyam',
      rating: 4.9,
      students: 2890,
      duration: '10 weeks',
      price: '₹6,499',
      originalPrice: '₹10,499',
      level: 'Beginner',
      badge: 'Trending',
      image: images[1],
      description: 'Learn the foundational to advanced principles of user interface and product experience design. From typography and design tokens to high-fidelity prototypes in Figma.',
      whatYouWillLearn: [
        'Design tokens, color theory, and responsive grid systems',
        'Complete Figma prototyping & variables workflow',
        'Conducting real user research & usability testing',
        'Creating scalable, accessible design systems'
      ],
      modules: [
        { title: '1. Design Fundamentals & Visual Hierarchy', duration: '2 hours' },
        { title: '2. Component Libraries & Design Tokens in Figma', duration: '3.5 hours' },
        { title: '3. Micro-interactions & Motion Design', duration: '2 hours' }
      ]
    };
  }

  if (id === 3) {
    return {
      id,
      title: 'Full-Stack Generative AI & Autonomous Agents',
      category: 'Artificial Intelligence',
      instructor: 'Urekha',
      rating: 5.0,
      students: 4820,
      duration: '12 weeks',
      price: '₹8,999',
      originalPrice: '₹14,999',
      level: 'Advanced',
      badge: 'Featured',
      image: images[2],
      description: 'Build enterprise-grade AI applications using LLMs, LangChain, RAG pipelines, vector databases (Pinecone, Chroma), and autonomous multi-agent frameworks.',
      whatYouWillLearn: [
        'Build multi-turn conversational agents with memory',
        'Implement Retrieval-Augmented Generation (RAG) at scale',
        'Fine-tune open-source models with LoRA and QLoRA',
        'Deploy production AI endpoints with latency guarantees'
      ],
      modules: [
        { title: '1. LLM Architectures & Transformers Deep Dive', duration: '3 hours' },
        { title: '2. Advanced RAG with Vector Embeddings', duration: '4 hours' },
        { title: '3. Autonomous Agents with LangGraph & CrewAI', duration: '3.5 hours' }
      ]
    };
  }

  return {
    id,
    title: `${adj} ${topic}`,
    category,
    instructor,
    rating: parseFloat(rating),
    students,
    duration,
    price,
    originalPrice,
    level,
    badge,
    image,
    description: `A comprehensive masterclass on ${topic}. Learn proven techniques, real-world patterns, and production-tested practices. Join ${students.toLocaleString()} students already enrolled.`,
    whatYouWillLearn: [
      `Understand foundational to advanced concepts in ${topic}`,
      `Apply industry workflows and solve real-world problems`,
      'Build portfolio-ready projects verified by experts',
      'Optimize performance, security, and scalability'
    ],
    modules: [
      { title: `1. Foundations & Architecture of ${topic}`, duration: '1.5 hours' },
      { title: `2. Core Implementation & Tooling`, duration: '3 hours' },
      { title: `3. Advanced Production Patterns`, duration: '3.5 hours' },
      { title: `4. Capstone Project & Certification`, duration: '4 hours' }
    ]
  };
});

export const getCourseById = (id) => {
  return coursesData.find(course => course.id === parseInt(id, 10));
};
