# Task Manager Application

A full-stack task management application built with React, Node.js, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or Atlas)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taskmanager-main
```

2. Install dependencies for both client and server:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

## Running the Application

### Start the Server
1. Navigate to the server directory:
```bash
cd server
```

2. Start the server:
```bash
npm start
```
The server will run on http://localhost:5000

### Start the Client
1. Navigate to the client directory:
```bash
cd client
```

2. Start the development server:
```bash
npm run dev
```
The client will run on http://localhost:3000

## Login Credentials

### Admin Panel Access
- Email: himachal123@gmail.com
- Password: himachal1234

### Regular User
- You can register a new user through the application interface

## Features

- Task Management
- User Management
- Admin Dashboard
- Real-time Notifications
- Task Categories (Todo, In Progress, Completed)
- User Roles (Admin, Regular User)

## Technologies Used

- Frontend:
  - React
  - Redux
  - Tailwind CSS
  - React Router
  - Axios

- Backend:
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication

## Project Structure

```
taskmanager-main/
├── client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── utils/
│   └── package.json
│
└── server/           # Node.js backend
    ├── controllers/
    ├── models/
    ├── routes/
    └── package.json
```

## Support

For any issues or questions, please contact the development team.
