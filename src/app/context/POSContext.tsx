import { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  sku?: string;
  image?: string;
}

export interface Transaction {
  id: string;
  type: 'entrada' | 'salida' | 'venta';
  amount: number;
  description: string;
  timestamp: Date;
  user: string;
  items?: { productId: string; productName: string; quantity: number; price: number }[];
}

export interface CierreReport {
  id: string;
  fondoInicial: number;
  transactions: Transaction[];
  closedAt: Date;
  closedBy: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  role: 'admin' | 'vendedor';
  createdAt: Date;
  active: boolean;
}

interface POSContextType {
  products: Product[];
  updateProductStock: (productId: string, newStock: number) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (productId: string) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  cierreReports: CierreReport[];
  isCajaCerrada: boolean;
  createCierreReport: (fondoInicial: number) => string;
  clearCurrentTransactions: () => void;
  reopenCaja: () => void;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  deleteUser: (userId: string) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  fondoInicial: number;
  setFondoInicial: (amount: number) => void;
  cajaRequiereApertura: boolean;
  setCajaRequiereApertura: (value: boolean) => void;
  efectivoActual: number;
  calcularEfectivoActual: () => number;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export function POSProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Café Americano', price: 3.50, stock: 45, category: 'bebidas', sku: 'BEB-001', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop' },
    { id: '2', name: 'Cappuccino', price: 4.50, stock: 38, category: 'bebidas', sku: 'BEB-002', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&h=100&fit=crop' },
    { id: '3', name: 'Té Verde', price: 3.00, stock: 52, category: 'bebidas', sku: 'BEB-003', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=100&h=100&fit=crop' },
    { id: '4', name: 'Jugo Natural', price: 5.00, stock: 28, category: 'bebidas', sku: 'BEB-004', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=100&h=100&fit=crop' },
    { id: '5', name: 'Sandwich Club', price: 8.50, stock: 15, category: 'comida', sku: 'COM-001', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=100&h=100&fit=crop' },
    { id: '6', name: 'Ensalada César', price: 9.00, stock: 12, category: 'comida', sku: 'COM-002', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=100&h=100&fit=crop' },
    { id: '7', name: 'Pasta Alfredo', price: 12.00, stock: 8, category: 'comida', sku: 'COM-003', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=100&h=100&fit=crop' },
    { id: '8', name: 'Croissant', price: 3.50, stock: 24, category: 'snacks', sku: 'SNK-001', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&h=100&fit=crop' },
    { id: '9', name: 'Galletas', price: 2.50, stock: 60, category: 'snacks', sku: 'SNK-002', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100&h=100&fit=crop' },
    { id: '10', name: 'Muffin', price: 3.00, stock: 30, category: 'snacks', sku: 'SNK-003', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=100&h=100&fit=crop' },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Administrador',
      username: 'admin',
      password: '1982',
      role: 'admin',
      createdAt: new Date(),
      active: true
    }
  ]);

  const [cierreReports, setCierreReports] = useState<CierreReport[]>([]);
  const [isCajaCerrada, setIsCajaCerrada] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [fondoInicial, setFondoInicial] = useState(0);
  const [cajaRequiereApertura, setCajaRequiereApertura] = useState(true);

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, stock: newStock }
          : product
      )
    );
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  };

  const createCierreReport = (fondoInicialValue: number): string => {
    const reportId = `CZ-${Date.now().toString().slice(-8)}`;
    const newReport: CierreReport = {
      id: reportId,
      fondoInicial: fondoInicialValue,
      transactions: [...transactions], // Copia los movimientos actuales
      closedAt: new Date(),
      closedBy: currentUser?.name || 'Admin'
    };
    
    setCierreReports(prev => [newReport, ...prev]);
    return reportId;
  };

  const clearCurrentTransactions = () => {
    setTransactions([]);
    setIsCajaCerrada(true);
  };

  const reopenCaja = () => {
    setIsCajaCerrada(false);
    // No agregar transacción aquí, se agregará desde el login
  };

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const calcularEfectivoActual = () => {
    return transactions.reduce((total, transaction) => {
      if (transaction.type === 'entrada') {
        return total + transaction.amount;
      } else if (transaction.type === 'salida') {
        return total - transaction.amount;
      } else if (transaction.type === 'venta') {
        return total + transaction.amount;
      }
      return total;
    }, fondoInicial);
  };

  return (
    <POSContext.Provider
      value={{
        products,
        updateProductStock,
        addProduct,
        deleteProduct,
        transactions,
        addTransaction,
        cierreReports,
        isCajaCerrada,
        createCierreReport,
        clearCurrentTransactions,
        reopenCaja,
        users,
        addUser,
        deleteUser,
        currentUser,
        setCurrentUser,
        fondoInicial,
        setFondoInicial,
        cajaRequiereApertura,
        setCajaRequiereApertura,
        efectivoActual: calcularEfectivoActual(),
        calcularEfectivoActual,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}