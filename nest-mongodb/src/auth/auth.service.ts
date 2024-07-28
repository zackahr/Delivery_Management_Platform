import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from 'src/user/dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findByUsername(username);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        // Compare passwords directly without hashing
        if (password !== user.password) {
            throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
        }

        return user; // Return the entire user object
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // console.log('User found:', user);

        const payload = {
            username: user.username,
            sub: user._id ? user._id.toString() : null, // Handle cases where _id might be null
            role: user.role,
        };

        const token = this.jwtService.sign(payload);
        return { access_token: token };
    }

    async getUserFromToken(token: string) {
        try {
            const decoded = this.jwtService.verify(token);
            console.log('Decoded token:', decoded);
            return this.userService.findById(decoded.sub);
        } catch (error) {
            console.error('Error decoding token:', error.message);
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
    }
}
