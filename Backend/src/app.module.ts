import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermisosModule } from './permisos/permisos.module';
import { AutoresModule } from './autores/autores.module';
import { LibrosModule } from './libros/libros.module';
import { EventosModule } from './eventos/eventos.module';
import { AmbitosModule } from './ambitos/ambitos.module';
import { EstadosModule } from './estados/estados.module';
import { TipoMovimientosModule } from './tipo-movimientos/tipo-movimientos.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { MovimientosModule } from './movimientos/movimientos.module';
import { Usuario } from './users/entities/usuario.entity';
import { Rol } from './roles/entities/rol.entity';
import { PermisoMenu } from './permisos/entities/permiso-menu.entity';
import { Autor } from './autores/entities/autor.entity';
import { Libro } from './libros/entities/libro.entity';
import { Evento } from './eventos/entities/evento.entity';
import { Ambito } from './ambitos/entities/ambito.entity';
import { Estado } from './estados/entities/estado.entity';
import { TipoMovimiento } from './tipo-movimientos/entities/tipo-movimiento.entity';
import { Cliente } from './clientes/entities/cliente.entity';
import { Proveedor } from './proveedores/entities/proveedor.entity';
import { Movimiento } from './movimientos/entities/movimiento.entity';
import { DetalleMovimiento } from './movimientos/entities/detalle-movimiento.entity';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 60_000, limit: 5 },
      { name: 'long', ttl: 15 * 60_000, limit: 100 },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [Usuario, Rol, PermisoMenu, Autor, Libro, Evento, Ambito, Estado, TipoMovimiento, Cliente, Proveedor, Movimiento, DetalleMovimiento],
        synchronize: false, // La base de datos ya existe; no alterar el esquema
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      }),
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    PermisosModule,
    AutoresModule,
    LibrosModule,
    EventosModule,
    AmbitosModule,
    EstadosModule,
    TipoMovimientosModule,
    ClientesModule,
    ProveedoresModule,
    MovimientosModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
