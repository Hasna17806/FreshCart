import Link from 'next/link';
import { redirect } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { login } from '@/app/actions';
import { getUser } from '@/lib/auth';

export default async function LoginPage({ searchParams }) {
  if (await getUser()) redirect('/dashboard');
  const { registered } = await searchParams;
  const fields = [
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Your password', autoComplete: 'current-password' },
  ];
  return (
    <AuthForm
      action={login} fields={fields} submitLabel="Login"
      title="Welcome back" subtitle="Log in to open the dashboard and billing."
      notice={registered ? 'Account created. Please log in.' : null}
      footer={<>New here? <Link href="/signup">Create an account</Link></>}
    />
  );
}