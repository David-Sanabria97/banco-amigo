# Banco Amigo — Micrositio de Solicitud Digital de Crédito de Libre Destino

Prueba técnica — Desarrollador Frontend Experto · Proceso de selección interno BCS

---

## Índice

1. [Objetivo](#objetivo)
2. [Stack tecnológico](#stack-tecnológico)
3. [Arquitectura](#arquitectura)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Instrucciones de ejecución](#instrucciones-de-ejecución)
6. [Contratos API](#contratos-api)
7. [Pruebas automatizadas](#pruebas-automatizadas)
8. [Decisiones de arquitectura](#decisiones-de-arquitectura)
9. [Historias técnicas](#historias-técnicas)
10. [Patrones de diseño aplicados](#patrones-de-diseño-aplicados)
11. [Uso de herramientas de IA](#uso-de-herramientas-de-ia)
12. [Limitaciones conocidas y deuda técnica](#limitaciones-conocidas-y-deuda-técnica)

---

## Objetivo

Implementar la capa frontend de un micrositio de originación digital de crédito de libre destino, usable tanto en canal autogestionado como asistido, con flujo completo desde el inicio de la solicitud hasta la confirmación final, trazabilidad de eventos y manejo claro de errores.

Se implementó también el **PLUS del backend** con NestJS y TypeScript aplicando Clean Architecture.

---

## Stack tecnológico

### Frontend

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 + TypeScript |
| Estilos | SCSS Modules |
| Estado global | Redux Toolkit |
| Estado servidor | TanStack Query v5 |
| Formularios | React Hook Form + Zod |
| HTTP | Axios con interceptores |
| Pruebas | Jest + React Testing Library |

### Backend

| Capa | Tecnología |
|---|---|
| Framework | NestJS + TypeScript |
| Validación | class-validator + class-transformer |
| Documentación | Swagger (@nestjs/swagger) |
| Almacenamiento | In-memory (Map) — sin base de datos |
| Pruebas | Jest + ts-jest |

---

## Arquitectura

### Frontend — Capas

```
presentation/     → components/ + app/ (UI — Atomic Design)
application/      → hooks/ (casos de uso de UI)
infrastructure/   → services/ + store/ (datos externos)
shared/           → utils/ + constants/ + enums/ + types/
```

### Backend — Clean Architecture

```
domain/           → entities/ + repositories/ (interfaces abstractas)
application/      → use-cases/ (lógica de negocio pura)
infrastructure/   → repositories/ (implementación in-memory)
presentation/     → controllers/ + dto/ (HTTP)
```

La regla de dependencias se respeta en ambas capas: **las dependencias solo apuntan hacia adentro**. El dominio no conoce NestJS, React ni Axios.

### Atomic Design (Frontend)

```
atoms/        → Button, Input, Select, Label, Badge, Spinner
molecules/    → FormField, ChannelCard, StepIndicator, DraftBanner,
                ConsentCheckbox, AbandonModal
organisms/    → NavBar, HeroSection, BasicDataForm, FinancialDataForm,
                OfferSimulation, ApplicationSummary, EventTimeline,
                ApplicationActions, StatsBar, HowItWorksSection,
                RequirementsSection, CtaBanner, MetricsBar
templates/    → LandingTemplate, FlujoSolicitudTemplate, withPageLayout (HOC)
pages/        → app/ (Next.js App Router)
```

---

## Estructura del proyecto

```
occidente/
├── web/                              ← Frontend Next.js
│   └── src/
│       ├── app/
│       │   ├── page.tsx              ← Landing
│       │   ├── solicitudes/
│       │   │   ├── page.tsx          ← Listado con filtros
│       │   │   ├── nueva/page.tsx    ← Flujo multi-paso (4 pasos)
│       │   │   └── [id]/page.tsx     ← Detalle + línea de tiempo
│       │   ├── loading.tsx
│       │   ├── error.tsx
│       │   └── not-found.tsx
│       ├── components/
│       │   ├── atoms/
│       │   ├── molecules/
│       │   ├── organisms/
│       │   └── templates/
│       ├── hooks/
│       ├── services/
│       ├── store/
│       ├── enums/
│       ├── types/
│       ├── constants/
│       └── utils/
│
└── api/                              ← Backend NestJS
    └── src/
        ├── domain/
        │   ├── entities/
        │   ├── enums/
        │   └── repositories/
        ├── application/
        │   └── use-cases/
        ├── infrastructure/
        │   └── repositories/
        └── presentation/
            ├── controllers/
            └── dto/
```

---

## Instrucciones de ejecución

### Requisitos

- Node.js 20+
- pnpm 10+

### Frontend

```bash
cd web
pnpm install
pnpm dev
# http://localhost:3000
```

### Backend

```bash
cd api
pnpm install
pnpm start:dev
# http://localhost:3001
# Swagger: http://localhost:3001/api/docs
```

### Variables de entorno

**`web/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**`api/.env`**
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Docker Compose

```bash
docker-compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
```

---

## Contratos API

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/applications` | Crear solicitud |
| `GET` | `/applications` | Listar con filtros (`?status=&channel=&search=`) |
| `GET` | `/applications/:id` | Obtener detalle |
| `PATCH` | `/applications/:id` | Actualizar datos |
| `POST` | `/applications/:id/simulate-offer` | Simulación de oferta |
| `POST` | `/applications/:id/finalize` | Finalizar solicitud |
| `POST` | `/applications/:id/abandon` | Abandonar con motivo |
| `GET` | `/applications/:id/events` | Línea de tiempo de eventos |

### Payloads

**POST /applications**
```json
{
  "channel": "SELF_SERVICE",
  "documentType": "CC",
  "documentNumber": "1234567890",
  "fullName": "Carlos Andrés Ruiz",
  "phone": "3001234567",
  "email": "carlos@email.com",
  "city": "bogota"
}
```

**PATCH /applications/:id**
```json
{
  "monthlyIncome": 3500000,
  "monthlyExpenses": 1200000,
  "requestedAmount": 18000000,
  "termMonths": 36,
  "loanPurpose": "viaje",
  "dataConsentAccepted": true
}
```

**POST /applications/:id/simulate-offer**

Retorna uno de tres escenarios:

```json
// Exitoso
{ "viable": true, "monthlyPayment": 650000, "monthlyRate": 0.018, "totalAmount": 23400000 }

// No viable
{ "viable": false, "message": "La capacidad de pago no es suficiente para el monto y plazo solicitados." }

// Error técnico
// HTTP 503 → { "error": "SERVICE_UNAVAILABLE", "message": "Error técnico temporal" }
```

**POST /applications/:id/abandon**
```json
{ "reason": "El cliente no continuó el proceso" }
```

**GET /applications/:id/events**
```json
[
  {
    "id": "uuid",
    "applicationId": "uuid",
    "type": "CREATED",
    "description": "Solicitud creada",
    "metadata": { "channel": "SELF_SERVICE" },
    "createdAt": "2024-04-22T10:14:03.000Z"
  }
]
```

### Tipos de eventos registrados

| EventType | Cuándo ocurre |
|---|---|
| `CREATED` | Al crear la solicitud |
| `UPDATED` | Al actualizar datos |
| `SIMULATION_SUCCESS` | Simulación exitosa |
| `SIMULATION_FAILED` | Simulación no viable |
| `SIMULATION_ERROR` | Error técnico en simulación |
| `FINALIZED` | Al finalizar la solicitud |
| `ABANDONED` | Al abandonar con motivo |

---

## Pruebas automatizadas

### Ejecutar pruebas

**Frontend:**
```bash
cd web
pnpm test
pnpm test:coverage
pnpm test:watch
```

**Backend:**
```bash
cd api
pnpm test
pnpm test:coverage
```

### Cobertura

| Proyecto | Suite | Pruebas | Cobertura |
|---|---|---|---|
| Frontend | Button | 5 | 100% |
| Frontend | usePaymentCapacity | 6 | 100% |
| Frontend | solicitudesService | 8 | 100% |
| Frontend | BasicDataForm | 5 | 89% |
| Backend | CreateApplicationUseCase | 4 | 100% |
| Backend | SimulateOfferUseCase | 7 | 100% |
| Backend | FinalizeApplicationUseCase | 6 | 100% |
| **Total** | — | **41 pruebas** | — |

---

## Decisiones de arquitectura

### Server vs Client Components

Se aplicó la regla: `'use client'` solo cuando el componente necesita hooks de React, eventos del browser o estado interactivo.

| Server Components | Client Components |
|---|---|
| LandingTemplate | NavBar |
| HeroSection | BasicDataForm |
| StatsBar | FinancialDataForm |
| HowItWorksSection | OfferSimulation |
| RequirementsSection | ApplicationSummary |
| MetricsBar | ApplicationActions |

### Redux Toolkit vs TanStack Query

Se usan con responsabilidades claramente separadas:

- **Redux Toolkit** — estado de UI: flujo multi-paso, draftId, step actual, formData temporal
- **TanStack Query** — estado del servidor: listado, detalle, caché automático de 30 segundos, refetch en foco

### In-memory store en el backend

Se implementó el patrón Repository con clases abstractas como contratos. Si mañana se necesita PostgreSQL, solo se crea `PostgresApplicationRepository` que extiende `IApplicationRepository` sin tocar casos de uso ni controlador. Esto cumple el principio Open/Closed de SOLID.

### Fórmula de amortización francesa

La cuota mensual se calcula con la fórmula estándar de crédito:

```
cuota = monto × (tasa × (1 + tasa)^plazo) / ((1 + tasa)^plazo - 1)
```

Tasa mensual vencida configurada como constante: `MONTHLY_RATE = 0.018`

### Trazabilidad end-to-end

Cada request HTTP incluye un `x-correlation-id` generado en el interceptor de Axios. El backend registra eventos de negocio con tipo, descripción, timestamp y metadata. El frontend muestra la línea de tiempo al usuario y expone el ID de correlación en errores técnicos para soporte.

### HOC withPageLayout

Se implementó un Higher Order Component que centraliza el manejo de estados loading/error en todas las páginas, evitando duplicación y garantizando consistencia visual entre rutas.

---

## Historias técnicas

### Historia 1 — Rendering con Next.js App Router

**Como** desarrollador frontend,
**quiero** que la landing page use Server Components y el flujo transaccional use Client Components,
**para** optimizar el tiempo de carga inicial y mantener la interactividad donde se necesita.

**Criterios de aceptación:**
- La landing renderiza en el servidor sin JavaScript del cliente innecesario
- Los formularios multi-paso usan `'use client'` explícito
- Los componentes puramente visuales no tienen `'use client'`
- `loading.tsx` y `error.tsx` manejan estados de carga y error por ruta

**Consideraciones de seguridad:**
- Los Server Components no exponen variables de entorno sin prefijo `NEXT_PUBLIC_`
- No se pasa información sensible como props entre Server y Client Components
- El `layout.tsx` no incluye datos de sesión ni tokens

---

### Historia 2 — Formularios multi-paso con validación y coherencia de datos

**Como** cliente del banco,
**quiero** que el formulario valide mis datos en tiempo real y me indique errores claros antes de continuar,
**para** completar mi solicitud correctamente sin confusión ni rechazos posteriores.

**Criterios de aceptación:**
- Todos los campos requeridos muestran error al intentar continuar sin llenarlos
- El correo valida formato RFC antes de enviar
- El celular acepta exactamente 10 dígitos numéricos
- Los egresos muestran advertencia cuando superan el 80% de los ingresos
- La capacidad de pago se calcula en tiempo real
- Los datos del paso 1 se precargan al retomar una solicitud en borrador
- El formulario usa `noValidate` para controlar validación desde Zod

**Consideraciones de seguridad:**
- Los campos numéricos sanitizan input no numérico via `valueAsNumber`
- Zod aplica validación estricta — evita inyección de datos malformados
- El consentimiento de tratamiento de datos es validación obligatoria
- Los datos financieros nunca se persisten en localStorage

---

### Historia 3 — Integración frontend-backend con manejo de errores y trazabilidad

**Como** sistema bancario,
**quiero** que el frontend maneje correctamente los tres escenarios de respuesta de la simulación y registre todos los eventos relevantes,
**para** dar visibilidad del estado al usuario y proveer información de soporte ante incidentes.

**Criterios de aceptación:**
- Respuesta exitosa muestra cuota, tasa y total con amortización francesa
- Respuesta no viable muestra mensaje funcional con opción de ajustar datos
- Error técnico muestra ID de correlación y opción de reintentar
- Cada request incluye `x-correlation-id` en los headers
- Cada transición de estado registra un evento con metadata en el backend
- La línea de tiempo es visible en el detalle de la solicitud
- El frontend diferencia HTTP 200 (no viable) de HTTP 503 (error técnico)

**Consideraciones de seguridad:**
- Los errores de API no exponen stack traces al usuario final
- El ID de correlación permite rastrear el error en logs sin revelar información interna
- Las credenciales nunca se loguean en el interceptor de errores
- `whitelist: true` en NestJS rechaza propiedades no declaradas en los DTOs

---

## Patrones de diseño aplicados

| Patrón | Dónde se aplica |
|---|---|
| Atomic Design | Toda la capa de componentes UI |
| Clean Architecture | Frontend (parcial) y backend (completo) |
| Repository Pattern | Backend — `IApplicationRepository` abstracta |
| Compound Component | `FormField` (Label + Input + error) |
| Container/Presentational | Organismos (lógica) vs átomos/moléculas (presentación) |
| HOC | `withPageLayout` — centraliza loading/error |
| Barrel Exports | `index.ts` en cada componente |
| Single Responsibility (SOLID) | Cada caso de uso, hook y servicio tiene una sola razón de cambio |
| Open/Closed (SOLID) | `Button`, `FormField`, `IApplicationRepository` extensibles sin modificación |
| Dependency Inversion (SOLID) | Casos de uso dependen de interfaces abstractas, no de implementaciones |
| DRY | `utils/formatters.ts`, `constants/`, `enums/` centralizados |

---

## Uso de herramientas de IA

**Herramienta:** Claude (Anthropic) — claude.ai

### Qué se utilizó y cómo se validó

| Área | Uso | Validación aplicada |
|---|---|---|
| Scaffolding inicial | Generación de estructura base | Revisada y adaptada a las decisiones de arquitectura del candidato |
| Componentes UI | Generación de código base | Probados en navegador y ajustados visualmente |
| Clean Architecture | Sugerencia de estructura | Implementada y validada que las dependencias apuntaran hacia adentro |
| Schemas Zod | Generación de validaciones | Probados con casos de error reales en el formulario |
| Pruebas unitarias | Generación de casos de prueba | Ejecutados y verificados que pasaran por las razones correctas |
| Fórmula de amortización | Sugerencia de fórmula financiera | Verificada matemáticamente contra calculadora financiera externa |
| Corrección de errores | Diagnóstico de bugs | Cada fix fue entendido antes de aplicarse |

### Metodología de validación

1. El candidato definió la arquitectura y las decisiones técnicas antes de escribir código
2. La IA generó código base como punto de partida — nunca como decisión final
3. Cada fragmento fue revisado, probado y ajustado manualmente
4. Las decisiones de negocio fueron definidas por el candidato
5. Los errores detectados durante la revisión (magic strings, funciones duplicadas, nomenclatura mixta) demuestran que la validación fue activa, no pasiva

### Lo que NO hizo la IA

- No definió la arquitectura — fue una decisión del candidato
- No eligió el stack tecnológico
- No diseñó el flujo de negocio
- No validó que el código funcionara en el navegador

---

## Limitaciones conocidas y deuda técnica

### Limitaciones de alcance

- No hay autenticación ni autorización implementada
- No hay validación de identidad real (cédula, biometría)
- No hay notificaciones cuando la solicitud cambia de estado
- No hay despliegue real en Azure — solo Docker Compose con criterio de configuración

### Deuda técnica identificada

- **Nomenclatura mixta:** Algunos componentes tienen nombres en español (`FormularioDatosBasicos`, `useCapacidadPago`) — pendiente migrar a inglés de forma consistente
- **Clean Architecture frontend:** La estructura está en transición — algunos hooks deberían estar en `application/use-cases/`
- **Paginación:** El listado no tiene paginación — necesaria en producción
- **Pruebas backend parciales:** Se cubren 3 casos de uso críticos. Pendiente: repositorios, controlador y DTOs
- **Observabilidad básica:** Los logs son `console.error` — en producción se integraría con Azure Application Insights
- **Rate limiting:** No implementado en el backend

### Decisiones conscientes documentadas

- **In-memory store:** El patrón Repository garantiza que el cambio a PostgreSQL sea transparente para la lógica de negocio
- **Sin paginación:** El volumen de datos en la prueba no lo requiere. TanStack Query está preparado para recibirla
- **Tasa fija 1.8% MV:** Definida como constante `MONTHLY_RATE`. En producción vendría del Core Bancario
- **Error técnico 10% aleatorio:** En producción vendría de un circuit breaker o timeout del Core Bancario