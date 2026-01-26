import { Request, Response } from 'express';
import '../../../types/session'; // Import session type definitions
import { RegisterUserUseCase } from '../../../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../../application/use-cases/LoginUserUseCase';
import { DuplicateError, AuthenticationError } from '../../../domain/errors/DomainErrors';
import { AuthRequest } from '../../../infrastructure/auth/authMiddleware';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserId } from '../../../domain/value-objects/UserId';

export class UserController {
    constructor(
        private readonly registerUserUseCase: RegisterUserUseCase,
        private readonly loginUserUseCase: LoginUserUseCase,
        private readonly userRepository: IUserRepository
    ) { }

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, username, password } = req.body;

            if (!email || !username || !password) {
                res.status(400).json({ error: 'Email, username, and password are required' });
                return;
            }

            const user = await this.registerUserUseCase.execute({ email, username, password });

            // Auto-login after registration by setting session
            req.session.userId = user.id.getValue();
            req.session.email = user.email.getValue();

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user.id.getValue(),
                    email: user.email.getValue(),
                    username: user.username,
                    createdAt: user.createdAt
                }
            });
        } catch (error) {
            if (error instanceof DuplicateError) {
                res.status(409).json({ error: error.message });
            } else if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ error: 'Email and password are required' });
                return;
            }

            const result = await this.loginUserUseCase.execute({ email, password });

            // Set session
            req.session.userId = result.user.id;
            req.session.email = result.user.email;

            res.status(200).json({
                message: 'Login successful',
                user: result.user
            });
        } catch (error) {
            if (error instanceof AuthenticationError) {
                res.status(401).json({ error: error.message });
            } else if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    };

    logout = async (req: Request, res: Response): Promise<void> => {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).json({ error: 'Failed to logout' });
                return;
            }
            res.clearCookie('connect.sid'); // Default session cookie name
            res.status(200).json({ message: 'Logout successful' });
        });
    };

    getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const user = await this.userRepository.findById(new UserId(req.user.userId));

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.status(200).json({
                user: {
                    id: user.id.getValue(),
                    email: user.email.getValue(),
                    username: user.username,
                    createdAt: user.createdAt
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
