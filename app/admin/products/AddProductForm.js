
'use client';

import { useActionState } from 'react';
import { addProduct } from '@/app/actions';

const initialState = { error: '', success: '' };

export default function AddProductForm() {
  const [state, formAction, pending] = useActionState(
    addProduct,
    initialState
  );

  return (
    <div className="card">
      <h2>Add New Product</h2>

      <form action={formAction}>
        <p>
          <label htmlFor="name">Product name</label>
          <input id="name" name="name" required maxLength={150} />
        </p>

        <p>
          <label htmlFor="price">Price (₹)</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
          />
        </p>

        <p>
          <label htmlFor="stock">Stock quantity</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            required
          />
        </p>

        {state.error && <p className="warn">{state.error}</p>}
        {state.success && <p>{state.success}</p>}

        <button className="btn" type="submit" disabled={pending}>
          {pending ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}
