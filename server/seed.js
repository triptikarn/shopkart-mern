/**
 * Seed script — fills the database with demo products (and one demo user).
 * Run:  npm run seed
 * Demo login: demo@shopkart.in / demo123
 */
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    price: 4999,
    category: 'Electronics',
    description:
      'Over-ear Bluetooth headphones with active noise cancellation, 40-hour battery life and plush memory-foam cushions.',
    image: 'https://picsum.photos/seed/shopkart-headphones/600/400',
    stock: 40,
    rating: 4.6,
  },
  {
    name: 'Mechanical RGB Gaming Keyboard',
    price: 3499,
    category: 'Electronics',
    description:
      'Hot-swappable mechanical keyboard with tactile switches, per-key RGB lighting and a detachable USB-C cable.',
    image: 'https://picsum.photos/seed/shopkart-keyboard/600/400',
    stock: 65,
    rating: 4.5,
  },
  {
    name: 'Smart Fitness Watch',
    price: 5999,
    category: 'Electronics',
    description:
      'AMOLED display, heart-rate and SpO2 tracking, 100+ sport modes and 10-day battery life. Water resistant up to 5 ATM.',
    image: 'https://picsum.photos/seed/shopkart-watch/600/400',
    stock: 30,
    rating: 4.4,
  },
  {
    name: 'Portable Bluetooth Speaker',
    price: 2499,
    category: 'Electronics',
    description:
      'Room-filling 20W stereo sound, deep bass radiator, IPX7 waterproofing and 18 hours of playtime.',
    image: 'https://picsum.photos/seed/shopkart-speaker/600/400',
    stock: 80,
    rating: 4.3,
  },
  {
    name: "Men's Classic Cotton T-Shirt",
    price: 799,
    category: 'Fashion',
    description:
      '240 GSM combed cotton tee with a regular fit. Pre-shrunk, bio-washed and available in everyday colours.',
    image: 'https://picsum.photos/seed/shopkart-tshirt/600/400',
    stock: 200,
    rating: 4.2,
  },
  {
    name: "Women's Floral Summer Dress",
    price: 1799,
    category: 'Fashion',
    description:
      'Lightweight rayon A-line dress with a floral print, smocked bodice and side pockets. Perfect for warm days.',
    image: 'https://picsum.photos/seed/shopkart-dress/600/400',
    stock: 120,
    rating: 4.5,
  },
  {
    name: 'Running Shoes — FlexKnit',
    price: 2999,
    category: 'Fashion',
    description:
      'Breathable knit upper, responsive foam midsole and high-grip outsole for daily runs and all-day comfort.',
    image: 'https://picsum.photos/seed/shopkart-shoes/600/400',
    stock: 90,
    rating: 4.4,
  },
  {
    name: 'Stainless Steel Water Bottle (1L)',
    price: 649,
    category: 'Home & Kitchen',
    description:
      'Double-wall vacuum insulation keeps drinks cold for 24 hours or hot for 12. Leak-proof and BPA-free cap.',
    image: 'https://picsum.photos/seed/shopkart-bottle/600/400',
    stock: 300,
    rating: 4.6,
  },
  {
    name: 'Non-Stick Cookware Set (5 pc)',
    price: 2199,
    category: 'Home & Kitchen',
    description:
      'Granite-coated kadhai, tawa, fry pan and casseroles with lids. Gas and induction friendly, PFOA-free coating.',
    image: 'https://picsum.photos/seed/shopkart-cookware/600/400',
    stock: 55,
    rating: 4.3,
  },
  {
    name: 'LED Desk Lamp with USB Charging',
    price: 1199,
    category: 'Home & Kitchen',
    description:
      'Eye-care LED lamp with 5 colour temperatures, stepless dimming, a foldable arm and a built-in USB charging port.',
    image: 'https://picsum.photos/seed/shopkart-lamp/600/400',
    stock: 140,
    rating: 4.4,
  },
  {
    name: 'Adjustable Dumbbell Set (10 kg)',
    price: 1899,
    category: 'Fitness',
    description:
      'Space-saving adjustable dumbbells with quick-lock weight plates from 2.5 kg to 10 kg. Sold as a pair.',
    image: 'https://picsum.photos/seed/shopkart-dumbbell/600/400',
    stock: 45,
    rating: 4.5,
  },
  {
    name: 'Anti-Skid Yoga Mat (6 mm)',
    price: 899,
    category: 'Fitness',
    description:
      'Extra-thick 6 mm TPE yoga mat with dual-sided anti-skid texture, alignment lines and a carry strap.',
    image: 'https://picsum.photos/seed/shopkart-yogamat/600/400',
    stock: 160,
    rating: 4.3,
  },
];

async function seed() {
  await connectDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopkart');

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);

  const demoEmail = 'demo@shopkart.in';
  const existing = await User.findOne({ email: demoEmail });
  if (!existing) {
    await User.create({ name: 'Demo User', email: demoEmail, password: 'demo123' });
    console.log(`Demo user created: ${demoEmail} / demo123`);
  } else {
    console.log('Demo user already exists, skipped');
  }

  await mongoose.disconnect();
  console.log('Seed complete.');
}

seed().catch(async (err) => {
  console.error('Seed failed:', err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
