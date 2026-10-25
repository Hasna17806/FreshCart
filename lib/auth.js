import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';
import { pool } from './db';

const hash = (t) => crypto.createHash('sha256').update(t).digest('hex');

export async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  await pool.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '1 day')", [hash(token), userId]);
  (await cookies()).set('sid', token, {
    httpOnly: true, sameSite: 'lax', path: '/', maxAge: 86400,
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function getUser() {
  const token = (await cookies()).get('sid')?.value;
  if (!token) return null;
  const r = await pool.query(
    'SELECT u.id,u.name,u.email,u.phone FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now()',
    [hash(token)]);
  return r.rows[0] || null;
}

// Server-side guard: call at the top of every protected page
export async function requireUser() {
  const user = await getUser();
  if (!user) redirect('/login');
  return user;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get('sid')?.value;
  if (token) await pool.query('DELETE FROM sessions WHERE token_hash=$1', [hash(token)]);
  jar.delete('sid');
}
