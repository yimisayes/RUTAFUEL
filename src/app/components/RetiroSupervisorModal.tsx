import { useState } from 'react';
import { X, Lock, DollarSign, CheckCircle, Printer, Receipt } from 'lucide-react';

interface RetiroSupervisorModalProps {
  cajero: string;
  onClose: () => void;
  onSuccess: (monto: number, supervisor: string) => void;
}

export function RetiroSupervisorModal({ cajero, onClose, onSuccess }: RetiroSupervisorModalProps) {
  const [monto, setMonto] = useState('');
  const [pin, setPin] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [retiroData, setRetiroData] = useState<{
    folio: string;
    monto: number;
    cajero: string;
    supervisor: string;
    fecha: Date;
  } | null>(null);

  const PIN_CORRECTO = '1982';

  const handleNumberClick = (num: string) => {
    if (monto.length < 10) {
      setMonto(monto + num);
      setError('');
    }
  };

  const handleBackspace = () => {
    setMonto(monto.slice(0, -1));
  };

  const handleClear = () => {
    setMonto('');
    setError('');
  };

  const handleValidar = () => {
    // Validar monto
    const montoNum = parseFloat(monto);
    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      setError('Por favor ingresa un monto válido');
      return;
    }

    // Validar supervisor
    if (!supervisor.trim()) {
      setError('Por favor ingresa el nombre del supervisor');
      return;
    }

    // Validar PIN
    if (pin !== PIN_CORRECTO) {
      setError('❌ PIN incorrecto. Acceso denegado.');
      setPin('');
      return;
    }

    // Todo correcto - generar retiro
    const folio = `RT-${Date.now().toString().slice(-8)}`;
    const fecha = new Date();

    setRetiroData({
      folio,
      monto: montoNum,
      cajero,
      supervisor,
      fecha
    });

    setShowSuccess(true);
  };

  const handleImprimir = () => {
    if (!retiroData) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Comprobante de Retiro - ${retiroData.folio}</title>
        <style>
          @page { margin: 0; }
          body { 
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 20px;
            width: 300px;
          }
          .ticket {
            border: 2px dashed #333;
            padding: 15px;
            background: white;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .subtitle {
            font-size: 12px;
            color: #666;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-size: 13px;
          }
          .label {
            font-weight: bold;
          }
          .monto {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 15px 0;
            padding: 10px;
            border: 2px solid #333;
          }
          .footer {
            text-align: center;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 2px solid #333;
            font-size: 11px;
          }
          .admin-copy {
            background: #000;
            color: #fff;
            padding: 5px;
            text-align: center;
            font-weight: bold;
            margin-top: 10px;
            font-size: 12px;
          }
          .signatures {
            margin-top: 20px;
          }
          .signature-line {
            border-top: 1px solid #333;
            margin-top: 30px;
            padding-top: 5px;
            text-align: center;
            font-size: 11px;
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <div class="title">COMPROBANTE DE RETIRO</div>
            <div class="subtitle">Sistema POS</div>
          </div>

          <div class="row">
            <span class="label">Folio:</span>
            <span>${retiroData.folio}</span>
          </div>
          <div class="row">
            <span class="label">Fecha:</span>
            <span>${retiroData.fecha.toLocaleDateString('es-MX')}</span>
          </div>
          <div class="row">
            <span class="label">Hora:</span>
            <span>${retiroData.fecha.toLocaleTimeString('es-MX')}</span>
          </div>

          <div class="monto">
            $${retiroData.monto.toFixed(2)}
          </div>

          <div class="row">
            <span class="label">Cajero:</span>
            <span>${retiroData.cajero}</span>
          </div>
          <div class="row">
            <span class="label">Autorizado por:</span>
            <span>${retiroData.supervisor}</span>
          </div>

          <div class="signatures">
            <div class="signature-line">
              Firma del Cajero
            </div>
            <div class="signature-line">
              Firma del Supervisor
            </div>
          </div>

          <div class="admin-copy">
            📋 COPIA PARA ADMINISTRACIÓN
          </div>

          <div class="footer">
            Sistema POS - Retiro de Efectivo<br>
            ${new Date().toLocaleString('es-MX')}
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleFinalizar = () => {
    if (retiroData) {
      onSuccess(retiroData.monto, retiroData.supervisor);
    }
    onClose();
  };

  if (showSuccess && retiroData) {
    // PANTALLA B - Éxito e Impresión
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" style={{ maxHeight: '500px' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="size-12 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="size-7 text-white" />
              </div>
              <div className="text-white">
                <h3 className="text-xl font-bold">¡Retiro Exitoso!</h3>
                <p className="text-sm text-green-100">Comprobante generado</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Ilustración de Ticket */}
            <div className="relative mb-4">
              <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg p-4 border-2 border-gray-300">
                <div className="flex items-center justify-center mb-3">
                  <Printer className="size-12 text-gray-600 animate-bounce" />
                </div>
                
                {/* Ticket saliendo */}
                <div className="bg-white border-2 border-dashed border-gray-400 rounded p-3 shadow-lg transform -translate-y-2">
                  <div className="text-center mb-2">
                    <Receipt className="size-6 mx-auto text-gray-700 mb-1" />
                    <p className="text-xs font-bold text-gray-800">COMPROBANTE DE RETIRO</p>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between border-b border-gray-200 pb-1">
                      <span className="text-gray-600">Folio:</span>
                      <span className="font-mono font-semibold">{retiroData.folio}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-1">
                      <span className="text-gray-600">Monto:</span>
                      <span className="font-bold text-green-600">${retiroData.monto.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-1">
                      <span className="text-gray-600">Cajero:</span>
                      <span className="font-medium">{retiroData.cajero}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-1">
                      <span className="text-gray-600">Autorizado:</span>
                      <span className="font-medium">{retiroData.supervisor}</span>
                    </div>
                    <div className="bg-gray-900 text-white text-center py-1 rounded mt-2">
                      <p className="text-xs font-bold">📋 COPIA ADMIN</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-green-700">Monto Retirado</p>
                  <p className="text-lg font-bold text-green-900">${retiroData.monto.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-700">Folio</p>
                  <p className="text-sm font-mono font-semibold text-green-900">{retiroData.folio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
            <button
              onClick={handleImprimir}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Printer className="size-5" />
              Imprimir Comprobante
            </button>
            <button
              onClick={handleFinalizar}
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA A - Modal de Retiro
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" style={{ maxHeight: '500px', overflow: 'auto' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-3 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="size-6 text-white" />
            </div>
            <div className="text-white">
              <h3 className="text-lg font-bold">Retiro de Efectivo</h3>
              <p className="text-xs text-orange-100">Validación de Supervisor</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Monto Display */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Monto a Retirar
            </label>
            <div className="bg-gray-900 text-green-400 rounded-lg px-4 py-3 text-right font-mono text-2xl font-bold border-2 border-gray-700">
              ${monto || '0.00'}
            </div>
          </div>

          {/* Teclado Numérico */}
          <div>
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold text-lg py-3 rounded-lg transition-colors"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="bg-red-100 hover:bg-red-200 text-red-700 font-bold text-sm py-3 rounded-lg transition-colors"
              >
                C
              </button>
              <button
                onClick={() => handleNumberClick('0')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold text-lg py-3 rounded-lg transition-colors"
              >
                0
              </button>
              <button
                onClick={() => handleNumberClick('.')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold text-lg py-3 rounded-lg transition-colors"
              >
                .
              </button>
            </div>
            <button
              onClick={handleBackspace}
              className="w-full mt-2 bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-2 rounded-lg transition-colors"
            >
              ← Borrar
            </button>
          </div>

          {/* Supervisor */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Nombre del Supervisor
            </label>
            <input
              type="text"
              value={supervisor}
              onChange={(e) => {
                setSupervisor(e.target.value);
                setError('');
              }}
              placeholder="Ej: María González"
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* PIN de Seguridad */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Lock className="size-4 text-red-600" />
              PIN de Supervisor (Seguridad)
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              placeholder="****"
              maxLength={4}
              className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-lg text-center tracking-widest"
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              PIN requerido: 1982
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-400 rounded-lg p-3">
              <p className="text-sm font-semibold text-red-700 text-center">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleValidar}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg transition-all"
          >
            Validar y Retirar
          </button>
        </div>
      </div>
    </div>
  );
}
