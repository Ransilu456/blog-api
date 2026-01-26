import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserId } from '../../domain/value-objects/UserId';
import { Email } from '../../domain/value-objects/Email';

export class InMemoryUserRepository implements IUserRepository {
    private users: Map<string, User> = new Map();

    async create(user: User): Promise<User> {
        this.users.set(user.id.getValue(), user);
        return user;
    }

    async findById(id: UserId): Promise<User | null> {
        return this.users.get(id.getValue()) || null;
    }

    async findByEmail(email: Email): Promise<User | null> {
        for (const user of this.users.values()) {
            if (user.email.equals(email)) {
                return user;
            }
        }
        return null;
    }

    async findAll(): Promise<User[]> {
        return Array.from(this.users.values());
    }

    async update(user: User): Promise<User> {
        this.users.set(user.id.getValue(), user);
        return user;
    }

    async delete(id: UserId): Promise<void> {
        this.users.delete(id.getValue());
    }
}
