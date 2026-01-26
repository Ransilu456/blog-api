import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Container } from './container';
import { setupRoutes } from './routes';

export function createApp(): Application {
    const app = express();
    const container = new Container();

    // Middleware
    app.use(cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
        credentials: true
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Request logging
    app.use((req: Request, _res: Response, next: NextFunction) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });

    // Routes
    app.use('/api', setupRoutes(container));

    // Root endpoint
    app.get('/', (_req: Request, res: Response) => {
        res.json({
            message: 'Welcome to Blog API',
            version: '1.0.0',
            endpoints: {
                health: '/api/health',
                users: '/api/users',
                posts: '/api/posts',
                comments: '/api/posts/:postId/comments'
            }
        });
    });

    // 404 handler
    app.use((_req: Request, res: Response) => {
        res.status(404).json({ error: 'Route not found' });
    });

    // Error handler
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error', message: err.message });
    });

    return app;
}
