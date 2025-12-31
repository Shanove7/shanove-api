export default async function handler(req, res) {
    // 1. Setup Header agar bisa diakses dari frontend (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 2. Ambil parameter type (nama fitur) dan sisa parameternya
    const { type, ...queryParams } = req.query;

    // Jika user lupa memasukkan tipe fitur
    if (!type) {
        return res.status(400).json({
            status: false,
            creator: "Shanove-API",
            message: "Parameter 'type' diperlukan. Contoh: /api/index?type=igdl&url=..."
        });
    }

    try {
        // 3. Susun URL untuk nembak ke server pusat (Faa)
        // Kita meneruskan semua parameter (url, q, text, dll) yang dikirim user
        const params = new URLSearchParams(queryParams).toString();
        const targetUrl = `https://api-faa.my.id/api/${type}?${params}`;

        // 4. Ambil data asli
        const response = await fetch(targetUrl);
        const data = await response.json();

        // 5. MANIPULASI / RE-BRANDING
        // Ini bagian penting untuk mengubah nama creator jadi punya kamu
        
        // Ubah di root object
        if (data.creator) data.creator = "Shanove-API";
        
        // Ubah di dalam result (jika ada)
        if (data.result && typeof data.result === 'object') {
            if (data.result.creator) data.result.creator = "Shanove-API";
        }

        // Tambahkan tanda tangan server kamu
        data.server_info = {
            powered_by: "Shanove-Cluster",
            status: "Active",
            time: new Date().toLocaleTimeString()
        };

        // 6. Kirim data yang sudah diedit ke user
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({
            status: false,
            creator: "Shanove-API",
            message: "Gagal mengambil data dari server pusat.",
            error: error.message
        });
    }
}

