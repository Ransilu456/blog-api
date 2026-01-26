import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserEntity } from './entities/UserEntity';
import { PostEntity } from './entities/PostEntity';
import { CommentEntity } from './entities/CommentEntity';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'blog_db',
    synchronize: true, // Auto-create tables (disable in production)
    logging: process.env.NODE_ENV === 'development',
    entities: [UserEntity, PostEntity, CommentEntity],
    charset: 'utf8mb4',
});

export async function initializeDatabase(): Promise<void> {
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connection established');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
}

export async function closeDatabase(): Promise<void> {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        console.log('Database connection closed');
    }
}
