import { useState, useEffect } from 'react';
import { 
  User, 
  LogOut, 
  Wifi, 
  Coffee,
  Utensils,
  Cookie,
  ShoppingCart,
  Trash2,
  DollarSign,
  X
} from 'lucide-react';
import { usePOS } from '../context/POSContext';

interface POSDashboardMainProps {
  onLogout: () => void;
}

interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export function POSDashboardMain({ onLogout }: POSDashboardMainProps) {
  const { currentUser, products, addTransaction, updateProductStock } = usePOS();
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showToast, setShowToast] = useState(true);

  // Ocultar toast después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Obtener categorías únicas
  const categories = [
    { id: 'todas', name: 'Todas', icon: ShoppingCart },
    { id: 'bebidas', name: 'Bebidas', icon: Coffee },
    { id: 'comida', name: 'Comida', icon: Utensils },
    { id: 'snacks', name: 'Snacks', icon: Cookie },
  ];

  // Filtrar productos por categoría
  const filteredProducts = selectedCategory === 'todas'
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Agregar producto al carrito
  const addToCart = (product: typeof products[0]) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
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
        quantity: 1
      }]);
    }
  };

  // Remover item del carrito
  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  // Decrementar cantidad
  const decrementQuantity = (productId: string) => {
    const item = cart.find(item => item.productId === productId);
    if (item && item.quantity > 1) {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      removeFromCart(productId);
    }
  };

  // Incrementar cantidad
  const incrementQuantity = (productId: string) => {
    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  // Calcular subtotal
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const iva = subtotal * 0.13; // IVA 13% El Salvador
  const total = subtotal + iva;

  // Procesar venta
  const processSale = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Agregar transacción
    addTransaction({
      type: 'venta',
      amount: total,
      description: `Venta - ${cart.length} productos`,
      user: currentUser?.name || 'Usuario',
      items: cart
    });

    // Actualizar stock
    cart.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        updateProductStock(item.productId, product.stock - item.quantity);
      }
    });

    // Limpiar carrito
    setCart([]);

    // Mostrar confirmación
    alert(`Venta procesada exitosamente por $${total.toFixed(2)}`);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Barra Superior */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Usuario */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full p-2">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{currentUser?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
            </div>
          </div>

          {/* Centro - Título */}
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-gray-900">Sistema POS</h1>
            <p className="text-xs text-gray-500">Punto de Venta en la Nube</p>
          </div>

          {/* Derecha - Indicador y Logout */}
          <div className="flex items-center gap-4">
            {/* Indicador de Sistema en Línea */}
            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
              <div className="relative">
                <Wifi className="w-4 h-4 text-green-600" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xs font-semibold text-green-700">Sistema en Línea</span>
            </div>

            {/* Botón Cerrar Sesión */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-colors border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-semibold">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel Principal - Productos */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Selector de Categorías */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cuadrícula de Productos */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`bg-white border-2 rounded-lg p-4 transition-all text-left ${
                    product.stock === 0
                      ? 'border-gray-200 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-blue-400 hover:shadow-lg'
                  }`}
                >
                  {/* Imagen del producto */}
                  {product.image && (
                    <div className="w-full h-24 mb-3 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Nombre y precio */}
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xl font-bold text-blue-600 mb-2">
                    ${product.price.toFixed(2)}
                  </p>

                  {/* Stock */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${
                      product.stock < 5 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      Stock: {product.stock}
                    </span>
                    {product.stock === 0 && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                        Agotado
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Lateral - Ticket de Venta */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-lg">
          {/* Header del Ticket */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Ticket de Venta
            </h2>
            <p className="text-xs text-blue-100">
              {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>

          {/* Items del Carrito */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingCart className="w-16 h-16 mb-3" />
                <p className="text-sm font-medium">Carrito vacío</p>
                <p className="text-xs">Selecciona productos para comenzar</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm flex-1">
                      {item.productName}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrementQuantity(item.productId)}
                        className="w-7 h-7 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 font-bold text-gray-700"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQuantity(item.productId)}
                        className="w-7 h-7 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 font-bold text-gray-700"
                      >
                        +
                      </button>
                    </div>

                    {/* Precio */}
                    <div className="text-right">
                      <p className="text-xs text-gray-500">${item.price.toFixed(2)} c/u</p>
                      <p className="font-bold text-blue-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Resumen y Total */}
          <div className="border-t border-gray-200 p-4 space-y-3">
            {/* Subtotales */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>IVA (13%):</span>
                <span className="font-semibold">${iva.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-lg font-bold text-gray-900">TOTAL:</span>
              <span className="text-2xl font-bold text-blue-600">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Botones de Acción */}
            <div className="space-y-2 pt-2">
              <button
                onClick={processSale}
                disabled={cart.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <DollarSign className="w-5 h-5" />
                Cobrar
              </button>
              <button
                onClick={() => setCart([])}
                disabled={cart.length === 0}
                className="w-full bg-red-50 hover:bg-red-100 disabled:bg-gray-100 text-red-600 disabled:text-gray-400 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Limpiar Carrito
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification - Sesión Restaurada */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <p className="font-semibold text-sm">✓ Sesión restaurada correctamente</p>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 hover:bg-green-700 rounded p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
