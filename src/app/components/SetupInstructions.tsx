import { AlertCircle, Database, FileText, CheckCircle2, ExternalLink } from 'lucide-react';

export function SetupInstructions() {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div className="size-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Database className="size-8 text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">Configuración de Supabase</h2>
              <p className="text-blue-100 text-sm">Backend en la nube para tu Sistema POS</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Alert */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  Configuración Requerida
                </p>
                <p className="text-sm text-amber-800">
                  Para usar el backend en la nube, necesitas completar la configuración de Supabase siguiendo estos pasos.
                </p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="size-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-bold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Crea un proyecto en Supabase</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Ve a <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a> y crea una cuenta gratuita. Luego crea un nuevo proyecto.
                  </p>
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Ir a Supabase
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="size-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-bold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Ejecuta el script SQL</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Abre el archivo <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">SUPABASE_SETUP.md</code> y sigue las instrucciones para crear las tablas necesarias.
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded p-3">
                    <p className="text-xs font-mono text-gray-700">
                      En Supabase: SQL Editor → New Query → Pega el script → Run
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="size-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-bold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Habilita Realtime</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Ve a Database → Replication y habilita Realtime para estas tablas:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {['products', 'transactions', 'caja_status', 'config'].map((table) => (
                      <div key={table} className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded">
                        <CheckCircle2 className="size-4 text-green-600" />
                        <span className="text-sm font-mono text-green-800">{table}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="border-2 border-green-200 bg-green-50 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="size-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="size-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-2">✓ Credenciales Configuradas</h3>
                  <p className="text-sm text-green-800 mb-3">
                    ¡Excelente! Figma Make ya configuró automáticamente tus credenciales de Supabase.
                  </p>
                  <div className="bg-white border-2 border-green-300 rounded p-3">
                    <p className="text-xs text-green-900 font-semibold mb-1">Credenciales activas:</p>
                    <p className="text-xs font-mono text-green-800">
                      ✓ projectId (configurado)<br />
                      ✓ publicAnonKey (configurado)
                    </p>
                  </div>
                  <p className="text-xs text-green-700 mt-2">
                    No necesitas configurar variables de entorno manualmente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-5">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="size-5" />
              Beneficios del Backend en la Nube
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Sincronización en tiempo real entre múltiples terminales</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Estado de caja compartido (IVA 13%, fondo inicial, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Inventario sincronizado automáticamente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Acceso remoto desde cualquier ubicación</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Backup automático de todas las transacciones</span>
              </li>
            </ul>
          </div>

          {/* Documentation Link */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-start gap-3">
              <FileText className="size-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Documentación Completa
                </p>
                <p className="text-sm text-gray-600">
                  Consulta los archivos <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">README.md</code> y{' '}
                  <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">SUPABASE_SETUP.md</code> para instrucciones detalladas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <p className="text-xs text-gray-500 text-center">
            Una vez completada la configuración, el indicador "Nube: Conectado" aparecerá en la barra lateral
          </p>
        </div>
      </div>
    </div>
  );
}