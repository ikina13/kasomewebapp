// app/payment-status/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'; // Icons for status

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'success' | 'failure' | 'pending' | 'loading'>('loading');
  const [message, setMessage] = useState('Processing your payment...');
  const [transId, setTransId] = useState<string | null>(null);

  useEffect(() => {
    const stat = searchParams.get('stat'); // DPO parameter for payment status
    const transidParam = searchParams.get('TransID'); // DPO parameter for transaction ID
    const txnRefParam = searchParams.get('txnRef'); // Another common DPO parameter

    setTransId(transidParam || txnRefParam);

    // This is a basic client-side check. Always confirm server-side!
    if (stat === '000') {
      setStatus('success');
      setMessage('Payment successful! Thank you for your purchase.');
    } else if (stat === '999') { // Example: 999 for user cancellation
      setStatus('failure');
      setMessage('Payment canceled by user.');
    } else if (stat) { // Any other status code from DPO
      setStatus('failure');
      setMessage(`Payment failed or was incomplete. Status code: ${stat}`);
    } else {
      setStatus('pending'); // Or 'unknown' if no status param
      setMessage('Payment status is being confirmed. Please check your account dashboard shortly.');
    }

    // Optional: Make a final server-side confirmation after a short delay
    // This is good if the client might have missed the BackURL callback
    // For production, you might also have a mechanism to check directly from your backend periodically.
    if (transidParam) {
        // You could ping your own backend here:
        // fetch(`/api/payment/confirm?transId=${transidParam}`)
        // .then(res => res.json())
        // .then(data => {
        //     if (data.status === 'CONFIRMED') { /* Update message to confirmed */ }
        // })
        // .catch(err => console.error("Error confirming payment:", err));
    }

  }, [searchParams]);

  const renderIcon = () => {
    if (status === 'loading') {
      return <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />;
    } else if (status === 'success') {
      return <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />;
    } else {
      return <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />;
    }
  };

  const getCardClasses = () => {
    if (status === 'success') return 'border-green-300 shadow-lg';
    if (status === 'failure') return 'border-red-300 shadow-lg';
    return 'border-gray-300 shadow-md';
  };

  const getTitle = () => {
    if (status === 'success') return 'Payment Successful!';
    if (status === 'failure') return 'Payment Failed';
    if (status === 'pending' || status === 'loading') return 'Confirming Payment...';
    return 'Payment Status';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-md text-center ${getCardClasses()}`}>
        <CardHeader>
          {renderIcon()}
          <CardTitle className="text-2xl font-bold">{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{message}</p>
          {transId && <p className="text-sm text-gray-500 mb-4">Transaction ID: {transId}</p>}
          <div className="space-y-3">
            <Link href="/dashboard" passHref>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Go to Dashboard</Button>
            </Link>
            <Link href="/courses" passHref>
              <Button variant="outline" className="w-full">Continue Browse Courses</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}