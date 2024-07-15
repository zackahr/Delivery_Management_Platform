import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        // Compare passwords directly without hashing
        if (password !== user.password) {
            throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
        }

        return user; // Return the entire user object
    }

    async login(user: any) {
        const payload = {
            username: user.username,  // Assuming user.username is correctly populated
            sub: user._id.toString(), // Convert ObjectId to string if needed
            role: user.role          // Assuming user.role is correctly populated
        };

        const token = this.jwtService.sign(payload);

        // Log the token received from frontend
        console.log('Token received from frontend:', token);

        return {
            access_token: token,
        };
    }

    async getUserFromToken(token: string) {
        try {
            const decoded = this.jwtService.verify(token);
            return this.usersService.getUserById(decoded.sub);
        } catch (error) {
            console.error('Error decoding token:', error.message);
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
    }
}
