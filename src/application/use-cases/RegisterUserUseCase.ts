import { v4 as uuidv4 } from 'uuid';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { RegisterUserDTO } from '../dto/RegisterUserDTO';
import { AuthService } from '../services/AuthService';
import { DuplicateError } from '../../domain/errors/DomainErrors';
import { Email } from '../../domain/value-objects/Email';

export class RegisterUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly authService: AuthService
    ) { }

    async execute(dto: RegisterUserDTO): Promise<User> {
        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(new Email(dto.email));
        if (existingUser) {
            throw new DuplicateError('User', 'email');
        }

        // Hash password
        const passwordHash = await this.authService.hashPassword(dto.password);

        // Create user
        const user = User.create(
            uuidv4(),
            dto.email,
            dto.username,
            passwordHash
        );

        // Save user
        return this.userRepository.create(user);
    }
}
