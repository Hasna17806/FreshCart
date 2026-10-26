
require('dotenv').config({ path: '.env' });

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const products = [
  ['Basmati Rice 1kg', 120, 50],
  ['Toor Dal 1kg', 165, 40],
  ['Sunflower Oil 1L', 150, 30],
  ['Amul Milk 500ml', 30, 60],
  ['Brown Bread', 45, 25],
  ['Eggs (12)', 84, 20],
  ['Tomato 1kg', 40, 35],
  ['Onion 1kg', 35, 45],
  ['Banana 1 dozen', 60, 30],
  ['Tea Powder 250g', 130, 3],
];

(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      password_hash TEXT,
      role TEXT NOT NULL DEFAULT 'staff'
        CHECK (role IN ('admin', 'staff')),
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
      stock INT NOT NULL CHECK (stock >= 0)
    );

    CREATE TABLE IF NOT EXISTS bills (
      id SERIAL PRIMARY KEY,
      customer_name TEXT,
      customer_phone TEXT,
      subtotal NUMERIC(10,2) NOT NULL,
      gst NUMERIC(10,2) NOT NULL,
      grand_total NUMERIC(10,2) NOT NULL,
      created_by INT REFERENCES users(id),
      status TEXT NOT NULL DEFAULT 'completed'
        CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS bill_items (
      id SERIAL PRIMARY KEY,
      bill_id INT NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
      product_id INT REFERENCES products(id),
      name TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      qty INT NOT NULL,
      line_total NUMERIC(10,2) NOT NULL
    );

    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'staff';

    ALTER TABLE bills
      ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'completed';
  `);

  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS n FROM products'
  );

  if (rows[0].n === 0) {
    for (const [name, price, stock] of products) {
      await pool.query(
        'INSERT INTO products(name, price, stock) VALUES($1, $2, $3)',
        [name, price, stock]
      );
    }
    console.log('Seeded products');
  }

  console.log('Database ready');
  await pool.end();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
