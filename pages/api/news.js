import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv(); 

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const cached = await redis.get("gnews:top");
  if (cached) {
    return res.status(200).json(cached);
  }

  try {
    //const apiKey = process.env.GNEWS_API_KEY;
    const api = `https://api.mediastack.com/v1/news?access_key=d8f89db2a329fc7f8de47b8b6bec02e6&countries=za&category=business`;

    const response = await fetch(api);
    const data = await response.json();

    await redis.set("gnews:top", data, { ex: 900 }); // cache for 900s = 15 min

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch news" });
  }
}
