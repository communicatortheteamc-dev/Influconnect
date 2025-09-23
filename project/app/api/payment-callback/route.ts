import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { generatePhonePeChecksum } from '@/lib/phonepeUtils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, transactionStatus, transactionId, instrumentType } = body;

    if (!orderId) {
      return NextResponse.json({ message: 'Missing orderId' }, { status: 400 });
    }

    const db = await getDatabase();                                                   

    const status = transactionStatus === 'SUCCESS' ? 'SUCCESS' : 'FAILED';

    // Update transaction
    await db.collection('transactions').updateOne(
      { orderId }, 
      {
        $set: {
          status,
          phonePeTransactionId: transactionId,
          paymentMethod: instrumentType,
          updatedAt: new Date(),
        }, 
      }
    );

    // Redirect user to frontend success/failure page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/${status.toLowerCase()}?orderId=${orderId}`);
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
