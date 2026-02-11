// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useRouter } from "next/router"; 

// const fadeInUp = {
//   hidden: { opacity: 0, y: 24 },
//   visible: { opacity: 1, y: 0 },
// };

// const staggerContainer = {
//   hidden: {},
//   visible: {
//     transition: {
//       staggerChildren: 0.12,
//     },
//   },
// };

// export default function Home() {
//   const router = useRouter();  
//   const [handle, setHandle] = useState("");
//   const [loading, setLoading] = useState(false); // kept for button UI, but not used
//   const [error, setError] = useState("");
//   const [data, setData] = useState(null);       // kept so JSX below still works

//   const identityScore = data?.scores?.identity ?? 76;
//   const contentScore = data?.scores?.content ?? 88;
//   const timingScore = data?.scores?.timing ?? 72;
//   const brandFitScore = data?.scores?.brandFit ?? 94;
//   const overallScore = data?.scores?.overall ?? 82;

//   async function handleGetScore(e) {
//     e.preventDefault();
//     setError("");

//     // OPTIONAL: store handle so dashboard can read it and call the API there
//     if (typeof window !== "undefined") {
//       window.localStorage.setItem("crsHandle", handle);
//     }

//     // Just redirect to dashboard – no API call here
//     router.push("/dashboard");
//   }

//   const metricItems = [
//     ["Identity", identityScore],
//     ["Content", contentScore],
//     ["Timing", timingScore],
//     ["Brand Fit", brandFitScore],
//   ];

//   const nextVideoTitle =
//     data?.nextVideo?.title ||
//     `"I followed my own advice for 30 days. Here’s what broke."`;

//   const nextVideoHook =
//     data?.nextVideo?.hook ||
//     "Hook: Start with the mess, then show how your system saved you.";

//   const brandSummary =
//     data?.brandCheck?.summary ||
//     "This productivity app is a strong match. Audience overlap: 91%. Risk level: low. Suggest: 60s integrated Ad Read + pinned comment CTA.";

//   return (
//     <div className="min-h-screen bg-noise-gradient text-slate-100 flex flex-col">
//       {/* Navigation */}
//       <header className="sticky top-0 z-30 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-xl">
//         <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
//           <div className="flex items-center gap-2">
//             <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 shadow-md shadow-sky-500/40">
//               <span className="text-xs font-bold tracking-tight">CRS</span>
//             </div>
//             <span className="text-sm font-semibold tracking-tight text-slate-100">
//               Creator Risk Score
//             </span>
//           </div>
//           <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
//             <a href="#how" className="hover:text-sky-400 transition">
//               How it works
//             </a>
//             <a href="#creators" className="hover:text-sky-400 transition">
//               For creators
//             </a>
//             <a href="#brands" className="hover:text-sky-400 transition">
//               For brands
//             </a>
//             <a
//               href="#cta"
//               className="rounded-full border border-sky-400/50 bg-sky-500/10 px-4 py-1.5 text-sky-100 hover:bg-sky-500/20 transition shadow-sm shadow-sky-500/20"
//             >
//               Get early access
//             </a>
//           </div>
//         </nav>
//       </header>

//       {/* Main content */}
//       <main className="flex-1">
//         {/* Hero Section */}
//         <section className="relative overflow-hidden">
//           {/* Background orbs */}
//           <div className="pointer-events-none absolute inset-0">
//             <div className="absolute -top-40 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/25 blur-3xl" />
//             <div className="absolute bottom-[-8rem] left-8 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
//             <div className="absolute -right-10 top-24 h-60 w-60 rounded-full bg-violet-500/25 blur-3xl" />
//           </div>

//           <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:flex-row lg:items-center lg:pb-28 lg:pt-24">
//             {/* Left: copy */}
//             <motion.div
//               className="flex-1 space-y-6"
//               variants={staggerContainer}
//               initial="hidden"
//               animate="visible"
//             >
//               <motion.div
//                 variants={fadeInUp}
//                 className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-slate-900/70 px-3 py-1 text-xs font-medium text-sky-100 shadow shadow-sky-500/30"
//               >
//                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//                 Now in private beta — made for YouTube creators
//               </motion.div>

//               <motion.h1
//                 variants={fadeInUp}
//                 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
//               >
//                 Turn your channel into a{" "}
//                 <span className="text-gradient">scored strategy engine</span>.
//               </motion.h1>

//               <motion.p
//                 variants={fadeInUp}
//                 className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base"
//               >
//                 Paste your YouTube handle. Creator Risk Score (CRS) pulls your
//                 recent videos, grades your identity, content, timing, and brand
//                 fit — then tells you exactly what to post next and which
//                 sponsorships to actually say yes to.
//               </motion.p>

//               <motion.div variants={fadeInUp} className="space-y-3">
//                 <form
//                   onSubmit={handleGetScore}
//                   className="flex flex-col gap-3 sm:flex-row sm:items-center"
//                 >
//                   <input
//                     type="text"
//                     placeholder="@yourchannel"
//                     className="flex-1 rounded-full border border-slate-700/80 bg-slate-950/80 px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
//                     value={handle}
//                     onChange={(e) => setHandle(e.target.value)}
//                   />
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-6 py-2.5 text-sm font-semibold shadow-lg shadow-sky-500/40 hover:brightness-110 transition disabled:opacity-60"
//                   >
//                     {loading ? "Scoring..." : "Get my creator score"}
//                   </button>
//                 </form>

//                 <button
//                   type="button"
//                   className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 text-xs font-medium text-slate-200 hover:border-sky-400/60 hover:text-sky-100 transition"
//                 >
//                   <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-600 text-[10px] font-bold">
//                     ?
//                   </span>
//                   How does CRS actually work?
//                 </button>

//                 {error && (
//                   <p className="text-xs text-red-400">{error}</p>
//                 )}
//               </motion.div>

//               <motion.div
//                 variants={fadeInUp}
//                 className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400"
//               >
//                 <div className="flex items-center gap-2">
//                   <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//                   No channel access — just your public videos
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
//                   Built for channel clarity, not vanity metrics
//                 </div>
//               </motion.div>
//             </motion.div>

//             {/* Right: cinematic mock panel */}
//             <motion.div
//               className="relative mt-4 flex-1 lg:mt-0"
//               initial={{ opacity: 0, x: 40 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.7, ease: "easeOut" }}
//             >
//               <div className="card-glass relative overflow-hidden px-4 py-4 sm:px-6 sm:py-5">
//                 {/* Top row: score + handle */}
//                 <div className="flex items-center justify-between gap-4">
//                   <div>
//                     <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
//                       Live example
//                     </p>
//                     <p className="text-xs font-semibold text-slate-100">
//                       {handle || "@yourchannel"}
//                     </p>
//                     <p className="text-[11px] text-slate-400">
//                       {data?.channel?.description
//                         ? `${data.channel.description.slice(0, 80)}${
//                             data.channel.description.length > 80 ? "…" : ""
//                           }`
//                         : "Content, identity, timing & brand-fit in one score."}
//                     </p>
//                   </div>
//                   <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-slate-900/80">
//                     <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-sky-500 to-violet-500 opacity-70 blur-[2px]" />
//                     <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 shadow-inner shadow-slate-900">
//                       <span className="text-2xl font-bold">{overallScore}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Metrics strip */}
//                 <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] sm:grid-cols-4">
//                   {metricItems.map(([label, value]) => (
//                     <div
//                       key={label}
//                       className="rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2"
//                     >
//                       <p className="text-[10px] text-slate-400">{label}</p>
//                       <p className="text-sm font-semibold text-slate-100">
//                         {value}
//                       </p>
//                       <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-800">
//                         <div
//                           className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"
//                           style={{ width: `${value}%` }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Bottom: sample recommendations */}
//                 <div className="mt-4 grid gap-3 sm:grid-cols-[1.3fr_1fr]">
//                   <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2.5">
//                     <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
//                       Next video idea
//                     </p>
//                     <p className="mt-1 text-xs font-semibold text-slate-100">
//                       {nextVideoTitle}
//                     </p>
//                     <p className="mt-1 text-[11px] text-slate-400">
//                       {nextVideoHook}
//                     </p>
//                   </div>
//                   <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-[11px] text-slate-300">
//                     <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
//                       Brand check
//                     </p>
//                     <p className="mt-1 text-emerald-300">
//                       ✅ {brandSummary}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Glow line */}
//                 <div className="pointer-events-none absolute -bottom-8 left-1/2 h-20 w-[140%] -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-400/40 to-transparent blur-3xl" />
//               </div>
//             </motion.div>
//           </div>
//         </section>

//         {/* The rest of your sections (How it works / For creators / For brands / CTA) stay exactly the same */}
//         {/* ... */}
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-slate-800/80 bg-slate-950/95">
//         <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-[11px] text-slate-500 sm:flex-row sm:px-6 lg:px-8">
//           <p>
//             © {new Date().getFullYear()} PavanKumarEtta. All rights reserved.
//           </p>
//           <div className="flex gap-4">
//             <a href="#" className="hover:text-sky-400 transition">
//               Terms
//             </a>
//             <a href="#" className="hover:text-sky-400 transition">
//               Privacy
//             </a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }



/////////////////////////////////////////////////////////////////////////////////////
// pages/index.js
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const demoScore = 84;

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleGetScore(e) {
    e.preventDefault();
    setError("");

    if (!handle.trim()) {
      setError("Paste your YouTube handle first.");
      return;
    }

    setLoading(true);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("crsHandle", handle.trim());
      }
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050614] text-slate-50">
     
      <div className="pointer-events-none fixed inset-0 -z-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Syncfluence_Cover.png')" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(65,120,255,0.55),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,159,67,0.5),_transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#050614]/85 to-[#050614]" />
      </div>

{/*   
      <header className="sticky top-4 z-30 px-4 sm:px-6 lg:px-30">
        <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-black/35 px-4 py-2.5 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.9)]">
  
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2e86ff] via-[#7f5dff] to-[#ff9f43]">
              <span className="text-sm font-semibold text-white">S</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Syncfluence
            </span>
          </div>

    
          <div className="hidden md:flex items-center gap-7 text-[11px] font-medium text-slate-200">
            <button
              onClick={() => scrollToId("why")}
              className="hover:text-[#a0b9ff] transition"
            >
              Why Syncfluence
            </button>
            <button
              onClick={() => scrollToId("platforms")}
              className="hover:text-[#a0b9ff] transition"
            >
              Platforms
            </button>
            <button
              onClick={() => scrollToId("docs")}
              className="hover:text-[#a0b9ff] transition"
            >
              Docs / Scoring
            </button>
          </div>

          
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] text-slate-200 border border-white/12">
              <span className="text-[12px] leading-none">𝕏</span>
              <span className="opacity-80">soon</span>
            </div>
            <button
              onClick={() => scrollToId("score-form")}
              className="rounded-full bg-gradient-to-r from-[#2e86ff] via-[#7f5dff] to-[#ff9f43] px-4 py-1.5 text-[11px] font-semibold text-white shadow-lg shadow-[#2e86ff]/40 hover:brightness-110 transition"
            >
              Try my score →
            </button>
          </div>
        </nav>
      </header> */}
      <header className="sticky top-4 z-30 px-4 sm:px-6 lg:px-30">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-black/35 px-4 py-2.5 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.9)]">

        {/* Left – Logo Images */}
        <div className="flex items-center gap-3">
          {/* Small Icon Logo */}
          {/* <img
            src="/Syncfluence_logo.png"
            alt="Logo"
            className="h-9 w-9 rounded-2xl object-contain"
          /> */}

          {/* Full Syncfluence Logo */}
          <img
            src="/Syncfluence_Cover.png"
            alt="Syncfluence Logo"
            className="h-6 object-contain"
          />
        </div>

        {/* Center – links */}
        <div className="hidden md:flex items-center gap-7 text-[11px] font-medium text-slate-200">
          <button onClick={() => scrollToId("why")} className="hover:text-[#a0b9ff] transition">
            Why Syncfluence
          </button>
          <button onClick={() => scrollToId("platforms")} className="hover:text-[#a0b9ff] transition">
            Platforms
          </button>
          <button onClick={() => scrollToId("docs")} className="hover:text-[#a0b9ff] transition">
            Docs / Scoring
          </button>
        </div>

        {/* Right – X + CTA */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] text-slate-200 border border-white/12">
            <span className="text-[12px] leading-none">𝕏</span>
            <span className="opacity-80">soon</span>
          </div>

          <button
            onClick={() => scrollToId("score-form")}
            className="rounded-full bg-gradient-to-r from-[#2e86ff] via-[#7f5dff] to-[#ff9f43] px-4 py-1.5 text-[11px] font-semibold text-white shadow-lg shadow-[#2e86ff]/40 hover:brightness-110 transition"
          >
            Try my score →
          </button>
        </div>
      </nav>
    </header>


      {/* MAIN */}
      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-20 sm:px-6 lg:px-10 lg:pt-24">
          <motion.div
            className="flex flex-col items-center text-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Big headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-[3.5rem]"
            >
              See your{" "}
              <span className="bg-gradient-to-r from-[#9bb8ff] via-white to-[#ffcf86] bg-clip-text text-transparent">
                "Creator Trust Score"
              </span>{" "}
              before your Brand does.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="mt-4 max-w-2xl text-[14px] leading-relaxed text-slate-200"
            >
              Syncfluence turns your identity, content, watch time and brand fit
              into a single <span className="font-semibold">0–100 score</span>.
              Screenshot it, share it, and use it to negotiate better deals.
            </motion.p>

            {/* Primary buttons */}
            <motion.div
              variants={fadeInUp}
              className="mt-7 flex flex-wrap items-center justify-center gap-4"
            >
              <button
                onClick={() => scrollToId("score-form")}
                className="rounded-full bg-gradient-to-r from-[#2e86ff] to-[#7f5dff] px-6 py-2.5 text-sm font-semibold shadow-lg shadow-[#2e86ff]/40 hover:brightness-110 transition"
              >
                Get my score in 30s →
              </button>
              <button
                onClick={() => scrollToId("docs")}
                className="rounded-full border border-white/15 bg-black/40 px-5 py-2.5 text-sm font-medium text-slate-100 hover:border-white/35 transition"
              >
                View scoring docs
              </button>
            </motion.div>

            {/* Score preview card */}
            <motion.div
              variants={fadeInUp}
              className="mt-12 w-full max-w-4xl"
            >
              <div className="relative overflow-hidden rounded-[32px] border border-white/12 bg-black/45 px-4 py-8 sm:px-8 sm:py-10 backdrop-blur-2xl shadow-[0_26px_80px_rgba(0,0,0,0.9)]">
                {/* inner subtle radial glow */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(118,162,255,0.45),_transparent_55%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,159,67,0.4),_transparent_55%)]" />

                <div className="relative grid gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-center">
                  {/* Left copy */}
                  <div className="text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2e86ff] via-[#7f5dff] to-[#ff9f43]">
                        <span className="text-sm font-semibold text-white">
                          S
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold">
                          Syncfluence Creator Score
                        </p>
                        <p className="text-[11px] text-slate-300">
                          Sample channel · Private beta
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-[13px] text-slate-200">
                      This is what your score will look like — one number brands
                      can read in two seconds, backed by real signals instead of
                      vibes.
                    </p>

                    <div className="mt-6 space-y-2 text-[11px] text-slate-300">
                      <p className="font-semibold text-slate-200">
                        Generated from Sync:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["Identity", "Content", "Watch time", "Brand fit"].map(
                          (chip) => (
                            <span
                              key={chip}
                              className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px]"
                            >
                              {chip}
                            </span>
                          )
                        )}
                      </div>
                      <button
                        onClick={() => scrollToId("docs")}
                        className="mt-3 inline-flex items-center gap-1 text-[11px] text-[#9bb8ff] hover:text-white transition"
                      >
                        Learn exactly how the score is calculated →
                      </button>
                    </div>
                  </div>

                  {/* Right – big score circle */}
                  <div className="flex items-center justify-center">
                    <div className="relative h-40 w-40 sm:h-44 sm:w-44">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2e86ff] via-[#7f5dff] to-[#ff9f43] opacity-90 blur-[2px]" />
                      <div className="absolute inset-[6px] rounded-full bg-black/90" />
                      <div className="relative flex h-full w-full flex-col items-center justify-center rounded-full">
                        <span className="text-4xl sm:text-5xl font-bold">
                          {demoScore}
                        </span>
                        <span className="mt-2 text-[11px] uppercase tracking-[0.22em] text-slate-300">
                          / 100
                        </span>
                        <span className="mt-1 text-[11px] text-slate-200">
                          Creator Score
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Handle form under card */}
            <motion.div
              id="score-form"
              variants={fadeInUp}
              className="mt-10 w-full max-w-xl space-y-3"
            >
              <form
                onSubmit={handleGetScore}
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <input
                  type="text"
                  placeholder="@yourchannel"
                  className="flex-1 rounded-full border border-white/15 bg-black/60 px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-[#2e86ff] focus:outline-none focus:ring-1 focus:ring-[#2e86ff]"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-[13px] font-semibold text-black shadow-md hover:bg-slate-100 transition disabled:opacity-60"
                >
                  {loading ? "Scoring…" : "Get my score →"}
                </button>
              </form>
              {error && (
                <p className="text-[11px] text-red-400 text-left">{error}</p>
              )}
              <p className="text-[11px] text-slate-300">
                Free scan · We only read your public videos · No channel access.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* SIMPLE SECTIONS BELOW (you can tweak copy) */}
        <section
          id="why"
          className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-10"
        >
          <h2 className="text-center text-lg font-semibold sm:text-xl">
            Why creators use Syncfluence
          </h2>
          <p className="mt-2 text-center text-sm text-slate-300">
            Because brands already score you in the background. We just show it
            to you first.
          </p>
        </section>

        <section
          id="platforms"
          className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-10"
        >
          <h2 className="text-center text-lg font-semibold sm:text-xl">
            Platforms we&apos;re starting with
          </h2>
          <p className="mt-2 text-center text-sm text-slate-300">
            YouTube first, Instagram and TikTok next. One score across every
            platform you care about.
          </p>
        </section>

        <section
          id="docs"
          className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-10"
        >
          <h2 className="text-center text-lg font-semibold sm:text-xl">
            How the Creator Score is generated
          </h2>
          <p className="mt-3 text-center text-sm text-slate-300 max-w-3xl mx-auto">
            Under the hood we combine public stats (views, subscribers, upload
            cadence), estimated watch time from your last 10 videos, and
            language signals from your titles and descriptions. Each signal is
            normalised, weighted, and blended into a single 0–100 Creator Score.
            Think of it as the number a good brand manager would quietly write
            down after scanning your channel.
          </p>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-[11px] text-slate-400 sm:flex-row sm:px-6 lg:px-10">
          <p>© {new Date().getFullYear()} Syncfluence. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#a0b9ff] transition">
              Terms
            </a>
            <a href="#" className="hover:text-[#a0b9ff] transition">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
  