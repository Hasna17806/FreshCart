
import Link from 'next/link';
import { pool } from '@/lib/db';
import { getUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const ICONS = [
  ['rice', '🍚'],
  ['dal', '🫘'],
  ['oil', '🫒'],
  ['milk', '🥛'],
  ['bread', '🍞'],
  ['egg', '🥚'],
  ['tomato', '🍅'],
  ['onion', '🧅'],
  ['banana', '🍌'],
  ['tea', '🍵'],
];

const iconFor = (name) =>
  ICONS.find(([key]) => name.toLowerCase().includes(key))?.[1] || '🛒';

export default async function Landing() {
  const user = await getUser();

  const { rows: products } = await pool.query(
    'SELECT id, name, price, stock FROM products ORDER BY id LIMIT 8'
  );

  const shopHref = user ? '/pos' : '/login';

  return (
    <main className="fc-page">
      <div className="fc-container">
        <header className="fc-header">
          <Link href="/" className="fc-logo">
            <span className="fc-logo-icon">🥬</span>
            <span>FreshCart<span className="fc-logo-dot">.</span></span>
          </Link>

          <nav className="fc-nav">
            <a href="#products" className="fc-nav-link">Our products</a>

            {user ? (
              <Link href="/dashboard" className="fc-button fc-button-dark">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="fc-login">Log in</Link>
                <Link href="/signup" className="fc-button fc-button-dark">
                  Get started <span>↗</span>
                </Link>
              </>
            )}
          </nav>
        </header>

        <section className="fc-hero">
          <div className="fc-hero-copy">
            <div className="fc-eyebrow">
              <span className="fc-live-dot" />
              YOUR NEIGHBOURHOOD GROCERY STORE
            </div>

            <h1>
              Good food.
              <br />
              <span>Good mood.</span>
            </h1>

            <p className="fc-hero-description">
              Everyday essentials, fresh from your neighbourhood shop.
              Quality groceries, simple shopping, all in one place.
            </p>

            <div className="fc-hero-actions">
              <a href="#products" className="fc-button fc-button-lime">
                Explore groceries <span>↗</span>
              </a>
              <span className="fc-trust-note">Fresh picks, every day.</span>
            </div>

            <div className="fc-hero-bottom">
              <span>🥬 Fresh essentials</span>
              <span>·</span>
              <span>🛍️ Easy shopping</span>
            </div>
          </div>

          <div className="fc-hero-visual" aria-hidden="true">
            <div className="fc-visual-circle fc-circle-one" />
            <div className="fc-visual-circle fc-circle-two" />

            <div className="fc-floating-label">
              <span>✳</span> A little freshness goes a long way
            </div>

            <div className="fc-produce">
              <span className="fc-fruit fc-fruit-avocado">🥑</span>
              <span className="fc-fruit fc-fruit-tomato">🍅</span>
              <span className="fc-fruit fc-fruit-carrot">🥕</span>
              <span className="fc-fruit fc-fruit-lemon">🍋</span>
              <span className="fc-fruit fc-fruit-banana">🍌</span>
              <span className="fc-fruit fc-fruit-pepper">🫑</span>
            </div>

            <div className="fc-fresh-stamp">
              <span>✳</span>
              <strong>FRESH</strong>
              <small>EVERY DAY</small>
            </div>
          </div>
        </section>

        <section className="fc-products-section" id="products">
          <div className="fc-section-heading">
            <div>
              <span className="fc-section-kicker">GOOD THINGS, RIGHT HERE</span>
              <h2>Everyday favourites<span>.</span></h2>
              <p>Your essentials, ready when you are.</p>
            </div>

            <Link href={shopHref} className="fc-view-all">
              Shop all products <span>→</span>
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="fc-empty">
              <span>🛒</span>
              <h3>Your shelves are waiting</h3>
              <p>Products will appear here once they're added to FreshCart.</p>
            </div>
          ) : (
            <div className="fc-product-grid">
              {products.map((product, index) => (
                <article className="fc-product-card" key={product.id}>
                  <div className={`fc-product-art fc-art-${index % 4}`}>
                    <span className="fc-product-category">
                      {product.stock > 0 ? 'IN STOCK' : 'SOLD OUT'}
                    </span>
                    <span className="fc-product-emoji" aria-hidden="true">
                      {iconFor(product.name)}
                    </span>
                  </div>

                  <div className="fc-product-info">
                    <p className="fc-product-category-text">
                      EVERYDAY ESSENTIAL
                    </p>
                    <h3>{product.name}</h3>

                    <div className="fc-product-bottom">
                      <div>
                        <span className="fc-price-label">Price</span>
                        <strong className="fc-price">
                          ₹{Number(product.price).toFixed(2)}
                        </strong>
                      </div>

                      <Link
                        href={shopHref}
                        className={`fc-add-button ${product.stock <= 0 ? 'fc-add-disabled' : ''}`}
                        aria-label={`${product.stock > 0 ? 'Shop' : 'View'} ${product.name}`}
                      >
                        {product.stock > 0 ? '+' : '→'}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="fc-bottom-banner">
          <div>
            <span className="fc-section-kicker">YOUR LOCAL GROCERY STORE</span>
            <h2>Fresh choices. Everyday ease.</h2>
            <p>Everything you need for your everyday kitchen.</p>
          </div>

          <Link href={shopHref} className="fc-button fc-button-lime">
            Start shopping <span>↗</span>
          </Link>
        </section>

        <footer className="fc-footer">
          <Link href="/" className="fc-logo fc-footer-logo">
            🥬 FreshCart<span className="fc-logo-dot">.</span>
          </Link>

          <p>Fresh essentials for everyday living.</p>

          <a href="#products" className="fc-footer-link">Explore products ↑</a>

          <div className="fc-footer-bottom">
            <span>© {new Date().getFullYear()} FreshCart</span>
            <span>Made for everyday freshness.</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
