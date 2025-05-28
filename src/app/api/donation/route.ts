import { NextRequest, NextResponse } from 'next/server';
import DonationModel from '@/model/donation';
import cloudinary from '@/lib/cloudinary';
import { Readable } from 'stream';
import connect from '@/lib/connectDB';

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
    const donation = new DonationModel({
      ...data,
      amount: Number(data.amount),
      transferReceipt: transferReceiptUrl,
    });

    await donation.save();

    return NextResponse.json({ message: 'Donation saved', donation }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
