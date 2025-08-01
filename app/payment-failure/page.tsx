// app/payment-failure/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // Import useRouter
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, AlertTriangle, Home, LayoutDashboard, RefreshCcw, Loader2, CheckCircle, Play } from 'lucide-react'; // Added Loader2, CheckCircle, Play
import { toast } from 'sonner'; // Assuming sonner is installed

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize useRouter

  // State for the verification process and final status
  const [status, setStatus] = useState<'verifying' | 'failure' | 'pending' | 'success'>('verifying');
  const [message, setMessage] = useState('Verifying payment status...');
  const [transId, setTransId] = useState<string | null>(null);
  const [courseIdToRedirect, setCourseIdToRedirect] = useState<string | null>(null); // To hold the course ID from CompanyRef
  const [redirecting, setRedirecting] = useState(false); // To indicate automatic redirection

  useEffect(() => {
    const initialStatParam = searchParams.get('status'); // Original 'stat' from DPO redirect (e.g., '999')
    const transidParam = searchParams.get('transId'); // Transaction ID from DPO redirect
    const companyRefParam = searchParams.get('CompanyRef'); // CompanyRef from DPO redirect
    const courseIdParam = searchParams.get('courseId'); // Course ID passed from payment-success page

    setTransId(transidParam);
    setCourseIdToRedirect(courseIdParam); // Set course ID from URL if available

    // Fallback if courseId is NOT passed from payment-success but exists in CompanyRef
    let videoIdFromRef: string | null = courseIdParam;
    if (!videoIdFromRef && companyRefParam) {
        const refParts = companyRefParam.split('-');
        if (refParts.length >= 2 && refParts[0] === 'KASOME' && refParts[1]) {
            videoIdFromRef = refParts[1];
        }
    }
    setCourseIdToRedirect(videoIdFromRef); // Ensure course ID is set

    // If no transaction ID is available at all, we can't verify
    if (!transidParam) {
      setStatus('failure');
      setMessage('No transaction ID found in the URL. Cannot verify payment status.');
      toast.error('Verification failed: Missing transaction ID.');
      return;
    }

    // --- Start Verification Process with your Next.js API Route ---
    const verifyPaymentStatus = async () => {
      setStatus('verifying');
      setMessage('Verifying payment status with DPO...');
      toast.info('Verifying payment status...', { id: 'payment-verify', duration: Infinity }); // Persistent toast

      try {
        const response = await fetch('/api/payment/verify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionToken: transidParam }), // Send the TransID to your API route
        });

        const result = await response.json(); // Expected result from your /api/payment/verify-token route

        if (response.ok && result.status) {
          if (result.verifiedStatus === 'paid') {
            setStatus('success');
            setMessage('Payment successfully confirmed! Redirecting you to your course now.');
            toast.success('Payment Confirmed!', { id: 'payment-verify', description: 'Access granted!' });

            // If verification confirms success, redirect to the course page
            if (videoIdFromRef) {
                setRedirecting(true);
                setTimeout(() => {
                    router.replace(`/course/${videoIdFromRef}`); // Redirect to the specific course
                }, 4000); // Redirect after 4 seconds
            } else {
                setMessage('Payment confirmed, but course ID could not be determined. Please check your dashboard.');
                setStatus('pending'); // Treat as success but needs manual navigation
            }
          } else if (result.verifiedStatus === 'pending') {
            setStatus('pending');
            setMessage(result.message || 'Payment is still pending. Please wait a few minutes and try verifying again.');
            toast.warning('Payment Pending', { id: 'payment-verify', description: result.message });
          } else { // 'failed' or any other non-success status
            setStatus('failure');
            setMessage(result.message || `Payment failed. Original status: ${initialStatParam || 'N/A'}. Please try again.`);
            toast.error('Payment Failed', { id: 'payment-verify', description: result.message });
          }
        } else {
          // Fallback for API call failure or unexpected response structure from your /api/payment/verify-token
          setStatus('failure');
          setMessage(result.message || 'Verification service responded with an error. Please try again or contact support.');
          toast.error('Verification Failed', { id: 'payment-verify', description: result.message });
        }
      } catch (error: any) {
        // Network error during fetch to your /api/payment/verify-token route
        setStatus('failure');
        setMessage(`Could not connect to verification service: ${error.message || 'Network Error'}. Please try again.`);
        toast.error('Verification Network Error', { id: 'payment-verify', description: error.message });
        console.error("Verification fetch error:", error);
      } finally {
        toast.dismiss('payment-verify'); // Dismiss the persistent toast once a final status is determined
      }
    };

    verifyPaymentStatus();

  }, [searchParams, router]); // Dependency on searchParams ensures it runs when URL changes

  // Helper functions for rendering
  const renderIcon = () => {
    if (status === 'verifying' || redirecting) { // Show loader while verifying or redirecting
      return <Loader2 className="h-16 w-16 text-yellow-500 animate-spin mx-auto mb-6" />;
    } else if (status === 'success') {
      return <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />;
    } else if (status === 'pending') {
      return <AlertTriangle className="h-16 w-16 text-yellow-600 mx-auto mb-6" />; // Using alert for pending
    } else { // status === 'failure'
      return <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />;
    }
  };

  const getCardClasses = () => {
    if (status === 'success') return 'border-green-400 shadow-xl';
    if (status === 'verifying' || status === 'pending') return 'border-yellow-400 shadow-xl';
    return 'border-red-400 shadow-xl'; // Default for failure
  };

  const getTitle = () => {
    if (status === 'verifying') return 'Verifying Payment...';
    if (status === 'success') return 'Payment Confirmed!';
    if (status === 'pending') return 'Payment Pending';
    return 'Payment Unsuccessful';
  };

  const getTitleColorClass = () => {
    if (status === 'success') return 'text-green-800';
    if (status === 'verifying' || status === 'pending') return 'text-yellow-800';
    return 'text-red-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center p-4">
      <Card className={`w-full max-w-md text-center border-2 ${getCardClasses()}`}>
        <CardHeader className="pt-8">
          {renderIcon()}
          <CardTitle className={`text-3xl font-bold ${getTitleColorClass()}`}>{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <p className="text-lg text-gray-700 mb-6">{message}</p>
          {transId && <p className="text-sm text-gray-500 mb-4">Transaction ID: <span className="font-medium text-gray-800">{transId}</span></p>}
          
          <div className="space-y-4 pt-4">
            {/* Conditional buttons based on final status or redirection state */}
            {redirecting ? (
                <p className="text-gray-600 text-base">Please wait, you're being redirected automatically.</p>
            ) : (
                <>
                {status === 'success' && courseIdToRedirect && ( // Only show "Continue to Course" if successfully verified
                    <Link href={`/course/${courseIdToRedirect}`} passHref>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3">
                        <Play className="mr-2 h-5 w-5" /> Continue to Course
                        </Button>
                    </Link>
                )}
                {/* Show common action buttons if not redirecting or explicitly succeeded */}
                {(status === 'failure' || status === 'pending') && (
                    <Link href="/courses" passHref>
                        <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-lg py-3">
                        <RefreshCcw className="mr-2 h-5 w-5" /> Try Again / Browse Courses
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
