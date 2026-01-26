import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { LoginUserDTO } from '../dto/LoginUserDTO';
import { AuthService } from '../services/AuthService';
import { AuthenticationError } from '../../domain/errors/DomainErrors';
import { Email } from '../../domain/value-objects/Email';

export interface LoginResult {
    user: {
        id: string;
        email: string;
        username: string;
    };
}

export class LoginUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly authService: AuthService
    ) { }

    async execute(dto: LoginUserDTO): Promise<LoginResult> {
        // Find user by email
        const user = await this.userRepository.findByEmail(new Email(dto.email));
        if (!user) {
            throw new AuthenticationError('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await this.authService.comparePassword(
            dto.password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            throw new AuthenticationError('Invalid email or password');
        }

        return {
            user: {
                id: user.id.getValue(),
                email: user.email.getValue(),
                username: user.username
            }
        };
    }
}
