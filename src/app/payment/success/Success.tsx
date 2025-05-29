'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transactionId');
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    if (!transactionId) {
      setStatus('Invalid transaction ID');
      return;
    }

    // Optionally call your backend to verify status
    fetch(`/api/payment/status?transactionId=${transactionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStatus('Payment Successful!');
        else setStatus('Payment Failed or Pending');
      })
      .catch(() => setStatus('Error checking payment status'));
  }, [transactionId]);

  return <div>{status}</div>;
}
