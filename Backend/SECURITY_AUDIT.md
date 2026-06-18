# SECURITY AUDIT — LibreriaPepita Backend (NestJS 11)
**Fecha:** 2026-06-08  
**Versión analizada:** NestJS 11 · TypeORM 0.3 · TypeScript 5.7  
**Auditor:** Claude Code (Anthropic)

---

## Resumen Ejecutivo

El backend tiene una base sólida: usa TypeORM con queries parametrizadas (sin SQL injection), valida DTOs con `class-validator`, hashea contraseñas con bcrypt y protege la mayoría de rutas con `JwtAuthGuard`. Sin embargo, se identificaron **2 vulnerabilidades críticas** (credenciales reales expuestas + registro público sin control de roles), **5 altas** y **5 medias** que deben corregirse antes de publicar. La ausencia de `.gitignore` en Backend y la presencia de contraseñas reales en `.env` representan el mayor riesgo inmediato.

---

## 🔴 CRÍTICAS

### C-1: Credenciales reales en `.env` sin `.gitignore`
**Archivo:** `Backend/.env`  
**Impacto:** Si el repositorio se sube a GitHub/GitLab, la contraseña de PostgreSQL (`Andony199$`) y el JWT secret quedan expuestos públicamente. Cualquier persona puede conectarse a la base de datos o forjar tokens JWT válidos.

**Hallazgo:**
```
DB_PASSWORD=Andony199$                          ← contraseña real de producción
JWT_SECRET=LibreriaPepita$Secr3t#Key2026!XyZ    ← clave JWT real
```
Además, **no existe `Backend/.gitignore`** — el archivo `.env` se incluiría en cualquier `git add .`.

**Remediación inmediata:**
1. Crear `Backend/.gitignore`:
```gitignore
# Environment
.env
.env.local
.env.*.local

# Build
dist/
node_modules/

# Logs
*.log
npm-debug.log*
```
2. Cambiar la contraseña de la BD y generar un nuevo JWT secret si ya se subió el repo.
3. El `.env.example` (con valores ficticios) ya existe y está bien — mantenerlo.

---

### C-2: Endpoint `/auth/register` público permite auto-asignación de cualquier rol
**Archivos:** `src/auth/auth.controller.ts`, `src/auth/auth.service.ts`  
**Impacto:** Cualquier persona en internet puede llamar `POST /auth/register` con `rol_id: 1` (o cualquier ID de rol administrador) y crear una cuenta con privilegios máximos. No hay guard, no hay verificación del rol solicitado.

```typescript
// auth.controller.ts — sin @UseGuards
@Post('register')
register(@Body() dto: RegisterDto) {   // dto.rol_id viene del body sin restricción
  return this.authService.register(dto);
}
```

**Remediación:**
```typescript
// Opción A: proteger registro con JWT + solo admins pueden registrar usuarios
@UseGuards(JwtAuthGuard)
@Post('register')
register(@Body() dto: RegisterDto) {
  return this.authService.register(dto);
}

// Opción B: si el registro es público, ignorar el rol_id del body y asignar siempre "usuario básico"
async register(dto: RegisterDto) {
  const ROL_BASICO_ID = 2; // ID del rol sin privilegios
  // ...
  const nuevoUsuario = this.usuarioRepository.create({
    username: dto.username,
    email: dto.email,
    password_hash,
    rol_id: ROL_BASICO_ID,   // nunca desde el body
  });
}
```

---

## 🟡 ALTAS

### A-1: Sin rate limiting en endpoints de autenticación
**Archivos:** `src/main.ts`, `src/auth/auth.controller.ts`  
**Impacto:** Un atacante puede hacer miles de intentos de login por segundo (brute force). La contraseña mínima es de 6 caracteres, lo que hace factible el ataque.

**Remediación:**
```bash
npm install @nestjs/throttler
```
```typescript
// app.module.ts
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 5 }]), // 5 intentos/min
    // ...
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})

// auth.controller.ts — configuración específica para login
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { ttl: 60000, limit: 5 } })
@Post('login')
login(@Body() dto: LoginDto) { ... }
```

---

### A-2: Sin Helmet.js — headers de seguridad ausentes
**Archivo:** `src/main.ts`  
**Impacto:** Sin headers como `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Content-Security-Policy`, la app es vulnerable a clickjacking, MIME sniffing y ataques de downgrade HTTPS.

**Remediación:**
```bash
npm install helmet
```
```typescript
// main.ts
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());  // antes de enableCors()
  // ...
}
```

---

### A-3: Sin autorización por roles (RBAC) — autenticación ≠ autorización
**Archivos:** todos los controllers  
**Impacto:** `JwtAuthGuard` solo verifica que el token sea válido. Cualquier usuario autenticado, independientemente de su rol, puede: crear/modificar libros, clientes, movimientos, roles, permisos y usuarios. Un usuario básico puede crear roles o editar stock.

**Remediación — implementar guard de roles:**
```typescript
// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>('roles', [
      ctx.getHandler(), ctx.getClass(),
    ]);
    if (!required) return true;
    const { user } = ctx.switchToHttp().getRequest();
    // user.rol_id viene del JWT — comparar con roles permitidos
    return required.includes(user.rol);
  }
}

// Uso en controllers:
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Post()
create(@Body() dto: CreateRoleDto) { ... }
```

---

### A-4: Vulnerabilidades npm — 1 crítica, 8 altas (20 en total)
**Archivo:** `package.json`  
**Resumen `npm audit`:**

| Severidad | Paquete | Problema | Tipo |
|-----------|---------|----------|------|
| 🔴 CRÍTICA | `handlebars` | JS Injection / Prototype Pollution | devDep transitiva |
| 🟠 ALTA | `lodash` | Prototype Pollution + Command Injection | vía `@nestjs/config` |
| 🟠 ALTA | `path-to-regexp` | ReDoS | vía `@nestjs/core`, `@nestjs/platform-express` |
| 🟠 ALTA | `flatted` | DoS | transitiva |
| 🟠 ALTA | `fast-uri` | múltiples CVEs | transitiva |
| 🟠 ALTA | `picomatch` | ReDoS + Method Injection | devDep transitiva |
| 🟡 MEDIA | `qs` | DoS remoto | transitiva |
| 🟡 MEDIA | `uuid` | buffer overflow | transitiva |

**Nota importante:** `handlebars`, `picomatch` son devDependencies (solo en build/test, no en producción). Las de `@nestjs/core` y `@nestjs/config` sí son runtime.

**Remediación:**
```bash
# Aplicar fixes automáticos disponibles
npm audit fix

# Actualizar NestJS core y config manualmente si audit fix no resuelve
npm update @nestjs/core @nestjs/common @nestjs/config @nestjs/platform-express
```

---

### A-5: Campo `usuario` en movimientos viene del body, no del JWT
**Archivo:** `src/movimientos/dto/create-movimiento.dto.ts:55`  
**Impacto:** Cualquier usuario autenticado puede crear movimientos con el nombre de otra persona como responsable, falsificando el registro de auditoría.

```typescript
// DTO actual — problemático
@IsString()
@MinLength(1)
@MaxLength(100)
usuario: string;  // cualquiera puede poner "admin" aquí
```

**Remediación:**
```typescript
// movimientos.controller.ts — extraer usuario del JWT
import { Request } from 'express';
import { Req } from '@nestjs/common';

@Post()
create(@Body() dto: CreateMovimientoDto, @Req() req: Request) {
  const username = (req.user as any).username; // viene del JWT verificado
  return this.movimientosService.create(dto, username);
}

// movimientos.service.ts
async create(dto: CreateMovimientoDto, usuario: string): Promise<Movimiento> {
  // usar `usuario` del parámetro, ignorar cualquier valor en dto
}

// Eliminar campo `usuario` del DTO
```

---

## 🟡 MEDIAS

### M-1: CORS permite requests sin `Origin` (Postman, curl, scripts locales)
**Archivo:** `src/main.ts:14`  
```typescript
if (!origin) return callback(null, true);  // permite cualquier client sin origin
```
**Impacto:** Scripts maliciosos ejecutados localmente o desde file:// pueden acceder a la API. En producción se recomienda rechazar estas peticiones.  
**Remediación:** En producción, quitar esa línea o restringirla a herramientas de monitoreo internas.

---

### M-2: Sin paginación en endpoints `findAll()`
**Archivos:** todos los controllers con `@Get()`  
**Impacto:** Con miles de libros, clientes o movimientos, una sola request puede devolver megabytes de datos y causar OOM o lentitud severa.

**Remediación:**
```typescript
// libros.controller.ts
@Get()
findAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
) {
  return this.librosService.findAll(page, Math.min(limit, 100));
}

// libros.service.ts
findAll(page: number, limit: number) {
  return this.librosRepo.find({
    skip: (page - 1) * limit,
    take: limit,
    // ...
  });
}
```

---

### M-3: Contraseña mínima de 6 caracteres es demasiado corta
**Archivos:** `src/auth/dto/login.dto.ts:9`, `src/auth/dto/register.dto.ts:22`, `src/users/dto/create-user.dto.ts:8`  
**Remediación:** Aumentar a mínimo 8 caracteres y agregar complejidad:
```typescript
import { IsStrongPassword } from 'class-validator';

@IsStrongPassword({ minLength: 8, minNumbers: 1, minUppercase: 1 })
password: string;
```

---

### M-4: No hay validación de longitud máxima en campos de texto libre
**Archivos:** `src/autores/dto/create-autor.dto.ts`, campos `direccion` sin `@MaxLength`  
**Impacto:** Strings muy largos pueden saturar la base de datos o causar errores inesperados.  
**Remediación:** Agregar `@MaxLength(N)` a todos los campos string opcionales sin límite.

---

### M-5: El mensaje de error CORS expone el origin rechazado
**Archivo:** `src/main.ts:17`  
```typescript
callback(new Error(`Origen no permitido por CORS: ${origin}`));
```
**Remediación:**
```typescript
callback(new Error('Not allowed by CORS'));
```

---

## 🟢 MEJORAS

### MJ-1: Agregar compresión HTTP
```bash
npm install compression
```
```typescript
import * as compression from 'compression';
app.use(compression());
```

### MJ-2: Agregar logging estructurado para auditoría
Registrar intentos de login fallidos, accesos a datos sensibles y errores 500 con librería como `winston` o `pino`.

### MJ-3: Sin refresh tokens
Los tokens JWT expiran en 1 día sin posibilidad de revocarlos antes. Considerar implementar refresh tokens o una blacklist de tokens si se necesita logout real.

### MJ-4: `synchronize: false` está bien — mantenerlo
En producción esta configuración es correcta. No habilitarlo nunca en producción.

### MJ-5: Agregar endpoint `DELETE` con soft-delete donde corresponda
Las entidades no tienen campo `deleted_at`. TypeORM tiene `@DeleteDateColumn()` para soft-delete.

---

## ✅ Lo que está bien implementado

| Item | Archivo | Estado |
|------|---------|--------|
| Bcrypt para contraseñas (salt 10) | `auth.service.ts:71` | ✅ |
| Password hash excluido de respuestas | `users.service.ts:22` | ✅ |
| `whitelist: true` + `forbidNonWhitelisted: true` | `main.ts:26-27` | ✅ |
| `transform: true` en ValidationPipe | `main.ts:29` | ✅ |
| `ParseIntPipe` en todos los params `:id` | todos los controllers | ✅ |
| TypeORM con queries parametrizadas (no SQL injection) | todos los services | ✅ |
| `synchronize: false` en producción | `app.module.ts:47` | ✅ |
| Credenciales DB via `ConfigService` | `app.module.ts:40-45` | ✅ |
| JWT secret via `ConfigService` | `auth.module.ts:20` | ✅ |
| Mensajes de error genéricos en login | `auth.service.ts:30,35` | ✅ |
| Validación de DTOs con `class-validator` | todos los DTOs | ✅ |
| `ignoreExpiration: false` en JWT strategy | `jwt.strategy.ts:17` | ✅ |
| CORS no usa `'*'` | `main.ts:12-22` | ✅ |
| Transacciones para movimientos | `movimientos.service.ts:42` | ✅ |

---

## Checklist de Seguridad — Pre-producción

```
CRÍTICO (bloquea el deploy):
[ ] C-1: Crear Backend/.gitignore con .env excluido
[ ] C-1: Cambiar contraseña de BD y JWT secret si ya se subió a git
[ ] C-2: Proteger /auth/register con guard O eliminar rol_id del body

ALTO (resolver en sprint actual):
[ ] A-1: Instalar @nestjs/throttler y limitar /auth/login a 5 req/min
[ ] A-2: Instalar helmet y configurarlo en main.ts
[ ] A-3: Implementar RolesGuard y decorador @Roles()
[ ] A-4: npm audit fix + actualizar @nestjs/core, @nestjs/config
[ ] A-5: Extraer `usuario` del JWT en movimientos, no del body

MEDIO (resolver antes de ir a producción):
[ ] M-1: Revisar política CORS para producción (quitar null-origin)
[ ] M-2: Agregar paginación a findAll() endpoints
[ ] M-3: Aumentar contraseña mínima a 8 chars con @IsStrongPassword
[ ] M-4: Agregar @MaxLength a campos sin límite
[ ] M-5: Limpiar mensaje de error CORS

MEJORAS (post-launch):
[ ] MJ-1: Agregar compression middleware
[ ] MJ-2: Implementar logging estructurado (winston/pino)
[ ] MJ-3: Evaluar refresh tokens / JWT blacklist
[ ] MJ-5: Soft-delete en entidades principales
```

---

*Generado con análisis estático de código + npm audit. Pendiente: pruebas dinámicas (DAST) en entorno de staging.*
