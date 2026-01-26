export interface CreatePostDTO {
    title: string;
    content: string;
    authorId: string;
    published?: boolean;
}
