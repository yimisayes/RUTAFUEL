import { X, Printer, CheckCircle } from 'lucide-react';

interface VoucherRetiroProps {
  folio: string;
  monto: number;
  responsable: string;
  concepto: string;
  cajero: string;
  fecha: Date;
  efectivoRestante: number;
  onClose: () => void;
}

export function VoucherRetiro({ 
  folio, 
  monto, 
  responsable, 
  concepto, 
  cajero,
  fecha,
  efectivoRestante,
  onClose 
}: VoucherRetiroProps) {
  const handlePrint = () => {
    window.print();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 size-10 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg transition-colors print:hidden"
        >
          <X className="size-6 text-gray-700" />
        </button>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="absolute -top-12 left-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-colors flex items-center gap-2 print:hidden"
        >
          <Printer className="size-4" />
          Imprimir
        </button>

        {/* Ticket/Voucher */}
        <div className="bg-white shadow-2xl" style={{ width: '80mm', maxHeight: '90vh', overflow: 'auto' }}>
          <div className="p-6 font-mono text-xs">
            {/* Header */}
            <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
              <h1 className="font-bold text-base mb-1">SISTEMA POS</h1>
              <h2 className="font-bold text-sm mb-2">COMPROBANTE DE RETIRO</h2>
              <p className="text-xs text-gray-600">Corte Parcial de Efectivo</p>
            </div>

            {/* Folio */}
            <div className="mb-4 text-center bg-gray-100 py-2 border border-gray-300">
              <p className="text-xs text-gray-600">FOLIO DE RETIRO</p>
              <p className="font-bold text-lg">{folio}</p>
            </div>

            {/* Date & Time */}
            <div className="mb-4 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-semibold">{formatDate(fecha)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hora:</span>
                <span className="font-semibold">{formatTime(fecha)}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-400 pt-3 mb-4"></div>

            {/* Amount Details */}
            <div className="mb-4">
              <div className="bg-red-50 border-2 border-red-400 rounded p-3 mb-3">
                <p className="text-xs text-gray-600 mb-1">MONTO RETIRADO:</p>
                <p className="font-bold text-2xl text-center text-red-600">
                  ${monto.toFixed(2)}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Efectivo restante:</span>
                  <span className="font-semibold text-green-600">${efectivoRestante.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-400 pt-3 mb-4"></div>

            {/* Personnel Info */}
            <div className="mb-4 space-y-2">
              <div>
                <p className="text-xs text-gray-600">RETIRADO POR:</p>
                <p className="font-bold">{responsable}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">CAJERO RESPONSABLE:</p>
                <p className="font-bold">{cajero}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">CONCEPTO:</p>
                <p className="font-semibold">{concepto}</p>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-400 pt-3 mb-4"></div>

            {/* Signature Section */}
            <div className="mb-4 space-y-4">
              <div>
                <p className="text-xs text-gray-600 mb-2">FIRMA DEL CAJERO:</p>
                <div className="border-b-2 border-gray-400 h-12"></div>
                <p className="text-xs text-gray-500 text-center mt-1">{cajero}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-2">FIRMA DE QUIEN RETIRA:</p>
                <div className="border-b-2 border-gray-400 h-12"></div>
                <p className="text-xs text-gray-500 text-center mt-1">{responsable}</p>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-400 pt-3 mb-4"></div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500">
              <p className="mb-1">Documento válido como comprobante</p>
              <p className="mb-1">de retiro de efectivo</p>
              <div className="mt-3 bg-green-100 border border-green-400 rounded p-2 flex items-center justify-center gap-2">
                <CheckCircle className="size-4 text-green-600" />
                <span className="font-semibold text-green-800">RETIRO AUTORIZADO</span>
              </div>
              <p className="mt-3 text-xs">Sistema POS v2.1.5</p>
            </div>

            {/* Barcode simulation */}
            <div className="mt-4 flex justify-center">
              <div className="space-x-px">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="inline-block bg-gray-800"
                    style={{
                      width: Math.random() > 0.5 ? '2px' : '1px',
                      height: '40px'
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 mt-1">{folio}</p>

            {/* Tear line */}
            <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-400 text-center text-xs text-gray-400">
              ✂️ CORTAR AQUÍ ✂️
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
