'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBill } from '@/app/actions';

const toPaise = (rupees) => Math.round(rupees * 100);
const inr = (paise) => '₹' + (paise / 100).toFixed(2);

export default function Pos({ products }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [cart, setCart] = useState({}); 
  const [cust, setCust] = useState({ name: '', phone: '' });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const shown = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  const setQty = (id, qty) => {
    const max = byId[id].stock;
    setMsg('');
    if (qty > max) { setMsg(`Only ${max} in stock for ${byId[id].name}`); qty = max; }
    setCart((c) => {
      const n = { ...c };
      if (qty < 1) delete n[id]; else n[id] = qty;
      return n;
    });
  };

  const lines = Object.entries(cart).map(([id, qty]) => {
    const p = byId[id];
    return { id: p.id, name: p.name, qty, price: toPaise(p.price), total: toPaise(p.price) * qty };
  });
  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const gst = Math.round(subtotal * 0.05);
  const grand = subtotal + gst;

  async function generate() {
    setBusy(true); setMsg('');
    const res = await createBill({ items: lines.map((l) => ({ id: l.id, qty: l.qty })), customerName: cust.name, customerPhone: cust.phone });
    if (res.error) { setMsg(res.error); setBusy(false); return; }
    setCart({}); // cart clears after the bill is saved
    router.push(`/bills/${res.id}`);
  }

  return (
    <div className="pos">
      <div>
        <input className="input" placeholder="Search products by name" value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 12 }} />
        <div className="grid">
          {shown.map((p) => (
            <button key={p.id} className="card click" disabled={p.stock === 0} onClick={() => setQty(p.id, (cart[p.id] || 0) + 1)}>
              <strong>{p.name}</strong>
              <div>₹{p.price.toFixed(2)}</div>
              <small className={p.stock < 5 ? 'warn' : ''}>{p.stock === 0 ? 'Out of stock' : `Stock: ${p.stock}${p.stock < 5 ? ' (low)' : ''}`}</small>
            </button>
          ))}
          {shown.length === 0 && <p>No products found.</p>}
        </div>
      </div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Cart</h3>
        {lines.length === 0 && <p>Click a product to add it.</p>}
        {lines.map((l) => (
          <div key={l.id} style={{ marginBottom: 8 }}>
            <div>{l.name} — {inr(l.price)}</div>
            <button className="btn small" onClick={() => setQty(l.id, l.qty - 1)}>−</button>{' '}
            {l.qty}{' '}
            <button className="btn small" onClick={() => setQty(l.id, l.qty + 1)}>+</button>{' '}
            <button className="btn light small" onClick={() => setQty(l.id, 0)}>Remove</button>
            <span style={{ float: 'right' }}>{inr(l.total)}</span>
          </div>
        ))}
        <div className="tot"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
        <div className="tot"><span>GST (5%)</span><span>{inr(gst)}</span></div>
        <div className="tot grand"><span>Grand total</span><span>{inr(grand)}</span></div>
        <input className="input" placeholder="Customer name (optional)" value={cust.name} onChange={(e) => setCust({ ...cust, name: e.target.value })} style={{ marginTop: 12 }} />
        <input className="input" placeholder="Customer phone (optional)" value={cust.phone} onChange={(e) => setCust({ ...cust, phone: e.target.value })} style={{ marginTop: 8 }} />
        {msg && <div className="error">{msg}</div>}
        <button className="btn" style={{ marginTop: 12, width: '100%' }} disabled={!lines.length || busy} onClick={generate}>
          {busy ? 'Saving…' : 'Generate bill'}
        </button>
      </div>
    </div>
  );
}
