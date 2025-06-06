# EchoTune FullStack Music Application 🎵💙
A modern fullstack music streaming platform with real-time features, user authentication, admin dashboard and multple themes. Built with React, TypeScript , Express, MongoDB, and Socket.

## 🌐 Live Demo

Experience EchoTune live: [https://echotune-i7jx.onrender.com/](https://echotune-i7jx.onrender.com/)

## ✨ Features

- Song Playback 🎧: Stream songs with a sleek music player interface.
- Playlist Management 📚: Create, update, and delete personalized playlists.
- User Authentication 🔒: Secure sign-in with Clerk for seamless user management.
- Admin Dashboard 🛠️: Admins can manage songs and albums with ease.
- Real-time Chat 💬: Connect with friends via a Socket.IO-powered chat system.
- Responsive Design 📱: Optimized for both desktop and mobile devices.
- Theme Customization 🌈: Switch between light, dark, and other themes for a personalized experience.
- Cloudinary Integration ☁️: Upload and manage media files securely.
- MongoDB Database 🗄️: Store and retrieve songs, albums, and user data efficiently.
- animations ❤️‍🔥 : Beautiful animations made with framer motion.


## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white) - JavaScript library for building user interfaces  
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white) - Typed JavaScript superset  
![TanStack Query](https://img.shields.io/badge/-TanStack_Query-FF4154?logo=reactquery&logoColor=white) - Server state management  
![Zustand](https://img.shields.io/badge/-Zustand-764ABC?logo=redux&logoColor=white) - State management solution  
![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white) - Utility-first CSS framework  
![Framer Motion](https://img.shields.io/badge/-Framer_Motion-0055FF?logo=framer&logoColor=white) - Animation library for React  

### Backend
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white) - JavaScript runtime  
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white) - Typed JavaScript superset
![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white) - Web application framework  
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white) - NoSQL database  
![Socket.io](https://img.shields.io/badge/-Socket.io-010101?logo=socketdotio&logoColor=white) - Real-time communication  
![Cloudinary](https://img.shields.io/badge/-Cloudinary-3448C5?logo=cloudinary&logoColor=white) - Media management  

### Authentication
![Clerk](https://img.shields.io/badge/-Clerk-3D3D3D?logo=clerk&logoColor=white) - User authentication and management  

## 🌈 Theming

EchoTune comes with multiple themes to suit your mood:

- **Light** ☀️ - Bright and clean default theme
- **Dark** 🌙 - Easy on the eyes night mode
- **Forest** 🌲 - Nature-inspired green palette  
- **Halloween** 🎃 - Spooky orange and black colors
- **Retro** 📺 - Vintage 80s inspired scheme
- **Emerald** 💎 - Elegant green and gold combination
- **Night** 🌌 - Deep blue with purple accents

Toggle themes using the palette icon (<Palette className="w-5 h-5" />) in the top navigation bar. Your theme preference is saved automatically!

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed and configured :

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas/database) account)
- [Cloudinary](https://cloudinary.com/) account (for media uploads)
- [Clerk](https://clerk.com/) account (for authentication)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/amirrajj-dev/echoTune.git
   cd EchoTune
   ```
2. **Install dependencies**:
   ```bash
   npm run build
   ```
3. **Set up environment variables:Create a .env file in the root directory and add the following**:
## 🔧 Environment Variables Setup

Create a `.env` file in the root directory and add the following variables:

```bash
# Frontend Configuration
FRONTEND_URL=http://localhost:5173

# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=your_mongodb_connection_string

# Admin Configuration
ADMIN_EMAIL=your_admin_email

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

4. **Run The Appplication** :

   ```bash
   npm run start
   ```

Built with ❤️ by Amirhosein Rajaei.
