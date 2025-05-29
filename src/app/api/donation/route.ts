import { NextRequest, NextResponse } from 'next/server';
import DonationModel from '@/model/donation';
import cloudinary from '@/lib/cloudinary';
import { Readable } from 'stream';
import connect from '@/lib/connectDB';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});


export async function POST(req: NextRequest) {
    await connect();

    const formData = await req.formData();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {};
    formData.forEach((value, key) => {
        if (key === 'transferReceipt') return;
        data[key] = value.toString();
    });

    const file = formData.get('transferReceipt') as File | null;

    let transferReceiptUrl = '';

    if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const stream = Readable.from(buffer);

        const uploaded = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const cloudStream = cloudinary.uploader.upload_stream(
                { folder: 'donations' },
                (error, result) => {
                    if (error || !result) return reject(error);
                    resolve(result);
                }
            );
            stream.pipe(cloudStream);
        });

        transferReceiptUrl = uploaded.secure_url;
    }

    try {

        if (data.paymentMethod === "online") {
            const options = {
                amount: data.amount * 100,
                currency: 'INR',
                receipt: `rcptid_${Date.now()}`,
                payment_capture: 1,
                notes: {
                    name: data.amount,
                    email: data.email,
                },
            };
            const order = await razorpay.orders.create(options);
            const donation = new DonationModel({
                ...data,
                order_id: order.id,
                amount: Number(data.amount),

            });
            await donation.save();
            return NextResponse.json({
                message: 'Donation saved', 
                donation,
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            }, { status: 201 });
        } else {
            const donation = new DonationModel({
                ...data,
                amount: Number(data.amount),
                transferReceipt: transferReceiptUrl,
            });
            return NextResponse.json({ 
                message: 'Donation saved', 
                donation,
                amount: Number(data.amount),
                currency: "INR",
            }, { status: 201 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
