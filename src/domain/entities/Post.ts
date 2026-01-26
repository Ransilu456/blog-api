import { PostId } from '../value-objects/PostId';
import { UserId } from '../value-objects/UserId';

export class Post {
    constructor(
        public readonly id: PostId,
        public title: string,
        public content: string,
        public readonly authorId: UserId,
        public published: boolean,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) {
        this.validate();
    }

    private validate(): void {
        if (!this.title || this.title.trim().length < 3) {
            throw new Error('Post title must be at least 3 characters long');
        }
        if (this.title.length > 200) {
            throw new Error('Post title must not exceed 200 characters');
        }
        if (!this.content || this.content.trim().length < 10) {
            throw new Error('Post content must be at least 10 characters long');
        }
    }

    static create(
        id: string,
        title: string,
        content: string,
        authorId: string,
        published: boolean = false
    ): Post {
        const now = new Date();
        return new Post(
            new PostId(id),
            title,
            content,
            new UserId(authorId),
            published,
            now,
            now
        );
    }

    update(title?: string, content?: string): void {
        if (title !== undefined) {
            this.title = title;
        }
        if (content !== undefined) {
            this.content = content;
        }
        this.validate();
        this.updatedAt = new Date();
    }

    publish(): void {
        this.published = true;
        this.updatedAt = new Date();
    }

    unpublish(): void {
        this.published = false;
        this.updatedAt = new Date();
    }

    toJSON() {
        return {
            id: this.id.getValue(),
            title: this.title,
            content: this.content,
            authorId: this.authorId.getValue(),
            published: this.published,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString()
        };
    }
}
