import express from 'express';
import db from '../db.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Generate unique order number e.g. KG-94812
function generateOrderNumber() {
  return 'KG-' + Math.floor(10000 + Math.random() * 90000);
}

// Customer: Place New Order
router.post('/', (req, res) => {
  const { userId, items, deliveryAddress, paymentMethod, totalAmount, discountAmount, deliveryCharge, notes } = req.body;

  if (!items || !items.length || !deliveryAddress || !paymentMethod) {
    return res.status(400).json({ message: 'Order items, delivery address, and payment method are required.' });
  }

  const orderNumber = generateOrderNumber();
  const addressJson = typeof deliveryAddress === 'object' ? JSON.stringify(deliveryAddress) : deliveryAddress;
  const trackingNumber = 'TRK' + Math.floor(10000000 + Math.random() * 90000000);

  db.run(
    `INSERT INTO orders (order_number, user_id, total_amount, discount_amount, delivery_charge, payment_method, payment_status, order_status, delivery_address, tracking_number, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'Placed', ?, ?, ?)`,
    [
      orderNumber,
      userId || null,
      totalAmount,
      discountAmount || 0,
      deliveryCharge || 0,
      paymentMethod,
      paymentMethod === 'COD' ? 'Pending (COD)' : 'Paid (Simulated)',
      addressJson,
      trackingNumber,
      notes || ''
    ],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to record order.' });
      }

      const orderId = this.lastID;

      // Insert Order Items & Update Stock & Queue Custom Orders
      items.forEach((item) => {
        const variantStr = item.variant ? JSON.stringify(item.variant) : null;
        const customStr = item.customization ? JSON.stringify(item.customization) : null;

        db.run(
          `INSERT INTO order_items (order_id, product_id, product_title, price, quantity, variant_info, customization_info)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [orderId, item.id || item.product_id, item.title, item.price, item.quantity, variantStr, customStr]
        );

        // Reduce stock
        db.run(`UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?`, [item.quantity, item.id || item.product_id]);

        // Insert into custom_orders queue if customizable
        if (item.customization) {
          db.run(
            `INSERT INTO custom_orders (order_id, user_id, product_id, custom_text, font_style, text_color, uploaded_image_url, special_instructions, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending Review')`,
            [
              orderId,
              userId || null,
              item.id || item.product_id,
              item.customization.customText || '',
              item.customization.fontStyle || 'Classic',
              item.customization.textColor || '#000000',
              item.customization.uploadedImageUrl || '',
              item.customization.specialInstructions || '',
            ]
          );
        }
      });

      res.status(201).json({
        message: 'Order placed successfully! 🎉',
        orderNumber,
        orderId,
        trackingNumber,
        expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
      });
    }
  );
});

// Track Order by Order Number or Tracking Number
router.get('/track/:query', (req, res) => {
  const { query } = req.params;

  db.get(
    `SELECT * FROM orders WHERE order_number = ? OR tracking_number = ?`,
    [query, query],
    (err, order) => {
      if (err || !order) {
        return res.status(404).json({ message: 'Order not found. Please check your Order ID or Tracking Number.' });
      }

      db.all(`SELECT * FROM order_items WHERE order_id = ?`, [order.id], (err, items) => {
        order.items = items || [];

        // Parse address
        try {
          order.delivery_address = JSON.parse(order.delivery_address);
        } catch (e) {}

        res.json(order);
      });
    }
  );
});

// Customer: Get My Orders
router.get('/my-orders', authenticateToken, (req, res) => {
  db.all(
    `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
    [req.user.id],
    (err, orders) => {
      if (err) return res.status(500).json({ message: 'Error fetching orders.' });

      // Fetch items for each order
      const orderPromises = orders.map(order => {
        return new Promise((resolve) => {
          db.all(`SELECT * FROM order_items WHERE order_id = ?`, [order.id], (err, items) => {
            order.items = items || [];
            try {
              order.delivery_address = JSON.parse(order.delivery_address);
            } catch (e) {}
            resolve(order);
          });
        });
      });

      Promise.all(orderPromises).then(results => res.json(results));
    }
  );
});

// Admin: Get All Orders with Filters
router.get('/admin/all', authenticateToken, authorizeAdmin, (req, res) => {
  db.all(
    `SELECT o.*, u.name as customer_name, u.phone as customer_phone, u.email as customer_email
     FROM orders o
     LEFT JOIN users u ON o.user_id = u.id
     ORDER BY o.created_at DESC`,
    (err, orders) => {
      if (err) return res.status(500).json({ message: 'Error fetching orders.' });

      const orderPromises = orders.map(order => {
        return new Promise((resolve) => {
          db.all(`SELECT * FROM order_items WHERE order_id = ?`, [order.id], (err, items) => {
            order.items = items || [];
            try {
              order.delivery_address = JSON.parse(order.delivery_address);
            } catch (e) {}
            resolve(order);
          });
        });
      });

      Promise.all(orderPromises).then(results => res.json(results));
    }
  );
});

// Admin: Update Order Status
router.put('/admin/status/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  const { order_status, payment_status } = req.body;

  db.run(
    `UPDATE orders SET order_status = COALESCE(?, order_status), payment_status = COALESCE(?, payment_status) WHERE id = ?`,
    [order_status, payment_status, id],
    function (err) {
      if (err) return res.status(500).json({ message: 'Failed to update order status.' });
      res.json({ message: 'Order status updated successfully.' });
    }
  );
});

export default router;
