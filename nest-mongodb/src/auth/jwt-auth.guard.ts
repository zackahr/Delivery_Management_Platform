// Example JwtAuthGuard in NestJS
import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info: Error) {
    if (err || !user) {
      // Handle errors or unauthorized access
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
