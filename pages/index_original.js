import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-noise-gradient text-slate-100 flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 shadow-md shadow-sky-500/40">
              <span className="text-xs font-bold tracking-tight">CRS</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-100">
              Creator Risk Score
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
            <a href="#how" className="hover:text-sky-400 transition">
              How it works
            </a>
            <a href="#creators" className="hover:text-sky-400 transition">
              For creators
            </a>
            <a href="#brands" className="hover:text-sky-400 transition">
              For brands
            </a>
            <a
              href="#cta"
              className="rounded-full border border-sky-400/50 bg-sky-500/10 px-4 py-1.5 text-sky-100 hover:bg-sky-500/20 transition shadow-sm shadow-sky-500/20"
            >
              Get early access
            </a>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background orbs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/25 blur-3xl" />
            <div className="absolute bottom-[-8rem] left-8 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute -right-10 top-24 h-60 w-60 rounded-full bg-violet-500/25 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:flex-row lg:items-center lg:pb-28 lg:pt-24">
            {/* Left: copy */}
            <motion.div
              className="flex-1 space-y-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-slate-900/70 px-3 py-1 text-xs font-medium text-sky-100 shadow shadow-sky-500/30"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Now in private beta — made for YouTube creators
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
              >
                Turn your channel into a{" "}
                <span className="text-gradient">scored strategy engine</span>.
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base"
              >
                Paste your YouTube handle. Creator Risk Score (CRS) pulls your recent videos,
                grades your identity, content, timing, and brand fit — then tells you exactly
                what to post next and which sponsorships to actually say yes to.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <a
                  href="#cta"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-6 py-2.5 text-sm font-semibold shadow-lg shadow-sky-500/40 hover:brightness-110 transition"
                >
                  Get my creator score
                </a>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 text-xs font-medium text-slate-200 hover:border-sky-400/60 hover:text-sky-100 transition"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-600 text-[10px] font-bold">
                    ?
                  </span>
                  How does CRS actually work?
                </button>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400"
              >
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  No channel access — just your public videos
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  Built for channel clarity, not vanity metrics
                </div>
              </motion.div>
            </motion.div>

            {/* Right: cinematic mock panel */}
            <motion.div
              className="relative mt-4 flex-1 lg:mt-0"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="card-glass relative overflow-hidden px-4 py-4 sm:px-6 sm:py-5">
                {/* Top row: score + handle */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      Live example
                    </p>
                    <p className="text-xs font-semibold text-slate-100">
                      @yourchannel
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Content, identity, timing & brand-fit in one score.
                    </p>
                  </div>
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-slate-900/80">
                    <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-sky-500 to-violet-500 opacity-70 blur-[2px]" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 shadow-inner shadow-slate-900">
                      <span className="text-2xl font-bold">82</span>
                    </div>
                  </div>
                </div>

                {/* Metrics strip */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] sm:grid-cols-4">
                  {[
                    ["Identity", "76"],
                    ["Content", "88"],
                    ["Timing", "72"],
                    ["Brand Fit", "94"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2"
                    >
                      <p className="text-[10px] text-slate-400">{label}</p>
                      <p className="text-sm font-semibold text-slate-100">
                        {value}
                      </p>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom: sample recommendations */}
                <div className="mt-4 grid gap-3 sm:grid-cols-[1.3fr_1fr]">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Next video idea
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-100">
                      "I followed my own advice for 30 days. Here&apos;s what broke."
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Hook: Start with the mess, then show how your system saved you.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-[11px] text-slate-300">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Brand check
                    </p>
                    <p className="mt-1 text-emerald-300">
                      ✅ This productivity app is a strong match.
                    </p>
                    <p className="mt-1 text-slate-400">
                      Audience overlap: 91%. Risk level: low. Suggest: 60s integrated Ad Read
                      + pinned comment CTA.
                    </p>
                  </div>
                </div>

                {/* Glow line */}
                <div className="pointer-events-none absolute -bottom-8 left-1/2 h-20 w-[140%] -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-400/40 to-transparent blur-3xl" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how"
          className="relative border-t border-slate-800/80 bg-slate-950/80"
        >
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-b from-slate-900/80 to-transparent" />
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <motion.div
              className="max-w-2xl space-y-2"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
                How it works
              </p>
              <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
                One handle in. A full content report out.
              </h2>
              <p className="text-sm text-slate-300 sm:text-[15px]">
                CRS quietly reads your public videos — titles, descriptions, posting cadence —
                and turns them into a strategic snapshot: identity, momentum, and realistic
                next moves.
              </p>
            </motion.div>

            <motion.div
              className="grid gap-5 md:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {[
                {
                  step: "01",
                  title: "Drop your YouTube handle",
                  body: "We fetch your recent uploads. No passwords. No private data. Just the content you already published.",
                },
                {
                  step: "02",
                  title: "CRS scores your creator identity",
                  body: "We grade niche clarity, content patterns, timing, and (optionally) brand-fit — then compress it into one score.",
                },
                {
                  step: "03",
                  title: "You get a next-steps playbook",
                  body: "Next video ideas, a short-form script blueprint, upload windows, and which sponsorships to actually accept.",
                },
              ].map(({ step, title, body }) => (
                <motion.div
                  key={step}
                  variants={fadeInUp}
                  className="card-glass relative flex flex-col gap-2 px-4 py-4 sm:px-5 sm:py-5"
                >
                  <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="rounded-full border border-slate-700/80 px-2 py-0.5 font-mono">
                      Step {step}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-50 sm:text-[15px]">
                    {title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-300 sm:text-[13px]">
                    {body}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* For creators */}
        <section
          id="creators"
          className="relative border-t border-slate-800/80 bg-slate-950"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:py-16">
            <motion.div
              className="flex-1 space-y-3"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                For creators
              </p>
              <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
                Stop guessing what the algorithm wants.
              </h2>
              <p className="text-sm text-slate-300 sm:text-[15px]">
                CRS is your quiet strategist. It doesn&apos;t replace your taste — it focuses it.
                You keep the voice. We highlight the patterns that actually move your channel.
              </p>
              <ul className="mt-3 space-y-2 text-xs text-slate-300 sm:text-[13px]">
                <li>• See if your niche and thumbnails tell the same story.</li>
                <li>• Compare identity, content, and timing in a single score.</li>
                <li>• Ship your next video with a pre-built hook and shot list.</li>
                <li>• Treat brand deals like a portfolio, not random cash grabs.</li>
              </ul>
            </motion.div>

            <motion.div
              className="flex-1"
              initial={{ opacity: 0, scale: 0.96, x: 24 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="card-glass relative overflow-hidden px-4 py-4 sm:px-6 sm:py-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-400">
                  Sample CRS snapshot
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  You&apos;re strongest when you teach, but your upload timing and brand picks are
                  leaving trust — and views — on the table.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3 text-[11px]">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2">
                    <p className="text-[10px] text-slate-400">Identity</p>
                    <p className="text-lg font-semibold text-slate-50">76</p>
                    <p className="mt-1 text-slate-400">
                      Clear niche. Thumbnails are 70% aligned.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2">
                    <p className="text-[10px] text-slate-400">Content</p>
                    <p className="text-lg font-semibold text-slate-50">88</p>
                    <p className="mt-1 text-slate-400">
                      Strong hook formats. Double down on challenge arcs.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2">
                    <p className="text-[10px] text-slate-400">Timing</p>
                    <p className="text-lg font-semibold text-slate-50">72</p>
                    <p className="mt-1 text-slate-400">
                      Your audience clusters after 7pm — your uploads don&apos;t.
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2.5 text-[11px]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                    Next 30 days
                  </p>
                  <p className="mt-1 text-slate-300">
                    Post 1 long-form deep dive per week + 2 shorts that reuse the same hook.
                    Protect 2 upload slots for only taking deals with 80%+ CRS brand-fit.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* For brands */}
        <section
          id="brands"
          className="relative border-t border-slate-800/80 bg-slate-950/90"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row-reverse lg:items-center lg:py-16">
            <motion.div
              className="flex-1 space-y-3"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
                For brands & agencies
              </p>
              <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
                Measure fit before you sign the invoice.
              </h2>
              <p className="text-sm text-slate-300 sm:text-[15px]">
                Instead of guessing which creator will land your message, CRS turns their
                existing content into a brand-fit profile. You see alignment, risk level, and
                audience overlap in one glance.
              </p>
              <ul className="mt-3 space-y-2 text-xs text-slate-300 sm:text-[13px]">
                <li>• Shortlist creators by alignment, not just reach.</li>
                <li>• Check if your product actually belongs in their story.</li>
                <li>• Avoid mismatches that feel like cash grabs to their audience.</li>
              </ul>
            </motion.div>

            <motion.div
              className="flex-1"
              initial={{ opacity: 0, scale: 0.96, x: -24 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="card-glass relative overflow-hidden px-4 py-4 sm:px-6 sm:py-5 text-[11px] text-slate-200">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-400">
                  Brand offer simulation
                </p>
                <p className="mt-1 text-slate-300">
                  You&apos;re considering a sponsorship for <span className="font-semibold">FocusFlow</span>, a deep-work timer app.
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2.5">
                    <p className="text-[10px] text-slate-400">Fit score</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-400">91 / 100</p>
                    <p className="mt-1 text-slate-300">
                      Their audience skews ambitious, system-obsessed, and already talking
                      about burnout and focus.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2.5">
                    <p className="text-[10px] text-slate-400">Risk</p>
                    <p className="mt-1 text-lg font-semibold text-amber-300">Low</p>
                    <p className="mt-1 text-slate-300">
                      Biggest risk is over-saturation with similar SaaS. Recommend story-first
                      integration, not pure feature demo.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Recommended angle
                    </p>
                    <p className="mt-1 text-slate-300">
                      &ldquo;I rebuilt my attention span in 30 days&rdquo; — FocusFlow is the
                      tool, not the hero.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Audience expectation
                    </p>
                    <p className="mt-1 text-slate-300">
                      High tolerance for tools, low tolerance for inauthentic reads. The creator
                      should show their real screen, not a script.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section
          id="cta"
          className="relative border-t border-slate-800/80 bg-slate-950"
        >
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-b from-slate-900/80 to-transparent" />
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
            <motion.div
              className="card-glass relative overflow-hidden px-5 py-6 sm:px-7 sm:py-7"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              <div className="pointer-events-none absolute -top-12 right-0 h-24 w-24 rounded-full bg-sky-500/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 left-0 h-24 w-24 rounded-full bg-emerald-500/25 blur-3xl" />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
                    Private beta
                  </p>
                  <h2 className="text-lg font-semibold text-slate-50 sm:text-xl">
                    Be one of the first 500 creators with a CRS.
                  </h2>
                  <p className="text-xs text-slate-300 sm:text-[13px]">
                    Drop your email and YouTube handle. We&apos;ll invite a small batch of
                    channels across different niches to shape what this becomes.
                  </p>
                </div>
                <form
                  className="flex w-full flex-col gap-2 sm:w-72"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="@yourchannel"
                    className="w-full rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <button
                    type="submit"
                    className="mt-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/40 hover:brightness-110 transition"
                  >
                    Request early access
                  </button>
                  <p className="text-[10px] text-slate-500">
                    No spam, no list flipping. Just product updates and a chance to steer CRS.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/95">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-[11px] text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()}   PavanKumarEtta. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-sky-400 transition">
              Terms
            </a>
            <a href="#" className="hover:text-sky-400 transition">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}