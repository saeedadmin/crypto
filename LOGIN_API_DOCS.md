# Login API Testing

## Endpoint
`POST /api/auth/login`

## Sample Request
```bash
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "YourPassword123"
  }'
```

## Sample Response (Success)
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T11:45:00Z"
  }
}
```

## Sample Response (Error)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Status Codes
- `200` - Login successful
- `400` - Invalid input (missing fields, invalid email format)
- `401` - Invalid credentials
- `500` - Server error

## Security Features
- Password verification using bcrypt
- Password hash never returned in response
- Consistent error messages for security
- Email format validation