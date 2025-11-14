import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private jwt: JwtService) {}
    
    async hassPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    async valiatePassword(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }

    async signToken(userId: string) {
        return this.jwt.sign({ userId });
    }
}