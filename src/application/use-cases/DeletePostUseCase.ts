import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { PostId } from '../../domain/value-objects/PostId';
import { NotFoundError, UnauthorizedError } from '../../domain/errors/DomainErrors';

export class DeletePostUseCase {
    constructor(private readonly postRepository: IPostRepository) { }

    async execute(postId: string, requesterId: string): Promise<void> {
        const post = await this.postRepository.findById(new PostId(postId));

        if (!post) {
            throw new NotFoundError('Post', postId);
        }

        // Check if requester is the author
        if (post.authorId.getValue() !== requesterId) {
            throw new UnauthorizedError('You are not authorized to delete this post');
        }

        await this.postRepository.delete(new PostId(postId));
    }
}
