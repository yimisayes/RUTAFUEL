import { useState } from 'react';
import { Coffee, Utensils, ShoppingBag, Candy, Plus, Minus, Trash2 } from 'lucide-react';
import { usePOS, Product } from '../context/POSContext';
import { TicketPrintOverlay } from './TicketPrintOverlay';

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export function VentasViewWithContext() {
  const { products, updateProductStock, addTransaction } = usePOS();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showTicket, setShowTicket] = useState(false);
  const [lastTransactionId, setLastTransactionId] = useState('');

  const categories: Category[] = [
    { id: 'all', name: 'Todo', icon: <ShoppingBag className="size-5" /> },
    { id: 'bebidas', name: 'Bebidas', icon: <Coffee className="size-5" /> },
    { id: 'comida', name: 'Comida', icon: <Utensils className="size-5" /> },
    { id: 'snacks', name: 'Snacks', icon: <Candy className="size-5" /> },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToOrder = (product: Product) => {
    // VALIDACIÓN: Verificar si el producto tiene stock disponible
    if (product.stock === 0) {
      alert(`El producto "${product.name}" está AGOTADO. No hay unidades disponibles.`);
      return;
    }

    const existingItem = orderItems.find(item => item.product.id === product.id);
    if (existingItem) {
      // Verificar que no se exceda el stock disponible
      if (existingItem.quantity >= product.stock) {
        alert(`Stock insuficiente. Solo hay ${product.stock} unidades disponibles de "${product.name}".`);
        return;
      }
      
      setOrderItems(orderItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
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
    if (orderItems.length === 0) return;

    // Generar ID de transacción
    const transactionId = `VTA-${Date.now().toString().slice(-8)}`;
    setLastTransactionId(transactionId);

    // 1. ACTUALIZACIÓN DE STOCK
    orderItems.forEach(item => {
      const newStock = item.product.stock - item.quantity;
      updateProductStock(item.product.id, newStock);
    });

    // 2. REGISTRO DE MOVIMIENTO EN HISTORIAL DE CAJA
    const itemsDetail = orderItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price
    }));

    addTransaction({
      type: 'venta',
      amount: total,
      description: `Venta ${transactionId} - ${orderItems.length} producto(s)`,
      user: 'Usuario Admin',
      items: itemsDetail
    });

    // 3. GENERAR E IMPRIMIR TICKET AUTOMÁTICAMENTE
    generarEImprimirTicket(transactionId);

    // 4. LIMPIEZA DEL CARRITO
    setOrderItems([]);
  };

  const generarEImprimirTicket = (transactionId: string) => {
    const fecha = new Date();
    
    // Crear contenido HTML del ticket optimizado para impresora térmica 80mm
    const ticketHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Ticket ${transactionId}</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 0;
          }
          
          body {
            font-family: 'Courier New', monospace;
            width: 80mm;
            margin: 0;
            padding: 10mm 5mm;
            font-size: 12px;
            line-height: 1.4;
          }
          
          .ticket {
            width: 100%;
          }
          
          .header {
            text-align: center;
            border-bottom: 2px dashed #000;
            padding-bottom: 8px;
            margin-bottom: 8px;
          }
          
          .header h1 {
            margin: 0 0 4px 0;
            font-size: 20px;
            font-weight: bold;
          }
          
          .header p {
            margin: 2px 0;
            font-size: 11px;
          }
          
          .info {
            margin: 8px 0;
            font-size: 11px;
          }
          
          .info-row {
            display: flex;
            justify-content: space-between;
            margin: 2px 0;
          }
          
          .items {
            border-top: 2px dashed #000;
            border-bottom: 2px dashed #000;
            padding: 8px 0;
            margin: 8px 0;
          }
          
          .item {
            margin: 4px 0;
          }
          
          .item-header {
            font-weight: bold;
            margin-bottom: 2px;
          }
          
          .item-details {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            padding-left: 8px;
          }
          
          .totals {
            margin: 8px 0;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
            font-size: 12px;
          }
          
          .total-row.final {
            font-size: 16px;
            font-weight: bold;
            border-top: 2px solid #000;
            padding-top: 6px;
            margin-top: 6px;
          }
          
          .footer {
            text-align: center;
            margin-top: 12px;
            padding-top: 8px;
            border-top: 2px dashed #000;
            font-size: 11px;
          }
          
          .barcode {
            text-align: center;
            font-size: 10px;
            letter-spacing: 2px;
            margin: 8px 0;
          }
          
          @media print {
            body {
              padding: 5mm 3mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <!-- Header -->
          <div class="header">
            <h1>SISTEMA POS</h1>
            <p>RFC: XAXX010101000</p>
            <p>Ticket de Venta</p>
          </div>
          
          <!-- Info -->
          <div class="info">
            <div class="info-row">
              <span>Folio:</span>
              <span><strong>${transactionId}</strong></span>
            </div>
            <div class="info-row">
              <span>Fecha:</span>
              <span>${fecha.toLocaleDateString('es-MX')}</span>
            </div>
            <div class="info-row">
              <span>Hora:</span>
              <span>${fecha.toLocaleTimeString('es-MX')}</span>
            </div>
            <div class="info-row">
              <span>Cajero:</span>
              <span>Usuario Admin</span>
            </div>
          </div>
          
          <!-- Items -->
          <div class="items">
            ${orderItems.map(item => `
              <div class="item">
                <div class="item-header">${item.product.name}</div>
                <div class="item-details">
                  <span>${item.quantity} x $${item.product.price.toFixed(2)}</span>
                  <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            `).join('')}
          </div>
          
          <!-- Totals -->
          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>IVA (13%):</span>
              <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="total-row final">
              <span>TOTAL:</span>
              <span>$${total.toFixed(2)}</span>
            </div>
          </div>
          
          <!-- Barcode -->
          <div class="barcode">
            ||||| ${transactionId} |||||
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p>¡Gracias por su compra!</p>
            <p>www.sistempos.com</p>
            <p>Tel: (555) 123-4567</p>
            <p style="margin-top: 8px; font-size: 10px;">
              ${fecha.toLocaleString('es-MX')}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Crear una ventana oculta para imprimir
    const printWindow = window.open('', '_blank', 'width=300,height=600');
    if (printWindow) {
      printWindow.document.write(ticketHTML);
      printWindow.document.close();
      
      // Esperar a que se cargue y luego imprimir automáticamente
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // Cerrar la ventana después de imprimir
          printWindow.onafterprint = () => {
            printWindow.close();
          };
        }, 250);
      };
    }
  };

  const handleCloseTicket = () => {
    setShowTicket(false);
    // 4. LIMPIEZA DEL CARRITO
    setOrderItems([]);
  };

  return (
    <>
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
                disabled={product.stock === 0}
                className={`bg-white border-2 rounded-lg p-4 text-left transition-all relative ${
                  product.stock === 0 
                    ? 'opacity-50 cursor-not-allowed border-gray-300' 
                    : 'hover:border-blue-500 hover:shadow-md border-gray-200'
                }`}
              >
                {/* AGOTADO Badge */}
                {product.stock === 0 && (
                  <div className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-md">
                    AGOTADO
                  </div>
                )}
                
                <h3 className="font-medium text-gray-900 mb-2 pr-20">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-semibold ${product.stock === 0 ? 'text-gray-400' : 'text-blue-600'}`}>
                    ${product.price.toFixed(2)}
                  </span>
                  <span className={`text-sm font-semibold ${
                    product.stock === 0 ? 'text-red-600' : 
                    product.stock < 10 ? 'text-orange-600' : 
                    'text-gray-500'
                  }`}>
                    {product.stock === 0 ? '0 disponibles' : `Stock: ${product.stock}`}
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

      {/* Ticket Print Overlay */}
      {showTicket && (
        <TicketPrintOverlay
          orderItems={orderItems}
          subtotal={subtotal}
          tax={tax}
          total={total}
          transactionId={lastTransactionId}
          onClose={handleCloseTicket}
        />
      )}
    </>
  );
}