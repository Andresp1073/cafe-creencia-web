# Cafe Creencia - E-commerce de Café Artesanal

Tienda en línea de café artesanal colombiano con panel administrativo.

## 🚀 Tecnologías

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend**: Prisma ORM, MySQL
- **Testing**: Vitest

## 📋 Requisitos

- Node.js 18+
- MySQL 8.0+
- npm o yarn

## ⚙️ Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Andresp1073/cafe-creencia-web.git
cd cafe-creencia-web
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
# Crear archivo .env
DATABASE_URL="mysql://root:password@localhost:3306/cafe_creencia"
```

4. Ejecutar Prisma:
```bash
npx prisma db push
```

5. Ejecutar seed (datos iniciales):
```bash
npx prisma db seed
# o
npm run db:seed
```

6. Iniciar servidor de desarrollo:
```bash
npm run dev
```

## 🔑 Credenciales Admin

Después de ejecutar el seed, crear usuario administrador:
```bash
npx tsx scripts/create-admin.ts
```

Credenciales por defecto:
- Email: admin@cafecreencia.com
- Password: admin123

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas Next.js
│   ├── admin/             # Panel administrativo
│   ├── api/                # API routes
│   ├── catalogo/           # Catálogo público
│   ├── login/              # Login admin
│   └── productos/           # Detalle producto
├── components/             # Componentes reutilizables
├── lib/                    # Utilidades y funciones
│   ├── actions.ts          # Server Actions
│   ├── auth.ts             # Autenticación
│   ├── dashboard.ts        # Funciones dashboard
│   ├── products.ts        # operaciones productos
│   └── validations.ts     # Validaciones
└── prisma/
    └── schema.prisma       # Schema de base de datos
```

## 🧪 Pruebas

Ejecutar pruebas unitarias:
```bash
npm run test:run
# o
npx vitest run
```

## 📦 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build       # Producción
npm run start       # Iniciar producción
npm run lint       # Linter
npm run db:push    # Sincronizar BD
npm run db:seed   # Seed de datos
npm run test      # Pruebas watch
npm run test:run  # Pruebas una vez
```

## 🌐 Rutas

- **Público**:
  - `/` - Inicio
  - `/catalogo` - Catálogo de productos
  - `/productos/[slug]` - Detalle producto

- **Admin** (requieren login):
  - `/login` - Login administrador
  - `/admin` - Dashboard
  - `/admin/productos` - Gestión productos
  - `/admin/ventas` - Registrar ventas
  - `/admin/ventas/historial` - Historial ventas
  - `/admin/inventario` - Inventario
  - `/admin/inventario/movimiento` - Registrar movimiento

## 🔧 Construcción para Producción

```bash
npm run build
npm start
```

## 📄 Licencia

Privado - Cafe Creencia