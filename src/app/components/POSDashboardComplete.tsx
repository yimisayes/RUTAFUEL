import { useState, useEffect } from 'react';
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
  X,
  Coffee,
  Utensils,
  Cookie,
  Grid3x3,
  LogOut,
  User,
  Users,
  Settings,
  Wallet,
  Printer,
  CheckCircle2,
  Globe,
  Network,
  Cpu,
  AlertCircle,
  Check,
  WifiOff,
  CloudOff,
  Save,
  RefreshCw
} from 'lucide-react';
import { usePOS } from '../context/POSContext';

interface POSDashboardCompleteProps {
  onNavigate: (section: string) => void;
  onLogout: () => void;
}

interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  stock: number;
}

export function POSDashboardComplete({ onNavigate, onLogout }: POSDashboardCompleteProps) {
  const { products, currentUser, addTransaction, updateProductStock } = usePOS();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPrinterModal, setShowPrinterModal] = useState(false);
  const [selectedPrinterOption, setSelectedPrinterOption] = useState<string>('direct');
  const [printerStatus, setPrinterStatus] = useState<'connected' | 'disconnected' | 'testing'>('connected');
  const [isOnline, setIsOnline] = useState(true);
  const [pendingOfflineSales, setPendingOfflineSales] = useState<any[]>([]);

  // Detectar estado de conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Sincronizar ventas pendientes cuando vuelve la conexión
      if (pendingOfflineSales.length > 0) {
        syncOfflineSales();
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    // Listeners para cambios de conexión
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Estado inicial
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingOfflineSales]);

  // Cargar ventas pendientes del localStorage al iniciar
  useEffect(() => {
    const savedOfflineSales = localStorage.getItem('pendingOfflineSales');
    if (savedOfflineSales) {
      setPendingOfflineSales(JSON.parse(savedOfflineSales));
    }
  }, []);

  // Sincronizar ventas offline cuando vuelve la conexión
  const syncOfflineSales = async () => {
    console.log('Sincronizando ventas offline...', pendingOfflineSales);
    
    // Simular sincronización
    setTimeout(() => {
      pendingOfflineSales.forEach(sale => {
        addTransaction(sale);
      });
      
      // Limpiar ventas pendientes
      setPendingOfflineSales([]);
      localStorage.removeItem('pendingOfflineSales');
      
      alert(`✓ ${pendingOfflineSales.length} venta(s) sincronizada(s) con la nube`);
    }, 1000);
  };

  // Categorías disponibles
  const categories = [
    { id: 'all', name: 'Todas', icon: Grid3x3 },
    { id: 'bebidas', name: 'Bebidas', icon: Coffee },
    { id: 'comida', name: 'Comida', icon: Utensils },
    { id: 'snacks', name: 'Snacks', icon: Cookie },
  ];

  // Opciones de impresora
  const printerOptions = [
    {
      id: 'direct',
      name: 'Impresión Directa',
      description: 'Usar el navegador para imprimir o generar PDF',
      icon: Printer,
      color: 'blue',
      recommended: false
    },
    {
      id: 'network',
      name: 'Conexión por IP',
      description: 'Conectar a impresora de red local (192.168.x.x)',
      icon: Network,
      color: 'purple',
      recommended: false
    },
    {
      id: 'bridge',
      name: 'Bridge Local',
      description: 'Software puente para integración en la nube',
      icon: Cpu,
      color: 'green',
      recommended: true
    }
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

  // Procesar venta (online o guardar local si offline)
  const processSale = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const saleData = {
      type: 'venta' as const,
      amount: total,
      description: `Venta - ${cart.length} productos`,
      user: currentUser?.name || 'Usuario',
      items: cart.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price
      })),
      timestamp: new Date().toISOString()
    };

    // Actualizar stock localmente (siempre)
    cart.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        updateProductStock(item.productId, product.stock - item.quantity);
      }
    });

    if (isOnline) {
      // Modo Online: Registrar directamente
      addTransaction(saleData);
    } else {
      // Modo Offline: Guardar en localStorage
      const updatedPendingSales = [...pendingOfflineSales, saleData];
      setPendingOfflineSales(updatedPendingSales);
      localStorage.setItem('pendingOfflineSales', JSON.stringify(updatedPendingSales));
    }

    // Limpiar carrito
    setCart([]);

    // Mostrar mensaje de éxito
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // Probar impresión
  const testPrint = () => {
    setPrinterStatus('testing');
    
    setTimeout(() => {
      setPrinterStatus('connected');
      alert('Prueba de impresión exitosa ✓');
    }, 2000);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 shadow-sm">
        {/* Logo */}
        <div className="mb-8">
          <div className="bg-blue-600 rounded-xl p-2.5 shadow-md">
            <ShoppingCart className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 flex flex-col gap-2 w-full px-2">
          {/* Caja/Ventas */}
          <button
            className="group flex flex-col items-center gap-1.5 px-2 py-3 rounded-lg bg-blue-50 border-2 border-blue-200"
            title="Caja/Ventas"
          >
            <div className="bg-blue-100 rounded-lg p-2">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-blue-700">Caja</span>
          </button>

          {/* Inventario */}
          <button
            onClick={() => onNavigate('inventario')}
            className="group flex flex-col items-center gap-1.5 px-2 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            title="Inventario"
          >
            <div className="bg-gray-100 group-hover:bg-purple-100 rounded-lg p-2 transition-colors">
              <Package className="w-5 h-5 text-gray-600 group-hover:text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-600 group-hover:text-purple-600">
              Stock
            </span>
          </button>

          {/* Reportes */}
          <button
            onClick={() => onNavigate('reportes')}
            className="group flex flex-col items-center gap-1.5 px-2 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            title="Reportes"
          >
            <div className="bg-gray-100 group-hover:bg-indigo-100 rounded-lg p-2 transition-colors">
              <BarChart3 className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-600">
              Reportes
            </span>
          </button>

          {/* Clientes */}
          <button
            className="group flex flex-col items-center gap-1.5 px-2 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            title="Clientes"
          >
            <div className="bg-gray-100 group-hover:bg-teal-100 rounded-lg p-2 transition-colors">
              <Users className="w-5 h-5 text-gray-600 group-hover:text-teal-600" />
            </div>
            <span className="text-xs font-medium text-gray-600 group-hover:text-teal-600">
              Clientes
            </span>
          </button>

          {/* Configuración */}
          <button
            onClick={() => setShowPrinterModal(true)}
            className="group flex flex-col items-center gap-1.5 px-2 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            title="Configuración"
          >
            <div className="bg-gray-100 group-hover:bg-amber-100 rounded-lg p-2 transition-colors">
              <Settings className="w-5 h-5 text-gray-600 group-hover:text-amber-600" />
            </div>
            <span className="text-xs font-medium text-gray-600 group-hover:text-amber-600">
              Config
            </span>
          </button>
        </nav>

        {/* Usuario y Logout */}
        <div className="flex flex-col items-center gap-3 mt-auto">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 rounded-full p-2 mb-1">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight max-w-[60px] truncate">
              {currentUser?.name?.split(' ')[0]}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="w-12 h-12 flex items-center justify-center bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
            title="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </aside>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra Superior */}
        <header className="bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="px-6 py-3 flex items-center justify-between">
            {/* Izquierda - Título */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sistema POS Profesional</h1>
              <p className="text-xs text-gray-500">Punto de Venta en la Nube</p>
            </div>

            {/* Derecha - Indicadores */}
            <div className="flex items-center gap-3">
              {/* Indicador de Conexión a la Nube */}
              {isOnline ? (
                <button
                  onClick={() => setIsOnline(false)}
                  className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                  title="Click para simular desconexión"
                >
                  <div className="relative">
                    <Globe className="w-4 h-4 text-green-600" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-green-700 leading-none">Nube Conectada</p>
                    <p className="text-xs text-green-600 leading-none">Sincronizado</p>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => setIsOnline(true)}
                  className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200 animate-pulse hover:bg-orange-100 transition-colors"
                  title="Click para reconectar"
                >
                  <div className="relative">
                    <CloudOff className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-orange-700 leading-none">Desconectado</p>
                    <p className="text-xs text-orange-600 leading-none">Modo Offline</p>
                  </div>
                </button>
              )}

              {/* Indicador 2FA */}
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <Shield className="w-4 h-4 text-blue-600" />
                <div className="text-left">
                  <p className="text-xs font-bold text-blue-700 leading-none">Sesión Segura</p>
                  <p className="text-xs text-blue-600 leading-none">2FA Activo</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Layout Principal */}
        <div className="flex-1 flex overflow-hidden">
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

                {/* Contador */}
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
              {/* Mensaje de Modo Offline */}
              {!isOnline && (
                <div className="mb-4 bg-orange-50 border-l-4 border-orange-500 p-3 rounded-r-lg">
                  <div className="flex items-start gap-2">
                    <WifiOff className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-orange-800 mb-1">
                        Sin conexión a internet
                      </p>
                      <p className="text-xs text-orange-700 leading-relaxed">
                        Las ventas se guardarán localmente y se sincronizarán automáticamente al volver la conexión
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Badge de ventas pendientes */}
              {pendingOfflineSales.length > 0 && (
                <div className="mb-4 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-blue-600" />
                      <p className="text-sm font-semibold text-blue-800">
                        {pendingOfflineSales.length} venta(s) pendiente(s) de sincronizar
                      </p>
                    </div>
                    {isOnline && (
                      <button
                        onClick={syncOfflineSales}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Sincronizar
                      </button>
                    )}
                  </div>
                </div>
              )}

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

              {/* Botón de Cobrar o Guardar Local */}
              {isOnline ? (
                <button
                  onClick={processSale}
                  disabled={cart.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-5 h-5" />
                  Procesar Venta
                </button>
              ) : (
                <button
                  onClick={processSale}
                  disabled={cart.length === 0}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Guardar Venta Local
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Modal de Configuración de Impresora */}
      {showPrinterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop semi-transparente */}
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]"
            onClick={() => setShowPrinterModal(false)}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 border-b border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border-2 border-white/30">
                    <Printer className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Configuración de Impresora en la Nube
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                      Selecciona el método de impresión para tickets de venta
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPrinterModal(false)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Indicador de Estado */}
              <div className="mt-4 flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-green-400/30">
                <Globe className="w-4 h-4 text-green-100" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Servidor en la Nube Conectado</p>
                  <p className="text-xs text-green-100">Sistema operando desde infraestructura cloud</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-300" />
              </div>
            </div>

            {/* Body - Opciones */}
            <div className="p-8">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {printerOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedPrinterOption === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedPrinterOption(option.id)}
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        isSelected
                          ? `border-${option.color}-500 bg-${option.color}-50 shadow-lg`
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      {/* Badge de Recomendado */}
                      {option.recommended && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          Recomendado
                        </div>
                      )}

                      {/* Icono */}
                      <div className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? `bg-${option.color}-100`
                          : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-7 h-7 ${
                          isSelected ? `text-${option.color}-600` : 'text-gray-600'
                        }`} />
                      </div>

                      {/* Nombre */}
                      <h3 className={`font-bold mb-2 text-center ${
                        isSelected ? `text-${option.color}-700` : 'text-gray-900'
                      }`}>
                        {option.name}
                      </h3>

                      {/* Descripción */}
                      <p className="text-xs text-gray-600 text-center leading-relaxed">
                        {option.description}
                      </p>

                      {/* Check de selección */}
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <div className={`w-6 h-6 rounded-full bg-${option.color}-500 flex items-center justify-center`}>
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Información adicional según opción seleccionada */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {selectedPrinterOption === 'direct' && 'Configuración: Impresión Directa'}
                      {selectedPrinterOption === 'network' && 'Configuración: Impresora de Red'}
                      {selectedPrinterOption === 'bridge' && 'Configuración: Bridge Local (Recomendado)'}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {selectedPrinterOption === 'direct' && 
                        'Los tickets se generarán en el navegador. Puedes usar Ctrl+P para imprimir o guardar como PDF. Ideal para pruebas o ambientes sin impresora térmica.'}
                      {selectedPrinterOption === 'network' && 
                        'Conecta directamente a tu impresora térmica por IP. Requiere que la impresora esté en la misma red local y soporte ESC/POS.'}
                      {selectedPrinterOption === 'bridge' && 
                        'Instala nuestro software bridge en una computadora local. Esta computadora manejará la impresión desde la nube de manera automática. Mejor opción para producción.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3">
                <button
                  onClick={testPrint}
                  disabled={printerStatus === 'testing'}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {printerStatus === 'testing' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Probando...
                    </>
                  ) : (
                    <>
                      <Printer className="w-5 h-5" />
                      Probar Impresión
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowPrinterModal(false)}
                  className="px-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Guardar Configuración
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Settings className="w-4 h-4 text-gray-400" />
                <p>
                  Puedes cambiar esta configuración en cualquier momento desde el menú de Configuración.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de Éxito */}
      {showSuccessMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          {isOnline ? (
            <div className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-2xl flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-lg">¡Venta procesada exitosamente!</p>
                <p className="text-sm text-green-100">Total: ${total.toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <div className="bg-orange-600 text-white px-8 py-4 rounded-lg shadow-2xl flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Save className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-lg">Venta guardada localmente</p>
                <p className="text-sm text-orange-100">
                  Total: ${total.toFixed(2)} • Se sincronizará al volver la conexión
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
