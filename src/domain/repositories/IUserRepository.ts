import { User } from '../entities/User';
import { UserId } from '../value-objects/UserId';
import { Email } from '../value-objects/Email';

export interface IUserRepository {
    create(user: User): Promise<User>;
    findById(id: UserId): Promise<User | null>;
    findByEmail(email: Email): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(user: User): Promise<User>;
    delete(id: UserId): Promise<void>;
}
