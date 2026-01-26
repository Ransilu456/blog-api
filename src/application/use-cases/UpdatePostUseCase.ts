import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { Post } from '../../domain/entities/Post';
import { PostId } from '../../domain/value-objects/PostId';
import { UpdatePostDTO } from '../dto/UpdatePostDTO';
import { NotFoundError, UnauthorizedError } from '../../domain/errors/DomainErrors';

export class UpdatePostUseCase {
    constructor(private readonly postRepository: IPostRepository) { }

    async execute(postId: string, dto: UpdatePostDTO, requesterId: string): Promise<Post> {
        const post = await this.postRepository.findById(new PostId(postId));

        if (!post) {
            throw new NotFoundError('Post', postId);
        }

        // Check if requester is the author
        if (post.authorId.getValue() !== requesterId) {
            throw new UnauthorizedError('You are not authorized to update this post');
        }

        // Update post
        if (dto.title !== undefined || dto.content !== undefined) {
            post.update(dto.title, dto.content);
        }

        if (dto.published !== undefined) {
            if (dto.published) {
                post.publish();
            } else {
                post.unpublish();
            }
        }

        return this.postRepository.update(post);
    }
}
