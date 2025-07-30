// app/api/payment/create-token/route.ts
import { NextResponse } from 'next/server';
import { XMLBuilder, XMLParser } from 'fast-xml-parser'; // Recommended XML parser/builder library

// Install these:
// npm install fast-xml-parser
// npm install @types/fast-xml-parser (if using TypeScript)

// Define interfaces for the expected request body from your frontend
interface CreateTokenRequestBody {
  amount: number;
  userId: number; // Assuming you pass userId to your backend
  serviceDescription?: string; // Optional custom description
}

// Define the structure of DPO's XML response (simplified for token extraction)
interface DPOApiResponse {
  API3G: {
    Result: string;
    ResultExplanation?: string;
    TransToken?: string;
    // ... other fields from DPO response
  };
}

export async function POST(request: Request) {
  try {
    const { amount, userId, serviceDescription }: CreateTokenRequestBody = await request.json();

    // --- 1. Validate Input & Get User Data from your Database/Auth System ---
    // In a real application, you would:
    // a) Validate 'amount' and 'userId'
    // b) Authenticate the user (e.g., using their session token, if this API route is protected)
    // c) Fetch the user's details (name, phone, email, region) from your database
    //    using 'userId' (or from the authenticated user's session data).
    // For this example, we'll mock user data based on your previous login response.
    const storedUserData = (request.headers.get('x-user-data')); // A simplified way to pass user data from client
    let user: any = {};
    if (storedUserData) {
        try {
            user = JSON.parse(decodeURIComponent(storedUserData));
        } catch (e) {
            console.error("Failed to parse user data from header:", e);
            return NextResponse.json({ status: "ERROR", message: "Invalid user data provided." }, { status: 400 });
        }
    } else {
        // Fallback or error if user data isn't available
        return NextResponse.json({ status: "ERROR", message: "User data is required for payment." }, { status: 400 });
    }

    // --- DPO API Parameters (from your PHP code) ---
    // Ensure these are correctly set, especially `CompanyToken` from environment variables
    const CompanyToken = "55B69320-7B2D-451F-9846-4790DA901616"; // IMPORTANT: Store this in .env.local / .env.production
    if (!CompanyToken) {
      console.error("DPO_COMPANY_TOKEN is not set in environment variables.");
      return NextResponse.json({ status: "ERROR", message: "Payment service not configured." }, { status: 500 });
    }

    const RequestType = "createToken";
    const PaymentAmount = amount;
    const PaymentCurrency = "TZS";
    const CompanyRef = `KASOME-${Date.now()}-${userId}`; // Unique reference for the transaction
    const RedirectURL = process.env.NEXT_PUBLIC_DPO_REDIRECT_URL || "http://45.79.205.240/payurl.php"; // From .env.local
    const BackURL = process.env.NEXT_PUBLIC_DPO_BACK_URL || "http://45.79.205.240/backurl.php"; // From .env.local
    const CompanyRefUnique = "0";
    const PTL = "96"; // Payment Time Limit
    const PTLtype = "hours";
    const ServiceType = "29617";
    const ServiceDescription = serviceDescription || "Video Course Access";
    const FraudTimeLimit = "60";
    const ServiceDate = new Date().toISOString().slice(0, 16).replace('T', ' '); // YYYY/MM/DD HH:MI format
    const DefaultPayment = "MO"; // Mobile Money, based on your PHP
    const customerFirstName = user.name ? user.name.split(' ')[0] : 'Customer';
    const customerLastName = user.name ? user.name.split(' ').slice(1).join(' ') : 'Kasome';
    const customerPhone = user.phone;
    const customerEmail = user.email;
    const customerCity = user.region || "Dar es Salaam";
    const customerCountry = "TZ";
    const customerZip = "255";

    // --- Build XML Payload ---
    const obj = {
      API3G: {
        CompanyToken: CompanyToken,
        Request: RequestType,
        Transaction: {
          PaymentAmount: PaymentAmount,
          PaymentCurrency: PaymentCurrency,
          CompanyRef: CompanyRef,
          RedirectURL: RedirectURL,
          BackURL: BackURL,
          CompanyRefUnique: CompanyRefUnique,
          PTL: PTL,
          PTLtype: PTLtype,
          customerFirstName: customerFirstName,
          customerLastName: customerLastName,
          customerPhone: customerPhone,
          customerZip: customerZip,
          customerCity: customerCity,
          DefaultPayment: DefaultPayment,
          customerCountry: customerCountry,
          customerEmail: customerEmail,
          FraudTimeLimit: FraudTimeLimit,
        },
        Services: {
          Service: {
            ServiceType: ServiceType,
            ServiceDescription: ServiceDescription,
            ServiceDate: ServiceDate,
          },
        },
      },
    };

    const builder = new XMLBuilder({ format: true, ignoreAttributes: false, arrayNodeName: "Service" });
    const xmlPayload = builder.build(obj);

    // --- Make Request to DPO API ---
    const dpoResponse = await fetch("https://secure.3gdirectpay.com/API/v6/", {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "no-cache",
      },
      body: xmlPayload,
    });

    if (!dpoResponse.ok) {
      const dpoErrorText = await dpoResponse.text(); // Get raw text for DPO errors
      console.error("DPO API request failed:", dpoResponse.status, dpoErrorText);
      return NextResponse.json({ status: "ERROR", message: "Failed to communicate with payment gateway." }, { status: 500 });
    }

    const dpoResponseText = await dpoResponse.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsedDPOResponse: DPOApiResponse = parser.parse(dpoResponseText);

    // --- Parse and Return Token ---
    if (parsedDPOResponse.API3G && parsedDPOResponse.API3G.Result === "000") { // DPO Success Code
      const transToken = parsedDPOResponse.API3G.TransToken;
      if (transToken) {
        return NextResponse.json({ status: "SUCCESS", message: "Token created successfully", token: transToken });
      } else {
        console.error("DPO Response successful but no TransToken found:", parsedDPOResponse);
        return NextResponse.json({ status: "ERROR", message: "Payment token not received from gateway." }, { status: 500 });
      }
    } else {
      // DPO returned an error result
      const errorMessage = parsedDPOResponse.API3G?.ResultExplanation || "Payment token creation failed.";
      console.error("DPO Error:", parsedDPOResponse);
      return NextResponse.json({ status: "ERROR", message: errorMessage }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Error in create-token API route:", error);
    return NextResponse.json({ status: "ERROR", message: error.message || "Internal Server Error" }, { status: 500 });
  }
}