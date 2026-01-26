import { Repository } from 'typeorm';
import { ICommentRepository } from '../../domain/repositories/ICommentRepository';
import { Comment } from '../../domain/entities/Comment';
import { CommentId } from '../../domain/value-objects/CommentId';
import { PostId } from '../../domain/value-objects/PostId';
import { UserId } from '../../domain/value-objects/UserId';
import { CommentEntity } from '../database/entities/CommentEntity';
import { AppDataSource } from '../database/data-source';

export class MySQLCommentRepository implements ICommentRepository {
    private repository: Repository<CommentEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(CommentEntity);
    }

    async create(comment: Comment): Promise<Comment> {
        const commentEntity = new CommentEntity();
        commentEntity.id = comment.id.getValue();
        commentEntity.postId = comment.postId.getValue();
        commentEntity.authorId = comment.authorId.getValue();
        commentEntity.content = comment.content;
        commentEntity.createdAt = comment.createdAt;

        await this.repository.save(commentEntity);
        return comment;
    }

    async findById(id: CommentId): Promise<Comment | null> {
        const commentEntity = await this.repository.findOne({
            where: { id: id.getValue() }
        });

        if (!commentEntity) {
            return null;
        }

        return this.toDomain(commentEntity);
    }

    async findByPost(postId: PostId): Promise<Comment[]> {
        const commentEntities = await this.repository.find({
            where: { postId: postId.getValue() },
            order: { createdAt: 'ASC' }
        });
        return commentEntities.map(entity => this.toDomain(entity));
    }

    async findByAuthor(authorId: UserId): Promise<Comment[]> {
        const commentEntities = await this.repository.find({
            where: { authorId: authorId.getValue() },
            order: { createdAt: 'DESC' }
        });
        return commentEntities.map(entity => this.toDomain(entity));
    }

    async delete(id: CommentId): Promise<void> {
        await this.repository.delete({ id: id.getValue() });
    }

    private toDomain(entity: CommentEntity): Comment {
        return new Comment(
            new CommentId(entity.id),
            new PostId(entity.postId),
            new UserId(entity.authorId),
            entity.content,
            entity.createdAt
        );
    }
}
