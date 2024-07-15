import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        forwardRef(() => UsersModule),
        PassportModule,
        JwtModule.register({
            secret: '730f6129e5b8eca998bd024663dc773095bd3086e57a84b5f24579dd3898360f', // use a secure key here
            signOptions: { expiresIn: '60m' },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
