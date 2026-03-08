import { useState } from 'react';
import { DollarSign, TrendingUp, Wallet, Plus, Minus, X, CheckCircle, Banknote } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { CierreReporteView } from './CierreReporteView';
import { CajaCerradaView } from './CajaCerradaView';
import { RetiroSupervisorModal } from './RetiroSupervisorModal';

export function CajaViewWithContext() {
  const { transactions, addTransaction, isCajaCerrada, createCierreReport, clearCurrentTransactions, reopenCaja, fondoInicial, currentUser } = usePOS();
  const [showIngresoModal, setShowIngresoModal] = useState(false);
  const [showCierreModal, setShowCierreModal] = useState(false);
  const [showCierreReporte, setShowCierreReporte] = useState(false);
  const [showRetiroSupervisor, setShowRetiroSupervisor] = useState(false);
  const [ingresoAmount, setIngresoAmount] = useState('');
  const [ingresoDescription, setIngresoDescription] = useState('');
  const [lastReportId, setLastReportId] = useState('');
  const [closedAt, setClosedAt] = useState<Date>(new Date());

  // If caja is closed, show the closed view
  if (isCajaCerrada) {
    return <CajaCerradaView reportId={lastReportId} closedAt={closedAt} onReopenCaja={reopenCaja} />;
  }

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

  const handleIngreso = () => {
    if (ingresoAmount && parseFloat(ingresoAmount) > 0) {
      addTransaction({
        type: 'entrada',
        amount: parseFloat(ingresoAmount),
        description: ingresoDescription || 'Ingreso de efectivo',
        user: 'Usuario Actual'
      });
      setIngresoAmount('');
      setIngresoDescription('');
      setShowIngresoModal(false);
    }
  };

  const handleRetiroExitoso = (monto: number, supervisor: string) => {
    // Crear transacción de retiro
    addTransaction({
      type: 'salida',
      amount: monto,
      description: `Retiro Autorizado por ${supervisor}`,
      user: currentUser?.name || 'Usuario'
    });
    
    setShowRetiroSupervisor(false);
  };

  const handleOpenCierreModal = () => {
    setShowCierreModal(true);
  };

  const handleConfirmCierre = () => {
    setShowCierreModal(false);
    // Mostrar el reporte de cierre
    setShowCierreReporte(true);
  };

  const handleFinalCierre = () => {
    // 1. Crear el reporte y guardarlo
    const reportId = createCierreReport(fondoInicial);
    setLastReportId(reportId);
    setClosedAt(new Date());
    
    // 2. Limpiar las transacciones actuales
    clearCurrentTransactions();
    
    // 3. Cerrar el modal del reporte
    setShowCierreReporte(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="h-full flex relative">
      {/* Botón Flotante de Retiro - Top Right */}
      <button
        onClick={() => setShowRetiroSupervisor(true)}
        className="fixed top-6 right-6 z-40 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg shadow-2xl transition-all hover:scale-105"
      >
        <Banknote className="size-5" />
        Retiro de Efectivo
      </button>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard de Turno</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Fondo Inicial */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wallet className="size-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Fondo Inicial</h3>
            </div>
            <p className="text-3xl font-semibold text-gray-900">${fondoInicial.toFixed(2)}</p>
          </div>

          {/* Ventas del Turno */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="size-5 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Ventas del Turno</h3>
            </div>
            <p className="text-3xl font-semibold text-green-600">${ventasTurno.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">
              {transactions.filter(t => t.type === 'venta').length} transacciones
            </p>
          </div>

          {/* Efectivo Esperado */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="size-5 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Efectivo Esperado</h3>
            </div>
            <p className="text-3xl font-semibold text-purple-600">${efectivoEsperado.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">
              +${entradas.toFixed(2)} / -${salidas.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Historial de Movimientos</h2>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {transactions.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No hay movimientos registrados en este turno
              </div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'venta' ? 'bg-green-100' :
                        transaction.type === 'entrada' ? 'bg-blue-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'venta' ? (
                          <DollarSign className="size-5 text-green-600" />
                        ) : transaction.type === 'entrada' ? (
                          <Plus className="size-5 text-blue-600" />
                        ) : (
                          <Minus className="size-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {transaction.user} • {formatDate(transaction.timestamp)} {formatTime(transaction.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        transaction.type === 'salida' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'salida' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </p>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        transaction.type === 'venta' ? 'bg-green-100 text-green-700' :
                        transaction.type === 'entrada' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Sidebar */}
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Acciones Rápidas</h3>

        {/* Ingreso de Efectivo */}
        <button
          onClick={() => setShowIngresoModal(true)}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          <Plus className="size-5" />
          Ingreso de Efectivo
        </button>

        {/* Info Box */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Hora de inicio:</span>
            <span className="font-medium">08:00 AM</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Usuario:</span>
            <span className="font-medium">Admin</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Movimientos:</span>
            <span className="font-medium">{transactions.length}</span>
          </div>
        </div>

        {/* Cierre de Caja Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={handleOpenCierreModal}
            className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
          >
            <CheckCircle className="size-6" />
            Cierre de Caja (Z)
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Esta acción finalizará el turno actual
          </p>
        </div>
      </div>

      {/* Ingreso Modal */}
      {showIngresoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Ingreso de Efectivo</h3>
              <button
                onClick={() => setShowIngresoModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto
                </label>
                <input
                  type="number"
                  value={ingresoAmount}
                  onChange={(e) => setIngresoAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  value={ingresoDescription}
                  onChange={(e) => setIngresoDescription(e.target.value)}
                  placeholder="Motivo del ingreso"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowIngresoModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleIngreso}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cierre de Caja Modal */}
      {showCierreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Cierre de Caja</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ Esta acción finalizará el turno actual
                </p>
              </div>
              
              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fondo Inicial:</span>
                  <span className="font-semibold">${fondoInicial.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ventas:</span>
                  <span className="font-semibold text-green-600">+${ventasTurno.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Entradas:</span>
                  <span className="font-semibold text-blue-600">+${entradas.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salidas:</span>
                  <span className="font-semibold text-red-600">-${salidas.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-semibold text-lg">Efectivo Esperado:</span>
                  <span className="font-bold text-lg text-purple-600">${efectivoEsperado.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                ¿Estás seguro de que deseas realizar el cierre de caja?
              </p>
            </div>
            <div className="flex gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowCierreModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmCierre}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
              >
                Confirmar Cierre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cierre Reporte Modal */}
      {showCierreReporte && (
        <CierreReporteView
          reportId={`CZ-${Date.now().toString().slice(-8)}`}
          fondoInicial={fondoInicial}
          transactions={transactions}
          onClose={() => setShowCierreReporte(false)}
          onConfirmClose={handleFinalCierre}
        />
      )}

      {/* Retiro Supervisor Modal */}
      {showRetiroSupervisor && (
        <RetiroSupervisorModal
          cajero={currentUser?.name || 'Usuario'}
          onClose={() => setShowRetiroSupervisor(false)}
          onSuccess={handleRetiroExitoso}
        />
      )}
    </div>
  );
}