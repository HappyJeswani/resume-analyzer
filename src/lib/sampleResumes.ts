export interface SampleResume {
  id: string;
  name: string;
  roleId: string;
  roleName: string;
  companyId: string;
  text: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: "swe-senior",
    name: "Alex Rivera (Senior Software Engineer)",
    roleId: "software-engineer",
    roleName: "Software Engineer",
    companyId: "google",
    text: `Alex Rivera
San Francisco, CA | alex.rivera@email.com | (555) 019-2834 | linkedin.com/in/alexrivera-dev | github.com/alexrivera-dev

PROFESSIONAL SUMMARY
Results-driven Senior Software Engineer with 6+ years of experience designing and scaling distributed cloud applications, microservices, and backend APIs. Proficient in Python, Java, C++, TypeScript, React, Docker, and AWS. Proven track record of improving system latency by 45% and leading cross-functional teams in Agile environments.

TECHNICAL SKILLS
Languages: Python, Java, C++, TypeScript, JavaScript, Go, SQL
Frameworks & Libraries: React, Next.js, Node.js, Spring Boot, Express, Django
Cloud & Infrastructure: AWS (EC2, S3, Lambda, DynamoDB), GCP, Docker, Kubernetes, Terraform, CI/CD, Git
Databases: PostgreSQL, MongoDB, Redis, Cassandra
Concepts: Data Structures, Algorithms, System Design, Microservices, REST APIs, GraphQL, Unit Testing

WORK EXPERIENCE
Senior Backend Engineer | CloudScale Tech | San Francisco, CA | 2021 – Present
• Architected high-throughput microservices handling over 50M daily API requests using Node.js, Java Spring Boot, and Redis caching.
• Reduced system P99 latency by 42% through query optimization, indexing, and asynchronous messaging queues (Kafka).
• Spearheaded migration from legacy monolithic architecture to Kubernetes on AWS, cutting infrastructure cloud costs by $180,000 annually.
• Mentored 5 junior software engineers and conducted weekly technical code reviews to uphold software quality standards.

Software Engineer | Apex Systems | Austin, TX | 2018 – 2021
• Developed customer-facing React web applications and RESTful backend microservices serving 1.2M active users.
• Automated CI/CD pipelines using GitHub Actions and Docker, reducing deployment cycle times by 65%.
• Implemented robust unit testing and integration testing suites, increasing test coverage from 58% to 92%.

EDUCATION
Bachelor of Science in Computer Science
University of Texas at Austin | Graduated May 2018
GPA: 3.8 / 4.0 | Dean's Honor List

PROJECTS
Distributed Key-Value Store: Built a fault-tolerant in-memory key-value database in C++ implementing Raft consensus protocol.
AI Code Review Bot: Created a GitHub action leveraging OpenAI API to automatically comment on pull requests with optimization tips.`,
  },
  {
    id: "data-scientist-mid",
    name: "Samantha Chen (Data Scientist)",
    roleId: "data-scientist",
    roleName: "Data Scientist",
    companyId: "amazon",
    text: `Samantha Chen
Seattle, WA | samantha.chen@data.org | (555) 948-2011 | linkedin.com/in/sam-chen-ds | github.com/sam-chen-ds

PROFESSIONAL SUMMARY
Data Scientist with 4+ years of expertise in machine learning, deep learning, statistical analysis, and data engineering. Skilled in Python, R, SQL, PyTorch, TensorFlow, Pandas, Scikit-Learn, and AWS SageMaker. Specialized in predictive modeling, NLP, and customer churn reduction.

TECHNICAL SKILLS
Machine Learning: Classification, Regression, Clustering, Decision Trees, Random Forests, XGBoost, Neural Networks
Languages & Tools: Python, R, SQL, Pandas, NumPy, Scikit-Learn, PyTorch, TensorFlow, Tableau, Power BI, Spark
Cloud & MLOps: AWS (SageMaker, S3, Redshift), Docker, MLflow, Git, A/B Testing

WORK EXPERIENCE
Data Scientist | DataDrive Insights | Seattle, WA | 2022 – Present
• Developed customer churn prediction model using Python XGBoost and AWS SageMaker, increasing customer retention by 22%.
• Designed A/B testing framework to evaluate product recommendations, resulting in a $1.4M increase in annual revenue.
• Built automated ETL pipelines using PySpark and SQL Redshift to process 5TB+ daily transaction logs.

Data Analyst | Analytics Corp | Chicago, IL | 2020 – 2022
• Created interactive Tableau dashboards for executive stakeholders to track core business KPIs and conversion rates.
• Applied NLP techniques (TF-IDF and BERT embeddings) to analyze 50,000+ customer reviews, identifying key product pain points.

EDUCATION
Master of Science in Data Science | Northwestern University | 2020
Bachelor of Science in Statistics | University of Illinois | 2018`,
  },
  {
    id: "pm-lead",
    name: "Marcus Vance (Product Manager)",
    roleId: "product-manager",
    roleName: "Product Manager",
    companyId: "microsoft",
    text: `Marcus Vance
New York, NY | marcus.vance@pm.io | (555) 432-8765 | linkedin.com/in/marcusvance-pm

SUMMARY
Strategic Senior Product Manager with 5+ years leading cross-functional teams of engineers, designers, and data analysts. Expert in product vision, roadmap strategy, user research, agile methodologies, and GTM execution. Successfully launched enterprise SaaS platforms generating $8M ARR.

SKILLS & CORE COMPETENCIES
Product Strategy, Roadmapping, Agile / Scrum, User Research, Wireframing (Figma), Data Analytics (SQL, Mixpanel), A/B Testing, Stakeholder Management, Go-To-Market (GTM), Conversion Rate Optimization.

EXPERIENCE
Lead Product Manager | CloudSaaS Solutions | New York, NY | 2021 – Present
• Led product strategy for enterprise SaaS collaboration tool, driving 140% YoY user growth and scaling ARR from $3M to $8M.
• Defined product roadmap and managed backlog across 3 engineering scrum teams in 2-week sprint cycles.
• Conducted over 60 customer interviews and quantitative user research sessions to define core product feature requirements.

Product Manager | TechVentures Inc | Boston, MA | 2019 – 2021
• Launched mobile customer onboarding flow, increasing user registration conversion rate by 34%.
• Partnered closely with UX designers and software engineering leads to implement self-service subscription upgrades.

EDUCATION
Bachelor of Business Administration (BBA) | Boston University | 2019`,
  },
];
