import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryColumn('varchar', { length: 36 })
    id!: string;

    @Column('varchar', { length: 255, unique: true })
    email!: string;

    @Column('varchar', { length: 50 })
    username!: string;

    @Column('varchar', { length: 255 })
    passwordHash!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
