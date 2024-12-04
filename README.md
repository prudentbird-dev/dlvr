# DLVR Assessment Logistics API
DLVR Logistics API is a backend system designed to manage dispatch riders and orders for a logistics service. It facilitates user authentication, rider management, and efficient order processing by automatically assigning the nearest available rider to new orders. Built with TypeScript, this API ensures a robust and scalable solution for managing deliveries.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization with roles (user, rider, admin)
- CRUD operations for users, riders, and orders
- Automatic assignment of nearest available rider for new orders
- Geospatial querying for efficient rider selection
- API documentation with Swagger
- TypeScript for improved developer experience and type safety

## Prerequisites

- Node.js (v14 or later)
- MongoDB: A MongoDB instance (cloud or local)
- pnpm: Package manager

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/prudentbird-dev/dlvr.git
   cd dlvr-logistics-api
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Run the server:
   ```
   pnpm run dev
   ```
   The server will be accessible at http://localhost:3000

## Project Structure

- `src/`
  - `config/`: Contains configuration files
  - `controllers/`:  Defines the logic for handling HTTP requests
  - `middlewares/`: Contains middleware functions
  - `models/`: Defines the data models for MongoDB
  - `routes/`: API endpoint definitions and routing
  - `services/`: Contains the core business logic
  - `types/`: TypeScript types for strict type safety
  - `utils/`: Contains utility functions and classes
  - `app.ts`: The main entry point of the application

## API Documentation

The API is documented using Swagger for easy reference. Once the server is running, you can access the API documentation at:
```
http://localhost:3000/api/docs
```
This will provide detailed information on each available endpoint, request parameters, and response formats.

## Contributing
We welcome contributions to improve the DLVR Logistics API! Please feel free to fork the repository and submit pull requests with improvements.

## License
This project is licensed under the Apache License. See the [LICENSE](./LICENSE) file for details.