import { useState } from 'react';
import { Search, Filter, Plus, AlertTriangle, X, PackagePlus, Camera, Upload, FileSpreadsheet, Printer, Cloud, RefreshCw } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { useProductsSync } from '../../hooks/useSupabaseSync';

export function InventarioViewWithContext() {
  const { products, addProduct } = usePOS();
  
  // Hook de sincronización con Supabase
  const { products: supabaseProducts, loading: supabaseLoading, error: supabaseError, refresh } = useProductsSync();
  
  // Usar productos de Supabase si están disponibles, si no usar los del contexto
  const displayProducts = supabaseProducts.length > 0 ? supabaseProducts : products;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form state
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('bebidas');
  const [newProductImage, setNewProductImage] = useState<string | null>(null);

  const categories = ['all', 'bebidas', 'comida', 'snacks'];

  const filteredProducts = displayProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.sku?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Crear URL temporal para preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setNewProductImage(null);
  };

  const handleAddProduct = () => {
    // Validations
    if (!newProductName.trim()) {
      alert('Por favor ingresa el nombre del producto');
      return;
    }
    
    const price = parseFloat(newProductPrice);
    if (isNaN(price) || price <= 0) {
      alert('Por favor ingresa un precio válido');
      return;
    }
    
    const stock = parseInt(newProductStock);
    if (isNaN(stock) || stock < 0) {
      alert('Por favor ingresa un stock válido');
      return;
    }

    // Generate SKU
    const categoryPrefix = newProductCategory.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const sku = `${categoryPrefix}-${randomNum}`;

    // Add product
    addProduct({
      name: newProductName,
      price: price,
      stock: stock,
      category: newProductCategory,
      sku: sku,
      image: newProductImage || undefined,
    });

    // Reset form
    setNewProductName('');
    setNewProductPrice('');
    setNewProductStock('');
    setNewProductCategory('bebidas');
    setNewProductImage(null);
    setShowAddModal(false);
  };

  const handleGuardarExcel = () => {
    // Crear CSV manualmente
    let csvContent = "SKU,Nombre,Categoría,Precio,Stock,Estado\n";
    
    filteredProducts.forEach(product => {
      const estado = product.stock < 5 ? 'Stock Bajo' : 'Normal';
      csvContent += `"${product.sku || '-'}","${product.name}","${product.category}","$${product.price.toFixed(2)}","${product.stock}","${estado}"\n`;
    });

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `inventario_${new Date().toLocaleDateString('es-MX').replace(/\//g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImprimir = () => {
    // Crear contenido HTML para imprimir
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Inventario - ${new Date().toLocaleDateString('es-MX')}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px;
            color: #333;
          }
          h1 { 
            color: #1f2937;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 10px;
          }
          .header-info {
            margin: 20px 0;
            color: #6b7280;
            font-size: 14px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
          }
          th { 
            background: #f3f4f6; 
            padding: 12px; 
            text-align: left; 
            border: 1px solid #d1d5db;
            font-weight: 600;
            color: #374151;
            font-size: 12px;
            text-transform: uppercase;
          }
          td { 
            padding: 10px; 
            border: 1px solid #e5e7eb;
            font-size: 13px;
          }
          tr:nth-child(even) { 
            background: #f9fafb; 
          }
          .stock-bajo {
            color: #dc2626;
            font-weight: 600;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #d1d5db;
            font-size: 12px;
            color: #6b7280;
          }
          @media print {
            body { padding: 10px; }
          }
        </style>
      </head>
      <body>
        <h1>📦 Inventario de Productos</h1>
        <div class="header-info">
          <strong>Fecha:</strong> ${new Date().toLocaleDateString('es-MX', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}<br>
          <strong>Hora:</strong> ${new Date().toLocaleTimeString('es-MX')}<br>
          <strong>Total de productos:</strong> ${filteredProducts.length}<br>
          <strong>Productos con stock bajo:</strong> ${filteredProducts.filter(p => p.stock < 5).length}
        </div>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${filteredProducts.map(product => `
              <tr>
                <td>${product.sku || '-'}</td>
                <td>${product.name}</td>
                <td style="text-transform: capitalize;">${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock} unidades</td>
                <td class="${product.stock < 5 ? 'stock-bajo' : ''}">
                  ${product.stock < 5 ? '⚠️ Stock Bajo' : '✓ Normal'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Sistema POS - Reporte de Inventario</p>
          <p>Este documento fue generado automáticamente el ${new Date().toLocaleString('es-MX')}</p>
        </div>
      </body>
      </html>
    `;

    // Abrir ventana de impresión
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
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer capitalize"
              >
                <option value="all">Todas las categorías</option>
                {categories.filter(cat => cat !== 'all').map(cat => (
                  <option key={cat} value={cat} className="capitalize">{cat}</option>
                ))}
              </select>
            </div>

            {/* Add Product Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="size-5" />
              Añadir Producto
            </button>

            {/* Export Buttons */}
            <button
              onClick={handleGuardarExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              <FileSpreadsheet className="size-5" />
              Guardar Inventario
            </button>
            <button
              onClick={handleImprimir}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              <Printer className="size-5" />
              Imprimir
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
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="size-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="size-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                        Sin img
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-gray-700">{product.sku || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 capitalize">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${product.stock < 5 ? 'text-red-700' : 'text-gray-900'}`}>
                        {product.stock} unidades
                      </span>
                      {product.stock < 5 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 border border-red-300 text-red-700 text-xs font-semibold rounded-full animate-pulse">
                          <AlertTriangle className="size-3" />
                          ¡Stock Bajo!
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

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <PackagePlus className="size-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Añadir Producto</h2>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewProductImage(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form - 2 Column Layout */}
            <div className="p-6">
              <div className="grid grid-cols-[180px,1fr] gap-6">
                {/* LEFT COLUMN - Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Foto
                  </label>
                  
                  {!newProductImage ? (
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="w-full h-[120px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-400 transition-all flex flex-col items-center justify-center gap-2 p-3">
                        <div className="size-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <Camera className="size-5 text-gray-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-700">
                            Subir foto
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full">
                          <Upload className="size-3 text-blue-600" />
                          <span className="text-xs font-medium text-blue-700">Explorar</span>
                        </div>
                      </div>
                    </label>
                  ) : (
                    <div className="relative w-full h-[120px]">
                      <img
                        src={newProductImage}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 size-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                      >
                        <X className="size-3.5" />
                      </button>
                      <div className="absolute bottom-1 left-1 right-1 bg-black/70 backdrop-blur-sm rounded px-2 py-0.5">
                        <p className="text-xs text-white text-center font-medium">
                          ✓ Cargada
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN - Product Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      placeholder="Ej: Café Latte"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio de Venta *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={newProductPrice}
                          onChange={(e) => setNewProductPrice(e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Inicial *
                      </label>
                      <input
                        type="number"
                        value={newProductStock}
                        onChange={(e) => setNewProductStock(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer capitalize"
                    >
                      {categories.filter(cat => cat !== 'all').map(cat => (
                        <option key={cat} value={cat} className="capitalize">{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Preview */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <p className="text-xs font-medium text-blue-900 mb-2">Vista Previa:</p>
                    <div className="flex items-center gap-3">
                      {newProductImage && (
                        <img 
                          src={newProductImage} 
                          alt="Preview" 
                          className="size-10 rounded-lg object-cover border border-blue-200"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-blue-800 font-medium">{newProductName || 'Nombre del producto'}</span>
                          <span className="text-blue-900 font-semibold">
                            ${newProductPrice || '0.00'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-blue-700">
                            Stock: {newProductStock || '0'}
                          </span>
                          <span className="text-blue-600 capitalize">
                            • {newProductCategory}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewProductImage(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                Guardar Producto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}