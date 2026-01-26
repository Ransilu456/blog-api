import { v4 as uuidv4 } from 'uuid';
import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { Post } from '../../domain/entities/Post';
import { CreatePostDTO } from '../dto/CreatePostDTO';

export class CreatePostUseCase {
    constructor(private readonly postRepository: IPostRepository) { }

    async execute(dto: CreatePostDTO): Promise<Post> {
        const post = Post.create(
            uuidv4(),
            dto.title,
            dto.content,
            dto.authorId,
            dto.published || false
        );

        return this.postRepository.create(post);
    }
}
