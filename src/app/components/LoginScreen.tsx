import { useState } from 'react';
import { Briefcase, User, Lock, X } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeField, setActiveField] = useState<'username' | 'password'>('username');

  const handleNumericInput = (num: string) => {
    if (activeField === 'password') {
      setPassword(password + num);
    }
  };

  const handleDelete = () => {
    if (activeField === 'password') {
      setPassword(password.slice(0, -1));
    } else if (activeField === 'username') {
      setUsername(username.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (activeField === 'password') {
      setPassword('');
    } else if (activeField === 'username') {
      setUsername('');
    }
  };

  const handleLogin = () => {
    setError('');
    
    if (username === 'admin' && password === '1982') {
      onLogin();
    } else {
      setError('Usuario o contraseña incorrectos');
      setPassword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['CLEAR', '0', '←']
  ];

  return (
    <div className="size-full bg-[#F4F7F9] flex items-center justify-center p-8">
      <div className="flex gap-8 items-start">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-10 w-[480px]">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="size-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-md">
              <Briefcase className="size-10 text-white" />
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-[#1e3a8a] text-center mb-3">
            Sistema POS
          </h1>
          <p className="text-gray-600 text-center mb-8 px-4">
            Ingresa tus credenciales para acceder al sistema
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Username Field */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Usuario
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setActiveField('username')}
                onKeyPress={handleKeyPress}
                placeholder="Ingresa tu usuario"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all ${
                  activeField === 'username'
                    ? 'border-[#3F51B5] ring-4 ring-[#3F51B5]/20'
                    : 'border-gray-300'
                } focus:outline-none text-lg`}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña / PIN
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setActiveField('password')}
                onKeyPress={handleKeyPress}
                placeholder="••••"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all ${
                  activeField === 'password'
                    ? 'border-[#3F51B5] ring-4 ring-[#3F51B5]/20'
                    : 'border-gray-300'
                } focus:outline-none text-lg`}
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-bold text-lg rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Iniciar Turno
          </button>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between">
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
            <span className="text-gray-400 text-xs font-medium">v2.1.5</span>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-1">Credenciales de prueba:</p>
            <p className="text-xs text-blue-600">Usuario: <strong>admin</strong> | PIN: <strong>1982</strong></p>
          </div>
        </div>

        {/* Numeric Keypad */}
        <div className="bg-white rounded-2xl shadow-lg p-8 w-[340px]">
          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {numbers.flat().map((btn, index) => {
              const isClear = btn === 'CLEAR';
              const isDelete = btn === '←';
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (isClear) handleClear();
                    else if (isDelete) handleDelete();
                    else handleNumericInput(btn);
                  }}
                  className={`h-16 rounded-xl font-bold text-xl transition-all shadow-sm hover:shadow-md ${
                    isClear
                      ? 'bg-pink-50 hover:bg-pink-100 text-red-500 border-2 border-pink-200'
                      : isDelete
                      ? 'bg-orange-50 hover:bg-orange-100 text-orange-600 border-2 border-orange-200 flex items-center justify-center'
                      : 'bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-blue-400'
                  }`}
                >
                  {isDelete ? <X className="size-6" /> : btn}
                </button>
              );
            })}
          </div>

          {/* Active Field Indicator */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                {activeField === 'username' ? (
                  <User className="size-5 text-white" />
                ) : (
                  <Lock className="size-5 text-white" />
                )}
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Campo activo:</p>
                <p className="text-sm font-bold text-gray-900">
                  {activeField === 'username' ? 'Usuario' : 'Contraseña / PIN'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
