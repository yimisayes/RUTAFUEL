# 🏪 Sistema POS - El Salvador

Sistema de Punto de Venta completo con backend en la nube, sincronización en tiempo real y soporte para múltiples terminales.

## 🌟 Características Principales

### 💰 Gestión de Caja
- ✅ Apertura/Cierre de caja con validación de supervisor
- ✅ Control de fondo inicial
- ✅ Retiros de efectivo con autorización
- ✅ Reportes Z de cierre
- ✅ Estado sincronizado en la nube

### 🛒 Módulo de Ventas
- ✅ IVA 13% (El Salvador)
- ✅ Impresión automática de tickets (80mm)
- ✅ Control de stock en tiempo real
- ✅ Categorización de productos
- ✅ Validación de inventario

### 📦 Inventario
- ✅ Gestión de productos
- ✅ Control de stock bajo
- ✅ Exportación a Excel
- ✅ Sincronización entre terminales

### 👥 Usuarios
- ✅ Roles: Admin / Vendedor
- ✅ Autenticación segura
- ✅ Gestión de permisos

### 📊 Reportes
- ✅ Ventas por período
- ✅ Productos más vendidos
- ✅ Historial de transacciones
- ✅ Exportación a Excel

### ☁️ Backend en la Nube (Supabase)
- ✅ Sincronización en tiempo real
- ✅ Múltiples terminales conectadas
- ✅ Persistencia de datos
- ✅ Acceso remoto
- ✅ Backup automático

---

## 🚀 Configuración Inicial

### Paso 1: Conectar a Supabase

1. **Crea un proyecto en Supabase:**
   - Ve a [supabase.com](https://supabase.com)
   - Crea una cuenta si no tienes una
   - Crea un nuevo proyecto

2. **Configura las tablas:**
   - Abre el archivo `SUPABASE_SETUP.md`
   - Sigue las instrucciones paso a paso
   - Ejecuta los scripts SQL en Supabase SQL Editor

3. **Habilita Realtime:**
   - Ve a Database → Replication
   - Habilita Realtime para:
     - `products`
     - `transactions`
     - `caja_status`
     - `config`

### Paso 2: Configurar Variables de Entorno

Figma Make configura automáticamente las credenciales de Supabase cuando te conectas.

**No necesitas configuración manual.** El sistema obtiene automáticamente:
- `projectId` - ID de tu proyecto Supabase
- `publicAnonKey` - Clave pública de autenticación

Estas credenciales se usan para construir la conexión a tu base de datos en la nube.

Si necesitas verificar la configuración, revisa el archivo `/src/lib/supabase.ts`.

---

## 📱 Uso del Sistema

### Inicio de Sesión

1. **Usuario por defecto:**
   - Usuario: `admin`
   - Contraseña: `1982`

2. **Flujo de inicio:**
   ```
   Login → Fondo Inicial → Ventas
   ```

### Apertura de Caja

1. Ingresa usuario y contraseña
2. Define el fondo inicial (mínimo $50)
3. El sistema:
   - Registra la apertura en la nube
   - Sincroniza el estado con todas las terminales
   - Redirige automáticamente a Ventas

### Realizar Ventas

1. Selecciona productos del inventario
2. Ajusta cantidades si es necesario
3. Click en "Cobrar"
4. El sistema automáticamente:
   - Calcula IVA 13%
   - Actualiza inventario
   - Genera e imprime ticket (80mm)
   - Registra transacción en la nube

### Retiro de Efectivo

1. Click en "Retiro de Efectivo"
2. Ingresa monto con teclado numérico
3. Ingresa nombre del supervisor
4. Ingresa PIN: `1982`
5. El sistema:
   - Valida el PIN
   - Genera comprobante imprimible
   - Registra el retiro

### Cierre de Caja

1. Click en "Cierre de Caja (Z)"
2. Revisa el resumen del turno
3. Confirma el cierre
4. El sistema:
   - Genera reporte Z
   - Permite imprimir comprobante
   - Cierra la caja en la nube

---

## 🔧 Arquitectura Técnica

### Frontend
- **Framework:** React 18 + TypeScript
- **Estilos:** Tailwind CSS v4
- **Estado:** Context API + Custom Hooks
- **Iconos:** Lucide React

### Backend
- **Base de datos:** Supabase (PostgreSQL)
- **Sincronización:** Realtime Subscriptions
- **API:** Supabase Client
- **Autenticación:** Supabase Auth (preparado)

### Estructura de Archivos

```
/src
├── /app
│   ├── /components       # Componentes React
│   │   ├── LoginScreenWithContext.tsx
│   │   ├── FondoInicialModal.tsx
│   │   ├── VentasViewWithContext.tsx
│   │   ├── CajaViewWithContext.tsx
│   │   ├── InventarioViewWithContext.tsx
│   │   ├── RetiroSupervisorModal.tsx
│   │   └── SupabaseStatus.tsx
│   ├── /context          # Context API
│   │   └── POSContext.tsx
│   └── App.tsx
├── /hooks                # Custom Hooks
│   └── useSupabaseSync.ts
├── /lib                  # Utilidades
│   └── supabase.ts
└── /styles               # Estilos globales
    └── theme.css

/SUPABASE_SETUP.md        # Instrucciones de configuración
/.env.example             # Ejemplo de variables de entorno
```

---

## 🗄️ Estructura de Base de Datos

### Tablas Principales

1. **products** - Catálogo de productos
   - Sincronización en tiempo real
   - Control de stock
   - Categorización

2. **transactions** - Registro de movimientos
   - Ventas, entradas, salidas
   - Trazabilidad completa
   - Histórico ilimitado

3. **caja_status** - Estado de caja
   - Un solo registro (singleton)
   - Sincronización en tiempo real
   - Estado compartido entre terminales

4. **config** - Configuración del sistema
   - IVA: 13%
   - Moneda: USD
   - Parámetros personalizables

5. **users** - Usuarios del sistema
   - Roles: admin / vendedor
   - Control de acceso

6. **cierre_reports** - Reportes de cierre
   - Histórico de cierres
   - Datos financieros

---

## 💡 Características Avanzadas

### Sincronización en Tiempo Real

Cuando **Terminal A** vende un producto:
```
Terminal A: Vende 2 Cafés
    ↓
Supabase actualiza stock
    ↓
Terminal B recibe actualización instantánea
    ↓
Stock actualizado en todas las terminales
```

### Estado de Caja Centralizado

```
Terminal A: Abre caja con $500
    ↓
Supabase: is_open = true, fondo_inicial = $500
    ↓
Terminal B: Ve que la caja está abierta
    ↓
Todas las terminales sincronizadas
```

### Configuración Unificada

```
Admin: Cambia IVA de 13% a 15%
    ↓
Supabase actualiza config.iva_rate
    ↓
Todas las terminales aplican nuevo IVA
    ↓
Sin necesidad de reiniciar
```

---

## 📊 Reportes y Exportación

### Exportar Inventario a Excel

1. Ve a módulo "Inventario"
2. Click en "Guardar Inventario"
3. Se descarga Excel con:
   - Lista completa de productos
   - Stock actual
   - Precios
   - Categorías

### Imprimir Tickets

- **Formato:** 80mm (impresoras térmicas)
- **Contenido:**
  - Folio único
  - Fecha y hora
  - Productos con cantidades
  - Subtotal
  - IVA (13%)
  - Total
  - Mensaje de agradecimiento

---

## 🔒 Seguridad

### Advertencias Importantes

⚠️ **Este es un sistema prototipo para demostración.**

Para producción real:

1. **NO almacenar contraseñas en texto plano**
   - Usar hash (bcrypt, argon2)
   
2. **Implementar Supabase Auth**
   - Autenticación real con JWT
   - Gestión de sesiones seguras

3. **Configurar RLS (Row Level Security)**
   - Políticas por rol
   - Restricción de acceso

4. **Habilitar HTTPS**
   - Certificados SSL
   - Conexiones seguras

5. **Auditoría y Logs**
   - Registro de accesos
   - Monitoreo de cambios críticos

6. **Backup Regular**
   - Respaldos automáticos
   - Plan de recuperación

---

## 🌐 Múltiples Terminales / Sucursales

### Configuración para Varias Cajas

```
Sucursal Centro
├── Terminal 1 (Caja Principal)
├── Terminal 2 (Caja Express)
└── Terminal 3 (Backup)

Sucursal Norte
├── Terminal 1
└── Terminal 2

Todas conectadas a la misma base de datos Supabase
```

### Ventajas

✅ Inventario sincronizado en tiempo real
✅ Una venta en cualquier terminal actualiza stock global
✅ Control centralizado de precios
✅ Reportes consolidados
✅ Administración remota

---

## 🛠️ Solución de Problemas

### Error: "Missing Supabase credentials"

**Solución:**
1. Verifica que estés conectado a Supabase
2. Revisa las variables de entorno
3. Recarga la aplicación

### Error: "Failed to fetch from Supabase"

**Solución:**
1. Verifica que las tablas estén creadas
2. Confirma que RLS esté configurado correctamente
3. Revisa la consola del navegador para detalles

### La sincronización no funciona

**Solución:**
1. Verifica que Realtime esté habilitado en Supabase
2. Ve a Database → Replication
3. Habilita las tablas necesarias

### Stock no se actualiza

**Solución:**
1. Verifica la conexión a Supabase
2. Revisa los permisos RLS
3. Chequea la consola para errores

---

## 📞 Soporte y Contacto

Para problemas técnicos:
1. Revisa la consola del navegador (F12)
2. Verifica las instrucciones en `SUPABASE_SETUP.md`
3. Consulta la documentación de Supabase

---

## 📄 Licencia

Este sistema es un prototipo educativo/demostrativo.

**Para uso en producción:**
- Consulta con un desarrollador backend
- Implementa las medidas de seguridad recomendadas
- Cumple con las normativas locales de El Salvador
- Considera un soporte profesional

---

## 🇸🇻 Configuración Específica de El Salvador

✅ **IVA:** 13% (configurado en tabla `config`)
✅ **Moneda:** USD (Dólar estadounidense)
✅ **Formato de fechas:** es-MX (día/mes/año)
✅ **Tickets:** Formato 80mm estándar

---

**Versión:** 2.1.5  
**Última actualización:** 2026  
**Framework:** React + TypeScript + Supabase