import { useState } from 'react';
import { DollarSign, X, CheckCircle } from 'lucide-react';

interface FondoInicialModalProps {
  userName: string;
  onConfirm: (amount: number) => void;
}

export function FondoInicialModal({ userName, onConfirm }: FondoInicialModalProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleNumberClick = (num: string) => {
    if (amount.length < 10) {
      setAmount(amount + num);
      setError('');
    }
  };

  const handleBackspace = () => {
    setAmount(amount.slice(0, -1));
  };

  const handleClear = () => {
    setAmount('');
    setError('');
  };

  const handleConfirm = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Por favor ingresa un monto válido mayor a 0');
      return;
    }

    if (numAmount < 50) {
      setError('El fondo inicial debe ser al menos $50.00');
      return;
    }

    onConfirm(numAmount);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-white/20 rounded-full flex items-center justify-center">
              <DollarSign className="size-7 text-white" />
            </div>
            <div className="text-white">
              <h3 className="text-xl font-bold">Apertura de Caja</h3>
              <p className="text-sm text-green-100">Ingresa el fondo inicial</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Welcome Message */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Bienvenido, {userName}</strong>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Para comenzar el turno, ingresa el efectivo inicial de la caja
            </p>
          </div>

          {/* Amount Display */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fondo Inicial de Caja
            </label>
            <div className="bg-gray-900 text-green-400 rounded-lg px-4 py-4 text-right font-mono text-3xl font-bold border-2 border-gray-700">
              ${amount || '0.00'}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Monto mínimo recomendado: $50.00
            </p>
          </div>

          {/* Teclado Numérico */}
          <div className="mb-4">
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  onKeyPress={handleKeyPress}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold text-xl py-4 rounded-lg transition-colors"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="bg-red-100 hover:bg-red-200 text-red-700 font-bold text-sm py-4 rounded-lg transition-colors"
              >
                CLEAR
              </button>
              <button
                onClick={() => handleNumberClick('0')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold text-xl py-4 rounded-lg transition-colors"
              >
                0
              </button>
              <button
                onClick={() => handleNumberClick('.')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold text-xl py-4 rounded-lg transition-colors"
              >
                .
              </button>
            </div>
            <button
              onClick={handleBackspace}
              className="w-full mt-2 bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-3 rounded-lg transition-colors"
            >
              ← Borrar
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border-2 border-red-400 rounded-lg p-3">
              <p className="text-sm font-semibold text-red-700 text-center">
                {error}
              </p>
            </div>
          )}

          {/* Suggestions */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-2">Montos sugeridos:</p>
            <div className="grid grid-cols-4 gap-2">
              {['50', '100', '200', '500'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setAmount(preset);
                    setError('');
                  }}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2 rounded-lg transition-colors text-sm"
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <button
            onClick={handleConfirm}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            <CheckCircle className="size-6" />
            Confirmar y Abrir Caja
          </button>
        </div>
      </div>
    </div>
  );
}
