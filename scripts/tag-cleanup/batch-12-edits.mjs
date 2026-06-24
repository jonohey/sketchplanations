/** Per-sketch tag edits for batch 12 (not expressible as simple merge rows). */
export const BATCH_ID = "12";

export const SKETCH_EDITS = [
	{
		uid: "plogging",
		removeSlugs: ["jogging"],
		addSlugs: ["sport", "health"],
		notes: "jogging → sport + health",
	},
	{
		uid: "wrap-up-your-keys-for-running",
		removeSlugs: ["jogging"],
		addSlugs: ["sport", "health"],
		notes: "jogging → sport + health",
	},
	{
		uid: "london-running-kit",
		removeSlugs: ["jogging"],
		addSlugs: ["health"],
		notes: "jogging → sport (already present) + health",
	},
	{
		uid: "the-importance-urgency-matrix",
		removeSlugs: ["priorities"],
		addSlugs: ["productivity"],
		notes: "priorities → productivity",
	},
	{
		uid: "kano-model",
		removeSlugs: ["priorities"],
		addSlugs: ["strategy"],
		notes: "priorities → design (already present) + strategy",
	},
];
