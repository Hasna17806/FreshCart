import Link from 'next/link';
import Nav from '@/components/Nav';
import { pool } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { inr, billNo } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function Bills() {
  const user = await requireUser();
  const { rows } = await pool.query(`
    SELECT b.id,b.created_at,b.grand_total,(SELECT COALESCE(SUM(qty),0)::int FROM bill_items WHERE bill_id=b.id) AS items
    FROM bills b ORDER BY b.created_at DESC, b.id DESC`);
  return (
    <>
      <Nav user={user} />
      <div className="wrap">
        <h1>Bill history</h1>
        <table>
          <thead><tr><th>Bill no.</th><th>Date</th><th className="r">Items</th><th className="r">Total</th></tr></thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id}>
                <td><Link href={`/bills/${b.id}`}>{billNo(b.id)}</Link></td>
                <td>{new Date(b.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                <td className="r">{b.items}</td><td className="r">{inr(b.grand_total)}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4}>No bills yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
