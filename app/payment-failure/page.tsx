// app/payment-failure/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, AlertTriangle, Home, LayoutDashboard, RefreshCcw } from 'lucide-react'; // Added icons

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState('There was an issue with your payment.');
  const [transId, setTransId] = useState<string | null>(null);

  useEffect(() => {
    const statParam = searchParams.get('status'); // Status passed from payment-success or DPO directly
    const transidParam = searchParams.get('transId');

    setStatus(statParam);
    setTransId(transidParam);

    if (statParam === '999') { // Example DPO status for user cancellation
      setMessage('Your payment was canceled. You can try again.');
    } else if (statParam) {
      setMessage(`Payment failed. Status code: ${statParam}. Please verify details and try again.`);
    } else {
      setMessage('An unexpected error occurred during payment. Please try again or contact support.');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center p-4">
      <Card className={`w-full max-w-md text-center border-2 border-yellow-400 shadow-xl`}>
        <CardHeader className="pt-8">
          <XCircle className="h-16 w-16 text-yellow-600 mx-auto mb-6" />
          <CardTitle className="text-3xl font-bold text-yellow-800">Payment Unsuccessful</CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <p className="text-lg text-gray-700 mb-6">{message}</p>
          {transId && <p className="text-sm text-gray-500 mb-4">Transaction ID: <span className="font-medium text-gray-800">{transId}</span></p>}
          
          <div className="space-y-4 pt-4">
            <Link href="/courses" passHref>
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-lg py-3">
                <RefreshCcw className="mr-2 h-5 w-5" /> Try Again / Browse Courses
              </Button>
            </Link>
            <Link href="/dashboard" passHref>
              <Button variant="outline" className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 text-lg py-3">
                <LayoutDashboard className="mr-2 h-5 w-5" /> Go to Dashboard
              </Button>
            </Link>
            <Link href="/" passHref>
              <Button variant="ghost" className="w-full text-gray-600 hover:text-gray-900 text-lg py-3">
                <Home className="mr-2 h-5 w-5" /> Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}