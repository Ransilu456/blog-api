import { Request, Response, NextFunction } from 'express';
import '../../../types/session'; // Import session type definitions


export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export class AuthMiddleware {
    authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.session || !req.session.userId) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        // Attach user info from session to request
        req.user = {
            userId: req.session.userId,
            email: req.session.email,
        };

        next();
    };

    optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
        if (req.session && req.session.userId) {
            req.user = {
                userId: req.session.userId,
                email: req.session.email,
            };
        }
        next();
    };
}
