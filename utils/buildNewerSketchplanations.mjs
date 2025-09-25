import { kv } from "@vercel/kv";
import { client } from "../services/prismic.mjs";

const buildNewerSketchplanations = async () => {
  // Only run on Vercel where KV store is available
  if (process.env.VERCEL !== "1") {
    console.log("[buildNewerSketchplanations] Skipping - KV store not available locally");
    return;
  }

  console.time("[buildNewerSketchplanations]");
  console.log("[buildNewerSketchplanations] Starting...");

  // Get all sketches ordered by publication date (newest first)
  const allSketches = await client.getAllByType("sketchplanation", {
    fetch: ["sketchplanation.published_at"],
    orderings: [{ field: "my.sketchplanation.published_at", direction: "desc" }],
  });

  // Get the newer sketches (skip the first 365, which are the oldest)
  const newerSketches = allSketches.slice(0, -365); // Take all except the last 365
  const newerUids = newerSketches.map(({ uid }) => uid);

  // Clear and populate the newer sketches set
  await kv.del("sketchplanations_newer");
  if (newerUids.length > 0) {
    await kv.sadd("sketchplanations_newer", ...newerUids);
  }

  console.log(`[buildNewerSketchplanations] Added ${newerUids.length} newer sketches`);
  console.timeEnd("[buildNewerSketchplanations]");
};

export default buildNewerSketchplanations;
