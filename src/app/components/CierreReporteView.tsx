import { FileText, Printer, Download, X, CheckCircle } from 'lucide-react';
import { Transaction } from '../context/POSContext';
import { useState } from 'react';
import { Toast } from './Toast';
import { SaveFileDialog } from './SaveFileDialog';

interface CierreReporteViewProps {
  reportId: string;
  fondoInicial: number;
  transactions: Transaction[];
  onClose: () => void;
  onConfirmClose: () => void;
}

export function CierreReporteView({ 
  reportId, 
  fondoInicial, 
  transactions, 
  onClose,
  onConfirmClose 
}: CierreReporteViewProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'loading' | 'success'>('loading');
  const [toastMessage, setToastMessage] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

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

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('es-MX', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric',
    weekday: 'long'
  });
  const formattedTime = currentDate.toLocaleTimeString('es-MX', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });

  // Generate default file name
  const getDefaultFileName = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    return `Reporte_Caja_${dateStr}_Admin.pdf`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Show loading toast
    setToastMessage('Generando reporte de cierre...');
    setToastType('loading');
    setShowToast(true);

    // Simulate PDF generation delay
    setTimeout(() => {
      setShowToast(false);
      // Show save dialog
      setShowSaveDialog(true);
    }, 2000);
  };

  const handleSaveFile = (fileName: string, fullPath: string) => {
    // Close save dialog
    setShowSaveDialog(false);

    // Show success toast with path
    setToastMessage(`Archivo guardado correctamente en: ${fullPath}`);
    setToastType('success');
    setShowToast(true);
  };

  const handleCancelSave = () => {
    setShowSaveDialog(false);
  };

  const formatTransactionTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  const formatTransactionDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <FileText className="size-6 text-white" />
            <h3 className="text-lg font-bold text-white">Reporte de Cierre de Caja (Z)</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Printer className="size-4" />
            Imprimir
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            <Download className="size-4" />
            Descargar PDF
          </button>
          <div className="flex-1" />
          <span className="text-sm text-gray-600 flex items-center gap-2">
            <span className="size-2 bg-red-600 rounded-full animate-pulse"></span>
            Documento de Solo Lectura
          </span>
        </div>

        {/* Report Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="max-w-3xl mx-auto">
            {/* Report Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">SISTEMA POS</h1>
              <h2 className="text-xl font-semibold text-red-600 mb-4">REPORTE DE CIERRE DE CAJA (Z)</h2>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-4">
                <div className="text-left">
                  <p><strong>Reporte ID:</strong> {reportId}</p>
                  <p><strong>Fecha:</strong> {formattedDate}</p>
                  <p><strong>Hora de Cierre:</strong> {formattedTime}</p>
                </div>
                <div className="text-right">
                  <p><strong>Usuario:</strong> Admin</p>
                  <p><strong>Turno:</strong> Matutino</p>
                  <p><strong>Caja:</strong> #001</p>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="size-1.5 bg-blue-600 rounded-full"></span>
                Resumen Financiero
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
                <div className="flex justify-between text-base">
                  <span className="text-gray-700">Fondo Inicial:</span>
                  <span className="font-bold">${fondoInicial.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-700">Ventas del Turno:</span>
                  <span className="font-bold text-green-600">+${ventasTurno.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-700">Entradas Adicionales:</span>
                  <span className="font-bold text-blue-600">+${entradas.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-700">Salidas:</span>
                  <span className="font-bold text-red-600">-${salidas.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-3 mt-3">
                  <div className="flex justify-between text-xl">
                    <span className="font-bold text-gray-900">Efectivo Esperado en Caja:</span>
                    <span className="font-bold text-purple-600">${efectivoEsperado.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Statistics */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="size-1.5 bg-blue-600 rounded-full"></span>
                Estadísticas de Transacciones
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Ventas</p>
                  <p className="text-2xl font-bold text-green-700">
                    {transactions.filter(t => t.type === 'venta').length}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Entradas</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {transactions.filter(t => t.type === 'entrada').length}
                  </p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Salidas</p>
                  <p className="text-2xl font-bold text-red-700">
                    {transactions.filter(t => t.type === 'salida').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Log */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="size-1.5 bg-blue-600 rounded-full"></span>
                Log de Movimientos (Solo Lectura)
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Fecha/Hora</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Tipo</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Descripción</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                          {transaction.id}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {formatTransactionDate(transaction.timestamp)} {formatTransactionTime(transaction.timestamp)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === 'venta' ? 'bg-green-100 text-green-700' :
                            transaction.type === 'entrada' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {transaction.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {transaction.description}
                        </td>
                        <td className={`px-4 py-3 text-right font-bold ${
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

            {/* Footer */}
            <div className="border-t-2 border-gray-300 pt-6 text-center text-sm text-gray-600">
              <p className="mb-2">Este documento es un registro oficial de cierre de caja</p>
              <p className="mb-2">Generado automáticamente por Sistema POS v2.1.5</p>
              <p className="font-mono text-xs text-gray-400 mt-4">
                Firma: ___________________________ Fecha: _______________
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation Footer */}
        <div className="px-6 py-4 bg-gray-100 border-t border-gray-200 flex gap-3 print:hidden">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmClose}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="size-5" />
            Confirmar Cierre y Bloquear Caja
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Save File Dialog */}
      {showSaveDialog && (
        <SaveFileDialog
          defaultFileName={getDefaultFileName()}
          onSave={handleSaveFile}
          onCancel={handleCancelSave}
        />
      )}
    </div>
  );
}