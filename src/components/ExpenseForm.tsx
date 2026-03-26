import { useState } from 'react';
import { createExpense, updateExpense } from '../services/expenseApi';
import type { ExpenseRequest, Expense } from '../types/expense';

// Extend Window interface for Cloudinary
declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (config: object, callback: (error: Error | null, result: { event: string; info: { secure_url: string } }) => void) => {
        open: () => void;
      };
    };
  }
}

interface ExpenseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editExpense?: Expense | null;
}

export function ExpenseForm({ onSuccess, onCancel, editExpense }: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseRequest>({
    description: editExpense?.description || '',
    category: editExpense?.category || '',
    amount: editExpense?.amount || 0,
    expenseDate: editExpense?.expenseDate
      ? new Date(editExpense.expenseDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  });
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ['Food', 'Travel', 'Equipment', 'Entertainment', 'Other'];

  const openCloudinaryWidget = () => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError('Cloudinary not configured. Check environment variables.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        sources: ['local', 'camera'],
        multiple: false,
        maxFileSize: 5000000, // 5MB
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
        folder: 'receipts',
      },
      (error: Error | null, result: { event: string; info: { secure_url: string } }) => {
        if (error) {
          setError('Upload failed: ' + error.message);
          return;
        }
        if (result.event === 'success') {
          setReceiptUrl(result.info.secure_url);
          console.log('Receipt uploaded:', result.info.secure_url);
        }
      }
    );

    widget.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editExpense) {
        // Update existing expense
        await updateExpense(editExpense.id, {
          ...formData,
          expenseDate: new Date(formData.expenseDate).toISOString(),
          receiptUrl: receiptUrl,
        });
      } else {
        // Create new expense
        await createExpense({
          ...formData,
          expenseDate: new Date(formData.expenseDate).toISOString(),
          receiptUrl: receiptUrl,
        });
      }
      onSuccess();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          `Failed to ${editExpense ? 'update' : 'create'} expense`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#1e1e1e',
        border: '1px solid #333',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      <h3 style={{ color: 'white', marginTop: 0 }}>
        {editExpense ? 'Edit Expense' : 'Create New Expense'}
      </h3>

      {error && (
        <div
          style={{
            color: '#ff6b6b',
            backgroundColor: '#2a1a1a',
            border: '1px solid #ff6b6b',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '15px',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>
            Description *
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #444',
              backgroundColor: '#2a2a2a',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
            placeholder="e.g., Team lunch at restaurant"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #444',
              backgroundColor: '#2a2a2a',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>
            Amount ($) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #444',
              backgroundColor: '#2a2a2a',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
            placeholder="0.00"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>
            Expense Date *
          </label>
          <input
            type="date"
            value={formData.expenseDate}
            onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #444',
              backgroundColor: '#2a2a2a',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>
            Receipt
          </label>
          <button
            type="button"
            onClick={openCloudinaryWidget}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              marginBottom: '10px',
            }}
          >
            {receiptUrl ? 'Change Receipt' : 'Upload Receipt'}
          </button>
          {receiptUrl && (
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <img
                src={receiptUrl}
                alt="Receipt preview"
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  borderRadius: '6px',
                  border: '1px solid #444',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
              <button
                type="button"
                onClick={() => setReceiptUrl(null)}
                style={{
                  marginTop: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Remove Receipt
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '12px 30px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 30px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Creating...' : editExpense ? 'Update Expense' : 'Create Expense'}
          </button>
        </div>
      </form>
    </div>
  );
}
