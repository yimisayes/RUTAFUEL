import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { Shield, RefreshCw, AlertCircle } from 'lucide-react';

interface TwoFactorVerificationProps {
  onVerificationSuccess: () => void;
  onResendCode?: () => void;
}

export function TwoFactorVerification({ onVerificationSuccess, onResendCode }: TwoFactorVerificationProps) {
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
    // No permitir cambios si está expirado
    if (isExpired) return;
    
    // Solo permitir números
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus siguiente campo si hay valor
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
    
    // Verificar que sea un código de 6 dígitos
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

    // Simular verificación (en producción, llamar al backend)
    setTimeout(() => {
      setIsVerifying(false);
      
      // Por ahora, cualquier código de 6 dígitos es válido para demo
      // En producción, verificar contra el backend
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
    
    // Reset timer y estado expirado
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Tarjeta central */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Icono de seguridad */}
        <div className="flex justify-center mb-6">
          <div className={`${isExpired ? 'bg-red-100' : 'bg-blue-100'} rounded-full p-4`}>
            <Shield className={`w-12 h-12 ${isExpired ? 'text-red-600' : 'text-blue-600'}`} />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Verificación de Seguridad
        </h1>

        {/* Subtítulo */}
        <p className="text-gray-600 text-center mb-8">
          Ingresa el código de 6 dígitos enviado a tu dispositivo
        </p>

        {/* Campos de entrada del código */}
        <div className="flex justify-center gap-3 mb-6">
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
              className={`w-12 h-14 text-center text-2xl font-semibold border-2 rounded-lg focus:outline-none transition-colors ${
                isExpired 
                  ? 'border-red-300 bg-red-50 cursor-not-allowed' 
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              disabled={isVerifying || isExpired}
            />
          ))}
        </div>

        {/* Cronómetro o mensaje de error */}
        <div className="text-center mb-6">
          {isExpired ? (
            <div className="flex items-center justify-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">
                El código ha expirado. Por favor, solicita uno nuevo.
              </p>
            </div>
          ) : (
            <p className={`text-sm ${timeRemaining <= 60 ? 'text-red-500' : 'text-gray-500'}`}>
              El código expira en {formatTime(timeRemaining)}
            </p>
          )}
        </div>

        {/* Botón de verificar o reenviar según estado */}
        {isExpired ? (
          <button
            onClick={handleResend}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md mb-4"
          >
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Solicitar Nuevo Código
            </span>
          </button>
        ) : (
          <>
            <button
              onClick={handleVerify}
              disabled={code.join('').length !== 6 || isVerifying}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mb-4"
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Verificando...
                </span>
              ) : (
                'Verificar y Entrar'
              )}
            </button>

            {/* Enlace de reenvío */}
            <div className="text-center">
              <button
                onClick={handleResend}
                disabled={!canResend}
                className={`text-sm font-medium ${
                  canResend
                    ? 'text-blue-600 hover:text-blue-700 cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed'
                } transition-colors`}
              >
                Reenviar código
              </button>
            </div>
          </>
        )}

        {/* Nota de seguridad */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            🔒 Por seguridad, no compartas este código con nadie.
            <br />
            Si no solicitaste este código, contacta al administrador.
          </p>
        </div>
      </div>
    </div>
  );
}
