import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class AuthService {
    private readonly saltRounds = 10;
    private readonly jwtSecret: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production';
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    generateToken(userId: string, email: string): string {
        return jwt.sign({ userId, email }, this.jwtSecret, { expiresIn: '24h' });
    }
    verifyToken(token: string): { userId: string; email: string } {
        try {
            const decoded = jwt.verify(token, this.jwtSecret) as { userId: string; email: string };
            return decoded;
        } catch (_error) {
            throw new Error('Invalid or expired token');
        }
    }
}
