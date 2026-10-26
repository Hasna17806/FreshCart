
'use client';

import { signIn } from 'next-auth/react';

export default function GoogleLoginButton() {
  return (
    <button
      type="button"
      className="fc-google-button"
      onClick={() =>
        signIn('google', {
          callbackUrl: '/api/auth/google-session',
        })
      }
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.06 13.22l7.98 6.19C12.94 13.72 18.01 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.95 46.98 31.7 46.98 24.55z"
        />
        <path
          fill="#FBBC05"
          d="M10.04 28.59A14.4 14.4 0 0 1 9.27 24c0-1.6.27-3.15.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.48-6.19z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-5.99 0-11.06-4.22-12.88-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
      </svg>

      <span>Continue with Google</span>
    </button>
  );
}
