import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';
import { pool } from './db';

const hash = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

export async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');

  await pool.query(
    `INSERT INTO sessions (token_hash, user_id, expires_at)
     VALUES ($1, $2, now() + interval '1 day')`,
    [hash(token), userId]
  );

  const cookieStore = await cookies();

  cookieStore.set('sid', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 86400,
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function getUser() {
  const token = (await cookies()).get('sid')?.value;

  if (!token) return null;

  const result = await pool.query(
    `SELECT
       u.id,
       u.name,
       u.email,
       u.phone,
       u.role
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1
       AND s.expires_at > now()`,
    [hash(token)]
  );

  return result.rows[0] || null;
}

export async function requireUser() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  return user;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('sid')?.value;

  if (token) {
    await pool.query(
      'DELETE FROM sessions WHERE token_hash = $1',
      [hash(token)]
    );
  }

  cookieStore.delete('sid');
}
