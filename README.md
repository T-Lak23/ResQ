# QR Restaurant

A full-stack restaurant table booking system with QR code integration. The application allows restaurant owners to manage their restaurants, tables, and bookings, while customers can book tables through QR codes.

## Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Mongoose ODM)
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **nodemailer** - Email notifications
- **qrcode** - QR code generation
- **zod** - Data validation
- **cors** - Cross-origin resource sharing
- **cookie-parser** - Cookie handling

### Frontend

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **React Router** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Shadcn UI** - UI components
- **qrcode.react** - QR code component
- **react-hot-toast** - Toast notifications
- **Lucide React** - Icons

## Project Structure

```
qr_restaurant/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and environment configuration
│   │   ├── controllers/    # Business logic
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point
│   ├── .env                # Environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── lib/            # Utility libraries
    │   ├── pages/          # Page components
    │   ├── store/          # Zustand stores
    │   ├── App.jsx         # Main app component
    │   └── main.jsx        # Entry point
    ├── .env                # Environment variables
    └── package.json
```

## Features

### For Restaurant Owners

- **Authentication**: Secure login and registration
- **Restaurant Management**: Create and manage restaurant profiles
- **Table Management**: Add and manage restaurant tables
- **Booking Management**: View and manage table bookings
- **Customer Management**: View customer information
- **QR Code Generation**: Generate QR codes for each table
- **Settings**: Configure restaurant settings

### For Customers

- **Public Booking**: Book tables through QR codes
- **Booking Confirmation**: Receive booking confirmations
- **Email Notifications**: Get email updates for bookings

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
NODEMAILER_USER=your_email@gmail.com
NODEMAILER_PASS=your_app_password
NODEMAILER_USER_NAME=ResQ
```

4. Start the development server:

```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the frontend directory with the following variable:

```env
VITE_API_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Restaurants

- `POST /api/restaurants` - Create restaurant
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant

### Tables

- `POST /api/tables` - Create table
- `GET /api/tables/restaurant/:restaurantId` - Get tables by restaurant
- `PUT /api/tables/:id` - Update table
- `DELETE /api/tables/:id` - Delete table

### Bookings

- `POST /api/bookings` - Create booking
- `GET /api/bookings/restaurant/:restaurantId` - Get bookings by restaurant
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

## Scripts

### Backend

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend

- `npm run dev` - Start development server

## Environment Variables

### Backend (.env)

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Frontend URL for CORS
- `NODEMAILER_USER` - Email for notifications
- `NODEMAILER_PASS` - Email app password
- `NODEMAILER_USER_NAME` - Sender name

### Frontend (.env)

- `VITE_API_URL` - Backend API URL

## Key Features Implementation

### Concurrent Booking Protection

The backend implements concurrency control to prevent double bookings. When multiple booking requests are made for the same table and time slot, only one request succeeds, while others receive a 409 Conflict status.

### QR Code Integration

The QR code contains a URL to the public booking page with the restaurant ID.

### Email Notifications

The system uses nodemailer to send booking confirmation emails to customers when a booking is successfully created.

## License

ISC
