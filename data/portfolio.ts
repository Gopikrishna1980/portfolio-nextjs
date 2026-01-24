import { Experience, Project, Skill } from '@/types';

export const experiences: Experience[] = [
  {
    id: '1',
    company: 'Verizon',
    position: 'Full Stack Developer',
    duration: 'Current',
    location: 'Remote',
    description: [
      'Developing and maintaining full-stack applications using React, Node.js, and cloud technologies',
      'Collaborating with cross-functional teams to deliver high-quality software solutions',
      'Implementing responsive UI components and RESTful APIs',
      'Participating in code reviews and agile development processes'
    ],
    technologies: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'REST APIs']
  },
  {
    id: '2',
    company: 'Previous Company',
    position: 'Frontend Developer',
    duration: 'Previous',
    location: 'Remote',
    description: [
      'Developed responsive web applications using React and modern JavaScript',
      'Collaborated with designers to implement pixel-perfect UIs',
      'Optimized application performance and user experience',
      'Maintained and improved existing codebases'
    ],
    technologies: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Redux', 'Webpack']
  }
];

export const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Payment Gateway Integration',
    description: 'Full-stack payment processing application with Stripe and PayPal integration, featuring secure checkout, order management, and real-time payment status tracking. Implements 3D Secure authentication, PCI DSS compliance, webhook handling for async payment confirmations, and comprehensive error recovery. Built with Next.js 15 App Router, TypeScript, and Prisma ORM with PostgreSQL database for transaction logging.',
    technologies: ['Next.js 15', 'TypeScript', 'React 18', 'Stripe API', 'PayPal SDK', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'TanStack Query', 'Zod Validation', 'Jest'],
    githubUrl: 'https://github.com/yourusername/payment-gateway',
    liveUrl: 'https://payment-gateway-demo.vercel.app',
  },
  {
    id: '2',
    title: 'Microservices Order Management System',
    description: 'Reactive microservices architecture for order processing with Spring Boot and WebFlux. Features include circuit breaker patterns with Resilience4j, event-driven communication using Apache Kafka, Redis caching for performance optimization, and Docker containerization. Implements RESTful APIs for order creation, inventory management, payment processing, and shipment tracking with comprehensive health checks and monitoring.',
    technologies: ['Java 17', 'Spring Boot 3', 'Spring WebFlux', 'Apache Kafka', 'Redis', 'PostgreSQL', 'Docker', 'Resilience4j', 'JUnit 5', 'Testcontainers'],
    githubUrl: 'https://github.com/yourusername/order-management-microservices',
    liveUrl: 'https://order-api-demo.herokuapp.com/swagger-ui',
  },
  {
    id: '3',
    title: 'Real-Time Analytics Dashboard',
    description: 'Interactive analytics platform with real-time data visualization using React, D3.js, and WebSockets. Features include customizable dashboards, CSV/JSON data import, advanced filtering and search capabilities, data export functionality, and responsive charts. Backend built with Node.js/Express and MongoDB for time-series data storage. Implements JWT authentication, role-based access control, and Redis for WebSocket session management.',
    technologies: ['React 18', 'TypeScript', 'D3.js', 'Chart.js', 'Node.js', 'Express', 'MongoDB', 'WebSockets', 'Redis', 'JWT', 'Material-UI'],
    githubUrl: 'https://github.com/yourusername/analytics-dashboard',
    liveUrl: 'https://analytics-dashboard-demo.netlify.app',
  },
  {
    id: '4',
    title: 'Task Management System with Notifications',
    description: 'Full-featured project management application with real-time collaboration, email notifications using SendGrid, drag-and-drop Kanban boards, file attachments with AWS S3, and team member assignment. Implements user authentication with NextAuth.js, real-time updates via Pusher, advanced search and filtering, activity logs, and deadline reminders. Built with Next.js, Prisma, and PostgreSQL.',
    technologies: ['Next.js 14', 'TypeScript', 'Prisma', 'PostgreSQL', 'NextAuth.js', 'SendGrid', 'AWS S3', 'Pusher', 'React DnD', 'Tailwind CSS', 'Zod'],
    githubUrl: 'https://github.com/yourusername/task-manager',
    liveUrl: 'https://taskmanager-demo.vercel.app',
  },
  {
    id: '5',
    title: 'Secure API Gateway with Rate Limiting',
    description: 'Production-ready API Gateway built with Node.js/Express featuring JWT authentication, Redis-based rate limiting, request/response logging, API key management, and request validation with Joi. Implements middleware chains for authentication, authorization, CORS handling, and comprehensive error handling. Includes Swagger documentation, health check endpoints, and metrics collection with Prometheus. Deployed on AWS EC2 with Nginx reverse proxy.',
    technologies: ['Node.js', 'Express', 'Redis', 'JWT', 'Joi', 'Swagger', 'Prometheus', 'Winston', 'Docker', 'Nginx', 'AWS EC2'],
    githubUrl: 'https://github.com/yourusername/api-gateway',
    liveUrl: 'https://api-gateway-demo.yourdomain.com/docs',
  },
  {
    id: '6',
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
    items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux Toolkit', 'TanStack Query', 'Material-UI', 'D3.js', 'Chart.js']
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express', 'Java', 'Spring Boot', 'Spring WebFlux', 'REST APIs', 'GraphQL', 'Microservices', 'Apache Kafka', 'WebSockets']
  },
  {
    category: 'Database & Caching',
    items: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'MySQL', 'AWS S3']
  },
  {
    category: 'Payment Integrations',
    items: ['Stripe API', 'PayPal SDK', 'Razorpay', 'Braintree', '3D Secure', 'PCI DSS Compliance']
  },
  {
    category: 'DevOps & Tools',
    items: ['Git', 'Docker', 'AWS', 'Jenkins', 'CI/CD', 'Nginx', 'Linux', 'Prometheus']
  },
  {
    category: 'Testing & Quality',
    items: ['Jest', 'JUnit 5', 'React Testing Library', 'Testcontainers', 'Mockito', 'Swagger', 'SonarQube']
  },
  {
    category: 'Architecture & Patterns',
    items: ['Microservices', 'Reactive Programming', 'Circuit Breaker', 'API Gateway', 'Event-Driven Architecture', 'REST', 'SOAP/XML']
  }
];
