import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT:             process.env.PORT || 5000,
  NODE_ENV:         process.env.NODE_ENV || 'development',
  DATABASE_URL:     process.env.DATABASE_URL || '',
  JWT_SECRET:       process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN:   process.env.JWT_EXPIRES_IN || '7d',
  ANTHROPIC_KEY:    process.env.ANTHROPIC_API_KEY || '',
  ALLOWED_ORIGINS:  (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
};
