require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopkart';

async function start() {
  if (!process.env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET is not set — copy .env.example to .env and set it.');
  }
  await connectDB(MONGO_URI);
  app.listen(PORT, () => console.log(`ShopKart API running on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
