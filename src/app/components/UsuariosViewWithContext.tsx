import { useState } from 'react';
import { Plus, Trash2, Shield, User as UserIcon, X, Eye, EyeOff } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export function UsuariosViewWithContext() {
  const { users, addUser, deleteUser, currentUser } = usePOS();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields
  const [newUserName, setNewUserName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'vendedor'>('vendedor');

  const handleCreateUser = () => {
    if (!newUserName || !newUsername || !newPassword) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Check if username already exists
    if (users.some(user => user.username === newUsername)) {
      alert('El nombre de usuario ya existe');
      return;
    }

    addUser({
      name: newUserName,
      username: newUsername,
      password: newPassword,
      role: newRole,
      active: true,
    });

    // Reset form
    setNewUserName('');
    setNewUsername('');
    setNewPassword('');
    setNewRole('vendedor');
    setShowCreateModal(false);
    setShowPassword(false);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    // Prevent deleting current user
    if (currentUser?.id === userId) {
      alert('No puedes eliminar el usuario con el que estás actualmente conectado');
      return;
    }

    // Prevent deleting if only one admin exists
    const adminUsers = users.filter(u => u.role === 'admin');
    const userToDelete = users.find(u => u.id === userId);
    
    if (userToDelete?.role === 'admin' && adminUsers.length === 1) {
      alert('No puedes eliminar el único administrador del sistema');
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${userName}"?`)) {
      deleteUser(userId);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-sm text-gray-600 mt-1">
              Administra los usuarios del sistema y sus permisos
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
          >
            <Plus className="size-5" />
            Crear Usuario
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserIcon className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserIcon className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Vendedores</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'vendedor').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nombre Completo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fecha de Creación
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-full flex items-center justify-center ${
                        user.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                      }`}>
                        {user.role === 'admin' ? (
                          <Shield className={`size-5 text-purple-600`} />
                        ) : (
                          <UserIcon className={`size-5 text-blue-600`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">@{user.username}</p>
                        {currentUser?.id === user.id && (
                          <span className="text-xs text-green-600 font-medium">
                            (Sesión actual)
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{user.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'admin' ? 'Administrador' : 'Vendedor'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{formatDate(user.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      user.active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium text-sm"
                    >
                      <Trash2 className="size-4" />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No hay usuarios registrados
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Crear Nuevo Usuario</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowPassword(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de Usuario *
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value.toLowerCase())}
                  placeholder="Ej: jperez"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se usará para iniciar sesión
                </p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña / PIN *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewRole('vendedor')}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                      newRole === 'vendedor'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <UserIcon className={`size-5 ${newRole === 'vendedor' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="text-left">
                      <p className={`font-medium text-sm ${newRole === 'vendedor' ? 'text-blue-900' : 'text-gray-700'}`}>
                        Vendedor
                      </p>
                      <p className="text-xs text-gray-500">Acceso a ventas</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRole('admin')}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                      newRole === 'admin'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Shield className={`size-5 ${newRole === 'admin' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <div className="text-left">
                      <p className={`font-medium text-sm ${newRole === 'admin' ? 'text-purple-900' : 'text-gray-700'}`}>
                        Admin
                      </p>
                      <p className="text-xs text-gray-500">Acceso total</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowPassword(false);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUser}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                Crear Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
