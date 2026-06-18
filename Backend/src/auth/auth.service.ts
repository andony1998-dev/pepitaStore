import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../users/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { username: dto.username },
      relations: ['rol', 'rol.permisos'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValida = await bcrypt.compare(dto.password, usuario.password_hash);
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: usuario.id,
      username: usuario.username,
      rol_id: usuario.rol_id,
      rol: usuario.rol?.nombre ?? null,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        rol: usuario.rol?.nombre ?? null,
        permisos: usuario.rol?.permisos?.map((p) => p.ruta) ?? [],
      },
    };
  }

  async register(dto: RegisterDto) {
    const existeUsername = await this.usuarioRepository.findOne({
      where: { username: dto.username },
    });
    if (existeUsername) {
      throw new ConflictException('El username ya está en uso');
    }

    const existeEmail = await this.usuarioRepository.findOne({
      where: { email: dto.email },
    });
    if (existeEmail) {
      throw new ConflictException('El email ya está en uso');
    }

    const password_hash = await bcrypt.hash(dto.password, 10);

    const nuevoUsuario = this.usuarioRepository.create({
      username: dto.username,
      email: dto.email,
      password_hash,
      rol_id: dto.rol_id,
    });

    const guardado = await this.usuarioRepository.save(nuevoUsuario);

    return {
      message: 'Usuario creado exitosamente',
      user: {
        id: guardado.id,
        username: guardado.username,
        email: guardado.email,
        rol_id: guardado.rol_id,
      },
    };
  }
}
