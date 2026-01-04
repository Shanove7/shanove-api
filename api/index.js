const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

// Config
const REAL_API_URL = 'https://api.ferdev.my.id/downloader/allinone';
const REAL_API_KEY = 'RS-e5vtb61yow'; 
const CUSTOM_AUTHOR = 'Shanove'; 

app.use(cors());
app.use(express.json());

// Endpoint Utama
app.get('/downloader/allinone', async (req, res) => {
    // ... (KODE LOGIKA SAMA PERSIS SEPERTI SEBELUMNYA) ...
    // Copy paste logika fetch dan manipulasi author di sini
    try {
        const { link } = req.query;
        if (!link) return res.status(400).json({ success: false, message: 'Link required' });

        const targetUrl = `${REAL_API_URL}?link=${encodeURIComponent(link)}&apikey=${REAL_API_KEY}`;
        const response = await fetch(targetUrl);
        const data = await response.json();

        if (data.author) data.author = CUSTOM_AUTHOR;
        if (data.data && data.data.author) data.data.author = CUSTOM_AUTHOR;
        
        return res.json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.json({ status: "Active", author: "Shanove" });
});

// PENTING: Ganti app.listen dengan ini untuk Vercel
module.exports = app;
