interface QuarterlyBudgetCardProps {
  budget: number;
  approvedAmount: number;
  pendingAmount: number;
  onSetBudget?: (budget: number) => void;
}

export function QuarterlyBudgetCard({
  budget,
  approvedAmount,
  pendingAmount,
}: QuarterlyBudgetCardProps) {
  const remainingAfterApproved = budget - approvedAmount;
  const remainingIfAllApproved = budget - approvedAmount - pendingAmount;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const now = new Date();
  const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
  const currentYear = now.getFullYear();
  const quarterLabel = `Q${currentQuarter} ${currentYear}`;

  return (
    <div
      style={{
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '20px',
        border: '2px solid #4CAF50',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          marginBottom: '15px',
        }}
      >
        <h3 style={{ color: 'white', margin: 0 }}>
          Quarterly Budget ({quarterLabel})
        </h3>
      </div>

      <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            color: 'white',
            marginBottom: '15px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#888', fontSize: '14px' }}>Budget:</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {formatAmount(budget)}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#888', fontSize: '14px' }}>
              Approved This Quarter:
            </div>
            <div
              style={{ fontSize: '18px', fontWeight: 'bold', color: '#4CAF50' }}
            >
              {formatAmount(approvedAmount)}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#888', fontSize: '14px' }}>
              Pending This Quarter:
            </div>
            <div
              style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffc107' }}
            >
              {formatAmount(pendingAmount)}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#888', fontSize: '14px' }}>
              Remaining After Approved:
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: remainingAfterApproved >= 0 ? '#4CAF50' : '#dc3545',
              }}
            >
              {formatAmount(remainingAfterApproved)}{' '}
              {remainingAfterApproved >= 0 ? '✅' : '❌'}
            </div>
          </div>
          <div style={{ gridColumn: 'span 2', textAlign: 'center' }}>
            <div style={{ color: '#888', fontSize: '14px' }}>
              Remaining If All Pending Approved:
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: remainingIfAllApproved >= 0 ? '#4CAF50' : '#dc3545',
              }}
            >
              {formatAmount(remainingIfAllApproved)}{' '}
              {remainingIfAllApproved >= 0 ? '✅' : '⚠️'}
            </div>
          </div>
        </div>
    </div>
  );
}
