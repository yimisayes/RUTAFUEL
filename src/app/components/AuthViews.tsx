import { useState } from 'react';
import { Shield, Lock, Mail, User } from 'lucide-react';

interface NumericKeypadProps {
  onNumberClick: (num: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

function NumericKeypad({ onNumberClick, onDelete, onClear }: NumericKeypadProps) {
  const buttons = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['C', '0', '←']
  ];

  const handleClick = (value: string) => {
    if (value === '←') {
      onDelete();
    } else if (value === 'C') {
      onClear();
    } else {
      onNumberClick(value);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {buttons.flat().map((btn, index) => (
        <button
          key={index}
          onClick={() => handleClick(btn)}
          className={`h-16 rounded-lg font-semibold text-xl transition-all ${
            btn === 'C' || btn === '←'
              ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              : 'bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-900'
          }`}
        >
          {btn}
        </button>
      ))}
    </div>
  );
}

export function LoginView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleNumericInput = (num: string) => {
    setPassword(password + num);
  };

  const handleDelete = () => {
    setPassword(password.slice(0, -1));
  };

  const handleClear = () => {
    setPassword('');
  };

  const handleLogin = () => {
    alert(`Iniciando sesión como: ${username}`);
  };

  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="flex gap-8 items-start">
        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-10 w-[420px]">
          <div className="flex justify-center mb-6">
            <div className="size-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Lock className="size-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Ingresa tus credenciales para acceder al sistema
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="nombre.usuario"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña (PIN)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors mb-4"
          >
            Iniciar Sesión
          </button>

          <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Numeric Keypad */}
        <div className="bg-white rounded-2xl shadow-xl p-6 w-[280px]">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">
            Teclado Numérico
          </h3>
          <NumericKeypad
            onNumberClick={handleNumericInput}
            onDelete={handleDelete}
            onClear={handleClear}
          />
        </div>
      </div>
    </div>
  );
}

export function VerificationView() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNumericInput = (num: string) => {
    if (activeIndex < 6) {
      const newCode = [...code];
      newCode[activeIndex] = num;
      setCode(newCode);
      setActiveIndex(Math.min(activeIndex + 1, 5));
    }
  };

  const handleDelete = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      const newCode = [...code];
      newCode[newIndex] = '';
      setCode(newCode);
      setActiveIndex(newIndex);
    } else if (code[0] !== '') {
      const newCode = [...code];
      newCode[0] = '';
      setCode(newCode);
    }
  };

  const handleClear = () => {
    setCode(['', '', '', '', '', '']);
    setActiveIndex(0);
  };

  const handleValidate = () => {
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      alert(`Código ingresado: ${fullCode}`);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      if (value && index < 5) {
        setActiveIndex(index + 1);
      }
    }
  };

  const handleInputFocus = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="flex gap-8 items-start">
        {/* Verification Form */}
        <div className="bg-white rounded-2xl shadow-xl p-10 w-[520px]">
          <div className="flex justify-center mb-6">
            <div className="size-20 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="size-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Verificación de Seguridad
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Ingresa el código de 6 dígitos enviado a tu correo
          </p>

          {/* Email Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-center gap-3">
            <Mail className="size-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Código enviado a:</p>
              <p className="text-sm text-gray-600">usuario@empresa.com</p>
            </div>
          </div>

          {/* Code Input Boxes */}
          <div className="flex justify-center gap-3 mb-8">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onFocus={() => handleInputFocus(index)}
                className={`size-14 text-center text-2xl font-bold border-2 rounded-lg transition-all ${
                  activeIndex === index
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : digit
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300'
                } focus:outline-none`}
              />
            ))}
          </div>

          <button
            onClick={handleValidate}
            disabled={code.join('').length !== 6}
            className="w-full py-3 bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors mb-4"
          >
            Validar Acceso
          </button>

          <div className="text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Reenviar código
            </button>
            <span className="text-sm text-gray-500 mx-2">•</span>
            <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
              Volver al inicio
            </button>
          </div>
        </div>

        {/* Numeric Keypad */}
        <div className="bg-white rounded-2xl shadow-xl p-6 w-[280px]">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">
            Teclado Numérico
          </h3>
          <NumericKeypad
            onNumberClick={handleNumericInput}
            onDelete={handleDelete}
            onClear={handleClear}
          />
        </div>
      </div>
    </div>
  );
}
