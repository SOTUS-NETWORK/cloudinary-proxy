import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

export default async function handler(req, res) {
  try {
    const data = await cloudinary.api.resources({
      type: "authenticated",
      max_results: 100
    });

    const urls = data.resources.map(r =>
      cloudinary.url(r.public_id, {
        type: "authenticated",
        sign_url: true,
        secure: true
      })
    );

    res.status(200).json(urls);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}