import dotenv from 'dotenv';
import { createApp } from './app';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = createApp();

app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║   Blog API - Clean Architecture Backend       ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log('');
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
    console.log('');
    console.log('Available Endpoints:');
    console.log('  POST   /api/users/register');
    console.log('  POST   /api/users/login');
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

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n👋 SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n👋 SIGINT received, shutting down gracefully...');
    process.exit(0);
});
