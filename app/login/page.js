import Link from 'next/link';
import { redirect } from 'next/navigation';
import Nav from '@/components/Nav';
import AuthForm from '@/components/AuthForm';
import { login } from '@/app/actions';
import { getUser } from '@/lib/auth';

export default async function LoginPage({ searchParams }) {
  if (await getUser()) redirect('/dashboard');
  const { registered } = await searchParams;
  const fields = [{ name: 'email', label: 'Email', type: 'email' }, { name: 'password', label: 'Password', type: 'password' }];
  return (<><Nav />
    <AuthForm action={login} fields={fields} submitLabel="Login" notice={registered ? 'Account created. Please log in.' : null} />
    <p style={{ textAlign: 'center' }}>New here? <Link href="/signup">Sign up</Link></p></>);
}
