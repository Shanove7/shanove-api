export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Content-Type', 'application/json');

    // Ambil 'type' (nama endpoint) dan sisa parameter lainnya
    const { type, ...params } = req.query;

    if (!type) {
        return res.status(400).json({
            status: false,
            creator: "Shanove-Api",
            message: "Parameter 'type' wajib. Contoh: /api?type=igdl&url=..."
        });
    }

    try {
        // 1. Susun Query String dinamis (meneruskan url, text, q, dll)
        const queryString = new URLSearchParams(params).toString();
        
        // 2. Request ke Faa
        const targetUrl = `https://api-faa.my.id/faa/${type}?${queryString}`;
        const response = await fetch(targetUrl);
        const data = await response.json();

        // 3. Standarisasi Result (Biar rapi)
        // Kita paksa outputnya selalu punya format: { status, creator, result }
        const cleanResult = data.result || data.data || data.message || data;

        return res.status(200).json({
            status: true,
            creator: "Shanove-Api (P.R.O)",
            type: type.toUpperCase(),
            result: cleanResult
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            creator: "Shanove-Api",
            message: "Endpoint tidak ditemukan atau parameter salah.",
            original_error: error.message
        });
    }
}
