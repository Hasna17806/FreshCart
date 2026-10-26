
import Link from 'next/link';
import { redirect } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { login } from '@/app/actions';
import { getUser } from '@/lib/auth';

export default async function AdminLoginPage() {
  const user = await getUser();

  if (user) {
    if (user.role === 'admin') {
      redirect('/admin');
    }

    return (
      <main className="wrap">
        <h1>Admin Login</h1>
        <p>You are logged in as a staff user.</p>
        <p>Please log out before signing in as an admin.</p>
        <Link className="btn light" href="/dashboard">
          Back to Dashboard
        </Link>
      </main>
    );
  }

  const fields = [
    {
      name: 'email',
      label: 'Admin Email',
      type: 'email',
      placeholder: 'admin@example.com',
      autoComplete: 'email',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Your password',
      autoComplete: 'current-password',
    },
  ];

  return (
   <AuthForm
  action={login}
  fields={fields}
  submitLabel="Admin Login"
  title="FreshCart Admin"
  subtitle="Sign in to manage products, inventory, and bills."
  hiddenFields={{ loginType: 'admin' }}
  footer={
    <Link href="/login">Go to Staff Login</Link>
  }
/>
  );
}
