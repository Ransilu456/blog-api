import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './UserEntity';
import { PostEntity } from './PostEntity';

@Entity('comments')
export class CommentEntity {
    @PrimaryColumn('varchar', { length: 36 })
    id!: string;

    @Column('varchar', { length: 36 })
    postId!: string;

    @ManyToOne(() => PostEntity)
    @JoinColumn({ name: 'postId' })
    post!: PostEntity;

    @Column('varchar', { length: 36 })
    authorId!: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'authorId' })
    author!: UserEntity;

    @Column('text')
    content!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
