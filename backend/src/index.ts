import app from './app';
import { ENV } from './config/env';
import { connectDB } from './config/db';

async function start() {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`🌿 EcoSmart AI API running on port ${ENV.PORT}`);
  });
}

start();
