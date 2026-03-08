import { ShoppingCart, Package, Banknote, Lock, BarChart3, LogOut, Shield, User, LayoutDashboard } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { SupabaseStatus } from './SupabaseStatus';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function SidebarItem({ icon, label, isActive, onClick, disabled }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-6 py-4 transition-colors ${
        disabled 
          ? 'opacity-50 cursor-not-allowed text-gray-400'
          : isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <div className="size-5">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

interface POSSidebarWithContextProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

export function POSSidebarWithContext({ activeSection, onSectionChange, onLogout }: POSSidebarWithContextProps) {
  const { currentUser } = usePOS();

  const sections = [
    { id: 'dashboard', icon: <LayoutDashboard className="size-5" />, label: 'Dashboard', adminOnly: false },
    { id: 'ventas', icon: <ShoppingCart className="size-5" />, label: 'Ventas', adminOnly: false },
    { id: 'inventario', icon: <Package className="size-5" />, label: 'Inventario', adminOnly: false },
    { id: 'caja', icon: <Banknote className="size-5" />, label: 'Caja', adminOnly: false },
    { id: 'usuarios', icon: <Lock className="size-5" />, label: 'Usuarios', adminOnly: true },
    { id: 'reportes', icon: <BarChart3 className="size-5" />, label: 'Reportes', adminOnly: false },
  ];

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Sistema POS</h1>
        <div className="mt-3 flex items-center gap-2">
          <div className={`size-8 rounded-lg flex items-center justify-center ${
            isAdmin ? 'bg-purple-100' : 'bg-blue-100'
          }`}>
            {isAdmin ? (
              <Shield className="size-4 text-purple-600" />
            ) : (
              <User className="size-4 text-blue-600" />
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900">{currentUser?.name}</p>
            <p className="text-xs text-gray-500">
              {isAdmin ? 'Administrador' : 'Vendedor'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-4">
        {sections.map((section) => (
          <SidebarItem
            key={section.id}
            icon={section.icon}
            label={section.label}
            isActive={activeSection === section.id}
            onClick={() => onSectionChange(section.id)}
            disabled={section.adminOnly && !isAdmin}
          />
        ))}
      </nav>

      {/* Admin Badge */}
      {!isAdmin && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-200">
          <p className="text-xs text-blue-800 text-center">
            <Lock className="size-3 inline mr-1" />
            Algunas funciones requieren acceso de administrador
          </p>
        </div>
      )}

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium"
        >
          <LogOut className="size-5" />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">v2.1.5</p>
        <SupabaseStatus />
      </div>
    </div>
  );
}