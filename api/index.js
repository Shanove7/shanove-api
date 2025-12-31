// Endpoint Utama: https://domain-kamu.vercel.app/api?type={endpoint}&{params}
// Contoh: /api?type=igdl&url=...
// Contoh: /api?type=text2img&text=...

export default async function handler(req, res) {
    // 1. Setup CORS (Biar bisa dipanggil dari mana aja)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 2. Ambil Parameter
    // "type" adalah nama endpoint di api-faa (misal: igdl, tiktok, brat)
    const { type, ...queryParams } = req.query;

    if (!type) {
        return res.status(400).json({
            status: false,
            creator: "Shanove-Api",
            message: "Parameter 'type' wajib diisi. Contoh: ?type=igdl&url=..."
        });
    }

    try {
        // 3. Susun Query String (Meneruskan semua parameter: url, text, q, dll)
        const queryString = new URLSearchParams(queryParams).toString();
        
        // 4. Tembak ke API-FAA (Proxy)
        // Kita gunakan endpoint dinamis sesuai 'type'
        const targetUrl = `https://api-faa.my.id/faa/${type}?${queryString}`;
        
        const response = await fetch(targetUrl);
        const data = await response.json();

        // 5. Modifikasi Respon (Rebranding)
        // Kita ganti creator asli dengan nama kamu
        if (data) {
            data.creator = "Shanove-Api (P.R.O)";
        }

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({
            status: false,
            creator: "Shanove-Api",
            message: "Terjadi kesalahan pada server pusat (Upstream Error).",
            error: error.message
        });
    }
}
