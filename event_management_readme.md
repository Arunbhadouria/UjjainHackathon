# Event Management Platform

A web-based platform for real-time zone population tracking using RFID tags, with user authentication, geospatial zone management, and real-time updates via Socket.io. Developed during the Hackathon Ujjain.

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install PostgreSQL and PostGIS](#2-install-postgresql-and-postgis)
  - [3. Backend Setup](#3-backend-setup)
  - [4. Frontend Setup](#4-frontend-setup)
  - [5. Database Sync](#5-database-sync)
- [File Structure](#file-structure)
- [Running the Application](#running-the-application)
- [Testing with Postman](#testing-with-postman)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Next Steps](#next-steps)

## Project Overview
The Event Management Platform enables:
- **User Authentication**: Register/login users (admin, civilian, security) with JWT-based authentication.
- **Zone Management**: Create, update, and delete zones with geospatial boundaries (using PostGIS) and visualize them on a map with `react-leaflet` and `leaflet-draw`.
- **Real-time Population Tracking**: Update zone population counts via RFID tag detection using Socket.io.
- **Future Features**: RFID tag management, real-time alerts, and chat functionality.

## Tech Stack
- **Backend**:
  - Node.js
  - Express
  - Sequelize (ORM for PostgreSQL)
  - PostgreSQL with PostGIS (geospatial data)
  - Socket.io (real-time updates)
  - JWT (authentication)
  - bcryptjs (password hashing)
- **Frontend**:
  - React
  - react-router-dom (routing)
  - axios (API calls)
  - socket.io-client (real-time updates)
  - react-leaflet (map visualization)
  - leaflet-draw (drawing zone boundaries)
- **Database**: PostgreSQL with PostGIS extension
- **Other**: dotenv (environment variables), helmet, morgan, express-rate-limit (security/logging)

## Prerequisites
- **Node.js**: v16 or later (`node --version`)
- **npm**: v8 or later (`npm --version`)
- **PostgreSQL**: v13 or later with PostGIS extension
- **Git**: For cloning the repository
- **Optional**: WSL 2 for Windows users (if preferred)
- **Postman**: For API testing

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Arunbhadouria/UjjainHackathon
cd UjjainHackathon
git checkout master
```

### 2. Install PostgreSQL and PostGIS
The project uses PostgreSQL with PostGIS for geospatial zone boundaries.

#### Windows (Non-WSL)
1. Download and install PostgreSQL: https://www.postgresql.org/download/windows/
2. Install PostGIS during setup or manually:
```bash
"C:\Program Files\PostgreSQL\<version>\bin\psql.exe" -U postgres
```
```sql
CREATE DATABASE event_management;
\c event_management
CREATE EXTENSION postgis;
SELECT PostGIS_Version();
```
Note your PostgreSQL password for the .env file.

#### WSL/Linux
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib postgis
sudo -u postgres psql
```
```sql
CREATE DATABASE event_management;
\c event_management
CREATE EXTENSION postgis;
SELECT PostGIS_Version();
```

#### macOS
```bash
brew install postgresql postgis
psql -U postgres
```
```sql
CREATE DATABASE event_management;
\c event_management
CREATE EXTENSION postgis;
SELECT PostGIS_Version();
```

### 3. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in `backend/` based on `.env.example`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=event_management
DB_PORT=5432
JWT_SECRET=your_very_long_and_random_secret_key_123456
JWT_EXPIRE=7d
```
- Replace `your_password` with your PostgreSQL password.
- For WSL users accessing Windows PostgreSQL, use `DB_HOST=host.docker.internal`.

4. Start the backend:
```bash
npm run dev
```
The server runs on http://localhost:5000.

### 4. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend:
```bash
npm start
```
The app runs on http://localhost:3000.

### 5. Database Sync

The backend uses Sequelize to sync models (User, Zone, etc.) with the database.
- To create tables, ensure `sequelize.sync({ force: false })` is in `backend/src/server.js`.
- For a fresh database (warning: drops existing tables), temporarily set:
```javascript
sequelize.sync({ force: true });
```

1. Run the backend, then revert to `force: false`.
2. Verify tables:
```bash
psql -h localhost -U postgres -d event_management
\dt
```
Look for Users, Zones, etc.

## File Structure
```
UjjainHackathon/
├── backend/
│   ├── src/
│   │   ├── server.js              # Main Express server with Socket.io
│   │   ├── config/
│   │   │   └── database.js        # Sequelize configuration
│   │   ├── models/
│   │   │   └── Zone.js            # Zone model (GEOMETRY(POLYGON))
│   │   │   └── User.js            # User model
│   │   ├── controllers/
│   │   │   └── zoneController.js  # Zone CRUD and population updates
│   │   │   └── authController.js  # Authentication (register/login)
│   │   ├── routes/
│   │   │   └── zone.js            # Zone API routes
│   │   │   └── auth.js            # Auth API routes
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT authentication middleware
│   ├── .env.example               # Template for environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── ZoneManagement.js  # Zone management UI with map
│   │   │   └── Login.js           # Login page
│   │   │   └── Register.js        # Registration page
│   │   ├── utils/
│   │   │   └── api.js             # Axios client for API calls
│   │   │   └── socket.js          # Socket.io client
│   │   └── App.js                 # Main React app
│   └── package.json
└── README.md
```

## Running the Application

1. Start the backend:
```bash
cd backend
npm run dev
```

2. Start the frontend:
```bash
cd frontend
npm start
```

3. Access the app at http://localhost:3000.
4. Register at `/register`, log in at `/login`, and manage zones at `/zones`.

## Testing with Postman

### Register a User:
```
POST http://localhost:5000/api/auth/register
Headers: Content-Type: application/json
Body:
{
  "name": "John Doe",
  "phone": "1234567890",
  "email": "john@example.com",
  "userType": "civilian",
  "password": "password123"
}
```
Save the token from the response.

### Create a Zone:
```
POST http://localhost:5000/api/zones
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>
Body:
{
  "name": "Zone 1",
  "capacity": 100,
  "colorCode": "#44ff44",
  "boundary": null
}
```
Note the id from the response as zoneId.

### Update Population:
```
POST http://localhost:5000/api/zones/population
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>
Body:
{
  "zoneId": "<zoneId>",
  "tagId": "test-rfid-123"
}
```
Verify the currentPopulation increments and updates in real-time on the frontend.

### Get Zones:
```
GET http://localhost:5000/api/zones
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>
```

## Troubleshooting

### Error: Cannot read properties of undefined (reading 'map') in ZoneManagement.js:
- Ensure zones is an array. The `Array.isArray(zones)` check in ZoneManagement.js prevents this.
- Verify `/api/zones` returns an array (`[]` or `[{}]`) using Postman.

### Error: Invalid token:
- Check `JWT_SECRET` in `backend/.env` matches across environments.
- Generate a new token via `/api/auth/register` or `/api/auth/login`.

### Error: Cannot read properties of undefined (reading 'emit'):
- Ensure `app.set('io', io)` is in `backend/src/server.js`.
- Verify socket.io is installed (`npm install socket.io`).

### Error: WHERE parameter "email" has invalid "undefined" value:
- Ensure email is included or omitted in `/api/auth/register` body (not set to undefined).

### Error: Cannot destructure property 'name' of 'req.body':
- Verify `Content-Type: application/json` in Postman.
- Ensure `app.use(express.json())` is in server.js before routes.

### Error: TypeError: argument handler must be a function:
- Check `backend/controllers/zoneController.js` for correct exports (e.g., `exports.updatePopulation`).

### Error: src refspec main does not match any:
- Ensure commits exist and the branch is master:
```bash
git branch
git add .
git commit -m "Initial commit"
git push origin master
```

### Database Issues:
- Verify PostgreSQL is running and PostGIS is enabled (`SELECT PostGIS_Version();`).
- Check `DB_HOST`, `DB_USER`, `DB_PASSWORD` in `.env`.

## Contributing

1. **Clone and Branch:**
```bash
git checkout master
git pull origin master
git checkout -b feature/<feature-name>
```

2. **Commit Changes:**
```bash
git add .
git commit -m "Add <feature-name>"
```

3. **Push and Create PR:**
```bash
git push origin feature/<feature-name>
```
Create a pull request on GitHub to merge into master.

4. **Code Review:**
- Ensure code follows the existing style (async/await, error handling).
- Test endpoints with Postman and verify frontend functionality.

## Next Steps

- **RFID Tag Management**: Implement CRUD for RFIDTag model.
- **Alert System**: Add real-time alerts via Socket.io for zone capacity thresholds.
- **Zone Editing**: Enhance leaflet-draw to edit existing zone boundaries.
- **Chat Functionality**: Implement real-time chat for admins and security.