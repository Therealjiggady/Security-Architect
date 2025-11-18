# Broke & Beauty - API Reference

Complete API documentation for the Broke & Beauty e-commerce platform backend.

## 📋 Table of Contents
- [Base Information](#base-information)
- [Authentication](#authentication)
- [Products](#products)
- [Users](#users)
- [Cart](#cart)
- [Wishlist](#wishlist)
- [Orders](#orders)
- [Chat](#chat)
- [Size Recommender](#size-recommender)
- [Payments](#payments)
- [WebSocket Connection](#websocket-connection)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## 🔗 Base Information

### Base URL
```
Development: http://localhost:8000
Production: https://your-backend.onrender.com
```

### Interactive Documentation
- **Swagger UI:** `/docs` - Interactive API documentation
- **ReDoc:** `/redoc` - Alternative documentation format

### Content Types
- **Request:** `application/json`, `multipart/form-data`
- **Response:** `application/json`

### Authentication
Most endpoints require JWT Bearer token authentication:
```http
Authorization: Bearer <your_jwt_token>
```

## 🔐 Authentication

### Register User
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "full_name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "user",
  "created_at": "2025-11-18T12:00:00Z"
}
```

**Errors:**
- `400` - Email already registered
- `400` - Invalid password format

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Errors:**
- `401` - Invalid email or password

## 🛍️ Products

### Get All Products
```http
GET /products/
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Premium T-Shirt",
    "description": "High-quality cotton t-shirt",
    "sku": "TSH001",
    "price": 29.99,
    "image_url": "/static/images/tshirt.jpg",
    "created_at": "2025-11-18T12:00:00Z",
    "variants": [
      {
        "id": 1,
        "product_id": 1,
        "size": "M",
        "color": "Blue",
        "stock": 50
      }
    ]
  }
]
```

### Create Product (Admin Only)
```http
POST /products/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "sku": "PROD001",
  "price": 49.99,
  "image_url": "https://example.com/image.jpg"
}
```

**Response (200 OK):**
```json
{
  "id": 2,
  "name": "New Product",
  "description": "Product description",
  "sku": "PROD001",
  "price": 49.99,
  "image_url": "https://example.com/image.jpg",
  "created_at": "2025-11-18T12:00:00Z",
  "variants": []
}
```

**Errors:**
- `401` - Authentication required
- `403` - Admin privileges required

### Update Product (Admin Only)
```http
PUT /products/{product_id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 59.99
}
```

**Errors:**
- `404` - Product not found
- `401` - Authentication required
- `403` - Admin privileges required

### Upload Product Image (Admin Only)
```http
POST /products/{product_id}/upload-image
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

file: <image_file.jpg>
```

**Response (200 OK):**
```json
{
  "message": "Image uploaded successfully",
  "image_url": "/static/images/uuid-filename.jpg"
}
```

**Supported formats:** JPEG, PNG
**Errors:**
- `400` - Invalid file type
- `404` - Product not found
- `500` - Failed to save image

## 👤 Users

### Get Current User
```http
GET /users/me
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "user",
  "created_at": "2025-11-18T12:00:00Z"
}
```

### Update User Profile
```http
PUT /users/me
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "full_name": "John Updated Doe",
  "email": "newemail@example.com"
}
```

## 🛒 Cart

### Get User Cart
```http
GET /cart/
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "product_name": "Premium T-Shirt",
      "quantity": 2,
      "price": 29.99,
      "total": 59.98
    }
  ],
  "total_items": 2,
  "total_amount": 59.98
}
```

### Add Item to Cart
```http
POST /cart/items
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2,
  "variant_id": 1
}
```

### Update Cart Item
```http
PUT /cart/items/{item_id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "quantity": 3
}
```

### Remove Cart Item
```http
DELETE /cart/items/{item_id}
Authorization: Bearer <jwt_token>
```

## ❤️ Wishlist

### Get User Wishlist
```http
GET /wishlist/
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "product_id": 1,
    "product": {
      "id": 1,
      "name": "Premium T-Shirt",
      "price": 29.99,
      "image_url": "/static/images/tshirt.jpg"
    },
    "added_at": "2025-11-18T12:00:00Z"
  }
]
```

### Add to Wishlist
```http
POST /wishlist/
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "product_id": 1
}
```

### Remove from Wishlist
```http
DELETE /wishlist/{product_id}
Authorization: Bearer <jwt_token>
```

## 📦 Orders

### Get User Orders
```http
GET /orders/
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "status": "pending",
    "total_amount": 89.97,
    "created_at": "2025-11-18T12:00:00Z",
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "product_name": "Premium T-Shirt",
        "quantity": 3,
        "price": 29.99
      }
    ]
  }
]
```

### Create Order
```http
POST /orders/
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "payment_method": "stripe",
  "shipping_address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip_code": "12345"
  }
}
```

### Get Order Details
```http
GET /orders/{order_id}
Authorization: Bearer <jwt_token>
```

## 💬 Chat

### Get Chat History
```http
GET /chat/history?room=general&limit=50
```

**Parameters:**
- `room` (required): `general` or `support`
- `limit` (optional): Number of messages (1-100, default: 50)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "room": "general",
    "user_id": 1,
    "username": "John Doe",
    "message": "Hello everyone!",
    "created_at": "2025-11-18T12:00:00Z"
  }
]
```

### Delete Message (Admin Only)
```http
DELETE /chat/messages/{message_id}
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "message": "Message deleted successfully",
  "id": 1,
  "room": "general"
}
```

**Errors:**
- `401` - Authentication required
- `403` - Admin privileges required
- `404` - Message not found

## 📏 Size Recommender

### Get Size Recommendation
```http
POST /sizing/recommend
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "product_id": 1,
  "height_cm": 175,
  "weight_kg": 70,
  "body_type": "athletic",
  "fit_preference": "regular"
}
```

**Response (200 OK):**
```json
{
  "recommended_size": "M",
  "confidence": 0.85,
  "alternatives": [
    {
      "size": "L",
      "confidence": 0.65,
      "reason": "For looser fit"
    }
  ]
}
```

### Update Size Chart
```http
PUT /sizing/charts/{product_id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "sizes": {
    "S": {"chest": 90, "waist": 80, "hip": 88},
    "M": {"chest": 95, "waist": 85, "hip": 93},
    "L": {"chest": 100, "waist": 90, "hip": 98}
  }
}
```

## 💳 Payments

### Process Payment
```http
POST /payments/process
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "order_id": 1,
  "payment_method": "stripe",
  "payment_data": {
    "token": "tok_visa"
  }
}
```

### Get Payment Status
```http
GET /payments/status/{payment_id}
Authorization: Bearer <jwt_token>
```

## 🔌 WebSocket Connection

### Chat WebSocket
```javascript
// Connect to chat room
const token = localStorage.getItem('authToken');
const ws = new WebSocket(`ws://localhost:8000/chat/ws/general?token=${token}`);

// Message types to send
ws.send(JSON.stringify({
  type: "message",
  content: "Hello everyone!"
}));

ws.send(JSON.stringify({
  type: "typing",
  is_typing: true
}));

// Message types received
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch(data.type) {
    case "message":
      console.log("New message:", data.data);
      break;
    case "typing":
      console.log("Typing:", data.data);
      break;
    case "user_joined":
      console.log("User joined:", data.data);
      break;
    case "user_left":
      console.log("User left:", data.data);
      break;
    case "delete":
      console.log("Message deleted:", data.data);
      break;
    case "error":
      console.log("Error:", data.data);
      break;
  }
};
```

**Available Rooms:**
- `general` - General discussion
- `support` - Customer support

**Authentication:** JWT token required via query parameter

## 🚨 Error Handling

### Standard Error Response
```json
{
  "detail": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes
- `200` - OK: Request successful
- `201` - Created: Resource created successfully
- `400` - Bad Request: Invalid request data
- `401` - Unauthorized: Authentication required
- `403` - Forbidden: Insufficient privileges
- `404` - Not Found: Resource not found
- `422` - Unprocessable Entity: Validation error
- `500` - Internal Server Error: Server error

### Validation Error Response (422)
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## ⏱️ Rate Limiting

### Limits by Endpoint
- **Authentication**: 5 requests per minute per IP
- **Product Creation**: 10 requests per minute per user
- **Chat Messages**: 60 messages per minute per user
- **File Uploads**: 5 requests per minute per user

### Rate Limit Headers
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1637000000
```

### Rate Limit Exceeded Response (429)
```json
{
  "detail": "Rate limit exceeded. Try again later.",
  "retry_after": 60
}
```

## 🔧 Development Tools

### Health Check
```http
GET /health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "environment": "development",
  "version": "1.0.0",
  "demo_mode": false,
  "maintenance_mode": false,
  "features": {
    "registration": true,
    "admin_registration": false
  }
}
```

### API Root
```http
GET /
```

**Response (200 OK):**
```json
{
  "message": "Welcome to Broke & Beauty",
  "version": "1.0.0",
  "docs": "/docs",
  "health": "/health"
}
```

## 📝 Request/Response Examples

### Complete Product Creation Flow
```javascript
// 1. Authentication
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'adminpass123'
  })
});
const { access_token } = await loginResponse.json();

// 2. Create Product
const productResponse = await fetch('/products/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    name: 'Premium Hoodie',
    description: 'Comfortable cotton blend hoodie',
    sku: 'HOD001',
    price: 79.99
  })
});
const product = await productResponse.json();

// 3. Upload Product Image
const formData = new FormData();
formData.append('file', imageFile);

const imageResponse = await fetch(`/products/${product.id}/upload-image`, {
  method: 'POST',
  headers: {'Authorization': `Bearer ${access_token}`},
  body: formData
});
```

### Complete Shopping Flow
```javascript
// 1. Get products
const products = await fetch('/products/').then(r => r.json());

// 2. Add to cart (authenticated)
await fetch('/cart/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({
    product_id: products[0].id,
    quantity: 2
  })
});

// 3. Get cart total
const cart = await fetch('/cart/', {
  headers: {'Authorization': `Bearer ${userToken}`}
}).then(r => r.json());

// 4. Create order
const order = await fetch('/orders/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({
    payment_method: 'stripe',
    shipping_address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip_code: '12345'
    }
  })
}).then(r => r.json());
```

## 🔒 Security Considerations

### Authentication
- JWT tokens expire after 24 hours
- Use HTTPS in production
- Store tokens securely (httpOnly cookies recommended)

### Input Validation
- All inputs are validated using Pydantic schemas
- SQL injection protection via SQLAlchemy ORM
- XSS protection through proper JSON encoding

### File Uploads
- Only JPEG and PNG images allowed
- File size limits enforced
- Secure file storage with UUID naming

### Rate Limiting
- Prevents abuse and DOS attacks
- Per-IP and per-user limits
- Sliding window rate limiting

---

**For interactive API exploration, visit `/docs` on your running server.**

*Last updated: November 2025*