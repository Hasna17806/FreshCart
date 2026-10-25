'use client';
import { useActionState } from 'react';

export default function AuthForm({ action, fields, submitLabel, notice }) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="form">
      {notice && <div className="success">{notice}</div>}
      {fields.map((f) => (
        <label key={f.name}>{f.label}
          <input name={f.name} type={f.type || 'text'} required defaultValue={state?.values?.[f.name] || ''} />
        </label>
      ))}
      {state?.error && <div className="error">{state.error}</div>}
      <button className="btn" style={{ marginTop: 16 }} disabled={pending}>{pending ? 'Please wait…' : submitLabel}</button>
    </form>
  );
}
