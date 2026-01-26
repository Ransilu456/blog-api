import { Repository } from 'typeorm';
import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { Post } from '../../domain/entities/Post';
import { PostId } from '../../domain/value-objects/PostId';
import { UserId } from '../../domain/value-objects/UserId';
import { PostEntity } from '../database/entities/PostEntity';
import { AppDataSource } from '../database/data-source';

export class MySQLPostRepository implements IPostRepository {
    private repository: Repository<PostEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(PostEntity);
    }

    async create(post: Post): Promise<Post> {
        const postEntity = new PostEntity();
        postEntity.id = post.id.getValue();
        postEntity.title = post.title;
        postEntity.content = post.content;
        postEntity.authorId = post.authorId.getValue();
        postEntity.published = post.published;
        postEntity.createdAt = post.createdAt;
        postEntity.updatedAt = post.updatedAt;

        await this.repository.save(postEntity);
        return post;
    }

    async findById(id: PostId): Promise<Post | null> {
        const postEntity = await this.repository.findOne({
            where: { id: id.getValue() }
        });

        if (!postEntity) {
            return null;
        }

        return this.toDomain(postEntity);
    }

    async findAll(): Promise<Post[]> {
        const postEntities = await this.repository.find({
            order: { createdAt: 'DESC' }
        });
        return postEntities.map(entity => this.toDomain(entity));
    }

    async findByAuthor(authorId: UserId): Promise<Post[]> {
        const postEntities = await this.repository.find({
            where: { authorId: authorId.getValue() },
            order: { createdAt: 'DESC' }
        });
        return postEntities.map(entity => this.toDomain(entity));
    }

    async findPublished(): Promise<Post[]> {
        const postEntities = await this.repository.find({
            where: { published: true },
            order: { createdAt: 'DESC' }
        });
        return postEntities.map(entity => this.toDomain(entity));
    }

    async update(post: Post): Promise<Post> {
        const postEntity = new PostEntity();
        postEntity.id = post.id.getValue();
        postEntity.title = post.title;
        postEntity.content = post.content;
        postEntity.authorId = post.authorId.getValue();
        postEntity.published = post.published;
        postEntity.createdAt = post.createdAt;
        postEntity.updatedAt = post.updatedAt;

        await this.repository.save(postEntity);
        return post;
    }

    async delete(id: PostId): Promise<void> {
        await this.repository.delete({ id: id.getValue() });
    }

    private toDomain(entity: PostEntity): Post {
        return new Post(
            new PostId(entity.id),
            entity.title,
            entity.content,
            new UserId(entity.authorId),
            entity.published,
            entity.createdAt,
            entity.updatedAt
        );
    }
}
