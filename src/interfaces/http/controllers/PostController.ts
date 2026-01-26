import { Response } from 'express';
import { CreatePostUseCase } from '../../../application/use-cases/CreatePostUseCase';
import { GetPostUseCase } from '../../../application/use-cases/GetPostUseCase';
import { UpdatePostUseCase } from '../../../application/use-cases/UpdatePostUseCase';
import { DeletePostUseCase } from '../../../application/use-cases/DeletePostUseCase';
import { NotFoundError, UnauthorizedError } from '../../../domain/errors/DomainErrors';
import { AuthRequest } from '../../../infrastructure/auth/authMiddleware';

export class PostController {
    constructor(
        private readonly createPostUseCase: CreatePostUseCase,
        private readonly getPostUseCase: GetPostUseCase,
        private readonly updatePostUseCase: UpdatePostUseCase,
        private readonly deletePostUseCase: DeletePostUseCase
    ) { }

    create = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { title, content, published } = req.body;

            if (!title || !content) {
                res.status(400).json({ error: 'Title and content are required' });
                return;
            }

            const post = await this.createPostUseCase.execute({
                title,
                content,
                authorId: req.user.userId,
                published: published || false
            });

            res.status(201).json({
                message: 'Post created successfully',
                post: post.toJSON()
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    };

    getAll = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const posts = await this.getPostUseCase.getAll();
            res.status(200).json({
                posts: posts.map(post => post.toJSON())
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    getById = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const post = await this.getPostUseCase.getById(id);

            res.status(200).json({
                post: post.toJSON()
            });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
            } else if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    };

    update = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const { title, content, published } = req.body;

            const post = await this.updatePostUseCase.execute(
                id,
                { title, content, published },
                req.user.userId
            );

            res.status(200).json({
                message: 'Post updated successfully',
                post: post.toJSON()
            });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
            } else if (error instanceof UnauthorizedError) {
                res.status(403).json({ error: error.message });
            } else if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    };

    delete = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            await this.deletePostUseCase.execute(id, req.user.userId);

            res.status(204).send();
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
            } else if (error instanceof UnauthorizedError) {
                res.status(403).json({ error: error.message });
            } else if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    };
}
