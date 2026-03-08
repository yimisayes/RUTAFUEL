import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { Shield, RefreshCw, AlertCircle, Lock } from 'lucide-react';

interface TwoFactorOverlayProps {
  onVerificationSuccess: () => void;
  onResendCode?: () => void;
}

export function TwoFactorOverlay({ onVerificationSuccess, onResendCode }: TwoFactorOverlayProps) {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [timeRemaining, setTimeRemaining] = useState(599); // 9:59 en segundos
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setCanResend(true);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    if (isExpired) return;
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  // Handle verify
  const handleVerify = async () => {
    const enteredCode = code.join('');
    
    if (enteredCode.length !== 6) {
      alert('Por favor ingresa el código completo de 6 dígitos');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      
      if (enteredCode.length === 6) {
        onVerificationSuccess();
      } else {
        alert('Código incorrecto. Intenta nuevamente.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }, 1500);
  };

  // Handle resend
  const handleResend = () => {
    if (!canResend) return;
    
    setTimeRemaining(599);
    setCanResend(false);
    setIsExpired(false);
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    
    if (onResendCode) {
      onResendCode();
    }
  };

  // Auto-focus primer campo al montar
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop con blur */}
      <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm"></div>

      {/* Tarjeta de Verificación */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border-2 border-white/30">
              <Shield className={`w-8 h-8 ${isExpired ? 'text-red-200' : 'text-white'}`} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-1">
            Verificación Requerida
          </h2>
          <p className="text-blue-100 text-center text-sm">
            Autenticación de Dos Factores
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {/* Instrucción */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-gray-500" />
              <p className="text-sm font-medium text-gray-700">
                Código de Seguridad
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Ingresa el código de 6 dígitos enviado a tu dispositivo
            </p>
          </div>

          {/* Campos de entrada del código */}
          <div className="flex justify-center gap-2 mb-5">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`w-11 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none transition-all ${
                  isExpired 
                    ? 'border-red-300 bg-red-50 cursor-not-allowed text-red-400' 
                    : digit
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:bg-blue-50'
                }`}
                disabled={isVerifying || isExpired}
              />
            ))}
          </div>

          {/* Cronómetro o mensaje de error */}
          <div className="mb-6">
            {isExpired ? (
              <div className="flex items-center justify-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm font-medium text-red-700">
                  El código ha expirado. Por favor, solicita uno nuevo.
                </p>
              </div>
            ) : (
              <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${
                timeRemaining <= 60 
                  ? 'bg-orange-50 border-orange-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="relative">
                  <div className={`w-2 h-2 rounded-full ${
                    timeRemaining <= 60 ? 'bg-orange-500' : 'bg-green-500'
                  } ${timeRemaining > 60 ? 'animate-pulse' : 'animate-ping'}`}></div>
                </div>
                <p className={`text-sm font-semibold ${
                  timeRemaining <= 60 ? 'text-orange-700' : 'text-gray-700'
                }`}>
                  El código expira en <span className="font-mono">{formatTime(timeRemaining)}</span>
                </p>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          {isExpired ? (
            <button
              onClick={handleResend}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Solicitar Nuevo Código
            </button>
          ) : (
            <>
              <button
                onClick={handleVerify}
                disabled={code.join('').length !== 6 || isVerifying}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg mb-3"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Verificando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Shield className="w-5 h-5" />
                    Verificar y Continuar
                  </span>
                )}
              </button>

              {/* Enlace de reenvío */}
              <div className="text-center">
                <button
                  onClick={handleResend}
                  disabled={!canResend}
                  className={`text-sm font-medium transition-colors ${
                    canResend
                      ? 'text-blue-600 hover:text-blue-700 cursor-pointer'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  ¿No recibiste el código? Reenviar
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <Shield className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-gray-700">Seguridad:</strong> Este código es válido por 10 minutos. 
              No lo compartas con nadie. Si no solicitaste este código, contacta al administrador inmediatamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
