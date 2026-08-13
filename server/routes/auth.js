import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { authenticateToken, getJwtSecret } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register Customer
router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()], async (err, existing) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'CUSTOMER')`,
      [name, email.toLowerCase(), phone || '', hashedPassword],
      function (err) {
        if (err) return res.status(500).json({ message: 'Failed to create user account.' });
        
        const user = { id: this.lastID, name, email: email.toLowerCase(), role: 'CUSTOMER', phone };
        const token = jwt.sign(user, getJwtSecret(), { expiresIn: '7d' });
        res.status(201).json({ message: 'Registration successful!', token, user });
      }
    );
  });
});

// Login Customer or Admin
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const tokenUser = { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone };
    const token = jwt.sign(tokenUser, getJwtSecret(), { expiresIn: '7d' });

    res.json({
      message: 'Login successful!',
      token,
      user: tokenUser
    });
  });
});

// Get Current User Profile
router.get('/me', authenticateToken, (req, res) => {
  db.get('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) return res.status(404).json({ message: 'User profile not found.' });
    res.json(user);
  });
});

// Update Profile
router.put('/profile', authenticateToken, (req, res) => {
  const { name, phone } = req.body;
  db.run(
    'UPDATE users SET name = ?, phone = ? WHERE id = ?',
    [name, phone, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ message: 'Failed to update profile.' });
      res.json({ message: 'Profile updated successfully.' });
    }
  );
});

// Update Password
router.put('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  db.get('SELECT password_hash FROM users WHERE id = ?', [req.user.id], async (err, user) => {
    if (err || !user) return res.status(404).json({ message: 'User not found.' });

    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    db.run('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.user.id], (err) => {
      if (err) return res.status(500).json({ message: 'Failed to update password.' });
      res.json({ message: 'Password changed successfully.' });
    });
  });
});

export default router;
