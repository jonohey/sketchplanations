import classNames from "classnames";
import BackToTop from "./BackToTop";
import FancyLink from "./FancyLink";
import {
	BOOKS_SECTION_ID,
	BOOKS_SECTION_TITLE,
	LICENCE_SECTIONS,
} from "utils/licenceContent.mjs";

const IMAGE_CONSENT_FORM_URL =
	"https://docs.google.com/document/d/1wcZty5jEoj-_AY7wdojuPB5Fh9BG5eBb/edit";
const TRANSLATIONS_FOLDER_URL =
	"https://drive.google.com/drive/folders/1gGCCObciyjjd-3KHOUv-jm8PJAs2QuFy?usp=drive_link";
const ATTRIBUTION_EXAMPLE_URL = "https://sketchplanations.com/the-overview-effect";

const FaqQuestion = ({ id, children }) => (
	<h3 id={id} className="scroll-mt-24">
		{children}
	</h3>
);

const LicenceSectionNav = () => (
	<nav
		aria-label="Licence page sections"
		className="not-prose my-6 rounded-lg border border-border bg-bgHighlight px-4 py-3"
	>
		<p className="m-0 text-xs font-semibold uppercase tracking-wide text-textSubdued">
			On this page
		</p>
		<ul className="m-0 mt-2 grid list-none gap-2 p-0 text-sm sm:grid-cols-2">
			{LICENCE_SECTIONS.map(({ id, label }) => (
				<li key={id}>
					<a href={`#${id}`} className="text-blue dark:text-blueLight">
						{label}
					</a>
				</li>
			))}
		</ul>
	</nav>
);

const CreativeCommonsBadge = () => (
	<>
		<p className="lead">
			I love it when people use Sketchplanations. Please respect the licence when
			you share so more people can find sketches they like too.
		</p>
		<div className="not-prose mx-auto my-4 max-w-[600px]">
			<p className="my-2 text-center">
				<a
					rel="license"
					href="https://creativecommons.org/licenses/by-nc/4.0/"
					className="inline-block"
				>
					<img
						alt="Creative Commons Licence"
						className="mx-auto border-0"
						src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png"
					/>
				</a>
			</p>
			<p className="text-center text-sm">
				All images and accompanying explanatory text on this website are licensed
				under a{" "}
				<a
					rel="license"
					href="https://creativecommons.org/licenses/by-nc/4.0/"
					className="text-blue"
				>
					Creative Commons Attribution-NonCommercial 4.0 International License
				</a>
			</p>
		</div>
	</>
);

const BooksSection = () => (
	<>
		<h2 id={BOOKS_SECTION_ID} className="scroll-mt-24">
			{BOOKS_SECTION_TITLE}
		</h2>
		<p>
			Yes—sketches can be used in books, but they are normally commercial use, so
			they need separate permission.
		</p>
		<p>
			For professionally published books or publisher-led projects, please contact
			me—{" "}
			<FancyLink href="mailto:jono.hey@gmail.com?subject=Book%20image%20licence%20request">
				jono.hey@gmail.com
			</FancyLink>
			—and I will confirm pricing based on the publication.
		</p>
		<p>
			For independent authors, I licence images at $65 per image (or £50 if paying
			in GBP), to keep things straightforward. This is a one-off licence for use
			inside a single book.
		</p>
		<p>
			To licence a sketch for use in a book, please complete and email the Image
			Consent Form below. I use this for all book uses so that permission, scope,
			and attribution are clear for both of us.
		</p>
		<p>
			👉{" "}
			<FancyLink href={IMAGE_CONSENT_FORM_URL} target="_blank" rel="noopener noreferrer">
				Image Consent Form
			</FancyLink>
		</p>
		<p>
			If the sketch appears in{" "}
			<FancyLink href="https://geni.us/big-ideas-book" target="_blank" rel="noopener noreferrer">
				Big Ideas Little Pictures
			</FancyLink>
			, I need to confirm with my publisher before approving use, but this is
			usually straightforward.
		</p>
	</>
);

const LicenceContent = ({ inline = false, showSectionNav = true }) => (
	<div
		id="top"
		className={classNames(
			inline ? "px-6 pb-0" : "mx-auto max-w-3xl px-5 pb-16",
		)}
	>
		<div className="prose max-w-none">
			<div className={classNames("mb-4", inline ? "mt-4" : "mt-12")}>
				<h1 className="text-center">Licence</h1>
			</div>

			<CreativeCommonsBadge />

			{showSectionNav && !inline && <LicenceSectionNav />}

			<p>
				In short, you&apos;re free to share any sketches but not sell them. You
				must include the source. Adding a link to the site or tagging a relevant
				social profile is extra helpful.
			</p>
			<p>
				Keeping attribution helps people find the work, which helps me as a
				creator make a living doing this—thank you.
			</p>
			<p>
				It&apos;s great when people share Sketchplanations, so please use sketches
				to illustrate your points in:
			</p>
			<ul>
				<li>a work or consulting presentation</li>
				<li>your course</li>
				<li>your LinkedIn post for your company</li>
				<li>your Instagram story or post</li>
				<li>your article</li>
				<li>a magazine or newspaper article</li>
				<li>your email newsletter or the like...</li>
			</ul>
			<p>
				...as long as you give credit. In fact, I&apos;d{" "}
				<em>love</em>{" "}
				you to use them to make a point, help explain something for others,
				further your career, or teach something to your students. That&apos;s what
				they&apos;re for!
			</p>

			<BooksSection />

			<h2 id="ai-adaptations" className="scroll-mt-24">
				AI Adaptations
			</h2>
			<p>
				If you&apos;re adapting a sketch using AI or other tools, please include
				visible attribution on the image itself (e.g.,{" "}
				<strong>&ldquo;Adapted from Sketchplanations&rdquo;</strong>). This helps
				the credit stay attached, even when the image is reshared without any
				accompanying text. Images have a way of making their own way around.
			</p>
			<p>
				I don&apos;t consider AI remixes that omit attribution as appropriate use
				under this licence.
			</p>

			<h2 id="translations" className="scroll-mt-24">
				Translations
			</h2>
			<p>
				If you&apos;re talented enough to translate sketches into your own
				language, I highly encourage it.
			</p>
			<p>
				If you translate and share a sketch, don&apos;t remove Sketchplanations
				from the image.
			</p>
			<p>Ideally, include: &apos;Translated from Sketchplanations&apos; or similar.</p>
			<p>I have .psd files of most sketches in case they are helpful to you.</p>
			<p>
				Have you translated a sketch? I&apos;m collecting them, intending to add
				links to translations of each sketch on the site. Email them to me at{" "}
				<FancyLink href="mailto:jono.hey@gmail.com">jono.hey@gmail.com</FancyLink>
			</p>
			<p>
				<FancyLink href={TRANSLATIONS_FOLDER_URL} target="_blank" rel="noopener noreferrer">
					See translations
				</FancyLink>
			</p>

			<h2 id="licence-faq" className="scroll-mt-24">
				Licence FAQ
			</h2>

			<FaqQuestion id="can-i-use-them-in-my-article-newsletter-presentation-linkedin-post-instagram-business-post-medium-post-or-course-or-the-like">
				Can I use them in my article, newsletter, presentation, LinkedIn post,
				Instagram business post, Medium post, or course? (or the like)
			</FaqQuestion>
			<p>
				Yes. Please include the source. Because content is often reshared, I prefer
				that you don&apos;t remove the Sketchplanations logo from the sketches.
			</p>

			<FaqQuestion id="how-should-i-attribute-sketches">
				How should I attribute sketches?
			</FaqQuestion>
			<p>If you can add a link, i.e. it&apos;s online, this works well, I think:</p>
			<p>
				Image: Jono Hey,{" "}
				<FancyLink href={ATTRIBUTION_EXAMPLE_URL} target="_blank" rel="noopener noreferrer">
					Sketchplanations
				</FancyLink>
			</p>
			<p>
				...ideally with the word Sketchplanations linking to the sketch page as it
				appears on the site, e.g. to{" "}
				<FancyLink href={ATTRIBUTION_EXAMPLE_URL} target="_blank" rel="noopener noreferrer">
					https://sketchplanations.com/the-overview-effect
				</FancyLink>
			</p>
			<p>
				If you can&apos;t add a link, for example, because it&apos;s in a book or
				flyer, then this works well:
			</p>
			<p>Image: Jono Hey, sketchplanations.com</p>
			<p>Context matters when adding sources, so please make it work for you.</p>
			<p>
				As for AI adaptations above, if you make a new or adapted version of the
				sketch, please include attribution on the image itself—otherwise they tend
				to get loose and attribution gets lost.
			</p>

			<FaqQuestion id="can-i-sell-them">Can I sell them?</FaqQuestion>
			<p>No, not without permission.</p>
			<p>
				If you&apos;re thinking of publishing a collection with many
				sketchplanations, reselling them, or some giant marketing campaign,
				billboard, selling prints or the like, great! Please contact me at{" "}
				<FancyLink href="mailto:jono.hey@gmail.com">jono.hey@gmail.com</FancyLink>
				, and we can find a price or arrangement that works for us both.
			</p>

			<FaqQuestion id="do-you-have-high-resolution-versions-i-can-use">
				Do you have high-resolution versions I can use?
			</FaqQuestion>
			<p>
				Yes. You can use the download link below each sketch for a
				higher-resolution image if you need it.
			</p>
			<p>
				Some older sketches may only have slightly higher resolutions when you
				download them. Feel free to contact me (
				<FancyLink href="mailto:jono.hey@gmail.com">jono.hey@gmail.com</FancyLink>
				)—I will likely have a higher-res version.
			</p>

			<FaqQuestion id="do-you-have-an-image-consent-form-i-can-complete">
				Do you have an Image Consent Form I can complete?
			</FaqQuestion>
			<p>
				Why, yes! Find it here:{" "}
				<FancyLink href={IMAGE_CONSENT_FORM_URL} target="_blank" rel="noopener noreferrer">
					Image Consent Form
				</FancyLink>
			</p>

			<FaqQuestion id="im-still-unsure-whether-my-use-case-is-ok-what-should-i-do">
				I&apos;m still unsure whether my use case is OK. What should I do?
			</FaqQuestion>
			<p>
				Just contact me at{" "}
				<FancyLink href="mailto:jono.hey@gmail.com">jono.hey@gmail.com</FancyLink>{" "}
				and explain how you plan to use sketches, and I&apos;ll happily let you
				know.
			</p>

			<FaqQuestion id="can-i-pay-you-for-it">Can I pay you for it?</FaqQuestion>
			<p>If the sketches have helped you, wonderful!</p>
			<p>
				<FancyLink href="/subscribe">Upgrading to a paid subscription</FancyLink>{" "}
				makes the biggest difference, or{" "}
				<FancyLink
					href="https://www.buymeacoffee.com/sketchplanator"
					target="_blank"
					rel="noopener noreferrer"
				>
					buying me a coffee
				</FancyLink>{" "}
				really helps, but it&apos;s not required.
			</p>
			<p>
				(OK, perhaps this isn&apos;t as <em>frequently</em> asked)
			</p>

			<FaqQuestion id="wait-is-it-license-or-licence">
				Wait, is it license or licence?
			</FaqQuestion>
			<p>
				Good question. See here:{" "}
				<FancyLink href="/advise-vs-advice">Is it Advise or advice?</FancyLink>
			</p>

			<p>Thanks for checking! I appreciate it.</p>

			<BackToTop />
		</div>
	</div>
);

export default LicenceContent;
