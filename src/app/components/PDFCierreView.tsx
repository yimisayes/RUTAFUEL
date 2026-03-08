import { X, FileText } from 'lucide-react';
import { Transaction } from '../context/POSContext';

interface PDFCierreViewProps {
  reportId: string;
  fondoInicial: number;
  transactions: Transaction[];
  closedBy: string;
  closedAt: Date;
  onClose: () => void;
}

export function PDFCierreView({ 
  reportId, 
  fondoInicial, 
  transactions, 
  closedBy,
  closedAt,
  onClose 
}: PDFCierreViewProps) {
  const ventasTurno = transactions
    .filter(t => t.type === 'venta')
    .reduce((sum, t) => sum + t.amount, 0);

  const entradas = transactions
    .filter(t => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0);

  const salidas = transactions
    .filter(t => t.type === 'salida')
    .reduce((sum, t) => sum + t.amount, 0);

  const efectivoEsperado = fondoInicial + ventasTurno + entradas - salidas;

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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-8">
      <div className="relative bg-white shadow-2xl" style={{ width: '210mm', maxHeight: '95vh', overflow: 'auto' }}>
        {/* Close Button - Outside A4 */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 size-10 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          <X className="size-6 text-gray-700" />
        </button>

        {/* A4 Document Content */}
        <div className="bg-white p-16" style={{ minHeight: '297mm' }}>
          {/* Header */}
          <div className="text-center mb-12 pb-8 border-b-4 border-gray-900">
            <div className="inline-flex items-center justify-center size-20 bg-blue-600 rounded-2xl mb-6">
              <FileText className="size-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Reporte de Cierre de Caja
            </h1>
            <p className="text-xl text-gray-600 uppercase tracking-wide">
              Documento Z - No Modificable
            </p>
          </div>

          {/* Document Info */}
          <div className="grid grid-cols-2 gap-8 mb-12 bg-gray-50 p-8 rounded-lg border border-gray-200">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                ID de Reporte
              </p>
              <p className="text-2xl font-bold text-gray-900 font-mono">
                {reportId}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Estado del Documento
              </p>
              <span className="inline-block px-4 py-2 bg-red-100 text-red-700 text-sm font-bold rounded-full">
                🔒 BLOQUEADO
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Fecha de Cierre
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(closedAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Hora de Cierre
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {formatTime(closedAt)}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Usuario Responsable
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {closedBy}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Caja Número
              </p>
              <p className="text-lg font-semibold text-gray-900">
                #001
              </p>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-300">
              Resumen Financiero
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-lg font-medium text-gray-700">Fondo Inicial de Caja:</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${fondoInicial.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-lg font-medium text-gray-700">Total de Ventas:</span>
                <span className="text-2xl font-bold text-green-600">
                  +${ventasTurno.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-lg font-medium text-gray-700">Entradas Adicionales:</span>
                <span className="text-2xl font-bold text-blue-600">
                  +${entradas.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-lg font-medium text-gray-700">Salidas de Efectivo:</span>
                <span className="text-2xl font-bold text-red-600">
                  -${salidas.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-6 bg-purple-50 px-6 rounded-lg border-2 border-purple-300">
                <span className="text-xl font-bold text-gray-900">
                  Efectivo Total Esperado:
                </span>
                <span className="text-3xl font-bold text-purple-600">
                  ${efectivoEsperado.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Statistics */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-300">
              Estadísticas de Movimientos
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Ventas Realizadas
                </p>
                <p className="text-5xl font-bold text-green-700">
                  {transactions.filter(t => t.type === 'venta').length}
                </p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Ingresos Adicionales
                </p>
                <p className="text-5xl font-bold text-blue-700">
                  {transactions.filter(t => t.type === 'entrada').length}
                </p>
              </div>
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Egresos Registrados
                </p>
                <p className="text-5xl font-bold text-red-700">
                  {transactions.filter(t => t.type === 'salida').length}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Transaction Log */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-300">
              Registro Detallado de Transacciones
            </h2>
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-bold uppercase">Tipo</th>
                    <th className="px-4 py-3 text-left text-sm font-bold uppercase">Descripción</th>
                    <th className="px-4 py-3 text-left text-sm font-bold uppercase">Usuario</th>
                    <th className="px-4 py-3 text-right text-sm font-bold uppercase">Monto</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {transactions.map((transaction, index) => (
                    <tr key={transaction.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3 text-sm font-mono text-gray-700 border-b border-gray-200">
                        {transaction.id}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          transaction.type === 'venta' ? 'bg-green-100 text-green-700' :
                          transaction.type === 'entrada' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-200">
                        {transaction.user}
                      </td>
                      <td className={`px-4 py-3 text-sm font-bold text-right border-b border-gray-200 ${
                        transaction.type === 'salida' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'salida' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer / Signatures */}
          <div className="pt-12 border-t-4 border-gray-900">
            <div className="grid grid-cols-2 gap-12 mb-8">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-4">Responsable de Cierre:</p>
                <div className="border-b-2 border-gray-400 pb-2 mb-2">
                  <p className="text-lg font-bold text-gray-900">{closedBy}</p>
                </div>
                <p className="text-xs text-gray-500">Firma y Fecha</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-4">Supervisión:</p>
                <div className="border-b-2 border-gray-400 pb-2 mb-2">
                  <p className="text-lg font-bold text-gray-900">_____________________</p>
                </div>
                <p className="text-xs text-gray-500">Firma y Fecha</p>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">
                Este documento ha sido generado automáticamente por el Sistema POS
              </p>
              <p className="text-xs text-gray-500">
                Versión 2.1.5 • Documento de Solo Lectura • No Modificable
              </p>
              <p className="text-xs text-gray-400 mt-2 font-mono">
                Generado el {formatDate(closedAt)} a las {formatTime(closedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
