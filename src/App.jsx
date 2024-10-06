import React, { useState, useEffect } from 'react';
import { Bitcoin, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode.react';

const API_BASE_URL = 'https://api.lightning.network'; // Replace with actual Lightning Network API

function App() {
  const [amount, setAmount] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle');

  const generateInvoice = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });
      const data = await response.json();
      setInvoice(data.invoice);
      setPaymentStatus('pending');
      checkPaymentStatus(data.invoice.id);
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  };

  const checkPaymentStatus = async (invoiceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/check-payment/${invoiceId}`);
      const data = await response.json();
      if (data.status === 'paid') {
        setPaymentStatus('paid');
      } else if (data.status === 'pending') {
        setTimeout(() => checkPaymentStatus(invoiceId), 5000);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <Bitcoin className="text-yellow-500 w-12 h-12 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Lightning Pay</h1>
        </div>
        
        {paymentStatus === 'idle' && (
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (in sats)
            </label>
            <div className="flex items-center mb-4">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
              />
              <button
                onClick={generateInvoice}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
              >
                Generate Invoice
              </button>
            </div>
          </div>
        )}

        {invoice && (
          <div className="text-center">
            <QRCode value={invoice.paymentRequest} size={200} className="mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">Scan QR code or copy invoice below</p>
            <div className="bg-gray-100 p-2 rounded mb-4 overflow-x-auto">
              <code className="text-xs">{invoice.paymentRequest}</code>
            </div>
          </div>
        )}

        {paymentStatus === 'pending' && (
          <div className="flex items-center justify-center text-yellow-500">
            <Zap className="animate-pulse mr-2" />
            <p>Waiting for payment...</p>
          </div>
        )}

        {paymentStatus === 'paid' && (
          <div className="flex items-center justify-center text-green-500">
            <CheckCircle className="mr-2" />
            <p>Payment received!</p>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Why use Lightning Network?</h2>
          <ul className="list-disc list-inside text-sm text-gray-700">
            <li>Instant transactions</li>
            <li>Low fees</li>
            <li>Increased privacy</li>
            <li>Scalability for Bitcoin</li>
          </ul>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Need help? Contact support@lightningpay.com</p>
        </div>
      </div>
    </div>
  );
}

export default App;