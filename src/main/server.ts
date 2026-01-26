import dotenv from 'dotenv';
import { createApp } from './app';
import { initializeDatabase, closeDatabase } from '../infrastructure/database/data-source';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Initialize database connection
        await initializeDatabase();

        // Create and start Express app
        const app = createApp();

        app.listen(PORT, () => {
            console.log('╔════════════════════════════════════════════════╗');
            console.log('║   Blog API - Clean Architecture Backend       ║');
            console.log('║   MySQL + Session Authentication              ║');
            console.log('╚════════════════════════════════════════════════╝');
            console.log('');
            console.log(`🚀 Server running on: http://localhost:${PORT}`);
            console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
            console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
            console.log(`🗄️  Database: MySQL (${process.env.DB_DATABASE})`);
            console.log(`🔐 Authentication: Session-based (cookies)`);
            console.log('');
            console.log('Available Endpoints:');
            console.log('  POST   /api/users/register');
            console.log('  POST   /api/users/login');
            console.log('  POST   /api/users/logout');
            console.log('  GET    /api/users/profile (auth)');
            console.log('  POST   /api/posts (auth)');
            console.log('  GET    /api/posts');
            console.log('  GET    /api/posts/:id');
            console.log('  PUT    /api/posts/:id (auth)');
            console.log('  DELETE /api/posts/:id (auth)');
            console.log('  POST   /api/posts/:postId/comments (auth)');
            console.log('  GET    /api/posts/:postId/comments');
            console.log('');
            console.log('Press Ctrl+C to stop the server');
            console.log('════════════════════════════════════════════════');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('\n👋 SIGTERM received, shutting down gracefully...');
    await closeDatabase();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('\n👋 SIGINT received, shutting down gracefully...');
    await closeDatabase();
    process.exit(0);
});

// Start the server
startServer();
