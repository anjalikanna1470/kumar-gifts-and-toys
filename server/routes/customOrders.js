import express from 'express';
import db from '../db.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin: Get Custom Orders Queue
router.get('/admin/list', authenticateToken, authorizeAdmin, (req, res) => {
  db.all(
    `SELECT co.*, p.title as product_title, p.customization_type, o.order_number, u.name as customer_name, u.phone as customer_phone
     FROM custom_orders co
     LEFT JOIN products p ON co.product_id = p.id
     LEFT JOIN orders o ON co.order_id = o.id
     LEFT JOIN users u ON co.user_id = u.id
     ORDER BY co.created_at DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Error fetching custom orders queue.' });
      res.json(rows);
    }
  );
});

// Admin: Update Custom Order Status
router.put('/admin/status/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.run(
    'UPDATE custom_orders SET status = ? WHERE id = ?',
    [status, id],
    function (err) {
      if (err) return res.status(500).json({ message: 'Failed to update custom order status.' });
      res.json({ message: 'Custom order status updated successfully.' });
    }
  );
});

export default router;
