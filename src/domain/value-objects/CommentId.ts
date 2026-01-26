export class CommentId {
    private readonly value: string;

    constructor(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('CommentId cannot be empty');
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }

    equals(other: CommentId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
