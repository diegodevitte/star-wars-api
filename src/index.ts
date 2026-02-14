import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import peopleRoutes from './routes/people.js';
import planetsRoutes from './routes/planets.js';
import starshipsRoutes from './routes/starships.js';
import vehiclesRoutes from './routes/vehicles.js';


const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('combined'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/people', peopleRoutes);
app.use('/planets', planetsRoutes);
app.use('/starships', starshipsRoutes);
app.use('/vehicles', vehiclesRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
  });
});

app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

const server = app.listen(PORT, () => {
  console.log(`Listen Star Wars API running on port ${PORT}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    console.error('Server error:', error);
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

export default app;