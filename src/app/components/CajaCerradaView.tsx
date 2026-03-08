import { Lock, FileText, Clock } from 'lucide-react';

interface CajaCerradaViewProps {
  reportId: string;
  closedAt: Date;
  onReopenCaja: () => void;
}

export function CajaCerradaView({ reportId, closedAt, onReopenCaja }: CajaCerradaViewProps) {
  const formattedDate = closedAt.toLocaleDateString('es-MX', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric',
    weekday: 'long'
  });
  const formattedTime = closedAt.toLocaleTimeString('es-MX', { 
    hour: '2-digit', 
    minute: '2-digit'
  });

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-2xl w-full mx-4">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 text-center">
            <div className="inline-flex items-center justify-center size-20 bg-white/20 rounded-full mb-4">
              <Lock className="size-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Caja Cerrada</h1>
            <p className="text-red-100">El turno actual ha finalizado</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="size-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Reporte ID</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{reportId}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="size-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Fecha de Cierre</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{formattedTime}</p>
              </div>
            </div>

            {/* Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Estado del Sistema</h3>
              <p className="text-sm text-blue-800 mb-3">
                El cierre de caja se realizó exitosamente el {formattedDate} a las {formattedTime}.
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ Reporte de cierre generado</li>
                <li>✓ Historial de movimientos archivado</li>
                <li>✓ Sistema bloqueado para nuevas transacciones</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center mb-4">
                Para iniciar un nuevo turno, presiona el botón de abajo
              </p>
              <button
                onClick={onReopenCaja}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Abrir Nueva Caja
              </button>
              <p className="text-xs text-gray-500 text-center">
                Se creará un nuevo ciclo con fondo inicial de $500.00
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Usuario: Admin</span>
              <span>Sistema POS v2.1.5</span>
            </div>
          </div>
        </div>

        {/* Warning Note */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 text-center">
            <strong>Nota:</strong> El reporte de cierre está disponible en el historial de reportes
          </p>
        </div>
      </div>
    </div>
  );
}
