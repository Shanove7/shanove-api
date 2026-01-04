const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

const REAL_API_URL = 'https://api.ferdev.my.id/downloader/allinone';
const REAL_API_KEY = 'RS-e5vtb61yow'; 
const CUSTOM_AUTHOR = 'Shanove'; 

app.use(cors());
app.use(express.json());

// FUNGSI HANDLER UTAMA
const downloadHandler = async (req, res) => {
    try {
        const { link } = req.query;

        if (!link) {
            return res.status(400).json({
                success: false,
                author: CUSTOM_AUTHOR,
                message: 'Parameter "link" is required'
            });
        }

        const targetUrl = `${REAL_API_URL}?link=${encodeURIComponent(link)}&apikey=${REAL_API_KEY}`;
        const response = await fetch(targetUrl);
        const data = await response.json();

        // Manipulasi
        if (data.author) data.author = CUSTOM_AUTHOR;
        if (data.data && data.data.author) data.data.author = CUSTOM_AUTHOR;
        data.powered_by = "Shanove Engine";

        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// --- ROUTING PENTING ---
// Kita pasang handler di DUA kemungkinan path agar tidak miss
app.get('/downloader/allinone', downloadHandler);      // Jika Vercel memotong /api
app.get('/api/downloader/allinone', downloadHandler);  // Jika Vercel membiarkan /api

// Root check
app.get('/', (req, res) => res.json({ status: "Shanove API Ready!" }));
app.get('/api', (req, res) => res.json({ status: "Shanove API Ready!" }));

module.exports = app;



