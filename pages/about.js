import ChromeExtensionPromo from "components/ChromeExtensionPromo";
import FancyLink from "components/FancyLink";
import SubscribeFull from "components/SubscribeFull";
import { pageTitle } from "helpers";
import {
	Cloud,
	Instagram,
	Lightbulb,
	Linkedin,
	Pin,
	Twitter,
} from "lucide-react";
import Head from "next/head";
import Image from "next/image";

const About = () => {
	const aboutTitle = pageTitle("About");
	const aboutDescription =
		"Learn about the inspiration behind Sketchplanations, the process of creating weekly sketches, and how you can support the project.";
	const aboutUrl = "https://sketchplanations.com/about";
	const aboutImageUrl =
		"https://sketchplanations.com/images/about/jono-hey-sketchplanations-headshot.jpg";

	const personJsonLd = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: "Jono Hey",
		url: aboutUrl,
		image: aboutImageUrl,
		jobTitle: "Creator of Sketchplanations",
		description: "Creator of Sketchplanations and author of Big Ideas Little Pictures.",
		sameAs: [
			"https://uk.linkedin.com/in/jonohey",
		],
	};

	return (
		<>
			<Head>
				<title>{aboutTitle}</title>
				<meta name="description" content={aboutDescription} />
				<link rel="canonical" href={aboutUrl} />
				<meta property="og:type" content="profile" />
				<meta property="og:title" content={aboutTitle} />
				<meta property="og:description" content={aboutDescription} />
				<meta property="og:url" content={aboutUrl} />
				<meta property="og:image" content={aboutImageUrl} />
				<meta property="og:image:width" content="1024" />
				<meta property="og:image:height" content="681" />
				<meta
					property="og:image:alt"
					content="Jono Hey, creator of Sketchplanations and author of Big Ideas Little Pictures"
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={aboutTitle} />
				<meta name="twitter:description" content={aboutDescription} />
				<meta name="twitter:image" content={aboutImageUrl} />
				<meta
					name="twitter:image:alt"
					content="Jono Hey, creator of Sketchplanations and author of Big Ideas Little Pictures"
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
				/>
			</Head>
			<div id="top" className="max-w-3xl mx-auto px-5 pb-16">
				<div className="prose max-w-none">
					<div className="mb-4 mt-12">
						<h1 className="text-center">About Sketchplanations</h1>
						<p className="lead">
							Sketchplanations is my project to explain the world through simple sketches. Here you&apos;ll find how it started, how to follow and support it, and other handy information.
						</p>
					</div>

					<figure className="not-prose my-8">
						<Image
							src="/images/about/jono-hey-sketchplanations-headshot.jpg"
							alt="Jono Hey, creator of Sketchplanations and author of Big Ideas Little Pictures"
							width={1024}
							height={681}
							sizes="(max-width: 768px) 100vw, 768px"
							className="w-full h-auto rounded-2xl shadow-sm"
						/>
						<figcaption className="mt-3 text-sm text-textSubdued text-center">
							Me gazing hopefully into the distance. Photo: Carin Thakrar.
						</figcaption>
					</figure>

					<nav
						aria-label="About page sections"
						className="not-prose my-6 rounded-lg border border-border bg-bgHighlight px-4 py-3"
					>
						<p className="m-0 text-xs font-semibold uppercase tracking-wide text-textSubdued">
							On this page
						</p>
						<ul className="m-0 mt-2 grid list-none gap-2 p-0 text-sm sm:grid-cols-2">
							<li><a href="#support-me" className="text-blue dark:text-blueLight">Supporting Sketchplanations</a></li>
							<li><a href="#follow" className="text-blue dark:text-blueLight">Follow</a></li>
							<li><a href="#archive" className="text-blue dark:text-blueLight">Explore the archive</a></li>
							<li><a href="#podcast" className="text-blue dark:text-blueLight">Podcast</a></li>
							<li><a href="#backstory" className="text-blue dark:text-blueLight">The backstory</a></li>
							<li><a href="#using-sketchplanations" className="text-blue dark:text-blueLight">Using Sketchplanations</a></li>
							<li><a href="#translating-sketchplanations" className="text-blue dark:text-blueLight">Translating Sketchplanations</a></li>
							<li><a href="#about-me" className="text-blue dark:text-blueLight">About me</a></li>
							<li><a href="#other-bits" className="text-blue dark:text-blueLight">Other bits</a></li>
							<li><a href="#guest-posts" className="text-blue dark:text-blueLight">Do you accept guest posts?</a></li>
							<li><a href="#learn-to-sketch" className="text-blue dark:text-blueLight">Learn to sketch</a></li>
							<li><a href="#music" className="text-blue dark:text-blueLight">Music</a></li>
							<li><a href="#subscribe" className="text-blue dark:text-blueLight">Subscribe here</a></li>
						</ul>
					</nav>

					<div className="py-4">
						<p>
							<strong>Sketchplanations is now a book!</strong> I think you&apos;ll love{" "}
							<FancyLink href="/big-ideas-little-pictures">
								Big Ideas Little Pictures
							</FancyLink>{" "}
							(and you can now get some nice prints of the{" "}
							<FancyLink 
								href="https://www.redbubble.com/shop/ap/162403242?asc=u" 
								target="_blank" 
								rel="noopener noreferrer" 
								className="text-blue"
							>
								Sketchplanations Wave
							</FancyLink>{" "}
							from the cover)
						</p>

						<p>
							<strong>It&apos;s also a podcast</strong>. Prefer to listen to the ideas on your commute or while doing chores? I don&apos;t blame you. And now you can:{" "}
							<FancyLink href="/podcast" className="text-blue">
								Listen to the podcast
							</FancyLink>
						</p>

						<p>
							<strong>Looking to use a Sketchplanation?</strong> Please do! See the{" "}
							<FancyLink href="/licence" className="text-blue">
								licence page
							</FancyLink>{" "}
							for details.
						</p>
					</div>

					<ChromeExtensionPromo />

					<hr />

					<div id="support-me">
						<h2>Supporting Sketchplanations</h2>
						<p>
							Get each new weekly sketchplanation by{" "}
							<FancyLink href="/subscribe">
								subscribing for free.
							</FancyLink>
						</p>
						<p>
							You can also support me and the project with a paid subscription.
						</p>
						<p>
							<strong>Paid subscribers get:</strong>
						</p>
						<ul className="space-y-2">
							<li>Behind-the-scenes posts and reflections</li>
							<li>The full archive of high-res sketches, named and sorted for personal use</li>
							<li>Full access to the newsletter archives</li>
							<li><em>At the top tier:</em> access to the unique, handmade Sketchplanations font</li>
						</ul>
						<p>
							Going paid helps me keep the project going—and it means a lot.
						</p>
						<p>
							👉{" "}
							<FancyLink href="/subscribe">
								Explore paid options or support the project
							</FancyLink>
						</p>
						<p className="bg-bgHighlight border border-border px-2 py-0.5 rounded text-sm inline-block">
							5% of contributions go towards{" "}
							<a
								href="https://stripe.com/climate"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue">Stripe Climate projects
							</a>{" "}
							<Image 
								src="/images/stripe-climate-badge.svg" 
								alt="Stripe Climate" 
								width={20}
								height={20}
								className="inline-block align-middle mx-1"
							/>
						</p>
						<p className="mt-4">
							<a href="#top" className="inline-block text-sm text-blue hover:underline">
								Back to top ↑
							</a>
						</p>
					</div>
					
					<hr />

					<div id="follow">
						<h2>Follow</h2>
						<p>
							The best way to follow is by signing up to the weekly newsletter:{" "}
							<FancyLink href="/subscribe">subscribe here</FancyLink>.
						</p>
						<p className="mb-2">Other ways to follow:</p>
						<ul className="not-prose m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
							<li>
								<a
									href="https://www.instagram.com/sketchplanations/"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Follow Sketchplanations on Instagram"
									className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-blue dark:text-blueLight hover:bg-bgDarker transition-colors"
								>
									<Instagram size={16} aria-hidden="true" />
									Instagram
								</a>
							</li>
							<li>
								<a
									href="https://linkedin.com/company/sketchplanations"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Follow Sketchplanations on LinkedIn"
									className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-blue dark:text-blueLight hover:bg-bgDarker transition-colors"
								>
									<Linkedin size={16} aria-hidden="true" />
									LinkedIn
								</a>
							</li>
							<li>
								<a
									href="https://www.threads.net/@sketchplanations"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Follow Sketchplanations on Threads"
									className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-blue dark:text-blueLight hover:bg-bgDarker transition-colors"
								>
									<Lightbulb size={16} aria-hidden="true" />
									Threads
								</a>
							</li>
							<li>
								<a
									href="https://bsky.app/profile/sketchplanations.bsky.social"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Follow Sketchplanations on Bluesky"
									className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-blue dark:text-blueLight hover:bg-bgDarker transition-colors"
								>
									<Cloud size={16} aria-hidden="true" />
									Bluesky
								</a>
							</li>
							<li>
								<a
									href="https://pinterest.com/sketchplanations"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Follow Sketchplanations on Pinterest"
									className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-blue dark:text-blueLight hover:bg-bgDarker transition-colors"
								>
									<Pin size={16} aria-hidden="true" />
									Pinterest
								</a>
							</li>
							<li>
								<a
									href="https://twitter.com/sketchplanator"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Follow Sketchplanations on X (Twitter)"
									className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-blue dark:text-blueLight hover:bg-bgDarker transition-colors"
								>
									<Twitter size={16} aria-hidden="true" />
									X (Twitter)
								</a>
							</li>
						</ul>
						<p className="mt-4">
							<a href="#top" className="inline-block text-sm text-blue hover:underline">
								Back to top ↑
							</a>
						</p>
					</div>

					<hr />

					<div id="archive">
						<h2>Explore the archive</h2>
						<p>
							The sketches cover all sorts of topics. Try a{" "}
							<FancyLink href="/search" className="text-blue">
								search
							</FancyLink>{" "}
							or start from some common themes below to find what interests you:
						</p>
						<ul className="space-y-2">
							<li><FancyLink href="/categories/wellbeing">Wellbeing</FancyLink></li>
							<li><FancyLink href="/categories/productivity">Productivity</FancyLink></li>
							<li><FancyLink href="/categories/cognitive-bias">Cognitive bias</FancyLink></li>
							<li><FancyLink href="/categories/science">Science</FancyLink></li>
							<li><FancyLink href="/categories/framework">Framework</FancyLink></li>
							<li><FancyLink href="/categories/words">Words</FancyLink></li>
							<li><FancyLink href="/categories/food-and-drink">Food and drink</FancyLink></li>
							<li><FancyLink href="/categories/behavioral-economics">Behavioral economics</FancyLink></li>
							<li><FancyLink href="/categories/quote">Quotes</FancyLink></li>
							<li><FancyLink href="/categories/ideas">Ideas</FancyLink></li>
							<li><FancyLink href="/categories/drawing">Drawing</FancyLink></li>
							<li><FancyLink href="/categories/nature">Nature</FancyLink></li>
							<li><FancyLink href="/categories/weather">Weather</FancyLink></li>
							<li><FancyLink href="/categories/whats-the-difference-between">What&apos;s the difference between</FancyLink></li>
						</ul>
						<p>🔍{" "}
							<FancyLink href="/categories">
								Explore more themes
							</FancyLink>
						</p>
						<p className="mt-4">
							<a href="#top" className="inline-block text-sm text-blue hover:underline">
								Back to top ↑
							</a>
						</p>
					</div>

					<hr />

					<div id="podcast">
						<h2>The Sketchplanations Podcast: great conversations about ideas</h2>
						<figure className="not-prose my-6 max-w-xs sm:max-w-sm mx-auto md:my-2 md:ml-6 md:mr-0 md:w-56 md:max-w-none md:float-right">
							<Image
								src="/images/podcast/sketchplanations-podcast-cover-artwork.png"
								alt="Sketchplanations The Podcast cover artwork featuring Rob Bell, Tom Pellereau, and Jono Hey"
								width={1024}
								height={1024}
								sizes="(max-width: 640px) 20rem, (max-width: 768px) 24rem, 224px"
								className="w-full h-auto rounded-xl shadow-sm"
							/>
						</figure>
						<p>
							I&apos;ve learned that Sketchplanations helps you have great conversations about ideas. In 2023, we started doing just that with the Sketchplanations podcast.
						</p>
						<p>
							Together with{" "}
							<a 
								href="https://www.robbell.tv/" 
								target="_blank" 
								rel="noopener noreferrer" 
								className="text-blue"
							>
								Rob Bell
							</a>{" "}
							(TV presenter) and{" "}
							<a 
								href="https://twitter.com/inventor_tom" 
								target="_blank" 
								rel="noopener noreferrer" 
								className="text-blue"
							>
								Tom Pellereau
							</a>{" "}
							(inventor and former Apprentice UK winner), we take a sketch or several and dive into it.
						</p>
						<p>
							It sounded a little crazy to have a podcast about a sketch, but, somewhat to my surprise, it works brilliantly. I hope you enjoy it!
						</p>
						<p>🎧{" "}
							<FancyLink
								href="/podcast" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								Listen to the podcast
							</FancyLink>
						</p>
						<div className="clear-both" />
						<p className="mt-4">
							<a href="#top" className="inline-block text-sm text-blue hover:underline">
								Back to top ↑
							</a>
						</p>
					</div>

					<hr />

					<div id="backstory">
						<h2>The backstory</h2>
						<p>
							In 2012 my sister bought me{" "}
							<FancyLink
								href="https://amzn.to/3Gm3OYa" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								a book with a page every day
							</FancyLink>{" "}
							for a year for a sketch. I used it to practise my drawing.
						</p>
						<p>
							When I finished it I needed a new challenge. So I set myself the challenge of explaining something with a sketch—as explaining is a handy skill.
							Over 2013–14 I posted one sketchplanation a day. Since then I switched to one per week, and the quality improved.
						</p>
						<p>
							If you're interested in the tools I use, I listed them in the <FancyLink href="/resources">Resources</FancyLink> page
						</p>

						<p>
							Curious to see how I make them now?{" "}
							<FancyLink
								href="https://www.youtube.com/channel/UC0EUs8xX488NvnxpQe8Xi5Q" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								Watch me draw Sketchplanations on Youtube
							</FancyLink>
						</p>

						<p>
							If you have ideas for new sketchplanations or other ideas, do get in touch:{" "}
							<FancyLink href="mailto:jono.hey@gmail.com">
								jono.hey@gmail.com
							</FancyLink>
						</p>
						<p className="mt-4">
							<a href="#top" className="inline-block text-sm text-blue hover:underline">
								Back to top ↑
							</a>
						</p>
					</div>

					<hr />

					<div id="using-sketchplanations">
						<h2>Using Sketchplanations</h2>
						<p>
							If you would like to use a sketchplanation in a blog post or for non-commercial purposes, please go ahead. If you have a moment to email me where you used one, it makes me very happy. Check out the{" "}
							<FancyLink href="/licence">
								licence
							</FancyLink>{" "}
							page for details.
						</p>
						<p className="mt-4">
							<a href="#top" className="inline-block text-sm text-blue hover:underline">
								Back to top ↑
							</a>
						</p>
					</div>

					<div id="translating-sketchplanations">
						<h2>Translating Sketchplanations</h2>
						<p>
							I&apos;d love to make Sketchplanations available in more languages! If you want to submit a translated sketchplanation, I&apos;ve started to add them to a{" "}
							<FancyLink
								target="_blank"
								rel="noopener noreferrer"
								href="https://drive.google.com/drive/folders/1gGCCObciyjjd-3KHOUv-jm8PJAs2QuFy?usp=drive_link">
								translations folder
							</FancyLink>{" "}and plan to add them to the site.
						</p>
						<p>
							Have you translated a sketch or seen one around? Email translations to me at{" "}
							<FancyLink href="mailto:jono.hey@gmail.com?subject=Sketchplanation%20Translation">
								jono.hey@gmail.com
							</FancyLink>.
						</p>
						<p>
							For licensing details and translation guidelines, see the{" "}
							<FancyLink href="/licence">
								licence page
							</FancyLink>.
						</p>
						<p className="mt-4">
							<a href="#top" className="inline-block text-sm text-blue hover:underline">
								Back to top ↑
							</a>
						</p>
					</div>

					<hr />

					<div id="about-me">
						<h2>About me</h2>
						<p>
							👋 I&apos;m Jono Hey.{" "}(
							<FancyLink
								href="http://uk.linkedin.com/in/jonohey" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								Find me on LinkedIn
							</FancyLink>){" "}
						</p>

						<p>
							I&apos;m a father of two living in London. For many years, I&apos;ve worked in startups, product design, and software engineering. I do some advising and mentoring if that&apos;s of interest to you.
						</p>

						<p>
							I led product at{" "}
							<FancyLink
								href="https://www.zeneducate.com" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								Zen Educate
							</FancyLink>
							, UX and design at{" "}
							<a 
								href="https://www.nutmeg.com" 
								target="_blank" 
								rel="noopener noreferrer" 
								className="text-blue"
							>
								Nutmeg
							</a>
							, and was an associate at{" "}
							<FancyLink
								href="https://www.jumpassociates.com/" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								Jump Associates
							</FancyLink>
							. I got a PhD from the University of California at Berkeley in the San Francisco Bay Area on &quot;Framing in Design&quot;. However, I mostly like drawing and playing the piano.
						</p>
						<p className="mt-4">
							<a href="#top" className="inline-block text-sm text-blue hover:underline">
								Back to top ↑
							</a>
						</p>
					</div>

					<hr />

					<div id="other-bits">
						<h2>Other bits</h2>
						<p>
							I don&apos;t do anything with your data except your email address is stored by Substack if you{" "}
							<FancyLink
								href="https://sketchplanations.substack.com/subscribe" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								subscribe
							</FancyLink>
							. See more:{" "}
							<FancyLink href="/privacy">
								sketchplanations.com/privacy
							</FancyLink>
						</p>

						<p>
							If you buy something using links from the sketches—for example, buying a book I&apos;ve referenced from Amazon that explains a topic in depth—I may earn a commission as an Amazon affiliate. This helps me keep making them, but feel free to buy elsewhere.
						</p>
						<p className="mt-4">
							<a href="#top" className="inline-block text-sm text-blue hover:underline">
								Back to top ↑
							</a>
						</p>
					</div>

					<div id="guest-posts">
						<h2>Do you accept guest posts?</h2>
						<p>No, I don&apos;t accept guest posts.</p>
						<p>
							You can probably see that unless you are planning to draw a sketch explaining something in Sketchplanations style with a topic that&apos;s not overly commercial while also being interesting and relevant to my audience, I&apos;m not interested in publishing a guest post promoting your site. Sorry.
						</p>
						<p className="mt-4">
							<a href="#top" className="inline-block text-sm text-blue hover:underline">
								Back to top ↑
							</a>
						</p>
					</div>

					<hr />

					<div id="learn-to-sketch">
						<h2>Want to learn to sketch?</h2>
						<p>
							A lot of people ask me about learning to sketch. The truth is I 100% think it&apos;s possible for everyone to learn. Nobody starts an expert. Like most things, it requires caring, work, and practice. If you&apos;d be interested in lessons or a short course from me, please let me know:{" "}
							<FancyLink href="mailto:jono.hey@gmail.com">
								jono.hey@gmail.com
							</FancyLink>
						</p>

						<p>
							Here are a few resources that you could start with. They&apos;re not for a classical art education — more about drawing to think and communicate better.
						</p>

						<h3>Books</h3>
						<ul className="space-y-2">
							<li>
								<FancyLink
									href="https://amzn.to/3X1gKbY" 
									target="_blank" 
									rel="noopener noreferrer"
								>
									Back of the Napkin
								</FancyLink>
								, Dan Roam — he has several newer books also
							</li>
							<li>
								<FancyLink
									href="https://amzn.to/3EvHKJg" 
									target="_blank" 
									rel="noopener noreferrer"
								>
									Rapid Viz
								</FancyLink>
								, Kurt Hanks and Larry Belliston
							</li>
							<li>
								<FancyLink
									href="https://amzn.to/3UZ3aEg" 
									target="_blank" 
									rel="noopener noreferrer"
								>
									Experiences in Visual Thinking
								</FancyLink>
								, Robert McKim
							</li>
							<li>
								Do the{" "}
								<FancyLink
									href="https://amzn.to/3Gm3OYa" 
									target="_blank" 
									rel="noopener noreferrer"
								>
									Sketch a Day
								</FancyLink	>{" "}
								for a year yourself
							</li>
							<li>
								<FancyLink
									href="https://amzn.to/3UO976O" 
									target="_blank" 
									rel="noopener noreferrer"
								>
									Envisaging Information
								</FancyLink>
								, Edward Tufte — full of beautiful examples, critiques and principle to help you present information clearly
							</li>
						</ul>

						<p>Sketchnoting — taking visual notes of talks, for example — is also popular and a great way to practise:</p>
						<ul className="space-y-2">
							<li>
								<FancyLink
									href="https://amzn.to/3GcBdVg" 
									target="_blank" 
									rel="noopener noreferrer"
								>
									The Sketchnote handbook
								</FancyLink>
								, Mike Rohde — and{" "}
								<FancyLink
									href="https://www.peachpit.com/store/sketchnote-handbook-video-the-illustrated-guide-to-9780133136142" 
									target="_blank" 
									rel="noopener noreferrer"
								>
									video course
								</FancyLink>
								, and{" "}
								<FancyLink
									href="https://sketchnotearmy.com/" 
									target="_blank" 
									rel="noopener noreferrer"
								>
									Sketchnote Army podcast
								</FancyLink>
							</li>
							<li>
								<FancyLink
									href="https://www.evalotta.net/" 
									target="_blank" 
									rel="noopener noreferrer"
								>
									Eva-Lotta Lamm
								</FancyLink>{" "}
								— lots of sketchnoting resources and great examples, also{" "}
								<FancyLink
									href="https://www.domestika.org/en/courses/4382-sketchnoting-communicate-with-visual-notes/evalotta⁠" 
									target="_blank" 
									rel="noopener noreferrer"
								>
									a course
								</FancyLink>
							</li>
						</ul>

						<h3>Other inspiration</h3>
						<ul className="space-y-2">
							<li>
								<FancyLink
									href="https://xkcd.com/" 
									target="_blank" 
									rel="noopener noreferrer"
								>
									xkcd
								</FancyLink>{" "}
								— proof that your sketching really doesn&apos;t have to be great to get the point across, though some of Randall Munroe&apos;s drawings these days are highly accomplished
							</li>
							<li>
								<FancyLink
									href="https://semi-rad.com/" 
									target="_blank" 
									rel="noopener noreferrer"
								>
									@semi_rad
								</FancyLink>
							</li>
						</ul>

						<p>
							And the real master is{" "}
							<FancyLink
								href="https://amzn.to/3g57ym7" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								Bill Watterson
							</FancyLink>{" "}
							🤩
						</p>
					
						<h3>Some Principles</h3>
						
						<h4>Copy, copy, copy</h4>
						<p>
							Before writing your own music it&apos;s typical to learn to play other music. The same is true of drawing. Whenever you see a drawing you like try and copy it. Look closely to see how they did it. See if you can do it just as well.
						</p>

						<h4>Practice</h4>
						<ul className="space-y-2">
							<li>Get a postcard sketchbook and send old-fashioned postcards. Bonus: you&apos;ll appreciate your surroundings a lot more on holiday if you take the time to sit, observe and draw</li>
							<li>
								Try practising with some of the{" "}
								<FancyLink href="/categories/drawing">
									drawing sketchplanations
								</FancyLink>
							</li>
							<li>
								Do the{" "}
								<FancyLink
									href="https://amzn.to/3Gm3OYa" 
									target="_blank" 
									rel="noopener noreferrer"
								>
									Sketch a Day
								</FancyLink>{" "}
								for a year yourself
							</li>
						</ul>

						<h4>Draw to think</h4>
						<p>
							Be the first on the whiteboard — physical or virtual. Need to figure something out? Start by putting some lines on paper. There&apos;s nothing wrong with boxes and arrows to start.
						</p>

						<h4>Persevere in the middle</h4>
						<p>
							Sketches often look bad in the middle (see{" "}
							<FancyLink href="/the-learning-pit">
								the learning pit
							</FancyLink>
							). It&apos;s a process. Don&apos;t give up because something looks rubbish. Keep working on it. See how you can correct it. You may learn more from figuring out why a sketch looks wrong than if you happen to get it right.
						</p>
						<p className="mt-4">
							<a href="#top" className="inline-block text-sm text-blue hover:underline">
								Back to top ↑
							</a>
						</p>
					</div>

					<hr />

					<div id="music">
						<h2>Music</h2>
						<p>I know you didn&apos;t come here for this, but I also write music. Have a listen:</p>

						<div className="my-8" id="latest-releases-playlist-embed">
							<iframe
								data-testid="embed-iframe"
								style={{ borderRadius: "12px" }}
								src="https://open.spotify.com/embed/playlist/5cavi1ykSQhqkejYZQmaLi?utm_source=generator&theme=0"
								width="100%"
								height="352"
								frameBorder="0"
								allowFullScreen={true}
								allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
								loading="lazy"
							></iframe>
						</div>

						<p>
							Listen on{" "}
							<FancyLink
								href="https://open.spotify.com/artist/729QwZLCsOw3JtZmbQSFTj?si=iwTwU9USS8Cqzdy4gHyS0g"
								target="_blank"
								rel="noopener noreferrer"
							>
								Spotify
							</FancyLink>
							,{" "}
							<FancyLink
								href="https://music.apple.com/gb/artist/jono-hey/1606865649"
								target="_blank"
								rel="noopener noreferrer"
							>
								Apple Music
							</FancyLink>
							,{" "}
							<FancyLink
								href="https://music.youtube.com/channel/UCW0Tp2FYfHrYymIOmtdQDGA?si=tSYa_In5kafd7WWU"
								target="_blank"
								rel="noopener noreferrer"
							>
								YouTube Music
							</FancyLink>
							,{" "}
							<FancyLink
								href="https://music.amazon.co.uk/artists/B09R4DKBCK/jono-hey?marketplaceId=A1F83G8C2ARO7P&musicTerritory=GB&ref=dm_sh_0xgEWCnKFSB5lWCI7dUNzqgkN"
								target="_blank"
								rel="noopener noreferrer"
							>
								Amazon Music
							</FancyLink>
						</p>

						<p>
							Do you play piano? You can{" "}
							<FancyLink
								href="https://pzpzck-rt.myshopify.com/" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								download or order the sheet music
							</FancyLink>
						</p>
						<p className="mt-4">
							<a href="#top" className="inline-block text-sm text-blue hover:underline">
								Back to top ↑
							</a>
						</p>
					</div>

					<hr />

					<div id="subscribe">
						<h2>Subscribe here</h2>
					</div>

					<SubscribeFull />
					<p className="mt-4">
						<a href="#top" className="inline-block text-sm text-blue hover:underline">
							Back to top ↑
						</a>
					</p>
				</div>
			</div>
		</>
	);
};

export default About;
