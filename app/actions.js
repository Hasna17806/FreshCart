'use server';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { pool } from '@/lib/db';
import { createSession, destroySession, getUser } from '@/lib/auth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signup(_prev, fd) {
  const v = Object.fromEntries(['name', 'email', 'phone', 'password', 'confirm'].map((k) => [k, String(fd.get(k) || '').trim()]));
  const values = { name: v.name, email: v.email, phone: v.phone };
  const fail = (error) => ({ error, values });
  if (Object.values(v).some((x) => !x)) return fail('All fields are required.');
  if (!EMAIL_RE.test(v.email)) return fail('Enter a valid email address.');
  if (v.password.length < 8) return fail('Password must be at least 8 characters.');
  if (v.password !== v.confirm) return fail('Passwords do not match.');

  const passwordHash = await bcrypt.hash(v.password, 10);
  try {
    await pool.query('INSERT INTO users(name,email,phone,password_hash) VALUES($1,$2,$3,$4)',
      [v.name, v.email.toLowerCase(), v.phone, passwordHash]);
  } catch (e) {
    if (e.code === '23505') return fail('This email is already registered.');
    throw e;
  }
  redirect('/login?registered=1'); // outside try/catch: redirect works by throwing
}

export async function login(_prev, fd) {
  const email = String(fd.get('email') || '').trim().toLowerCase();
  const password = String(fd.get('password') || '');
  const r = await pool.query('SELECT id,password_hash FROM users WHERE email=$1', [email]);
  const user = r.rows[0];
  const ok = user && (await bcrypt.compare(password, user.password_hash));
  if (!ok) return { error: 'Invalid email or password' }; // same message for both cases
  await createSession(user.id);
  redirect('/dashboard');
}

export async function logout() {
  await destroySession();
  redirect('/login');
}

// Totals are recomputed on the server from DB prices (never trust the browser). Money is in paise (integers).
export async function createBill({ items, customerName, customerPhone }) {
  const user = await getUser();
  if (!user) return { error: 'Not logged in' };
  if (!Array.isArray(items) || items.length === 0) return { error: 'Cart is empty' };

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let subtotal = 0;
    const lines = [];
    for (const it of items) {
      const qty = Number(it.qty);
      if (!Number.isInteger(qty) || qty < 1) throw new Error('Invalid quantity');
      // atomic stock check + reduce: fails if not enough stock
      const r = await client.query('UPDATE products SET stock=stock-$1 WHERE id=$2 AND stock>=$1 RETURNING name,price', [qty, it.id]);
      if (!r.rowCount) throw new Error('Not enough stock for one of the items');
      const price = Math.round(Number(r.rows[0].price) * 100);
      lines.push({ id: it.id, name: r.rows[0].name, qty, price, total: price * qty });
      subtotal += price * qty;
    }
    const gst = Math.round(subtotal * 0.05);
    const grand = subtotal + gst;
    const b = await client.query(
      'INSERT INTO bills(customer_name,customer_phone,subtotal,gst,grand_total,created_by) VALUES($1,$2,$3,$4,$5,$6) RETURNING id',
      [customerName?.trim() || null, customerPhone?.trim() || null, subtotal / 100, gst / 100, grand / 100, user.id]);
    for (const l of lines) {
      await client.query('INSERT INTO bill_items(bill_id,product_id,name,price,qty,line_total) VALUES($1,$2,$3,$4,$5,$6)',
        [b.rows[0].id, l.id, l.name, l.price / 100, l.qty, l.total / 100]);
    }
    await client.query('COMMIT');
    return { id: b.rows[0].id };
  } catch (e) {
    await client.query('ROLLBACK');
    return { error: e.message };
  } finally {
    client.release();
  }
}
