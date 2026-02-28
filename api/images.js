import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

export default async function handler(req, res) {
  try {
    // Optional: support pagination if needed in future
    const { cursor } = req.query;

    const data = await cloudinary.api.resources({
      resource_type: "image",
      type: "upload",       // normal upload type
      prefix: "faecore/",   // your folder path
      max_results: 100,
      next_cursor: cursor
    });

    // Generate signed URLs for private folder access
    const urls = data.resources.map(r =>
      cloudinary.url(r.public_id, {
        secure: true,
        sign_url: true,
        expires_at: Math.floor(Date.now() / 1000) + 3600 // URLs valid for 1 hour
      })
    );

    res.status(200).json({
      images: urls,
      next_cursor: data.next_cursor || null
    });

  } catch (e) {
    console.error("Cloudinary fetch error:", e);
    res.status(500).json({ error: e.message });
  }
}