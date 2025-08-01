// app/payment-success/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, Home, LayoutDashboard, Play, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Simplified status management as we're mostly just redirecting
  const [message, setMessage] = useState('Processing your payment status...');
  const [redirecting, setRedirecting] = useState(false);
  const [isSuccessDisplayed, setIsSuccessDisplayed] = useState(false); // To ensure success message shows briefly

  // --- getTitle helper function (unchanged) ---
  const getTitle = () => {
    const stat = searchParams.get('stat');
    if (stat === '000') return 'Payment Successful!';
    return 'Confirming Payment...';
  };
  // --- End getTitle helper function ---

  useEffect(() => {
    const dpoStat = searchParams.get('stat'); // DPO parameter for payment status ('000' for success)
    const transidParam = searchParams.get('TransID'); // DPO parameter for transaction ID
    const companyRefParam = searchParams.get('CompanyRef'); // YOUR CompanyRef from DPO (for courseId/playVideoId)

    // Parse courseId and playVideoId from CompanyRef or other params if sent
    let courseIdToRedirect: string | null = null;
    let playVideoIdToRedirect: string | null = null;

    if (companyRefParam) {
      const refParts = companyRefParam.split('-');
      if (refParts.length >= 2 && refParts[0] === 'KASOME' && refParts[1]) {
        courseIdToRedirect = refParts[1];
        // If your CompanyRef also contains videoId directly, parse it here
        // e.g., "KASOME-<course_id>-<video_id>-<UNIQUE_ID>"
        if (refParts.length >= 3 && refParts[2]) {
             playVideoIdToRedirect = refParts[2];
        }
      }
    }
    // Alternatively, if courseId and playVideoId are sent as direct URL params to payment-success, retrieve them here:
    const directCourseId = searchParams.get('courseId');
    const directPlayVideoId = searchParams.get('playVideoId');
    if (directCourseId) courseIdToRedirect = directCourseId;
    if (directPlayVideoId) playVideoIdToRedirect = directPlayVideoId;


    if (dpoStat === '000') {
      setIsSuccessDisplayed(true); // Indicate success state for rendering
      setMessage('Payment successful! Returning to previous page.');
      toast.success('Payment successful!', { description: `Transaction ID: ${transidParam || 'N/A'}` });

      setRedirecting(true); // Activate redirection state

      // --- CRITICAL CHANGE: Redirect back after 1 second ---
      setTimeout(() => {
        router.back(); // Go back to the previous page in history
        // If you specifically wanted to go to a course page, even for a "back" action,
        // you would use: router.replace(`/course/${courseIdToRedirect}?playVideoId=${playVideoIdToRedirect || ''}`);
        // But "go back" implies to the page *before* payment.
      }, 1000); // 1 second delay
      // --- END CRITICAL CHANGE ---

    } else {
      // If DPO sends anything other than '000' to RedirectURL,
      // immediately redirect to the failure page without delay.
      const failureMessage = `Payment failed or was canceled. Status: ${dpoStat || 'N/A'}.`;
      toast.error('Payment Failed', { description: failureMessage });
      router.replace(`/payment-failure?status=${dpoStat || 'N/A'}&transId=${transidParam || ''}&CompanyRef=${companyRefParam || ''}&courseId=${courseIdToRedirect || ''}&playVideoId=${playVideoIdToRedirect || ''}`);
    }

    // No need for optional confirmation fetches in this simplified "go back" flow

  }, [searchParams, router]); // Dependencies to ensure effect runs when URL or router state changes

  const renderIcon = () => {
    if (redirecting) { // Show loader while redirecting
      return <Loader2 className="h-16 w-16 text-green-500 animate-spin mx-auto mb-6" />;
    } else if (isSuccessDisplayed) { // Show success icon if payment was successful
      return <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />;
    }
    // No other icons here, as non-success immediately redirects to payment-failure
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <Card className={`w-full max-w-md text-center border-2 ${isSuccessDisplayed ? 'border-green-400' : 'border-gray-300'} shadow-xl`}>
        <CardHeader className="pt-8">
          {renderIcon()}
          <CardTitle className="text-3xl font-bold text-green-800">{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <p className="text-lg text-gray-700 mb-6">{message}</p>
          
          {/* We only show a simple message and auto-redirect for success */}
          {/* No manual buttons if auto-redirecting */}
          {/* If you need TransId or CourseId displayed briefly before redirect, add them here */}
          {/* {searchParams.get('TransID') && <p className="text-sm text-gray-500 mb-4">Transaction ID: <span className="font-medium text-gray-800">{searchParams.get('TransID')}</span></p>} */}
          {/* {courseIdToRedirect && <p className="text-sm text-gray-500 mb-4">Course ID: <span className="font-medium text-gray-800">{courseIdToRedirect}</span></p>} */}

          <div className="space-y-4 pt-4">
            {/* The primary action is the automatic redirect */}
            {redirecting ? (
                <div className="text-gray-600 text-base">
                    Returning to previous page automatically...
                </div>
            ) : (
                // Fallback content if for some reason redirection doesn't trigger immediately
                // This shouldn't be seen if stat=000 and redirection is set
                <div className="text-gray-600 text-base">
                    If not redirected, please use the buttons below.
                    <Link href="/dashboard" passHref>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4">Go to Dashboard</Button>
                    </Link>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
