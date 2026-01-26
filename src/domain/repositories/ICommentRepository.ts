import { Comment } from '../entities/Comment';
import { CommentId } from '../value-objects/CommentId';
import { PostId } from '../value-objects/PostId';
import { UserId } from '../value-objects/UserId';

export interface ICommentRepository {
    create(comment: Comment): Promise<Comment>;
    findById(id: CommentId): Promise<Comment | null>;
    findByPost(postId: PostId): Promise<Comment[]>;
    findByAuthor(authorId: UserId): Promise<Comment[]>;
    delete(id: CommentId): Promise<void>;
}
