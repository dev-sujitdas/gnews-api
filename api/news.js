export default async function handler(req, res) {  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
  const apiKey = process.env.GNEWS_API_KEY;
  const api = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=us&max=10&apikey=${apiKey}`;
  
  if (global.cachedNews && Date.now() - global.lastFetchTime < 15 * 60 * 1000) {
    return res.status(200).json(global.cachedNews);
  }

  try {
    const response = await fetch(api);
    const data = await response.json();

    global.cachedNews = data;
    global.lastFetchTime = Date.now();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
