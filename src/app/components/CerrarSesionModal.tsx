import { LogOut, Lock, DollarSign, AlertCircle } from 'lucide-react';

interface CerrarSesionModalProps {
  userName: string;
  efectivoActual: number;
  onSoloCerrarSesion: () => void;
  onCerrarCajaYSesion: () => void;
  onCancel: () => void;
}

export function CerrarSesionModal({ 
  userName, 
  efectivoActual,
  onSoloCerrarSesion, 
  onCerrarCajaYSesion,
  onCancel
}: CerrarSesionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-6 rounded-t-2xl text-center">
          <div className="inline-flex items-center justify-center size-16 bg-white/20 rounded-full mb-3">
            <LogOut className="size-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">Cerrar Sesión</h3>
          <p className="text-orange-100 text-sm">{userName}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                ¿Deseas cerrar también la caja antes de salir?
              </p>
              <p className="text-xs text-blue-700">
                Esta decisión afectará lo que suceda cuando vuelvas a iniciar sesión
              </p>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Estado Actual de Caja:</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                ABIERTA
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Efectivo Actual:</span>
              <span className="text-xl font-bold text-green-600">
                ${efectivoActual.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {/* Opción A: Solo Cerrar Sesión */}
            <button
              onClick={onSoloCerrarSesion}
              className="w-full p-5 border-2 border-blue-300 rounded-xl hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="size-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                  <LogOut className="size-6 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-gray-900 mb-1 text-lg">Solo Cerrar Sesión</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    La caja permanece <strong>ABIERTA</strong> con el efectivo actual guardado
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-2 text-xs text-blue-800">
                    ✓ Al volver a entrar: Acceso directo sin pedir monto inicial<br />
                    ✓ Continúa con: ${efectivoActual.toFixed(2)} en caja
                  </div>
                </div>
              </div>
            </button>

            {/* Opción B: Cerrar Caja y Sesión */}
            <button
              onClick={onCerrarCajaYSesion}
              className="w-full p-5 border-2 border-red-300 rounded-xl hover:bg-red-50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="size-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors">
                  <Lock className="size-6 text-red-600" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-gray-900 mb-1 text-lg">Cerrar Caja y Sesión</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Ejecuta el cierre completo (Reporte Z + Limpieza)
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-md p-2 text-xs text-red-800">
                    ✓ Genera reporte de cierre no modificable<br />
                    ✓ Limpia historial de movimientos<br />
                    ✓ Efectivo actual → $0.00<br />
                    ⚠ Al volver a entrar: Debe ingresar nuevo monto inicial
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <button
            onClick={onCancel}
            className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
