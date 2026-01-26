import { ICommentRepository } from '../../domain/repositories/ICommentRepository';
import { Comment } from '../../domain/entities/Comment';
import { PostId } from '../../domain/value-objects/PostId';

export class GetCommentUseCase {
    constructor(private readonly commentRepository: ICommentRepository) { }

    async getByPost(postId: string): Promise<Comment[]> {
        return this.commentRepository.findByPost(new PostId(postId));
    }
}
