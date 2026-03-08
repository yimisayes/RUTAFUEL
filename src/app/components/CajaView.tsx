import { useState } from 'react';
import { DollarSign, TrendingUp, Wallet, Plus, Minus, X, CheckCircle, AlertTriangle, Banknote, ArrowDownLeft } from 'lucide-react';
import { RetiroEfectivoModal } from './RetiroEfectivoModal';
import { VoucherRetiro } from './VoucherRetiro';
import { Toast } from './Toast';

interface Transaction {
  id: string;
  type: 'entrada' | 'salida' | 'venta';
  amount: number;
  description: string;
  timestamp: Date;
  user: string;
}

export function CajaView() {
  const [showIngresoModal, setShowIngresoModal] = useState(false);
  const [showCierreModal, setShowCierreModal] = useState(false);
  const [showRetiroModal, setShowRetiroModal] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'loading' | 'success'>('success');
  
  const [lastRetiro, setLastRetiro] = useState<{
    folio: string;
    monto: number;
    responsable: string;
    concepto: string;
    fecha: Date;
    efectivoRestante: number;
  } | null>(null);
  
  const [ingresoAmount, setIngresoAmount] = useState('');
  const [ingresoDescription, setIngresoDescription] = useState('');

  const fondoInicial = 500.00;
  const LIMITE_ALERTA = 500.00; // Trigger alert when cash exceeds this
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'venta',
      amount: 45.50,
      description: 'Venta #001 - Café y Sandwich',
      timestamp: new Date(2026, 1, 18, 9, 15),
      user: 'Juan Pérez'
    },
    {
      id: '2',
      type: 'venta',
      amount: 23.00,
      description: 'Venta #002 - Bebidas',
      timestamp: new Date(2026, 1, 18, 9, 45),
      user: 'Juan Pérez'
    },
    {
      id: '3',
      type: 'entrada',
      amount: 100.00,
      description: 'Ingreso por cambio de billetes',
      timestamp: new Date(2026, 1, 18, 10, 30),
      user: 'Juan Pérez'
    },
    {
      id: '4',
      type: 'venta',
      amount: 67.80,
      description: 'Venta #003 - Comida completa',
      timestamp: new Date(2026, 1, 18, 11, 20),
      user: 'Juan Pérez'
    },
    {
      id: '5',
      type: 'salida',
      amount: 50.00,
      description: 'Retiro para compra de insumos',
      timestamp: new Date(2026, 1, 18, 12, 0),
      user: 'María González'
    },
    {
      id: '6',
      type: 'venta',
      amount: 34.25,
      description: 'Venta #004 - Snacks y bebidas',
      timestamp: new Date(2026, 1, 18, 13, 10),
      user: 'Juan Pérez'
    },
  ]);

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
  const alertaActiva = efectivoEsperado > LIMITE_ALERTA;

  const handleIngreso = () => {
    if (ingresoAmount && parseFloat(ingresoAmount) > 0) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'entrada',
        amount: parseFloat(ingresoAmount),
        description: ingresoDescription || 'Ingreso de efectivo',
        timestamp: new Date(),
        user: 'Usuario Actual'
      };
      setTransactions([newTransaction, ...transactions]);
      setIngresoAmount('');
      setIngresoDescription('');
      setShowIngresoModal(false);
    }
  };

  const handleRetiroEfectivo = (monto: number, responsable: string, concepto: string) => {
    // Generate folio
    const folio = `RT-${Date.now().toString().slice(-8)}`;
    const fecha = new Date();
    const efectivoRestante = efectivoEsperado - monto;

    // Create transaction with "RETIRO PARCIAL" label
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'salida',
      amount: monto,
      description: `RETIRO PARCIAL - ${concepto}`,
      timestamp: fecha,
      user: responsable
    };

    setTransactions([newTransaction, ...transactions]);

    // Save retiro info for voucher
    setLastRetiro({
      folio,
      monto,
      responsable,
      concepto,
      fecha,
      efectivoRestante
    });

    // Show success toast
    setToastMessage('Retiro registrado. Imprimiendo comprobante...');
    setToastType('success');
    setShowToast(true);

    // Close retiro modal and show voucher after a brief delay
    setShowRetiroModal(false);
    setTimeout(() => {
      setShowVoucher(true);
      setShowToast(false);
    }, 2000);
  };

  const handleCierreCaja = () => {
    alert(`Cierre de Caja realizado\nEfectivo esperado: $${efectivoEsperado.toFixed(2)}`);
    setShowCierreModal(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="h-full flex">
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
            <p className="text-3xl font-semibold text-purple-600 mb-2">${efectivoEsperado.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mb-3">
              +${entradas.toFixed(2)} / -${salidas.toFixed(2)}
            </p>
            
            {/* Retiro Parcial Button */}
            <button
              onClick={() => setShowRetiroModal(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 border-2 border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold rounded-lg transition-colors text-sm"
            >
              <ArrowDownLeft className="size-4" />
              Retiro Parcial de Efectivo
            </button>
            
            {alertaActiva && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-red-600 flex-shrink-0" />
                  <span className="text-xs text-red-600 font-medium">Efectivo excede el límite</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Historial de Movimientos</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
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
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Sidebar */}
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Acciones Rápidas</h3>

        {/* Security Alert - Cash Limit Exceeded */}
        {alertaActiva && (
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 text-white shadow-lg border-2 border-red-700 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="size-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm uppercase tracking-wide">¡Alerta de Seguridad!</p>
                <p className="text-xs text-orange-100">Efectivo excede límite</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2 mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-orange-100">Límite:</span>
                <span className="text-sm font-semibold">${LIMITE_ALERTA.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-orange-100">Actual:</span>
                <span className="text-lg font-bold">${efectivoEsperado.toFixed(2)}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-white/30">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-orange-100">Excedente:</span>
                  <span className="text-lg font-bold text-yellow-300">
                    +${(efectivoEsperado - LIMITE_ALERTA).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowRetiroModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 transition-all shadow-md"
            >
              <Banknote className="size-5" />
              Realizar Retiro de Seguridad
            </button>
          </div>
        )}

        {/* Ingreso de Efectivo */}
        <button
          onClick={() => setShowIngresoModal(true)}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          <Plus className="size-5" />
          Ingreso de Efectivo
        </button>

        {/* Retiro de Efectivo (Always available) */}
        {!alertaActiva && (
          <button
            onClick={() => setShowRetiroModal(true)}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Banknote className="size-5" />
            Retiro de Efectivo
          </button>
        )}

        {/* Info Box */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Hora de inicio:</span>
            <span className="font-medium">08:00 AM</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Usuario:</span>
            <span className="font-medium">Juan Pérez</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Movimientos:</span>
            <span className="font-medium">{transactions.length}</span>
          </div>
        </div>

        {/* Cierre de Caja Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowCierreModal(true)}
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
                onClick={handleCierreCaja}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
              >
                Confirmar Cierre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retiro de Efectivo Modal */}
      {showRetiroModal && (
        <RetiroEfectivoModal
          efectivoActual={efectivoEsperado}
          onConfirm={handleRetiroEfectivo}
          onClose={() => setShowRetiroModal(false)}
        />
      )}

      {/* Voucher de Retiro */}
      {showVoucher && lastRetiro && (
        <VoucherRetiro
          folio={lastRetiro.folio}
          monto={lastRetiro.monto}
          responsable={lastRetiro.responsable}
          concepto={lastRetiro.concepto}
          cajero="Juan Pérez"
          fecha={lastRetiro.fecha}
          efectivoRestante={lastRetiro.efectivoRestante}
          onClose={() => setShowVoucher(false)}
        />
      )}

      {/* Toast */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}