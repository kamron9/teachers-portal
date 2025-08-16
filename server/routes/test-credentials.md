# Test Credentials for Mock Authentication

## Available Test Users

### Student Account
- **Email**: `student@test.com`
- **Password**: `password123`
- **Role**: STUDENT
- **Name**: Ali Karimov

### Teacher Account  
- **Email**: `teacher@test.com`
- **Password**: `password123`
- **Role**: TEACHER
- **Name**: Madina Abdullayeva

### Admin Account
- **Email**: `admin@test.com`
- **Password**: `admin123`
- **Role**: ADMIN
- **Name**: Admin User

## API Endpoints

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@test.com",
  "password": "password123"
}
```

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@test.com",
  "password": "password123",
  "role": "STUDENT",
  "firstName": "Yangi",
  "lastName": "Foydalanuvchi"
}
```

### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer {accessToken}
```

### Logout
```bash
POST /api/auth/logout
Authorization: Bearer {accessToken}
```
