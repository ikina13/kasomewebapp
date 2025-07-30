// app/api/dpo-callback/route.ts
import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser'; // Assuming you already installed this

// Define interfaces based on DPO's callback XML structure
// (This is a simplified example; actual DPO callback XML can be complex)
interface DPOPaymentCallback {
  API3G: {
    Result: string; // "000" for success, "900" for failed, etc.
    ResultExplanation?: string;
    Transaction: {
      CompanyRef: string; // Your CompanyRef from createToken
      TransID: string; // DPO's unique transaction ID
      // ... other transaction details like amount, currency, custom fields
    };
    // ... other elements like Customer, Services, etc.
  };
}

export async function POST(request: Request) {
  try {
    // 1. Get raw XML body from DPO
    const xmlBody = await request.text();
    console.log("DPO Callback (Raw XML):", xmlBody);

    // 2. Parse the XML
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_", // DPO often uses attributes
      // You might need to configure options based on the exact XML structure DPO sends
      // e.g., if array elements are always single, etc.
    });
    const parsedData: DPOPaymentCallback = parser.parse(xmlBody);

    // 3. Extract relevant information
    const result = parsedData.API3G?.Result;
    const resultExplanation = parsedData.API3G?.ResultExplanation;
    const companyRef = parsedData.API3G?.Transaction?.CompanyRef;
    const transId = parsedData.API3G?.Transaction?.TransID;
    // ... extract other critical data like amount, payment method, etc.

    // 4. IMPORTANT: Validate the callback
    // a) Verify the source (e.g., DPO IP addresses, a secret hash/signature if DPO provides one)
    //    This prevents fraudulent calls.
    // b) Check if you've already processed this TransID to prevent double processing.
    // c) Look up your CompanyRef in your database to find the associated user and order.
    // d) Verify the amount matches what you expected for that order.

    // 5. Update your database based on the status
    if (result === '000') {
      console.log(`Payment SUCCESS for CompanyRef: ${companyRef}, TransID: ${transId}`);
      // Your database update logic here:
      // - Find the order/user associated with 'companyRef'
      // - Mark the order/course access as 'paid' in your database
      // - Grant access to the video/course
    } else {
      console.warn(`Payment FAILED/CANCELED for CompanyRef: ${companyRef}, TransID: ${transId}. Result: ${result} (${resultExplanation})`);
      // Your database update logic here:
      // - Mark the order/course access as 'failed' or 'canceled'
    }

    // 6. Respond with HTTP 200 OK to DPO
    // DPO expects a simple 200 OK. Don't return HTML or complex responses.
    return NextResponse.json({ status: 'OK', message: 'Callback received and processed' }, { status: 200 });

  } catch (error: any) {
    console.error("Error processing DPO callback:", error);
    // If an error occurs during processing, still try to return 200 to DPO
    // but log the error thoroughly on your end.
    return NextResponse.json({ status: 'ERROR', message: error.message || 'Internal Server Error' }, { status: 500 }); // Or 200 with error in body for DPO
  }
}