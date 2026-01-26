import { ICommentRepository } from '../../domain/repositories/ICommentRepository';
import { Comment } from '../../domain/entities/Comment';
import { CommentId } from '../../domain/value-objects/CommentId';
import { PostId } from '../../domain/value-objects/PostId';
import { UserId } from '../../domain/value-objects/UserId';

export class InMemoryCommentRepository implements ICommentRepository {
    private comments: Map<string, Comment> = new Map();

    async create(comment: Comment): Promise<Comment> {
        this.comments.set(comment.id.getValue(), comment);
        return comment;
    }

    async findById(id: CommentId): Promise<Comment | null> {
        return this.comments.get(id.getValue()) || null;
    }

    async findByPost(postId: PostId): Promise<Comment[]> {
        return Array.from(this.comments.values()).filter(
            comment => comment.postId.equals(postId)
        );
    }

    async findByAuthor(authorId: UserId): Promise<Comment[]> {
        return Array.from(this.comments.values()).filter(
            comment => comment.authorId.equals(authorId)
        );
    }

    async delete(id: CommentId): Promise<void> {
        this.comments.delete(id.getValue());
    }
}
