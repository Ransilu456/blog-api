import { Response } from 'express';
import { CreateCommentUseCase } from '../../../application/use-cases/CreateCommentUseCase';
import { GetCommentUseCase } from '../../../application/use-cases/GetCommentUseCase';
import { NotFoundError } from '../../../domain/errors/DomainErrors';
import { AuthRequest } from '../../../infrastructure/auth/authMiddleware';

export class CommentController {
    constructor(
        private readonly createCommentUseCase: CreateCommentUseCase,
        private readonly getCommentUseCase: GetCommentUseCase
    ) { }

    create = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { postId } = req.params;
            const { content } = req.body;

            if (!content) {
                res.status(400).json({ error: 'Content is required' });
                return;
            }

            const comment = await this.createCommentUseCase.execute({
                postId,
                authorId: req.user.userId,
                content
            });

            res.status(201).json({
                message: 'Comment created successfully',
                comment: comment.toJSON()
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

    getByPost = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { postId } = req.params;
            const comments = await this.getCommentUseCase.getByPost(postId);

            res.status(200).json({
                comments: comments.map(comment => comment.toJSON())
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    };
}
