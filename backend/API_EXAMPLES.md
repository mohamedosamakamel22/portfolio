# 📋 Photography Portfolio API - Complete Examples

## 🔐 Authentication APIs

### Login
```bash
curl -X POST 'http://localhost:3000/api/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "SaeedSekka@email.com",
    "password": "admin123"
  }'
```

### Register
```bash
curl -X POST 'http://localhost:3000/api/auth/register' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

## 🌐 Website APIs (Portfolio-Based)

### Get Portfolio Reviews
```bash
curl -X GET 'http://localhost:3000/api/website/685fc7250667f2db1bd7cfc7/reviews'
```

### Get Featured Reviews
```bash
curl -X GET 'http://localhost:3000/api/website/685fc7250667f2db1bd7cfc7/reviews/featured'
```

### Get Portfolio Albums
```bash
curl -X GET 'http://localhost:3000/api/website/685fc7250667f2db1bd7cfc7/albums'
```

### Search Albums
```bash
curl -X GET 'http://localhost:3000/api/website/685fc7250667f2db1bd7cfc7/albums/search?q=wedding'
```

### Get Portfolio Profile
```bash
curl -X GET 'http://localhost:3000/api/website/685fc7250667f2db1bd7cfc7/profile'
```

### Submit Contact Inquiry
```bash
curl -X POST 'http://localhost:3000/api/website/685fc7250667f2db1bd7cfc7/contact' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "message": "Interested in wedding photography",
    "eventType": "wedding",
    "eventDate": "2024-06-15"
  }'
```

## 🛠️ CMS APIs (Admin Only)

**Note:** All CMS endpoints require authentication. Include the Bearer token in all requests:
```bash
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

### Reviews Management
```bash
# Get all reviews
curl -X GET 'http://localhost:3000/api/cms/reviews' \
  -H 'Authorization: Bearer YOUR_TOKEN'

# Create review
curl -X POST 'http://localhost:3000/api/cms/reviews' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "clientName": "Alice Johnson",
    "title": "Amazing Wedding Photography",
    "content": "Professional and creative work!",
    "rating": 5,
    "projectType": "wedding"
  }'
```

### Albums Management
```bash
# Get all albums
curl -X GET 'http://localhost:3000/api/cms/albums' \
  -H 'Authorization: Bearer YOUR_TOKEN'

# Create album
curl -X POST 'http://localhost:3000/api/cms/albums' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Summer Portraits",
    "description": "Beautiful summer portrait session",
    "category": "portrait",
    "projectType": "portrait"
  }'
```

### Profile Management
```bash
# Get all profiles
curl -X POST http://localhost:3000/api/albums \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Wedding Photography",
    "description": "Beautiful wedding moments",
    "category": "Wedding",
    "projectType": "Commercial"
  }'
``` 