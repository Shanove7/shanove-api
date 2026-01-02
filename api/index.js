export default async function handler(req, res) {
  // 1. Setup CORS agar bisa ditembak dari website mana saja
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { prompt } = req.query;

  // 2. Validasi Parameter
  if (!prompt) {
    return res.status(400).json({
      status: false,
      creator: "Shanove",
      message: "Parameter 'prompt' is required."
    });
  }

  try {
    // 3. Request ke Upstream API (Hidden Key)
    const apiKey = 'RS-e5vtb61yow'; // Key Pribadi
    const targetUrl = `https://api.ferdev.my.id/ai/aicoding?apikey=${apiKey}&prompt=${encodeURIComponent(prompt)}`;
    
    const response = await fetch(targetUrl);
    const data = await response.json();

    // 4. Bungkus ulang Response (Re-branding)
    // Menghilangkan jejak API asli dan menampilkan Shanove
    const finalResponse = {
      status: true,
      creator: "Shanove",
      data: {
        query: prompt,
        answer: data.result || "No response from AI"
      }
    };

    res.status(200).json(finalResponse);

  } catch (error) {
    res.status(500).json({
      status: false,
      creator: "Shanove",
      message: "Internal Server Error"
    });
  }
}

