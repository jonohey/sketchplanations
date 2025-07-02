import { pageTitle } from "helpers";
import Head from "next/head";

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
			<div className="prose max-w-none">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-semibold mb-4">About Sketchplanations</h1>
				</div>
				
				<div className="space-y-6">
					<p>
						<strong>Sketchplanations is now a book!</strong> I think you'll love{" "}
						<a 
							href="/big-ideas-little-pictures?utm_source=website&utm_medium=about&utm_campaign=book-link&utm_id=big-ideas-book" 
							className="text-blue"
						>
							Big Ideas Little Pictures
						</a>{" "}
						(and you can now get some nice prints of the{" "}
						<a 
							href="https://www.redbubble.com/shop/ap/162403242?asc=u" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Sketchplanations Wave
						</a>{" "}
						from the cover)
					</p>

					<p>
						<strong>My members on Patreon </strong>enable me to keep creating new sketches.{" "}
						<a 
							href="https://patreon.com/sketchplanations" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Support at any level is amazing
						</a>{" "}
						🙏
					</p>

					<p>
						<strong>It's also a podcast</strong>. Prefer to listen to the ideas on your commute or while doing chores? I don't blame you. And now you can:{" "}
						<a 
							href="https://podcast.sketchplanations.com" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Listen to the podcast
						</a>
					</p>

					<p>
						<strong>Looking to use a Sketchplanation?</strong> Please do! See the{" "}
						<a href="/licence" className="text-blue">
							licence page
						</a>{" "}
						for details.
					</p>

					<h2 className="text-2xl font-semibold mt-12 mb-6">Follow</h2>
					<p>
						The best way to follow is by signing up to the weekly newsletter. I send one sketch a week with short commentary and sometimes a personal touch.
					</p>
					<p>
						👉{" "}
						<a 
							href="https://sketchplanations.substack.com/subscribe" 
							target="_blank" 
							rel="noopener" 
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
								rel="noopener" 
								className="text-blue"
							>
								Instagram
							</a>
						</li>
						<li>
							<a 
								href="https://linkedin.com/company/sketchplanations" 
								target="_blank" 
								rel="noopener" 
								className="text-blue"
							>
								LinkedIn
							</a>
						</li>
						<li>
							<a 
								href="https://www.threads.net/@sketchplanations" 
								target="_blank" 
								rel="noopener" 
								className="text-blue"
							>
								Threads
							</a>
						</li>
						<li>
							<a 
								href="https://twitter.com/sketchplanator" 
								target="_blank" 
								rel="noopener" 
								className="text-blue"
							>
								X (Twitter)
							</a>
						</li>
						<li>
							<a 
								href="https://pinterest.com/sketchplanations" 
								target="_blank" 
								rel="noopener" 
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
								rel="noopener" 
								className="text-blue"
							>
								Meco
							</a>
						</li>
					</ul>

					<h2 className="text-2xl font-semibold mt-12 mb-6">Explore the archive</h2>
					<p>
						The sketches cover all sorts of topics. Try a{" "}
						<a href="/search" className="text-blue">
							search
						</a>{" "}
						or start from some common themes below to find what interests you:
					</p>
					<ul className="space-y-2">
						<li><a href="/categories/wellbeing" className="text-blue">Wellbeing</a></li>
						<li><a href="/categories/productivity" className="text-blue">Productivity</a></li>
						<li><a href="/categories/cognitive-bias" className="text-blue">Cognitive bias</a></li>
						<li><a href="/categories/science" className="text-blue">Science</a></li>
						<li><a href="/categories/framework" className="text-blue">Framework</a></li>
						<li><a href="/categories/words" className="text-blue">Words</a></li>
						<li><a href="/categories/food-and-drink" className="text-blue">Food and drink</a></li>
						<li><a href="/categories/behavioral-economics" className="text-blue">Behavioral economics</a></li>
						<li><a href="/categories/quote" className="text-blue">Quotes</a></li>
						<li><a href="/categories/ideas" className="text-blue">Ideas</a></li>
						<li><a href="/categories/drawing" className="text-blue">Drawing</a></li>
						<li><a href="/categories/nature" className="text-blue">Nature</a></li>
						<li><a href="/categories/weather" className="text-blue">Weather</a></li>
						<li><a href="/categories/whats-the-difference-between" className="text-blue">What's the difference between</a></li>
					</ul>
					<p>
						<a href="/categories" className="text-blue">
							Explore more themes
						</a>
					</p>

					<h2 className="text-2xl font-semibold mt-12 mb-6">Support Sketchplanations</h2>
					<p>
						Sketchplanations is a side project. Some people choose to support me to pay for the costs of the emails, website and time to do a good job. It makes an enormous difference.
					</p>
					<p>
						If you're in a position to support and like what I'm doing, please consider supporting me by becoming a patron for a mere dollar a month or whatever you can:{" "}
						<a 
							href="https://www.patreon.com/sketchplanations" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							patreon.com/sketchplanations
						</a>
					</p>
					<p>
						<strong>
							<a 
								href="https://www.patreon.com/bePatron?u=8268514" 
								target="_blank" 
								rel="noopener" 
								className="text-blue"
							>
								Become a patron
							</a>
						</strong>
					</p>

					<h2 className="text-2xl font-semibold mt-12 mb-6">Sketchplanations the Podcast</h2>
					<p>
						In 2023, together with{" "}
						<a 
							href="https://www.robbell.tv/" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Rob Bell
						</a>{" "}
						(TV presenter) and{" "}
						<a 
							href="https://twitter.com/inventor_tom" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Tom Pellereau
						</a>{" "}
						(inventor and former Apprentice UK winner), we launched a podcast to accompany the sketches. In each episode, we take a sketch or several and dive into more detail. It might sound a little crazy to have a podcast about a sketch site, but, somewhat to my surprise, it works rather well. I hope you enjoy it!
					</p>
					<p>
						Listen at{" "}
						<a 
							href="https://podcast.sketchplanations.com/" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							podcast.sketchplanations.com
						</a>
					</p>

					<h2 className="text-2xl font-semibold mt-12 mb-6">The backstory</h2>
					<p>
						In 2012 my sister bought me{" "}
						<a 
							href="https://www.chroniclebooks.com/products/one-sketch-a-day" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							a book with a page every day
						</a>{" "}
						for a year for a sketch. I used it to practise my drawing.
					</p>
					<p>
						When I finished it I needed a new challenge. So I set myself the challenge of explaining something with a sketch — as explaining is a handy skill. Over 2013 -14 I posted one sketchplanation a day. Since then I switched to one per week, and the quality improved.{" "}
						<a 
							href="https://sketchplanations.substack.com/subscribe" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Subscribe by email to get new ones in your inbox each week
						</a>
						.
					</p>
					<p>
						I draw them using{" "}
						<a 
							href="https://www.sketchbook.com/?locale=en" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Sketchbook Pro
						</a>{" "}
						on an{" "}
						<a 
							href="https://www.apple.com/ipad-pro/" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							iPad Pro
						</a>{" "}
						with the{" "}
						<a 
							href="https://www.apple.com/apple-pencil/" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Apple Pencil
						</a>
						. It took me a long time to go all fancy and digital, and I still kind of miss the analogue touch of the originals.
					</p>
					<p>
						The original ones are drawn in{" "}
						<a 
							href="https://www.google.co.uk/search?q=moleskine+storyboard+notebook" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Moleskine storyboard sketchbooks
						</a>{" "}
						(quite hard to find in stores). I used three{" "}
						<a 
							href="https://www.staples.com/uni-ball-Vision-Elite-Rollerball-Pens-Micro-Point-Assorted-8-pk-58092PP/product_578480" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Uniball Vision Elites
						</a>{" "}
						and a{" "}
						<a 
							href="https://amzn.to/3jcEYf2" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Copic marker
						</a>{" "}
						for the grey. I think it is the best combination of pens there is.
					</p>
					<p>At its best, making sketchplanations looks a bit like this:</p>
					
					<div className="w-full max-w-[30rem] mx-auto my-8">
						<img 
							src="https://images.prismic.io/sketchplanations/fff10711-e476-4e15-957d-c39f41a47a60_Making+sketchplanations.jpg?auto=compress,format&fit=max&w=500" 
							alt="Notebook, pens, coffee — making Sketchplanations at its best" 
							className="block w-full rounded"
						/>
					</div>

					<p>
						Curious to see how I make them now?{" "}
						<a 
							href="https://www.youtube.com/channel/UC0EUs8xX488NvnxpQe8Xi5Q" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Watch me draw sketchplanations on Youtube
						</a>
					</p>

					<p>
						If you have ideas for new sketchplanations or other ideas, do get in touch:{" "}
						<a href="mailto:jono.hey@gmail.com" className="text-blue">
							jono.hey@gmail.com
						</a>
					</p>

					<p>
						If you would like to use a sketchplanation in a blog post or for non-commercial purposes, please go ahead. If you have a moment to email me where you used one, it makes me very happy. Check out the{" "}
						<a href="/licence" className="text-blue">
							licence
						</a>{" "}
						page for details.
					</p>

					<p>
						As is probably pretty obvious I don't accept guest posts, so please don't bother contacting me about it.
					</p>

					<p>
						I don't do anything with your data except store your email address in Mailjet (previously Mailchimp until they got too expensive) if you choose to{" "}
						<a 
							href="https://sketchplanations.substack.com/subscribe" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							subscribe
						</a>
						. See more:{" "}
						<a href="/privacy" className="text-blue">
							sketchplanations.com/privacy
						</a>
					</p>

					<p>
						If you buy something using links from the sketches — for example, buying a book that explains a topic in depth — I may earn a commission. Anything I earn directly or indirectly from sketchplanations helps me keep making them.
					</p>

					<h2 className="text-2xl font-semibold mt-12 mb-6">About me</h2>
					<p>
						👋 I'm Jono Hey.{" "}
						<a 
							href="http://uk.linkedin.com/in/jonohey" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Find me on LinkedIn
						</a>{" "}
						— where you can also follow me for the weekly sketches and midweek reposts from the archives.
					</p>

					<p>
						I'm a father of two living in London. For many years, I've worked in startups, product design, and software engineering.
					</p>

					<p>
						I led product at{" "}
						<a 
							href="https://www.zeneducate.com" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Zen Educate
						</a>
						, UX and design at{" "}
						<a 
							href="https://www.nutmeg.com" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Nutmeg
						</a>
						, and was an associate at{" "}
						<a 
							href="https://www.jumpassociates.com/" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Jump Associates
						</a>
						. I also have a PhD from the University of California at Berkeley in the San Francisco Bay Area. However, I mostly like drawing and playing the piano.
					</p>

					<p>
						👉 Want my view on your project?{" "}
						<a 
							href="https://calendly.com/jonohey/book-a-consultation-with-jono" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Book a paid 30-minute consultation
						</a>
					</p>

					<div className="mt-12">
						<p className="font-semibold">Do you accept guest posts?</p>
						<p>No, I don't accept guest posts.</p>
						<p>
							You can probably see that unless you are planning to draw a sketch explaining something in Sketchplanations style with a topic that's not overly commercial while also being interesting and relevant to my audience, I'm not interested in publishing a guest post promoting your site. Sorry.
						</p>
					</div>

					<h2 className="text-2xl font-semibold mt-12 mb-6">Want to learn to sketch?</h2>
					<p>
						A lot of people ask me about learning to sketch. The truth is I 100% think it's possible for everyone to learn. Nobody starts an expert. Like most things, it requires caring, work, and practice. If you'd be interested in lessons or a short course from me, please let me know:{" "}
						<a href="mailto:jono.hey@gmail.com" className="text-blue">
							jono.hey@gmail.com
						</a>
					</p>

					<p>
						Here are a few resources that you could start with. They're not for a classical art education — more about drawing to think and communicate better.
					</p>

					<h3 className="text-xl font-semibold mt-8 mb-4">Books</h3>
					<ul className="space-y-2">
						<li>
							<a 
								href="https://amzn.to/3X1gKbY" 
								target="_blank" 
								rel="noopener" 
								className="text-blue"
							>
								Back of the Napkin
							</a>
							, Dan Roam — he has several newer books also
						</li>
						<li>
							<a 
								href="https://amzn.to/3EvHKJg" 
								target="_blank" 
								rel="noopener" 
								className="text-blue"
							>
								Rapid Viz
							</a>
							, Kurt Hanks and Larry Belliston
						</li>
						<li>
							<a 
								href="https://amzn.to/3UZ3aEg" 
								target="_blank" 
								rel="noopener" 
								className="text-blue"
							>
								Experiences in Visual Thinking
							</a>
							, Robert McKim
						</li>
						<li>
							Do the{" "}
							<a 
								href="https://amzn.to/3Gm3OYa" 
								target="_blank" 
								rel="noopener" 
								className="text-blue"
							>
								Sketch a Day
							</a>{" "}
							for a year yourself
						</li>
						<li>
							<a 
								href="https://amzn.to/3UO976O" 
								target="_blank" 
								rel="noopener" 
								className="text-blue"
							>
								Envisaging Information
							</a>
							, Edward Tufte — full of beautiful examples, critiques and principle to help you present information clearly
						</li>
					</ul>

					<p>Sketchnoting — taking visual notes of talks, for example — is also popular and a great way to practise:</p>
					<ul className="space-y-2">
						<li>
							<a 
								href="https://amzn.to/3GcBdVg" 
								target="_blank" 
								rel="noopener" 
								className="text-blue"
							>
								The Sketchnote handbook
							</a>
							, Mike Rohde — and{" "}
							<a 
								href="https://www.peachpit.com/store/sketchnote-handbook-video-the-illustrated-guide-to-9780133136142" 
								target="_blank" 
								rel="noopener" 
								className="text-blue"
							>
								video course
							</a>
							, and{" "}
							<a 
								href="https://sketchnotearmy.com/" 
								target="_blank" 
								rel="noopener" 
								className="text-blue"
							>
								Sketchnote Army podcast
							</a>
						</li>
						<li>
							<a 
								href="https://www.evalotta.net/" 
								target="_blank" 
								rel="noopener" 
								className="text-blue"
							>
								Eva-Lotta Lamm
							</a>{" "}
							— lots of sketchnoting resources and great examples, also{" "}
							<a 
								href="https://www.domestika.org/en/courses/4382-sketchnoting-communicate-with-visual-notes/evalotta⁠" 
								target="_blank" 
								rel="noopener" 
								className="text-blue"
							>
								a course
							</a>
						</li>
					</ul>

					<h3 className="text-xl font-semibold mt-8 mb-4">Other inspiration</h3>
					<ul className="space-y-2">
						<li>
							<a 
								href="https://xkcd.com/" 
								target="_blank" 
								rel="noopener" 
								className="text-blue"
							>
								xkcd
							</a>{" "}
							— proof that your sketching really doesn't have to be great to get the point across, though some of Randall Munroe's drawings these days are highly accomplished
						</li>
						<li>
							<a 
								href="https://www.instagram.com/semi_rad" 
								target="_blank" 
								rel="noopener" 
								className="text-blue"
							>
								@semi_rad
							</a>
						</li>
					</ul>

					<p>
						And the real master is{" "}
						<a 
							href="https://amzn.to/3g57ym7" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Bill Watterson
						</a>{" "}
						🤩
					</p>

					<h2 className="text-2xl font-semibold mt-12 mb-6">Some Principles</h2>
					
					<h3 className="text-xl font-semibold mt-8 mb-4">Copy, copy, copy</h3>
					<p>
						Before writing your own music it's typical to learn to play other music. The same is true of drawing. Whenever you see a drawing you like try and copy it. Look closely to see how they did it. See if you can do it just as well.
					</p>

					<h3 className="text-xl font-semibold mt-8 mb-4">Practice</h3>
					<ul className="space-y-2">
						<li>Get a postcard sketchbook and send old-fashioned postcards. Bonus: you'll appreciate your surroundings a lot more on holiday if you take the time to sit, observe and draw</li>
						<li>
							Try practising with some of the{" "}
							<a href="/categories/drawing" className="text-blue">
								drawing sketchplanations
							</a>
						</li>
						<li>
							Do the{" "}
							<a 
								href="https://amzn.to/3Gm3OYa" 
								target="_blank" 
								rel="noopener" 
								className="text-blue"
							>
								Sketch a Day
							</a>{" "}
							for a year yourself
						</li>
					</ul>

					<h3 className="text-xl font-semibold mt-8 mb-4">Draw to think</h3>
					<p>
						Be the first on the whiteboard — physical or virtual. Need to figure something out? Start by putting some lines on paper. There's nothing wrong with boxes and arrows to start.
					</p>

					<h3 className="text-xl font-semibold mt-8 mb-4">Persevere in the middle</h3>
					<p>
						Sketches often look bad in the middle (see{" "}
						<a href="/the-learning-pit" className="text-blue">
							the learning pit
						</a>
						). It's a process. Don't give up because something looks rubbish. Keep working on it. See how you can correct it. You may learn more from figuring out why a sketch looks wrong than if you happen to get it right.
					</p>

					<h2 className="text-2xl font-semibold mt-12 mb-6">Music</h2>
					<p>I know you didn't come here for this, but I also write music. Have a listen:</p>
					
					<div className="my-8">
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

					<p>
						<a 
							href="https://ditto.fm/deep-down-and-not-forgotten" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							Listen on other platforms
						</a>
					</p>

					<p>
						Do you play piano? You can{" "}
						<a 
							href="https://pzpzck-rt.myshopify.com/" 
							target="_blank" 
							rel="noopener" 
							className="text-blue"
						>
							download or order the sheet music
						</a>
					</p>
				</div>
			</div>
		</>
	);
};

export default About;
