import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const TOOLKIT_DIR = path.resolve(__dirname, "..");
export const REPO_ROOT = path.resolve(TOOLKIT_DIR, "../..");
export const DATA_DIR = path.join(REPO_ROOT, "data");
export const MERGE_PLAN_PATH = path.join(TOOLKIT_DIR, "tag-merge-plan.csv");

export const dateStamp = () => new Date().toISOString().slice(0, 10);
