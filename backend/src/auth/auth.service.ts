import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto, AuthResponseDto, RefreshTokenDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.usersService.create(registerDto);
    const tokens = await this.generateTokens(user);
    
    await this.usersService.updateRefreshToken((user as any)._id.toString(), tokens.refresh_token);
    await this.usersService.updateLastLogin((user as any)._id.toString());

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: {
        id: (user as any)._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmailWithPassword(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const tokens = await this.generateTokens(user);
    
    await this.usersService.updateRefreshToken((user as any)._id.toString(), tokens.refresh_token);
    await this.usersService.updateLastLogin((user as any)._id.toString());

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: {
        id: (user as any)._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'your-jwt-refresh-secret',
      });

      const user = await this.usersService.findById(payload.sub);
      const isRefreshTokenValid = await this.usersService.validateRefreshToken(
        (user as any)._id.toString(),
        refreshTokenDto.refresh_token,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);
      await this.usersService.updateRefreshToken((user as any)._id.toString(), tokens.refresh_token);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    await this.usersService.setPasswordResetToken(email, resetToken);

    // TODO: Send email with reset token
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersService.findByPasswordResetToken(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    await this.usersService.resetPassword(token, newPassword);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      await this.usersService.changePassword(userId, currentPassword, newPassword);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async generateTokens(user: any): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    // Get expiration settings from environment
    const accessTokenExpiration = this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION');
    const refreshTokenExpiration = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION');

    // Prepare JWT options
    const accessTokenOptions: any = {
      secret: this.configService.get<string>('JWT_SECRET') || 'your-jwt-secret-key',
    };
    
    const refreshTokenOptions: any = {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'your-jwt-refresh-secret',
    };

    // Only add expiresIn if the value is not empty (no expiration when empty)
    if (accessTokenExpiration && accessTokenExpiration.trim() !== '') {
      accessTokenOptions.expiresIn = accessTokenExpiration;
    }

    if (refreshTokenExpiration && refreshTokenExpiration.trim() !== '') {
      refreshTokenOptions.expiresIn = refreshTokenExpiration;
    }

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, accessTokenOptions),
      this.jwtService.signAsync(payload, refreshTokenOptions),
    ]);

    return { access_token, refresh_token };
  }
} 