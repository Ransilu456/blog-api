import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity('posts')
export class PostEntity {
    @PrimaryColumn('varchar', { length: 36 })
    id!: string;

    @Column('varchar', { length: 200 })
    title!: string;

    @Column('text')
    content!: string;

    @Column('varchar', { length: 36 })
    authorId!: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'authorId' })
    author!: UserEntity;

    @Column('boolean', { default: false })
    published!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
