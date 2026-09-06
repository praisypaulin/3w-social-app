# Mini Social Post Application — 3W Internship Task 1

A MERN stack app (MongoDB, Express, React, Node.js) replicating a simplified
version of the TaskPlanet Social page: signup/login, create posts (text
and/or image), a public feed, likes, and comments.

## Project structure

```
3w-social-app/
├── backend/     Express + MongoDB API
└── frontend/    React (Vite) app
```

## 1. Backend setup

```bash
cd backend
npm install
```

Create a file named `.env` in `backend/` (copy `.env.example` and fill in real values):

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/social_app?retryWrites=true&w=majority
JWT_SECRET=some_long_random_string
PORT=5000
CLIENT_URL=http://localhost:5173
```

Run it:

```bash
npm run dev
```

Server should print `MongoDB Connected` and `Server running on port 5000`.

## 2. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). Sign up, log in,
create a post, like it, comment on it.

By default the frontend talks to `http://localhost:5000/api`. To point it at
a deployed backend, create `frontend/.env` with:

```
VITE_API_URL=https://your-backend.onrender.com/api
```

## 3. Deploying

**Backend → Render**
1. Push this repo to GitHub.
2. On Render: New → Web Service → connect the repo → set root directory to `backend`.
3. Build command: `npm install` — Start command: `npm start`.
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (set this to your Vercel frontend URL once you have it).

**Frontend → Vercel**
1. Import the same repo on Vercel.
2. Set root directory to `frontend`.
3. Add environment variable `VITE_API_URL` = `https://<your-render-url>/api`.
4. Deploy.

**Database → MongoDB Atlas**
Already set up if you created your `MONGO_URI` above. Make sure Network
Access allows `0.0.0.0/0` so Render can reach it.

## Known limitation

Images are stored on the backend's local disk (`backend/uploads/`). Render's
free tier has an ephemeral filesystem, so uploaded images will be lost on
redeploy/restart. This is fine for a demo/submission but for a persistent
production app, swap `backend/config/upload.js` for a service like
Cloudinary (free tier available).

## Features implemented

- Signup / login with hashed passwords + JWT
- Create post: text, image, or both (matches spec — neither is mandatory alone)
- Public feed, paginated, newest first
- Like / unlike (toggles, tracks who liked)
- Comment (tracks who commented)
- Two MongoDB collections only: `users` and `posts` (likes/comments embedded in posts)
- Dark UI styled after the TaskPlanet Social page reference
