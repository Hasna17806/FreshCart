// import Link from 'next/link';
// import Nav from '@/components/Nav';
// import { pool } from '@/lib/db';
// import { getUser } from '@/lib/auth';
// import { inr } from '@/lib/format';

// export const dynamic = 'force-dynamic';

// export default async function Landing() {
//   const user = await getUser();
//   const { rows: products } = await pool.query('SELECT id,name,price FROM products ORDER BY id LIMIT 8');
//   return (
//     <>
//       <Nav user={user} />
//       <section className="hero">
//         <h1>FreshCart</h1>
//         <p>Fresh groceries from your neighbourhood shop.</p>
//         <a href="#products" className="btn">Shop now</a>
//       </section>
//       <div className="wrap" id="products">
//         <h2>Our products</h2>
//         <div className="grid">
//           {products.map((p) => (
//             <div className="card" key={p.id}>
//               <div className="ph">🛒</div>
//               <strong>{p.name}</strong>
//               <div>{inr(p.price)}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <footer className="wrap" style={{ borderTop: '1px solid #ddd' }}>
//         <strong>Visit us</strong>
//         <div>FreshCart, Market Road, Kannur, Kerala 670001</div>
//         <div>Phone: +91 98765 43210</div>
//       </footer>
//     </>
//   );

// }





import Link from 'next/link';
import { pool } from '@/lib/db';
import { getUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const ICONS = [
  ['rice', '🍚'], ['dal', '🫘'], ['oil', '🫒'], ['milk', '🥛'], ['bread', '🍞'],
  ['egg', '🥚'], ['tomato', '🍅'], ['onion', '🧅'], ['banana', '🍌'], ['tea', '🍵'],
];
const iconFor = (name) => ICONS.find(([k]) => name.toLowerCase().includes(k))?.[1] || '🛒';
const TINTS = ['peach', 'pink', 'lime', 'lilac'];

export default async function Landing() {
  const user = await getUser();
  const { rows: products } = await pool.query('SELECT id,name,price,stock FROM products ORDER BY id LIMIT 8');
  const addHref = user ? '/pos' : '/login';
  return (
    <div className="land">
      <div className="shell">
        <section className="land-hero">
          <header className="land-nav">
            <span className="land-brand">🥬 FreshCart</span>
            <div className="land-actions">
              {user ? (
                <Link href="/dashboard" className="pill">Hi, {user.name} · Dashboard</Link>
              ) : (<>
                <Link href="/login" className="pill ghost">Login</Link>
                <Link href="/signup" className="pill">Sign up</Link>
              </>)}
            </div>
          </header>
          <div className="land-hero-body">
            <div>
              <h1>Freshness at<br />your doorstep</h1>
              <p>Fresh groceries from your neighbourhood shop, picked and billed with care.</p>
              <a href="#products" className="shop-btn">Shop now</a>
            </div>
            <div className="land-art" aria-hidden="true">🥕🍅🥑<br />🍌🍋🫑</div>
          </div>
        </section>

        <section id="products" className="land-products">
          {products.map((p, i) => (
            <div className={`pcard ${TINTS[i % 4]}`} key={p.id}>
              <span className="pprice">₹{Number(p.price).toFixed(0)}</span>
              <div className="picon">{iconFor(p.name)}</div>
              <strong>{p.name}</strong>
              <small>{p.stock > 0 ? 'Fresh stock' : 'Out of stock'}</small>
              <div className="pfoot">
                <span className="badge">Fresh</span>
                <Link href={addHref} className="padd" aria-label={`Add ${p.name}`}>+</Link>
              </div>
            </div>
          ))}
        </section>

        <footer className="land-foot">
          <strong>Visit us</strong> · FreshCart, Market Road, Kannur, Kerala 670001 · Phone: +91 98765 43210
        </footer>
      </div>
    </div>
  );
}
