import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { autopayId, transactionStatus, transactionId, instrumentType } = body;

    if (!autopayId) {
      return NextResponse.json({ message: 'Missing autopayId' }, { status: 400 });
    }

    const db = await getDatabase();

    const status = transactionStatus === 'SUCCESS' ? 'SUCCESS' : 'FAILED';

    // Update autopay record
    await db.collection('autopay').updateOne(
      { autopayId },
      {
        $set: {
          status,
          phonePeTransactionId: transactionId,
          paymentMethod: instrumentType,
          updatedAt: new Date(),
        },
      }
    );

    // Optional: also log in transactions collection
    await db.collection('transactions').insertOne({
      orderId: autopayId,
      userId: null,
      amount: null,
      status,
      phonePeTransactionId: transactionId,
      paymentMethod: instrumentType,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: 'AUTOPAY',
    });

    return NextResponse.json({ message: 'Autopay callback processed successfully' });
  } catch (error) {
    console.error('Autopay callback error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
