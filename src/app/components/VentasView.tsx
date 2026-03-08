import { useState } from 'react';
import { Coffee, Utensils, ShoppingBag, Candy, Plus, Minus, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export function VentasView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const categories: Category[] = [
    { id: 'all', name: 'Todo', icon: <ShoppingBag className="size-5" /> },
    { id: 'bebidas', name: 'Bebidas', icon: <Coffee className="size-5" /> },
    { id: 'comida', name: 'Comida', icon: <Utensils className="size-5" /> },
    { id: 'snacks', name: 'Snacks', icon: <Candy className="size-5" /> },
  ];

  const products: Product[] = [
    { id: '1', name: 'Café Americano', price: 3.50, stock: 45, category: 'bebidas' },
    { id: '2', name: 'Cappuccino', price: 4.50, stock: 38, category: 'bebidas' },
    { id: '3', name: 'Té Verde', price: 3.00, stock: 52, category: 'bebidas' },
    { id: '4', name: 'Jugo Natural', price: 5.00, stock: 28, category: 'bebidas' },
    { id: '5', name: 'Sandwich Club', price: 8.50, stock: 15, category: 'comida' },
    { id: '6', name: 'Ensalada César', price: 9.00, stock: 12, category: 'comida' },
    { id: '7', name: 'Pasta Alfredo', price: 12.00, stock: 8, category: 'comida' },
    { id: '8', name: 'Croissant', price: 3.50, stock: 24, category: 'snacks' },
    { id: '9', name: 'Galletas', price: 2.50, stock: 60, category: 'snacks' },
    { id: '10', name: 'Muffin', price: 3.00, stock: 30, category: 'snacks' },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToOrder = (product: Product) => {
    const existingItem = orderItems.find(item => item.product.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setOrderItems(orderItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      setOrderItems([...orderItems, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setOrderItems(orderItems.map(item => {
      if (item.product.id === productId) {
        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) {
          return null;
        }
        if (newQuantity > item.product.stock) {
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as OrderItem[]);
  };

  const removeItem = (productId: string) => {
    setOrderItems(orderItems.filter(item => item.product.id !== productId));
  };

  const subtotal = orderItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  const handleCancel = () => {
    if (orderItems.length > 0) {
      if (window.confirm('¿Deseas cancelar la orden actual?')) {
        setOrderItems([]);
      }
    }
  };

  const handleCheckout = () => {
    if (orderItems.length > 0) {
      alert(`Total a cobrar: $${total.toFixed(2)}`);
      setOrderItems([]);
    }
  };

  return (
    <div className="h-full flex">
      {/* Left Column - Categories */}
      <div className="w-32 bg-gray-50 border-r border-gray-200 p-4">
        <div className="flex flex-col gap-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="size-10 flex items-center justify-center rounded-full bg-white/20">
                {category.icon}
              </div>
              <span className="text-xs font-medium text-center">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Center Column - Products Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Productos</h2>
        <div className="grid grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToOrder(product)}
              className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
                <span className={`text-sm ${product.stock < 10 ? 'text-red-600' : 'text-gray-500'}`}>
                  Stock: {product.stock}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Column - Current Order */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Orden Actual</h2>
        </div>

        {/* Order Items List */}
        <div className="flex-1 overflow-y-auto p-6">
          {orderItems.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <ShoppingBag className="size-12 mx-auto mb-3 opacity-50" />
              <p>No hay productos en la orden</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orderItems.map(item => (
                <div key={item.product.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">${item.product.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="size-8 flex items-center justify-center rounded bg-white border border-gray-300 hover:bg-gray-100"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="size-8 flex items-center justify-center rounded bg-white border border-gray-300 hover:bg-gray-100"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals and Actions */}
        <div className="border-t border-gray-200 p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">IVA (13%):</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-semibold pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCancel}
              className="py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCheckout}
              disabled={orderItems.length === 0}
              className="py-3 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              Cobrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}