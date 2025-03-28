import { track } from '@vercel/analytics';
import { pageTitle } from "helpers";
import bigIdeasLittlePicturesCoverTransparentImage from "images/big-ideas-little-pictures-cover-transparent.png";
import coastlineParadox from "images/big-ideas-pages/big-ideas-book-spread-coastline-paradox.png";
import startingCompany from "images/big-ideas-pages/big-ideas-book-spread-Starting-a-company.png";
import swissCheeseModel from "images/big-ideas-pages/big-ideas-book-spread-Swiss-cheese-model.png";
import tsundoku from "images/big-ideas-pages/big-ideas-book-spread-Tsundoku.png";
import Head from "next/head";
import Image from "next/image";
import { useState } from 'react';

const OrderLink = ({ href, children }) => (
	<a
		href={href}
		target="_blank"
		rel="noopener noreferrer"
		className="inline-block px-6 py-2 rounded-full border border-rose-500 text-rose-500 hover:bg-rose-50 transition-colors"
		onClick={() => {
			track('Book-store-link', { location: children });
		}}
	>
		{children}
	</a>
);

const Book = () => {
	const [showMoreRegions, setShowMoreRegions] = useState(false);

	return (
		<>
			<Head>
				<title>{pageTitle("Big Ideas Little Pictures by Jono Hey")}</title>
				<meta
					name="description"
					content="Discover 'Big Ideas, Little Pictures' by Jono Hey—a delightful book that simplifies complex ideas with clear illustrations. Explore reviews, FAQs, see what's inside, and find out how to order your copy."
				/>
				<link rel="canonical" href="https://sketchplanations.com/big-ideas-little-pictures" />
			</Head>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12">
					<div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
						<div className="w-full md:w-1/2">
							<div className="text-center">
								<Image
									src={bigIdeasLittlePicturesCoverTransparentImage}
									alt="Big Ideas Little Pictures by Jono Hey"
									priority
									placeholder="blur"
									className="mx-auto"
								/>
								<div className="flex justify-center mt-4">
									{[...Array(5)].map((_, i) => (
										<span key={i} className="text-yellow-400 text-2xl">★</span>
									))}
								</div>
							</div>
						</div>
						<div className="w-full md:w-1/2">
							<blockquote className="text-xl md:text-2xl mb-4 font-medium">
								"This is such a cool book. The range of Jono's knowledge is astounding, and so is his ability to digest complex ideas into deceptively simple drawings. You'll learn something on every page—and be entertained too."
							</blockquote>
							<cite className="text-gray-600 dark:text-gray-300 block text-lg">
								— Bill Gates
							</cite>
						</div>
					</div>
					<div className="text-center mt-12 max-w-3xl mx-auto">
						<h1 className="text-4xl font-bold mb-2">Big Ideas Little Pictures</h1>
						<p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
							Explaining the world one sketch at a time
						</p>
						<p className="text-lg leading-relaxed">
							At last! Sketchplanations in a book. In this 288-page collection, Jono Hey collects together over 130 inspiring, funny and relatable sketches about life. Combining existing and new topics, Big Ideas Little Pictures is a perfect gift of the wisdom and joy of Sketchplanations.
						</p>
					</div>

					{/* Order section first */}
					<div className="mt-24 max-w-3xl mx-auto">
						<h2 className="text-3xl font-bold mb-8 text-center">Order Big Ideas Little Pictures</h2>
						<div className="space-y-12">
							{/* US & Canada Section */}
							<div className="text-center">
								<h3 className="text-xl font-semibold mb-4">US & Canada</h3>
								<div className="flex flex-wrap gap-4 justify-center">
									<OrderLink href="https://www.amazon.com/Big-Ideas-Little-Pictures-Sketchplanations/dp/1804190020/">Amazon</OrderLink>
									<OrderLink href="https://www.barnesandnoble.com/w/big-ideas-little-pictures-jono-hey/1143287468">Barnes & Noble</OrderLink>
									<OrderLink href="https://bookshop.org/p/books/big-ideas-little-pictures-explaining-the-world-one-sketch-at-a-time-jono-hey/19911717">Bookshop</OrderLink>
									<OrderLink href="https://www.amazon.ca/Big-Ideas-Little-Pictures-Sketchplanations/dp/1804190020/">Amazon Canada</OrderLink>
									<OrderLink href="https://www.indigo.ca/en-ca/">Indigo</OrderLink>
								</div>
							</div>

							{/* UK Section */}
							<div className="text-center">
								<h3 className="text-xl font-semibold mb-4">UK</h3>
								<div className="flex flex-wrap gap-4 justify-center">
									<OrderLink href="https://www.amazon.co.uk/Big-Ideas-Little-Pictures-Sketchplanations/dp/1804190020/">Amazon</OrderLink>
									<OrderLink href="https://blackwells.co.uk/bookshop/product/Big-Ideas-Little-Pictures-by-Jono-Hey/9781804190029">Blackwells</OrderLink>
									<OrderLink href="https://www.waterstones.com/book/big-ideas-little-pictures/jono-hey/9781804190029">Waterstones</OrderLink>
									<OrderLink href="https://www.foyles.co.uk/witem/computing-science/big-ideas-little-pictures-explaining,jono-hey-9781804190029">Foyles</OrderLink>
								</div>
							</div>

							{/* Worldwide Section */}
							<div className="text-center">
								<h3 className="text-xl font-semibold mb-4">Worldwide</h3>
								<div className="flex flex-wrap gap-4 justify-center">
									<OrderLink href="https://www.amazon.com.au/Big-Ideas-Little-Pictures-Sketchplanations/dp/1804190020/">Australia</OrderLink>
									<OrderLink href="https://www.amazon.com.be/Big-Ideas-Little-Pictures-Sketchplanations/dp/1804190020/">Belgium</OrderLink>
									<OrderLink href="https://www.amazon.com.br/Big-Ideas-Little-Pictures-Sketchplanations/dp/1804190020/">Brazil</OrderLink>
									<OrderLink href="https://www.amazon.fr/Big-Ideas-Little-Pictures-Sketchplanations/dp/1804190020/">France</OrderLink>
									<OrderLink href="https://www.amazon.de/Big-Ideas-Little-Pictures-Sketchplanations/dp/1804190020/">Germany</OrderLink>
									<OrderLink href="https://www.amazon.in/Big-Ideas-Little-Pictures-Sketchplanations/dp/1804190020/">India</OrderLink>
									<OrderLink href="https://www.amazon.it/Big-Ideas-Little-Pictures-Sketchplanations/dp/1804190020/">Italy</OrderLink>
									<OrderLink href="https://www.amazon.com.mx/Big-Ideas-Little-Pictures-Sketchplanations/dp/1804190020/">Mexico</OrderLink>
									<OrderLink href="https://www.amazon.nl/Big-Ideas-Little-Pictures-Sketchplanations/dp/1804190020/">Netherlands</OrderLink>
									<OrderLink href="https://www.mightyape.co.nz/">New Zealand (Mighty Ape)</OrderLink>
									<OrderLink href="https://www.amazon.pl/Big-Ideas-Little-Pictures-Sketchplanations/dp/1804190020/">Poland</OrderLink>
									<OrderLink href="https://www.amazon.sg/Big-Ideas-Little-Pictures-Sketchplanations/dp/1804190020/">Singapore</OrderLink>
									<OrderLink href="https://www.amazon.es/Big-Ideas-Little-Pictures-Sketchplanations/dp/1804190020/">Spain</OrderLink>
									<OrderLink href="https://www.amazon.se/Big-Ideas-Little-Pictures-Sketchplanations/dp/1804190020/">Sweden</OrderLink>
									<OrderLink href="https://www.exlibris.ch/de/buecher-buch/english-books/jono-hey/big-ideas-little-pictures/id/9781804190029">Switzerland (Ex Libris)</OrderLink>
								</div>

								{/* More regions toggle */}
								<div className="mt-8">
									<button
										onClick={() => setShowMoreRegions(!showMoreRegions)}
										className="text-blue-600 hover:underline text-sm font-medium"
									>
										{showMoreRegions ? '− Less regions' : '+ More regions'}
									</button>
									
									{showMoreRegions && (
										<div className="mt-4 space-x-4 text-gray-600 dark:text-gray-300">
											<a href="https://www.takealot.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">South Africa (Takealot)</a>
											<a href="https://www.amazon.com.sa/Big-Ideas-Little-Pictures-Sketchplanations/dp/1804190020/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Saudi Arabia</a>
											<a href="https://www.jd.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">China (JD)</a>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* What's inside section moved after order section */}
					<div className="mt-24">
						<h2 className="text-3xl font-bold mb-4 text-center">What's inside Big Ideas Little Pictures?</h2>
						<p className="text-xl text-gray-600 dark:text-gray-300 mb-12 text-center">Sample pages from Big Ideas Little Pictures</p>
						
						{/* Gallery in What's Inside section */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
							<div className="aspect-[3/2] relative">
								<Image
									src={coastlineParadox}
									alt="The Coastline Paradox - How the length of a coastline depends on how you measure it"
									fill
									className="object-contain rounded-lg"
								/>
							</div>
							<div className="aspect-[3/2] relative">
								<Image
									src={tsundoku}
									alt="Tsundoku - The act of acquiring books and letting them pile up without reading them"
									fill
									className="object-contain rounded-lg"
								/>
							</div>
							<div className="aspect-[3/2] relative">
								<Image
									src={swissCheeseModel}
									alt="The Swiss Cheese Model - For understanding accidents and improving safety"
									fill
									className="object-contain rounded-lg"
								/>
							</div>
							<div className="aspect-[3/2] relative">
								<Image
									src={startingCompany}
									alt="Starting a Company - Is like jumping off a cliff and assembling the plane on the way down"
									fill
									className="object-contain rounded-lg"
								/>
							</div>
						</div>

						{/* Videos stacked vertically */}
						<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="space-y-8">
								<div className="youtube-video-container">
									<iframe 
										width="560" 
										height="315" 
										src="https://www.youtube.com/embed/dQqP6aBLHYc?si=oogeEYEXru3cs53s&controls=0&rel=0" 
										title="YouTube video player" 
										showinfo="0" 
										frameBorder="0" 
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
										allowFullScreen
									></iframe>
								</div>
								<div className="youtube-video-container">
									<iframe 
										width="560" 
										height="315" 
										src="https://www.youtube.com/embed/1NQqM5ZjR2g?si=BOQLpNP4RDwVLnQ4" 
										title="YouTube video player" 
										frameBorder="0" 
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
										referrerPolicy="strict-origin-when-cross-origin" 
										allowFullScreen
									></iframe>
								</div>
							</div>
						</div>
					</div>

					{/* Praise section */}
					<div className="mt-24">
						<h2 className="text-3xl font-bold mb-12 text-center">Praise for Big Ideas Little Pictures</h2>
						
						<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								{/* Bill Gates Quote */}
								<div className="bg-gray-50 p-8 rounded-lg">
									<blockquote className="text-base mb-6">
										"This is such a cool book. The range of Jono's knowledge is astounding, and so is his ability to digest complex ideas into deceptively simple drawings. You'll learn something on every page—and be entertained too."
									</blockquote>
									<div className="flex items-center gap-4">
										<div className="font-semibold">Bill Gates</div>
									</div>
								</div>

								{/* Dan Roam Quote */}
								<div className="bg-gray-50 p-8 rounded-lg">
									<blockquote className="text-base mb-6">
										"As the world becomes more complex and fraught, the more we need clear and honest pictures to show us a better way. In his marvellous book, "Big Ideas, Little Pictures," Jono Hey gives us the pictures we need. Whether exploring the size of the universe, unpacking the paradox of choice, or illuminating the pure joy of the Golden Ratio, Jono's brilliant sketches make everything make more sense. I can't think of a better gift for my mind, and yours."
									</blockquote>
									<div className="flex items-center gap-4">
										<div>
											<div className="font-semibold">Dan Roam</div>
											<div className="text-sm text-gray-600">International bestselling author of The Back of the Napkin, and Draw To Win</div>
										</div>
									</div>
								</div>

								{/* Mike Rohde Quote */}
								<div className="bg-gray-50 p-8 rounded-lg">
									<blockquote className="text-base mb-6">
										"Big Ideas, Little Pictures is a magical collection of ideas, concepts, and wisdom—some that I've wondered about and others that I've never thought about before—presented in a clear visual way that makes Jono's sketchplanations a joy to read, reference, and share. It's a fantastic book!"
									</blockquote>
									<div className="flex items-center gap-4">
										<div>
											<div className="font-semibold">Mike Rohde</div>
											<div className="text-sm text-gray-600">Bestselling author of The Sketchnote Handbook and illustrator of REWORK</div>
										</div>
									</div>
								</div>

								{/* Katy Milkman Quote */}
								<div className="bg-gray-50 p-8 rounded-lg">
									<blockquote className="text-base mb-6">
										"I'm an enormous fan of the wonderful way Jono's sketches bring scientific insights to life for a wide audience."
									</blockquote>
									<div className="flex items-center gap-4">
										<div>
											<div className="font-semibold">Katy Milkman</div>
											<div className="text-sm text-gray-600">Professor at the Wharton School of the University of Pennsylvania and author of the international bestseller How to Change</div>
										</div>
									</div>
								</div>

								{/* Richard Shotton Quote */}
								<div className="bg-gray-50 p-8 rounded-lg">
									<blockquote className="text-base mb-6">
										"Brilliant! It distills a variety of complex and profound ideas into simple to understand and beautifully drawn sketches."
									</blockquote>
									<div className="flex items-center gap-4">
										<div>
											<div className="font-semibold">Richard Shotton</div>
											<div className="text-sm text-gray-600">Author of The Choice Factory</div>
										</div>
									</div>
								</div>

								{/* Brendan Leonard Quote */}
								<div className="bg-gray-50 p-8 rounded-lg">
									<blockquote className="text-base mb-6">
										"Jono Hey's Big Ideas Little Pictures is the kind of book that I want to devour all at once, with his brilliantly efficient illustrations breaking down complex ideas—but that I make myself ration to a few pages per day, to give myself time to absorb everything. Either way, it's the best bet I have to make myself seem more interesting as a dinner party guest."
									</blockquote>
									<div className="flex items-center gap-4">
										<div>
											<div className="font-semibold">Brendan Leonard</div>
											<div className="text-sm text-gray-600">Creator at Semi-rad and author of Make It: 50 Myths and Truths About Creating</div>
										</div>
									</div>
								</div>

								{/* Mark Frauenfelder Quote */}
								<div className="bg-gray-50 p-8 rounded-lg">
									<blockquote className="text-base mb-6">
										"Jono's superpower is the ability to break down complex concepts into digestible, visually appealing explanations."
									</blockquote>
									<div className="flex items-center gap-4">
										<div>
											<div className="font-semibold">Mark Frauenfelder</div>
											<div className="text-sm text-gray-600">Founder of Boing Boing, Recomendo, Make and Wired magazines</div>
										</div>
									</div>
								</div>

								{/* Trenton Moss Quote */}
								<div className="bg-gray-50 p-8 rounded-lg">
									<blockquote className="text-base mb-6">
										"I've loved following Sketchplanations for years. And finally, Jono has brought it all together in this wonderful book. Keep a copy in your home and show it to everyone who comes over."
									</blockquote>
									<div className="flex items-center gap-4">
										<div>
											<div className="font-semibold">Trenton Moss</div>
											<div className="text-sm text-gray-600">Bestselling author of Human Powered and Founder of Team Sterka</div>
										</div>
									</div>
								</div>

								{/* Jason Barron Quote */}
								<div className="bg-gray-50 p-8 rounded-lg">
									<blockquote className="text-base mb-6">
										"Jono's delightful book is a fantastic blend of text and visuals, making the topics easy to understand and remember. I found myself eager to turn each page, learning things I had never known before. I love this book and recommend it to anyone looking to enrich their knowledge at super speed with some creativity and fun."
									</blockquote>
									<div className="flex items-center gap-4">
										<div>
											<div className="font-semibold">Jason Barron</div>
											<div className="text-sm text-gray-600">Author of The Visual MBA</div>
										</div>
									</div>
								</div>

								{/* Gillian Cross Quote */}
								<div className="bg-gray-50 p-8 rounded-lg">
									<blockquote className="text-base mb-6">
										<p>
											"I love this book. It will delight adults, fascinate children and help us all to grasp important ideas. Want to understand the four horsemen of relationship apocalypse? Or different types of phishing? Or the ten essentials for wilderness safety? Jono Hey's explanations are brief and clear – but it's his pictures that stick in your head. Every time you turn over a page, there's something new. I can't wait to try out the instructions for skipping rocks like a pro and taking better photographs – and I'll certainly take up the Dracula sneeze."
										</p>
										<p className="mt-4">
											"I meant to read it slowly, a few pages at a time, but it's such fun that I kept thinking, Just one more picture and finished it in one sitting. I'm looking forward to re-reading it very soon."
										</p>
									</blockquote>
									<div className="flex items-center gap-4">
										<div>
											<div className="font-semibold">Gillian Cross</div>
											<div className="text-sm text-gray-600">Multi-award-winning children's book author</div>
										</div>
									</div>
								</div>

								{/* Eva-Lotta Lamm Quote */}
								<div className="bg-gray-50 p-8 rounded-lg">
									<blockquote className="text-base mb-6">
										"'Big Ideas, Little Pictures' by Jono Hey is a beautiful and powerful book at the same time. On each page, Jono visualises a complex concept into a clear, engaging little drawing. His sketches don't just simplify ideas, they bring them to life and make them understandable at a glance. This large collection of concepts, scientific findings and interesting frameworks is delightful and a real testament to the power of communicating through simple visuals. This body of work is even more impressive as it was created by Jono over years of drawing one concept per week. As a fellow visual thinker I'm in love with this wonderful book. It's a joy to dive in at any page, to get drawn in by the pictures and to learn a new fact with every turn of the page."
									</blockquote>
									<div className="flex items-center gap-4">
										<div>
											<div className="font-semibold">Eva-Lotta Lamm</div>
											<div className="text-sm text-gray-600">Designer and Visual Thinker</div>
										</div>
									</div>
								</div>

								{/* Dad Quote */}
								<div className="bg-gray-50 p-8 rounded-lg">
									<blockquote className="text-base mb-6">
										"I resent our bedroom looking so messy in the tsundoku sketch."
									</blockquote>
									<div className="flex items-center gap-4">
										<div>
											<div className="font-semibold">Dad</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* FAQ Section */}
					<div className="mt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-3xl font-bold mb-8 text-center">FAQ</h2>
						<div className="space-y-8">
							<div>
								<h3 className="font-bold mb-2">Interested in ordering from other countries?</h3>
								<p>Please contact me at <a href="mailto:jono.hey@gmail.com" className="text-blue-600 hover:underline">jono.hey@gmail.com</a> and let me know where you are. It helps us get distribution in the right places first.</p>
							</div>

							<div>
								<h3 className="font-bold mb-2">Will there be an eBook?</h3>
								<p>Yes. There should be a Kindle version of the book when published, but it's not out yet, and it's not nearly as nice on the coffee table.</p>
							</div>

							<div>
								<h3 className="font-bold mb-2">Do you have photos or images I can use to share?</h3>
								<p>Yes, I put together a <a href="#" className="text-blue-600 hover:underline">basic media kit</a>. Let me know what else you'd want to see in it.</p>
							</div>

							<div>
								<h3 className="font-bold mb-2">Is it available in other languages?</h3>
								<p>Not yet. Feel free to let me know if you'd like it in another language—it always helps to gauge demand. If you work in translating or could help publish in another language, please get in touch.</p>
							</div>

							<div>
								<h3 className="font-bold mb-2">What is the ISBN for Big Ideas Little Pictures?</h3>
								<p>The ISBN-13 is 978-1956403572</p>
								<p>(ISBN-10 is 1956403574)</p>
							</div>

							<div>
								<h3 className="font-bold mb-2">What's the picture on the cover?</h3>
								<p>The picture is my own version of Hokusai's remarkable "The Great Wave off Kanagawa" or just the "Great Wave." Here's the <a href="#" className="text-blue-600 hover:underline">Great Wave at The MET</a>. I once saw the real thing at the British Museum in London. It's small, but few pictures captivate the way it does. <a href="#" className="text-blue-600 hover:underline">Hokusai's wave evolved a lot throughout his life</a>.</p>
							</div>

							<div>
								<h3 className="font-bold mb-2">Can I buy a print of the cover?</h3>
								<p>I'm so glad you asked ;o) You can <a href="#" className="text-blue-600 hover:underline">buy prints and other merch of the Sketchplanations Wave</a>.</p>
								<p>Let me know if you there's a design you'd like that I don't have.</p>
							</div>

							<div>
								<h3 className="font-bold mb-2">Got another question? Please contact me</h3>
								<p>I'm at: <a href="mailto:jono.hey@gmail.com" className="text-blue-600 hover:underline">jono.hey@gmail.com</a></p>
							</div>
						</div>
					</div>

					{/* Why a book? Section */}
					<div className="mt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-3xl font-bold mb-8">Why a book?</h2>
						<div className="space-y-6 prose">
							<p>
								I started making sketchplanations in 2013 by sketching them in actual books. While putting the sketches online has helped them reach so many more people there's something about browsing through the sketches in a book, phones and laptops away, that makes it the best way to experience it.
							</p>
							<p>
								Which sketches to include was a challenge. I'm really happy that I've selected sketches that will teach you a new thing or two about the world, make you think, inspire you and make you smile. In the process, I added a host of sketches for topics I'd always wanted to cover ranging from How to Win at Monopoly to the Basics of a Good Night's Sleep.
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Book;
