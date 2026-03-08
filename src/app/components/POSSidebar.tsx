import { ShoppingCart, Package, Banknote, Lock, BarChart3, LogOut } from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function SidebarItem({ icon, label, isActive, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-6 py-4 transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <div className="size-5">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

interface POSSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

export function POSSidebar({ activeSection, onSectionChange, onLogout }: POSSidebarProps) {
  const sections = [
    { id: 'ventas', icon: <ShoppingCart className="size-5" />, label: 'Ventas' },
    { id: 'inventario', icon: <Package className="size-5" />, label: 'Inventario' },
    { id: 'caja', icon: <Banknote className="size-5" />, label: 'Caja' },
    { id: 'usuarios', icon: <Lock className="size-5" />, label: 'Usuarios' },
    { id: 'reportes', icon: <BarChart3 className="size-5" />, label: 'Reportes' },
  ];

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Sistema POS</h1>
        <p className="text-xs text-gray-500 mt-1">Usuario: admin</p>
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
          />
        ))}
      </nav>

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
      </div>
    </div>
  );
}