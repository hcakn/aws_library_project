# 🎯 Library Recommendation System

AI-powered serverless library book recommendation system built with React, TypeScript, AWS Lambda, DynamoDB, Amazon Cognito, and Amazon Bedrock.

**CENG413 Software Quality Standards - 4-Week Intensive Project**

---

## 🌐 Live Application

**Production URLs:**

- 🚀 **CloudFront (CDN - Recommended):** https://d136xpllx0av0s.cloudfront.net
- 📦 **S3 Direct:** https://library-app-frontend-hacicakin.s3.us-east-1.amazonaws.com/index.html

**GitHub Repository:** https://github.com/hcakn/aws_library_project

---

## ✨ Features

### 🎨 Frontend

- **Modern React 19** with TypeScript
- **Tailwind CSS** for responsive design
- **Animated landing page** with gradient effects
- **Reading Lists** - Create and manage personal book collections
- **Reviews System** - Rate and review books
- **AI-Powered Recommendations** - Get personalized book suggestions
- **Admin Dashboard** - Manage books (role-based access)

### ⚙️ Backend (AWS Serverless)

- **11 Lambda Functions** (Node.js 20.x, ARM64)
  - Books API (GET, GET by ID)
  - Reading Lists API (GET, CREATE, UPDATE, DELETE)
  - Reviews API (GET, CREATE)
  - AI Recommendations (Bedrock integration)
- **3 DynamoDB Tables**
  - Books (10+ entries with cover images)
  - ReadingLists (user-specific)
  - Reviews (book reviews with ratings)
- **API Gateway** - 11 REST endpoints with CORS
- **Amazon Cognito** - User authentication + admin roles
- **Amazon Bedrock** - AI recommendations (Claude 3 Haiku)

### 🚀 DevOps

- **S3 Static Website Hosting**
- **CloudFront CDN** - Global content delivery
- **CI/CD Pipeline** - AWS CodePipeline + GitHub integration
- **Auto-deployment** - Every push to main triggers deployment

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Users                                │
└─────────────────┬───────────────────────────────────────────┘
                  │
         ┌────────▼────────┐
         │   CloudFront    │  (CDN - Global Edge Locations)
         │   CDN Network   │
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │   S3 Bucket     │  (Static Website Hosting)
         │   React App     │
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │  API Gateway    │  (REST API - 11 endpoints)
         └────────┬────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼────┐   ┌───▼────┐   ┌───▼────┐
│ Lambda │   │ Lambda │   │ Lambda │  (11 functions)
│ Books  │   │ Lists  │   │Bedrock │
└───┬────┘   └───┬────┘   └───┬────┘
    │            │            │
    └────────┬───┴────────────┘
             │
    ┌────────▼────────┐
    │   DynamoDB      │  (3 tables)
    │ Books/Lists/    │
    │   Reviews       │
    └─────────────────┘

         ┌──────────────┐
         │   Cognito    │  (Authentication)
         │  User Pool   │
         └──────────────┘

         ┌──────────────┐
         │   Bedrock    │  (AI)
         │ Claude 3     │
         └──────────────┘
```

---

## 🎯 API Endpoints

**Base URL:** `https://ups86wch5d.execute-api.us-east-1.amazonaws.com/dev`

### Public Endpoints

- `GET /books` - List all books
- `GET /books/{id}` - Get book details
- `GET /books/{id}/reviews` - Get book reviews
- `GET /hello` - Health check

### Protected Endpoints (Requires Authentication)

- `POST /books/{id}/reviews` - Create review
- `GET /reading-lists?userId={userId}` - Get user's reading lists
- `POST /reading-lists` - Create reading list
- `PUT /reading-lists/{id}` - Update reading list
- `DELETE /reading-lists/{id}` - Delete reading list
- `GET /recommendations?userId={userId}&genre={genre}&limit={limit}` - AI recommendations

---

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 3** - Styling
- **React Router 7** - Client-side routing
- **AWS Amplify** - Cognito integration

### Backend

- **AWS Lambda** - Serverless compute
- **Amazon DynamoDB** - NoSQL database
- **Amazon API Gateway** - REST API
- **Amazon Cognito** - Authentication
- **Amazon Bedrock** - AI (Claude 3 Haiku)
- **AWS SDK v3** - AWS service integration

### DevOps

- **Amazon S3** - Static hosting
- **Amazon CloudFront** - CDN
- **AWS CodePipeline** - CI/CD
- **AWS CodeBuild** - Build automation
- **GitHub** - Source control

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- AWS Account
- Git

### Local Development

```bash
# Clone repository
git clone https://github.com/hcakn/aws_library_project.git
cd aws_library_project

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=https://ups86wch5d.execute-api.us-east-1.amazonaws.com/dev
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_WzPzFnM91
VITE_COGNITO_CLIENT_ID=6fq554dvi55jgsnqmc3m24u2r1
EOF

# Start development server
npm run dev

# Open http://localhost:5173
```

### Build for Production

```bash
npm run build
# Output: dist/ directory
```

---

## 📊 Project Statistics

- **Total Development Time:** ~16 hours (4-week intensive)
- **Lines of Code:** ~3,500+
- **Lambda Functions:** 11
- **DynamoDB Tables:** 3
- **API Endpoints:** 11
- **AWS Services Used:** 8 (Lambda, DynamoDB, API Gateway, Cognito, Bedrock, S3, CloudFront, CodePipeline)
- **Deployment:** Fully automated CI/CD

---

## 🔐 Authentication

### User Roles

- **User:** Can browse books, create reading lists, write reviews, get AI recommendations
- **Admin:** All user permissions + manage books (create/edit/delete)

### Admin Access

To create an admin user:

1. Sign up normally
2. AWS Console → Cognito → User Pools → library-users → Groups
3. Add user to "Admins" group

---

## 🤖 AI Recommendations

Powered by **Amazon Bedrock (Claude 3 Haiku)**

**Example Query:**

```
Genre: Science Fiction
Limit: 3 books
```

**AI Response:**

```json
{
  "recommendations": [
    {
      "title": "The Martian",
      "author": "Andy Weir",
      "description": "An astronaut stranded on Mars...",
      "reason": "Perfect for sci-fi fans who enjoy..."
    }
  ]
}
```

**Cost:** ~$0.001 per recommendation (within Free Tier)

---

## 💰 AWS Cost Breakdown

**Monthly Cost (Production):** ~$0.05 - $2.00

| Service     | Usage               | Cost             |
| ----------- | ------------------- | ---------------- |
| Lambda      | 1M requests/month   | Free Tier        |
| DynamoDB    | On-demand, <1GB     | Free Tier        |
| API Gateway | 1M requests/month   | Free Tier        |
| Cognito     | <50K MAU            | Free Tier        |
| S3          | <5GB storage        | Free Tier        |
| CloudFront  | <1TB transfer       | Free Tier        |
| Bedrock     | ~100 requests/month | ~$0.05           |
| **Total**   |                     | **~$0.05/month** |

✅ **Stays within Free Tier for student usage!**

---

## 📁 Project Structure

```
aws_library_project/
├── public/
│   └── book-covers/          # Book cover images (10 books)
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   ├── layout/           # Header, Footer, Navigation
│   │   └── books/            # Book-specific components
│   ├── pages/                # Page components
│   │   ├── Home.tsx          # Landing page
│   │   ├── Books.tsx         # Books catalog
│   │   ├── BookDetail.tsx    # Book details + reviews
│   │   ├── Recommendations.tsx # AI recommendations
│   │   ├── ReadingLists.tsx  # User's reading lists
│   │   └── Admin.tsx         # Admin dashboard
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Cognito authentication
│   ├── services/
│   │   └── api.ts            # API service layer
│   ├── types/                # TypeScript interfaces
│   ├── utils/                # Helper functions
│   └── main.tsx              # App entry point
├── buildspec.yml             # CodeBuild configuration
├── .env                      # Environment variables (not in Git)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Generate coverage report
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

**Current Test Coverage:** ~75%

---

## 🚀 Deployment

### Automated CI/CD Pipeline

**Trigger:** Every push to `main` branch

**Pipeline Stages:**

1. **Source** - Pull code from GitHub
2. **Build** - `npm install` + `npm run build`
3. **Deploy** - Upload to S3 bucket

**Build Time:** ~3-5 minutes

### Manual Deployment

```bash
# Build
npm run build

# Deploy to S3
aws s3 sync dist/ s3://library-app-frontend-hacicakin/ \
  --delete \
  --content-type "text/html" \
  --exclude "*" \
  --include "*.html"

aws s3 sync dist/ s3://library-app-frontend-hacicakin/ \
  --delete \
  --content-type "application/javascript" \
  --exclude "*" \
  --include "*.js"

aws s3 sync dist/ s3://library-app-frontend-hacicakin/ \
  --delete \
  --content-type "text/css" \
  --exclude "*" \
  --include "*.css"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id E26MDK9MLK6RED \
  --paths "/*"
```

---

## 🎓 Learning Outcomes

### Skills Developed

✅ **React + TypeScript** - Modern frontend development  
✅ **AWS Lambda** - Serverless architecture  
✅ **DynamoDB** - NoSQL database design  
✅ **API Gateway** - REST API creation  
✅ **Cognito** - User authentication  
✅ **Bedrock** - AI/ML integration  
✅ **S3 + CloudFront** - Static website hosting + CDN  
✅ **CI/CD** - Automated deployment pipelines  
✅ **Git/GitHub** - Version control

### AWS Services Mastered

- Lambda Functions (11 deployments)
- DynamoDB (3 tables)
- API Gateway (REST API)
- Cognito (User Pools + Groups)
- Bedrock (AI integration)
- S3 (Static hosting)
- CloudFront (CDN)
- CodePipeline (CI/CD)
- IAM (Permissions)
- CloudWatch (Logging)

---

## 🐛 Known Issues & Future Improvements

### Potential Enhancements

- [ ] Add book search functionality
- [ ] Implement pagination for large datasets
- [ ] Add user profile pages
- [ ] Email notifications for reviews
- [ ] Book recommendations based on reading history
- [ ] Social features (follow users, share lists)
- [ ] Advanced admin analytics dashboard

---

## 👥 Team

**Project Team - CENG413 Software Quality Standards**

### Team Members & Contributions

**Bercan AYDIN**

- 🤖 **AI Integration & Backend Services**
- Integrated Amazon Bedrock (Claude 3 Haiku) for AI recommendations
- Built Lambda functions for AI-powered book suggestions
- Implemented Reviews API (GET, POST)
- Designed recommendation algorithm with genre-based filtering

**Yunus Emre EKE**

- 🔐 **Authentication & Security Implementation**
- Configured AWS Cognito User Pool
- Implemented role-based access control (Admin/User groups)
- Set up IAM policies and permissions
- Protected API endpoints with Cognito authorizer

**Hacı ÇAKIN**

- 🎨 **Frontend Development & DevOps**
- Built React application with TypeScript
- Designed responsive UI with Tailwind CSS
- Created modern landing page with animations
- Set up CI/CD pipeline with AWS CodePipeline
- Deployed frontend on S3 + CloudFront CDN
- Configured auto-deployment from GitHub

**Çağan APAYDIN**

- 🗄️ **Backend Architecture & Database Design**
- Built core AWS Lambda functions (Books, Reading Lists APIs)
- Designed DynamoDB schema (3 tables)
- Implemented CRUD operations for Books and Reading Lists
- Set up API Gateway with CORS configuration
- Managed AWS infrastructure and monitoring

---

**Collaboration Tools:**

- Version Control: Git/GitHub
- Communication: [Your tool - Discord/Slack/Teams]
- Project Management: [Your tool - Trello/Jira/GitHub Projects]

**Development Period:** December 2025 (4-week intensive)

**Institution:** Istanbul Okan University  
**Course:** CENG413 - Software Quality Standards

---

## 📄 License

This project is part of an academic course at Istanbul Okan University.

**For educational purposes only.**

---

## 🙏 Acknowledgments

- **AWS Free Tier** - Made this project possible
- **Amazon Bedrock** - AI recommendations
- **React Team** - Amazing framework
- **Anthropic** - Claude 3 Haiku model
- **CENG413 Course** - Project structure and guidance

---

**Built with ❤️ using AWS Serverless Architecture**

🚀 **Live Demo:** https://d136xpllx0av0s.cloudfront.net
