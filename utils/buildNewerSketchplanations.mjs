import { kv } from "@vercel/kv";

import { newerSketchplanationUids } from "./fetchBuildCatalog.mjs";

const buildNewerSketchplanations = async ({ sketchplanations } = {}) => {
  // Only run on Vercel where KV store is available
  if (process.env.VERCEL !== "1") {
    console.log("[buildNewerSketchplanations] Skipping - KV store not available locally");
    return;
  }

  console.time("[buildNewerSketchplanations]");
  console.log("[buildNewerSketchplanations] Starting...");

  const newerUids = newerSketchplanationUids(sketchplanations);

  await kv.del("sketchplanations_newer");
  if (newerUids.length > 0) {
    await kv.sadd("sketchplanations_newer", ...newerUids);
  }

  console.log(`[buildNewerSketchplanations] Added ${newerUids.length} newer sketches`);
  console.timeEnd("[buildNewerSketchplanations]");
};

export default buildNewerSketchplanations;
