import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { generatePhonePeChecksum } from '@/lib/phonepeUtils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, amount, frequency, instrument } = body;

    if (!userId || !amount || !frequency) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDatabase();
    const autopayId = `AUTOPAY_${Date.now()}`;

    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantUserId: userId,
      autopayId,
      amount: amount * 100,
      frequency, // e.g., 'MONTHLY', 'WEEKLY'
      paymentInstrument: instrument ? { type: instrument } : { type: 'PAY_PAGE', allowedInstruments: ['PHONEPE', 'PAYTM', 'GOOGLEPAY'] },
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/autopay-callback?autopayId=${autopayId}`,
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const checksum = generatePhonePeChecksum(base64Payload, '/pg/v1/autopay');

    // Save autopay in MongoDB
    await db.collection('autopay').insertOne({
      autopayId,
      userId,
      amount,
      frequency,
      status: 'PENDING',
      instrument: instrument || 'ALL',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await fetch(`${process.env.PHONEPE_BASE_URL}/pg/v1/autopay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        accept: 'application/json',
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    const data = await response.json();

    return NextResponse.json({
      redirectUrl: data.data?.instrumentResponse?.redirectInfo?.url,
      autopayId,
    });

  } catch (err) {
    console.error('Autopay API error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
