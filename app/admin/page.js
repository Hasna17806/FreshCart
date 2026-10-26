
import Link from 'next/link';
import Nav from '@/components/Nav';
import { pool } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { inr } from '@/lib/format';
import OrderStatusForm from './OrderStatusForm';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const user = await requireAdmin();

  const [orders, products, sales] = await Promise.all([
    pool.query(`
      SELECT id, customer_name, customer_phone,
             grand_total, status, created_at
      FROM bills
      ORDER BY created_at DESC
      LIMIT 50
    `),
    pool.query(`
      SELECT COUNT(*)::int AS count
      FROM products
    `),
    pool.query(`
      SELECT COUNT(*)::int AS count,
             COALESCE(SUM(grand_total), 0) AS total
      FROM bills
      WHERE created_at::date = CURRENT_DATE
    `),
  ]);

  return (
    <>
      <Nav user={user} />

      <div className="wrap">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.name}!</p>

        <div className="card">
          <h2>Today&apos;s Sales</h2>
          <p>{sales.rows[0].count} bills</p>
          <p>{inr(sales.rows[0].total)}</p>
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <h2>Products</h2>
          <p>{products.rows[0].count} products in your inventory</p>
          <Link className="btn" href="/admin/products">
            Manage Products
          </Link>
        </div>

        <h2 style={{ marginTop: 24 }}>Recent Orders</h2>

        {orders.rows.length === 0 ? (
          <p>No orders or bills found yet.</p>
        ) : (
          <div className="card">
            {orders.rows.map((order) => (
              <div
                key={order.id}
                style={{
                  padding: '12px 0',
                  borderBottom: '1px solid #ddd',
                }}
              >
                <strong>Bill #{order.id}</strong>
                <p>
                  Customer: {order.customer_name || 'Walk-in customer'}
                </p>
                <p>Phone: {order.customer_phone || 'Not provided'}</p>
                <p>Total: {inr(order.grand_total)}</p>
               <p>
                Current status: <strong>{order.status}</strong>
                </p>

                <OrderStatusForm order={order} />

                <p>
                Date: {new Date(order.created_at).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        )}

        <p style={{ marginTop: 20 }}>
          <Link href="/dashboard">Back to Dashboard</Link>
        </p>
      </div>
    </>
  );
}
