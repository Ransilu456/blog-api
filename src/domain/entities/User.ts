import { UserId } from '../value-objects/UserId';
import { Email } from '../value-objects/Email';

export class User {
    constructor(
        public readonly id: UserId,
        public readonly email: Email,
        public readonly username: string,
        public readonly passwordHash: string,
        public readonly createdAt: Date
    ) {
        this.validate();
    }

    private validate(): void {
        if (!this.username || this.username.trim().length < 3) {
            throw new Error('Username must be at least 3 characters long');
        }
        if (this.username.length > 50) {
            throw new Error('Username must not exceed 50 characters');
        }
        if (!this.passwordHash) {
            throw new Error('Password hash is required');
        }
    }

    static create(
        id: string,
        email: string,
        username: string,
        passwordHash: string
    ): User {
        return new User(
            new UserId(id),
            new Email(email),
            username,
            passwordHash,
            new Date()
        );
    }

    toJSON() {
        return {
            id: this.id.getValue(),
            email: this.email.getValue(),
            username: this.username,
            createdAt: this.createdAt.toISOString()
        };
    }
}
