import { useState } from 'react';
import { Calendar, TrendingUp, Package, DollarSign, ShoppingCart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function ReportesView() {
  const [dateRange, setDateRange] = useState('7days');

  // Datos para gráfico de tendencia de ventas semanal
  const salesTrendData = [
    { day: 'Lun', ventas: 2400, tickets: 45 },
    { day: 'Mar', ventas: 1800, tickets: 38 },
    { day: 'Mié', ventas: 3200, tickets: 62 },
    { day: 'Jue', ventas: 2800, tickets: 54 },
    { day: 'Vie', ventas: 4100, tickets: 78 },
    { day: 'Sáb', ventas: 5200, tickets: 95 },
    { day: 'Dom', ventas: 4800, tickets: 88 },
  ];

  // Datos para gráfico de productos más vendidos
  const topProductsData = [
    { producto: 'Café Americano', cantidad: 245, ingresos: 857.50 },
    { producto: 'Cappuccino', cantidad: 198, ingresos: 891.00 },
    { producto: 'Sandwich Club', cantidad: 156, ingresos: 1326.00 },
    { producto: 'Ensalada César', cantidad: 134, ingresos: 1206.00 },
    { producto: 'Croissant', cantidad: 187, ingresos: 654.50 },
  ];

  // KPIs calculados
  const totalVentas = salesTrendData.reduce((sum, day) => sum + day.ventas, 0);
  const promedioVentas = totalVentas / salesTrendData.length;
  const totalTickets = salesTrendData.reduce((sum, day) => sum + day.tickets, 0);
  const ticketPromedio = totalVentas / totalTickets;

  const kpiCards = [
    {
      title: 'Ventas Totales',
      value: `$${totalVentas.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
      icon: <DollarSign className="size-6" />,
      color: 'bg-blue-100 text-blue-600',
      change: '+12.5%',
      changePositive: true
    },
    {
      title: 'Tickets Vendidos',
      value: totalTickets.toString(),
      icon: <ShoppingCart className="size-6" />,
      color: 'bg-slate-100 text-slate-600',
      change: '+8.3%',
      changePositive: true
    },
    {
      title: 'Ticket Promedio',
      value: `$${ticketPromedio.toFixed(2)}`,
      icon: <TrendingUp className="size-6" />,
      color: 'bg-blue-100 text-blue-600',
      change: '+5.2%',
      changePositive: true
    },
    {
      title: 'Productos Vendidos',
      value: '920',
      icon: <Package className="size-6" />,
      color: 'bg-slate-100 text-slate-600',
      change: '+15.7%',
      changePositive: true
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Panel de Reportes</h1>
            <p className="text-gray-600">Análisis de ventas y rendimiento del negocio</p>
          </div>
          
          {/* Date Range Selector */}
          <div className="flex items-center gap-3">
            <Calendar className="size-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="today">Hoy</option>
              <option value="7days">Últimos 7 días</option>
              <option value="30days">Últimos 30 días</option>
              <option value="thisMonth">Este mes</option>
              <option value="lastMonth">Mes anterior</option>
              <option value="custom">Rango personalizado</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpiCards.map((kpi, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`size-12 ${kpi.color} rounded-lg flex items-center justify-center`}>
                  {kpi.icon}
                </div>
                <span className={`text-sm font-semibold ${kpi.changePositive ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change}
                </span>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">{kpi.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6">
          {/* Sales Trend Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Tendencia de Ventas Semanal
              </h2>
              <p className="text-sm text-gray-600">
                Evolución de ventas y tickets durante la última semana
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Ventas ($)"
                />
                <Line 
                  type="monotone" 
                  dataKey="tickets" 
                  stroke="#64748b" 
                  strokeWidth={2}
                  dot={{ fill: '#64748b', r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Tickets"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                5 Productos más Vendidos
              </h2>
              <p className="text-sm text-gray-600">
                Ranking de productos por cantidad vendida
              </p>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topProductsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                />
                <YAxis 
                  type="category" 
                  dataKey="producto" 
                  stroke="#6b7280"
                  width={120}
                  style={{ fontSize: '12px', fontWeight: 500 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'Ingresos ($)') return `$${value.toFixed(2)}`;
                    return value;
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Bar 
                  dataKey="cantidad" 
                  fill="#2563eb" 
                  radius={[0, 8, 8, 0]}
                  name="Cantidad"
                />
                <Bar 
                  dataKey="ingresos" 
                  fill="#64748b" 
                  radius={[0, 8, 8, 0]}
                  name="Ingresos ($)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Promedio Diario</h3>
            <p className="text-2xl font-bold text-blue-600">
              ${promedioVentas.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Basado en 7 días</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Mejor Día</h3>
            <p className="text-2xl font-bold text-blue-600">Sábado</p>
            <p className="text-xs text-gray-500 mt-1">$5,200.00 en ventas</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Producto Estrella</h3>
            <p className="text-2xl font-bold text-blue-600">Café Americano</p>
            <p className="text-xs text-gray-500 mt-1">245 unidades vendidas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
