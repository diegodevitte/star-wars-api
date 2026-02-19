# Galactic Console Backend

Backend API for Galactic Console - Star Wars data explorer powered by SWAPI.

## 🚀 Tech Stack

- **Node.js** + **TypeScript**
- **Express.js** - Web framework
- **SWAPI** - Star Wars API integration
- **Swagger/OpenAPI** - API documentation
- **Jest** - Testing framework

## 📦 Installation

### Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
npm run test:coverage
```

## 🐳 Docker

### Build and Run with Docker

```bash
# Build the image
docker build -t galactic-console-api .

# Run the container
docker run -p 4000:4000 galactic-console-api
```

### Using Docker Compose

```bash
# Start the service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

### Environment Variables

Create a `.env` file in the root directory (use `.env.example` as template):

```bash
cp .env.example .env
```

**Available variables:**

```env
# Server
PORT=4000
NODE_ENV=development

# CORS
CORS_ORIGIN=*

# SWAPI
SWAPI_BASE_URL=https://swapi.dev/api

# LLM (Optional - for AI chat)
LLM_PROVIDER=none          # openai | anthropic | none
LLM_API_KEY=               # Your API key
LLM_MODEL=gpt-3.5-turbo    # Model to use
```

## 📚 API Documentation

Once the server is running, visit:

- Swagger UI: http://localhost:4000/api-docs
- Root: http://localhost:4000/ (redirects to docs)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📋 Available Endpoints

- `GET /api/people` - List all characters
- `GET /api/people/:id` - Get character by ID
- `GET /api/planets` - List all planets
- `GET /api/planets/:id` - Get planet by ID
- `GET /api/starships` - List all starships
- `GET /api/starships/:id` - Get starship by ID
- `GET /api/vehicles` - List all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/chat` - AI-powered chat interface
- `GET /api/stats` - Get database statistics

## 🏗️ Project Structure

```
src/
├── controllers/     # Request handlers
├── routes/         # API routes
├── services/       # Business logic
├── lib/            # Utilities & clients
├── tests/          # Test files
├── types.ts        # TypeScript definitions
├── swagger.ts      # API documentation
└── index.ts        # Application entry point
```

## 🔧 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues

## 📝 License

MIT
