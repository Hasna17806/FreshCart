import Link from 'next/link';
import { redirect } from 'next/navigation';
import Nav from '@/components/Nav';
import AuthForm from '@/components/AuthForm';
import { signup } from '@/app/actions';
import { getUser } from '@/lib/auth';

export default async function SignupPage() {
  if (await getUser()) redirect('/dashboard');
  const fields = [
    { name: 'name', label: 'Full name' }, { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone', type: 'tel' }, { name: 'password', label: 'Password (min 8 characters)', type: 'password' },
    { name: 'confirm', label: 'Confirm password', type: 'password' },
  ];
  return (<><Nav /><AuthForm action={signup} fields={fields} submitLabel="Create account" />
    <p style={{ textAlign: 'center' }}>Already registered? <Link href="/login">Login</Link></p></>);
}
