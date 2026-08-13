import express from 'express';
import db from '../db.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all products with filters & search
router.get('/', (req, res) => {
  const { category, occasion, is_customizable, min_price, max_price, sort, search, is_featured } = req.query;

  let query = `
    SELECT p.*, c.name as category_name, c.slug as category_slug,
    (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, id ASC LIMIT 1) as primary_image
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (category) {
    query += ` AND (c.slug = ? OR c.name = ?)`;
    params.push(category, category);
  }

  if (occasion) {
    query += ` AND p.occasion LIKE ?`;
    params.push(`%${occasion}%`);
  }

  if (is_customizable !== undefined && is_customizable !== '') {
    query += ` AND p.is_customizable = ?`;
    params.push(Number(is_customizable));
  }

  if (is_featured) {
    query += ` AND p.is_featured = 1`;
  }

  if (min_price) {
    query += ` AND p.discount_price >= ?`;
    params.push(Number(min_price));
  }

  if (max_price) {
    query += ` AND p.discount_price <= ?`;
    params.push(Number(max_price));
  }

  if (search) {
    query += ` AND (p.title LIKE ? OR p.description LIKE ? OR p.tags LIKE ? OR c.name LIKE ?)`;
    const s = `%${search}%`;
    params.push(s, s, s, s);
  }

  // Sorting
  if (sort === 'price_low') {
    query += ` ORDER BY p.discount_price ASC`;
  } else if (sort === 'price_high') {
    query += ` ORDER BY p.discount_price DESC`;
  } else if (sort === 'rating') {
    query += ` ORDER BY p.rating DESC`;
  } else if (sort === 'newest') {
    query += ` ORDER BY p.created_at DESC`;
  } else {
    query += ` ORDER BY p.is_featured DESC, p.rating DESC`;
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching products' });
    }
    res.json(rows);
  });
});

// Get Single Product by Slug or ID
router.get('/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const isNumeric = !isNaN(idOrSlug);

  const query = `
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE ${isNumeric ? 'p.id = ?' : 'p.slug = ?'}
  `;

  db.get(query, [idOrSlug], (err, product) => {
    if (err || !product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Fetch images
    db.all(`SELECT id, image_url, is_primary FROM product_images WHERE product_id = ? ORDER BY is_primary DESC`, [product.id], (err, images) => {
      product.images = images || [];

      // Fetch variants
      db.all(`SELECT id, variant_name, variant_value, extra_price FROM product_variants WHERE product_id = ?`, [product.id], (err, variants) => {
        product.variants = variants || [];

        // Fetch reviews
        db.all(`SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC`, [product.id], (err, reviews) => {
          product.reviews = reviews || [];
          res.json(product);
        });
      });
    });
  });
});

// Admin: Add New Product
router.post('/', authenticateToken, authorizeAdmin, (req, res) => {
  const { title, description, short_description, price, discount_price, category_id, stock, is_customizable, customization_type, sku, tags, occasion, images, variants } = req.body;

  if (!title || !price || !category_id) {
    return res.status(400).json({ message: 'Title, price, and category are required.' });
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
  const finalDiscount = discount_price ? Number(discount_price) : Number(price);

  db.run(
    `INSERT INTO products (title, slug, description, short_description, price, discount_price, category_id, stock, is_customizable, customization_type, sku, tags, occasion)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, slug, description, short_description, price, finalDiscount, category_id, stock || 10, is_customizable ? 1 : 0, customization_type || null, sku || `KGT-${Date.now().toString().slice(-6)}`, tags || '', occasion || ''],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to add product.' });
      }
      const productId = this.lastID;

      // Add images
      if (Array.isArray(images) && images.length > 0) {
        images.forEach((imgUrl, idx) => {
          db.run(`INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)`, [productId, imgUrl, idx === 0 ? 1 : 0]);
        });
      } else {
        db.run(`INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, 1)`, [productId, '/images/custom_mug.png']);
      }

      // Add variants
      if (Array.isArray(variants)) {
        variants.forEach(v => {
          db.run(`INSERT INTO product_variants (product_id, variant_name, variant_value, extra_price) VALUES (?, ?, ?, ?)`, [productId, v.name, v.value, v.extra_price || 0]);
        });
      }

      res.status(201).json({ message: 'Product created successfully!', productId, slug });
    }
  );
});

// Admin: Update Product
router.put('/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  const { title, description, short_description, price, discount_price, category_id, stock, is_customizable, customization_type, sku, tags, occasion, is_featured } = req.body;

  db.run(
    `UPDATE products SET title=?, description=?, short_description=?, price=?, discount_price=?, category_id=?, stock=?, is_customizable=?, customization_type=?, sku=?, tags=?, occasion=?, is_featured=?
     WHERE id=?`,
    [title, description, short_description, price, discount_price, category_id, stock, is_customizable ? 1 : 0, customization_type, sku, tags, occasion, is_featured ? 1 : 0, id],
    function (err) {
      if (err) return res.status(500).json({ message: 'Failed to update product.' });
      res.json({ message: 'Product updated successfully.' });
    }
  );
});

// Admin: Delete Product
router.delete('/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete product.' });
    res.json({ message: 'Product deleted successfully.' });
  });
});

export default router;
