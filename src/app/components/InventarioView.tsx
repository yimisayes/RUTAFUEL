import { useState } from 'react';
import { Search, Filter, Plus, AlertTriangle } from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

export function InventarioView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products: Product[] = [
    { id: '1', sku: 'BEB-001', name: 'Café Americano', category: 'Bebidas', price: 3.50, stock: 45, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop' },
    { id: '2', sku: 'BEB-002', name: 'Cappuccino', category: 'Bebidas', price: 4.50, stock: 38, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&h=100&fit=crop' },
    { id: '3', sku: 'BEB-003', name: 'Té Verde', category: 'Bebidas', price: 3.00, stock: 52, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=100&h=100&fit=crop' },
    { id: '4', sku: 'BEB-004', name: 'Jugo Natural', category: 'Bebidas', price: 5.00, stock: 3, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=100&h=100&fit=crop' },
    { id: '5', sku: 'COM-001', name: 'Sandwich Club', category: 'Comida', price: 8.50, stock: 15, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=100&h=100&fit=crop' },
    { id: '6', sku: 'COM-002', name: 'Ensalada César', category: 'Comida', price: 9.00, stock: 2, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=100&h=100&fit=crop' },
    { id: '7', sku: 'COM-003', name: 'Pasta Alfredo', category: 'Comida', price: 12.00, stock: 8, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=100&h=100&fit=crop' },
    { id: '8', sku: 'SNK-001', name: 'Croissant', category: 'Snacks', price: 3.50, stock: 24, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&h=100&fit=crop' },
    { id: '9', sku: 'SNK-002', name: 'Galletas', category: 'Snacks', price: 2.50, stock: 4, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100&h=100&fit=crop' },
    { id: '10', sku: 'SNK-003', name: 'Muffin', category: 'Snacks', price: 3.00, stock: 30, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=100&h=100&fit=crop' },
    { id: '11', sku: 'BEB-005', name: 'Smoothie de Frutas', category: 'Bebidas', price: 6.00, stock: 1, image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=100&h=100&fit=crop' },
    { id: '12', sku: 'COM-004', name: 'Pizza Personal', category: 'Comida', price: 10.50, stock: 18, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop' },
  ];

  const categories = ['all', 'Bebidas', 'Comida', 'Snacks'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    alert('Abrir formulario para añadir nuevo producto');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Inventario</h1>
          
          <div className="flex items-center gap-3 flex-1 max-w-3xl">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="all">Todas las categorías</option>
                {categories.filter(cat => cat !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Add Product Button */}
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="size-5" />
              Añadir Producto
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Miniatura
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Precio de Venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-gray-700">{product.sku}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{product.stock} unidades</span>
                      {product.stock < 5 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                          <AlertTriangle className="size-3" />
                          Stock Bajo
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No se encontraron productos
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Mostrando {filteredProducts.length} de {products.length} productos</span>
          <span>{filteredProducts.filter(p => p.stock < 5).length} productos con stock bajo</span>
        </div>
      </div>
    </div>
  );
}
