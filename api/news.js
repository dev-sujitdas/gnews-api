import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
   const response = await fetch(api);
console.log("Status:", response.status);
const data = await response.json();
console.log("API response:", data);

if (!response.ok) {
  throw new Error("GNews API returned non-200 status");
}


    const apiKey = process.env.GNEWS_API_KEY;
    const api = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=us&max=10&apikey=${apiKey}`;

    const response = await fetch(api);
    const data = await response.json();

    await redis.set("gnews:top", data, { ex: 900 });

    return res.status(200).json({ source: "fresh", data });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Failed to fetch news" });
  }
}
