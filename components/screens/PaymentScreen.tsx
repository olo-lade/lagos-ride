
import React, { useState } from 'react';
import { PaymentDetails } from '../../types';
import { CreditCardIcon } from '../icons';
import { processPayment } from '../../services/mockApi';

interface PaymentScreenProps {
  details: PaymentDetails;
  onPaymentSuccess: () => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ details, onPaymentSuccess }) => {
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);
    setError('');
    
    // Simulate payment processing
    const result = await processPayment(details.amount, details.description);
    
    if (result.success) {
      onPaymentSuccess();
    } else {
      setError('Payment failed. Please check your card details and try again.');
      setIsPaying(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Confirm Your Payment</h1>
        <p className="text-center text-gray-500 mb-6">Securely complete your transaction for Lagos Ride.</p>
        
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center text-gray-600 mb-4">
                <span>{details.type}</span>
                <span>{details.description}</span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center text-2xl font-bold text-gray-800">
                <span>Total Amount</span>
                <span className="text-brand-primary">₦{details.amount.toLocaleString()}</span>
            </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
            <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCardIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" id="cardNumber" className="focus:ring-brand-primary focus:border-brand-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-3" placeholder="0000 0000 0000 0000" defaultValue="4242 4242 4242 4242" required />
                </div>
            </div>

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <input type="text" id="expiryDate" className="mt-1 focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-3" placeholder="MM / YY" defaultValue="12 / 25" required />
                </div>
                <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                    <input type="text" id="cvc" className="mt-1 focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-3" placeholder="123" defaultValue="123" required />
                </div>
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isPaying}
              className="w-full mt-6 bg-brand-secondary text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-amber-400 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 flex justify-center items-center"
            >
              {isPaying ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : `Pay ₦${details.amount.toLocaleString()}`}
            </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentScreen;
