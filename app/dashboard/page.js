
import Link from 'next/link';
import Nav from '@/components/Nav';
import { pool } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { inr } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const user = await requireUser();

  const today = await pool.query(
    `SELECT COUNT(*)::int n,
            COALESCE(SUM(grand_total), 0) total
     FROM bills
     WHERE created_at::date = CURRENT_DATE`
  );

  const low = await pool.query(
    'SELECT name, stock FROM products WHERE stock < 5 ORDER BY stock'
  );

  return (
    <>
      <Nav user={user} />

      <div className="wrap">
        <h1>Welcome, {user.name}</h1>

        <p>
          Email: {user.email}
          <br />
          Phone: {user.phone}
        </p>

        <p>
          <Link className="btn" href="/pos">
            Open POS billing
          </Link>{' '}
          <Link className="btn light" href="/bills">
            Bill history
          </Link>
        </p>

        {user.role === 'admin' && (
          <div className="card" style={{ marginBottom: 12 }}>
            <h2>Admin Dashboard</h2>
            <p>Manage your products and track customer orders.</p>
            <Link className="btn" href="/admin">
              Open Admin Dashboard
            </Link>
          </div>
        )}

        <div className="card" style={{ marginBottom: 12 }}>
          <strong>Today&apos;s sales</strong>
          <div>
            {today.rows[0].n} bills · {inr(today.rows[0].total)}
          </div>
        </div>

        {low.rows.length > 0 && (
          <div className="card">
            <strong className="warn">Low stock</strong>
            {low.rows.map((p) => (
              <div key={p.name}>
                {p.name}: {p.stock} left
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
