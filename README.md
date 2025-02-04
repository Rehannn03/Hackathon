# Hackathon Management System


## 🚀 Introduction
The **Hackathon Management System** is a powerful and efficient platform designed to streamline the organization and execution of hackathons. With features like user check-in, leaderboard tracking, team management, and role-based access control, this system ensures a smooth experience for participants, judges, and admins.

🔗 **Frontend Repository:** [Hackathon Frontend](https://github.com/rsayyed591/Hack-Management-Frontend)

## 🎯 Features

✅ **Role-based Access Control (RBAC)** – Manage permissions for Super Admins, Admins, Judges, and Participants.  
✅ **Live Leaderboard** – Track participant scores in real-time.  
✅ **QR Code Check-in System** – Simplifies user authentication and attendance tracking.  
✅ **Team Management** – Create, assign, and modify teams dynamically.  
✅ **Judge Assignment Module** – Allocate judges to specific teams or tasks seamlessly.  
✅ **Certificate Generation** – Automate the generation of participant and winner certificates.  
✅ **Food Distribution Management** – Track and validate meal distribution using QR codes.  
✅ **Redis Caching** – Implements Redis for session management and data caching to enhance performance.  

## 🏗️ Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Prisma ORM, Redis
- **Frontend:** React, Tailwind CSS, Vite
- **Authentication:** JWT-based Authentication
- **Deployment:** Vercel, Railway (for database & Redis)

## 🏢 System Architecture

```
├── router/                  # API Route Handlers
├── controllers/             # Business Logic
├── middlewares/             # Authentication & Validation Middleware
├── models/                  # Database Models
├── utils/                   # Utility Functions
├── public/                  # Static Assets
├── index.js                 # Entry Point
├── package.json             # Dependencies
├── vercel.json              # Deployment Configuration
```

## 📌 User Roles & Permissions

### 🛡️ Super Admin
- Full access to all system features.
- Creates and manages hackathons.
- Assigns admins and judges.
- Monitors entire event lifecycle.

![pro1](https://github.com/user-attachments/assets/e5e663aa-3373-488b-826e-50ef5d33535f)
![pro 2](https://github.com/user-attachments/assets/fe3a1ab0-57c2-42ad-ab98-7ebb851b7272)
### 🔧 Admin
- Manages participant registrations.
- Oversees team formations and submissions.
- Handles event logistics and food distribution.

![pro 3](https://github.com/user-attachments/assets/70e298c1-73b8-4d4b-8571-f1fc2637035f)
![pro 4](https://github.com/user-attachments/assets/0fba06f8-f32c-4b5c-8b93-33506a54e8a6)
![pro 5](https://github.com/user-attachments/assets/f7f0bd77-f467-4717-812b-7e0d2cc1d57c)
### 👨‍⚖️ Judge
- Reviews project submissions.
- Assigns scores to teams.
- Provides feedback on projects.

![pro 8](https://github.com/user-attachments/assets/0aebbe25-3580-49c3-a923-835ef15f332f)
![pro 9](https://github.com/user-attachments/assets/5add2fbb-df87-41cf-9c36-2c6fb3487e27)

### 👨‍💻 Participant
- Registers for the hackathon.
- Submits projects within deadlines.
- Tracks team progress via leaderboard.

![pro 6](https://github.com/user-attachments/assets/f9de7c4a-9423-4859-ac35-da621f076507)
![pro 7](https://github.com/user-attachments/assets/bc4b04a4-ce85-4f83-9410-83683955e9e6)
## 🔧 Installation & Setup

1️⃣ **Clone the Repository:**
```bash
   git clone https://github.com/Rehannn03/Hackathon.git
   cd Hackathon
```

2️⃣ **Install Dependencies:**
```bash
   npm install
```

3️⃣ **Setup Environment Variables:** (Create a `.env` file and configure your variables)
```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
REDIS_URL=your_redis_url
```

4️⃣ **Run the Server:**
```bash
   npm run dev
```

## 📡 API Endpoints

| Method | Endpoint             | Description                     |
|--------|----------------------|---------------------------------|
| GET    | `/api/users`         | Fetch all users                |
| POST   | `/api/auth/login`    | Authenticate user               |
| POST   | `/api/teams/create`  | Create a new team               |
| GET    | `/api/leaderboard`   | Get leaderboard data            |
| POST   | `/api/judging/score` | Submit project scores           |

📜 **Full API Documentation:** [API Docs](path/to/api_docs.md)

## 📌 Future Enhancements

🔹 AI-powered project evaluation.  
🔹 Blockchain-based certificate issuance.  
🔹 Advanced analytics for hackathon insights.  

## 🏆 Contributors

👨‍💻 **Backend Developer:** [Rehan Shah](https://github.com/Rehannn03)  
🎨 **Frontend Developer:** [Rehan Sayyed](https://github.com/rsayyed591)  










---
*🚀 Happy Hacking!*

