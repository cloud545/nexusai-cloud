import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

// Mock bcrypt library
vi.mock('bcryptjs');

describe('AuthService', () => {
  let authService: AuthService;
  const mockPrismaService = {
    user: {
      findUnique: vi.fn(),
    },
  };
  const mockJwtService = {
    signAsync: vi.fn(),
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
    authService = new AuthService(
      mockPrismaService as unknown as PrismaService,
      mockJwtService as unknown as JwtService,
    );
  });

  it('should return an access token on successful login', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: UserRole.USER,
      nickname: 'testuser',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const fakeToken = 'fake.access.token';

    // Mock the dependencies' methods
    mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    mockJwtService.signAsync.mockResolvedValue(fakeToken);

    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await authService.login(loginDto);

    expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
      where: { email: loginDto.email },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      loginDto.password,
      mockUser.password,
    );
    expect(mockJwtService.signAsync).toHaveBeenCalledWith({
      sub: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
    });
    expect(result.access_token).toBe(fakeToken);
  });
});
