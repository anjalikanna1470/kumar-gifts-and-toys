import express from 'express';
import db from '../db.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Dashboard Summary Analytics
router.get('/dashboard-stats', authenticateToken, authorizeAdmin, (req, res) => {
  const stats = {};

  db.get('SELECT COUNT(*) as total_orders, SUM(total_amount) as total_revenue FROM orders', (err, orderStats) => {
    stats.totalOrders = orderStats ? orderStats.total_orders : 0;
    stats.totalRevenue = orderStats && orderStats.total_revenue ? orderStats.total_revenue : 0;

    db.get('SELECT COUNT(*) as pending_orders FROM orders WHERE order_status IN ("Placed", "Confirmed", "Processing")', (err, pending) => {
      stats.pendingOrders = pending ? pending.pending_orders : 0;

      db.get('SELECT COUNT(*) as custom_pending FROM custom_orders WHERE status = "Pending Review"', (err, customPending) => {
        stats.customOrdersPending = customPending ? customPending.custom_pending : 0;

        db.get('SELECT COUNT(*) as total_products FROM products', (err, prodCount) => {
          stats.totalProducts = prodCount ? prodCount.total_products : 0;

          db.all('SELECT id, title, stock FROM products WHERE stock <= 5 ORDER BY stock ASC', (err, lowStock) => {
            stats.lowStockProducts = lowStock || [];

            db.get('SELECT COUNT(*) as total_customers FROM users WHERE role = "CUSTOMER"', (err, custCount) => {
              stats.totalCustomers = custCount ? custCount.total_customers : 0;

              // Monthly/Recent Order Analytics
              db.all(
                `SELECT strftime('%Y-%m-%d', created_at) as date, COUNT(*) as count, SUM(total_amount) as daily_revenue
                 FROM orders
                 GROUP BY strftime('%Y-%m-%d', created_at)
                 ORDER BY date DESC LIMIT 7`,
                (err, dailyChart) => {
                  stats.dailyChart = dailyChart || [];
                  res.json(stats);
                }
              );
            });
          });
        });
      });
    });
  });
});

// Admin: Get Customer List
router.get('/customers', authenticateToken, authorizeAdmin, (req, res) => {
  db.all(
    `SELECT u.id, u.name, u.email, u.phone, u.created_at,
     COUNT(o.id) as order_count, COALESCE(SUM(o.total_amount), 0) as total_spent
     FROM users u
     LEFT JOIN orders o ON u.id = o.user_id
     WHERE u.role = 'CUSTOMER'
     GROUP BY u.id
     ORDER BY u.created_at DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Error fetching customer list.' });
      res.json(rows);
    }
  );
});

export default router;
