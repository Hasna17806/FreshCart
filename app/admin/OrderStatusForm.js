
'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { updateBillStatus } from '@/app/actions';

const initialState = {
  error: '',
  success: '',
};

export default function OrderStatusForm({ order }) {
  const router = useRouter();

  async function handleUpdate(previousState, formData) {
    const result = await updateBillStatus(previousState, formData);

    if (result?.success) {
      router.refresh();
    }

    return result;
  }

  const [state, formAction, pending] = useActionState(
    handleUpdate,
    initialState
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={order.id} />

      <label htmlFor={`status-${order.id}`}>
        Update status:
      </label>

      <select
        id={`status-${order.id}`}
        name="status"
        defaultValue={order.status}
        required
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {state.error && <p className="warn">{state.error}</p>}
      {state.success && <p>{state.success}</p>}

      <button className="btn" type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Update Status'}
      </button>
    </form>
  );
}
