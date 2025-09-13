'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Smartphone, CreditCard, Wallet, Shield, CheckCircle } from 'lucide-react';
import { Influencer } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface PaymentModalProps {
  influencer: Influencer;
  onClose: () => void;
}

export function PaymentModal({ influencer, onClose }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'phonepe' | 'googlepay' | 'paytm'>('phonepe');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const paymentMethods = [
    { id: 'phonepe', name: 'PhonePe', icon: Smartphone, color: 'bg-purple-500' },
    { id: 'googlepay', name: 'Google Pay', icon: CreditCard, color: 'bg-blue-500' },
    { id: 'paytm', name: 'Paytm', icon: Wallet, color: 'bg-blue-600' },
  ];

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would integrate with actual payment gateways:
      // - PhonePe: Use PhonePe Payment Gateway SDK
      // - Google Pay: Use Google Pay API
      // - Paytm: Use Paytm Payment Gateway
      
      setIsSuccess(true);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-[#000631] mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">
              Your payment of ₹{amount} has been sent to {influencer.name}.
            </p>
            <Button onClick={onClose} className="bg-[#EC6546] hover:bg-[#EC6546]/90">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#000631]">Send Payment</DialogTitle>
          <p className="text-gray-600">Send payment to {influencer.name}</p>
        </DialogHeader>

        <form onSubmit={handlePayment} className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <Label className="text-base font-semibold">Payment Method</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method.id as any)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedMethod === method.id
                      ? 'border-[#EC6546] bg-[#EC6546]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <method.icon className={`w-6 h-6 mx-auto mb-1 ${
                    selectedMethod === method.id ? 'text-[#EC6546]' : 'text-gray-500'
                  }`} />
                  <div className={`text-xs font-medium ${
                    selectedMethod === method.id ? 'text-[#EC6546]' : 'text-gray-600'
                  }`}>
                    {method.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
              min="1"
              step="0.01"
            />
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Payment for collaboration..."
            />
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 rounded-lg p-3 flex items-start space-x-2">
            <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Secure Payment</p>
              <p>Your payment is processed securely through encrypted channels.</p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Recipient:</span>
              <span className="font-medium">{influencer.name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">₹{amount || '0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Method:</span>
              <span className="font-medium capitalize">{selectedMethod}</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isProcessing || !amount}
            className="w-full bg-[#EC6546] hover:bg-[#EC6546]/90"
          >
            {isProcessing ? (
              <>
                <LoadingSpinner className="w-4 h-4 mr-2" />
                Processing Payment...
              </>
            ) : (
              `Pay ₹${amount || '0'}`
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}