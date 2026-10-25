import Link from 'next/link';
import { logout } from '@/app/actions';

export default function Nav({ user }) {
  return (
    <div className="nav">
      <Link href={user ? '/dashboard' : '/'} className="brand">🥬 FreshCart</Link>
      <div>
        {user ? (<>
          <span>{user.name}</span>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/pos">POS</Link>
          <Link href="/bills">Bills</Link>
          <form action={logout} style={{ display: 'inline' }}>
            <button className="btn light small" style={{ marginLeft: 12 }}>Logout</button>
          </form>
        </>) : (<>
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign up</Link>
        </>)}
      </div>
    </div>
  );
}
