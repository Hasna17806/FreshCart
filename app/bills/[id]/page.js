import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import PrintButton from '@/components/PrintButton';
import { pool } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { inr, billNo } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function Receipt({ params }) {
  const user = await requireUser();
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const b = (await pool.query('SELECT * FROM bills WHERE id=$1', [id])).rows[0];
  if (!b) notFound();
  const items = (await pool.query('SELECT * FROM bill_items WHERE bill_id=$1 ORDER BY id', [id])).rows;
  return (
    <>
      <Nav user={user} />
      <div className="wrap">
        <div className="receipt">
          <h2 style={{ textAlign: 'center', margin: 0 }}>FreshCart</h2>
          <p style={{ textAlign: 'center', marginTop: 0 }}>Market Road, Kannur · +91 98765 43210</p>
          <div>Bill no: <strong>{billNo(b.id)}</strong></div>
          <div>Date: {new Date(b.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
          {b.customer_name && <div>Customer: {b.customer_name}</div>}
          {b.customer_phone && <div>Phone: {b.customer_phone}</div>}
          <table style={{ margin: '12px 0' }}>
            <thead><tr><th>Item</th><th className="r">Qty</th><th className="r">Price</th><th className="r">Total</th></tr></thead>
            <tbody>{items.map((i) => (
              <tr key={i.id}><td>{i.name}</td><td className="r">{i.qty}</td><td className="r">{inr(i.price)}</td><td className="r">{inr(i.line_total)}</td></tr>
            ))}</tbody>
          </table>
          <div className="tot"><span>Subtotal</span><span>{inr(b.subtotal)}</span></div>
          <div className="tot"><span>GST (5%)</span><span>{inr(b.gst)}</span></div>
          <div className="tot grand"><span>Grand total</span><span>{inr(b.grand_total)}</span></div>
          <p style={{ textAlign: 'center' }}>Thank you! Visit again.</p>
        </div>
        <p style={{ textAlign: 'center' }}><PrintButton /></p>
      </div>
    </>
  );
}
