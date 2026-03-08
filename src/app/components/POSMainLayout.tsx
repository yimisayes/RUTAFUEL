import { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus,
  DollarSign,
  Package,
  BarChart3,
  Shield,
  Check,
  X,
  Coffee,
  Utensils,
  Cookie,
  Grid3x3,
  LogOut,
  User
} from 'lucide-react';
import { usePOS } from '../context/POSContext';

interface POSMainLayoutProps {
  onNavigateToInventory: () => void;
  onNavigateToReports: () => void;
  onLogout: () => void;
}

interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  stock: number;
}

export function POSMainLayout({ onNavigateToInventory, onNavigateToReports, onLogout }: POSMainLayoutProps) {
  const { products, currentUser, addTransaction, updateProductStock } = usePOS();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Categorías disponibles
  const categories = [
    { id: 'all', name: 'Todas', icon: Grid3x3 },
    { id: 'bebidas', name: 'Bebidas', icon: Coffee },
    { id: 'comida', name: 'Comida', icon: Utensils },
    { id: 'snacks', name: 'Snacks', icon: Cookie },
  ];

  // Filtrar productos por búsqueda y categoría
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Agregar producto al carrito
  const addToCart = (product: typeof products[0]) => {
    if (product.stock === 0) {
      alert(`El producto "${product.name}" está agotado`);
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert(`Stock insuficiente. Solo hay ${product.stock} unidades disponibles`);
        return;
      }
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock
      }]);
    }
  };

  // Incrementar cantidad
  const incrementQuantity = (productId: string) => {
    const item = cart.find(i => i.productId === productId);
    if (item && item.quantity < item.stock) {
      setCart(cart.map(i =>
        i.productId === productId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else if (item) {
      alert(`Stock insuficiente. Solo hay ${item.stock} unidades disponibles`);
    }
  };

  // Decrementar cantidad
  const decrementQuantity = (productId: string) => {
    const item = cart.find(i => i.productId === productId);
    if (item && item.quantity > 1) {
      setCart(cart.map(i =>
        i.productId === productId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      ));
    } else {
      removeFromCart(productId);
    }
  };

  // Remover del carrito
  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  // Limpiar carrito
  const clearCart = () => {
    if (cart.length > 0) {
      if (window.confirm('¿Deseas limpiar el carrito?')) {
        setCart([]);
      }
    }
  };

  // Calcular totales
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const iva = subtotal * 0.13; // IVA 13% El Salvador
  const total = subtotal + iva;

  // Procesar venta
  const processSale = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Actualizar stock
    cart.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        updateProductStock(item.productId, product.stock - item.quantity);
      }
    });

    // Registrar transacción
    addTransaction({
      type: 'venta',
      amount: total,
      description: `Venta - ${cart.length} productos`,
      user: currentUser?.name || 'Usuario',
      items: cart.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price
      }))
    });

    // Limpiar carrito
    setCart([]);

    // Mostrar mensaje de éxito
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Barra Superior */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-20">
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Izquierda - Logo y Usuario */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Sistema POS</h1>
                <p className="text-xs text-gray-500">Punto de Venta</p>
              </div>
            </div>
            
            <div className="h-8 w-px bg-gray-300"></div>
            
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 rounded-full p-1.5">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
              </div>
            </div>
          </div>

          {/* Centro - Título de Sección */}
          <div className="flex-1 text-center">
            <h2 className="text-base font-semibold text-gray-700">Módulo de Ventas</h2>
          </div>

          {/* Derecha - Indicador 2FA y Logout */}
          <div className="flex items-center gap-3">
            {/* Indicador de Sesión Segura */}
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <div className="relative">
                <Shield className="w-4 h-4 text-green-600" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-green-700 leading-none">Sesión Segura</p>
                <p className="text-xs text-green-600 leading-none">2FA Activo</p>
              </div>
              <Check className="w-4 h-4 text-green-600" />
            </div>

            {/* Botón Cerrar Sesión */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-semibold">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Layout Principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Barra Lateral Izquierda */}
        <aside className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-4">
          {/* Inventario */}
          <button
            onClick={onNavigateToInventory}
            className="group flex flex-col items-center gap-2 px-3 py-4 rounded-lg hover:bg-blue-50 transition-colors w-full"
            title="Inventario"
          >
            <div className="bg-blue-100 group-hover:bg-blue-200 rounded-lg p-2.5 transition-colors">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">
              Inventario
            </span>
          </button>

          {/* Reportes */}
          <button
            onClick={onNavigateToReports}
            className="group flex flex-col items-center gap-2 px-3 py-4 rounded-lg hover:bg-purple-50 transition-colors w-full"
            title="Reportes"
          >
            <div className="bg-purple-100 group-hover:bg-purple-200 rounded-lg p-2.5 transition-colors">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-600 group-hover:text-purple-600">
              Reportes
            </span>
          </button>
        </aside>

        {/* Área Central - Productos */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Barra de Búsqueda y Filtros */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4 mb-4">
              {/* Buscador */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos por nombre o SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Contador de resultados */}
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg">
                <p className="text-sm font-semibold text-gray-700">
                  {filteredProducts.length} productos
                </p>
              </div>
            </div>

            {/* Filtros de Categoría */}
            <div className="flex gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Search className="w-16 h-16 mb-3" />
                <p className="text-lg font-medium">No se encontraron productos</p>
                <p className="text-sm">Intenta con otro término de búsqueda</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`bg-white border-2 rounded-lg p-4 text-left transition-all ${
                      product.stock === 0
                        ? 'border-gray-200 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-400 hover:shadow-lg cursor-pointer'
                    }`}
                  >
                    {/* Imagen del producto */}
                    {product.image && (
                      <div className="w-full h-20 mb-3 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Nombre */}
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>

                    {/* SKU */}
                    {product.sku && (
                      <p className="text-xs text-gray-500 mb-2">{product.sku}</p>
                    )}

                    {/* Precio */}
                    <p className="text-lg font-bold text-blue-600 mb-2">
                      ${product.price.toFixed(2)}
                    </p>

                    {/* Stock */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${
                        product.stock === 0 ? 'text-red-600' :
                        product.stock < 10 ? 'text-orange-600' : 'text-gray-500'
                      }`}>
                        {product.stock === 0 ? 'Agotado' : `Stock: ${product.stock}`}
                      </span>
                      {product.stock > 0 && (
                        <Plus className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Panel Derecho - Carrito */}
        <aside className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-lg">
          {/* Header del Carrito */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 border-b border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Carrito de Compras</h2>
                  <p className="text-xs text-blue-100">
                    {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-lg transition-colors"
                  title="Limpiar carrito"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Items del Carrito */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingCart className="w-20 h-20 mb-3 opacity-50" />
                <p className="text-sm font-medium">Carrito vacío</p>
                <p className="text-xs text-center px-6">
                  Selecciona productos del catálogo para comenzar
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-gray-500">
                        ${item.price.toFixed(2)} c/u
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrementQuantity(item.productId)}
                        className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-700" />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQuantity(item.productId)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="font-bold text-blue-600 text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Resumen y Total */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            {/* Subtotales */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>IVA (13%):</span>
                <span className="font-semibold">${iva.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-300 mb-4">
              <span className="text-lg font-bold text-gray-900">TOTAL:</span>
              <span className="text-3xl font-bold text-blue-600">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Botón de Cobrar */}
            <button
              onClick={processSale}
              disabled={cart.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Procesar Venta
            </button>
          </div>
        </aside>
      </div>

      {/* Mensaje de Éxito */}
      {showSuccessMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg">¡Venta procesada exitosamente!</p>
              <p className="text-sm text-green-100">Total: ${total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
