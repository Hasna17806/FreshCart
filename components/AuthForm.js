
'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import GoogleLoginButton from '@/components/GoogleLoginButton';

export default function AuthForm({
  action,
  fields,
  submitLabel,
  title,
  subtitle,
  notice,
  footer,
  hiddenFields = {},
}) {
  const [state, formAction, pending] = useActionState(action, {});

  const isLogin = title === 'Welcome back';

  return (
    <main className="fc-auth-page">
      <div className="fc-auth-layout">
        {/* Left branding section */}
        <aside className="fc-auth-visual">
          <Link href="/" className="fc-auth-logo">
            <span>🥬</span>
            FreshCart<span className="fc-auth-dot">.</span>
          </Link>

          <div className="fc-auth-message">
            <span className="fc-auth-eyebrow">
              A FRESHER WAY TO SHOP
            </span>

            <h2>
              Fresh picks.
              <br />
              <span>Simpler days.</span>
            </h2>

            <p>
              Your neighbourhood grocery store, made easier.
              Sign in and get back to the things that matter.
            </p>
          </div>

          <div className="fc-auth-produce" aria-hidden="true">
            <span>🥑</span>
            <span>🍋</span>
            <span>🥕</span>
            <span>🍅</span>
            <span>🥬</span>
          </div>

          <div className="fc-auth-visual-footer">
            <span>✳</span> Everyday essentials, with care.
          </div>
        </aside>

        {/* Login and signup form */}
        <section className="fc-auth-panel">
          <div className="fc-auth-form-wrap">
            <Link href="/" className="fc-auth-mobile-logo">
              🥬 FreshCart<span className="fc-auth-dot">.</span>
            </Link>

            <div className="fc-auth-heading">
              <span className="fc-auth-kicker">
                {isLogin ? 'WELCOME BACK' : 'GET STARTED'}
              </span>

              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>

            <form action={formAction} className="fc-auth-form">
              {Object.entries(hiddenFields).map(([name, value]) => (
                <input
                  key={name}
                  type="hidden"
                  name={name}
                  value={value}
                />
              ))}
              {notice && (
                <div className="fc-auth-notice" role="status">
                  <span>✓</span>
                  {notice}
                </div>
              )}

              {fields.map((field) => (
                <label className="fc-auth-field" key={field.name}>
                  <span>{field.label}</span>

                  <input
                    name={field.name}
                    type={field.type || 'text'}
                    placeholder={field.placeholder || ''}
                    required
                    autoComplete={field.autoComplete}
                    defaultValue={state?.values?.[field.name] || ''}
                  />
                </label>
              ))}

              {state?.error && (
                <div className="fc-auth-error" role="alert">
                  {state.error}
                </div>
              )}

              <button
                className="fc-auth-submit"
                type="submit"
                disabled={pending}
              >
                {pending ? 'Please wait...' : submitLabel}
                {!pending && <span>→</span>}
              </button>

              {/* Show Google login only on the login page */}
              {isLogin && (
                <>
                  <div className="fc-auth-divider">
                    <span>OR CONTINUE WITH</span>
                  </div>

                  <div className="fc-google-wrapper">
                    <GoogleLoginButton />
                  </div>
                </>
              )}

              <div className="fc-auth-footer">{footer}</div>
            </form>

            <p className="fc-auth-security">
              <span>🔒</span>
              Your account information stays protected.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
