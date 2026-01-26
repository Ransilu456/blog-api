import { v4 as uuidv4 } from 'uuid';
import { ICommentRepository } from '../../domain/repositories/ICommentRepository';
import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { Comment } from '../../domain/entities/Comment';
import { CreateCommentDTO } from '../dto/CreateCommentDTO';
import { PostId } from '../../domain/value-objects/PostId';
import { NotFoundError } from '../../domain/errors/DomainErrors';

export class CreateCommentUseCase {
    constructor(
        private readonly commentRepository: ICommentRepository,
        private readonly postRepository: IPostRepository
    ) { }

    async execute(dto: CreateCommentDTO): Promise<Comment> {
        // Verify post exists
        const post = await this.postRepository.findById(new PostId(dto.postId));
        if (!post) {
            throw new NotFoundError('Post', dto.postId);
        }

        const comment = Comment.create(
            uuidv4(),
            dto.postId,
            dto.authorId,
            dto.content
        );

        return this.commentRepository.create(comment);
    }
}
