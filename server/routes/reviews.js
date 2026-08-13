import express from 'express';
import db from '../db.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get Reviews for a Product
router.get('/product/:productId', (req, res) => {
  const { productId } = req.params;
  db.all(
    'SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
    [productId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Error fetching reviews.' });
      res.json(rows);
    }
  );
});

// Post a Review (Customer)
router.post('/product/:productId', (req, res) => {
  const { productId } = req.params;
  const { userName, rating, comment, imageUrl } = req.body;

  if (!userName || !rating || !comment) {
    return res.status(400).json({ message: 'Name, rating, and review text are required.' });
  }

  db.run(
    `INSERT INTO reviews (product_id, user_name, rating, comment, image_url, is_verified_buyer) VALUES (?, ?, ?, ?, ?, 1)`,
    [productId, userName, rating, comment, imageUrl || ''],
    function (err) {
      if (err) return res.status(500).json({ message: 'Failed to submit review.' });

      // Update average rating on product
      db.get('SELECT AVG(rating) as avgRating, COUNT(*) as cnt FROM reviews WHERE product_id = ?', [productId], (err, stats) => {
        if (stats) {
          db.run(
            'UPDATE products SET rating = ?, review_count = ? WHERE id = ?',
            [Math.round(stats.avgRating * 10) / 10, stats.cnt, productId]
          );
        }
      });

      res.status(201).json({ message: 'Review submitted successfully! Thank you ❤️' });
    }
  );
});

// Admin: Delete Review
router.delete('/admin/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM reviews WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete review.' });
    res.json({ message: 'Review deleted.' });
  });
});

export default router;
