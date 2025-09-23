import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { generatePhonePeChecksum } from '@/lib/phonepeUtils';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, amount, instruments } = body;

        if (!userId || !amount) {
            return NextResponse.json({ message: 'Missing userId or amount' }, { status: 400 });
        }

        const db = await getDatabase();
        const orderId = `ORDER_${Date.now()}`;

        // Payment payload
        const payload = {
            merchantId: process.env.PHONEPE_MERCHANT_ID,
            merchantTransactionId: orderId,
            merchantUserId: userId,
            amount: parseFloat(amount) * 100, // in paise
            redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-callback?orderId=${orderId}`,
            redirectMode: 'POST',
            paymentInstrument: {
                type: 'PAY_PAGE',
                allowedInstruments: instruments || ['PHONEPE'], // default to PhonePe
            },
        };

        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
        const checksum = generatePhonePeChecksum(base64Payload, '/pg/v1/pay');

        // Save transaction in MongoDB
        await db.collection('transactions').insertOne({
            orderId,
            userId,
            amount,
            status: 'PENDING',
            allowedInstruments: instruments || ['PHONEPE'], // save allowed options
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const response = await fetch(`${process.env.PHONEPE_BASE_URL}/pg/v1/pay`, {
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
            redirectUrl: data.data.instrumentResponse.redirectInfo.url,
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
