import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminGuard extends JwtAuthGuard implements CanActivate { // Inherits from JwtAuthGuard
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. First, ensure the user is authenticated (JWT is valid)
    const isAuthenticated = await super.canActivate(context) as boolean;
    if (!isAuthenticated) {
      return false;
    }

    // 2. Then, check if the authenticated user has the ADMIN role
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    return user?.role === 'ADMIN';
  }
}