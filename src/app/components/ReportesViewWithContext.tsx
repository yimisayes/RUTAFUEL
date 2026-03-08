import { useState, useMemo } from 'react';
import { Calendar, TrendingUp, Package, DollarSign, ShoppingCart, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { usePOS } from '../context/POSContext';

export function ReportesViewWithContext() {
  const { transactions, fondoInicial, efectivoActual } = usePOS();
  const [dateRange, setDateRange] = useState('7days');

  // Calcular total en caja (fondo inicial + ventas - retiros)
  const ventasHoy = transactions
    .filter(t => t.type === 'venta')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const retirosHoy = transactions
    .filter(t => t.type === 'salida')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalEnCaja = fondoInicial + ventasHoy - retirosHoy;

  // Datos para gráfico de ventas por día (últimos 7 días) - Memoizados para evitar regeneración
  const salesByDay = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        day: date.toLocaleDateString('es-MX', { weekday: 'short' }),
        fullDate: date.toISOString()
      };
    });

    return last7Days.map((dayData, index) => {
      const randomSales = 1800 + Math.random() * 2400; // Simulado
      return {
        day: dayData.day,
        ventas: parseFloat(randomSales.toFixed(2)),
        tickets: Math.floor(35 + Math.random() * 50)
      };
    });
  }, [dateRange]); // Solo regenerar cuando cambia el rango de fechas

  // Productos más vendidos (simulado basado en transacciones) - Memoizados
  const topProducts = useMemo(() => [
    { producto: 'Café Americano', cantidad: 245, ingresos: 857.50 },
    { producto: 'Cappuccino', cantidad: 198, ingresos: 891.00 },
    { producto: 'Sandwich Club', cantidad: 156, ingresos: 1326.00 },
    { producto: 'Ensalada César', cantidad: 134, ingresos: 1206.00 },
    { producto: 'Croissant', cantidad: 187, ingresos: 654.50 },
  ], []);

  // KPIs calculados
  const totalVentas = salesByDay.reduce((sum, day) => sum + day.ventas, 0);
  const totalTickets = salesByDay.reduce((sum, day) => sum + day.tickets, 0);
  const ticketPromedio = totalVentas / totalTickets;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Panel de Reportes</h1>
            <p className="text-sm text-gray-600 mt-1">Análisis de ventas y rendimiento del negocio</p>
          </div>
          
          {/* Date Range Selector */}
          <div className="flex items-center gap-3">
            <Calendar className="size-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Hoy</option>
              <option value="7days">Últimos 7 días</option>
              <option value="30days">Últimos 30 días</option>
              <option value="month">Este mes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* TOTAL EN CAJA - Destacado */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-8 border-4 border-emerald-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="size-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Wallet className="size-7 text-white" />
                </div>
                <div>
                  <p className="text-emerald-100 text-sm font-medium uppercase tracking-wide">
                    Total en Caja
                  </p>
                  <p className="text-xs text-emerald-200">
                    Fondo Inicial + Ventas - Retiros
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-6xl font-bold text-white tracking-tight">
                  ${totalEnCaja.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-xs text-emerald-100">Fondo Inicial</p>
                <p className="text-lg font-bold text-white">${fondoInicial.toFixed(2)}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-xs text-emerald-100">Ventas</p>
                <p className="text-lg font-bold text-white">+${ventasHoy.toFixed(2)}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-xs text-emerald-100">Retiros</p>
                <p className="text-lg font-bold text-white">-${retirosHoy.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="size-11 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="size-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +12.5%
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Ventas Totales</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ${totalVentas.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="size-11 bg-indigo-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="size-6 text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +8.3%
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Tickets Vendidos</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalTickets}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="size-11 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="size-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +5.2%
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Ticket Promedio</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">${ticketPromedio.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="size-11 bg-amber-100 rounded-lg flex items-center justify-center">
                <Package className="size-6 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +15.7%
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Productos Vendidos</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">920</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Ventas Diarias */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ventas Diarias (Últimos 7 días)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByDay} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Ventas']}
                />
                <Legend />
                <Bar 
                  dataKey="ventas" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]} 
                  name="Ventas ($)"
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Productos Más Vendidos */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top 5 Productos Más Vendidos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis 
                  type="category" 
                  dataKey="producto" 
                  tick={{ fontSize: 11 }}
                  width={120}
                  stroke="#6b7280"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number) => [`${value} unidades`, 'Cantidad']}
                />
                <Legend />
                <Bar 
                  dataKey="cantidad" 
                  fill="#8b5cf6" 
                  radius={[0, 8, 8, 0]} 
                  name="Cantidad vendida"
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabla de Productos Más Vendidos */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Detalle de Productos Más Vendidos</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cantidad Vendida
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ingresos Generados
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  % del Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((product, index) => {
                const totalIngresos = topProducts.reduce((sum, p) => sum + p.ingresos, 0);
                const percentage = (product.ingresos / totalIngresos) * 100;
                
                return (
                  <tr key={`product-${index}-${product.producto}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="flex items-center justify-center size-8 bg-blue-100 text-blue-700 font-bold text-sm rounded-full">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{product.producto}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{product.cantidad} unidades</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-green-600">
                        ${product.ingresos.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-12 text-right">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
