# Social Media Feed Clone

A full-stack social media application built with Node.js, Express, and MongoDB. This project provides a complete social networking experience with user authentication, post creation, commenting, and following features.

## 🚀 Features

✅ **User Authentication**
- User registration and login
- JWT token-based authentication
- Secure password hashing with bcryptjs

✅ **Post Management**
- Create, edit, and delete posts
- Add images to posts
- Like and unlike posts
- View post engagement metrics

✅ **Comments System**
- Add comments to posts
- Like comments
- Delete comments
- Nested comment display

✅ **User Interactions**
- Follow/unfollow users
- View user profiles
- Explore suggested users
- User statistics (followers, following)

✅ **Responsive Design**
- Mobile-friendly interface
- Smooth animations and transitions
- Modern UI with intuitive navigation

## 📋 Prerequisites

Before running this project, make sure you have:
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/Rishabhkumar-0914/social-media-feed.git
cd social-media-feed
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-media-feed
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

## 🗄️ Database Setup

### MongoDB Local Setup
```bash
# Start MongoDB service
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your MongoDB Atlas connection string
```

## 🏃 Running the Application

### Start the server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Access the frontend
Open your browser and navigate to:
```
http://localhost:5000
```

## 📁 Project Structure

```
social-media-feed/
├── models/
│   ├── User.js          # User schema and model
│   ├── Post.js          # Post schema and model
│   └── Comment.js       # Comment schema and model
├── routes/
│   ├── auth.js          # Authentication endpoints
│   ├── users.js         # User endpoints
│   ├── posts.js         # Post endpoints
│   └── comments.js      # Comment endpoints
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── public/
│   ├── index.html       # Frontend HTML
│   ├── styles.css       # Frontend styles
│   └── script.js        # Frontend JavaScript
├── server.js            # Express server setup
├── .env                 # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies
└── README.md           # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile
- `POST /api/users/:userId/follow` - Follow a user
- `POST /api/users/:userId/unfollow` - Unfollow a user

### Posts
- `POST /api/posts` - Create a new post
- `GET /api/posts` - Get all posts
- `GET /api/posts/feed` - Get personalized feed
- `GET /api/posts/:postId` - Get single post
- `PUT /api/posts/:postId` - Update post
- `DELETE /api/posts/:postId` - Delete post
- `POST /api/posts/:postId/like` - Like a post
- `POST /api/posts/:postId/unlike` - Unlike a post

### Comments
- `POST /api/comments/:postId` - Add comment to post
- `GET /api/comments/:postId` - Get comments for post
- `POST /api/comments/:commentId/like` - Like a comment
- `POST /api/comments/:commentId/unlike` - Unlike a comment
- `DELETE /api/comments/:commentId` - Delete comment

## 🛠️ Technologies Used

**Backend:**
- Node.js - JavaScript runtime
- Express.js - Web framework
- MongoDB - NoSQL database
- Mongoose - MongoDB object modeling
- JWT - Authentication
- bcryptjs - Password hashing
- CORS - Cross-origin resource sharing

**Frontend:**
- HTML5 - Markup
- CSS3 - Styling
- JavaScript (Vanilla) - Interactivity
- Font Awesome - Icons

## 💡 Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a post
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "content": "Hello, this is my first post!",
    "image": "https://example.com/image.jpg"
  }'
```

### Follow a user
```bash
curl -X POST http://localhost:5000/api/users/USER_ID/follow \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔐 Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Authorization**: Protected routes require valid JWT tokens
- **Input Validation**: All user inputs are validated
- **CORS**: Cross-origin requests are restricted

## 📱 Frontend Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Feed updates dynamically
- **User Profile**: View and edit user information
- **Post Management**: Create, edit, and delete posts
- **Social Features**: Follow users, like posts, and comment
- **Suggested Users**: Discover and follow new users

## 🚀 Deployment

### Heroku Deployment
1. Install Heroku CLI
2. Create Heroku app: `heroku create app-name`
3. Set environment variables: `heroku config:set KEY=VALUE`
4. Deploy: `git push heroku main`

### Vercel (Frontend only)
1. Move `public` folder contents to a separate repository
2. Deploy to Vercel from GitHub

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support and questions, please open an issue on the GitHub repository.

## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Direct messaging
- [ ] Post search functionality
- [ ] Hashtags support
- [ ] Image upload (AWS S3)
- [ ] User verification
- [ ] Post scheduling
- [ ] Analytics dashboard

---

**Made with ❤️ by Rishabh Kumar**

Repository: https://github.com/Rishabhkumar-0914/social-media-feed
