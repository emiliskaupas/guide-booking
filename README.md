# Guide Booking System

Full-stack tour booking application built with React and ASP.NET Core, featuring role-based authentication booking management.
## Architecture
### Technology Stack

**Backend:**
- ASP.NET Core 8.0 Web API
- Entity Framework Core (In-Memory Database)
- JWT Authentication with Refresh Tokens
- PBKDF2 Password Hashing (10,000 iterations, SHA256)

**Frontend:**
- React 18 with TypeScript
- Material-UI (MUI) for UI components
- React Router for navigation
- Axios for HTTP requests

**Security Features:**
- Input validation with Data Annotations
- Input sanitization (removes control characters, null bytes)
- Password requirements (8+ chars, uppercase, lowercase, number, special char)
- SQL Injection protection (Entity Framework parameterized queries)
- Rate limiting on authentication endpoints
- Role-based authorization (User/Admin)

## Database

**Type:** In-Memory Database (via Entity Framework Core)

**Models:**
- `User` - Authentication and user information
- `Booking` - Tour bookings with pricing
- `TourPackage` - Available tours
- `Extra` - Optional add-ons
- `BookingExtra` - Many-to-many relationship
- `TicketCategory` - Ticket types (Adult/Youth/Child)

## User Roles

### Admin
- View all bookings across all users
- Access all user data
- Full system access

### User (Default)
- View only their own bookings
- Create new bookings
- Delete their own bookings
- Access filtered booking lists

## Test Users

### Regular Users
```
Email: user@example.com
Password: Customer123!
Username: john_doe

Email: user2@example.com
Password: Customer123!
Username: jane_smith
```

### Administrator
```
Email: admin@example.com
Password: Admin123!
Username: admin
Role: Admin
```
## Running Locally

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- npm package manager

### Backend Setup

1. Navigate to the server directory:
```bash
cd Guide.Booking.Server
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Run the backend:
```bash
dotnet run
```

The API will be available at `http://localhost:5000`  
Swagger documentation at `http://localhost:5000/swagger`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd Guide.Booking.Client
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Default Ports
- **Backend API:** `http://localhost:5000`
- **Frontend:** `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh JWT token

### Bookings
- `GET /api/bookings` - Get bookings (with optional filters)
- `GET /api/bookings/{id}` - Get booking by ID
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/{id}` - Delete booking

**Query Parameters for Filtering:**
- `fromDate` - Filter bookings from this date
- `toDate` - Filter bookings until this date
- `tourPackageId` - Filter by specific tour
- `minGroupSize` - Minimum number of people
- `maxGroupSize` - Maximum number of people

### Tours
- `GET /api/tours` - Get all tour packages
- `GET /api/tours/{id}` - Get tour by ID
- `GET /api/tours/extras` - Get available extras
- `POST /api/tours/calculate-price` - Calculate booking price

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/me` - Get current user data
- `GET /api/users/{userId}/bookings` - Get user's bookings
- `GET /api/users/{userId}/bookings/{bookingId}` - Get specific booking