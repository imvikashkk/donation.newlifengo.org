// /app/api/razorpay/webhook/route.ts

import { NextRequest } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/connectDB'; // your DB connect
import Order from '@/model/donation'; // your Mongoose model

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to read raw body from NextRequest (App Router)
async function getRawBody(req: Request): Promise<Buffer> {
  const reader = req.body?.getReader();
  const chunks: Uint8Array[] = [];

  if (!reader) throw new Error("No body reader found");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return new Response(JSON.stringify({ error: 'Secret missing' }), { status: 500 });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers.get('x-razorpay-signature');

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 });
    }

    const event = JSON.parse(rawBody.toString());

    if (event.event === 'payment.captured') {
      const paymentId = event.payload.payment.entity.id;
      const orderId = event.payload.payment.entity.notes?.order_id;

      if (!orderId) {
        return new Response(JSON.stringify({ error: 'Order ID missing' }), { status: 400 });
      }

      await dbConnect();

      const order = await Order.findByIdAndUpdate(
       {order_id:orderId},
        { status: 'success', paymentId },
        { new: true }
      );

      console.log('Order updated:', order);

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
  }
}
