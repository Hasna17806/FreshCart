
'use client';

import { signIn } from 'next-auth/react';

export default function GoogleLoginButton() {
  return (
    <button
      type="button"
      className="auth-btn"
      onClick={() => signIn('google', { callbackUrl: '/api/auth/google-session' })}
    >
      Continue with Google
    </button>
  );
}
