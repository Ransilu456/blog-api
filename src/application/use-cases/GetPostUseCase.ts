import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { Post } from '../../domain/entities/Post';
import { PostId } from '../../domain/value-objects/PostId';
import { NotFoundError } from '../../domain/errors/DomainErrors';

export class GetPostUseCase {
    constructor(private readonly postRepository: IPostRepository) { }

    async getById(id: string): Promise<Post> {
        const post = await this.postRepository.findById(new PostId(id));
        if (!post) {
            throw new NotFoundError('Post', id);
        }
        return post;
    }

    async getAll(): Promise<Post[]> {
        return this.postRepository.findAll();
    }

    async getPublished(): Promise<Post[]> {
        return this.postRepository.findPublished();
    }

    async getByAuthor(authorId: string): Promise<Post[]> {
        const { UserId } = await import('../../domain/value-objects/UserId');
        return this.postRepository.findByAuthor(new UserId(authorId));
    }
}
