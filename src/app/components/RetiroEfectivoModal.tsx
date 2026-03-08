import { useState } from 'react';
import { X, AlertTriangle, Banknote, User, FileText } from 'lucide-react';

interface RetiroEfectivoModalProps {
  efectivoActual: number;
  onConfirm: (monto: number, responsable: string, concepto: string) => void;
  onClose: () => void;
}

export function RetiroEfectivoModal({ efectivoActual, onConfirm, onClose }: RetiroEfectivoModalProps) {
  const [monto, setMonto] = useState('');
  const [responsable, setResponsable] = useState('');
  const [concepto, setConcepto] = useState('Depósito bancario');

  const montoNumerico = parseFloat(monto) || 0;
  const efectivoRestante = efectivoActual - montoNumerico;
  const montoValido = montoNumerico > 0 && montoNumerico <= efectivoActual;

  const handleConfirm = () => {
    if (montoValido && responsable.trim()) {
      onConfirm(montoNumerico, responsable, concepto);
    }
  };

  // Suggested amounts
  const sugerencias = [100, 200, 300, 500];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Banknote className="size-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Retiro de Efectivo</h3>
              <p className="text-sm text-orange-100">Corte Parcial de Seguridad</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Cash Alert */}
          <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="size-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-orange-900 mb-1">
                Efectivo actual en caja: ${efectivoActual.toFixed(2)}
              </p>
              <p className="text-xs text-orange-700">
                Se recomienda realizar retiros de seguridad cuando el efectivo supere los $500.00
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monto a Retirar *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              {/* Quick Amount Suggestions */}
              <div className="mt-2 flex gap-2">
                <span className="text-xs text-gray-600 self-center">Sugerencias:</span>
                {sugerencias.map(cantidad => (
                  <button
                    key={cantidad}
                    onClick={() => setMonto(cantidad.toString())}
                    className="px-3 py-1 bg-gray-100 hover:bg-orange-100 border border-gray-300 hover:border-orange-400 text-sm font-medium text-gray-700 hover:text-orange-700 rounded-md transition-colors"
                  >
                    ${cantidad}
                  </button>
                ))}
              </div>

              {/* Validation Feedback */}
              {monto && !montoValido && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertTriangle className="size-3" />
                  El monto debe ser mayor a $0 y no exceder el efectivo actual
                </p>
              )}
            </div>

            {/* Responsable */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre de quien Retira *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  value={responsable}
                  onChange={(e) => setResponsable(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Concepto */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Concepto
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 size-5 text-gray-400" />
                <textarea
                  value={concepto}
                  onChange={(e) => setConcepto(e.target.value)}
                  placeholder="Motivo del retiro"
                  rows={2}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          {montoValido && (
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-purple-900 uppercase tracking-wide mb-2">
                Vista Previa del Retiro:
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-600">Monto a retirar:</p>
                  <p className="font-bold text-red-600">-${montoNumerico.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Efectivo restante:</p>
                  <p className="font-bold text-green-600">${efectivoRestante.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!montoValido || !responsable.trim()}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Banknote className="size-5" />
            Confirmar Retiro
          </button>
        </div>
      </div>
    </div>
  );
}
