# 🗄️ Configuración de Supabase para Sistema POS

## 📋 Instrucciones de Configuración

### Paso 1: Crear las tablas en Supabase

Ve a tu proyecto de Supabase → SQL Editor y ejecuta los siguientes comandos:

```sql
-- 1. Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  sku TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Transacciones
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('entrada', 'salida', 'venta')),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user TEXT NOT NULL,
  items JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Estado de Caja
CREATE TABLE IF NOT EXISTS caja_status (
  id INTEGER PRIMARY KEY DEFAULT 1,
  is_open BOOLEAN NOT NULL DEFAULT FALSE,
  fondo_inicial DECIMAL(10, 2) NOT NULL DEFAULT 0,
  efectivo_actual DECIMAL(10, 2) NOT NULL DEFAULT 0,
  opened_by TEXT,
  opened_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- 4. Tabla de Configuración (IVA, etc.)
CREATE TABLE IF NOT EXISTS config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'vendedor')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabla de Reportes de Cierre
CREATE TABLE IF NOT EXISTS cierre_reports (
  id TEXT PRIMARY KEY,
  fondo_inicial DECIMAL(10, 2) NOT NULL,
  transactions JSONB NOT NULL,
  closed_at TIMESTAMPTZ NOT NULL,
  closed_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Paso 2: Insertar datos iniciales

```sql
-- Insertar productos iniciales
INSERT INTO products (name, price, stock, category, sku) VALUES
  ('Café Americano', 3.50, 45, 'bebidas', 'BEB-001'),
  ('Cappuccino', 4.50, 38, 'bebidas', 'BEB-002'),
  ('Té Verde', 3.00, 52, 'bebidas', 'BEB-003'),
  ('Jugo Natural', 5.00, 28, 'bebidas', 'BEB-004'),
  ('Sandwich Club', 8.50, 15, 'comida', 'COM-001'),
  ('Ensalada César', 9.00, 12, 'comida', 'COM-002'),
  ('Pasta Alfredo', 12.00, 8, 'comida', 'COM-003'),
  ('Croissant', 3.50, 24, 'snacks', 'SNK-001'),
  ('Galletas', 2.50, 60, 'snacks', 'SNK-002'),
  ('Muffin', 3.00, 30, 'snacks', 'SNK-003');

-- Insertar configuración inicial (IVA 13% para El Salvador)
INSERT INTO config (key, value, description) VALUES
  ('iva_rate', '0.13', 'Tasa de IVA de El Salvador (13%)'),
  ('currency', 'USD', 'Moneda utilizada en El Salvador'),
  ('country', 'SV', 'Código de país: El Salvador'),
  ('min_fondo_inicial', '50', 'Fondo inicial mínimo recomendado');

-- Insertar estado inicial de caja
INSERT INTO caja_status (id, is_open, fondo_inicial, efectivo_actual) 
VALUES (1, FALSE, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Insertar usuario administrador por defecto
INSERT INTO users (name, username, password, role, active) VALUES
  ('Administrador', 'admin', '1982', 'admin', TRUE);
```

### Paso 3: Habilitar Row Level Security (RLS)

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE caja_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cierre_reports ENABLE ROW LEVEL SECURITY;

-- Crear políticas públicas para desarrollo (ajusta según tus necesidades de seguridad)
-- ADVERTENCIA: Estas políticas permiten acceso completo. Para producción, implementa autenticación.

CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON products FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON products FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON transactions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON caja_status FOR SELECT USING (true);
CREATE POLICY "Enable update access for all users" ON caja_status FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON config FOR SELECT USING (true);
CREATE POLICY "Enable update access for all users" ON config FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON users FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON cierre_reports FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON cierre_reports FOR INSERT WITH CHECK (true);
```

### Paso 4: Crear índices para optimización

```sql
-- Índices para mejorar el rendimiento
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_user ON transactions(user);
CREATE INDEX idx_config_key ON config(key);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_cierre_reports_closed_at ON cierre_reports(closed_at DESC);
```

### Paso 5: Habilitar Realtime

Ve a **Database → Replication** en tu proyecto de Supabase y habilita Realtime para las siguientes tablas:

- ✅ `products`
- ✅ `transactions`
- ✅ `caja_status`
- ✅ `config`

---

## 🔐 Configuración de Variables de Entorno

**¡Buenas noticias!** Figma Make configura automáticamente las credenciales de Supabase cuando te conectas.

**No necesitas configurar variables de entorno manualmente.** El sistema obtiene automáticamente:
- `projectId` - ID de tu proyecto Supabase
- `publicAnonKey` - Clave pública de autenticación

Estas credenciales se importan desde `/utils/supabase/info` y se usan para construir la URL de conexión:
```typescript
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = publicAnonKey;
```

Si por alguna razón necesitas verificar tus credenciales:

1. Ve a tu proyecto en Supabase
2. Settings → API
3. Verifica:
   - `Project URL` → debe coincidir con `https://${projectId}.supabase.co`
   - `anon/public key` → debe coincidir con `publicAnonKey`

---

## 📊 Estructura de Datos

### Products
```typescript
{
  id: UUID
  name: string
  price: number
  stock: number
  category: string ('bebidas' | 'comida' | 'snacks')
  sku: string (opcional)
  image: string (opcional)
  created_at: timestamp
  updated_at: timestamp
}
```

### Transactions
```typescript
{
  id: UUID
  type: 'entrada' | 'salida' | 'venta'
  amount: number
  description: string
  timestamp: timestamp
  user: string
  items: JSONB (detalles de productos vendidos)
  created_at: timestamp
}
```

### Caja Status
```typescript
{
  id: 1 (siempre 1, registro único)
  is_open: boolean
  fondo_inicial: number
  efectivo_actual: number
  opened_by: string (opcional)
  opened_at: timestamp (opcional)
  updated_at: timestamp
}
```

### Config
```typescript
{
  id: UUID
  key: string (único)
  value: string
  description: string (opcional)
  updated_at: timestamp
}
```

**Configuraciones importantes:**
- `iva_rate`: `"0.13"` (IVA 13% El Salvador)
- `currency`: `"USD"` (Dólar estadounidense)
- `country`: `"SV"` (El Salvador)

---

## 🚀 Ventajas de esta Arquitectura

✅ **Sincronización en Tiempo Real**
- Múltiples cajas/terminales sincronizadas
- Cambios instantáneos en inventario
- Estado de caja compartido

✅ **Persistencia en la Nube**
- Datos seguros en Supabase
- Backup automático
- Recuperación de desastres

✅ **Acceso Remoto**
- Gestión desde cualquier ubicación
- Control centralizado de configuración
- Reportes en tiempo real

✅ **Escalabilidad**
- Soporta múltiples sucursales
- Gestión centralizada de inventario
- Configuración unificada (IVA, precios)

---

## ⚠️ Consideraciones de Seguridad

Para un sistema de producción:

1. **Implementar autenticación real** con Supabase Auth
2. **Ajustar políticas RLS** para restringir acceso según roles
3. **Encriptar contraseñas** (no almacenar en texto plano)
4. **Habilitar 2FA** para usuarios administradores
5. **Configurar backups** regulares
6. **Monitorear accesos** y cambios críticos

---

## 📞 Soporte

Si encuentras problemas:

1. Verifica que todas las tablas estén creadas correctamente
2. Confirma que Realtime esté habilitado
3. Revisa los permisos RLS
4. Chequea la consola del navegador para errores de conexión

---

**Nota:** Este sistema está diseñado como prototipo. Para un sistema POS en producción real, consulta con un desarrollador backend sobre mejores prácticas de seguridad y cumplimiento normativo.