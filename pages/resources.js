import FancyLink from "components/FancyLink";
import { pageTitle } from "helpers";
import Head from "next/head";
import Image from "next/image";
import sketchplanationsStudioSetupImage from "../images/sketchplanations-studio-setup.jpg";

const Resources = () => {
	return (
		<>
			<Head>
				<title>{pageTitle("Resources")}</title>
				<meta
					name="description"
					content="Recommended gear, products and podcast tools that I use for Sketchplanations."
				/>
				<link rel="canonical" href="https://sketchplanations.com/resources" />
				<meta property="og:title" content="Resources" />
				<meta property="og:description" content="Recommended gear, products and podcast tools that I use for Sketchplanations." />
				<meta property="og:url" content="https://sketchplanations.com/resources" />
				<meta property="og:image" content="https://sketchplanations.com/images/sketchplanations-studio-setup.jpg" />
				<meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content="Recommended gear, products and podcast tools that I use for Sketchplanations" />
                <meta property="twitter:image" content="https://sketchplanations.com/images/sketchplanations-studio-setup.jpg" />
				<meta name="twitter:image:alt" content="Sketchplanations studio setup" />
                <meta property="twitter:description" content="Recommended gear, products and podcast tools that I use for Sketchplanations" />
			</Head>
			<div className="max-w-3xl mx-auto px-5 pb-16">
				<main className="prose max-w-none">
					<div className="mb-4 mt-12">
						<h1 className="text-center">Resources</h1>
						<p className="lead">
							A lot of people ask me what I use. Here are the gear, products and tools I use for sketching, podcasting and general useful things.
						</p>
					</div>
					<figure className="my-8">
						<Image
							src={sketchplanationsStudioSetupImage}
							alt="Sketchplanations studio setup"
							priority
							fetchPriority="high"
							placeholder="blur"
							sizes="(max-width: 768px) calc(100vw - 2.5rem), 728px"
							quality={75}
							className="w-full h-auto mb-1"
						/>
						<figcaption className="text-center text-sm text-gray-600">
							My studio for Sketchplanations drawing, podcasting and music.
						</figcaption>
					</figure>
                    <div>
                        <p className="text-sm text-gray-500">Disclaimer: This page contains affiliate links as it helps me. For some of these links if you make a purchase, I may earn a small commission at no additional cost to you. Feel free to purchase wherever works for you.
                            I mostly use Amazon links as I'm able to localise links by country so they are more useful.
                        </p>
                    </div>
                    
                    <div id="sketching-gear">
						<h2>Sketching Gear</h2>
						<p>
							Here are the tools I use and like for sketching:
						</p>
                        <h3>Tech</h3>
                        <p>
                            <strong><FancyLink href="https://amzn.to/4pJSNmN" target="_blank" rel="noopener noreferrer">iPad Pro 2024</FancyLink></strong>
                            <br/>I use an iPad Pro for sketching. Specifically, the model I use is the 13-inch 2024 iPad Pro Wi-Fi 1TB with nano-texture glass. The nano-texture glass definitely does help with a more natural screen and easier drawing in bright environments. And it feels just a little bit nicer with the Apple Pencil.
                        </p>
                        <p>
                            <strong><FancyLink href="https://geni.us/apple-pencil-pro-sp" target="_blank" rel="noopener noreferrer">Apple Pencil Pro</FancyLink></strong>
                            <br/>If you have an iPad and you want to draw you'll need one of these.
                        </p>
                        <p>
                            <strong><FancyLink href="https://geni.us/paperlike-folio-13" target="_blank" rel="noopener noreferrer">Paperlike Folio Case for iPad Pro 13”</FancyLink></strong>
                            <br/>If you have an expensive iPad you'll want to look after it. I'm very happy with the Paperlike Folio Case. Slim, good protection, with a handy flap to keep the pencil attached and safe.
                        </p>
                        <h3>Drawing Apps</h3>
                        <p>
                            <strong><FancyLink href="https://www.sketchbook.com/apps" target="_blank" rel="noopener noreferrer">Sketchbook Pro</FancyLink></strong>
                            <br/>I've used Sketchbook Pro nearly 1,000 sketches. It's not perfect but it's a great app and great value.
                        </p>
                        <p>
                            <strong><FancyLink href="https://procreate.com/" target="_blank" rel="noopener noreferrer">Procreate</FancyLink></strong>
                            <br/>Procreate is probably the most popular drawing app. I've used it for some sketches. It's incredible what it does though I find the interface a little frustrating at times. So many features hidden behind obscure gestures.
                        </p>
                        <h3>Note-taking</h3>
                        <p>
                            <strong><FancyLink href="https://geni.us/leuchtturm-a5-dot-soft" target="_blank" rel="noopener noreferrer">LEUCHTTURM1917 - Notebook Softcover Medium A5</FancyLink></strong>
                            <br/>Despite this digital world I still find a good paper notebook indispensable. My favourites are these soft cover A5, dotted ones from Leuchtturm1917. They are:
                        </p>
                        <ul>
                            <li>large enough that you can work on a double page and not be too restricted for space.</li>
                            <li>Dotted for a wonderful <FancyLink href="/ghost-grid">ghost grid</FancyLink> that helps with regular notes, drawings, tables and all and gets out of the way.</li>
                            <li>Not too far from <FancyLink href="/dont-let-your-thinking-be-limited-by-your-tools">your thinking not being limited by your tools</FancyLink>.</li>
                        </ul>
                        <p><FancyLink href="https://geni.us/moleskine-dotted-sp" target="_blank" rel="noopener noreferrer">Moleskine dotted notebooks</FancyLink> are also nice.</p>
                        <p>My original sketchplanations are drawn in <FancyLink href="https://geni.us/TjNGeIC" target="_blank" rel="noopener noreferrer">Pocket Moleskine Storyboard Notebooks</FancyLink> which I love but can be hard to find.</p>
                        <p>
                            <strong><FancyLink href="https://geni.us/mGlRmnv" target="_blank" rel="noopener noreferrer">uni-ball Vision Elite Rollerball Pens Fine Point Micro Tip, 0.5mm</FancyLink></strong>
                            <br/>I love the writing quality of these pens. The limited palette of Sketchplanations comes from the basic set of colours provided by uni-ball.
                        </p>
                        <p>
                            <strong><FancyLink href="https://geni.us/copic-markers-search" target="_blank" rel="noopener noreferrer">Copic markers</FancyLink></strong>
                            <br/>My Copic markers are still working beautifully over a decade after I bought them. Perfect for a little light shadowing, highlighting, and colour.
                            Mostly I used the <FancyLink href="https://geni.us/copic-cool-gray-1" target="_blank" rel="noopener noreferrer">Copic Cool Gray No.1</FancyLink>.
                        </p>
                        <p>
                            <strong><FancyLink href="https://kolo.com/products/lane-pen-sleeve?variant=41229485539416" target="_blank" rel="noopener noreferrer">Kolo Lane Pen Sleeve</FancyLink></strong>
                            <br/>A good friend generously bought me this Kolo Lane Pen Sleeve which is perfect for keeping a black and coloured pen in together and a third at a squeeze. If you carry pens all the time like I do you might like it.
                        </p>
                        <p>
                            <strong><FancyLink href="https://geni.us/pilot-sign-pen" target="_blank" rel="noopener noreferrer">Pilot Sign Pen</FancyLink></strong>
                            <br/>When I sign books I use the Pilot Sign Pen which does a lovely job.
                        </p>
                    </div>
                    
                    <p>I hope these are useful for you. Perhaps it might work as a gift guide also for someone you know who loves sketching and studio work.</p>
				</main>
			</div>
		</>
	);
};

export default Resources;

