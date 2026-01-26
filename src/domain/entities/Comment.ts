import { CommentId } from '../value-objects/CommentId';
import { PostId } from '../value-objects/PostId';
import { UserId } from '../value-objects/UserId';

export class Comment {
    constructor(
        public readonly id: CommentId,
        public readonly postId: PostId,
        public readonly authorId: UserId,
        public content: string,
        public readonly createdAt: Date
    ) {
        this.validate();
    }

    private validate(): void {
        if (!this.content || this.content.trim().length < 1) {
            throw new Error('Comment content cannot be empty');
        }
        if (this.content.length > 1000) {
            throw new Error('Comment content must not exceed 1000 characters');
        }
    }

    static create(
        id: string,
        postId: string,
        authorId: string,
        content: string
    ): Comment {
        return new Comment(
            new CommentId(id),
            new PostId(postId),
            new UserId(authorId),
            content,
            new Date()
        );
    }

    toJSON() {
        return {
            id: this.id.getValue(),
            postId: this.postId.getValue(),
            authorId: this.authorId.getValue(),
            content: this.content,
            createdAt: this.createdAt.toISOString()
        };
    }
}
