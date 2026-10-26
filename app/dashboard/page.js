
import Link from 'next/link';
import Nav from '@/components/Nav';
import { pool } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { inr } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const user = await requireUser();

  const [today, low, products] = await Promise.all([
    pool.query(`
      SELECT COUNT(*)::int AS count,
             COALESCE(SUM(grand_total), 0) AS total
      FROM bills
      WHERE created_at::date = CURRENT_DATE
    `),
    pool.query(`
      SELECT id, name, stock
      FROM products
      WHERE stock < 5
      ORDER BY stock ASC
    `),
    pool.query('SELECT COUNT(*)::int AS count FROM products'),
  ]);

  const sales = today.rows[0];
  const lowStock = low.rows;
  const productCount = products.rows[0].count;

  return (
    <>
      <Nav user={user} />

      <main className="dash-page">
        <div className="dash-container">
          <section className="dash-welcome">
            <div>
              <span className="dash-eyebrow">FRESHCART WORKSPACE</span>
              <h1>Good to see you, {user.name}!</h1>
              <p>
                Here&apos;s what&apos;s happening at your store today.
              </p>
            </div>

            <div className="dash-date">
              <span>YOUR ACCOUNT</span>
              <strong>{user.role === 'admin' ? 'Administrator' : 'Staff member'}</strong>
              <small>{user.email}</small>
            </div>
          </section>

          <section className="dash-stats">
            <article className="dash-stat">
              <div className="dash-stat-top">
                <span className="dash-stat-label">Today&apos;s sales</span>
                <span className="dash-stat-icon">₹</span>
              </div>
              <strong className="dash-stat-value">{inr(sales.total)}</strong>
              <span className="dash-stat-note">Total value of bills today</span>
            </article>

            <article className="dash-stat">
              <div className="dash-stat-top">
                <span className="dash-stat-label">Bills today</span>
                <span className="dash-stat-icon">▤</span>
              </div>
              <strong className="dash-stat-value">{sales.count}</strong>
              <span className="dash-stat-note">Bills created today</span>
            </article>

            <article className="dash-stat">
              <div className="dash-stat-top">
                <span className="dash-stat-label">Products</span>
                <span className="dash-stat-icon">▦</span>
              </div>
              <strong className="dash-stat-value">{productCount}</strong>
              <span className="dash-stat-note">Products in inventory</span>
            </article>

            <article className={`dash-stat ${lowStock.length ? 'dash-stat-alert' : ''}`}>
              <div className="dash-stat-top">
                <span className="dash-stat-label">Low-stock items</span>
                <span className="dash-stat-icon">!</span>
              </div>
              <strong className="dash-stat-value">{lowStock.length}</strong>
              <span className="dash-stat-note">
                {lowStock.length ? 'Items need attention' : 'Inventory looks good'}
              </span>
            </article>
          </section>

          <section className="dash-main-grid">
            <div className="dash-panel">
              <div className="dash-panel-heading">
                <div>
                  <span className="dash-eyebrow">GET THINGS DONE</span>
                  <h2>Quick actions</h2>
                </div>
              </div>

              <div className="dash-actions-grid">
                <Link href="/pos" className="dash-action">
                  <span className="dash-action-icon">🛒</span>
                  <span>
                    <strong>New bill</strong>
                    <small>Create a customer bill</small>
                  </span>
                  <span className="dash-arrow">↗</span>
                </Link>

                <Link href="/bills" className="dash-action">
                  <span className="dash-action-icon">🧾</span>
                  <span>
                    <strong>Bill history</strong>
                    <small>View previous bills</small>
                  </span>
                  <span className="dash-arrow">↗</span>
                </Link>

                {user.role === 'admin' && (
                  <>
                    <Link href="/admin" className="dash-action">
                      <span className="dash-action-icon">📊</span>
                      <span>
                        <strong>Admin dashboard</strong>
                        <small>Review sales and orders</small>
                      </span>
                      <span className="dash-arrow">↗</span>
                    </Link>

                    <Link href="/admin/products" className="dash-action">
                      <span className="dash-action-icon">📦</span>
                      <span>
                        <strong>Manage products</strong>
                        <small>Update your inventory</small>
                      </span>
                      <span className="dash-arrow">↗</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

            <aside className="dash-panel dash-inventory">
              <div className="dash-panel-heading">
                <div>
                  <span className="dash-eyebrow">INVENTORY CHECK</span>
                  <h2>Stock alerts</h2>
                </div>
                <span className={`dash-alert-count ${lowStock.length ? '' : 'dash-alert-ok'}`}>
                  {lowStock.length}
                </span>
              </div>

              {lowStock.length === 0 ? (
                <div className="dash-empty">
                  <span>✓</span>
                  <strong>All looking good!</strong>
                  <p>No products have fewer than 5 items in stock.</p>
                </div>
              ) : (
                <>
                  <p className="dash-help">
                    These products have fewer than 5 items remaining.
                  </p>

                  <div className="dash-stock-list">
                    {lowStock.map((product) => (
                      <div className="dash-stock-row" key={product.id}>
                        <span className="dash-stock-icon">📦</span>
                        <span className="dash-stock-name">{product.name}</span>
                        <span className="dash-stock-qty">
                          {product.stock} left
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {user.role === 'admin' && (
                <Link href="/admin/products" className="dash-inventory-link">
                  Manage inventory <span>→</span>
                </Link>
              )}
            </aside>
          </section>

          <footer className="dash-footer">
            <span>🥬 FreshCart</span>
            <span>Fresh essentials. Smarter store management.</span>
          </footer>
        </div>
      </main>
    </>
  );
}
