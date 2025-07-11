import FancyLink from "components/FancyLink";
import { pageTitle } from "helpers";
import Head from "next/head";
import Image from "next/image";

const About = () => {
	return (
		<>
			<Head>
				<title>{pageTitle("About")}</title>
				<meta
					name="description"
					content="Learn about the inspiration behind Sketchplanations, the process of creating weekly sketches, and how you can support the project."
				/>
				<link rel="canonical" href="https://sketchplanations.com/about" />
			</Head>
			<div className="max-w-3xl mx-auto px-5 pb-16">
				<div className="prose max-w-none">
					<div className="mb-4 mt-12">
						<h1 className="text-center">About Sketchplanations</h1>
						<p className="lead">
							Learn about the inspiration behind Sketchplanations, what&apos;s in the archive, how to follow Sketchplanations, the process of creating weekly sketches, and how you can support the project (me).
						</p>
					</div>

					<div className="py-4" id="book-support">
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
							<strong>My members on Patreon </strong>enable me to keep creating new sketches.{" "}
							<FancyLink
								href="/patreon"
								target="_blank"
								rel="noreferrer"
							>
								Support at any level is amazing</FancyLink>{" "}
							🙏
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

					<hr />

					<div id="follow">
						<h2>Follow</h2>
						<p>
							The best way to follow is by signing up to the weekly newsletter. I send one sketch a week with short commentary and sometimes a personal touch.
						</p>
						<p>
							👉{" "}
							<a 
								href="https://sketchplanations.substack.com/subscribe" 
								target="_blank" 
								rel="noopener noreferrer" 
								className="text-blue"
							>
								Subscribe to the weekly Sketchplanations newsletter
							</a>
						</p>

						<p>I also try to share sketches on social media, albeit with less commentary:</p>
						<ul className="space-y-2">
							<li>
								<a 
									href="https://www.instagram.com/sketchplanations/" 
									target="_blank" 
									rel="noopener noreferrer" 
									className="text-blue"
								>
									Instagram
								</a>
							</li>
							<li>
								<a 
									href="https://linkedin.com/company/sketchplanations" 
									target="_blank" 
									rel="noopener noreferrer" 
									className="text-blue"
								>
									LinkedIn
								</a>
							</li>
							<li>
								<a 
									href="https://www.threads.net/@sketchplanations" 
									target="_blank" 
									rel="noopener noreferrer" 
									className="text-blue"
								>
									Threads
								</a>
							</li>
							<li>
								<a 
									href="https://twitter.com/sketchplanator" 
									target="_blank" 
									rel="noopener noreferrer" 
									className="text-blue"
								>
									X (Twitter)
								</a>
							</li>
							<li>
								<a 
									href="https://pinterest.com/sketchplanations" 
									target="_blank" 
									rel="noopener noreferrer" 
									className="text-blue"
								>
									Follow on Pinterest
								</a>
							</li>
							<li>
								A newsletter app like{" "}
								<a 
									href="https://www.meco.app/get/95u7" 
									target="_blank" 
									rel="noopener noreferrer" 
									className="text-blue"
								>
									Meco
								</a>
							</li>
						</ul>
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
						<p>
							<FancyLink href="/categories">
								Explore more themes
							</FancyLink>
						</p>
					</div>

					<hr />

					<div id="support">
						<h2>Support Sketchplanations</h2>
						<p>
							Sketchplanations is a side project. Some people choose to support me to pay for the costs of the emails, website and time to do a good job. It makes an enormous difference.
						</p>
						<p>
							If you&apos;re in a position to support and like what I&apos;m doing, please consider supporting me by becoming a patron for a mere dollar a month or whatever you can:
						</p>
						<p>
							<a 
								href="/patreon" 
								target="_blank" 
								rel="noreferrer" 
								className="text-blue"
							>
								Become a patron
							</a>
						</p>
					</div>

					<hr />

					<div id="podcast">
						<h2>Sketchplanations the Podcast</h2>
						<p>
							In 2023, together with{" "}
							<a 
								href="https://www.robbell.tv/" 
								target="_blank" 
								rel="noreferrer" 
								className="text-blue"
							>
								Rob Bell
							</a>{" "}
							(TV presenter) and{" "}
							<a 
								href="https://twitter.com/inventor_tom" 
								target="_blank" 
								rel="noreferrer" 
								className="text-blue"
							>
								Tom Pellereau
							</a>{" "}
							(inventor and former Apprentice UK winner), we launched a podcast to accompany the sketches. In each episode, we take a sketch or several and dive into more detail. It might sound a little crazy to have a podcast about a sketch site, but, somewhat to my surprise, it works rather well. I hope you enjoy it!
						</p>
						<p>
							<FancyLink
								href="/podcast" 
								target="_blank" 
								rel="noreferrer"
							>
								Listen to the podcast
							</FancyLink>
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
							When I finished it I needed a new challenge. So I set myself the challenge of explaining something with a sketch — as explaining is a handy skill. Over 2013 -14 I posted one sketchplanation a day. Since then I switched to one per week, and the quality improved.
						</p>
						<p>
							I draw them using{" "}
							<FancyLink
								href="https://www.sketchbook.com/?locale=en" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								Sketchbook Pro
							</FancyLink>{" "}
							on an{" "}
							<FancyLink
								href="https://www.apple.com/ipad-pro/" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								iPad Pro
							</FancyLink>{" "}
							with the{" "}
							<FancyLink
								href="https://www.apple.com/apple-pencil/" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								Apple Pencil
							</FancyLink>
							. It took me a long time to go all fancy and digital, and I still kind of miss the analogue touch of the originals.
						</p>
						<p>
							The original ones are drawn in{" "}
							<FancyLink
								href="https://www.google.co.uk/search?q=moleskine+storyboard+notebook" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								Moleskine storyboard sketchbooks
							</FancyLink>{" "}
							(quite hard to find in stores). I used three{" "}
							<FancyLink
								href="https://www.staples.com/uni-ball-Vision-Elite-Rollerball-Pens-Micro-Point-Assorted-8-pk-58092PP/product_578480" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								Uniball Vision Elites
							</FancyLink>{" "}
							and a{" "}
							<FancyLink
								href="https://amzn.to/3jcEYf2" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								Copic marker
							</FancyLink>{" "}
							for the grey. I think it is the best combination of pens there is.
						</p>
						<p>At its best, making sketchplanations looks a bit like this:</p>
						
						<div className="w-full max-w-[30rem] mx-auto my-8">
							<Image 
								src="https://images.prismic.io/sketchplanations/fff10711-e476-4e15-957d-c39f41a47a60_Making+sketchplanations.jpg?auto=compress,format&fit=max&w=500" 
								alt="Notebook, pens, coffee — making Sketchplanations at its best" 
								className="block w-full rounded"
								width={500}
								height={300}
							/>
						</div>

						<p>
							Curious to see how I make them now?{" "}
							<FancyLink
								href="https://www.youtube.com/channel/UC0EUs8xX488NvnxpQe8Xi5Q" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								Watch me draw sketchplanations on Youtube
							</FancyLink>
						</p>

						<p>
							If you have ideas for new sketchplanations or other ideas, do get in touch:{" "}
							<FancyLink href="mailto:jono.hey@gmail.com">
								jono.hey@gmail.com
							</FancyLink>
						</p>

						<p>
							If you would like to use a sketchplanation in a blog post or for non-commercial purposes, please go ahead. If you have a moment to email me where you used one, it makes me very happy. Check out the{" "}
							<FancyLink href="/licence">
								licence
							</FancyLink>{" "}
							page for details.
						</p>

						<p>
							As is probably pretty obvious I don&apos;t accept guest posts, so please don&apos;t bother contacting me about it.
						</p>

						<p>
							I don&apos;t do anything with your data except store your email address in Mailjet (previously Mailchimp until they got too expensive) if you choose to{" "}
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
							If you buy something using links from the sketches — for example, buying a book that explains a topic in depth — I may earn a commission. Anything I earn directly or indirectly from sketchplanations helps me keep making them.
						</p>
					</div>

					<hr />

					<div id="about-me">
						<h2>About me</h2>
						<p>
							👋 I&apos;m Jono Hey.{" "}
							<FancyLink
								href="http://uk.linkedin.com/in/jonohey" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								Find me on LinkedIn
							</FancyLink>{" "}
							— where you can also follow me for the weekly sketches and midweek reposts from the archives.
						</p>

						<p>
							I&apos;m a father of two living in London. For many years, I&apos;ve worked in startups, product design, and software engineering.
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
								rel="noreferrer" 
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
							. I also have a PhD from the University of California at Berkeley in the San Francisco Bay Area. However, I mostly like drawing and playing the piano.
						</p>
					</div>

					<hr />

					<div id="guest-posts">
						<h2>Do you accept guest posts?</h2>
						<p>No, I don&apos;t accept guest posts.</p>
						<p>
							You can probably see that unless you are planning to draw a sketch explaining something in Sketchplanations style with a topic that&apos;s not overly commercial while also being interesting and relevant to my audience, I&apos;m not interested in publishing a guest post promoting your site. Sorry.
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
					</div>

					<hr />

					<div id="music">
						<h2>Music</h2>
						<p>I know you didn&apos;t come here for this, but I also write music. Have a listen:</p>

						<div className="my-8" id="deep-down-and-not-forgotten-embed">
							<iframe 
								style={{borderRadius: "12px"}} 
								src="https://open.spotify.com/embed/album/7fIFrkNpX7T3C2L2EI03T6?utm_source=generator" 
								width="100%" 
								height="352" 
								frameBorder="0" 
								allowFullScreen={true}
								allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
								loading="lazy"
							></iframe>
						</div>

						<div className="my-8" id="blossom-embed">
							<iframe 
								style={{borderRadius: "12px"}} 
								src="https://open.spotify.com/embed/album/2sIjVFbjnlAyMmQl4cdAZx?utm_source=generator" 
								width="100%" 
								height="352" 
								frameBorder="0" 
								allowFullScreen={true}
								allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
								loading="lazy"
							></iframe>
						</div>

						<div className="my-8" id="outro-embed">
							<iframe 
								style={{borderRadius: "12px"}} 
								src="https://open.spotify.com/embed/album/444xXPngvFEBKhOTSuFFZB?utm_source=generator" 
								width="100%" 
								height="352" 
								frameBorder="0" 
								allowFullScreen={true}
								allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
								loading="lazy"
							></iframe>
						</div>

						<p>
							<FancyLink
								href="https://ditto.fm/deep-down-and-not-forgotten" 
								target="_blank" 
								rel="noopener noreferrer"
							>
								Listen on other platforms
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
					</div>

					<hr />

					<div id="subscribe">
						<h2>Don&apos;t forget to <FancyLink href="/subscribe">subscribe</FancyLink></h2>
					</div>
				</div>
			</div>
		</>
	);
};

export default About;
