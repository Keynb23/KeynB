// routes/projectsRoutes.js

import express from 'express';

const mockAuth = (req, res, next) => {
    // TEMPORARY: This allows all requests to pass for now.
    const isAuthenticated = true; 
    
    if (isAuthenticated) {
        next();
    } else {
        res.status(401).send('Unauthorized: Login required for this action.');
    }
};

export default function projectRoutes(db) {
    const router = express.Router();

    // GET: All Projects
    router.get('/projects', async (req, res) => {
        try {
            const projects = await db.all("SELECT * FROM projects ORDER BY dateAdded DESC");
            res.json(projects);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch projects' });
        }
    });

    // GET: Latest 3 Projects
    router.get('/projects/latest', async (req, res) => {
        try {
            const latest = await db.all("SELECT * FROM projects ORDER BY dateAdded DESC LIMIT 3");
            res.json(latest);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch latest projects' });
        }
    });

    // POST: Create New Project
    router.post('/projects', mockAuth, async (req, res) => {
        const { title, summary, coverImage, links, source, tags, media } = req.body;
        
        if (!title || !summary || !coverImage) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const tagsString = JSON.stringify(tags);
        const mediaString = JSON.stringify(media);

        try {
            const result = await db.run(
                `INSERT INTO projects (title, summary, coverImage, links, source, tags, media) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [title, summary, coverImage, links || null, source || null, tagsString, mediaString]
            );

            res.status(201).json({ 
                message: 'Project created successfully', 
                id: result.lastID 
            });

        } catch (err) {
            console.error("DB Insert Error:", err);
            res.status(500).json({ error: 'Failed to create project' });
        }
    });

    return router;
}