'use client';
import Link from 'next/link';
import { useActionState } from 'react';

export default function AuthForm({ action, fields, submitLabel, title, subtitle, notice, footer }) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <div className="auth">
      <div className="auth-card">
        <div className="auth-head">
          <Link href="/" className="auth-brand">🥬 FreshCart</Link>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <form action={formAction} className="auth-form">
          {notice && <div className="success">{notice}</div>}
          {fields.map((f) => (
            <label key={f.name}>{f.label}
              <input name={f.name} type={f.type || 'text'} placeholder={f.placeholder || ''} required
                autoComplete={f.autoComplete} defaultValue={state?.values?.[f.name] || ''} />
            </label>
          ))}
          {state?.error && <div className="error">{state.error}</div>}
          <button className="auth-btn" disabled={pending}>{pending ? 'Please wait…' : submitLabel}</button>
          <div className="auth-foot">{footer}</div>
        </form>
      </div>
    </div>
  );
}