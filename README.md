# Campus Connect 🎓

Campus Connect is a next-generation platform for students, clubs, and administrators to seamlessly manage campus life, engage with one another, and build a vibrant university community.

## 🌟 Key Features

1. **Authentication & Authorization**
   - Secure login/registration with custom sliding-window Redis rate limiting.
   - JWT-based session management with CSRF protection (Double Submit Cookie).
   - Role-based access control (Student, Organizer, Admin).

2. **Student & Club Profiles**
   - Detailed student profiles showcasing skills, department, and points.
   - Beautiful club pages with active memberships.
   - **Automated Alumni Transition:** Nightly Cron jobs that upgrade seniors to alumni status based on their batch year.

3. **Content Discovery (Events & Announcements)**
   - View ongoing announcements and discover upcoming events.
   - Optimized for full-text MongoDB search indexes.

4. **Real-time Discussion Forums**
   - Powered by **Socket.io** for real-time WebSockets.
   - Optimistic UI updates with TanStack Query.
   - Live thread activity and instant messaging for students.

5. **Cloud Media Uploads**
   - Direct integration with **Cloudinary** using Multer for handling profile pictures, event banners, and document uploads.

6. **Points & Rewards (QR Code System)**
   - Scan dynamic QR codes (powered by short-lived JWTs) to claim attendance points.
   - HTML5 Camera integration for mobile scanning.
   - Gamified Point Tiers (Bronze, Silver, Gold).

7. **Admin Analytics Dashboard**
   - Live overview of total users, active clubs, and platform engagement.
   - Beautiful interactive charts powered by **Recharts**.
   - Live student leaderboard.

## 🛠️ Technology Stack

- **Frontend:** React (Vite), Tailwind CSS (v3), Zustand, TanStack Query (React Query), Lucide Icons, Recharts, React Router v6.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Redis (Cloud), Socket.io, JSON Web Tokens (JWT), Cloudinary.
- **Tooling:** Nodemon, Concurrently.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Cluster URI
- Redis Cloud URI
- Cloudinary Account

### Installation

1. Clone this repository or navigate to the project directory:
   ```bash
   cd campus-platform
   ```

2. Install dependencies for the root, client, and server:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `server` directory and add the following:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   MONGODB_URI=your_mongodb_connection_string
   REDIS_URL=your_redis_connection_string
   JWT_ACCESS_SECRET=your_super_secret_access_key
   JWT_REFRESH_SECRET=your_super_secret_refresh_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Seed the Database (Optional but recommended for demo):
   ```bash
   cd server
   node seed.js
   ```

5. Run the Application:
   From the root folder (`campus-platform`), run:
   ```bash
   npm run dev
   ```
   This will start both the React frontend and the Express backend concurrently.

### 🌐 Accessing the App
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Demo Credentials:** `demo@campus.edu` / `22582999`

---
*Built with modern web standards and responsive design in mind.*
