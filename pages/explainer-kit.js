import {
	Check,
	CircleAlert,
	Download,
	FileText,
	Layers,
	Lightbulb,
	Palette,
	Search,
	Shield,
	Target,
} from "lucide-react";
import { Inter, Libre_Baskerville } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import styles from "styles/landing.module.css";

import DraggableIconsCanvas from "components/DraggableIconsCanvas";
import { pageTitle } from "helpers";
import explainerKitCopyPasteImage from "images/explainer-kit/explainer-kit-copy-paste.png";
import explainerKitHeroImage from "images/explainer-kit/explainer-kit-hero-flying.png";

const inter = Inter({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--lp-font-sans",
});

const libreBaskerville = Libre_Baskerville({
	subsets: ["latin"],
	weight: ["400", "700"],
	style: ["normal", "italic"],
	variable: "--lp-font-serif",
});

const sketchIcons = [
	{ src: "/images/explainer-kit/sketch-icons/angry@0.5x.png", scale: 1.3 },
	{ src: "/images/explainer-kit/sketch-icons/anxious@0.5x.png", scale: 1.3 },
	{
		src: "/images/explainer-kit/sketch-icons/blue-check-2@0.5x.png",
		scale: 0.7,
	},
	{
		src: "/images/explainer-kit/sketch-icons/bored-on-phone@0.5x.png",
		scale: 1.3,
	},
	{
		src: "/images/explainer-kit/sketch-icons/calendar-plan@0.5x.png",
		scale: 1.15,
	},
	{
		src: "/images/explainer-kit/sketch-icons/checkbox-red@0.5x.png",
		scale: 0.75,
	},
	{ src: "/images/explainer-kit/sketch-icons/cogs-2@0.5x.png", scale: 0.85 },
	{ src: "/images/explainer-kit/sketch-icons/impatient@0.5x.png", scale: 1.3 },
	{
		src: "/images/explainer-kit/sketch-icons/knotty-thought-2@0.5x.png",
		scale: 0.85,
	},
	{
		src: "/images/explainer-kit/sketch-icons/lightbulb-partial@0.5x.png",
		scale: 0.9,
	},
	{
		src: "/images/explainer-kit/sketch-icons/metal-detecting@0.5x.png",
		scale: 1.5,
	},
	{ src: "/images/explainer-kit/sketch-icons/puzzling@0.5x.png", scale: 1.3 },
	{
		src: "/images/explainer-kit/sketch-icons/red-check-1@0.5x.png",
		scale: 0.65,
	},
	{ src: "/images/explainer-kit/sketch-icons/sad@0.5x.png", scale: 1 },
	{ src: "/images/explainer-kit/sketch-icons/singing@0.5x.png", scale: 1 },
	{
		src: "/images/explainer-kit/sketch-icons/slot-machine@0.5x.png",
		scale: 1.2,
	},
	{
		src: "/images/explainer-kit/sketch-icons/thinking-bubble@0.5x.png",
		scale: 0.9,
	},
	{
		src: "/images/explainer-kit/sketch-icons/thinking-hard-person@0.5x.png",
		scale: 1.3,
	},
	{
		src: "/images/explainer-kit/sketch-icons/thought-bubble-3@0.5x.png",
		scale: 0.85,
	},
	{
		src: "/images/explainer-kit/sketch-icons/up-down-chart@0.5x.png",
		scale: 1.1,
	},
	{
		src: "/images/explainer-kit/sketch-icons/wide-end-arrow@0.5x.png",
		scale: 1,
	},
	{ src: "/images/explainer-kit/sketch-icons/writing@0.5x.png", scale: 1.1 },
];

const checkoutUrl =
	"https://pzpzck-rt.myshopify.com/products/sketchplanations-explainer-kit?utm_source=copyToPasteBoard&utm_medium=product-links&utm_content=web";

const description =
	"267 hand-drawn people, icons, metaphors, frameworks and backgrounds to copy or download into your slides, docs and talks. Browse and search the web library. Commercial use included.";

const scrollToId = (id) => (e) => {
	e.preventDefault();
	const reduceMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	document
		.getElementById(id)
		?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
};

const ExplainerKit = () => {
	return (
		<div
			className={`${styles["landing-page"]} min-h-screen flex flex-col ${inter.variable} ${libreBaskerville.variable}`}
		>
			<Head>
				<title>{pageTitle("Sketchplanations Explainer Kit")}</title>
				<meta name="description" content={description} />
				<link
					rel="canonical"
					href="https://sketchplanations.com/explainer-kit"
				/>

				{/* Open Graph Meta Tags */}
				<meta property="og:title" content="Sketchplanations Explainer Kit" />
				<meta property="og:description" content={description} />
				<meta
					property="og:url"
					content="https://sketchplanations.com/explainer-kit"
				/>
				<meta property="og:site_name" content="Sketchplanations" />
				<meta property="og:type" content="product" />
				<meta
					property="og:image"
					content="https://sketchplanations.com/kit/thumbs/person-flying-page.webp"
				/>

				{/* Twitter Card Meta Tags */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@sketchplanator" />
				<meta name="twitter:title" content="Sketchplanations Explainer Kit" />
				<meta name="twitter:description" content={description} />
				<meta
					name="twitter:image"
					content="https://sketchplanations.com/kit/thumbs/person-flying-page.webp"
				/>
			</Head>

			{/* Landing Page Header */}
			<header className={styles["lp-header"]}>
				<div
					className={`${styles["lp-container"]} max-w-5xl px-4 h-16 flex items-center justify-between`}
				>
					<Link href="/">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src="/logo.svg"
							alt="Sketchplanations"
							className={styles["lp-header-logo"]}
						/>
					</Link>
					<a
						href="#buy"
						onClick={scrollToId("buy")}
						className={`${styles["lp-btn-cta"]} text-sm px-4 py-2`}
					>
						Get the kit
					</a>
				</div>
			</header>

			<main className="flex-1">
				{/* Hero Section */}
				<section
					id="hero"
					className={`px-4 pt-6 pb-6 md:px-8 md:pt-10 md:pb-8 ${styles["lp-bg-gradient"]}`}
				>
					<div className={`${styles["lp-container"]} max-w-5xl`}>
						<div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
							{/* Text content */}
							<div>
								<p
									className={`text-sm font-semibold uppercase tracking-wider mb-4 ${styles["lp-text-accent"]}`}
								>
									Version 1 now available
								</p>
								<h1 className={`${styles["lp-heading-xl"]} mb-4`}>
									Visual tools to explain ideas clearly
								</h1>
								<p
									className={`text-lg md:text-xl ${styles["lp-text-muted"]} leading-relaxed mb-4`}
								>
									A growing web library of hand-drawn Sketchplanations visuals
									you can copy or download straight into your work.
								</p>
								<p className={`text-lg ${styles["lp-prose"]} mb-5 max-w-xl`}>
									Make complex ideas easier to explain and easier to remember.
								</p>
								<div className="flex flex-col sm:flex-row gap-4">
									<a
										href={checkoutUrl}
										className={`${styles["lp-btn-cta"]} ${styles["lp-btn-cta-lg"]}`}
									>
										Get the kit for £39
									</a>
									<a
										href="#whats-included"
										onClick={scrollToId("whats-included")}
										className={styles["lp-btn-outline"]}
									>
										See what&apos;s included
									</a>
								</div>
								<p className={`text-sm ${styles["lp-text-muted"]} mt-4`}>
									267 visuals &middot; One-time purchase &middot; Free updates
								</p>
								<p
									className={`text-sm ${styles["lp-text-muted"]} mt-2 flex items-center gap-1`}
								>
									<Check className={`w-4 h-4 ${styles["lp-text-accent"]}`} />
									30-day money-back guarantee
								</p>
							</div>

							{/* Hero image */}
							<div className="flex justify-center">
								<Image
									src={explainerKitHeroImage}
									alt="A hand-drawn person flying with jet engines on a wing, leaving trails behind"
									className="w-full max-w-xs lg:max-w-sm h-auto"
									sizes="(min-width: 1024px) 384px, 320px"
									priority
									placeholder="blur"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* Problems Section */}
				<section
					id="problems"
					className={`${styles["lp-section"]} ${styles["lp-bg-secondary"]}`}
				>
					<div className={`${styles["lp-container"]} max-w-4xl`}>
						<div className="text-center mb-12">
							<h2
								className={`${styles["lp-heading"]} text-3xl md:text-4xl mb-4`}
							>
								The problems you&apos;re facing
							</h2>
							<p
								className={`text-lg ${styles["lp-text-muted"]} max-w-2xl mx-auto mb-2`}
							>
								You know what you want to say. But getting it to land is harder,
								and can be more work, than you&apos;d like it to be.
							</p>
							<p
								className={`text-lg ${styles["lp-text-muted"]} max-w-2xl mx-auto`}
							>
								This kit is for you if:
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-6 mb-8">
							{[
								{
									text: "You're not sure of the best way to get your message to really land",
								},
								{
									text: "You want people to relate emotionally to your content",
								},
								{
									text: "Your message is complex and you'd like to help people get it",
								},
								{
									text: 'You\'re tired of visuals that feel stale, cheesy, or overly "business-y"',
								},
								{
									text: "You'd like to add a personal, human touch — but drawing isn't your strength",
								},
								{
									text: "You want to leverage the best of Sketchplanations for your work",
								},
								{ text: "You want to bring your content to life" },
							].map((problem, index) => (
								<div key={index} className={`${styles["lp-card"]} p-6`}>
									<div className="flex gap-4">
										<div className={styles["lp-icon-container"]}>
											<CircleAlert />
										</div>
										<p className={styles["lp-prose"]}>{problem.text}</p>
									</div>
								</div>
							))}
						</div>

						<div className={`text-center ${styles["lp-prose"]}`}>
							<p>
								Sometimes the hard part isn&apos;t the idea—it&apos;s explaining
								it well.
							</p>
						</div>
					</div>
				</section>

				{/* What this kit is */}
				<section id="what-it-is" className={styles["lp-section"]}>
					<div className={`${styles["lp-container"]} max-w-4xl`}>
						<div className="grid lg:grid-cols-2 gap-12 items-center">
							<div>
								<h2
									className={`${styles["lp-heading"]} text-3xl md:text-4xl mb-6`}
								>
									What this kit is
								</h2>
								<p className={`text-lg ${styles["lp-prose"]} mb-6`}>
									The Sketchplanations Explainer Kit is a growing web library of{" "}
									<strong>clear, approachable, reusable visuals</strong> you can
									copy or download straight into your slides, documents or
									articles to help your ideas land.
								</p>
								<p className={`text-lg ${styles["lp-prose"]} mb-8`}>
									It is designed for people who already know what they want to
									say, but want help saying it more clearly, memorably, and
									confidently, without the hassle of drawing.
								</p>

								<p
									className={`text-lg font-semibold ${styles["lp-text-primary"]} mb-4`}
								>
									Use it to:
								</p>
								<div className="space-y-3">
									{[
										{ icon: Lightbulb, text: "Explain complex ideas simply" },
										{ icon: Palette, text: "Add interest without gimmicks" },
										{
											icon: Target,
											text: "Make your thinking easier to follow",
										},
									].map((item, index) => (
										<div key={index} className="flex items-start gap-3">
											<div
												className={`${styles["lp-icon-container-highlight"]} ${styles["lp-icon-container"]}`}
											>
												<item.icon />
											</div>
											<span className={`text-lg ${styles["lp-prose"]}`}>
												{item.text}
											</span>
										</div>
									))}
								</div>
							</div>

							<div
								className={`rounded-2xl p-8 md:p-12 ${styles["lp-gradient-warm"]}`}
							>
								<div className="grid grid-cols-2 gap-4">
									{[
										{
											name: "thinking-hard-person",
											alt: "Person thinking hard",
										},
										{ name: "lightbulb-partial", alt: "Lightbulb half lit" },
										{ name: "puzzling", alt: "Person puzzling over something" },
										{ name: "up-down-chart", alt: "Chart going up and down" },
									].map((icon) => (
										<div
											key={icon.name}
											className={`${styles["lp-card"]} p-4 flex items-center justify-center aspect-square`}
										>
											<Image
												src={`/images/explainer-kit/sketch-icons/${icon.name}@0.5x.png`}
												alt={icon.alt}
												width={120}
												height={120}
												sizes="120px"
												className="w-auto h-full max-h-28 object-contain"
											/>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* What's included */}
				<section
					id="whats-included"
					className={`${styles["lp-section"]} ${styles["lp-bg-primary"]} scroll-mt-16`}
				>
					<div className={`${styles["lp-container"]} max-w-4xl`}>
						<div className="text-center mb-12">
							<h2
								className={`${styles["lp-heading"]} text-3xl md:text-4xl mb-4`}
							>
								What&apos;s included
							</h2>
							<p className="text-lg opacity-90 max-w-2xl mx-auto">
								Everything you need to start creating clearer explanations
								immediately.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-6 mb-12">
							{[
								{
									icon: Layers,
									title: "267 visuals and growing",
									description:
										"People, icons, metaphors, frameworks and backgrounds, with new visuals added over time at no extra cost",
								},
								{
									icon: Search,
									title: "A searchable web library",
									description:
										"Browse by category or search by what you want to say, and see the latest additions",
								},
								{
									icon: Download,
									title: "Copy or download",
									description:
										"Transparent PNGs in full and half size, ready for PowerPoint, Google Slides, Keynote, Figma or Canva",
								},
								{
									icon: FileText,
									title: "Commercial licence",
									description:
										"Use them in client work, presentations, courses, books and websites, and edit them to fit",
								},
							].map((item, index) => (
								<div key={index} className={`${styles["lp-card-primary"]} p-6`}>
									<div className="flex gap-4">
										<div
											className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${styles["lp-bg-highlight-solid"]}`}
										>
											<item.icon
												className={`w-6 h-6 ${styles["lp-text-highlight-foreground"]}`}
											/>
										</div>
										<div>
											<h3 className="text-xl font-semibold mb-2">
												{item.title}
											</h3>
											<p className="opacity-90">{item.description}</p>
										</div>
									</div>
								</div>
							))}
						</div>

						<div
							className={`${styles["lp-card-primary"]} rounded-2xl p-8 text-center`}
						>
							<h3 className="text-xl font-semibold mb-6">
								I thought about the types of visuals that help most in
								presentations.
								<br />
								Visual types include:
							</h3>
							<div className="flex flex-wrap justify-center gap-3">
								{[
									"People and characters (95)",
									"Icons and objects (86)",
									"Metaphors (38)",
									"Frameworks and diagrams (33)",
									"Simple backgrounds (15)",
								].map((format, index) => (
									<span key={index} className={styles["lp-badge"]}>
										<Check
											className={`w-5 h-5 ${styles["lp-text-highlight"]}`}
										/>
										{format}
									</span>
								))}
							</div>
						</div>

						<DraggableIconsCanvas icons={sketchIcons} />

						<p className="text-center mt-8 opacity-90">
							All content is designed to be mixed, reused, and adapted across
							your talks, workshops, and internal communication. Make it work
							for you.
						</p>
					</div>
				</section>

				{/* Dead simple to use */}
				<section id="how-to-use" className={styles["lp-section"]}>
					<div className={`${styles["lp-container"]} max-w-5xl`}>
						<div className="text-center mb-12">
							<h2
								className={`${styles["lp-heading"]} text-3xl md:text-4xl mb-4`}
							>
								Dead simple to use
							</h2>
							<p className={`text-lg ${styles["lp-text-muted"]}`}>
								No learning curve. Just find what you need and drop it in.
							</p>
						</div>

						<div className="flex flex-col items-center gap-8 max-w-lg mx-auto">
							<div className="rounded-xl overflow-hidden shadow-md w-full">
								<Image
									src={explainerKitCopyPasteImage}
									alt="A visual being copied from the library and pasted into a slide"
									className="w-full h-auto"
									sizes="(min-width: 512px) 512px, 100vw"
									placeholder="blur"
								/>
							</div>
							<ol className="space-y-5 w-full">
								{[
									{
										icon: Search,
										title: "Browse or search the web library",
										text: "Find people, icons, metaphors, frameworks and backgrounds by category, or search for what you want to say.",
									},
									{
										icon: Download,
										title: "Copy or download",
										text: "Copy a visual straight to your clipboard or download it as a transparent PNG.",
									},
									{
										icon: Layers,
										title: "Drop it into your work",
										text: "Paste or drag it into your slides, docs or articles, then mix and resize to suit.",
									},
								].map((step, index) => (
									<li key={index} className="flex gap-4">
										<div className={styles["lp-icon-container"]}>
											<step.icon />
										</div>
										<div>
											<p
												className={`font-semibold ${styles["lp-text-primary"]}`}
											>
												{step.title}
											</p>
											<p className={styles["lp-text-muted"]}>{step.text}</p>
										</div>
									</li>
								))}
							</ol>
						</div>
					</div>
				</section>

				{/* Why this helps */}
				<section id="why-it-helps" className={styles["lp-section"]}>
					<div className={`${styles["lp-container"]} max-w-4xl`}>
						<div className="text-center mb-12">
							<h2
								className={`${styles["lp-heading"]} text-3xl md:text-4xl mb-4`}
							>
								Why this helps your ideas land
							</h2>
							<p className={`text-lg ${styles["lp-text-muted"]}`}>
								Visuals are not just decoration.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-6 mb-8">
							{[
								{ text: "Guide attention" },
								{ text: "Bring structure" },
								{ text: "Create emotional connection" },
								{ text: "Make your ideas sticky" },
								{ text: "Reduce cognitive load" },
							].map((benefit, index) => (
								<div
									key={index}
									className={`p-6 rounded-xl ${styles["lp-gradient-subtle"]}`}
								>
									<div className="flex items-center gap-4">
										<div className={styles["lp-icon-container"]}>
											<Check />
										</div>
										<span
											className={`font-semibold ${styles["lp-text-primary"]} text-lg`}
										>
											{benefit.text}
										</span>
									</div>
								</div>
							))}
						</div>

						<p className={`text-center text-lg ${styles["lp-prose"]}`}>
							The Explainer Kit helps people{" "}
							<strong>follow your thinking</strong>, not just look at it (or
							worse, glaze over).
						</p>
					</div>
				</section>

				<section
					id="what-it-helps-you-do"
					className={`${styles["lp-section"]} ${styles["lp-bg-secondary"]}`}
				>
					<div className={`${styles["lp-container"]} max-w-4xl`}>
						<div className="text-center mb-12">
							<h2
								className={`${styles["lp-heading"]} text-3xl md:text-4xl mb-4`}
							>
								What the Explainer Kit helps you do
							</h2>
						</div>

						<div className="space-y-4">
							{[
								"Get your message across more effectively",
								"Make presentations feel more human and engaging",
								"Spend less time fiddling with slides",
								"Bring ideas to life without needing to draw",
							].map((benefit, index) => (
								<div
									key={index}
									className={`flex items-center gap-4 p-5 rounded-xl ${styles["lp-gradient-subtle"]}`}
								>
									<div className={styles["lp-icon-container"]}>
										<Check />
									</div>
									<span
										className={`font-semibold ${styles["lp-text-primary"]}`}
									>
										{benefit}
									</span>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Where this comes from */}
				<section id="background" className={styles["lp-section"]}>
					<div className={`${styles["lp-container"]} max-w-3xl text-center`}>
						<h2 className={`${styles["lp-heading"]} text-3xl md:text-4xl mb-6`}>
							Where this comes from
						</h2>
						<p className={`text-lg ${styles["lp-prose"]} mb-6`}>
							This kit is built on more than a decade of{" "}
							<strong>Sketchplanations</strong> — a long-running project focused
							on explaining ideas clearly through simple visuals.
						</p>
						<p className={`text-lg ${styles["lp-prose"]} mb-8`}>
							It draws on experience explaining{" "}
							<strong>over 1,000 concepts</strong> to a large global audience,
							and on professional work centred on helping ideas land.
						</p>

						<div className="flex flex-wrap justify-center gap-8 text-center">
							<div className={styles["lp-stat"]}>
								<div className={styles["lp-stat-value"]}>1,000+</div>
								<div className={styles["lp-stat-label"]}>
									Sketchplanations created
								</div>
							</div>
							<div className={styles["lp-stat"]}>
								<div className={styles["lp-stat-value"]}>13+</div>
								<div className={styles["lp-stat-label"]}>Years of visuals</div>
							</div>
						</div>
					</div>
				</section>

				{/* FAQ */}
				<section
					id="faq"
					className={`${styles["lp-section"]} ${styles["lp-bg-secondary"]}`}
				>
					<div className={`${styles["lp-container"]} max-w-3xl`}>
						<h2
							className={`${styles["lp-heading"]} text-3xl md:text-4xl mb-8 text-center`}
						>
							FAQ
						</h2>
						<dl className="space-y-6">
							{[
								{
									q: "How do I get access?",
									a: "After you buy, I'll email you the link and password for the web library.",
								},
								{
									q: "How is this different from the website?",
									a: "The Explainer Kit is a library of high-resolution, presentation-ready elements with transparent backgrounds that you can combine to explain ideas clearly. You can still find individual concept sketches on the website.",
								},
								{
									q: "What format do the visuals come in?",
									a: "Transparent PNGs, in full and half size. Copy them from the web library or download them, then drop them into slides, documents or design tools.",
								},
								{
									q: "Are updates included?",
									a: "Yes. New visuals are added to the library regularly at no extra cost.",
								},
								{
									q: "Can I use it commercially?",
									a: (
										<>
											Yes. Use the visuals in client decks, presentations,
											courses, books, websites and marketing, and edit them to
											fit. You can&apos;t resell or share the files, use them in
											logos, or use them to train AI. See the{" "}
											<a
												href="/kit/licence"
												className={`${styles["lp-text-accent"]} underline`}
											>
												full kit licence
											</a>
											.
										</>
									),
								},
								{
									q: "Can my team use it?",
									a: (
										<>
											Each licence is for one named person. For colleagues or a
											team licence, email{" "}
											<a
												href="mailto:jono.hey@gmail.com"
												className={`${styles["lp-text-accent"]} underline`}
											>
												jono.hey@gmail.com
											</a>
											.
										</>
									),
								},
								{
									q: "Can I customise the visuals?",
									a: "The kit focuses on ready-to-use PNG visuals that work out of the box. Editable versions may come later based on feedback.",
								},
							].map((item) => (
								<div key={item.q}>
									<dt
										className={`font-semibold ${styles["lp-text-primary"]} text-lg mb-1`}
									>
										{item.q}
									</dt>
									<dd
										className={`${styles["lp-prose"]} ${styles["lp-text-muted"]}`}
									>
										{item.a}
									</dd>
								</div>
							))}
						</dl>
						<p className={`text-center ${styles["lp-text-muted"]} mt-8`}>
							What am I missing? Let me know:{" "}
							<a
								href="mailto:jono.hey@gmail.com"
								className={`${styles["lp-text-accent"]} underline`}
							>
								jono.hey@gmail.com
							</a>
						</p>
					</div>
				</section>

				{/* Buy */}
				<section id="buy" className={`${styles["lp-section"]} scroll-mt-16`}>
					<div className={`${styles["lp-container"]} max-w-md`}>
						<div className={`${styles["lp-card"]} rounded-3xl overflow-hidden`}>
							<div className={`p-8 text-center ${styles["lp-bg-primary"]}`}>
								<p className="text-sm font-semibold uppercase tracking-wider opacity-90 mb-2">
									Explainer Kit
								</p>
								<div className="flex items-baseline justify-center gap-2 mb-2">
									<span className={styles["lp-price-current"]}>£39</span>
								</div>
								<p className="text-sm opacity-90">One-time purchase</p>
							</div>

							<div className="p-8">
								<ul className="space-y-3 mb-6">
									{[
										"Access to the web library of 267 visuals",
										"Search, browse, copy or download transparent PNGs",
										"Free updates as new visuals are added",
										"Commercial-use licence for one named person",
									].map((perk, index) => (
										<li key={index} className={styles["lp-check-item"]}>
											<div className={styles["lp-check-icon"]}>
												<Check />
											</div>
											<span>{perk}</span>
										</li>
									))}
								</ul>

								<p className={`text-sm ${styles["lp-text-muted"]} mb-6`}>
									After you buy, I&apos;ll email you the link and password for
									the web library.
								</p>

								<div className="text-center mb-4">
									<a href={checkoutUrl} className={styles["lp-btn-cta"]}>
										Get the kit for £39
									</a>
								</div>

								<div
									className={`flex items-center justify-center gap-2 text-sm ${styles["lp-text-muted"]}`}
								>
									<Shield className="w-4 h-4" />
									<span>Secure checkout</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Guarantee */}
				<section
					id="guarantee"
					className={`${styles["lp-section"]} ${styles["lp-bg-highlight"]}`}
				>
					<div className={`${styles["lp-container"]} max-w-3xl text-center`}>
						<div
							className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${styles["lp-bg-accent-soft"]}`}
						>
							<Shield className={`w-8 h-8 ${styles["lp-text-accent"]}`} />
						</div>

						<h2 className={`${styles["lp-heading"]} text-2xl md:text-3xl mb-4`}>
							30-day money-back guarantee
						</h2>

						<p className={`text-lg ${styles["lp-prose"]} max-w-2xl mx-auto`}>
							If you&apos;re not satisfied, contact me within 30 days for a full
							refund.
						</p>
					</div>
				</section>

				{/* Final CTA */}
				<section
					id="final-cta"
					className={`${styles["lp-section"]} ${styles["lp-bg-primary"]}`}
				>
					<div className={`${styles["lp-container"]} max-w-3xl text-center`}>
						<h2 className={`${styles["lp-heading"]} text-3xl md:text-4xl mb-4`}>
							Important ideas deserve clear visuals
						</h2>
						<p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
							Don&apos;t let complexity hide your best thinking. Start creating
							explanations that stick with the Sketchplanations Explainer Kit.
						</p>
						<a
							href={checkoutUrl}
							className={`${styles["lp-btn-highlight"]} ${styles["lp-btn-cta-lg"]}`}
						>
							Get the Explainer Kit for £39
						</a>
					</div>
				</section>
			</main>

			{/* Landing Page Footer */}
			<footer className={styles["lp-footer"]}>
				<div className={`${styles["lp-container"]} max-w-5xl`}>
					<p>
						&copy; {new Date().getFullYear()} Sketchplanations. All rights
						reserved.
					</p>
					<div className="flex justify-center gap-4 mt-2">
						<Link href="/">Main site</Link>
						<span>&middot;</span>
						<a href="/kit/licence">Kit licence</a>
						<span>&middot;</span>
						<Link href="/privacy">Privacy</Link>
					</div>
				</div>
			</footer>
		</div>
	);
};

// Use custom layout (no global header/footer)
ExplainerKit.getLayout = (page) => page;

export default ExplainerKit;
