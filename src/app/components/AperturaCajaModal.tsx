import { useState } from 'react';
import { DollarSign, Wallet } from 'lucide-react';

interface AperturaCajaModalProps {
  userName: string;
  onConfirm: (amount: number) => void;
}

export function AperturaCajaModal({ userName, onConfirm }: AperturaCajaModalProps) {
  const [amount, setAmount] = useState('500.00');

  const handleConfirm = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }
    onConfirm(parsedAmount);
  };

  const quickAmounts = [300, 500, 1000, 1500];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6 rounded-t-2xl text-center">
          <div className="inline-flex items-center justify-center size-16 bg-white/20 rounded-full mb-3">
            <Wallet className="size-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">Apertura de Caja</h3>
          <p className="text-green-100 text-sm">Bienvenido, {userName}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> Ingresa el monto de efectivo inicial con el que comenzarás tu turno. Este será tu fondo de apertura.
            </p>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Monto de Apertura (Efectivo)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-6 text-gray-400" />
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-14 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-2xl font-bold text-gray-900"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Puedes ajustar este monto manualmente o usar las opciones rápidas
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Montos Rápidos:</p>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toFixed(2))}
                  className={`px-3 py-2 rounded-lg border-2 transition-all font-semibold text-sm ${
                    parseFloat(amount) === quickAmount
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300 text-gray-700'
                  }`}
                >
                  ${quickAmount}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Usuario:</span>
              <span className="font-medium text-gray-900">{userName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fecha:</span>
              <span className="font-medium text-gray-900">
                {new Date().toLocaleDateString('es-MX', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Hora:</span>
              <span className="font-medium text-gray-900">
                {new Date().toLocaleTimeString('es-MX', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Fondo Inicial:</span>
              <span className="text-xl font-bold text-green-600">
                ${parseFloat(amount || '0').toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleConfirm}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Confirmar y Abrir Caja
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            Al confirmar, se iniciará tu turno de trabajo
          </p>
        </div>
      </div>
    </div>
  );
}
