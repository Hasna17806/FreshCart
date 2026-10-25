import Link from 'next/link';
import { redirect } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { signup } from '@/app/actions';
import { getUser } from '@/lib/auth';

export default async function SignupPage() {
  if (await getUser()) redirect('/dashboard');
  const fields = [
    { name: 'name', label: 'Full name', placeholder: 'Your full name', autoComplete: 'name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: '98765 43210', autoComplete: 'tel' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'At least 8 characters', autoComplete: 'new-password' },
    { name: 'confirm', label: 'Confirm password', type: 'password', placeholder: 'Repeat the password', autoComplete: 'new-password' },
  ];
  return (
    <AuthForm
      action={signup} fields={fields} submitLabel="Create account"
      title="Create your account" subtitle="Staff sign up for FreshCart billing."
      footer={<>Already registered? <Link href="/login">Login</Link></>}
    />
  );
}