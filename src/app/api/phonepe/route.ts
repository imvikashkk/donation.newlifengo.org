// app/api/phonepe/route.ts

import { NextResponse } from 'next/server';
import crypto from 'crypto';


const Phonepe_Client_ID = process.env.PHONEPE_CLIENT_ID as string;
// const Phonepe_Client_Version = process.env.PHONEPE_CLIENT_VERSION as string;
const Phonepe_Client_Secret_Key = process.env.PHONEPE_SECRET_KEY as string;
const Phonepe_Client_Merchant_ID = process.env.PHONEPE_MERCHANT_ID as string;


export async function POST(req: Request) {
  const body = await req.json();
  const { amount, mobileNumber } = body;

  const merchantTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const payload = {
    merchantId: Phonepe_Client_Merchant_ID,
    merchantTransactionId,
    merchantUserId: 'USER123',
    amount: amount * 100,
    redirectUrl: `https://yourdomain.com/payment/success?transactionId=${merchantTransactionId}`,
    redirectMode: 'POST',
    callbackUrl: `https://yourdomain.com/api/phonepe/callback`,
    mobileNumber,
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  const path = '/pg/v1/pay';
  const dataToSign = base64Payload + path + Phonepe_Client_Secret_Key;

  const xVerify = crypto
    .createHash('sha256')
    .update(dataToSign)
    .digest('hex') + '###1';

  try {
    const response = await fetch('https://api.phonepe.com/apis/hermes/pg/v1/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-CLIENT-ID':Phonepe_Client_ID,
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    const result = await response.json();

    console.log(result)

    return NextResponse.json({
      ...result,
      merchantTransactionId,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("error", error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
