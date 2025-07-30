// app/payment-success/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, Home, LayoutDashboard, ExternalLink } from 'lucide-react'; // Added Home, LayoutDashboard, ExternalLink
import { toast } from 'sonner'; // Assuming sonner is installed

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<'success' | 'pending' | 'loading'>('loading');
  const [message, setMessage] = useState('Confirming your payment status...');
  const [transId, setTransId] = useState<string | null>(null);
  const [courseIdToRedirect, setCourseIdToRedirect] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const stat = searchParams.get('stat'); // DPO parameter for payment status ('000' for success)
    const transidParam = searchParams.get('TransID'); // DPO parameter for transaction ID
    const companyRefParam = searchParams.get('CompanyRef'); // YOUR CompanyRef from DPO

    setTransId(transidParam);

    let videoIdFromRef: string | null = null;
    if (companyRefParam) {
      // Assuming your CompanyRef format is "KASOME-<video_id/course_id>-<UNIQUE_ID>"
      const refParts = companyRefParam.split('-');
      if (refParts.length >= 2 && refParts[0] === 'KASOME' && refParts[1]) {
        videoIdFromRef = refParts[1]; // Extract video/course ID from CompanyRef
      }
    }
    setCourseIdToRedirect(videoIdFromRef); // Set this to state for later use

    if (stat === '000') {
      setStatus('success');
      setMessage('Payment successful! Your access has been granted.');
      toast.success('Payment successful!', { description: 'Access granted!' });

      if (videoIdFromRef) {
        setRedirecting(true);
        setMessage('Payment successful! Redirecting you to your course now...');
        setTimeout(() => {
          router.push(`/course/${videoIdFromRef}`); // Redirect to the specific course
        }, 5000); // Redirect after 5 seconds
      }
    } else {
      // If DPO sends anything other than '000' to RedirectURL, it's generally a failure or cancellation.
      // We'll redirect to a dedicated failure page for clearer messaging.
      const failureMessage = `Payment failed or was canceled. Status: ${stat || 'N/A'}.`;
      toast.error('Payment Failed', { description: failureMessage });
      router.replace(`/payment-failure?status=${stat || 'N/A'}&transId=${transidParam || ''}`);
      return; // Stop execution here as we're redirecting
    }

    // Optional: Final server-side confirmation (good practice but less critical than BackURL)
    // if (transidParam) {
    //   fetch(`/api/payment/confirm-status?transId=${transidParam}`)
    //     .then(res => res.json())
    //     .then(data => { /* Handle confirmation response */ })
    //     .catch(err => console.error("Error confirming payment:", err));
    // }

  }, [searchParams, router]);

  const renderIcon = () => {
    if (status === 'loading' || redirecting) {
      return <Loader2 className="h-16 w-16 text-green-500 animate-spin mx-auto mb-6" />;
    } else if (status === 'success') {
      return <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />;
    }
    // No other icons needed here, as non-success redirects to payment-failure
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <Card className={`w-full max-w-md text-center border-2 border-green-400 shadow-xl`}>
        <CardHeader className="pt-8">
          {renderIcon()}
          <CardTitle className="text-3xl font-bold text-green-800">{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <p className="text-lg text-gray-700 mb-6">{message}</p>
          {transId && <p className="text-sm text-gray-500 mb-4">Transaction ID: <span className="font-medium text-gray-800">{transId}</span></p>}
          
          <div className="space-y-4 pt-4">
            {!redirecting ? (
              <>
                {courseIdToRedirect && (
                  <Link href={`/course/${courseIdToRedirect}`} passHref>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3">
                      <Play className="mr-2 h-5 w-5" /> Continue to Course
                    </Button>
                  </Link>
                )}
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
              </>
            ) : (
                <div className="text-gray-600 text-base">
                    Please wait, you're being redirected automatically.
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper to avoid duplicate code for getTitle
function getTitle() {
  const searchParams = useSearchParams(); // Needs to be called inside the component or custom hook
  const stat = searchParams.get('stat');
  if (stat === '000') return 'Payment Successful!';
  return 'Confirming Payment...'; // For initial state or non-000 before redirecting to failure page
}