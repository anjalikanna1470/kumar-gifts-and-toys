import express from 'express';
import db from '../db.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all categories
router.get('/', (req, res) => {
  db.all('SELECT c.*, (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count FROM categories c ORDER BY name ASC', (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching categories' });
    res.json(rows);
  });
});

// Admin: Add Category
router.post('/', authenticateToken, authorizeAdmin, (req, res) => {
  const { name, image_url, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Category name is required.' });

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  db.run(
    'INSERT INTO categories (name, slug, image_url, description) VALUES (?, ?, ?, ?)',
    [name, slug, image_url || '/images/custom_mug.png', description || ''],
    function (err) {
      if (err) return res.status(500).json({ message: 'Failed to add category' });
      res.status(201).json({ message: 'Category created successfully!', id: this.lastID, slug });
    }
  );
});

// Admin: Update Category
router.put('/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const { name, image_url, description } = req.body;
  const { id } = req.params;

  db.run(
    'UPDATE categories SET name = ?, image_url = ?, description = ? WHERE id = ?',
    [name, image_url, description, id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Failed to update category' });
      res.json({ message: 'Category updated successfully.' });
    }
  );
});

// Admin: Delete Category
router.delete('/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM categories WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete category' });
    res.json({ message: 'Category deleted successfully.' });
  });
});

export default router;
