import { Post } from '../entities/Post';
import { PostId } from '../value-objects/PostId';
import { UserId } from '../value-objects/UserId';

export interface IPostRepository {
    create(post: Post): Promise<Post>;
    findById(id: PostId): Promise<Post | null>;
    findAll(): Promise<Post[]>;
    findByAuthor(authorId: UserId): Promise<Post[]>;
    findPublished(): Promise<Post[]>;
    update(post: Post): Promise<Post>;
    delete(id: PostId): Promise<void>;
}
