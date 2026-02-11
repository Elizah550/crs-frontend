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
