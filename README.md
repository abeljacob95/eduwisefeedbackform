# EduWise Feedback Form

A simple, production-ready feedback collection system for medical education. Collects user details and feedback through a clean web form, stores data in MongoDB, and sends automated daily email reports via Amazon SES.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Form Questions](#form-questions)
- [Email Reports](#email-reports)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

- ✅ **User Details Collection**: Name, Email, Phone, Education Phase
- ✅ **11 Feedback Questions**: Ratings, multiple choice, and text responses
- ✅ **MongoDB Storage**: All feedback securely stored
- ✅ **Daily Email Reports**: Automated emails at 12:00 AM UTC via Amazon SES
- ✅ **Modern UI**: Beautiful, responsive design with EduWise branding
- ✅ **TypeScript**: Full type safety across frontend and backend
- ✅ **Production Ready**: Easy to deploy on any server

---

## 🛠 Tech Stack

### Backend
- **NestJS** 10.3.0 - Node.js framework
- **MongoDB** with Mongoose 8.0.0 - Database
- **AWS SDK** 2.x - Amazon SES integration
- **TypeScript** 5.4.5

### Frontend
- **Next.js** 14.2.20 - React framework
- **React** 18.3.1
- **Tailwind CSS** 3.4.16 - Styling
- **React Hook Form** + **Zod** - Form validation

---

## 📦 Prerequisites

Before installing, make sure you have:

1. **Node.js** 18 or higher ([Download](https://nodejs.org/))
2. **MongoDB** installed and running ([Installation Guide](https://www.mongodb.com/docs/manual/installation/))
   - Or use [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud database)
3. **AWS Account** with SES configured ([AWS Console](https://aws.amazon.com/))
4. **Git** (optional, for cloning)

---

## 🚀 Installation

### Step 1: Clone or Download the Project

```bash
# If using Git
git clone <your-repository-url>
cd eduwise-feedback-form

# Or download and extract the ZIP file
```

### Step 2: Install Dependencies

Install dependencies for both backend and frontend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Go back to root
cd ..
```

---

## ⚙️ Configuration

### 1. Backend Configuration

Create environment file:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your settings:

```env
# MongoDB Connection
MONGODB_URI="mongodb://localhost:27017/eduwise_feedback"
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/eduwise_feedback

# Server Port
PORT=3001

# CORS (Frontend URL)
CORS_ORIGIN="http://localhost:3000"
# For production: https://yourdomain.com

# Environment
NODE_ENV="development"

# AWS SES Configuration
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
SES_FROM_EMAIL="noreply@yourdomain.com"
SES_TO_EMAILS="admin@yourdomain.com,manager@yourdomain.com"
```

### 2. Frontend Configuration

Create environment file:

```bash
cd frontend
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001

# For production, update to your backend URL:
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 3. AWS SES Setup

To send emails, you need to configure Amazon SES:

#### a) Create AWS Account
Sign up at [aws.amazon.com](https://aws.amazon.com) if you don't have an account.

#### b) Verify Email Address
1. Go to **Amazon SES** in AWS Console
2. Click **Verified identities** → **Create identity**
3. Choose **Email address**
4. Enter your sender email (e.g., `noreply@yourdomain.com`)
5. Verify via the link sent to your email

#### c) Create IAM User
1. Go to **IAM** → **Users** → **Create user**
2. User name: `eduwise-ses-user`
3. Attach policy: **AmazonSESFullAccess**
4. Create **Access Key** (Application running outside AWS)
5. Copy **Access Key ID** and **Secret Access Key**
6. Add these to your `backend/.env` file

#### d) Request Production Access (Optional)
By default, SES is in **sandbox mode** (can only send to verified emails).

To send to any email:
1. Go to SES → **Account dashboard**
2. Click **Request production access**
3. Fill the form (approval takes 24-48 hours)

**For testing:** Verify recipient emails in SES console.

---

## 🏃 Running the Application

### Development Mode

#### Option 1: Run Separately (Recommended)

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will start on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will start on http://localhost:3000

#### Option 2: Check Status

Make sure MongoDB is running:
```bash
# Check MongoDB status
mongosh
# or
mongo
```

### Production Mode

```bash
# Build backend
cd backend
npm run build
npm run start:prod

# Build frontend (in another terminal)
cd frontend
npm run build
npm start
```

---

## 📝 Form Questions

The feedback form collects:

### User Information
1. **Full Name** (required)
2. **Email Address** (required, validated)
3. **Phone Number** (required, min 10 digits)
4. **Education Phase** (required, dropdown):
   - MBBS 1st Year - 4th Year
   - Internship
   - House Surgency
   - Postgraduate (MD/MS/DNB)
   - Practicing Doctor
   - Other

### Feedback Questions
- **Q1**: Pre-assessment ease (1-5 rating)
- **Q2**: Pre-assessment understanding (1-5 rating)
- **Q3**: Study plan realistic (1-5 rating)
- **Q4**: MCQ relevance (1-5 rating)
- **Q5**: Content quality vs platform (multiple choice)
- **Q6**: Mental state after use (multiple choice)
- **Q7**: Decision help (1-5 rating)
- **Q8**: Switch potential (multiple choice)
- **Q9**: Trust in recommendations (1-5 rating)
- **Q10**: Better than current platform (optional text)
- **Q11**: Must improve (optional text)

---

## 📧 Email Reports

### Daily Automated Emails

- **Schedule**: Every day at **12:00 AM UTC**
- **Content**: All feedback received that day
- **Format**: Professional HTML email with:
  - User details (name, email, phone, education phase)
  - All 11 questions with responses
  - Timestamp for each submission

### Customize Email Schedule

Edit `backend/src/email/email.service.ts`:

```typescript
// Current: 12:00 AM UTC
@Cron('0 0 * * *', {
  name: 'daily-feedback-report',
  timeZone: 'UTC',
})

// Change to 8:00 AM EST:
@Cron('0 8 * * *', {
  name: 'daily-feedback-report',
  timeZone: 'America/New_York',
})
```

[Cron Expression Helper](https://crontab.guru/)

### Test Email Manually

To test email sending without waiting for scheduled time, you can create a test endpoint or modify the cron schedule temporarily.

---

## 🔌 API Endpoints

### Base URL
- Development: `http://localhost:3001`
- Production: `https://your-api-domain.com`

### Endpoints

#### Submit Feedback
```http
POST /api/feedback
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+91 1234567890",
  "educationPhase": "mbbs_2nd_year",
  "q0PreAssessmentEase": 4,
  "q1PreAssessmentRating": 5,
  "q2StudyPlanRating": 4,
  "q3McqRelevanceRating": 5,
  "q4ContentQuality": "clearly_better",
  "q5MentalState": "clearer",
  "q6DecisionHelpRating": 5,
  "q7SwitchPotential": "yes",
  "q8TrustRating": 5,
  "q9BetterThanCurrent": "Optional text",
  "q10MustImprove": "Optional text"
}
```

#### Get All Feedback
```http
GET /api/feedback?page=1&limit=50
```

#### Get Specific Feedback
```http
GET /api/feedback/:id
```

#### Health Check
```http
GET /health
```

---

## 🚀 Deployment

### Option 1: VPS (Ubuntu/Debian)

#### 1. Install Prerequisites
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### 2. Upload Project
```bash
# Clone repository or upload files
git clone <your-repo-url>
cd eduwise-feedback-form
```

#### 3. Install Dependencies & Build
```bash
# Backend
cd backend
npm install --production
cp .env.example .env
nano .env  # Edit with production values
npm run build

# Frontend
cd ../frontend
npm install --production
cp .env.local.example .env.local
nano .env.local  # Edit with production values
npm run build
```

#### 4. Start with PM2
```bash
# Start backend
cd backend
pm2 start dist/main.js --name eduwise-backend

# Start frontend
cd ../frontend
pm2 start npm --name eduwise-frontend -- start

# Save PM2 configuration
pm2 save
pm2 startup  # Follow the instructions shown
```

#### 5. Configure Nginx (Optional but Recommended)
```bash
sudo apt install -y nginx

# Create configuration
sudo nano /etc/nginx/sites-available/eduwise
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/eduwise /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Setup SSL with Let's Encrypt (Optional)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Option 2: Cloud Platforms

**Vercel (Frontend) + Railway (Backend)**
1. Push code to GitHub
2. Deploy frontend to Vercel
3. Deploy backend + MongoDB to Railway
4. Update environment variables

**Render**
- Deploy both backend and frontend
- Add MongoDB database
- Configure environment variables

---

## 🐛 Troubleshooting

### Backend Won't Start

**Port already in use:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3001
kill -9 <PID>
```

**MongoDB connection failed:**
```bash
# Check MongoDB is running
sudo systemctl status mongodb

# Or
mongosh
```

### Email Not Sending

1. **Check AWS credentials** in `.env`
2. **Verify sender email** in SES console
3. **Sandbox mode**: Verify recipient emails too
4. **Check logs**: Look for errors in backend console

### Frontend Can't Connect to Backend

1. **Check `NEXT_PUBLIC_API_URL`** in `frontend/.env.local`
2. **Check CORS** settings in `backend/.env`
3. **Make sure backend is running** on port 3001

### Form Validation Errors

All fields are required except Q10 and Q11:
- Name: minimum 2 characters
- Email: valid email format
- Phone: minimum 10 digits
- Education phase: must be selected

---

## 📁 Project Structure

```
eduwise-feedback-form/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── email/             # Email service with scheduler
│   │   │   ├── email.module.ts
│   │   │   └── email.service.ts
│   │   ├── feedback/          # Feedback CRUD
│   │   │   ├── dto/
│   │   │   ├── schemas/
│   │   │   ├── feedback.controller.ts
│   │   │   ├── feedback.module.ts
│   │   │   └── feedback.service.ts
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── health.controller.ts
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # Next.js Frontend
│   ├── public/                # Static assets
│   │   ├── eduwise-logo.svg
│   │   ├── eduwise-mark.svg
│   │   └── favicon.svg
│   ├── src/
│   │   ├── app/               # App router
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   └── components/        # React components
│   │       ├── FeedbackForm.tsx
│   │       ├── InputField.tsx
│   │       ├── SelectQuestion.tsx
│   │       ├── RatingQuestion.tsx
│   │       ├── MultipleChoiceQuestion.tsx
│   │       ├── TextQuestion.tsx
│   │       └── SuccessMessage.tsx
│   ├── .env.local.example
│   └── package.json
│
├── .gitignore
├── package.json               # Root package.json
└── README.md                  # This file
```

---

## 📊 Database Schema

### Feedback Collection

```javascript
{
  // User Details
  name: String (required),
  email: String (required),
  phoneNumber: String (required),
  educationPhase: String (required, enum),
  
  // Questions (Q0-Q10)
  q0PreAssessmentEase: Number (1-5, required),
  q1PreAssessmentRating: Number (1-5, required),
  q2StudyPlanRating: Number (1-5, required),
  q3McqRelevanceRating: Number (1-5, required),
  q4ContentQuality: String (enum, required),
  q5MentalState: String (enum, required),
  q6DecisionHelpRating: Number (1-5, required),
  q7SwitchPotential: String (enum, required),
  q8TrustRating: Number (1-5, required),
  q9BetterThanCurrent: String (optional),
  q10MustImprove: String (optional),
  
  // Metadata
  userAgent: String (optional),
  ipAddress: String (optional),
  sessionId: String (optional),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### View Data in MongoDB

```bash
mongosh
use eduwise_feedback
db.feedbacks.find().pretty()
```

---

## 🔒 Security Notes

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use environment variables** for all secrets
3. **Enable HTTPS** in production with SSL certificate
4. **Keep dependencies updated**: Run `npm audit` regularly
5. **Backup MongoDB** regularly

---

## 📝 Environment Variables Reference

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/eduwise_feedback` |
| `PORT` | Backend server port | `3001` |
| `CORS_ORIGIN` | Allowed frontend URLs | `http://localhost:3000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `AWS_REGION` | AWS region for SES | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | AWS IAM access key | Your AWS key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key | Your AWS secret |
| `SES_FROM_EMAIL` | Sender email (verified in SES) | `noreply@yourdomain.com` |
| `SES_TO_EMAILS` | Recipients (comma-separated) | `admin@yourdomain.com,manager@yourdomain.com` |

### Frontend (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |

---

## 🆘 Support & Help

### Common Commands

```bash
# Start development
cd backend && npm run dev        # Backend
cd frontend && npm run dev       # Frontend

# Build for production
cd backend && npm run build      # Backend
cd frontend && npm run build     # Frontend

# View logs
pm2 logs eduwise-backend         # Backend logs
pm2 logs eduwise-frontend        # Frontend logs

# Restart services
pm2 restart all                  # Restart all
pm2 stop all                     # Stop all
pm2 delete all                   # Remove all

# Database backup
mongodump --db eduwise_feedback --out /backup/$(date +%Y%m%d)

# Database restore
mongorestore --db eduwise_feedback /backup/20240208/eduwise_feedback
```

### Check Application Status

```bash
# Check if backend is running
curl http://localhost:3001/health

# Check if frontend is running
curl http://localhost:3000

# Check MongoDB
mongosh --eval "db.adminCommand('ping')"

# Check PM2 processes
pm2 status
```

---

## 🎯 Quick Start Summary

```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Configure environment
cd backend && cp .env.example .env && nano .env
cd ../frontend && cp .env.local.example .env.local && nano .env.local

# 3. Start MongoDB
sudo systemctl start mongodb  # or mongod

# 4. Start backend (terminal 1)
cd backend && npm run dev

# 5. Start frontend (terminal 2)
cd frontend && npm run dev

# 6. Open browser
# http://localhost:3000
```

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🎉 You're All Set!

Your EduWise feedback form is now ready to collect valuable feedback from medical students!

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

**Questions?** Check the Troubleshooting section above or review your configuration files.

---

Made with ❤️ for EduWise
