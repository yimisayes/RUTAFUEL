import { useState, useEffect } from 'react';
import { Printer, CheckCircle, X } from 'lucide-react';

interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface TicketPrintOverlayProps {
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  transactionId: string;
  onClose: () => void;
}

export function TicketPrintOverlay({ 
  orderItems, 
  subtotal, 
  tax, 
  total, 
  transactionId,
  onClose 
}: TicketPrintOverlayProps) {
  const [printStatus, setPrintStatus] = useState<'printing' | 'completed'>('printing');

  useEffect(() => {
    // Simular tiempo de impresión
    const timer = setTimeout(() => {
      setPrintStatus('completed');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('es-MX', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
  const formattedTime = currentDate.toLocaleTimeString('es-MX', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Printer className="size-6 text-white" />
            <h3 className="text-lg font-bold text-white">
              {printStatus === 'printing' ? 'Imprimiendo...' : 'Impresión Completada'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Printing Status */}
        {printStatus === 'printing' && (
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center gap-3">
              <div className="animate-spin">
                <Printer className="size-5 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-blue-800">
                Imprimiendo en impresora predeterminada...
              </p>
            </div>
          </div>
        )}

        {printStatus === 'completed' && (
          <div className="px-6 py-4 bg-green-50 border-b border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="size-5 text-green-600" />
              <p className="text-sm font-medium text-green-800">
                Ticket impreso correctamente
              </p>
            </div>
          </div>
        )}

        {/* Ticket Preview - Formato 80mm */}
        <div className="p-6 bg-gray-50">
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 font-mono text-sm max-h-[500px] overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-4 pb-4 border-b-2 border-dashed border-gray-400">
              <h2 className="text-lg font-bold mb-1">SISTEMA POS</h2>
              <p className="text-xs">Calle Principal #123</p>
              <p className="text-xs">Tel: (555) 123-4567</p>
              <p className="text-xs">RFC: ABC123456XYZ</p>
            </div>

            {/* Transaction Info */}
            <div className="mb-4 pb-4 border-b border-gray-300 text-xs">
              <div className="flex justify-between mb-1">
                <span>TICKET:</span>
                <span className="font-bold">{transactionId}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>FECHA:</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>HORA:</span>
                <span>{formattedTime}</span>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4 pb-4 border-b border-gray-300">
              <div className="mb-2 font-bold text-xs">
                <div className="flex justify-between">
                  <span>CANT</span>
                  <span className="flex-1 ml-2">DESCRIPCIÓN</span>
                  <span className="w-20 text-right">IMPORTE</span>
                </div>
              </div>
              {orderItems.map((item, index) => (
                <div key={index} className="mb-3 text-xs">
                  <div className="flex justify-between">
                    <span className="w-8">{item.quantity}</span>
                    <span className="flex-1">{item.product.name}</span>
                    <span className="w-20 text-right font-bold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-gray-600 ml-8">
                    @${item.product.price.toFixed(2)} c/u
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mb-4 pb-4 border-b-2 border-gray-400 text-xs space-y-1">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (13%):</span>
                <span className="font-bold">${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-4 pb-4 border-b-2 border-dashed border-gray-400">
              <div className="flex justify-between text-lg font-bold">
                <span>TOTAL:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs space-y-1">
              <p className="font-bold">¡GRACIAS POR SU COMPRA!</p>
              <p>Atendido por: Usuario Admin</p>
              <p className="text-gray-600 mt-3">Sistema POS v2.1.5</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            {printStatus === 'completed' ? 'Cerrar' : 'Continuar'}
          </button>
        </div>
      </div>
    </div>
  );
}