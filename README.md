# The Archive of Lost Time

A poetic and humorous place where people anonymously submit moments they feel were wasted, forgotten, or lost.

## Description

"The Archive of Lost Time" is an interactive public archive that allows users to anonymously contribute entries about moments they felt were wasted. The application displays submitted entries as "time droplets" in a visually engaging way, with filtering options by emotion, duration, and tags.

## Features

- Anonymous submission of "lost time" entries
- Visual display of entries as interactive "time droplets"
- Filtering by emotion
- Sorting by time (newest/oldest) and duration (shortest/longest)
- Tag-based search
- Responsive design

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Containerization**: Docker

## Running with Docker

### Prerequisites

- Docker
- Docker Compose

### Starting the Application

1. Clone the repository
2. Navigate to the project directory
3. Build and start the containers:

```bash
docker-compose up -d
```

4. Access the application at http://localhost:3000

### Stopping the Application

```bash
docker-compose down
```

### Viewing Logs

```bash
docker-compose logs app  # View application logs
docker-compose logs mongo  # View MongoDB logs
```

## Manual Setup (without Docker)

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Installation Steps

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Start the application:

```bash
npm start
```

For development with automatic restart:

```bash
npm run dev
```

5. Access the application at http://localhost:3000

## Project Structure

- `public/` - Frontend files (HTML, CSS, JavaScript)
- `models/` - MongoDB schema definitions
- `routes/` - API route definitions
- `server.js` - Main application entry point
- `Dockerfile` - Docker configuration
- `docker-compose.yml` - Docker Compose configuration 