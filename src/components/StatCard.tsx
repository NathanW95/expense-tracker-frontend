interface StatCardProps {
  label: string;
  amount: number;
  count: number;
  color: string;
}

export function StatCard({ label, amount, count, color }: StatCardProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div
      style={{
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        border: `2px solid ${color}`,
        flex: 1,
        minWidth: '150px',
      }}
    >
      <div style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>
        {label}
      </div>
      <div
        style={{
          color: color,
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '4px',
        }}
      >
        {formatAmount(amount)}
      </div>
      <div style={{ color: '#666', fontSize: '12px' }}>
        ({count} {count === 1 ? 'item' : 'items'})
      </div>
    </div>
  );
}
