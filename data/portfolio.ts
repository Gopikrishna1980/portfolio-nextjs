import { Experience, Project, Skill } from '@/types';

export const experiences: Experience[] = [
  {
    id: '1',
    company: 'Verizon',
    position: 'Full Stack Developer',
    duration: 'April 2023 - Present',
    location: 'Remote',
    description: [
      'Built and maintained Spring Boot microservices (Java 17) for Verizon Experience Platform (VXP), supporting customer-service operations for telecom features including Call Forwarding, Voicemail, APN Settings, and SMS notifications',
      'Designed RESTful APIs with OpenAPI/Swagger documentation and implemented service-layer business logic for telephony workflows with strong security validations and PII masking',
      'Integrated with downstream systems using Spring WebFlux + WebClient, including carrier gateways, Nokia SOAP/XML APIs, SMS platforms, and internal workflow services',
      'Implemented resiliency patterns using Resilience4j (retry, circuit breaker, timeouts, fallbacks) and correlation IDs for improved observability',
      'Developed UI components for 5G Home Internet and Payment Portal using React.js, Next.js, TypeScript, and Tailwind CSS with Verizon Design System',
      'Monitored high-traffic production journeys using Quantum Metric and Kibana logs for root-cause analysis and incident triage',
      'Implemented AI-powered features using approved enterprise AI platforms and automated troubleshooting tasks with Python scripts'
    ],
    technologies: ['Java 17', 'Spring Boot', 'Spring WebFlux', 'React', 'Next.js', 'TypeScript', 'REST APIs', 'SOAP/XML', 'Resilience4j', 'PostgreSQL', 'Cassandra', 'Docker', 'Jenkins', 'Tailwind CSS', 'Python']
  },
  {
    id: '2',
    company: 'CDK Global',
    position: 'UI Developer',
    duration: 'Jan 2022 - March 2023',
    location: 'Remote',
    description: [
      'Developed enterprise dashboard UI using Angular (v4-v6), TypeScript, RxJS, and Angular Material for automotive dealership management platform',
      'Built reusable Angular components, services, and shared templates following Angular best practices and dependency injection patterns',
      'Implemented reactive forms with complex validations and RxJS-based async data handling using Observables, switchMap, and error operators',
      'Integrated RESTful APIs using Angular HttpClient, handling edge cases and mapping responses to UI models',
      'Ensured cross-browser compatibility (including IE11) with Flexbox layouts and targeted CSS modifications'
    ],
    technologies: ['Angular 4/5/6', 'TypeScript', 'RxJS', 'Angular Material', 'HTML5', 'SASS', 'REST APIs', 'Git', 'Jira']
  },
  {
    id: '3',
    company: 'Byte Cubed LLC',
    position: 'UI Analyst/Developer',
    duration: 'Aug 2020 - Dec 2021',
    location: 'Crystal City, VA',
    description: [
      'Built hybrid mobile UI screens using PhoneGap/Cordova, jQuery, and Backbone.js for cross-platform iOS and Android experiences',
      'Developed reusable UI patterns (dialogs, slide menus, carousels, infinite scroll) with improved responsiveness across devices',
      'Integrated UI flows with REST APIs and handled client-side mapping of JSON responses with loading/error states',
      'Implemented offline-first UI behavior using SQLite/WebSQL with encrypted local storage using SQL Cipher',
      'Supported native capabilities through Cordova plugins (camera/video, browser view, dialer/contact actions) and geolocation-based UI functionality'
    ],
    technologies: ['JavaScript', 'jQuery', 'Backbone.js', 'PhoneGap/Cordova', 'HTML5', 'CSS3', 'REST APIs', 'SQLite', 'Git']
  },
  {
    id: '4',
    company: 'Nadella Info Tech',
    position: 'UI Developer',
    duration: 'Nov 2017 - Apr 2021',
    location: 'Hyderabad, India',
    description: [
      'Designed and developed client portal for wealth management enabling high-net-worth clients to track portfolios and manage financial assets',
      'Collaborated with Java backend team to integrate RESTful APIs built with Spring Boot, defining API contracts and validating payload structures',
      'Developed dynamic, responsive UI components using React.js, JavaScript (ES6), HTML5, CSS3, Bootstrap, and SASS',
      'Implemented secure authentication and session management with SSL/TLS and encrypted data transmission',
      'Designed data visualization dashboards using Highcharts and integrated backend data for real-time reporting'
    ],
    technologies: ['React', 'JavaScript', 'TypeScript', 'Java', 'Spring Boot', 'HTML5', 'CSS3', 'SASS', 'Bootstrap', 'Highcharts', 'Jenkins', 'Git']
  }
];

export const projects: Project[] = [
  {
    id: '1',
    title: 'Healthcare AI Assistant with Advanced RAG',
    description: 'Production-grade AI chatbot with multi-agent system, query decomposition, hybrid search (semantic + keyword), and LLM reranking achieving 92% relevance. Features streaming responses, cost tracking with tiktoken, evaluation metrics (precision/recall), and 4 specialized medical agents (Cardiology, Endocrinology, Respiratory, General). Built with LangChain for orchestration, OpenAI GPT-4 for generation, ChromaDB for vector storage, and FastAPI backend with 11 endpoints. Demonstrates advanced RAG techniques: query decomposition, hybrid retrieval, document reranking, and agentic workflows.',
    technologies: ['Python', 'LangChain', 'LangGraph', 'OpenAI GPT-4', 'RAG', 'ChromaDB', 'FastAPI', 'Multi-Agent System', 'Streaming', 'Vector DB', 'Embeddings', 'tiktoken', 'Async Python'],
    githubUrl: 'https://github.com/Gopikrishna1980/healthcare-ai-assistant',
    liveUrl: 'https://healthcare-ai-assistant.vercel.app',
  },
  {
    id: '2',
    title: 'E-Commerce Payment Gateway Integration',
    description: 'Full-stack payment processing application with Stripe and PayPal integration, featuring secure checkout, order management, and real-time payment status tracking. Implements 3D Secure authentication, PCI DSS compliance, webhook handling for async payment confirmations, and comprehensive error recovery. Built with Next.js 15 App Router, TypeScript, and Prisma ORM with PostgreSQL database for transaction logging.',
    technologies: ['Next.js 15', 'TypeScript', 'React 18', 'Stripe API', 'PayPal SDK', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'TanStack Query', 'Zod Validation', 'Jest'],
    githubUrl: 'https://github.com/yourusername/payment-gateway',
    liveUrl: 'https://payment-gateway-demo.vercel.app',
  },
  {
    id: '3',
    title: 'Microservices Order Management System',
    description: 'Reactive microservices architecture for order processing with Spring Boot and WebFlux. Features include circuit breaker patterns with Resilience4j, event-driven communication using Apache Kafka, Redis caching for performance optimization, and Docker containerization. Implements RESTful APIs for order creation, inventory management, payment processing, and shipment tracking with comprehensive health checks and monitoring.',
    technologies: ['Java 17', 'Spring Boot 3', 'Spring WebFlux', 'Apache Kafka', 'Redis', 'PostgreSQL', 'Docker', 'Resilience4j', 'JUnit 5', 'Testcontainers'],
    githubUrl: 'https://github.com/yourusername/order-management-microservices',
    liveUrl: 'https://order-api-demo.herokuapp.com/swagger-ui',
  },
  {
    id: '4',
    title: 'Real-Time Analytics Dashboard',
    description: 'Interactive analytics platform with real-time data visualization using React, D3.js, and WebSockets. Features include customizable dashboards, CSV/JSON data import, advanced filtering and search capabilities, data export functionality, and responsive charts. Backend built with Node.js/Express and MongoDB for time-series data storage. Implements JWT authentication, role-based access control, and Redis for WebSocket session management.',
    technologies: ['React 18', 'TypeScript', 'D3.js', 'Chart.js', 'Node.js', 'Express', 'MongoDB', 'WebSockets', 'Redis', 'JWT', 'Material-UI'],
    githubUrl: 'https://github.com/yourusername/analytics-dashboard',
    liveUrl: 'https://analytics-dashboard-demo.netlify.app',
  },
  {
    id: '5',
    title: 'Task Management System with Notifications',
    description: 'Full-featured project management application with real-time collaboration, email notifications using SendGrid, drag-and-drop Kanban boards, file attachments with AWS S3, and team member assignment. Implements user authentication with NextAuth.js, real-time updates via Pusher, advanced search and filtering, activity logs, and deadline reminders. Built with Next.js, Prisma, and PostgreSQL.',
    technologies: ['Next.js 14', 'TypeScript', 'Prisma', 'PostgreSQL', 'NextAuth.js', 'SendGrid', 'AWS S3', 'Pusher', 'React DnD', 'Tailwind CSS', 'Zod'],
    githubUrl: 'https://github.com/yourusername/task-manager',
    liveUrl: 'https://taskmanager-demo.vercel.app',
  },
  {
    id: '6',
    title: 'Secure API Gateway with Rate Limiting',
    description: 'Production-ready API Gateway built with Node.js/Express featuring JWT authentication, Redis-based rate limiting, request/response logging, API key management, and request validation with Joi. Implements middleware chains for authentication, authorization, CORS handling, and comprehensive error handling. Includes Swagger documentation, health check endpoints, and metrics collection with Prometheus. Deployed on AWS EC2 with Nginx reverse proxy.',
    technologies: ['Node.js', 'Express', 'Redis', 'JWT', 'Joi', 'Swagger', 'Prometheus', 'Winston', 'Docker', 'Nginx', 'AWS EC2'],
    githubUrl: 'https://github.com/yourusername/api-gateway',
    liveUrl: 'https://api-gateway-demo.yourdomain.com/docs',
  },
  {
    id: '7',
    title: 'Event Booking Platform',
    description: 'Full-stack event management system with seat selection, booking confirmation, QR code ticket generation, email notifications, and payment processing. Features include interactive seat maps using SVG, real-time availability updates with Socket.io, booking expiration timers, and refund processing. Built with MERN stack (MongoDB, Express, React, Node.js) and integrates Razorpay payment gateway. Implements comprehensive booking state management and conflict resolution.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Razorpay', 'QR Code', 'Nodemailer', 'Redux Toolkit', 'Material-UI'],
    githubUrl: 'https://github.com/yourusername/event-booking',
    liveUrl: 'https://eventbooking-demo.herokuapp.com',
  }
];

export const skills: Skill[] = [
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'Angular 4/5/6', 'TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Tailwind CSS', 'Styled Components', 'SASS', 'Redux', 'RxJS', 'Angular Material', 'Material-UI', 'jQuery']
  },
  {
    category: 'Backend',
    items: ['Java 17', 'Spring Boot 3', 'Spring WebFlux', 'Project Reactor', 'Node.js', 'Express', 'REST APIs', 'SOAP/XML (JAXB)', 'Microservices', 'Resilience4j']
  },
  {
    category: 'Database & Caching',
    items: ['PostgreSQL', 'Cassandra', 'MongoDB', 'Redis', 'MySQL', 'SQLite', 'Prisma']
  },
  {
    category: 'Testing & Quality',
    items: ['JUnit 5', 'Mockito', 'Reactor Test', 'Jest', 'React Testing Library', 'Cucumber (BDD)', 'SonarQube', 'Swagger/OpenAPI']
  },
  {
    category: 'DevOps & Tools',
    items: ['Git', 'GitLab', 'Bitbucket', 'Maven', 'Jenkins', 'Docker', 'CI/CD', 'Kibana', 'Quantum Metric', 'Jira', 'Rally']
  },
  {
    category: 'Cloud & Infrastructure',
    items: ['AWS', 'Azure', 'Kubernetes', 'Linux', 'Windows Server']
  },
  {
    category: 'Architecture & Patterns',
    items: ['Microservices Architecture', 'Reactive Programming', 'Circuit Breaker Patterns', 'Event-Driven Architecture', 'REST', 'SOAP', 'API Design', 'Security Best Practices']
  },
  {
    category: 'AI & Automation',
    items: ['Enterprise AI Integration', 'Python Scripting', 'GitHub Copilot', 'AI-Assisted Development']
  },
  {
    category: 'AI/ML & LLM',
    items: ['LangChain', 'LangGraph', 'OpenAI GPT-4', 'RAG (Retrieval Augmented Generation)', 'Vector Databases', 'ChromaDB', 'Pinecone', 'Multi-Agent Systems', 'Prompt Engineering', 'LLM Fine-tuning', 'Embeddings', 'Semantic Search', 'AI Agents', 'Chain of Thought', 'Function Calling']
  }
];
