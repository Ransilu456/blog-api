# Blog API - Clean Architecture Backend

A production-ready blog application backend built with **Clean Architecture** principles, TypeScript, and Express.js. This implementation demonstrates proper separation of concerns across domain, application, infrastructure, and interface layers.

## 🏗️ Architecture Overview

This project follows **Clean Architecture** (also known as Hexagonal Architecture or Ports and Adapters), ensuring:

- **Independence from frameworks**: Business logic doesn't depend on Express or any external library
- **Testability**: Each layer can be tested in isolation
- **Independence from UI**: The same business logic can serve REST API, GraphQL, or any other interface
- **Independence from Database**: Currently uses in-memory storage, easily replaceable with PostgreSQL, MongoDB, etc.
- **Maintainability**: Clear separation of concerns makes the codebase easy to understand and modify

### Directory Structure

```
src/
├── domain/                  # Enterprise Business Rules
│   ├── entities/           # Core business entities (User, Post, Comment)
│   ├── value-objects/      # Immutable value objects (Email, PostId, UserId)
│   ├── errors/             # Domain-specific errors
│   └── repositories/       # Repository interfaces (contracts)
│
├── application/            # Application Business Rules
│   ├── use-cases/         # Use case implementations (business workflows)
│   ├── services/          # Application services (AuthService)
│   └── dto/               # Data Transfer Objects
│
├── infrastructure/         # Frameworks & Drivers
│   ├── repositories/      # Repository implementations (in-memory)
│   └── auth/              # Authentication middleware (JWT)
│
├── interfaces/            # Interface Adapters
│   └── http/
│       └── controllers/   # HTTP request handlers
│
└── main/                  # Composition Root
    ├── app.ts            # Express app configuration
    ├── routes.ts         # Route definitions
    ├── container.ts      # Dependency injection container
    └── server.ts         # Application entry point
```

## 🚀 Features

- **User Management**: Registration, login with JWT authentication
- **Blog Posts**: Full CRUD operations with authorization
- **Comments**: Create and retrieve comments on posts
- **Clean Architecture**: Proper layer separation and dependency inversion
- **Type Safety**: Full TypeScript implementation with strict mode
- **Security**: JWT-based authentication, password hashing with bcrypt
- **CORS Support**: Configurable cross-origin resource sharing
- **Error Handling**: Comprehensive error handling with custom domain errors

## 📋 Prerequisites

- **Node.js** >= 16.x
- **npm** or **yarn**

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Blog
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the following:
   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:3000`

## 📦 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run clean` - Clean build directory

## 🔌 API Endpoints

### Health Check

- **GET** `/api/health` - Check API status

### User Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/users/register` | No | Register a new user |
| POST | `/api/users/login` | No | Login and get JWT token |
| GET | `/api/users/profile` | Yes | Get current user profile |

### Post Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/posts` | Yes | Create a new post |
| GET | `/api/posts` | No | Get all posts |
| GET | `/api/posts/:id` | No | Get a specific post |
| PUT | `/api/posts/:id` | Yes | Update a post (author only) |
| DELETE | `/api/posts/:id` | Yes | Delete a post (author only) |

### Comment Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/posts/:postId/comments` | Yes | Create a comment on a post |
| GET | `/api/posts/:postId/comments` | No | Get all comments for a post |

## 📝 API Usage Examples

### 1. Register a User

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "johndoe",
    "password": "securePassword123"
  }'
```

**Response**:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-here",
    "email": "john@example.com",
    "username": "johndoe",
    "createdAt": "2026-01-26T16:00:00.000Z"
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Response**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "john@example.com",
    "username": "johndoe"
  }
}
```

### 3. Create a Post (Authenticated)

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post. It contains valuable information.",
    "published": true
  }'
```

**Response**:
```json
{
  "message": "Post created successfully",
  "post": {
    "id": "post-uuid",
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post...",
    "authorId": "user-uuid",
    "published": true,
    "createdAt": "2026-01-26T16:05:00.000Z",
    "updatedAt": "2026-01-26T16:05:00.000Z"
  }
}
```

### 4. Get All Posts

```bash
curl http://localhost:3000/api/posts
```

### 5. Create a Comment (Authenticated)

```bash
curl -X POST http://localhost:3000/api/posts/POST_ID/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "Great post! Very informative."
  }'
```

## 🏛️ Clean Architecture Layers Explained

### 1. Domain Layer (Innermost)
- **Entities**: Core business objects (`User`, `Post`, `Comment`)
- **Value Objects**: Immutable objects representing domain concepts (`Email`, `PostId`)
- **Repository Interfaces**: Contracts for data access (no implementation)
- **Domain Errors**: Business rule violations

**Key Principle**: No dependencies on outer layers. Pure business logic.

### 2. Application Layer
- **Use Cases**: Application-specific business rules (e.g., `CreatePostUseCase`)
- **DTOs**: Data structures for transferring data between layers
- **Services**: Application services like authentication

**Key Principle**: Orchestrates domain entities to fulfill use cases.

### 3. Infrastructure Layer
- **Repository Implementations**: Concrete implementations (currently in-memory)
- **External Services**: Third-party integrations
- **Authentication**: JWT middleware

**Key Principle**: Implements interfaces defined in domain layer.

### 4. Interface Layer
- **Controllers**: Handle HTTP requests/responses
- **Validators**: Input validation
- **Presenters**: Format output data

**Key Principle**: Adapts external requests to application use cases.

### 5. Main Layer (Outermost)
- **Dependency Injection**: Wires all dependencies together
- **Application Setup**: Express configuration
- **Entry Point**: Server startup

**Key Principle**: Composition root where everything is assembled.

## 🔒 Authentication

This API uses **JWT (JSON Web Tokens)** for authentication:

1. Register or login to receive a JWT token
2. Include the token in the `Authorization` header for protected endpoints:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```
3. Tokens expire after 24 hours (configurable via `JWT_EXPIRES_IN`)

## 🗄️ Data Storage

Currently uses **in-memory storage** for simplicity. Data is lost when the server restarts.

### Migrating to a Real Database

To switch to PostgreSQL, MongoDB, or any other database:

1. Create new repository implementations in `src/infrastructure/repositories/`
2. Implement the same interfaces from `src/domain/repositories/`
3. Update the container in `src/main/container.ts` to use new implementations
4. **No changes needed** in domain, application, or interface layers!

This is the power of Clean Architecture - you can swap infrastructure without touching business logic.

## 🧪 Testing Strategy

Each layer can be tested independently:

- **Domain Layer**: Unit tests for entities and value objects
- **Application Layer**: Test use cases with mocked repositories
- **Infrastructure Layer**: Integration tests for repositories
- **Interface Layer**: Test controllers with mocked use cases
- **End-to-End**: Full API tests

## 🚧 Future Enhancements

- [ ] Add unit and integration tests
- [ ] Implement pagination for posts and comments
- [ ] Add categories and tags for posts
- [ ] Implement post search functionality
- [ ] Add file upload for post images
- [ ] Implement user roles (admin, author, reader)
- [ ] Add email verification
- [ ] Implement password reset functionality
- [ ] Add rate limiting
- [ ] Implement caching layer
- [ ] Add API documentation with Swagger/OpenAPI
- [ ] Migrate to PostgreSQL or MongoDB

## 📄 License

ISC

## 👥 Contributing

Contributions are welcome! Please ensure your code follows the Clean Architecture principles and includes appropriate tests.

---

**Built with Clean Architecture principles for maintainability, testability, and scalability.**