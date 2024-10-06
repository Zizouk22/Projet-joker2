import React, { useState } from 'react';
import { Bitcoin, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode.react';

// Fonctions API simulées
const mockGenerateInvoice = (amount: number): Promise<{ paymentRequest: string; id: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        paymentRequest: `lnbc${amount}n1p3hkzxgpp5ygvm5...`, // Facture simulée
        id: Math.random().toString(36).substring(7),
      });
    }, 1000);
  });
};

const mockCheckPayment = (id: string): Promise<{ status: 'en attente' | 'payé' }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: Math.random() > 0.5 ? 'payé' : 'en attente' });
    }, 1000);
  });
};

function App() {
  const [amount, setAmount] = useState('');
  const [invoice, setInvoice] = useState<{ paymentRequest: string; id: string } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'inactif' | 'en attente' | 'payé' | 'erreur'>('inactif');
  const [error, setError] = useState<string | null>(null);

  const generateInvoice = async () => {
    try {
      setError(null);
      setPaymentStatus('en attente');
      const data = await mockGenerateInvoice(parseFloat(amount));
      setInvoice(data);
      checkPaymentStatus(data.id);
    } catch (error) {
      console.error('Erreur lors de la génération de la facture:', error);
      setError('Échec de la génération de la facture. Veuillez réessayer.');
      setPaymentStatus('erreur');
    }
  };

  const checkPaymentStatus = async (invoiceId: string) => {
    try {
      const data = await mockCheckPayment(invoiceId);
      if (data.status === 'payé') {
        setPaymentStatus('payé');
      } else if (data.status === 'en attente') {
        setTimeout(() => checkPaymentStatus(invoiceId), 5000);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut du paiement:', error);
      setError('Échec de la vérification du statut du paiement. Veuillez réessayer.');
      setPaymentStatus('erreur');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <Bitcoin className="text-yellow-500 w-12 h-12 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Paiement Lightning</h1>
        </div>
        
        {paymentStatus === 'inactif' && (
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Montant (en sats)
            </label>
            <div className="flex items-center mb-4">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez le montant"
              />
              <button
                onClick={generateInvoice}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
              >
                Générer la facture
              </button>
            </div>
          </div>
        )}

        {invoice && (
          <div className="text-center">
            <QRCode value={invoice.paymentRequest} size={200} className="mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">Scannez le QR code ou copiez la facture ci-dessous</p>
            <div className="bg-gray-100 p-2 rounded mb-4 overflow-x-auto">
              <code className="text-xs">{invoice.paymentRequest}</code>
            </div>
          </div>
        )}

        {paymentStatus === 'en attente' && (
          <div className="flex items-center justify-center text-yellow-500">
            <Zap className="animate-pulse mr-2" />
            <p>En attente du paiement...</p>
          </div>
        )}

        {paymentStatus === 'payé' && (
          <div className="flex items-center justify-center text-green-500">
            <CheckCircle className="mr-2" />
            <p>Paiement reçu !</p>
          </div>
        )}

        {paymentStatus === 'erreur' && (
          <div className="flex items-center justify-center text-red-500">
            <AlertCircle className="mr-2" />
            <p>{error}</p>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Pourquoi utiliser le réseau Lightning ?</h2>
          <ul className="list-disc list-inside text-sm text-gray-700">
            <li>Transactions instantanées</li>
            <li>Frais réduits</li>
            <li>Confidentialité accrue</li>
            <li>Évolutivité pour Bitcoin</li>
          </ul>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Besoin d'aide ? Contactez support@paiementlightning.com</p>
        </div>
      </div>
    </div>
  );
}

export default App;