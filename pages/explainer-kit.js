import { pageTitle } from 'helpers'
import Head from 'next/head'
import Image from 'next/image'

const ExplainerKit = () => {
  const checkoutUrl = 'https://pzpzck-rt.myshopify.com/products/sketchplanations-explainer-kit-pre-order?utm_source=copyToPasteBoard&utm_medium=product-links&utm_content=web'

  return (
    <>
      <Head>
        <title>{pageTitle('Sketchplanations Explainer Kit')}</title>
        <meta
          name="description"
          content="Unlock reputation and career growth by getting your message across effectively, using plug-and-play visuals, frameworks, and examples to elevate your content."
        />
        <link rel="canonical" href="https://sketchplanations.com/explainer-kit" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Sketchplanations Explainer Kit" />
        <meta
          property="og:description"
          content="Unlock reputation and career growth by getting your message across effectively, using plug-and-play visuals, frameworks, and examples to elevate your content."
        />
        <meta property="og:url" content="https://sketchplanations.com/explainer-kit" />
        <meta property="og:site_name" content="Sketchplanations" />
        <meta property="og:type" content="product" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sketchplanator" />
        <meta name="twitter:title" content="Sketchplanations Explainer Kit" />
        <meta
          name="twitter:description"
          content="Unlock reputation and career growth by getting your message across effectively, using plug-and-play visuals, frameworks, and examples to elevate your content."
        />
      </Head>

      <main className="max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
        {/* Hero */}
        <section id="hero" className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4">
            Sketchplanations Explainer Kit
          </h1>
          <p className="text-xl sm:text-2xl text-textSubdued mb-6">
            Get your message across more clearly.
          </p>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Unlock reputation and career growth by getting your message across effectively, using
            plug-and-play visuals, frameworks, and examples to elevate your content.
          </p>
          <a
            href={checkoutUrl}
            className="btn-primary inline-block px-8 py-3 text-lg"
          >
            Pre-order now for $29
          </a>
          <p className="mt-4 text-sm text-textSubdued">
            50% off &middot; Limited to 30 early supporters
          </p>
        </section>

        {/* The problems you're facing */}
        <section id="problems" className="mt-16 sm:mt-24">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
            The problems you&apos;re facing
          </h2>
          <p className="text-lg mb-4">
            You know what you want to say.
            <br />
            But getting it to land is harder than it should be.
          </p>
          <p className="text-lg mb-4">You might recognise some of these:</p>
          <ul className="list-disc list-outside ml-6 space-y-2 text-lg mb-6">
            <li>You&apos;re not sure how to get your message to really land</li>
            <li>People glaze over partway through</li>
            <li>What you&apos;re saying feels detached from emotion or hard to relate to</li>
            <li>Your message is complex, and people struggle to follow it</li>
            <li>Your visuals feel stale, cheesy, or overly &ldquo;business-y&rdquo;</li>
            <li>
              You&apos;d like to add a personal, human touch — but drawing isn&apos;t your strength
            </li>
            <li>You spend far too long trying to make slides engaging</li>
          </ul>
          <p className="text-lg">
            None of this means your thinking is weak.
          </p>
          <p className="text-lg">
            It usually means the ideas aren&apos;t being supported in the right way.
          </p>
        </section>

        {/* What this kit is */}
        <section id="what-it-is" className="mt-16 sm:mt-24">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">What this kit is</h2>
          <p className="text-lg mb-4">
            The Sketchplanations Explainer Kit is a growing library of clear, human, reusable
            visuals you can drop straight into your slides to help ideas land.
          </p>
          <p className="text-lg mb-6">
            It is designed for people who already know what they want to say, but want help saying
            it more clearly, memorably, and confidently.
          </p>
          <p className="text-lg mb-4">Use it to:</p>
          <ul className="list-disc list-outside ml-6 space-y-2 text-lg">
            <li>Explain complex ideas simply</li>
            <li>Add interest without gimmicks</li>
            <li>Make your thinking easier to follow</li>
          </ul>
        </section>

        {/* What's included (v1) */}
        <section id="whats-included" className="mt-16 sm:mt-24">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">What&apos;s included (v1)</h2>
          <ul className="list-disc list-outside ml-6 space-y-2 text-lg mb-6">
            <li>~200 visuals</li>
            <li>
              Visual types include:
              <ul className="list-disc list-outside ml-6 mt-2 space-y-1">
                <li>People and characters</li>
                <li>Icons and symbols</li>
                <li>Metaphors and analogies</li>
                <li>Frameworks and diagrams</li>
                <li>Simple backgrounds and structure</li>
              </ul>
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-4">Formats included</h3>
          <ul className="list-disc list-outside ml-6 space-y-2 text-lg mb-6">
            <li>PowerPoint (.pptx)</li>
            <li>Google Slides</li>
            <li>Keynote</li>
            <li>PNG</li>
            <li>SVG</li>
          </ul>

          <p className="text-lg mb-8">
            Designed to be mixed, reused, and adapted across talks, workshops, and internal
            communication.
          </p>

          <div className="rounded-lg overflow-hidden">
            <Image
              src="/images/explainer-kit-hero.png"
              alt="Sketchplanations Explainer Kit - Ready to get your message across?"
              width={1124}
              height={632}
              className="w-full h-auto"
              priority
            />
          </div>
        </section>

        {/* Why this helps your ideas land */}
        <section id="why-it-helps" className="mt-16 sm:mt-24">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
            Why this helps your ideas land
          </h2>
          <p className="text-lg mb-4">These visuals are not decoration.</p>
          <p className="text-lg mb-4">They are designed to:</p>
          <ul className="list-disc list-outside ml-6 space-y-2 text-lg mb-6">
            <li>Guide attention</li>
            <li>Create emotional connection</li>
            <li>Make structure visible</li>
            <li>Reduce cognitive load</li>
          </ul>
          <p className="text-lg">
            They help people follow your thinking, not just look at it.
          </p>
        </section>

        {/* What changes when you use it */}
        <section id="what-changes" className="mt-16 sm:mt-24">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">What changes when you use it</h2>
          <p className="text-lg mb-4">With the Explainer Kit you can:</p>
          <ul className="list-disc list-outside ml-6 space-y-2 text-lg">
            <li>Get your message across more effectively</li>
            <li>Make presentations feel more human and engaging</li>
            <li>Spend less time fiddling with slides</li>
            <li>Bring ideas to life without needing to draw</li>
          </ul>
        </section>

        {/* Where this comes from */}
        <section id="background" className="mt-16 sm:mt-24">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Where this comes from</h2>
          <p className="text-lg mb-4">
            This kit is built on more than a decade of Sketchplanations — a long-running project
            focused on explaining ideas clearly through simple visuals.
          </p>
          <p className="text-lg">
            It draws on experience explaining over 1,000 concepts to a large global audience, and on
            professional work centred on helping ideas land.
          </p>
        </section>

        {/* Pre-order details */}
        <section id="pre-order" className="mt-16 sm:mt-24">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Pre-order details</h2>
          <p className="text-lg mb-4">This is a limited pre-order.</p>
          <ul className="list-disc list-outside ml-6 space-y-2 text-lg mb-6">
            <li>$29 pre-order price (future price $59)</li>
            <li>Limited to 30 early supporters</li>
            <li>Buying early helps shape what goes into the kit</li>
          </ul>
          <p className="text-lg mb-8">
            If there is sufficient demand, the full kit will be completed and delivered.
          </p>
          <div className="text-center">
            <a
              href={checkoutUrl}
              className="btn-primary inline-block px-8 py-3 text-lg"
            >
              Pre-order now for $29
            </a>
          </div>
        </section>

        {/* Guarantee */}
        <section id="guarantee" className="mt-16 sm:mt-24">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Guarantee</h2>
          <p className="text-lg">
            If you&apos;re not satisfied, contact me within 30 days for a full refund.
          </p>
        </section>

        {/* Final CTA */}
        <section id="final-cta" className="mt-16 sm:mt-24 text-center">
          <p className="text-xl sm:text-2xl font-semibold mb-8">
            Important ideas deserve clear visuals.
          </p>
          <a
            href={checkoutUrl}
            className="btn-primary inline-block px-8 py-3 text-lg"
          >
            Pre-order the Sketchplanations Explainer Kit for $29
          </a>
          <p className="mt-4 text-sm text-textSubdued">
            Limited early access &middot; 30 spots
          </p>
        </section>
      </main>
    </>
  )
}

export default ExplainerKit
