import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // <-- 导入
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, // <-- 注入
  ) {}
  // 在 AuthService 类中

  async register(dto: RegisterUserDto): Promise<{ access_token: string }> {
    // 1. 修改返回类型
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 2. 接收创建后的新用户对象
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        nickname: dto.nickname,
        password: hashedPassword,
      },
    });

    // 3. 为新用户生成JWT Payload
    const payload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };

    // 4. 签发并返回 access_token
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(dto: LoginUserDto): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    return { access_token: accessToken };
  }

  async getNextAgentTask(userId: string) {
    // Find the first available Persona for this user.
    // In a real system, this would be based on an active strategy.
    const persona = await this.prisma.persona.findFirst({
      where: { ownerId: userId },
    });

    if (!persona) {
      // If the user hasn't created a Persona, there's no task to assign.
      throw new NotFoundException('No active Persona found for this user.');
    }

    // Find the first available Facebook Account for this user.
    // This is a simplification for our test.
    const facebookAccount = await this.prisma.facebookAccount.findFirst({
      where: { ownerId: userId },
    });

    if (!facebookAccount) {
      throw new NotFoundException('No Facebook Account found for this user.');
    }

    // Build and attach the context
    const taskContext = {
      userId: userId,
      personaId: persona.id,
      accountId: facebookAccount.id,
    };

    // Return the mock task data
    return {
      taskId: 'task-123',
      type: 'BROWSE_GROUP',
      payload: {
        groupName: '上海交友',
      },
      context: taskContext,
    };
  }
}
