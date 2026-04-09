# FlowNote - Real-time Collaborative Note Taking

FlowNote is a production-quality full-stack web application that allows multiple users to create, edit, and collaborate on notes in real time.

## 🚀 Features

- **Authentication & Authorization**: Secure JWT-based auth with Role-Based Access Control (Admin, Editor, Viewer).
- **Notes Management**: Full CRUD operations for notes.
- **Real-Time Collaboration**: Live sync via Socket.io (see updates as they happen).
- **Activity tracking**: Track user actions (create, update, share, delete).
- **Search**: Fast note search by title and content.
- **Public Sharing**: Create read-only public links for non-authenticated users.
- **Admin System Intel**: Dedicated high-fidelity console for global user and activity monitoring.
- **Security UI**: Integrated "Show/Hide" password toggles across all forms.
- **Premium Design**: Dark-mode primary UI with glassmorphism and smooth animations.

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Vite, Lucide Icons, Vanilla CSS.
- **Backend**: Node.js, Express, TypeScript, Socket.io, Drizzle ORM.
- **Database**: PostgreSQL.

## 📂 Project Structure

```text
├── client/          # Frontend React application
│   ├── src/         # UI components, pages, and logic
├── server/          # Backend Express application
│   ├── src/
│   │   ├── constants/   # App constants and env config
│   │   ├── controllers/ # Request handlers
│   │   ├── db/          # Schema and Connection
│   │   ├── lib/         # Utilities (logger, asyncHandler, etc.)
│   │   ├── middlewares/ # Express middlewares
│   │   ├── routes/      # Registering routes
│   │   └── types/       # TypeScript definitions
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### 1. Backend Setup
1. `cd server`
2. `npm install`
3. Create a `.env` file based on the template:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://user:password@localhost:5432/flownote
   JWT_SECRET=your_secret_key
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_secure_password
   FRONTEND_URL=http://localhost:3000
   ```
5. Seed the Admin account:
   ```bash
   npm run db:seed
   ```
4. Run migrations (Drizzle):
   ```bash
   npm run db:push
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. `cd client`
2. `npm install`
3. Start the dev server:
   ```bash
   npm run dev
   ```
   *The client runs on port 3000 and proxies API calls to port 5000.*

## 📋 API Documentation

### Auth
- `POST /api/auth/register`: Create a new user.
- `POST /api/auth/login`: Get JWT token.

### Notes
- `GET /api/notes`: List all accessible notes.
- `POST /api/notes`: Create a new note.
- `GET /api/notes/:id`: Get note details (Public or Authenticated).
- `PUT /api/notes/:id`: Update note (Owner/Editor only).
- `DELETE /api/notes/:id`: Delete note (Owner only).
- `POST /api/notes/:id/collaborators`: Add/Update collaborator permissions.

### Activity
- `GET /api/notes/activity/all`: View recent activity logs.

## 🗄️ Database Schema

- **Users**: `id`, `email`, `password`, `role` (Enum).
- **Notes**: `id`, `title`, `content`, `ownerId`, `isPublic`, `timestamps`.
- **Collaborators**: `noteId`, `userId`, `permission` (Enum).
- **ActivityLogs**: `userId`, `noteId`, `action`, `timestamp`.

## 🌐 Deployment Instructions

- **Backend**: Deploy to **Railway.app** or **Render**. Connect your GitHub repo, set the `DATABASE_URL` and `JWT_SECRET` variables.
- **Frontend**: Deploy to **Vercel** or **Netlify**. Ensure the build command is `npm run build` and output directory is `dist`.

---
*Created with ❤️ by Adnan*
