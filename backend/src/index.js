import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import redirectRoutes from './routes/redirect.routes.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { apiLimiter } from './middleware/rateLimiter.middleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1); // Extract IP from proxy headers (useful for rate limiting & analytics behind reverse proxy)

// Rate limiting for API
app.use('/api', apiLimiter);

// API Routes
app.use(apiRoutes);

// Redirect Routes (Top Level)
app.use('/', redirectRoutes);

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
