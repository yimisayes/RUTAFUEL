import { 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  ShoppingCart, 
  Users, 
  LogOut,
  Clock,
  ArrowRight,
  Package
} from 'lucide-react';
import { usePOS } from '../context/POSContext';

interface DashboardViewProps {
  onNavigate: (section: string) => void;
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  const { transactions, products, efectivoActual, currentUser } = usePOS();

  // Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter transactions from today
  const transactionsToday = transactions.filter(t => {
    const transDate = new Date(t.timestamp);
    transDate.setHours(0, 0, 0, 0);
    return transDate.getTime() === today.getTime();
  });

  // Calculate sales of the day
  const ventasDelDia = transactionsToday
    .filter(t => t.type === 'venta')
    .reduce((sum, t) => sum + t.amount, 0);

  // Count products with low stock (< 5)
  const productosStockBajo = products.filter(p => p.stock < 5).length;

  // Get last 5 transactions
  const ultimasTransacciones = transactions.slice(0, 5);

  // Sales by hour (last 6 hours)
  const currentHour = new Date().getHours();
  const ventasPorHora = Array(6).fill(0).map((_, index) => {
    const hora = currentHour - (5 - index);
    const horaDisplay = hora < 0 ? 24 + hora : hora;
    
    const ventasHora = transactionsToday
      .filter(t => {
        if (t.type !== 'venta') return false;
        const transHour = new Date(t.timestamp).getHours();
        return transHour === horaDisplay;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      hora: `${horaDisplay.toString().padStart(2, '0')}:00`,
      ventas: ventasHora
    };
  });

  const maxVenta = Math.max(...ventasPorHora.map(v => v.ventas), 100);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header - Más compacto */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {currentUser?.name}
            </h1>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('es-MX', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long'
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-gray-400" />
            <span className="text-xl font-bold text-gray-900">
              {new Date().toLocaleTimeString('es-MX', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-4">
          {/* Ventas del Día */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="size-5 text-green-600" />
              </div>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                HOY
              </span>
            </div>
            <h3 className="text-xs font-medium text-gray-600 mb-1">Ventas del Día</h3>
            <p className="text-3xl font-bold text-green-600 mb-1">
              ${ventasDelDia.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              {transactionsToday.filter(t => t.type === 'venta').length} transacciones
            </p>
          </div>

          {/* Efectivo en Caja */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="size-5 text-purple-600" />
              </div>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                ACTUAL
              </span>
            </div>
            <h3 className="text-xs font-medium text-gray-600 mb-1">Efectivo en Caja</h3>
            <p className="text-3xl font-bold text-purple-600 mb-1">
              ${efectivoActual.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              Disponible ahora
            </p>
          </div>

          {/* Productos Bajo Stock */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`size-10 rounded-lg flex items-center justify-center ${
                productosStockBajo > 0 ? 'bg-orange-100' : 'bg-blue-100'
              }`}>
                <AlertTriangle className={`size-5 ${
                  productosStockBajo > 0 ? 'text-orange-600' : 'text-blue-600'
                }`} />
              </div>
              {productosStockBajo > 0 && (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full animate-pulse">
                  ALERTA
                </span>
              )}
            </div>
            <h3 className="text-xs font-medium text-gray-600 mb-1">Stock Bajo</h3>
            <p className={`text-3xl font-bold mb-1 ${
              productosStockBajo > 0 ? 'text-orange-600' : 'text-blue-600'
            }`}>
              {productosStockBajo}
            </p>
            <p className="text-xs text-gray-500">
              {productosStockBajo > 0 ? 'Productos < 5 unidades' : 'Todo en orden'}
            </p>
          </div>
        </div>

        {/* Quick Actions - PRIMERO para que sean visibles sin scroll */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="size-2 bg-indigo-600 rounded-full"></span>
            Accesos Rápidos
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Nueva Venta */}
            <button
              onClick={() => onNavigate('ventas')}
              className="group bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg p-6 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingCart className="size-6" />
                </div>
                <div className="text-center">
                  <h4 className="text-base font-bold mb-0.5">Nueva Venta</h4>
                  <p className="text-xs text-blue-100">Ir al módulo de ventas</p>
                </div>
                <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>

            {/* Cierre de Caja */}
            <button
              onClick={() => onNavigate('caja')}
              className="group bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg p-6 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LogOut className="size-6" />
                </div>
                <div className="text-center">
                  <h4 className="text-base font-bold mb-0.5">Cierre de Caja</h4>
                  <p className="text-xs text-red-100">Gestión de caja</p>
                </div>
                <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>

            {/* Gestionar Usuarios */}
            <button
              onClick={() => onNavigate('usuarios')}
              className="group bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg p-6 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="size-6" />
                </div>
                <div className="text-center">
                  <h4 className="text-base font-bold mb-0.5">Gestionar Usuarios</h4>
                  <p className="text-xs text-indigo-100">Administración</p>
                </div>
                <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          </div>
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-2 gap-4">
          {/* Sales Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="size-2 bg-blue-600 rounded-full"></span>
              Ventas por Hora
            </h3>
            <div className="space-y-3">
              {ventasPorHora.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 w-10">
                    {item.hora}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${(item.ventas / maxVenta) * 100}%` }}
                    >
                      {item.ventas > 0 && (
                        <span className="text-xs font-bold text-white">
                          ${item.ventas.toFixed(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-900 w-14 text-right">
                    ${item.ventas.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="size-2 bg-green-600 rounded-full"></span>
              Últimas 5 Transacciones
            </h3>
            <div className="space-y-2">
              {ultimasTransacciones.length > 0 ? (
                ultimasTransacciones.map((trans) => (
                  <div 
                    key={trans.id} 
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={`size-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        trans.type === 'venta' ? 'bg-green-100' :
                        trans.type === 'entrada' ? 'bg-blue-100' : 'bg-red-100'
                      }`}>
                        <ShoppingCart className={`size-4 ${
                          trans.type === 'venta' ? 'text-green-600' :
                          trans.type === 'entrada' ? 'text-blue-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {trans.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(trans.timestamp)}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ml-2 ${
                      trans.type === 'salida' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {trans.type === 'salida' ? '-' : '+'}${trans.amount.toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p className="text-xs">No hay transacciones</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('inventario')}
            className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-lg p-4 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="size-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 text-sm">Inventario</h4>
                  <p className="text-xs text-gray-600">{products.length} productos</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('reportes')}
            className="bg-white border-2 border-gray-200 hover:border-green-400 rounded-lg p-4 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="size-5 text-green-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 text-sm">Reportes</h4>
                  <p className="text-xs text-gray-600">Ver estadísticas</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}