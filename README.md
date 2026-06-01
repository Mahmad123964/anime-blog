# Anime Blog - Full Stack Website

A professional anime blog website with user authentication, admin panel, character gallery, blog posts, and beautiful animations powered by GSAP, Framer Motion, and Three.js.

## Features

✨ **Frontend:**
- Next.js 14 for SSR and performance
- Beautiful animations with GSAP, Framer Motion & Three.js
- Responsive design (Mobile, Tablet, Desktop)
- User authentication (Login/Signup)
- Character gallery with image uploads
- Blog posts with comments
- Search functionality
- Rating/voting system
- Contact form

🔧 **Backend:**
- Node.js + Express API
- MongoDB for database
- JWT authentication
- Admin panel for managing content
- Image upload to Cloudinary
- Rate limiting for scalability
- Socket.io for real-time features

📊 **Performance & Scalability:**
- Designed to handle 500,000+ concurrent users
- Compression enabled
- Rate limiting
- CORS configuration
- Load balancing ready

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Running the Project

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

## Project Structure

```
anime-blog/
├── pages/               # Next.js pages
├── components/          # React components
├── public/             # Static files
├── styles/             # CSS files
├── server.js           # Express server
├── models/             # MongoDB schemas
├── routes/             # API routes
├── middleware/         # Auth & validation
└── utils/              # Helper functions
```

## Technologies

- **Frontend:** Next.js, React, GSAP, Framer Motion, Three.js
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT
- **File Storage:** Cloudinary
- **Real-time:** Socket.io

## License

MIT