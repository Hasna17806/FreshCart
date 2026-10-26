
import Link from 'next/link';
import Nav from '@/components/Nav';
import { pool } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { inr } from '@/lib/format';
import AddProductForm from './AddProductForm';
import ProductActions from './ProductActions';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const user = await requireAdmin();

  const result = await pool.query(
    'SELECT id, name, price, stock FROM products ORDER BY id DESC'
  );

  return (
    <>
      <Nav user={user} />

      <div className="wrap">
        <h1>Manage Products</h1>

        <p>
          <Link className="btn light" href="/admin">
            Back to Admin Dashboard
          </Link>
        </p>

        <AddProductForm />

        <div className="card" style={{ marginTop: 16 }}>
          <h2>Product Inventory ({result.rows.length})</h2>

          {result.rows.length === 0 ? (
            <p>No products found.</p>
          ) : (
            result.rows.map((product) => (
              <div
                key={product.id}
                style={{
                  padding: '12px 0',
                  borderBottom: '1px solid #ddd',
                }}
              >
                <strong>{product.name}</strong>
                <p>Price: {inr(product.price)}</p>
                <p>Stock: {product.stock}</p>

                <ProductActions product={product} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
