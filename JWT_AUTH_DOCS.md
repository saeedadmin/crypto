# JWT Authentication System Documentation

## 🔐 Overview
Complete JWT-based authentication system with protected routes and middleware.

## 📁 New Files Created
- `src/app/api/auth/lib/jwt.ts` - JWT token management utilities
- `src/app/api/auth/lib/middleware.ts` - Authentication middleware
- `src/app/api/auth/logout/route.ts` - Logout endpoint (protected)
- `src/app/api/auth/refresh/route.ts` - Token refresh endpoint (protected)
- `src/app/api/user/profile/route.ts` - User profile endpoint (protected)

## 🔧 Environment Variables Added
Add to your Vercel deployment:
```
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_min_32_chars
```

## 📡 API Endpoints

### 1. Login (Updated)
`POST /api/auth/login`
**Response now includes JWT token:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T11:45:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. User Profile (Protected)
`GET /api/user/profile`
**Headers:**
```
Authorization: Bearer <your-jwt-token>
```
**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T11:45:00Z"
  }
}
```

### 3. Logout (Protected)
`POST /api/auth/logout`
**Headers:**
```
Authorization: Bearer <your-jwt-token>
```
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully. Please remove the token from client storage."
}
```

### 4. Refresh Token (Protected)
`POST /api/auth/refresh`
**Headers:**
```
Authorization: Bearer <your-jwt-token>
```
**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🛡️ Security Features

### JWT Token Properties
- **Expiry:** 7 days (configurable)
- **Issuer:** crypto-app
- **Audience:** crypto-app-users
- **Algorithm:** HS256

### Middleware Protection
- Automatic token validation
- User data injection into request
- Consistent error responses
- Token extraction from Authorization header

## 🧪 Testing Examples

### Login and Get Token
```bash
# 1. Login to get token
TOKEN=$(curl -s -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "Password123"}' \
  | jq -r '.token')

echo "Token: $TOKEN"
```

### Use Protected Routes
```bash
# 2. Get user profile
curl -X GET https://your-domain.vercel.app/api/user/profile \
  -H "Authorization: Bearer $TOKEN"

# 3. Refresh token
curl -X POST https://your-domain.vercel.app/api/auth/refresh \
  -H "Authorization: Bearer $TOKEN"

# 4. Logout
curl -X POST https://your-domain.vercel.app/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

## 🔨 Usage in New Protected Routes

```typescript
import { withAuth, AuthenticatedRequest } from '../auth/lib/middleware'

async function myProtectedHandler(request: AuthenticatedRequest) {
  // User data is available in request.user
  const userId = request.user.userId
  const userEmail = request.user.email
  
  // Your protected logic here
  return NextResponse.json({ message: "Protected data" })
}

export const GET = withAuth(myProtectedHandler)
```

## 📊 Status Codes
- `200` - Success
- `401` - Unauthorized (no token, invalid token, expired token)
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

## 🚀 What's Ready
✅ Complete authentication system
✅ JWT token generation and verification
✅ Protected route middleware
✅ Token refresh mechanism
✅ User profile management
✅ Secure logout process