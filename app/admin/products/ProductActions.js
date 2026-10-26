
'use client';

import { useActionState } from 'react';
import { updateProduct, deleteProduct } from '@/app/actions';

const initialState = { error: '', success: '' };

function EditProductForm({ product }) {
  const [state, formAction, pending] = useActionState(
    updateProduct,
    initialState
  );

  return (
    <form action={formAction} style={{ marginTop: 10 }}>
      <input type="hidden" name="id" value={product.id} />

      <p>
        <label htmlFor={`name-${product.id}`}>Name</label>
        <input
          id={`name-${product.id}`}
          name="name"
          defaultValue={product.name}
          required
          maxLength={150}
        />
      </p>

      <p>
        <label htmlFor={`price-${product.id}`}>Price (₹)</label>
        <input
          id={`price-${product.id}`}
          name="price"
          type="number"
          min="0"
          step="0.01"
          defaultValue={product.price}
          required
        />
      </p>

      <p>
        <label htmlFor={`stock-${product.id}`}>Stock</label>
        <input
          id={`stock-${product.id}`}
          name="stock"
          type="number"
          min="0"
          step="1"
          defaultValue={product.stock}
          required
        />
      </p>

      {state.error && <p className="warn">{state.error}</p>}
      {state.success && <p>{state.success}</p>}

      <button className="btn" type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

function DeleteProductForm({ product }) {
  const [state, formAction, pending] = useActionState(
    deleteProduct,
    initialState
  );

  function handleSubmit(event) {
    if (!window.confirm(`Delete "${product.name}"?`)) {
      event.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={product.id} />

      {state.error && <p className="warn">{state.error}</p>}
      {state.success && <p>{state.success}</p>}

      <button
        className="btn light"
        type="submit"
        disabled={pending}
      >
        {pending ? 'Deleting...' : 'Delete Product'}
      </button>
    </form>
  );
}

export default function ProductActions({ product }) {
  return (
    <div>
      <EditProductForm product={product} />
      <hr />
      <DeleteProductForm product={product} />
    </div>
  );
}
