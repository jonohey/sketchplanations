import tumblrRedirects from "./redirects-tumblr.mjs";

export default [
	// ---------------------
	// Core
	// ---------------------
	{
		source: "/subscribe",
		destination: "https://sketchplanations.substack.com/subscribe",
		permanent: false,
	},
	{
		source: "/shop",
		destination: "https://www.redbubble.com/people/sketchplanator/shop?asc=u",
		permanent: false,
	},
	{
		source: "/prints",
		destination: "https://www.redbubble.com/people/sketchplanator/shop?asc=u",
		permanent: false,
	},
	{
		source: "/podcast",
		destination: "https://podcast.sketchplanations.com/",
		permanent: true,
	},
	{
		source: "/book",
		destination: "/big-ideas-little-pictures",
		permanent: true,
	},
	{
		source: "/pay",
		destination: "https://buy.stripe.com/bJe14n5Pf5fM2xj9nN1Fe00",
		permanent: false,
	},
	{
		source: "/browser-extension",
		destination: "https://climbing-error-fa3.notion.site/New-Tab-Chrome-Extension-Sketchplanations-27ebf3f5521a80b797f3cffb0a8ec2f1?pvs=143",
		permanent: false,
	},
	{
		source: "/kit",
		destination: "/explainer-kit",
		permanent: true,
	},
	{
		source: "/font",
		destination: "https://buymeacoffee.com/sketchplanator/e/104842",
		permanent: false,
	},
	{
		source: "/projects",
		destination: "https://jonohey.github.io/sketchplanations-projects/",
		permanent: true,
	},
	{
		source: "/patreon",
		destination: "https://www.patreon.com/sketchplanations",
		permanent: false,
	},
	{
		source: "/music",
		destination: "https://linktr.ee/sketchplanations",
		permanent: false,
	},
	{
		source: "/sheet-music",
		destination: "https://shop.spotify.com/en/artist/729QwZLCsOw3JtZmbQSFTj/store",
		permanent: false,
	},

	// ---------------------
	// Convenience
	// ---------------------
	{
		source: "/styleguide",
		destination: "https://company-208276.frontify.com/d/iATaeFQL51Lv",
		permanent: false,
	},
	{
		source: "/travel-journal",
		destination: "https://issuu.com/palojono/docs/mindmap_travel_journal_hey",
		permanent: false,
	},
	{
		source: "/bigthink",
		destination: "https://bigthink.com/business/better-leadership-in-3-sketchplanations/",
		permanent: false,
	},

	// ---------------------
	// System
	// ---------------------
	{
		source: "/rss",
		destination: "/rss.xml",
		permanent: true,
	},
	{
		source: "/explore",
		destination: "/search",
		permanent: true,
	},
	{
		source: "/tags",
		destination: "/categories",
		permanent: true,
	},
	{
		source: "/tags/:tag",
		destination: "/categories/:tag",
		permanent: true,
	},
	{
		source: "/tagged/:tag",
		destination: "/categories/:tag",
		permanent: true,
	},

	// ---------------------
	// Aliases
	// ---------------------
	{
		source: "/license",
		destination: "https://sketchplanations.com/licence",
		permanent: true,
	},
	{
		source: "/big-ideas",
		destination: "/big-ideas-little-pictures",
		permanent: true,
	},
	{
		source: "/browse",
		destination: "/categories",
		permanent: true,
	},
	{
		source: "/sketchplanations",
		destination: "/",
		permanent: true,
	},
	{
		source: "/sketchplanator",
		destination: "/",
		permanent: true,
	},
	{
		source: "/microadventures",
		destination: "/microadventure",
		permanent: true,
	},

	// ---------------------
	// Updated urls
	// ---------------------
	{
		source: "/diminishing-returns",
		destination: "/law-of-diminishing-returns",
		permanent: true,
	},
	{
		source:
			"/great-britain-the-united-kingdom-and-the-british-isles-whats-the-difference",
		destination: "/great-britain-the-united-kingdom-whats-the-difference",
		permanent: true,
	},
	{
		source: "/autumn-leaves-and-the-compounds-that-cause-their-colours",
		destination: "/autumn-leaves",
		permanent: true,
	},
	{
		source: "/abilene",
		destination: "/the-abilene-paradox",
		permanent: true,
	},
	{
		source: "/what-drives-us-autonomy-mastery-purpose",
		destination: "/autonomy-mastery-purpose",
		permanent: true,
	},
	{
		source: "/what-drives-us",
		destination: "/autonomy-mastery-purpose",
		permanent: true,
	},
	{
		source: "/drive",
		destination: "/autonomy-mastery-purpose",
		permanent: true,
	},
	{
		source: "/second-cousins",
		destination: "/second-cousins-once-removed",
		permanent: true,
	},
	{
		source: "/2-factor-authentication",
		destination: "/2fa",
		permanent: true,
	},
	{
		source: "/owls-necks",
		destination: "/how-owls-necks-turn-so-far-round",
		permanent: true,
	},
	{
		source: "/the-effect-effect-dot",
		destination: "/the-effect-effect",
		permanent: true,
	},
	{
		source: "/the-virtuous-cycles-of-amazon-and-uber",
		destination: "/virtuous-cycle",
		permanent: true,
	},
	{
		source: "/what-is-a-blue-moon",
		destination: "/blue-moon",
		permanent: true,
	},
	{
		source: "/the-oxford-comma",
		destination: "/oxford-comma",
		permanent: true,
	},
	{
		source: "/origins-of-boxing-day",
		destination: "/boxing-day",
		permanent: true,
	},
	{
		source: "/orthogaphic-projection",
		destination: "/orthographic-projection",
		permanent: true,
	},
	{
		source: "/a-release-strategy-for-happier-customers-sooner",
		destination: "/release-strategy",
		permanent: true,
	},
	{
		source: "/speak-plainly",
		destination: "/how-to-speak-plainly-by-pooh-bear",
		permanent: true,
	},
	{
		source: "/respect-sleep",
		destination: "/exercise-and-sleep",
		permanent: true,
	},
	{
		source: "/rewrite-to-avoid-click-here",
		destination: "/click-here",
		permanent: true,
	},
	{
		source: "/an-americano-and-a-long-black-the-difference",
		destination: "/americano-long-black",
		permanent: true,
	},
	{
		source: "/know-your-dashes-the-hyphen-en-dash-and-em-dash",
		destination: "/know-your-dashes",
		permanent: true,
	},
	{
		source: "/venomous-poisonous-whats-the-difference",
		destination: "/venomous-poisonous",
		permanent: true,
	},
	{
		source: "/how-do-barnacles-move-anyway",
		destination: "/how-do-barnacles-move",
		permanent: true,
	},
	{
		source: "/how-to-tell-a-centipede-from-a-millipede",
		destination: "/centipede-millipede",
		permanent: true,
	},
	{
		source: "/energy-efficiency",
		destination: "/the-fifth-fuel-energy-efficiency",
		permanent: true,
	},
	{
		source: "/the-fifth-fuel",
		destination: "/the-fifth-fuel-energy-efficiency",
		permanent: true,
	},
	{
		source: "/quotiquette-the-etiquette-of-quoting",
		destination: "/quotiquette",
		permanent: true,
	},
	{
		source: "/whats-the-difference-between-a-dolphin-and-a-porpoise",
		destination: "/dolphin-porpoise",
		permanent: true,
	},
	{
		source: "/whats-the-difference-between-a-crocodile-and-an-alligator",
		destination: "/crocodile-alligator",
		permanent: true,
	},
	{
		source: "/whats-the-difference-between-a-tortoise-and-a-turtle",
		destination: "/tortoise-turtle",
		permanent: true,
	},
	{
		source: "/sharing",
		destination: "/sharing-your-work",
		permanent: true,
	},
	{
		source: "/surfing-breaks-beach-reef-and-point",
		destination: "/surfing-breaks",
		permanent: true,
	},
	{
		source: "/learn-kind-words-first-in-new-countries",
		destination: "/learn-kind-words-first",
		permanent: true,
	},
	{
		source: "/firehouse",
		destination: "/the-firehouse-effect",
		permanent: true,
	},
	{
		source: "/think-cradle-to-cradle",
		destination: "/cradle-to-cradle",
		permanent: true,
	},
	{
		source: "/the-stroop-test",
		destination: "/stroop-test",
		permanent: true,
	},
	{
		source: "/tie-a-sheet-bend-knot",
		destination: "/sheet-bend",
		permanent: true,
	},
	{
		source: "/u-shaped-and-v-shaped-valleys",
		destination: "/shapes-of-valleys",
		permanent: true,
	},
	{
		source: "/zopa",
		destination: "/zopa-zone-of-possible-agreement",
		permanent: true,
	},
	{
		source: "/there-are-2-trillion-combinations-of-an-8-character-password",
		destination: "/combinations-of-an-8-character-password",
		permanent: true,
	},
	{
		source: "/pollution-is-highly-localized-take-the-back-streets",
		destination: "/take-the-back-streets",
		permanent: true,
	},
	{
		source: "/pollution-is-highly-localized",
		destination: "/take-the-back-streets",
		permanent: true,
	},
	{
		source: "/maslow",
		destination: "/maslows-hierarchy-of-needs",
		permanent: true,
	},
	{
		source: "/a-new-angle-on-sharing",
		destination: "/share-by-default",
		permanent: true,
	},
	{
		source: "/clear-the-fog-with-a-redeye",
		destination: "/redeye",
		permanent: true,
	},
	{
		source: "/zpd",
		destination: "/zone-of-proximal-development",
		permanent: true,
	},
	{
		source: "/second-rule-of-improv-be-spontaneous",
		destination: "/be-spontaneous",
		permanent: true,
	},
	{
		source: "/first-rule-of-improv-accept-offers",
		destination: "/accept-offers",
		permanent: true,
	},
	{
		source: "/peel-a-post-it-so-it-doesnt-fall-down",
		destination: "/peel-a-post-it",
		permanent: true,
	},
	{
		source: "/roger-martins-knowledge-funnel",
		destination: "/knowledge-funnel",
		permanent: true,
	},
	{
		source: "/want-to-compose-just-sit-down-without-any-music",
		destination: "/compose",
		permanent: true,
	},
	{
		source: "/the-3rd-place",
		destination: "/the-third-place",
		permanent: true,
	},
	{
		source: "/learn-the-kano-model",
		destination: "/kano-model",
		permanent: true,
	},
	{
		source: "/on-parenting-childhood-is-not-a-race",
		destination: "/childhood-is-not-a-race",
		permanent: true,
	},
	{
		source: "/connect-with-a-colleague-through-affinities",
		destination: "/affinities",
		permanent: true,
	},

	// ---------------------
	// Legacy Tumblr post redirects
	// ---------------------
	...tumblrRedirects,
];
