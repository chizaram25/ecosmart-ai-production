import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import routes from './routes/index';

const app = express();

// ── Security ──
app.use(helmet());
app.use(cors({ origin: ENV.ALLOWED_ORIGINS }));

// ── Body parsing ──
app.use(express.json({ limit: '10mb' })); // 10mb for base64 images
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting ──
app.use('/api', rateLimiter);

// ── Routes ──
app.use('/api', routes);

// ── Health check ──
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'EcoSmart AI API' }));

// ── Error handler (must be last) ──
app.use(errorHandler);

export default app;
