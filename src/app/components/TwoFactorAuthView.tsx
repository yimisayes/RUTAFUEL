import { useState, useRef, useEffect } from 'react';
import { Briefcase, Lock, X } from 'lucide-react';

export function TwoFactorAuthView() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[activeIndex]) {
      inputRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex]);

  const handleNumericInput = (num: string) => {
    if (activeIndex < 6) {
      const newCode = [...code];
      newCode[activeIndex] = num;
      setCode(newCode);
      setActiveIndex(Math.min(activeIndex + 1, 5));
    }
  };

  const handleDelete = () => {
    if (activeIndex > 0 || code[0] !== '') {
      const indexToDelete = code[activeIndex] !== '' ? activeIndex : activeIndex - 1;
      const newCode = [...code];
      newCode[indexToDelete] = '';
      setCode(newCode);
      setActiveIndex(indexToDelete);
    }
  };

  const handleClear = () => {
    setCode(['', '', '', '', '', '']);
    setActiveIndex(0);
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      if (value && index < 5) {
        setActiveIndex(index + 1);
      } else {
        setActiveIndex(index);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      setActiveIndex(index - 1);
    }
  };

  const handleValidate = () => {
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      alert(`Código 2FA validado: ${fullCode}`);
    }
  };

  const handleResend = () => {
    alert('Código reenviado a tu dispositivo');
    handleClear();
  };

  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['CLEAR', '0', '←']
  ];

  return (
    <div className="size-full bg-[#F4F7F9] flex items-center justify-center p-8">
      <div className="flex gap-8 items-start max-w-6xl">
        {/* Left Column - Verification Card */}
        <div className="bg-white rounded-2xl shadow-lg p-10 w-[480px]">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="size-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-md">
              <Briefcase className="size-10 text-white" />
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-[#1e3a8a] text-center mb-3">
            Verificación de Seguridad
          </h1>
          <p className="text-gray-600 text-center mb-10 px-4">
            Ingresa el código de 6 dígitos enviado a tu dispositivo
          </p>

          {/* 6 Input Boxes */}
          <div className="flex justify-center gap-3 mb-10">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={() => setActiveIndex(index)}
                className={`size-16 text-center text-2xl font-bold border-2 rounded-xl transition-all ${
                  activeIndex === index
                    ? 'border-[#3F51B5] ring-4 ring-[#3F51B5]/20 shadow-md'
                    : digit
                    ? 'border-[#3F51B5] bg-blue-50'
                    : 'border-[#3F51B5]/30 bg-white'
                } focus:outline-none`}
              />
            ))}
          </div>

          {/* Validate Button */}
          <button
            onClick={handleValidate}
            disabled={code.join('').length !== 6}
            className="w-full py-4 bg-gradient-to-r from-[#9C27B0] to-[#BA68C8] hover:from-[#8E24AA] hover:to-[#AB47BC] disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-semibold text-lg rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Validar y Acceder
          </button>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between">
            <button 
              onClick={handleResend}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              ¿No recibiste el código? <span className="underline">Reenviar</span>
            </button>
            <span className="text-gray-400 text-xs font-medium">v2.1.5</span>
          </div>
        </div>

        {/* Right Column - Numeric Keypad */}
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
                <Lock className="size-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Campo activo:</p>
                <p className="text-sm font-bold text-gray-900">Código 2FA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
