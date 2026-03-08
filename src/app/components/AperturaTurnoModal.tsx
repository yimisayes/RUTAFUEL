import { useState } from 'react';
import { DollarSign, Clock, User, Wallet } from 'lucide-react';

interface AperturaTurnoModalProps {
  usuario: string;
  onConfirm: (montoInicial: number) => void;
}

export function AperturaTurnoModal({ usuario, onConfirm }: AperturaTurnoModalProps) {
  const [montoInicial, setMontoInicial] = useState('');
  
  const monto = parseFloat(montoInicial) || 0;
  const montoValido = monto > 0;

  const sugerencias = [100, 200, 300, 500, 1000];

  const handleConfirm = () => {
    if (montoValido) {
      onConfirm(monto);
    }
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('es-MX', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric',
    weekday: 'long'
  });
  const formattedTime = currentDate.toLocaleTimeString('es-MX', { 
    hour: '2-digit', 
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/95 to-purple-900/95 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-5 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Wallet className="size-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Apertura de Turno</h2>
              <p className="text-sm text-indigo-100">Inicia tu jornada de trabajo</p>
            </div>
          </div>
          
          {/* Info Bar */}
          <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur rounded-lg p-3">
            <div className="flex items-center gap-2">
              <User className="size-4 text-indigo-200" />
              <div>
                <p className="text-xs text-indigo-200">Usuario</p>
                <p className="font-semibold text-sm">{usuario}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-indigo-200" />
              <div>
                <p className="text-xs text-indigo-200">Fecha</p>
                <p className="font-semibold text-xs">{currentDate.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-indigo-200" />
              <div>
                <p className="text-xs text-indigo-200">Hora</p>
                <p className="font-semibold text-sm">{formattedTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content - Aplicar gap 16px */}
        <div className="p-6 space-y-4">
          {/* Alert */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <div className="size-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Wallet className="size-4 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-amber-900 text-sm mb-1">
                  La caja está cerrada
                </p>
                <p className="text-xs text-amber-700">
                  Registra el monto inicial de efectivo para comenzar a operar.
                </p>
              </div>
            </div>
          </div>

          {/* Monto Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Monto Inicial de Efectivo *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xl">
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={montoInicial}
                onChange={(e) => setMontoInicial(e.target.value)}
                placeholder="0.00"
                autoFocus
                className="w-full pl-12 pr-6 py-4 border-3 border-gray-300 rounded-lg text-2xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            {/* Quick Amount Suggestions */}
            <div className="mt-3 flex gap-2 flex-wrap">
              <span className="text-xs text-gray-600 self-center font-medium">Sugerencias:</span>
              {sugerencias.map(cantidad => (
                <button
                  key={cantidad}
                  onClick={() => setMontoInicial(cantidad.toString())}
                  className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-2 border-indigo-200 hover:border-indigo-400 text-indigo-700 font-bold rounded-lg transition-all text-sm"
                >
                  ${cantidad}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Card */}
          {montoValido && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-green-900 uppercase tracking-wide">
                  Resumen de Apertura
                </p>
                <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded-full">
                  LISTO
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-green-700">Fondo Inicial</p>
                  <p className="text-xl font-bold text-green-900">${monto.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-700">Estado de Caja</p>
                  <p className="text-lg font-bold text-green-700">Abierta</p>
                </div>
              </div>
            </div>
          )}

          {/* Important Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900">
              <strong>Importante:</strong> Este monto quedará registrado como fondo inicial 
              y no podrá ser modificado.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleConfirm}
            disabled={!montoValido}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-bold text-base rounded-lg transition-all shadow-lg disabled:shadow-none"
          >
            <DollarSign className="size-5" />
            {montoValido ? `Confirmar Apertura con $${monto.toFixed(2)}` : 'Ingresa un monto válido'}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            No puedes cerrar esta ventana sin confirmar la apertura
          </p>
        </div>
      </div>
    </div>
  );
}