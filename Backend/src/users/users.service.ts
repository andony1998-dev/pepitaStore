import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from './entities/usuario.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usersRepo: Repository<Usuario>,
  ) {}

  async findAll(page: number = 1, limit: number = 50): Promise<Omit<Usuario, 'password_hash'>[]> {
    const users = await this.usersRepo.find({
      relations: ['rol'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return users.map(({ password_hash, ...rest }) => rest);
  }

  async findOne(id: number): Promise<Omit<Usuario, 'password_hash'>> {
    const user = await this.findEntity(id);
    const { password_hash, ...rest } = user;
    return rest;
  }

  async create(dto: CreateUserDto): Promise<Omit<Usuario, 'password_hash'>> {
    const exists = await this.usersRepo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (exists) {
      throw new ConflictException('El username o email ya está registrado');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      username: dto.username,
      email: dto.email,
      password_hash: hash,
      rol_id: dto.rol_id,
    });
    const saved = await this.usersRepo.save(user);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateUserDto): Promise<Omit<Usuario, 'password_hash'>> {
    const user = await this.findEntity(id);

    if (dto.username && dto.username !== user.username) {
      const dup = await this.usersRepo.findOne({ where: { username: dto.username } });
      if (dup) throw new ConflictException('El username ya está en uso');
    }
    if (dto.email && dto.email !== user.email) {
      const dup = await this.usersRepo.findOne({ where: { email: dto.email } });
      if (dup) throw new ConflictException('El email ya está en uso');
    }

    if (dto.username) user.username = dto.username;
    if (dto.email) user.email = dto.email;
    if (dto.rol_id) user.rol_id = dto.rol_id;
    if (dto.password) user.password_hash = await bcrypt.hash(dto.password, 10);

    await this.usersRepo.save(user);
    return this.findOne(id);
  }

  private async findEntity(id: number): Promise<Usuario> {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ['rol'],
    });
    if (!user) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return user;
  }
}
