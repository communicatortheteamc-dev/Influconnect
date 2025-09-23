import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { generatePhonePeChecksum } from '@/lib/phonepeUtils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, amount, instrument } = body; // instrument optional

    if (!orderId || !amount) {
      return NextResponse.json({ message: 'Missing orderId or amount' }, { status: 400 });
    }

    const db = await getDatabase();

    // Refund payload supports instrument if needed
    const refundPayload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: orderId,
      refundAmount: amount * 100,
      paymentInstrument: instrument ? { type: instrument } : undefined,
    };

    const base64Payload = Buffer.from(JSON.stringify(refundPayload)).toString('base64');
    const checksum = generatePhonePeChecksum(base64Payload, '/pg/v1/refund');

    const response = await fetch(`${process.env.PHONEPE_BASE_URL}/pg/v1/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        accept: 'application/json',
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    const data = await response.json();

    if (data.success) {
      // Update transaction
      await db.collection('transactions').updateOne(
        { orderId },
        { $set: { status: 'REFUNDED', updatedAt: new Date() } }
      );

      // Log refund
      await db.collection('refunds').insertOne({
        refundId: data.data?.refundId,
        orderId,
        amount,
        instrument: instrument || 'PHONEPE',
        status: 'SUCCESS',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Refund API error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
