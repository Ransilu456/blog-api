import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserId } from '../../domain/value-objects/UserId';
import { Email } from '../../domain/value-objects/Email';
import { UserEntity } from '../database/entities/UserEntity';
import { AppDataSource } from '../database/data-source';

export class MySQLUserRepository implements IUserRepository {
    private repository: Repository<UserEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(UserEntity);
    }

    async create(user: User): Promise<User> {
        const userEntity = new UserEntity();
        userEntity.id = user.id.getValue();
        userEntity.email = user.email.getValue();
        userEntity.username = user.username;
        userEntity.passwordHash = user.passwordHash;
        userEntity.createdAt = user.createdAt;

        await this.repository.save(userEntity);
        return user;
    }

    async findById(id: UserId): Promise<User | null> {
        const userEntity = await this.repository.findOne({
            where: { id: id.getValue() }
        });

        if (!userEntity) {
            return null;
        }

        return this.toDomain(userEntity);
    }

    async findByEmail(email: Email): Promise<User | null> {
        const userEntity = await this.repository.findOne({
            where: { email: email.getValue() }
        });

        if (!userEntity) {
            return null;
        }

        return this.toDomain(userEntity);
    }

    async findAll(): Promise<User[]> {
        const userEntities = await this.repository.find();
        return userEntities.map(entity => this.toDomain(entity));
    }

    async update(user: User): Promise<User> {
        const userEntity = new UserEntity();
        userEntity.id = user.id.getValue();
        userEntity.email = user.email.getValue();
        userEntity.username = user.username;
        userEntity.passwordHash = user.passwordHash;
        userEntity.createdAt = user.createdAt;

        await this.repository.save(userEntity);
        return user;
    }

    async delete(id: UserId): Promise<void> {
        await this.repository.delete({ id: id.getValue() });
    }

    private toDomain(entity: UserEntity): User {
        return new User(
            new UserId(entity.id),
            new Email(entity.email),
            entity.username,
            entity.passwordHash,
            entity.createdAt
        );
    }
}
