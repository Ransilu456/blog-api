// Repositories
import { MySQLUserRepository } from '../infrastructure/repositories/MySQLUserRepository';
import { MySQLPostRepository } from '../infrastructure/repositories/MySQLPostRepository';
import { MySQLCommentRepository } from '../infrastructure/repositories/MySQLCommentRepository';

// Services
import { AuthService } from '../application/services/AuthService';

// Use Cases
import { RegisterUserUseCase } from '../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../application/use-cases/LoginUserUseCase';
import { CreatePostUseCase } from '../application/use-cases/CreatePostUseCase';
import { GetPostUseCase } from '../application/use-cases/GetPostUseCase';
import { UpdatePostUseCase } from '../application/use-cases/UpdatePostUseCase';
import { DeletePostUseCase } from '../application/use-cases/DeletePostUseCase';
import { CreateCommentUseCase } from '../application/use-cases/CreateCommentUseCase';
import { GetCommentUseCase } from '../application/use-cases/GetCommentUseCase';

// Controllers
import { UserController } from '../interfaces/http/controllers/UserController';
import { PostController } from '../interfaces/http/controllers/PostController';
import { CommentController } from '../interfaces/http/controllers/CommentController';

// Middleware
import { AuthMiddleware } from '../infrastructure/auth/authMiddleware';

export class Container {
    // Repositories (MySQL)
    public readonly userRepository = new MySQLUserRepository();
    public readonly postRepository = new MySQLPostRepository();
    public readonly commentRepository = new MySQLCommentRepository();

    // Services
    public readonly authService = new AuthService();

    // Use Cases
    public readonly registerUserUseCase = new RegisterUserUseCase(
        this.userRepository,
        this.authService
    );

    public readonly loginUserUseCase = new LoginUserUseCase(
        this.userRepository,
        this.authService
    );

    public readonly createPostUseCase = new CreatePostUseCase(
        this.postRepository
    );

    public readonly getPostUseCase = new GetPostUseCase(
        this.postRepository
    );

    public readonly updatePostUseCase = new UpdatePostUseCase(
        this.postRepository
    );

    public readonly deletePostUseCase = new DeletePostUseCase(
        this.postRepository
    );

    public readonly createCommentUseCase = new CreateCommentUseCase(
        this.commentRepository,
        this.postRepository
    );

    public readonly getCommentUseCase = new GetCommentUseCase(
        this.commentRepository
    );

    // Controllers
    public readonly userController = new UserController(
        this.registerUserUseCase,
        this.loginUserUseCase,
        this.userRepository
    );

    public readonly postController = new PostController(
        this.createPostUseCase,
        this.getPostUseCase,
        this.updatePostUseCase,
        this.deletePostUseCase
    );

    public readonly commentController = new CommentController(
        this.createCommentUseCase,
        this.getCommentUseCase
    );

    // Middleware
    public readonly authMiddleware = new AuthMiddleware();
}
