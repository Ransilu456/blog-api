export class PostId {
    private readonly value: string;

    constructor(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('PostId cannot be empty');
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }

    equals(other: PostId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
