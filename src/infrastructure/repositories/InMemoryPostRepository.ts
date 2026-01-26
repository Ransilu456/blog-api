import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { Post } from '../../domain/entities/Post';
import { PostId } from '../../domain/value-objects/PostId';
import { UserId } from '../../domain/value-objects/UserId';

export class InMemoryPostRepository implements IPostRepository {
    private posts: Map<string, Post> = new Map();

    async create(post: Post): Promise<Post> {
        this.posts.set(post.id.getValue(), post);
        return post;
    }

    async findById(id: PostId): Promise<Post | null> {
        return this.posts.get(id.getValue()) || null;
    }

    async findAll(): Promise<Post[]> {
        return Array.from(this.posts.values());
    }

    async findByAuthor(authorId: UserId): Promise<Post[]> {
        return Array.from(this.posts.values()).filter(
            post => post.authorId.equals(authorId)
        );
    }

    async findPublished(): Promise<Post[]> {
        return Array.from(this.posts.values()).filter(post => post.published);
    }

    async update(post: Post): Promise<Post> {
        this.posts.set(post.id.getValue(), post);
        return post;
    }

    async delete(id: PostId): Promise<void> {
        this.posts.delete(id.getValue());
    }
}
