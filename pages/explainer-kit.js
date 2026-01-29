import { pageTitle } from 'helpers'
import { AlertCircle, Check, FileText, Layers, Lightbulb, Palette, Shield, Target } from 'lucide-react'
import { Inter, Libre_Baskerville } from 'next/font/google'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--lp-font-sans',
})

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--lp-font-serif',
})

const ExplainerKit = () => {
  const checkoutUrl = 'https://pzpzck-rt.myshopify.com/products/sketchplanations-explainer-kit-pre-order?utm_source=copyToPasteBoard&utm_medium=product-links&utm_content=web'

  return (
    <div className={`landing-page min-h-screen flex flex-col ${inter.variable} ${libreBaskerville.variable}`}>
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

      {/* Landing Page Header */}
      <header className="lp-header">
        <div className="lp-container max-w-5xl px-4 h-16 flex items-center justify-between">
          <Link href="/" className="lp-heading text-xl">
            Sketchplanations
          </Link>
          <a href="#pre-order" className="lp-btn-cta text-sm px-4 py-2">
            Pre-order
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="lp-section lp-bg-gradient">
          <div className="lp-container max-w-5xl">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Text content */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--lp-accent)' }}>
                  Pre-order now available
                </p>
                <h1 className="lp-heading-xl mb-6">
                  The Sketchplanations{' '}
                  <span className="lp-highlight-marker">Explainer Kit</span>
                </h1>
                <p className="text-lg md:text-xl lp-text-muted leading-relaxed mb-6">
                  Get your message across more clearly.
                </p>
                <p className="text-lg lp-prose mb-8 max-w-xl">
                  Unlock reputation and career growth by getting your message across effectively, using
                  plug-and-play visuals, frameworks, and examples to elevate your content.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href={checkoutUrl} className="lp-btn-cta lp-btn-cta-lg">
                    Pre-order for $29
                  </a>
                  <a href="#whats-included" className="lp-btn-outline">
                    See what&apos;s included
                  </a>
                </div>
                <p className="text-sm lp-text-muted mt-4">
                  50% off &middot; Limited to 30 early supporters
                </p>
                <p className="text-sm lp-text-muted mt-2 flex items-center gap-1">
                  <Check className="w-4 h-4" style={{ color: 'var(--lp-accent)' }} />
                  30-day money-back guarantee
                </p>
              </div>

              {/* Hero image */}
              <div className="relative">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/explainer-kit-hero.png"
                    alt="Sketchplanations Explainer Kit - Ready to get your message across?"
                    width={1124}
                    height={632}
                    className="w-full h-auto"
                    priority
                  />
                </div>
                <div 
                  className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl -z-10"
                  style={{ backgroundColor: 'hsl(15 85% 57% / 0.1)' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Problems Section */}
        <section id="problems" className="lp-section lp-bg-secondary">
          <div className="lp-container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="lp-heading text-3xl md:text-4xl mb-4">
                The problems you&apos;re facing
              </h2>
              <p className="text-lg lp-text-muted max-w-2xl mx-auto">
                You know what you want to say. But getting it to land is harder than it should be. This kit is for you if:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                { text: "You're not sure of the best way to get your message to really land" },
                { text: "You want people to relate emotionally to your content" },
                { text: "Your message is complex and you’d like to help people get it" },
                { text: "You're tired of visuals that feel stale, cheesy, or overly \"business-y\"" },
                { text: "You'd like to add a personal, human touch — but drawing isn't your strength" },
                { text: "You want to leverage the best of Sketchplanations for your work" },
                { text: "You want to bring your content to life" },
              ].map((problem, index) => (
                <div key={index} className="lp-card p-6">
                  <div className="flex gap-4">
                    <div className="lp-icon-container">
                      <AlertCircle />
                    </div>
                    <p className="lp-prose">{problem.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center lp-prose">
              <p className="mb-2">
                <strong>Your thinking is strong.</strong>
              </p>
              <p>
                You just need to support your ideas effectively.
              </p>
            </div>
          </div>
        </section>

        {/* What this kit is */}
        <section id="what-it-is" className="lp-section">
          <div className="lp-container max-w-4xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="lp-heading text-3xl md:text-4xl mb-6">
                  What this kit is
                </h2>
                <p className="text-lg lp-prose mb-6">
                  The Sketchplanations Explainer Kit is a growing library of{' '}
                  <strong>clear, human, reusable visuals</strong> you can drop straight into your
                  slides to help ideas land.
                </p>
                <p className="text-lg lp-prose mb-8">
                  It is designed for people who already know what they want to say, but want help
                  saying it more clearly, memorably, and confidently.
                </p>

                <p className="text-lg font-semibold lp-text-primary mb-4">Use it to:</p>
                <div className="space-y-3">
                  {[
                    { icon: Lightbulb, text: 'Explain complex ideas simply' },
                    { icon: Palette, text: 'Add interest without gimmicks' },
                    { icon: Target, text: 'Make your thinking easier to follow' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="lp-icon-container-highlight lp-icon-container">
                        <item.icon />
                      </div>
                      <span className="text-lg lp-prose">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div 
                className="rounded-2xl p-8 md:p-12"
                style={{ background: 'linear-gradient(to bottom right, hsl(48 95% 76% / 0.3), hsl(15 85% 57% / 0.1))' }}
              >
                <div className="space-y-4">
                  <div className="lp-card p-4">
                    <div className="h-3 w-24 rounded mb-2" style={{ backgroundColor: 'hsl(220 45% 22% / 0.2)' }} />
                    <div className="h-2 w-full rounded" style={{ backgroundColor: 'hsl(45 20% 90%)' }} />
                    <div className="h-2 w-3/4 rounded mt-1" style={{ backgroundColor: 'hsl(45 20% 90%)' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="lp-card p-4">
                      <div className="w-12 h-12 rounded-lg mb-2" style={{ backgroundColor: 'hsl(15 85% 57% / 0.2)' }} />
                      <div className="h-2 w-full rounded" style={{ backgroundColor: 'hsl(45 20% 90%)' }} />
                    </div>
                    <div className="lp-card p-4">
                      <div className="w-12 h-12 rounded-lg mb-2" style={{ backgroundColor: 'hsl(48 95% 76% / 0.4)' }} />
                      <div className="h-2 w-full rounded" style={{ backgroundColor: 'hsl(45 20% 90%)' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section id="whats-included" className="lp-section lp-bg-primary">
          <div className="lp-container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="lp-heading text-3xl md:text-4xl mb-4">
                What&apos;s included
              </h2>
              <p className="text-lg opacity-80 max-w-2xl mx-auto">
                Everything you need to start creating clearer explanations immediately.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {[
                { icon: Layers, title: 'Over 200 visuals', description: 'Hundreds of visuals you can use to support your ideas' },
                { icon: FileText, title: 'Multiple formats', description: 'Paste directly from PowerPoint, Google Slides, Keynote, or an image library' },
              ].map((item, index) => (
                <div key={index} className="lp-card-primary p-6">
                  <div className="flex gap-4">
                    <div 
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: 'var(--lp-highlight)' }}
                    >
                      <item.icon className="w-6 h-6" style={{ color: 'var(--lp-highlight-foreground)' }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="opacity-80">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lp-card-primary rounded-2xl p-8 text-center">
              <h3 className="text-xl font-semibold mb-6">I thought about the types of visuals that help most in presentations. Visual types include:</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  'People and characters',
                  'Icons and symbols',
                  'Metaphors and analogies',
                  'Frameworks and diagrams',
                  'Simple backgrounds',
                ].map((format, index) => (
                  <span key={index} className="lp-badge">
                    <Check className="w-4 h-4" style={{ color: 'var(--lp-highlight)' }} />
                    {format}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-center mt-8 opacity-80">
              All content is designed to be mixed, reused, and adapted across your talks, workshops, and internal communication. Make it work for you.
            </p>
          </div>
        </section>

        {/* Why this helps */}
        <section id="why-it-helps" className="lp-section">
          <div className="lp-container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="lp-heading text-3xl md:text-4xl mb-4">
                Why this helps your ideas land
              </h2>
              <p className="text-lg lp-text-muted">
                These visuals are not just decoration.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                { text: 'Guide attention' },
                { text: 'Bring structure' },
                { text: 'Create emotional connection' },
                { text: 'Make your ideas sticky' },
                { text: 'Reduce cognitive load' },
              ].map((benefit, index) => (
                <div 
                  key={index} 
                  className="p-6 rounded-xl"
                  style={{ background: 'linear-gradient(to right, hsl(45 35% 92% / 0.5), hsl(48 95% 76% / 0.2))' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="lp-icon-container">
                      <Check />
                    </div>
                    <span className="font-semibold lp-text-primary text-lg">{benefit.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-lg lp-prose">
              The Explainer Kit helps people <strong>follow your thinking</strong>, not just look at it (or worse, glaze over).
            </p>
          </div>
        </section>

        <section id="what-changes" className="lp-section lp-bg-secondary">
          <div className="lp-container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="lp-heading text-3xl md:text-4xl mb-4">
                What changes when you use it
              </h2>
            </div>

            <div className="space-y-4">
              {[
                'Get your message across more effectively',
                'Make presentations feel more human and engaging',
                'Spend less time fiddling with slides',
                'Bring ideas to life without needing to draw',
              ].map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-5 rounded-xl"
                  style={{ background: 'linear-gradient(to right, hsl(45 35% 92% / 0.5), hsl(48 95% 76% / 0.2))' }}
                >
                  <div className="lp-icon-container">
                    <Check />
                  </div>
                  <span className="font-semibold lp-text-primary">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Where this comes from */}
        <section id="background" className="lp-section">
          <div className="lp-container max-w-3xl text-center">
            <h2 className="lp-heading text-3xl md:text-4xl mb-6">
              Where this comes from
            </h2>
            <p className="text-lg lp-prose mb-6">
              This kit is built on more than a decade of{' '}
              <strong>Sketchplanations</strong> — a long-running project focused on explaining
              ideas clearly through simple visuals.
            </p>
            <p className="text-lg lp-prose mb-8">
              It draws on experience explaining <strong>over 1,000 concepts</strong> to a large
              global audience, and on professional work centred on helping ideas land.
            </p>

            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="lp-stat">
                <div className="lp-stat-value">1,000+</div>
                <div className="lp-stat-label">Sketchplanations created</div>
              </div>
              <div className="lp-stat">
                <div className="lp-stat-value">13+</div>
                <div className="lp-stat-label">Years of visuals</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pre-order */}
        <section id="pre-order" className="lp-section">
          <div className="lp-container max-w-md">
            <div className="lp-card rounded-3xl overflow-hidden">
              <div 
                className="p-8 text-center"
                style={{ background: 'linear-gradient(to right, var(--lp-primary), hsl(220 45% 22% / 0.9))', color: 'var(--lp-primary-foreground)' }}
              >
                <p className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-2">
                  Pre-order pricing
                </p>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="lp-price-original">$59</span>
                  <span className="lp-price-current">$29</span>
                </div>
                <p className="text-sm opacity-80">
                  One-time purchase
                </p>
              </div>

              <div className="p-8">
                <p className="text-lg lp-prose mb-4">This is a limited pre-order.</p>
                <ul className="space-y-3 mb-6">
                  {[
                    '$29 pre-order price (future price $59)',
                    'Limited to 30 early supporters',
                    'Buying early helps shape what goes into the kit',
                  ].map((perk, index) => (
                    <li key={index} className="lp-check-item">
                      <div className="lp-check-icon">
                        <Check />
                      </div>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm lp-text-muted mb-6">
                  If there is sufficient demand, the full kit will be completed and delivered.
                </p>

                <a href={checkoutUrl} className="lp-btn-cta w-full mb-4">
                  Pre-order now for $29
                </a>

                <div className="flex items-center justify-center gap-2 text-sm lp-text-muted">
                  <Shield className="w-4 h-4" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantee */}
        <section id="guarantee" className="lp-section lp-bg-highlight">
          <div className="lp-container max-w-3xl text-center">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
              style={{ backgroundColor: 'hsl(15 85% 57% / 0.1)' }}
            >
              <Shield className="w-8 h-8" style={{ color: 'var(--lp-accent)' }} />
            </div>

            <h2 className="lp-heading text-2xl md:text-3xl mb-4">
              30-day money-back guarantee
            </h2>

            <p className="text-lg lp-prose max-w-2xl mx-auto">
              If you&apos;re not satisfied, contact me within 30 days for a full refund.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section id="final-cta" className="lp-section lp-bg-primary">
          <div className="lp-container max-w-3xl text-center">
            <h2 className="lp-heading text-3xl md:text-4xl mb-4">
              Important ideas deserve clear visuals
            </h2>
            <p className="text-lg opacity-80 mb-8 max-w-xl mx-auto">
              Don't let complexity hide your best thinking. Start creating explanations that stick with the Sketchplanations Explainer Kit.
            </p>
            <a href={checkoutUrl} className="lp-btn-highlight lp-btn-cta-lg">
              Get the Explainer Kit for $29
            </a>
            <p className="mt-4 text-sm opacity-70">
              Limited early access to pre-order
            </p>
          </div>
        </section>
      </main>

      {/* Landing Page Footer */}
      <footer className="lp-footer">
        <div className="lp-container max-w-5xl">
          <p>&copy; {new Date().getFullYear()} Sketchplanations. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/">Main site</Link>
            <span>&middot;</span>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Use custom layout (no global header/footer)
ExplainerKit.getLayout = (page) => page

export default ExplainerKit
