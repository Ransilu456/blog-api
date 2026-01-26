import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/AuthService';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export class AuthMiddleware {
    constructor(private readonly authService: AuthService) { }

    authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ error: 'No token provided' });
                return;
            }

            const token = authHeader.substring(7); // Remove 'Bearer ' prefix
            const decoded = this.authService.verifyToken(token);

            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid or expired token' });
        }
    };

    optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
        try {
            const authHeader = req.headers.authorization;

            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                const decoded = this.authService.verifyToken(token);
                req.user = decoded;
            }

            next();
        } catch (_error) {
            // If token is invalid, just continue without user
            next();
        }
    };
}
