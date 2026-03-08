import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Product, Transaction } from '../app/context/POSContext';

// Hook para sincronizar productos con Supabase
export function useProductsSync() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos iniciales
  useEffect(() => {
    loadProducts();
    
    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .channel('products_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Product change:', payload);
          loadProducts(); // Recargar productos cuando hay cambios
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;
      
      setProducts(data || []);
      setError(null);
    } catch (err: any) {
      // Silenciar error si la tabla no existe, usar productos por defecto
      if (err.code === 'PGRST205') {
        console.log('Usando productos por defecto (tabla Supabase no encontrada)');
      } else {
        console.error('Error loading products:', err);
      }
      setError(null); // No mostrar error al usuario
      // Usar productos por defecto si falla
      setProducts(getDefaultProducts());
    } finally {
      setLoading(false);
    }
  };

  const updateProductStock = async (productId: string, newStock: number) => {
    try {
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: newStock, updated_at: new Date().toISOString() })
        .eq('id', productId);

      if (updateError) throw updateError;
    } catch (err: any) {
      console.error('Error updating product stock:', err);
      setError(err.message);
    }
  };

  return { products, loading, error, updateProductStock, refresh: loadProducts };
}

// Hook para sincronizar transacciones con Supabase
export function useTransactionsSync() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .channel('transactions_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
          console.log('Transaction change:', payload);
          loadTransactions();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadTransactions = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .order('timestamp', { ascending: false });

      if (fetchError) throw fetchError;
      
      setTransactions(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error loading transactions:', err);
      setError(err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    try {
      const newTransaction = {
        ...transaction,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .from('transactions')
        .insert([newTransaction]);

      if (insertError) throw insertError;
      
      await loadTransactions();
    } catch (err: any) {
      console.error('Error adding transaction:', err);
      setError(err.message);
    }
  };

  return { transactions, loading, error, addTransaction, refresh: loadTransactions };
}

// Hook para sincronizar estado de caja con Supabase
export function useCajaStatusSync() {
  const [isOpen, setIsOpen] = useState(false);
  const [fondoInicial, setFondoInicial] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCajaStatus();

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .channel('caja_status_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'caja_status' },
        (payload) => {
          console.log('Caja status change:', payload);
          loadCajaStatus();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadCajaStatus = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('caja_status')
        .select('*')
        .single();

      if (fetchError) {
        // Si no existe, crear registro inicial
        if (fetchError.code === 'PGRST116') {
          await createInitialCajaStatus();
          return;
        }
        throw fetchError;
      }
      
      setIsOpen(data?.is_open || false);
      setFondoInicial(data?.fondo_inicial || 0);
      setError(null);
    } catch (err: any) {
      console.error('Error loading caja status:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createInitialCajaStatus = async () => {
    try {
      const { error: insertError } = await supabase
        .from('caja_status')
        .insert([{
          is_open: false,
          fondo_inicial: 0,
          efectivo_actual: 0,
        }]);

      if (insertError) throw insertError;
      await loadCajaStatus();
    } catch (err: any) {
      console.error('Error creating initial caja status:', err);
    }
  };

  const updateCajaStatus = async (updates: { is_open?: boolean; fondo_inicial?: number; efectivo_actual?: number; opened_by?: string }) => {
    try {
      const { error: updateError } = await supabase
        .from('caja_status')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1); // Asumiendo un solo registro de estado

      if (updateError) throw updateError;
      await loadCajaStatus();
    } catch (err: any) {
      console.error('Error updating caja status:', err);
      setError(err.message);
    }
  };

  return { isOpen, fondoInicial, loading, error, updateCajaStatus, refresh: loadCajaStatus };
}

// Hook para configuración (IVA, etc.)
export function useConfigSync() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .channel('config_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'config' },
        (payload) => {
          console.log('Config change:', payload);
          loadConfig();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadConfig = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('config')
        .select('*');

      if (fetchError) throw fetchError;
      
      // Convertir array a objeto
      const configObj: Record<string, string> = {};
      data?.forEach(item => {
        configObj[item.key] = item.value;
      });
      
      setConfig(configObj);
      setError(null);
    } catch (err: any) {
      console.error('Error loading config:', err);
      setError(err.message);
      // Usar configuración por defecto
      setConfig({ iva_rate: '0.13', currency: 'USD' });
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (key: string, value: string) => {
    try {
      const { error: upsertError } = await supabase
        .from('config')
        .upsert([{
          key,
          value,
          updated_at: new Date().toISOString(),
        }], { onConflict: 'key' });

      if (upsertError) throw upsertError;
      await loadConfig();
    } catch (err: any) {
      console.error('Error updating config:', err);
      setError(err.message);
    }
  };

  return { config, loading, error, updateConfig, refresh: loadConfig };
}

// Función auxiliar para productos por defecto
function getDefaultProducts(): Product[] {
  return [
    { id: '1', name: 'Café Americano', price: 3.50, stock: 45, category: 'bebidas', sku: 'BEB-001' },
    { id: '2', name: 'Cappuccino', price: 4.50, stock: 38, category: 'bebidas', sku: 'BEB-002' },
    { id: '3', name: 'Té Verde', price: 3.00, stock: 52, category: 'bebidas', sku: 'BEB-003' },
    { id: '4', name: 'Jugo Natural', price: 5.00, stock: 28, category: 'bebidas', sku: 'BEB-004' },
    { id: '5', name: 'Sandwich Club', price: 8.50, stock: 15, category: 'comida', sku: 'COM-001' },
    { id: '6', name: 'Ensalada César', price: 9.00, stock: 12, category: 'comida', sku: 'COM-002' },
    { id: '7', name: 'Pasta Alfredo', price: 12.00, stock: 8, category: 'comida', sku: 'COM-003' },
    { id: '8', name: 'Croissant', price: 3.50, stock: 24, category: 'snacks', sku: 'SNK-001' },
    { id: '9', name: 'Galletas', price: 2.50, stock: 60, category: 'snacks', sku: 'SNK-002' },
    { id: '10', name: 'Muffin', price: 3.00, stock: 30, category: 'snacks', sku: 'SNK-003' },
  ];
}
