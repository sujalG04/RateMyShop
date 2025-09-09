# Store Rating System

A full-stack web application for managing stores, users, and ratings with role-based access control.

## Features

### User Roles
- **System Administrator**: Manage users, stores, and view system statistics
- **Normal User**: Browse stores, submit ratings, and manage account
- **Store Owner**: View store ratings and customer feedback

### Key Functionalities
- JWT-based authentication
- Role-based access control
- CRUD operations for users, stores, and ratings
- Real-time rating system
- Responsive design with Tailwind CSS
- Form validation and error handling

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Context API for state management
- Fetch API for HTTP requests

### Backend
- Node.js with Express.js
- PostgreSQL database
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or pnpm

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE store_rating;
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=store_rating_DB
   DB_PASSWORD=your_password
   DB_PORT=5432
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   ```

5. **Initialize database schema:**
   ```bash
   psql -U postgres -d store_rating_DB -f models/schema.sql
   ```

6. **Start the backend server:**
   ```bash
   pm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies (from root directory):**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## Accounts


### Administrator
- **Email:** admin@example.com
- **Password:** Admin123!
- **Access:** Full system administration

### Store Owner
- **Email:** owner@example.com
- **Password:** Owner123!
- **Access:** Store management and ratings view

### Normal User
- **Email:** user@example.com
- **Password:** User123!
- **Access:** Store browsing and rating submission

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `PUT /api/auth/password` - Update password

### Users (Admin only)
- `GET /api/users` - Get all users with filters
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `GET /api/users/stats` - Get dashboard statistics

### Stores
- `GET /api/stores` - Get all stores with filters
- `POST /api/stores` - Create new store (Admin only)
- `GET /api/stores/my-stores` - Get stores by owner (Store Owner only)
- `GET /api/stores/:storeId/ratings` - Get store ratings (Store Owner only)

### Ratings (User only)
- `POST /api/ratings` - Submit or update rating
- `GET /api/ratings/my-ratings` - Get user's ratings

## Database Schema

### Users Table
- id (Primary Key)
- name (20-60 characters)
- email (Unique)
- password (Hashed)
- address (Max 400 characters)
- role (admin, user, store_owner)
- created_at, updated_at

### Stores Table
- id (Primary Key)
- name
- email (Unique)
- address (Max 400 characters)
- owner_id (Foreign Key to Users)
- created_at, updated_at

### Ratings Table
- id (Primary Key)
- user_id (Foreign Key to Users)
- store_id (Foreign Key to Stores)
- rating (1-5)
- created_at, updated_at
- Unique constraint on (user_id, store_id)

## Validation Rules

### User Registration/Creation
- **Name**: 20-60 characters
- **Email**: Valid email format
- **Password**: 8-16 characters, at least 1 uppercase letter and 1 special character
- **Address**: Maximum 400 characters

### Store Creation
- **Name**: Required
- **Email**: Valid email format, unique
- **Address**: Maximum 400 characters
- **Owner**: Must be a user with 'store_owner' role

### Rating Submission
- **Rating**: Integer between 1 and 5
- **Constraint**: One rating per user per store

## Features by Role

### System Administrator
- Dashboard with system statistics (total users, stores, ratings)
- User management (create, view, filter, sort)
- Store management (create, view, filter, sort)
- View user details with store ratings (for store owners)
- Password update functionality

### Normal User
- User registration and login
- Browse all stores with search and sort functionality
- Submit and update ratings (1-5 stars)
- View personal ratings history
- Password update functionality

### Store Owner
- Login access only (no registration)
- View owned stores with average ratings
- View detailed customer ratings for each store
- Dashboard showing rating statistics
- Password update functionality

## Security Features

- JWT-based authentication with token expiration
- Password hashing using bcryptjs
- Role-based access control middleware
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- CORS configuration for cross-origin requests

## Error Handling

- Comprehensive error messages for validation failures
- HTTP status codes for different error types
- Frontend error display with user-friendly messages
- Database connection error handling
- Authentication and authorization error handling

## Responsive Design

- Mobile-first approach with Tailwind CSS
- Responsive tables and forms
- Touch-friendly rating interface
- Optimized for various screen sizes
- Accessible UI components

## Development Notes

- Frontend uses React Context for global state management
- API client with centralized error handling
- Modular component structure for maintainability
- Clean separation between frontend and backend
- RESTful API design principles
- Database indexes for query optimization
- Row Level Security (RLS) ready schema design

## Production Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to cloud service (Heroku, AWS, etc.)
5. Configure CORS for production domain

### Frontend Deployment
1. Update API base URL for production
2. Build the application: `pnpm run build`
3. Deploy to static hosting (Vercel, Netlify, etc.)
4. Configure environment variables if needed

## Troubleshooting

### Common Issues
1. **Database Connection**: Verify PostgreSQL is running and credentials are correct
2. **CORS Errors**: Ensure backend CORS is configured for frontend domain
3. **JWT Errors**: Check JWT secret consistency between requests
4. **Validation Errors**: Review input validation rules and error messages
5. **Rating Submission**: Verify user authentication and store existence

### Development Tips
- Use browser developer tools for debugging API calls
- Check backend console for detailed error logs
- Verify database schema matches application expectations
- Test with different user roles to ensure proper access control