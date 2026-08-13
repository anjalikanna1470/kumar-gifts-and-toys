import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../data/kumargifts.sqlite');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure uploads directory exists
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initDatabase();
  }
});

function initDatabase() {
  db.serialize(() => {
    // 1. Users Table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'CUSTOMER',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Categories Table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        image_url TEXT,
        description TEXT,
        is_featured INTEGER DEFAULT 1
      )
    `);

    // 3. Products Table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        short_description TEXT,
        price REAL NOT NULL,
        discount_price REAL,
        category_id INTEGER,
        stock INTEGER DEFAULT 10,
        is_customizable INTEGER DEFAULT 0,
        customization_type TEXT,
        rating REAL DEFAULT 4.5,
        review_count INTEGER DEFAULT 1,
        sku TEXT,
        tags TEXT,
        occasion TEXT,
        is_featured INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )
    `);

    // 4. Product Images Table
    db.run(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        image_url TEXT NOT NULL,
        is_primary INTEGER DEFAULT 0,
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
      )
    `);

    // 5. Product Variants Table
    db.run(`
      CREATE TABLE IF NOT EXISTS product_variants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        variant_name TEXT,
        variant_value TEXT,
        extra_price REAL DEFAULT 0,
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
      )
    `);

    // 6. Orders Table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE NOT NULL,
        user_id INTEGER,
        total_amount REAL NOT NULL,
        discount_amount REAL DEFAULT 0,
        delivery_charge REAL DEFAULT 0,
        payment_method TEXT NOT NULL,
        payment_status TEXT DEFAULT 'Pending',
        order_status TEXT DEFAULT 'Placed',
        delivery_address TEXT NOT NULL,
        tracking_number TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // 7. Order Items Table
    db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        product_id INTEGER,
        product_title TEXT,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        variant_info TEXT,
        customization_info TEXT,
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products (id)
      )
    `);

    // 8. Custom Orders Queue Table
    db.run(`
      CREATE TABLE IF NOT EXISTS custom_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        user_id INTEGER,
        product_id INTEGER,
        custom_text TEXT,
        font_style TEXT,
        text_color TEXT,
        uploaded_image_url TEXT,
        special_instructions TEXT,
        status TEXT DEFAULT 'Pending Review',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // 9. Reviews Table
    db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        user_id INTEGER,
        user_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        image_url TEXT,
        is_verified_buyer INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // 10. Saved Addresses Table
    db.run(`
      CREATE TABLE IF NOT EXISTS addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        street TEXT NOT NULL,
        landmark TEXT,
        city TEXT DEFAULT 'Ongole',
        state TEXT DEFAULT 'Andhra Pradesh',
        pincode TEXT DEFAULT '523001',
        is_default INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Seed data ONLY IF database is completely empty
    seedData();
  });
}

function seedData() {
  db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
    if (row && row.count === 0) {
      console.log('Seeding initial database data...');
      
      const adminEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@kumargifts.com').toLowerCase();
      const rawAdminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'ChangeMeProdSecret2026!';
      
      if (!process.env.INITIAL_ADMIN_PASSWORD && process.env.NODE_ENV === 'production') {
        console.warn('⚠️ WARNING: INITIAL_ADMIN_PASSWORD not set in environment. Using generated seed admin password.');
      }

      const adminPass = await bcrypt.hash(rawAdminPassword, 10);
      const demoCustomerPass = await bcrypt.hash('CustomerPass2026!', 10);

      db.run(
        `INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
        ['Kumar Store Admin', adminEmail, '09966327229', adminPass, 'ADMIN']
      );

      db.run(
        `INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
        ['Anjali Rao', 'customer@gmail.com', '9876543210', demoCustomerPass, 'CUSTOMER']
      );

      // Seed Categories
      const categories = [
        { name: 'Customized Gifts', slug: 'customized-gifts', img: '/images/custom_mug.png', desc: 'Personalized mugs, pillows, photo frames with your memories.' },
        { name: 'Toys & Games', slug: 'toys', img: '/images/plush_teddy.png', desc: 'Soft plush toys, remote control cars, educational puzzles & dolls.' },
        { name: 'Mugs & Drinkware', slug: 'mugs', img: '/images/custom_mug.png', desc: 'Custom printed ceramic mugs, magic magic mugs, couple sets.' },
        { name: 'Custom Pillows', slug: 'pillows', img: '/images/custom_pillow.png', desc: 'Heart LED cushions, sequin magic cushions & photo printed pillows.' },
        { name: 'Birthday Gifts', slug: 'birthday-gifts', img: '/images/birthday_hamper.png', desc: 'Surprise hampers, birthday mugs, chocolates & plush sets.' },
        { name: 'Photo Frames', slug: 'photo-frames', img: '/images/photo_frame.png', desc: '3D acrylic LED night lamps, wooden collage frames.' },
        { name: 'Anniversary & Couple Gifts', slug: 'anniversary-gifts', img: '/images/custom_pillow.png', desc: 'Romantic couple hampers, matching mugs & customized keepsake frames.' },
        { name: 'Gift Hampers', slug: 'gift-hampers', img: '/images/birthday_hamper.png', desc: 'All-in-one curated celebration surprise boxes.' },
      ];

      for (const cat of categories) {
        db.run(
          `INSERT INTO categories (name, slug, image_url, description) VALUES (?, ?, ?, ?)`,
          [cat.name, cat.slug, cat.img, cat.desc]
        );
      }

      // Seed Products
      const products = [
        {
          title: 'Customized Ceramic Photo Mug',
          slug: 'customized-ceramic-photo-mug',
          description: 'High quality 325ml glossy ceramic coffee mug customized with your favorite high-resolution photo and custom text message. Microwave safe and dishwasher safe with permanent non-fading HD sublimated print.',
          short: 'Personalized ceramic coffee mug with your custom photo & message.',
          price: 349,
          discount_price: 249,
          category_id: 1,
          stock: 50,
          is_customizable: 1,
          customization_type: 'mug',
          rating: 4.8,
          review_count: 24,
          sku: 'KGT-MUG-001',
          tags: 'mug,photo,custom,birthday,gift',
          occasion: 'Birthday, Anniversary, Couple',
          is_featured: 1,
          images: ['/images/custom_mug.png']
        },
        {
          title: 'Customized Heart Plush Photo Pillow',
          slug: 'customized-heart-plush-photo-pillow',
          description: 'Ultra-soft fluffy velvet heart-shaped cushion with high-definition digital photo print in the center. Comes with soft washable cotton filling. Perfect for romantic occasions, birthdays, and anniversaries.',
          short: 'Romantic velvet heart cushion customized with your photo.',
          price: 699,
          discount_price: 499,
          category_id: 4,
          stock: 30,
          is_customizable: 1,
          customization_type: 'pillow',
          rating: 4.9,
          review_count: 18,
          sku: 'KGT-PIL-002',
          tags: 'pillow,cushion,heart,couple,romantic,custom',
          occasion: 'Anniversary, Couple, Birthday',
          is_featured: 1,
          images: ['/images/custom_pillow.png']
        },
        {
          title: 'Giant Huggable Plush Teddy Bear (3 Feet)',
          slug: 'giant-huggable-plush-teddy-bear',
          description: 'Premium quality non-toxic 3-foot giant brown teddy bear with cute red satin ribbon bow. Extra soft plush fabric, child-friendly, washable and stuffed with premium virgin fiber.',
          short: 'Adorable 3-foot fluffy plush teddy bear with ribbon bow.',
          price: 1299,
          discount_price: 999,
          category_id: 2,
          stock: 15,
          is_customizable: 0,
          customization_type: null,
          rating: 4.7,
          review_count: 12,
          sku: 'KGT-TOY-003',
          tags: 'teddy,toy,plush,kids,birthday',
          occasion: 'Birthday, Kids, Special Occasions',
          is_featured: 1,
          images: ['/images/plush_teddy.png']
        },
        {
          title: '3D Acrylic LED Illusion Photo Night Lamp',
          slug: '3d-acrylic-led-illusion-photo-night-lamp',
          description: 'Custom laser engraved 3D acrylic illusion lamp that glows softly in warm light. Features customized photo etching with romantic message on a solid wooden base with USB power cord.',
          short: 'Warm glowing custom engraved 3D acrylic LED photo lamp.',
          price: 899,
          discount_price: 649,
          category_id: 6,
          stock: 25,
          is_customizable: 1,
          customization_type: 'frame',
          rating: 4.9,
          review_count: 15,
          sku: 'KGT-FRM-004',
          tags: 'frame,lamp,led,nightlamp,custom,anniversary',
          occasion: 'Anniversary, Couple, Housewarming',
          is_featured: 1,
          images: ['/images/photo_frame.png']
        },
        {
          title: 'Luxury Celebration Birthday Gift Hamper',
          slug: 'luxury-celebration-birthday-gift-hamper',
          description: 'All-in-one celebration hamper basket packed with 1 Custom Mug, 1 Cute Mini Teddy Bear, 2 Premium Ferrero Rocher packs, 1 Birthday Greeting Card, and golden ribbon decoration.',
          short: 'Curated birthday surprise basket with custom mug & chocolates.',
          price: 1499,
          discount_price: 1199,
          category_id: 8,
          stock: 20,
          is_customizable: 1,
          customization_type: 'mug',
          rating: 4.8,
          review_count: 9,
          sku: 'KGT-HMP-005',
          tags: 'hamper,chocolates,teddy,mug,birthday,giftbox',
          occasion: 'Birthday, Special Occasions',
          is_featured: 1,
          images: ['/images/birthday_hamper.png']
        },
      ];

      for (const prod of products) {
        db.run(
          `INSERT INTO products (title, slug, description, short_description, price, discount_price, category_id, stock, is_customizable, customization_type, rating, review_count, sku, tags, occasion, is_featured)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [prod.title, prod.slug, prod.description, prod.short, prod.price, prod.discount_price, prod.category_id, prod.stock, prod.is_customizable, prod.customization_type, prod.rating, prod.review_count, prod.sku, prod.tags, prod.occasion, prod.is_featured],
          function (err) {
            if (!err && this.lastID) {
              const productId = this.lastID;
              for (let i = 0; i < prod.images.length; i++) {
                db.run(
                  `INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)`,
                  [productId, prod.images[i], i === 0 ? 1 : 0]
                );
              }

              if (prod.customization_type === 'mug') {
                db.run(`INSERT INTO product_variants (product_id, variant_name, variant_value) VALUES (?, 'Color', 'White Gloss')`, [productId]);
                db.run(`INSERT INTO product_variants (product_id, variant_name, variant_value) VALUES (?, 'Color', 'Inner Red Accent')`, [productId]);
                db.run(`INSERT INTO product_variants (product_id, variant_name, variant_value) VALUES (?, 'Color', 'Magic Black Heat Reveal')`, [productId]);
              } else if (prod.customization_type === 'pillow') {
                db.run(`INSERT INTO product_variants (product_id, variant_name, variant_value, extra_price) VALUES (?, 'Size', '12x12 inch Standard', 0)`, [productId]);
                db.run(`INSERT INTO product_variants (product_id, variant_name, variant_value, extra_price) VALUES (?, 'Size', '16x16 inch Large', 150)`, [productId]);
              }

              db.run(
                `INSERT INTO reviews (product_id, user_name, rating, comment, is_verified_buyer) VALUES (?, ?, ?, ?, 1)`,
                [productId, 'Srinivas R.', 5, 'Bought this for my wife\'s birthday in Ongole! Excellent print quality and fast local delivery within 1 day. Highly recommended!']
              );
            }
          }
        );
      }

      console.log('Database initial seed complete!');
    }
  });
}

export default db;
