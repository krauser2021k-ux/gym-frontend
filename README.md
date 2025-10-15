# GymPro - Sistema de Gestión de Alumnos de Gimnasio

Sistema completo de gestión de alumnos para gimnasios con enfoque en rutinas semanales basadas en bloques y ejercicios.

## Características - Etapa 3 (Última versión)

### Dashboard Avanzado (Trainer/Admin) ⭐ NUEVO
- 4 KPIs principales con iconos diseñados
- Gráfico de barras: Rutinas creadas por mes (Chart.js)
- Gráfico de dona: Distribución de ejercicios por tipo
- Gráfico de línea: Asistencia promedio semanal
- Filtros por gimnasio y rango de fechas
- Totalmente responsive

### Seguimiento de Progreso (Alumno) ⭐ NUEVO
- Evolución histórica de peso
- Progreso de fuerza en ejercicios clave
- Asistencia semanal con gráficos
- Metas activas con progreso visual
- 3 tipos de metas: peso, fuerza, asistencia

### Reportes Exportables (Trainer/Admin) ⭐ NUEVO
- Exportación a CSV y PDF (jsPDF + file-saver)
- Reportes: Alumnos, Rutinas, Ejercicios
- Generación 100% frontend
- Feedback visual de éxito

### Personalización de UI (Todos) ⭐ NUEVO
- Selector de tema: Claro/Oscuro
- 5 opciones de color primario
- Toggle de animaciones
- Persistencia en LocalStorage

### Servicios Nuevos
- LocalStorageService: Persistencia de preferencias
- NotificationsService: Notificaciones en tiempo real con RxJS

## Características - Fase 2

### Dashboard (Trainer/Admin)
- Métricas en tiempo real: alumnos activos, rutinas creadas, ejercicios totales, ingresos mensuales
- Gráficos interactivos de crecimiento de alumnos
- Ejercicios más utilizados con estadísticas
- Ingresos por mes con visualización detallada
- Distribución de suscripciones por paquete
- Tasa de completación y promedio de sesiones semanales

### Gestión de Bloques Preestablecidos (Trainer)
- CRUD completo de bloques de ejercicios reutilizables
- Duplicación de bloques con un click
- Organización de ejercicios dentro de cada bloque
- Vista detallada con cantidad de ejercicios y series

### Gestión de Ejercicios (Trainer)
- CRUD completo con validaciones
- Campos: nombre, categoría, dificultad, grupos musculares, equipamiento
- Integración con videos de Google Drive
- Previsualización de miniaturas
- Filtros por categoría y dificultad

### Sistema de Comentarios/Feedback
- Comentarios por ejercicio para alumnos
- Respuestas del entrenador (conversación)
- Historial completo de feedback
- Marca de ejercicios completados

### Visor de Rutinas Mejorado (Alumno)
- Vista semanal con selector de días
- Bloques expandibles con todos los detalles
- Marca de progreso por ejercicio
- Integración de comentarios inline
- Días de descanso claramente identificados

### Módulo de Pagos (Alumno)
- 3 paquetes disponibles: Básico, Premium, Elite
- Checkout simulado con MercadoPago
- Historial completo de pagos
- Estados: aprobado, pendiente, rechazado
- Precios en ARS con formato local

### Perfil de Usuario Mejorado
- Edición completa de datos personales
- Campos: nombre, apellido, teléfono, fecha de nacimiento
- Información física: peso, altura
- Notas médicas y observaciones personalizadas
- Guardado mediante API mock (PUT /me)

### Características Generales
- Modo oscuro/claro persistente
- Diseño completamente responsive
- Navegación contextual por rol (Admin/Trainer/Student)
- Animaciones suaves y transiciones elegantes
- Feedback visual inmediato en todas las acciones

## Tecnologías

- **Angular 20** - Framework principal
- **TailwindCSS** - Estilos y diseño responsive
- **PrimeNG** - Componentes UI
- **Keycloak.js** - Autenticación OIDC
- **RxJS** - Manejo de datos asíncronos
- **Signals** - Estado local

## Instalación

```bash
npm install
```

## Ejecutar en modo desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## Compilar para producción

```bash
npm run build
```

## Configuración

### Modo Mock (por defecto)

El proyecto viene configurado para usar datos simulados. Puedes cambiar esto en:

- `src/environments/environment.ts` - configuración real
- `src/environments/environment.mock.ts` - configuración mock (activa por defecto)

### Keycloak

Para usar autenticación real con Keycloak, configura las siguientes variables en `environment.ts`:

```typescript
keycloak: {
  url: 'https://tu-keycloak.com/',
  realm: 'tu-realm',
  clientId: 'tu-client-id'
}
```

### MercadoPago

Para integración real con MercadoPago, agrega tu clave pública en `environment.ts`:

```typescript
mercadoPago: {
  publicKey: 'TU-PUBLIC-KEY'
}
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Servicios principales
│   │   ├── api.service.ts
│   │   ├── keycloak.service.ts
│   │   ├── mock-server.interceptor.ts
│   │   └── auth.guard.ts
│   ├── features/                # Funcionalidades por módulo
│   │   ├── students/           # Gestión de alumnos
│   │   ├── exercises/          # Biblioteca de ejercicios
│   │   ├── routines/           # Rutinas y constructor
│   │   ├── payments/           # Pagos (mock)
│   │   └── gyms/               # Gimnasios
│   ├── shared/
│   │   ├── models/             # Modelos de datos
│   │   ├── pipes/
│   │   ├── validators/
│   │   └── ui/                 # Componentes UI reutilizables
│   ├── app-shell.component.ts  # Layout principal
│   └── app.routes.ts           # Configuración de rutas
├── mocks/                       # Datos mock JSON
├── environments/                # Configuración de entornos
└── global_styles.css           # Estilos globales
```

## Roles de Usuario

### Administrador
- Acceso completo a todas las funcionalidades
- Gestión de usuarios, gimnasios y reportes

### Trainer (Entrenador)
- CRUD de ejercicios
- Constructor de rutinas semanales
- Asignación de rutinas a alumnos
- Gestión de gimnasios

### Alumno (Student)
- Ver rutinas semanales asignadas
- Reproducir videos de ejercicios
- Marcar ejercicios como completados
- Agregar comentarios por ejercicio

## Datos Mock Incluidos

- 1 entrenador con 2 gimnasios
- 4 alumnos con datos completos
- 10 ejercicios diversos
- 4 rutinas (2 por defecto + 2 personalizadas)

## Características de Diseño

- Paleta de colores verde (primary) con modo oscuro
- Tipografía moderna y legible
- Animaciones suaves en transiciones
- Diseño responsive (móvil, tablet, desktop)
- Componentes con estados hover y feedback visual
- Accesibilidad y contraste adecuado

## Próximas Funcionalidades

- Formularios de creación/edición de alumnos y ejercicios
- Constructor visual de rutinas con drag & drop
- Sistema de notificaciones
- Reportes y estadísticas
- Integración real con backend
- Exportación de rutinas a PDF
- Sistema de pagos completo

## Soporte

Para más información o soporte, contacta al equipo de desarrollo.
