import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Find user by email (using the method we confirmed exists in your UsersService)
    const user = await this.usersService.findByEmail(email);

    // 2. Verify user exists and compare hashed password
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Create JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username
    };

    // 4. Return the access token and basic user info
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
}
