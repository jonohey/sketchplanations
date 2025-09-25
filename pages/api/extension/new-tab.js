import * as prismicH from "@prismicio/helpers";
import { track } from "@vercel/analytics";
import { kv } from "@vercel/kv";
import { client } from "services/prismic";

// Cache headers for better performance
// Note: No caching for random content to ensure each user gets a different sketch
const CACHE_HEADERS = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export default async (req, res) => {
  // Set CORS headers for browser extensions
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    // Fast weighted selection using KV store
    // 70% chance of newer sketches, 30% chance of older sketches
    const useNewerSketches = Math.random() < 0.7;
    
    let handle;
    if (useNewerSketches) {
      // Try to get from newer sketches set (if it exists)
      try {
        handle = await kv.srandmember("sketchplanations_newer");
      } catch (error) {
        // KV store not available locally, fallback to all sketches
        handle = await kv.srandmember("sketchplanations");
      }
      // Fallback to all sketches if newer set doesn't exist
      if (!handle) {
        handle = await kv.srandmember("sketchplanations");
      }
    } else {
      // Get from all sketches (includes older ones)
      handle = await kv.srandmember("sketchplanations");
    }
    
    if (!handle) {
      return res.status(404).json({ error: "No sketchplanations found" });
    }

    // Fetch full sketchplanation data from Prismic
    const sketchplanation = await client.getByUID("sketchplanation", handle, {
      fetch: [
        "sketchplanation.title",
        "sketchplanation.image",
        "sketchplanation.body",
        "sketchplanation.published_at",
        "sketchplanation.podcast_link_url",
        "sketchplanation.redbubble_link_url"
      ],
    });

    const { data, uid } = sketchplanation;
    
    // Build optimized image URLs using your existing Imgix setup
    const baseImageUrl = data.image.url.split('?')[0]; // Remove existing params
    const imageUrl = `${baseImageUrl}?auto=format,compress`;
    const imageUrlOptimised = `${baseImageUrl}?auto=format,compress&w=800&q=85`;
    
    // Build response optimized for Chrome extension
    const response = {
      uid,
      title: data.title,
      description: prismicH.asText(data.body),
      imageUrl,
      imageUrlOptimised,
      imageAlt: data.image.alt || data.title,
      pageUrl: `https://sketchplanations.com/${uid}`,
      redbubbleUrl: data.redbubble_link_url || null,
      podcastUrl: data.podcast_link_url,
      publishedAt: data.published_at,
    };

    // Track the event for analytics (non-blocking)
    try {
      track('browser-extension', { sketch: data.title });
    } catch (analyticsError) {
      // Don't fail the request if analytics fails
      console.warn("Analytics tracking failed:", analyticsError);
    }

    // Set cache headers
    res.setHeader("Cache-Control", CACHE_HEADERS["Cache-Control"]);
    res.setHeader("Pragma", CACHE_HEADERS["Pragma"]);
    res.setHeader("Expires", CACHE_HEADERS["Expires"]);
    
    res.status(200).json(response);
  } catch (error) {
    console.error("Extension API error:", error);
    
    // Don't expose internal error details in production
    const errorMessage = process.env.NODE_ENV === "production" 
      ? "Failed to fetch sketchplanation" 
      : error.message;
    
    res.status(500).json({ error: errorMessage });
  }
};
