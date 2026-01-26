import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import mysql from 'mysql2/promise';

const MySQLStoreConstructor = MySQLStore(session);

export function createSessionMiddleware() {
    // Create MySQL connection pool for session store
    const connection = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'blog_db',
    });

    const sessionStore = new MySQLStoreConstructor({
        clearExpired: true,
        checkExpirationInterval: 900000, // 15 minutes
        expiration: parseInt(process.env.SESSION_MAX_AGE || '86400000'), // 24 hours
    }, connection);

    return session({
        secret: process.env.SESSION_SECRET || 'dev-session-secret',
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000'), // 24 hours
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'lax',
        },
    });
}
