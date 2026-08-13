import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import customOrderRoutes from './routes/customOrders.js';
import reviewRoutes from './routes/reviews.js';
import uploadRoutes from './routes/upload.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Security Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: false, // Allowed for inline canvas previews & external Google maps
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

// 2. CORS & Parser Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Rate Limiting Middleware
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  message: { message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit authentication attempts to 15 per 15 minutes
  message: { message: 'Too many login or registration attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/change-password', authLimiter);

// 4. Static Uploads & Images Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// 5. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/custom-orders', customOrderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// 6. Health Check (requirement 12)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: 'Kumar Gifts & Toys API' });
});

// 7. Serve frontend dist in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback for single page application routing
app.use((req, res, next) => {
  if (req.url.startsWith('/api') || req.url.startsWith('/uploads')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Kumar Gifts & Toys API Backend Running.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🎁 Kumar Gifts & Toys Server running at http://localhost:${PORT}`);
});
