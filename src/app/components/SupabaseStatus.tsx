import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';

export function SupabaseStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkConnection = async () => {
    setChecking(true);
    try {
      const { error } = await supabase.from('config').select('count').single();
      setIsConnected(!error);
    } catch (err) {
      setIsConnected(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Verificar conexión cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
        <RefreshCw className="size-4 text-gray-500 animate-spin" />
        <span className="text-xs text-gray-600">Conectando...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
      isConnected 
        ? 'bg-green-100 text-green-700' 
        : 'bg-red-100 text-red-700'
    }`}>
      {checking ? (
        <RefreshCw className="size-4 animate-spin" />
      ) : isConnected ? (
        <Cloud className="size-4" />
      ) : (
        <CloudOff className="size-4" />
      )}
      <span className="text-xs font-medium">
        {isConnected ? 'Nube: Conectado' : 'Nube: Desconectado'}
      </span>
      <button
        onClick={checkConnection}
        className="ml-1 text-xs underline hover:no-underline"
        disabled={checking}
      >
        {checking ? '...' : 'Verificar'}
      </button>
    </div>
  );
}
