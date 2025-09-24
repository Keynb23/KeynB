// Backend/server.js

import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Import route handling functions (MUST include .js extension)
import projectRoutes from './routes/projectsRoutes.js';
import authRoutes from './routes/authRoutes.js'; 

const app = express();
const PORT = 3001; 

// Middleware
app.use(express.json()); 
app.use(cors()); 

let db;

async function initializeDB() {
    try {
        db = await open({
            filename: './portfolio.db', // Creates the database file here
            driver: sqlite3.Database
        });

        // Create the 'projects' table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                summary TEXT NOT NULL,
                coverImage TEXT NOT NULL,
                links TEXT,
                source TEXT,
                tags TEXT, 
                media TEXT, 
                dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        // Create the 'users' table (for future authentication)
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL
            );
        `);

        console.log('Database initialized successfully.');

    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

// Start the server after the database is ready
initializeDB().then(() => {
    
    // Pass the database object (db) to the imported route functions
    app.use('/api', projectRoutes(db)); 
    app.use('/api/auth', authRoutes(db));

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});