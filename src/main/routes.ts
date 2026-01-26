import { Router } from 'express';
import { Container } from './container';

export function setupRoutes(container: Container): Router {
    const router = Router();

    // Health check
    router.get('/health', (_req, res) => {
        res.status(200).json({ status: 'OK', message: 'Blog API is running' });
    });

    // User routes
    router.post('/users/register', container.userController.register);
    router.post('/users/login', container.userController.login);
    router.get('/users/profile', container.authMiddleware.authenticate, container.userController.getProfile);

    // Post routes
    router.post('/posts', container.authMiddleware.authenticate, container.postController.create);
    router.get('/posts', container.postController.getAll);
    router.get('/posts/:id', container.postController.getById);
    router.put('/posts/:id', container.authMiddleware.authenticate, container.postController.update);
    router.delete('/posts/:id', container.authMiddleware.authenticate, container.postController.delete);

    // Comment routes
    router.post('/posts/:postId/comments', container.authMiddleware.authenticate, container.commentController.create);
    router.get('/posts/:postId/comments', container.commentController.getByPost);

    return router;
}
