# Simple Crypto Bot

A Next.js application with JWT authentication system.

## Features

- User authentication (signup/login)
- JWT-based session management  
- Protected API routes
- Supabase database integration

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (protected)
- `POST /api/auth/refresh` - Token refresh (protected)
- `GET /api/user/profile` - User profile (protected)

## Tech Stack

- Next.js 14.2.33
- TypeScript
- Supabase
- JWT Authentication
- bcryptjs for password hashing