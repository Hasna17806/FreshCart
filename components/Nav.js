
import Link from 'next/link';
import { logout } from '@/app/actions';

export default function Nav({ user }) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link
          href={user ? '/dashboard' : '/'}
          className="app-logo"
        >
          <span className="app-logo-icon">🥬</span>
          <span>FreshCart<span className="app-logo-dot">.</span></span>
        </Link>

        {user && (
          <nav className="app-nav-links" aria-label="Main navigation">
            <Link href="/dashboard" className="app-nav-link">
              Dashboard
            </Link>
            <Link href="/pos" className="app-nav-link">
              POS Billing
            </Link>
            <Link href="/bills" className="app-nav-link">
              Bill History
            </Link>

            {user.role === 'admin' && (
              <Link href="/admin" className="app-nav-link app-admin-link">
                Admin
              </Link>
            )}
          </nav>
        )}

        <div className="app-header-right">
          {user ? (
            <>
              <div className="app-user">
                <span className="app-user-avatar">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
                <div className="app-user-info">
                  <span className="app-user-name">{user.name}</span>
                  <span className="app-user-role">
                    {user.role === 'admin' ? 'Administrator' : 'Staff account'}
                  </span>
                </div>
              </div>

              <form action={logout}>
                <button className="app-logout" type="submit">
                  Log out <span>↗</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="app-login-link">Log in</Link>
              <Link href="/signup" className="app-signup-link">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
