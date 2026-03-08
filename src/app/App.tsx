import { useState } from 'react';
import { POSSidebarWithContext } from './components/POSSidebarWithContext';
import { DashboardView } from './components/DashboardView';
import { VentasViewWithContext } from './components/VentasViewWithContext';
import { InventarioViewWithContext } from './components/InventarioViewWithContext';
import { CajaViewWithContext } from './components/CajaViewWithContext';
import { UsuariosViewWithContext } from './components/UsuariosViewWithContext';
import { ReportesViewWithContext } from './components/ReportesViewWithContext';
import { LoginScreenWithContext } from './components/LoginScreenWithContext';
import { TwoFactorOverlay } from './components/TwoFactorOverlay';
import { POSDashboardComplete } from './components/POSDashboardComplete';
import { FondoInicialModal } from './components/FondoInicialModal';
import { CerrarSesionModal } from './components/CerrarSesionModal';
import { CierreReporteView } from './components/CierreReporteView';
import { POSProvider, usePOS } from './context/POSContext';

function AppContent() {
  const { 
    currentUser, 
    setCurrentUser, 
    setFondoInicial, 
    addTransaction,
    cajaRequiereApertura,
    setCajaRequiereApertura,
    efectivoActual,
    transactions,
    fondoInicial,
    createCierreReport,
    clearCurrentTransactions,
    reopenCaja
  } = usePOS();
  
  const [activeSection, setActiveSection] = useState('dashboard');
  const [show2FAOverlay, setShow2FAOverlay] = useState(false);
  const [showPOSMainLayout, setShowPOSMainLayout] = useState(false);
  const [showAperturaModal, setShowAperturaModal] = useState(false);
  const [showCerrarSesionModal, setShowCerrarSesionModal] = useState(false);
  const [showCierreReporte, setShowCierreReporte] = useState(false);

  const handleLoginSuccess = () => {
    // Mostrar overlay de verificación 2FA después del login exitoso
    setShow2FAOverlay(true);
  };

  const handle2FAOverlaySuccess = () => {
    // Después de verificar 2FA, ocultar overlay y mostrar dashboard completo del POS
    setShow2FAOverlay(false);
    setShowPOSMainLayout(true);
  };

  const handleResendCode = () => {
    // En producción, esto llamaría al backend para reenviar el código
    console.log('Reenviando código de verificación...');
  };

  const handlePOSMainLayoutLogout = () => {
    // Cerrar sesión desde el dashboard completo
    setShowPOSMainLayout(false);
    setCurrentUser(null);
    setActiveSection('dashboard');
  };

  const handleNavigateFromPOS = (section: string) => {
    // Navegar a otras secciones desde el dashboard completo
    setShowPOSMainLayout(false);
    setActiveSection(section);
  };

  const handleAperturaConfirm = (amount: number) => {
    setFondoInicial(amount);
    
    // Add apertura transaction
    addTransaction({
      type: 'entrada',
      amount: amount,
      description: 'Apertura de caja - Fondo inicial',
      user: currentUser?.name || 'Usuario'
    });

    // Marcar que la caja ya no requiere apertura
    setCajaRequiereApertura(false);
    
    // Reabrir caja
    reopenCaja();
    
    // Cerrar modal
    setShowAperturaModal(false);
    
    // Redirigir a ventas
    setActiveSection('ventas');
  };

  const handleLogoutClick = () => {
    // Mostrar modal de confirmación
    setShowCerrarSesionModal(true);
  };

  const handleSoloCerrarSesion = () => {
    // OPCIÓN A: Solo cerrar sesión, mantener caja abierta
    // No hacer nada con la caja, solo cerrar sesión
    setCajaRequiereApertura(false); // La caja sigue abierta
    setCurrentUser(null);
    setShowCerrarSesionModal(false);
    setActiveSection('dashboard');
  };

  const handleCerrarCajaYSesion = () => {
    // OPCIÓN B: Cerrar caja completa y sesión
    // Mostrar reporte de cierre
    setShowCerrarSesionModal(false);
    setShowCierreReporte(true);
  };

  const handleFinalizarCierre = () => {
    // Crear el reporte
    createCierreReport(fondoInicial);
    
    // Limpiar transacciones
    clearCurrentTransactions();
    
    // Resetear fondo inicial
    setFondoInicial(0);
    
    // Marcar que la caja requiere apertura
    setCajaRequiereApertura(true);
    
    // Cerrar sesión
    setCurrentUser(null);
    setShowCierreReporte(false);
    setActiveSection('dashboard');
  };

  // If not authenticated, show login screen
  if (!currentUser) {
    return <LoginScreenWithContext onLoginSuccess={handleLoginSuccess} />;
  }

  // Show POS Dashboard Complete after 2FA verification
  if (showPOSMainLayout) {
    return (
      <POSDashboardComplete
        onNavigate={handleNavigateFromPOS}
        onLogout={handlePOSMainLayoutLogout}
      />
    );
  }

  // Show apertura modal after 2FA verification if needed
  if (showAperturaModal) {
    return (
      <FondoInicialModal
        userName={currentUser.name}
        onConfirm={handleAperturaConfirm}
      />
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView onNavigate={setActiveSection} />;
      case 'ventas':
        return <VentasViewWithContext />;
      case 'inventario':
        return <InventarioViewWithContext />;
      case 'caja':
        return <CajaViewWithContext />;
      case 'usuarios':
        return <UsuariosViewWithContext />;
      case 'reportes':
        return <ReportesViewWithContext />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Layout Principal del POS */}
      <div className={`size-full flex bg-gray-50 ${show2FAOverlay ? 'blur-sm pointer-events-none' : ''}`}>
        {/* Sidebar */}
        <POSSidebarWithContext 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          onLogout={handleLogoutClick}
        />

        {/* Main Content Area */}
        <main className="flex-1 bg-white overflow-hidden">
          {renderContent()}
        </main>
      </div>

      {/* Overlay de Verificación 2FA */}
      {show2FAOverlay && (
        <TwoFactorOverlay
          onVerificationSuccess={handle2FAOverlaySuccess}
          onResendCode={handleResendCode}
        />
      )}

      {/* Modal de Cerrar Sesión */}
      {showCerrarSesionModal && (
        <CerrarSesionModal
          userName={currentUser.name}
          efectivoActual={efectivoActual}
          onSoloCerrarSesion={handleSoloCerrarSesion}
          onCerrarCajaYSesion={handleCerrarCajaYSesion}
          onCancel={() => setShowCerrarSesionModal(false)}
        />
      )}

      {/* Reporte de Cierre */}
      {showCierreReporte && (
        <CierreReporteView
          reportId={`CZ-${Date.now().toString().slice(-8)}`}
          fondoInicial={fondoInicial}
          transactions={transactions}
          onClose={() => {
            setShowCierreReporte(false);
            setShowCerrarSesionModal(true);
          }}
          onConfirmClose={handleFinalizarCierre}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <POSProvider>
      <AppContent />
    </POSProvider>
  );
}