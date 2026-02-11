// pages/dashboard.js
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

function scoreLabel(score) {
  if (score >= 90) return "Elite";
  if (score >= 80) return "Pro";
  if (score >= 65) return "Rising";
  if (score >= 50) return "Early";
  return "Starting out";
}

function tierDescription(score) {
  const label = scoreLabel(score);
  if (label === "Elite")
    return "You’re in the top creator tier. Brands see you as a safe, high-leverage bet. Now it’s about choosing the right deals and protecting your time.";
  if (label === "Pro")
    return "You’re already a strong creator. A bit more consistency and you can negotiate long-term partnerships instead of one-off shoutouts.";
  if (label === "Rising")
    return "You’re in the sweet spot: growing, learning fast, and one focused 30-day sprint away from breaking out.";
  if (label === "Early")
    return "You have signal, but it’s noisy. Focus on one niche and one upload rhythm before you worry about sponsors.";
  return "You’re just getting started. This is the perfect time to experiment, find your voice, and learn what your audience actually clicks.";
}

function detectNiche(channel) {
  const text = (
    (channel?.title || "") +
    " " +
    (channel?.description || "")
  ).toLowerCase();

  if (
    text.includes("pubg") ||
    text.includes("valorant") ||
    text.includes("gamer") ||
    text.includes("gaming") ||
    text.includes("fortnite")
  ) {
    return "gaming";
  }
  if (
    text.includes("study") ||
    text.includes("productivity") ||
    text.includes("notion") ||
    text.includes("student") ||
    text.includes("self improvement")
  ) {
    return "productivity";
  }
  if (
    text.includes("gym") ||
    text.includes("fitness") ||
    text.includes("workout") ||
    text.includes("bodybuilding")
  ) {
    return "fitness";
  }
  if (
    text.includes("stock") ||
    text.includes("trading") ||
    text.includes("investing") ||
    text.includes("finance") ||
    text.includes("crypto")
  ) {
    return "finance";
  }
  return "general";
}

function getDefaultBrands(niche) {
  if (niche === "gaming") {
    return [
      { name: "Razer", score: 92, category: "Gaming gear", emoji: "🎮" },
      { name: "Logitech G", score: 89, category: "Peripherals", emoji: "🖱️" },
      { name: "Elgato", score: 87, category: "Creator tools", emoji: "🎛️" },
      { name: "Red Bull", score: 78, category: "Energy drink", emoji: "⚡" },
    ];
  }
  if (niche === "productivity") {
    return [
      { name: "Notion", score: 93, category: "Workspace app", emoji: "📒" },
      { name: "ClickUp", score: 88, category: "Project management", emoji: "📌" },
      { name: "Grammarly", score: 84, category: "Writing assistant", emoji: "✍️" },
      { name: "Slack", score: 80, category: "Team chat", emoji: "💬" },
    ];
  }
  if (niche === "fitness") {
    return [
      { name: "Gymshark", score: 91, category: "Gym apparel", emoji: "💪" },
      { name: "MyProtein", score: 88, category: "Supplements", emoji: "🥤" },
      { name: "Nike", score: 86, category: "Sportswear", emoji: "👟" },
      { name: "Adidas", score: 83, category: "Sportswear", emoji: "🏃‍♂️" },
    ];
  }
  if (niche === "finance") {
    return [
      { name: "Robinhood", score: 88, category: "Investing app", emoji: "📈" },
      { name: "Coinbase", score: 84, category: "Crypto exchange", emoji: "🪙" },
      { name: "Revolut", score: 82, category: "Finance app", emoji: "💳" },
      { name: "TradingView", score: 80, category: "Charting", emoji: "📊" },
    ];
  }
  return [
    { name: "Canva", score: 90, category: "Design tool", emoji: "🎨" },
    { name: "Adobe Creative Cloud", score: 87, category: "Creative suite", emoji: "🎬" },
    { name: "Spotify", score: 82, category: "Audio partner", emoji: "🎧" },
    { name: "Amazon", score: 80, category: "E-commerce", emoji: "📦" },
  ];
}

function getDefaultNextVideo(niche) {
  if (niche === "gaming") {
    return {
      title: "I Let Chat Control My Game for 24 Hours (Chaos Ensues)",
      hook:
        "Make chat vote live on your weapons, challenges, or handicaps. Lean into rage + funny fails + one clutch moment at the end.",
    };
  }
  if (niche === "productivity") {
    return {
      title: "I Tried a ‘No Zero Days’ Routine for 30 Days",
      hook:
        "Show the messy desk → simple system → before/after screenshots. Make it feel doable, not perfect.",
    };
  }
  if (niche === "fitness") {
    return {
      title: "From 0 to 20 Push-Ups: The 14-Day Challenge",
      hook:
        "Start with you struggling on camera, then build a mini-program with real progress check-ins.",
    };
  }
  if (niche === "finance") {
    return {
      title: "I Lived on ₹500 a Day for a Week (Real Numbers)",
      hook:
        "Show every rupee. Screenshots, budgeting app, and one big lesson at the end about where money *actually* goes.",
    };
  }
  return {
    title: "What Happens If I Commit to One Thing for 30 Days?",
    hook:
      "Pick one habit that fits your channel and document the tiny, honest daily updates instead of a perfect transformation.",
  };
}

function watchTimeNote(score, hours) {
  if (score == null || hours == null)
    return "Once you post a few more videos, we’ll estimate your recent watch time and retention.";
  if (score >= 80)
    return `Your recent ${hours.toFixed(
      1
    )} hours of watch time shows people don’t just click — they actually stay. Great foundations for long-term brand deals.`;
  if (score >= 60)
    return `You’ve got around ${hours.toFixed(
      1
    )} hours of recent watch time. Good signal, but a stronger first 15 seconds could turn this into binge territory.`;
  return `With roughly ${hours.toFixed(
    1
  )} hours of recent watch time, there’s a lot of upside. Focus your titles/thumbnails around one clear promise per video.`;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ref for the story card
  const storyCardRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedHandle = window.localStorage.getItem("crsHandle") || "";
    setHandle(storedHandle);

    if (!storedHandle) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/creator-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channelUrl: storedHandle }),
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Failed to fetch creator score");
        }

        setData(json);
        window.localStorage.setItem("crsData", JSON.stringify(json));
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const scores = data?.scores || {};
  const hasScores = Object.keys(scores).length > 0;

  const identityScore = hasScores ? scores.identity : null;
  const contentScore = hasScores ? scores.content : null;
  const timingScore = hasScores ? scores.timing : null;
  const brandFitScore = hasScores ? scores.brandFit : null;
  const overallScore = hasScores ? scores.overall : null;
  const watchTimeScore = hasScores ? scores.watchTime : null;

  const niche = detectNiche(data?.channel);
  const estimatedWatchTimeHours =
    data?.estimatedWatchTime?.recent10Hours != null
      ? data.estimatedWatchTime.recent10Hours
      : null;

  const defaultNext = getDefaultNextVideo(niche);
  const nextVideoTitle = data?.nextVideo?.title || defaultNext.title;
  const nextVideoHook = data?.nextVideo?.hook || defaultNext.hook;

  const brandSummary =
    data?.brandCheck?.summary ||
    "We analysed your recent uploads and audience. The brands below are actually in the market today and match your current vibe.";

  const brandMatches =
    (data?.brandCheck?.matches &&
      data.brandCheck.matches.length > 0 &&
      data.brandCheck.matches) ||
    getDefaultBrands(niche);

  const inspirationChannels = data?.inspiration?.channels || [];
  const profilePictureUrl = data?.channel?.profilePictureUrl || null;

  const metricItems = [
    {
      key: "identity",
      label: "Identity",
      value: identityScore,
      description:
        "How clearly viewers understand who you are and what you stand for.",
    },
    {
      key: "content",
      label: "Content",
      value: contentScore,
      description: "How strong your topics, hooks, and packaging are.",
    },
    {
      key: "timing",
      label: "Timing",
      value: timingScore,
      description: "How well you post when your audience is actually online.",
    },
    {
      key: "brandFit",
      label: "Brand fit",
      value: brandFitScore,
      description: "How naturally real brands can live inside your content.",
    },
    {
      key: "watchTime",
      label: "Watch time",
      value: watchTimeScore,
      description:
        "How well you turn clicks into actual minutes watched vs. pure impressions.",
    },
  ];

  const handleMagicClick = () => {
    if (typeof window === "undefined") return;
    const el = document.getElementById("magic-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDownloadStory = async () => {
    if (!storyCardRef.current) return;
    try {
      const canvas = await html2canvas(storyCardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `syncfluence-crs-${handle.replace("@", "")}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to download story card", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#020617] via-[#020617] to-[#020617] text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
          <p className="text-xs tracking-wide text-slate-400">
            Scanning your channel and building your CRS dashboard…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-200">
        <p className="mb-2 text-sm font-semibold text-red-400">
          Something went wrong
        </p>
        <p className="mb-4 text-xs text-slate-400">{error}</p>
        <a
          href="/"
          className="rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-4 py-2 text-xs font-semibold text-slate-900"
        >
          Try another channel
        </a>
      </div>
    );
  }

  if (!handle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-200">
        <p className="mb-3 text-sm">
          No channel handle found. Start from the landing page.
        </p>
        <a
          href="/"
          className="rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-4 py-2 text-xs font-semibold text-slate-900"
        >
          Go to Creator Risk Score
        </a>
      </div>
    );
  }

  const tier = overallScore != null ? scoreLabel(overallScore) : "Unknown";
  const xpToNext = overallScore != null ? Math.max(0, 100 - overallScore) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#02091f] to-[#020617] text-slate-50">
      {/* Top nav */}
      <header className="border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-pink-500 shadow-md shadow-sky-500/40">
              <span className="text-xs font-semibold">CRS</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">Creator Score</span>
              <span className="text-[11px] text-slate-400">
                Dashboard for @{handle.replace("@", "")}
              </span>
            </div>
          </div>

          <a
            href="/"
            className="rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1.5 text-[11px] text-slate-300 hover:border-sky-400 hover:text-sky-100 transition"
          >
            New channel →
          </a>
        </nav>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-6 lg:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Today&apos;s CRS breakdown
            </p>
            <h1 className="mt-1 text-xl font-semibold text-slate-50">
              Not just a report — this is your game plan for the next 30 days.
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/70 px-2 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                Niche:{" "}
                <span className="font-semibold capitalize">
                  {niche === "general" ? "Mixed / general" : niche}
                </span>
              </span>
              {estimatedWatchTimeHours != null && (
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/70 px-2 py-0.5">
                  ⏱️ Recent watch time (10 vids):{" "}
                  <span className="font-semibold">
                    {estimatedWatchTimeHours.toFixed(1)}h
                  </span>
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Strong
                signal
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-400" /> Needs
                focus
              </span>
            </div>
            <button
              onClick={handleMagicClick}
              className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-4 py-1.5 text-[11px] font-semibold text-slate-50 shadow-lg shadow-sky-500/40 hover:brightness-110 transition"
            >
              ✨ Do the magic
            </button>
          </div>
        </div>

        {/* Top grid */}
        <section className="grid gap-6 xl:grid-cols-[1.5fr,0.9fr]">
          {/* Overall score + metrics + insights */}
          <motion.div
            className="rounded-[26px] border border-slate-800 bg-slate-950/80 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.9)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Top row: score highlighted */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400">
                  Overall creator score
                </p>
                <h2 className="text-lg font-semibold">@{handle.replace("@", "")}</h2>
                <p className="max-w-xl text-[12px] text-slate-400">
                  {data?.channel?.description
                    ? `${data.channel.description.slice(0, 140)}${
                        data.channel.description.length > 140 ? "…" : ""
                      }`
                    : "We blended your identity, content, timing, watch time and brand fit into one number brands and the algorithm instantly understand."}
                </p>
              </div>

              {/* BIG score ring + download button */}
              <motion.div
                className="relative flex flex-col items-center gap-2"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="relative flex h-32 w-32 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-pink-500 opacity-90 blur-[3px]" />
                  <div className="absolute inset-[6px] rounded-full bg-slate-950" />
                  <div className="relative flex flex-col items-center justify-center">
                    <span className="text-[34px] font-semibold leading-none">
                      {overallScore != null ? overallScore : "—"}
                    </span>
                    <span className="mt-1 text-[10px] uppercase tracking-wide text-slate-300">
                      {overallScore != null ? scoreLabel(overallScore) : "No data"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleDownloadStory}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-[10px] font-semibold text-slate-200 hover:border-sky-400 hover:text-sky-100 transition"
                >
                  ⬇️ Download story card
                </button>
              </motion.div>
            </div>

            {/* Overall explanation */}
            <div className="mt-4 grid gap-3 md:grid-cols-[1.3fr,0.9fr] text-[11px] text-slate-300">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-sky-400 mb-1">
                  What this score really means
                </p>
                <p>
                  {overallScore != null ? (
                    <>
                      With a score of{" "}
                      <span className="font-semibold">{overallScore}/100</span>,
                      you&apos;re in the{" "}
                      <span className="font-semibold">{tier}</span> band.{" "}
                      {tierDescription(overallScore)}
                    </>
                  ) : (
                    "We couldn’t compute a full score yet — try analysing this channel again after a few more uploads."
                  )}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 mb-1">
                    XP to next tier
                  </p>
                  <p>
                    {xpToNext != null
                      ? `You’re roughly ${xpToNext} “score points” away from a perfect 100. That’s usually 4–8 really dialed-in uploads.`
                      : "Upload consistently for a few weeks and we’ll estimate how far you are from the next tier."}
                  </p>
                </div>
                {xpToNext != null && (
                  <div className="mt-3">
                    <div className="h-1.5 w-full rounded-full bg-slate-800">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400"
                        style={{ width: `${Math.min(100, overallScore)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Each focused upload nudges this bar closer to 100.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Metric cards */}
            <div className="mt-5 grid gap-3 md:grid-cols-5">
              {metricItems.map((item) => {
                const v = item.value;
                const label = v != null ? scoreLabel(v) : "No data";

                const isStrong = v != null && v >= 70;
                const badgeClasses = isStrong
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
                  : "bg-amber-500/10 text-amber-200 border-amber-500/40";

                return (
                  <motion.div
                    key={item.key}
                    className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-slate-400">{item.label}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] border ${badgeClasses}`}
                      >
                        {label}
                      </span>
                    </div>
                    <p className="mt-1 text-base font-semibold">
                      {v != null ? `${v} / 100` : "—"}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {item.description}
                    </p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-pink-400"
                        style={{ width: `${v != null ? v : 0}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Watch time explanation row */}
            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-[11px] text-slate-300">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">
                Watch time as proof, not vanity
              </p>
              <p>{watchTimeNote(watchTimeScore, estimatedWatchTimeHours)}</p>
            </div>
          </motion.div>

          {/* Right side – stats + quick missions */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <div className="rounded-[24px] border border-slate-800 bg-slate-950/80 p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
                Channel overview
              </p>
              <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                <p>
                  <span className="text-slate-500">Videos analysed:</span>{" "}
                  {data?.videos?.length ?? "—"}
                </p>
                <p>
                  <span className="text-slate-500">Subscribers:</span>{" "}
                  {data?.channel?.statistics?.subscriberCount ?? "—"}
                </p>
                <p>
                  <span className="text-slate-500">Total views:</span>{" "}
                  {data?.channel?.statistics?.viewCount ?? "—"}
                </p>
                <p>
                  <span className="text-slate-500">
                    Approx. watch time (last 10 vids):
                  </span>{" "}
                  {estimatedWatchTimeHours != null
                    ? `${estimatedWatchTimeHours.toFixed(1)} hours`
                    : "—"}
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-800 bg-slate-950/80 p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
                7-day missions
              </p>
              <ul className="mt-3 space-y-2 text-xs text-slate-300">
                <li>• Post 2 uploads that match the next-video pattern below.</li>
                <li>• Cut 3 Shorts from the highest-energy 5 seconds.</li>
                <li>• DM 2 of the suggested brands with this CRS screenshot.</li>
                <li>
                  • Pick 1 inspiration channel below and reverse-engineer their
                  last thumbnail + title combo.
                </li>
              </ul>
              <p className="mt-3 text-[11px] text-slate-400">
                Scroll down or hit <span className="font-semibold">“Do the magic”</span> to see the exact idea, brands and channels to study.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Bottom grid – next video + brand fit */}
        <section
          id="magic-section"
          className="mt-7 grid gap-6 lg:grid-cols-[1.1fr,1.1fr]"
        >
          {/* Next video idea */}
          <motion.div
            className="rounded-[26px] border border-slate-800 bg-slate-950/80 p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
              Next video idea
            </p>
            <h3 className="mt-2 text-sm font-semibold text-slate-50">
              {nextVideoTitle}
            </h3>
            <p className="mt-2 text-xs text-slate-300">{nextVideoHook}</p>

            <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-3 text-[11px] text-slate-300">
              <p className="text-[10px] uppercase tracking-[0.2em] text-sky-400">
                Shot list blueprint
              </p>
              <ul className="mt-2 space-y-1.5">
                <li>1. 3–5 second cold open: the most chaotic or emotional moment.</li>
                <li>2. 10–15 seconds of fast context: who you are, what’s at stake.</li>
                <li>3. 2–3 big beats: challenge, twist, or conflict escalating.</li>
                <li>4. Payoff + subtle CTA: tease the next upload or mini-series.</li>
              </ul>
            </div>
          </motion.div>

          {/* Brand fit */}
          <motion.div
            className="rounded-[26px] border border-slate-800 bg-slate-950/80 p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
              Brand fit (real sponsors)
            </p>

            <div className="mt-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-[11px] text-emerald-200">
              <p>✅ {brandSummary}</p>
            </div>

            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Top brands that would actually make sense
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {brandMatches.map((brand) => (
                  <div
                    key={brand.name}
                    className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-[11px]"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500/70 via-indigo-500/70 to-pink-500/70 text-sm">
                      <span>{brand.emoji || brand.name[0]}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-50">
                        {brand.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {brand.category} • Fit{" "}
                        {brand.score != null ? `${brand.score}%` : "—"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-[11px] text-slate-300">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                How to use this
              </p>
              <ul className="mt-2 space-y-1.5">
                <li>
                  • Screenshot this dashboard and attach it when you email a brand
                  — it proves you’ve thought about fit.
                </li>
                <li>
                  • Start with brands over <span className="font-semibold">80% fit</span>{" "}
                  and pitch 1 video + 3 Shorts package.
                </li>
                <li>
                  • If a brand under 70% reaches out, ask yourself: “Would my audience
                  expect to see this here?” If not, say no.
                </li>
              </ul>
            </div>
          </motion.div>
        </section>

        {/* Story card preview + inspiration channels */}
        <section className="mt-7 grid gap-6 lg:grid-cols-[0.8fr,1.2fr]">
          {/* IG-style story card with Syncfluence gradient */}
          <motion.div
            className="rounded-[26px] border border-slate-800 bg-slate-950/80 p-5 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
          >
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
              Story card preview
            </p>
            <div
              ref={storyCardRef}
              className="flex h-[340px] w-[190px] flex-col justify-between rounded-[26px] bg-gradient-to-br from-[#3EE7F2] via-[#7E6BFF] to-[#C26CFF] p-3 shadow-xl"
            >
              {/* top row: Syncfluence logo left, profile pic right */}
              <div className="flex items-center justify-between">
                {/* Syncfluence logo placeholder */}
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 border border-white/30">
                  <span className="text-[10px] font-bold text-white">S</span>
                </div>
                {/* profile picture */}
                <div className="h-9 w-9 rounded-full border-2 border-white/80 overflow-hidden bg-white/20">
                  {profilePictureUrl ? (
                    <img
                      src={profilePictureUrl}
                      alt="Channel avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-white/80">
                      ?
                    </div>
                  )}
                </div>
              </div>

              {/* center score text */}
              <div className="flex flex-col items-center justify-center text-white">
                <span className="text-[11px] uppercase tracking-[0.18em] opacity-80">
                  Creator Score
                </span>
                <span className="mt-1 text-4xl font-semibold leading-none">
                  {overallScore != null ? overallScore : "--"}
                </span>
                <span className="mt-1 rounded-full bg-white/15 px-3 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em]">
                  {overallScore != null ? scoreLabel(overallScore) : "Syncfluence"}
                </span>
              </div>

              {/* bottom slider */}
              <div className="mb-1 flex items-center gap-3 px-2 pb-1">
                <div className="h-3 w-3 rounded-full bg-white/80" />
                <div className="h-1.5 flex-1 rounded-full bg-white/25 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-white/90"
                    style={{
                      width: `${overallScore != null ? overallScore : 40}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-400 text-center">
              Tap “Download story card” next to your score to save this as a PNG and
              post it on Instagram or Twitter with your CRS.
            </p>
          </motion.div>

          {/* Inspiration channels – fellow YouTubers in same domain */}
          <motion.div
            className="rounded-[26px] border border-slate-800 bg-slate-950/80 p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
                  Channels to study in your niche
                </p>
                <p className="mt-1 text-[11px] text-slate-300">
                  These are fellow creators in a similar space. Don’t copy their
                  content — copy their systems: titles, thumbnails, structure, and
                  upload rhythm.
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1 text-[10px] text-slate-300">
                🧠 Reverse-engineer, don&apos;t imitate
              </span>
            </div>

            {inspirationChannels.length === 0 ? (
              <p className="mt-4 text-[11px] text-slate-400">
                Analysing more channels in this niche will help us surface tailored
                inspiration. For now, pick 2–3 creators you admire and break down their
                best performing video.
              </p>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {inspirationChannels.map((ch, idx) => (
                  <div
                    key={`${ch.name}-${idx}`}
                    className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-[11px]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500/70 via-indigo-500/70 to-pink-500/70 text-xs font-semibold">
                          {ch.name?.[0] || "C"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-50">
                            {ch.name || "Channel"}
                          </span>
                          {ch.handle_or_url && (
                            <a
                              href={ch.handle_or_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-sky-300 hover:underline break-all"
                            >
                              {ch.handle_or_url}
                            </a>
                          )}
                        </div>
                      </div>
                      <span className="rounded-full border border-slate-700/80 bg-slate-950/80 px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-slate-400">
                        Model
                      </span>
                    </div>
                    <div className="mt-2 space-y-1.5 text-slate-300">
                      {ch.why_relevant && (
                        <p>
                          <span className="text-slate-500">Why relevant:</span>{" "}
                          {ch.why_relevant}
                        </p>
                      )}
                      {ch.what_to_learn && (
                        <p>
                          <span className="text-slate-500">What to learn:</span>{" "}
                          {ch.what_to_learn}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </section>
      </main>
    </div>
  );
}

//=================================================================OLD ONE 2.0 ========================================


// // pages/dashboard.js
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// function scoreLabel(score) {
//   if (score >= 90) return "Elite";
//   if (score >= 80) return "Pro";
//   if (score >= 65) return "Rising";
//   if (score >= 50) return "Early";
//   return "Starting out";
// }

// function tierDescription(score) {
//   const label = scoreLabel(score);
//   if (label === "Elite")
//     return "You’re in the top creator tier. Brands see you as a safe, high-leverage bet. Now it’s about choosing the right deals and protecting your time.";
//   if (label === "Pro")
//     return "You’re already a strong creator. A bit more consistency and you can negotiate long-term partnerships instead of one-off shoutouts.";
//   if (label === "Rising")
//     return "You’re in the sweet spot: growing, learning fast, and one focused 30-day sprint away from breaking out.";
//   if (label === "Early")
//     return "You have signal, but it’s noisy. Focus on one niche and one upload rhythm before you worry about sponsors.";
//   return "You’re just getting started. This is the perfect time to experiment, find your voice, and learn what your audience actually clicks.";
// }

// function detectNiche(channel) {
//   const text = (
//     (channel?.title || "") +
//     " " +
//     (channel?.description || "")
//   ).toLowerCase();

//   if (
//     text.includes("pubg") ||
//     text.includes("valorant") ||
//     text.includes("gamer") ||
//     text.includes("gaming") ||
//     text.includes("fortnite")
//   ) {
//     return "gaming";
//   }
//   if (
//     text.includes("study") ||
//     text.includes("productivity") ||
//     text.includes("notion") ||
//     text.includes("student") ||
//     text.includes("self improvement")
//   ) {
//     return "productivity";
//   }
//   if (
//     text.includes("gym") ||
//     text.includes("fitness") ||
//     text.includes("workout") ||
//     text.includes("bodybuilding")
//   ) {
//     return "fitness";
//   }
//   if (
//     text.includes("stock") ||
//     text.includes("trading") ||
//     text.includes("investing") ||
//     text.includes("finance") ||
//     text.includes("crypto")
//   ) {
//     return "finance";
//   }
//   return "general";
// }

// function getDefaultBrands(niche) {
//   // All of these are real, existing brands
//   if (niche === "gaming") {
//     return [
//       { name: "Razer", score: 92, category: "Gaming gear", emoji: "🎮" },
//       { name: "Logitech G", score: 89, category: "Peripherals", emoji: "🖱️" },
//       { name: "Elgato", score: 87, category: "Creator tools", emoji: "🎛️" },
//       { name: "Red Bull", score: 78, category: "Energy drink", emoji: "⚡" },
//     ];
//   }
//   if (niche === "productivity") {
//     return [
//       { name: "Notion", score: 93, category: "Workspace app", emoji: "📒" },
//       { name: "ClickUp", score: 88, category: "Project management", emoji: "📌" },
//       { name: "Grammarly", score: 84, category: "Writing assistant", emoji: "✍️" },
//       { name: "Slack", score: 80, category: "Team chat", emoji: "💬" },
//     ];
//   }
//   if (niche === "fitness") {
//     return [
//       { name: "Gymshark", score: 91, category: "Gym apparel", emoji: "💪" },
//       { name: "MyProtein", score: 88, category: "Supplements", emoji: "🥤" },
//       { name: "Nike", score: 86, category: "Sportswear", emoji: "👟" },
//       { name: "Adidas", score: 83, category: "Sportswear", emoji: "🏃‍♂️" },
//     ];
//   }
//   if (niche === "finance") {
//     return [
//       { name: "Robinhood", score: 88, category: "Investing app", emoji: "📈" },
//       { name: "Coinbase", score: 84, category: "Crypto exchange", emoji: "🪙" },
//       { name: "Revolut", score: 82, category: "Finance app", emoji: "💳" },
//       { name: "TradingView", score: 80, category: "Charting", emoji: "📊" },
//     ];
//   }
//   return [
//     { name: "Canva", score: 90, category: "Design tool", emoji: "🎨" },
//     { name: "Adobe Creative Cloud", score: 87, category: "Creative suite", emoji: "🎬" },
//     { name: "Spotify", score: 82, category: "Audio partner", emoji: "🎧" },
//     { name: "Amazon", score: 80, category: "E-commerce", emoji: "📦" },
//   ];
// }

// function getDefaultNextVideo(niche) {
//   if (niche === "gaming") {
//     return {
//       title: "I Let Chat Control My Game for 24 Hours (Chaos Ensues)",
//       hook:
//         "Make chat vote live on your weapons, challenges, or handicaps. Lean into rage + funny fails + one clutch moment at the end.",
//     };
//   }
//   if (niche === "productivity") {
//     return {
//       title: "I Tried a ‘No Zero Days’ Routine for 30 Days",
//       hook:
//         "Show the messy desk → simple system → before/after screenshots. Make it feel doable, not perfect.",
//     };
//   }
//   if (niche === "fitness") {
//     return {
//       title: "From 0 to 20 Push-Ups: The 14-Day Challenge",
//       hook:
//         "Start with you struggling on camera, then build a mini-program with real progress check-ins.",
//     };
//   }
//   if (niche === "finance") {
//     return {
//       title: "I Lived on ₹500 a Day for a Week (Real Numbers)",
//       hook:
//         "Show every rupee. Screenshots, budgeting app, and one big lesson at the end about where money *actually* goes.",
//     };
//   }
//   return {
//     title: "What Happens If I Commit to One Thing for 30 Days?",
//     hook:
//       "Pick one habit that fits your channel and document the tiny, honest daily updates instead of a perfect transformation.",
//   };
// }

// // Optional helper to give some text meaning to watch time score
// function watchTimeNote(score, hours) {
//   if (score == null || hours == null) return "Once you post a few more videos, we’ll estimate your recent watch time and retention.";
//   if (score >= 80)
//     return `Your recent ${hours.toFixed(
//       1
//     )} hours of watch time shows people don’t just click — they actually stay. Great foundations for long-term brand deals.`;
//   if (score >= 60)
//     return `You’ve got around ${hours.toFixed(
//       1
//     )} hours of recent watch time. Good signal, but a stronger first 15 seconds could turn this into binge territory.`;
//   return `With roughly ${hours.toFixed(
//     1
//   )} hours of recent watch time, there’s a lot of upside. Focus your titles/thumbnails around one clear promise per video.`;
// }

// export default function Dashboard() {
//   const [data, setData] = useState(null);
//   const [handle, setHandle] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const storedHandle = window.localStorage.getItem("crsHandle") || "";
//     setHandle(storedHandle);

//     if (!storedHandle) {
//       setLoading(false);
//       return;
//     }

//     async function fetchData() {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetch("/api/creator-score", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ handle: storedHandle }),
//         });

//         const json = await res.json();
//         if (!res.ok) {
//           throw new Error(json.error || "Failed to fetch creator score");
//         }

//         setData(json);
//         window.localStorage.setItem("crsData", JSON.stringify(json));
//       } catch (err) {
//         console.error(err);
//         setError(err.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   const scores = data?.scores || {};
//   const hasScores = Object.keys(scores).length > 0;

//   const identityScore = hasScores ? scores.identity : null;
//   const contentScore = hasScores ? scores.content : null;
//   const timingScore = hasScores ? scores.timing : null;
//   const brandFitScore = hasScores ? scores.brandFit : null;
//   const overallScore = hasScores ? scores.overall : null;
//   const watchTimeScore = hasScores ? scores.watchTime : null;

//   const niche = detectNiche(data?.channel);
//   const estimatedWatchTimeHours =
//     data?.estimatedWatchTime?.recent10Hours != null
//       ? data.estimatedWatchTime.recent10Hours
//       : null;

//   const defaultNext = getDefaultNextVideo(niche);
//   const nextVideoTitle = data?.nextVideo?.title || defaultNext.title;
//   const nextVideoHook = data?.nextVideo?.hook || defaultNext.hook;

//   const brandSummary =
//     data?.brandCheck?.summary ||
//     "We analysed your recent uploads and audience. The brands below are actually in the market today and match your current vibe.";

//   // If backend sends real matches, we prefer them, otherwise use curated real brands.
//   const brandMatches =
//     (data?.brandCheck?.matches &&
//       data.brandCheck.matches.length > 0 &&
//       data.brandCheck.matches) ||
//     getDefaultBrands(niche);

//   const inspirationChannels = data?.inspiration?.channels || [];

//   const metricItems = [
//     {
//       key: "identity",
//       label: "Identity",
//       value: identityScore,
//       description:
//         "How clearly viewers understand who you are and what you stand for.",
//     },
//     {
//       key: "content",
//       label: "Content",
//       value: contentScore,
//       description: "How strong your topics, hooks, and packaging are.",
//     },
//     {
//       key: "timing",
//       label: "Timing",
//       value: timingScore,
//       description: "How well you post when your audience is actually online.",
//     },
//     {
//       key: "brandFit",
//       label: "Brand fit",
//       value: brandFitScore,
//       description: "How naturally real brands can live inside your content.",
//     },
//     {
//       key: "watchTime",
//       label: "Watch time",
//       value: watchTimeScore,
//       description:
//         "How well you turn clicks into actual minutes watched vs. pure impressions.",
//     },
//   ];

//   const handleMagicClick = () => {
//     if (typeof window === "undefined") return;
//     const el = document.getElementById("magic-section");
//     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#020617] via-[#020617] to-[#020617] text-slate-200">
//         <div className="flex flex-col items-center gap-3">
//           <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
//           <p className="text-xs tracking-wide text-slate-400">
//             Scanning your channel and building your CRS dashboard…
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-200">
//         <p className="mb-2 text-sm font-semibold text-red-400">
//           Something went wrong
//         </p>
//         <p className="mb-4 text-xs text-slate-400">{error}</p>
//         <a
//           href="/"
//           className="rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-4 py-2 text-xs font-semibold text-slate-900"
//         >
//           Try another channel
//         </a>
//       </div>
//     );
//   }

//   if (!handle) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-200">
//         <p className="mb-3 text-sm">
//           No channel handle found. Start from the landing page.
//         </p>
//         <a
//           href="/"
//           className="rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-4 py-2 text-xs font-semibold text-slate-900"
//         >
//           Go to Creator Risk Score
//         </a>
//       </div>
//     );
//   }

//   const tier = overallScore != null ? scoreLabel(overallScore) : "Unknown";
//   const xpToNext = overallScore != null ? Math.max(0, 100 - overallScore) : null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#02091f] to-[#020617] text-slate-50">
//       {/* Top nav */}
//       <header className="border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-xl">
//         <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
//           <div className="flex items-center gap-3">
//             <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-pink-500 shadow-md shadow-sky-500/40">
//               <span className="text-xs font-semibold">CRS</span>
//             </div>
//             <div className="flex flex-col leading-tight">
//               <span className="text-sm font-semibold">Creator Score</span>
//               <span className="text-[11px] text-slate-400">
//                 Dashboard for @{handle.replace("@", "")}
//               </span>
//             </div>
//           </div>

//           <a
//             href="/"
//             className="rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1.5 text-[11px] text-slate-300 hover:border-sky-400 hover:text-sky-100 transition"
//           >
//             New channel →
//           </a>
//         </nav>
//       </header>

//       {/* Main */}
//       <main className="mx-auto max-w-6xl px-4 py-8 lg:px-6 lg:py-10">
//         <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
//               Today&apos;s CRS breakdown
//             </p>
//             <h1 className="mt-1 text-xl font-semibold text-slate-50">
//               Not just a report — this is your game plan for the next 30 days.
//             </h1>
//             <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
//               <span className="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/70 px-2 py-0.5">
//                 <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
//                 Niche:{" "}
//                 <span className="font-semibold capitalize">
//                   {niche === "general" ? "Mixed / general" : niche}
//                 </span>
//               </span>
//               {estimatedWatchTimeHours != null && (
//                 <span className="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/70 px-2 py-0.5">
//                   ⏱️ Recent watch time (10 vids):{" "}
//                   <span className="font-semibold">
//                     {estimatedWatchTimeHours.toFixed(1)}h
//                   </span>
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="flex flex-wrap items-center gap-3">
//             <div className="flex gap-2 text-[11px] text-slate-400">
//               <span className="inline-flex items-center gap-1">
//                 <span className="h-2 w-2 rounded-full bg-emerald-400" /> Strong
//                 signal
//               </span>
//               <span className="inline-flex items-center gap-1">
//                 <span className="h-2 w-2 rounded-full bg-amber-400" /> Needs
//                 focus
//               </span>
//             </div>
//             {/* Do the magic button */}
//             <button
//               onClick={handleMagicClick}
//               className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-4 py-1.5 text-[11px] font-semibold text-slate-50 shadow-lg shadow-sky-500/40 hover:brightness-110 transition"
//             >
//               ✨ Do the magic
//             </button>
//           </div>
//         </div>

//         {/* Top grid */}
//         <section className="grid gap-6 xl:grid-cols-[1.5fr,0.9fr]">
//           {/* Overall score + metrics + insights */}
//           <motion.div
//             className="rounded-[26px] border border-slate-800 bg-slate-950/80 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.9)]"
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             {/* Top row: score highlighted */}
//             <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//               <div className="space-y-1">
//                 <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400">
//                   Overall creator score
//                 </p>
//                 <h2 className="text-lg font-semibold">@{handle.replace("@", "")}</h2>
//                 <p className="max-w-xl text-[12px] text-slate-400">
//                   {data?.channel?.description
//                     ? `${data.channel.description.slice(0, 140)}${
//                         data.channel.description.length > 140 ? "…" : ""
//                       }`
//                     : "We blended your identity, content, timing, watch time and brand fit into one number brands and the algorithm instantly understand."}
//                 </p>
//               </div>

//               {/* BIG score ring + tier */}
//               <motion.div
//                 className="relative flex h-32 w-32 items-center justify-center"
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ duration: 0.4, delay: 0.1 }}
//               >
//                 <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-pink-500 opacity-90 blur-[3px]" />
//                 <div className="absolute inset-[6px] rounded-full bg-slate-950" />
//                 <div className="relative flex flex-col items-center justify-center">
//                   <span className="text-[34px] font-semibold leading-none">
//                     {overallScore != null ? overallScore : "—"}
//                   </span>
//                   <span className="mt-1 text-[10px] uppercase tracking-wide text-slate-300">
//                     {overallScore != null ? scoreLabel(overallScore) : "No data"}
//                   </span>
//                 </div>
//               </motion.div>
//             </div>

//             {/* Overall explanation */}
//             <div className="mt-4 grid gap-3 md:grid-cols-[1.3fr,0.9fr] text-[11px] text-slate-300">
//               <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
//                 <p className="text-[10px] uppercase tracking-[0.2em] text-sky-400 mb-1">
//                   What this score really means
//                 </p>
//                 <p>
//                   {overallScore != null ? (
//                     <>
//                       With a score of{" "}
//                       <span className="font-semibold">{overallScore}/100</span>,
//                       you&apos;re in the{" "}
//                       <span className="font-semibold">{tier}</span> band.{" "}
//                       {tierDescription(overallScore)}
//                     </>
//                   ) : (
//                     "We couldn’t compute a full score yet — try analysing this channel again after a few more uploads."
//                   )}
//                 </p>
//               </div>
//               <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 flex flex-col justify-between">
//                 <div>
//                   <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 mb-1">
//                     XP to next tier
//                   </p>
//                   <p>
//                     {xpToNext != null
//                       ? `You’re roughly ${xpToNext} “score points” away from a perfect 100. That’s usually 4–8 really dialed-in uploads.`
//                       : "Upload consistently for a few weeks and we’ll estimate how far you are from the next tier."}
//                   </p>
//                 </div>
//                 {xpToNext != null && (
//                   <div className="mt-3">
//                     <div className="h-1.5 w-full rounded-full bg-slate-800">
//                       <div
//                         className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400"
//                         style={{ width: `${Math.min(100, overallScore)}%` }}
//                       />
//                     </div>
//                     <p className="mt-1 text-[10px] text-slate-400">
//                       Each focused upload nudges this bar closer to 100.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Metric cards */}
//             <div className="mt-5 grid gap-3 md:grid-cols-5">
//               {metricItems.map((item) => {
//                 const v = item.value;
//                 const label = v != null ? scoreLabel(v) : "No data";

//                 const isStrong = v != null && v >= 70;
//                 const badgeClasses = isStrong
//                   ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
//                   : "bg-amber-500/10 text-amber-200 border-amber-500/40";

//                 return (
//                   <motion.div
//                     key={item.key}
//                     className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3"
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.25 }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <p className="text-[11px] text-slate-400">{item.label}</p>
//                       <span
//                         className={`rounded-full px-2 py-0.5 text-[10px] border ${badgeClasses}`}
//                       >
//                         {label}
//                       </span>
//                     </div>
//                     <p className="mt-1 text-base font-semibold">
//                       {v != null ? `${v} / 100` : "—"}
//                     </p>
//                     <p className="mt-1 text-[11px] text-slate-400">
//                       {item.description}
//                     </p>
//                     <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800">
//                       <div
//                         className="h-1.5 rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-pink-400"
//                         style={{ width: `${v != null ? v : 0}%` }}
//                       />
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>

//             {/* Watch time explanation row */}
//             <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-[11px] text-slate-300">
//               <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">
//                 Watch time as proof, not vanity
//               </p>
//               <p>{watchTimeNote(watchTimeScore, estimatedWatchTimeHours)}</p>
//             </div>
//           </motion.div>

//           {/* Right side – stats + quick missions */}
//           <motion.div
//             className="space-y-4"
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4, delay: 0.05 }}
//           >
//             <div className="rounded-[24px] border border-slate-800 bg-slate-950/80 p-4">
//               <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
//                 Channel overview
//               </p>
//               <div className="mt-3 space-y-1.5 text-xs text-slate-300">
//                 <p>
//                   <span className="text-slate-500">Videos analysed:</span>{" "}
//                   {data?.videos?.length ?? "—"}
//                 </p>
//                 <p>
//                   <span className="text-slate-500">Subscribers:</span>{" "}
//                   {data?.channel?.statistics?.subscriberCount ?? "—"}
//                 </p>
//                 <p>
//                   <span className="text-slate-500">Total views:</span>{" "}
//                   {data?.channel?.statistics?.viewCount ?? "—"}
//                 </p>
//                 <p>
//                   <span className="text-slate-500">
//                     Approx. watch time (last 10 vids):
//                   </span>{" "}
//                   {estimatedWatchTimeHours != null
//                     ? `${estimatedWatchTimeHours.toFixed(1)} hours`
//                     : "—"}
//                 </p>
//               </div>
//             </div>

//             <div className="rounded-[24px] border border-slate-800 bg-slate-950/80 p-4">
//               <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
//                 7-day missions
//               </p>
//               <ul className="mt-3 space-y-2 text-xs text-slate-300">
//                 <li>• Post 2 uploads that match the next-video pattern below.</li>
//                 <li>• Cut 3 Shorts from the highest-energy 5 seconds.</li>
//                 <li>• DM 2 of the suggested brands with this CRS screenshot.</li>
//                 <li>
//                   • Pick 1 inspiration channel below and reverse-engineer their
//                   last thumbnail + title combo.
//                 </li>
//               </ul>
//               <p className="mt-3 text-[11px] text-slate-400">
//                 Scroll down or hit <span className="font-semibold">“Do the magic”</span> to see the exact idea, brands and channels to study.
//               </p>
//             </div>
//           </motion.div>
//         </section>

//         {/* Bottom grid – next video + brand fit with real brands */}
//         <section
//           id="magic-section"
//           className="mt-7 grid gap-6 lg:grid-cols-[1.1fr,1.1fr]"
//         >
//           {/* Next video idea */}
//           <motion.div
//             className="rounded-[26px] border border-slate-800 bg-slate-950/80 p-5"
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.35, delay: 0.1 }}
//           >
//             <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
//               Next video idea
//             </p>
//             <h3 className="mt-2 text-sm font-semibold text-slate-50">
//               {nextVideoTitle}
//             </h3>
//             <p className="mt-2 text-xs text-slate-300">{nextVideoHook}</p>

//             <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-3 text-[11px] text-slate-300">
//               <p className="text-[10px] uppercase tracking-[0.2em] text-sky-400">
//                 Shot list blueprint
//               </p>
//               <ul className="mt-2 space-y-1.5">
//                 <li>1. 3–5 second cold open: the most chaotic or emotional moment.</li>
//                 <li>2. 10–15 seconds of fast context: who you are, what’s at stake.</li>
//                 <li>3. 2–3 big beats: challenge, twist, or conflict escalating.</li>
//                 <li>4. Payoff + subtle CTA: tease the next upload or mini-series.</li>
//               </ul>
//             </div>
//           </motion.div>

//           {/* Brand check + REAL brand logos */}
//           <motion.div
//             className="rounded-[26px] border border-slate-800 bg-slate-950/80 p-5"
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.35, delay: 0.15 }}
//           >
//             <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
//               Brand fit (real sponsors)
//             </p>

//             <div className="mt-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-[11px] text-emerald-200">
//               <p>✅ {brandSummary}</p>
//             </div>

//             {/* Brand logos row */}
//             <div className="mt-4">
//               <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
//                 Top brands that would actually make sense
//               </p>
//               <div className="mt-3 flex flex-wrap gap-3">
//                 {brandMatches.map((brand) => (
//                   <div
//                     key={brand.name}
//                     className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-[11px]"
//                   >
//                     {/* Logo avatar (emoji or initial as logo) */}
//                     <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500/70 via-indigo-500/70 to-pink-500/70 text-sm">
//                       <span>{brand.emoji || brand.name[0]}</span>
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-xs font-semibold text-slate-50">
//                         {brand.name}
//                       </span>
//                       <span className="text-[10px] text-slate-400">
//                         {brand.category} • Fit{" "}
//                         {brand.score != null ? `${brand.score}%` : "—"}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Brand guidance */}
//             <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-[11px] text-slate-300">
//               <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
//                 How to use this
//               </p>
//               <ul className="mt-2 space-y-1.5">
//                 <li>
//                   • Screenshot this dashboard and attach it when you email a brand
//                   — it proves you’ve thought about fit.
//                 </li>
//                 <li>
//                   • Start with brands over <span className="font-semibold">80% fit</span>{" "}
//                   and pitch 1 video + 3 Shorts package.
//                 </li>
//                 <li>
//                   • If a brand under 70% reaches out, ask yourself: “Would my audience
//                   expect to see this here?” If not, say no.
//                 </li>
//               </ul>
//             </div>
//           </motion.div>
//         </section>

//         {/* Inspiration channels – fellow YouTubers in same domain */}
//         <section className="mt-7">
//           <motion.div
//             className="rounded-[26px] border border-slate-800 bg-slate-950/80 p-5"
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.35, delay: 0.2 }}
//           >
//             <div className="flex items-center justify-between gap-2">
//               <div>
//                 <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
//                   Channels to study in your niche
//                 </p>
//                 <p className="mt-1 text-[11px] text-slate-300">
//                   These are fellow creators in a similar space. Don’t copy their content —
//                   copy their systems: titles, thumbnails, structure, and upload rhythm.
//                 </p>
//               </div>
//               <span className="hidden sm:inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1 text-[10px] text-slate-300">
//                 🧠 Reverse-engineer, don&apos;t imitate
//               </span>
//             </div>

//             {inspirationChannels.length === 0 ? (
//               <p className="mt-4 text-[11px] text-slate-400">
//                 Analysing more channels in this niche will help us surface tailored
//                 inspiration. For now, pick 2–3 creators you admire and break down their
//                 best performing video.
//               </p>
//             ) : (
//               <div className="mt-4 grid gap-3 md:grid-cols-3">
//                 {inspirationChannels.map((ch, idx) => (
//                   <div
//                     key={`${ch.name}-${idx}`}
//                     className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-[11px]"
//                   >
//                     <div className="flex items-center justify-between gap-2">
//                       <div className="flex items-center gap-2">
//                         <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500/70 via-indigo-500/70 to-pink-500/70 text-xs font-semibold">
//                           {ch.name?.[0] || "C"}
//                         </div>
//                         <div className="flex flex-col">
//                           <span className="text-xs font-semibold text-slate-50">
//                             {ch.name || "Channel"}
//                           </span>
//                           {ch.handle_or_url && (
//                             <a
//                               href={ch.handle_or_url}
//                               target="_blank"
//                               rel="noreferrer"
//                               className="text-[10px] text-sky-300 hover:underline break-all"
//                             >
//                               {ch.handle_or_url}
//                             </a>
//                           )}
//                         </div>
//                       </div>
//                       <span className="rounded-full border border-slate-700/80 bg-slate-950/80 px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-slate-400">
//                         Model
//                       </span>
//                     </div>
//                     <div className="mt-2 space-y-1.5 text-slate-300">
//                       {ch.why_relevant && (
//                         <p>
//                           <span className="text-slate-500">Why relevant:</span>{" "}
//                           {ch.why_relevant}
//                         </p>
//                       )}
//                       {ch.what_to_learn && (
//                         <p>
//                           <span className="text-slate-500">What to learn:</span>{" "}
//                           {ch.what_to_learn}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </motion.div>
//         </section>
//       </main>
//     </div>
//   );
// }

//-----------------------------------------------OLD ONE 1.0------------------------------------------------------------
//-----------------------------------------------OLD ONE 1.0------------------------------------------------------------
//-----------------------------------------------OLD ONE 1.0------------------------------------------------------------
//-----------------------------------------------OLD ONE 1.0------------------------------------------------------------
//-----------------------------------------------OLD ONE 1.0------------------------------------------------------------
// pages/dashboard.js
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// function scoreLabel(score) {
//   if (score >= 90) return "Elite";
//   if (score >= 80) return "Pro";
//   if (score >= 65) return "Rising";
//   if (score >= 50) return "Early";
//   return "Starting out";
// }

// function tierDescription(score) {
//   const label = scoreLabel(score);
//   if (label === "Elite")
//     return "You’re in the top creator tier. Brands see you as a safe, high-leverage bet. Now it’s about choosing the right deals and protecting your time.";
//   if (label === "Pro")
//     return "You’re already a strong creator. A bit more consistency and you can negotiate long-term partnerships instead of one-off shoutouts.";
//   if (label === "Rising")
//     return "You’re in the sweet spot: growing, learning fast, and one focused 30-day sprint away from breaking out.";
//   if (label === "Early")
//     return "You have signal, but it’s noisy. Focus on one niche and one upload rhythm before you worry about sponsors.";
//   return "You’re just getting started. This is the perfect time to experiment, find your voice, and learn what your audience actually clicks.";
// }

// function detectNiche(channel) {
//   const text = (
//     (channel?.title || "") +
//     " " +
//     (channel?.description || "")
//   ).toLowerCase();

//   if (
//     text.includes("pubg") ||
//     text.includes("valorant") ||
//     text.includes("gamer") ||
//     text.includes("gaming") ||
//     text.includes("fortnite")
//   ) {
//     return "gaming";
//   }
//   if (
//     text.includes("study") ||
//     text.includes("productivity") ||
//     text.includes("notion") ||
//     text.includes("student") ||
//     text.includes("self improvement")
//   ) {
//     return "productivity";
//   }
//   if (
//     text.includes("gym") ||
//     text.includes("fitness") ||
//     text.includes("workout") ||
//     text.includes("bodybuilding")
//   ) {
//     return "fitness";
//   }
//   if (
//     text.includes("stock") ||
//     text.includes("trading") ||
//     text.includes("investing") ||
//     text.includes("finance") ||
//     text.includes("crypto")
//   ) {
//     return "finance";
//   }
//   return "general";
// }

// function getDefaultBrands(niche) {
//   // All of these are real, existing brands
//   if (niche === "gaming") {
//     return [
//       { name: "Razer", score: 92, category: "Gaming gear", emoji: "🎮" },
//       { name: "Logitech G", score: 89, category: "Peripherals", emoji: "🖱️" },
//       { name: "Elgato", score: 87, category: "Creator tools", emoji: "🎛️" },
//       { name: "Red Bull", score: 78, category: "Energy drink", emoji: "⚡" },
//     ];
//   }
//   if (niche === "productivity") {
//     return [
//       { name: "Notion", score: 93, category: "Workspace app", emoji: "📒" },
//       { name: "ClickUp", score: 88, category: "Project management", emoji: "📌" },
//       { name: "Grammarly", score: 84, category: "Writing assistant", emoji: "✍️" },
//       { name: "Slack", score: 80, category: "Team chat", emoji: "💬" },
//     ];
//   }
//   if (niche === "fitness") {
//     return [
//       { name: "Gymshark", score: 91, category: "Gym apparel", emoji: "💪" },
//       { name: "MyProtein", score: 88, category: "Supplements", emoji: "🥤" },
//       { name: "Nike", score: 86, category: "Sportswear", emoji: "👟" },
//       { name: "Adidas", score: 83, category: "Sportswear", emoji: "🏃‍♂️" },
//     ];
//   }
//   if (niche === "finance") {
//     return [
//       { name: "Robinhood", score: 88, category: "Investing app", emoji: "📈" },
//       { name: "Coinbase", score: 84, category: "Crypto exchange", emoji: "🪙" },
//       { name: "Revolut", score: 82, category: "Finance app", emoji: "💳" },
//       { name: "TradingView", score: 80, category: "Charting", emoji: "📊" },
//     ];
//   }
//   return [
//     { name: "Canva", score: 90, category: "Design tool", emoji: "🎨" },
//     { name: "Adobe Creative Cloud", score: 87, category: "Creative suite", emoji: "🎬" },
//     { name: "Spotify", score: 82, category: "Audio partner", emoji: "🎧" },
//     { name: "Amazon", score: 80, category: "E-commerce", emoji: "📦" },
//   ];
// }

// function getDefaultNextVideo(niche) {
//   if (niche === "gaming") {
//     return {
//       title: "I Let Chat Control My Game for 24 Hours (Chaos Ensues)",
//       hook:
//         "Make chat vote live on your weapons, challenges, or handicaps. Lean into rage + funny fails + one clutch moment at the end.",
//     };
//   }
//   if (niche === "productivity") {
//     return {
//       title: "I Tried a ‘No Zero Days’ Routine for 30 Days",
//       hook:
//         "Show the messy desk → simple system → before/after screenshots. Make it feel doable, not perfect.",
//     };
//   }
//   if (niche === "fitness") {
//     return {
//       title: "From 0 to 20 Push-Ups: The 14-Day Challenge",
//       hook:
//         "Start with you struggling on camera, then build a mini-program with real progress check-ins.",
//     };
//   }
//   if (niche === "finance") {
//     return {
//       title: "I Lived on ₹500 a Day for a Week (Real Numbers)",
//       hook:
//         "Show every rupee. Screenshots, budgeting app, and one big lesson at the end about where money *actually* goes.",
//     };
//   }
//   return {
//     title: "What Happens If I Commit to One Thing for 30 Days?",
//     hook:
//       "Pick one habit that fits your channel and document the tiny, honest daily updates instead of a perfect transformation.",
//   };
// }

// export default function Dashboard() {
//   const [data, setData] = useState(null);
//   const [handle, setHandle] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const storedHandle = window.localStorage.getItem("crsHandle") || "";
//     setHandle(storedHandle);

//     if (!storedHandle) {
//       setLoading(false);
//       return;
//     }

//     async function fetchData() {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetch("/api/creator-score", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ handle: storedHandle }),
//         });

//         const json = await res.json();
//         if (!res.ok) {
//           throw new Error(json.error || "Failed to fetch creator score");
//         }

//         setData(json);
//         window.localStorage.setItem("crsData", JSON.stringify(json));
//       } catch (err) {
//         console.error(err);
//         setError(err.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   const scores = data?.scores || {};
//   const hasScores = Object.keys(scores).length > 0;

//   const identityScore = hasScores ? scores.identity : null;
//   const contentScore = hasScores ? scores.content : null;
//   const timingScore = hasScores ? scores.timing : null;
//   const brandFitScore = hasScores ? scores.brandFit : null;
//   const overallScore = hasScores ? scores.overall : null;

//   const niche = detectNiche(data?.channel);

//   const defaultNext = getDefaultNextVideo(niche);
//   const nextVideoTitle = data?.nextVideo?.title || defaultNext.title;
//   const nextVideoHook = data?.nextVideo?.hook || defaultNext.hook;

//   const brandSummary =
//     data?.brandCheck?.summary ||
//     "We analysed your recent uploads and audience. The brands below are actually in the market today and match your current vibe.";

//   // If backend sends real matches, we prefer them, otherwise use curated real brands.
//   const brandMatches =
//     (data?.brandCheck?.matches &&
//       data.brandCheck.matches.length > 0 &&
//       data.brandCheck.matches) ||
//     getDefaultBrands(niche);

//   const metricItems = [
//     {
//       key: "identity",
//       label: "Identity",
//       value: identityScore,
//       description: "How clearly viewers understand who you are and what you stand for.",
//     },
//     {
//       key: "content",
//       label: "Content",
//       value: contentScore,
//       description: "How strong your topics, hooks, and packaging are.",
//     },
//     {
//       key: "timing",
//       label: "Timing",
//       value: timingScore,
//       description: "How well you post when your audience is actually online.",
//     },
//     {
//       key: "brandFit",
//       label: "Brand fit",
//       value: brandFitScore,
//       description: "How naturally real brands can live inside your content.",
//     },
//   ];

//   const handleMagicClick = () => {
//     if (typeof window === "undefined") return;
//     const el = document.getElementById("magic-section");
//     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#020617] via-[#020617] to-[#020617] text-slate-200">
//         <div className="flex flex-col items-center gap-3">
//           <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
//           <p className="text-xs tracking-wide text-slate-400">
//             Scanning your channel and building your CRS dashboard…
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-200">
//         <p className="mb-2 text-sm font-semibold text-red-400">
//           Something went wrong
//         </p>
//         <p className="mb-4 text-xs text-slate-400">{error}</p>
//         <a
//           href="/"
//           className="rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-4 py-2 text-xs font-semibold text-slate-900"
//         >
//           Try another channel
//         </a>
//       </div>
//     );
//   }

//   if (!handle) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-200">
//         <p className="mb-3 text-sm">
//           No channel handle found. Start from the landing page.
//         </p>
//         <a
//           href="/"
//           className="rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-4 py-2 text-xs font-semibold text-slate-900"
//         >
//           Go to Creator Risk Score
//         </a>
//       </div>
//     );
//   }

//   const tier = overallScore != null ? scoreLabel(overallScore) : "Unknown";
//   const xpToNext = overallScore != null ? Math.max(0, 100 - overallScore) : null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#02091f] to-[#020617] text-slate-50">
//       {/* Top nav */}
//       <header className="border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-xl">
//         <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
//           <div className="flex items-center gap-3">
//             <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-pink-500 shadow-md shadow-sky-500/40">
//               <span className="text-xs font-semibold">CRS</span>
//             </div>
//             <div className="flex flex-col leading-tight">
//               <span className="text-sm font-semibold">Creator Score</span>
//               <span className="text-[11px] text-slate-400">
//                 Dashboard for @{handle.replace("@", "")}
//               </span>
//             </div>
//           </div>

//           <a
//             href="/"
//             className="rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1.5 text-[11px] text-slate-300 hover:border-sky-400 hover:text-sky-100 transition"
//           >
//             New channel →
//           </a>
//         </nav>
//       </header>

//       {/* Main */}
//       <main className="mx-auto max-w-6xl px-4 py-8 lg:px-6 lg:py-10">
//         <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
//               Today&apos;s CRS breakdown
//             </p>
//             <h1 className="mt-1 text-xl font-semibold text-slate-50">
//               Not just a report — this is your game plan for the next 30 days.
//             </h1>
//           </div>
//           <div className="flex flex-wrap items-center gap-3">
//             <div className="flex gap-2 text-[11px] text-slate-400">
//               <span className="inline-flex items-center gap-1">
//                 <span className="h-2 w-2 rounded-full bg-emerald-400" /> Strong
//                 signal
//               </span>
//               <span className="inline-flex items-center gap-1">
//                 <span className="h-2 w-2 rounded-full bg-amber-400" /> Needs
//                 focus
//               </span>
//             </div>
//             {/* Do the magic button */}
//             <button
//               onClick={handleMagicClick}
//               className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-4 py-1.5 text-[11px] font-semibold text-slate-50 shadow-lg shadow-sky-500/40 hover:brightness-110 transition"
//             >
//               ✨ Do the magic
//             </button>
//           </div>
//         </div>

//         {/* Top grid */}
//         <section className="grid gap-6 xl:grid-cols-[1.5fr,0.9fr]">
//           {/* Overall score + metrics + insights */}
//           <motion.div
//             className="rounded-[26px] border border-slate-800 bg-slate-950/80 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.9)]"
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             {/* Top row: score highlighted */}
//             <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//               <div className="space-y-1">
//                 <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400">
//                   Overall creator score
//                 </p>
//                 <h2 className="text-lg font-semibold">@{handle.replace("@", "")}</h2>
//                 <p className="max-w-xl text-[12px] text-slate-400">
//                   {data?.channel?.description
//                     ? `${data.channel.description.slice(0, 140)}${
//                         data.channel.description.length > 140 ? "…" : ""
//                       }`
//                     : "We blended your identity, content, timing and brand fit into one number brands and the algorithm instantly understand."}
//                 </p>
//               </div>

//               {/* BIG score ring + tier */}
//               <motion.div
//                 className="relative flex h-32 w-32 items-center justify-center"
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ duration: 0.4, delay: 0.1 }}
//               >
//                 <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-pink-500 opacity-90 blur-[3px]" />
//                 <div className="absolute inset-[6px] rounded-full bg-slate-950" />
//                 <div className="relative flex flex-col items-center justify-center">
//                   <span className="text-[34px] font-semibold leading-none">
//                     {overallScore != null ? overallScore : "—"}
//                   </span>
//                   <span className="mt-1 text-[10px] uppercase tracking-wide text-slate-300">
//                     {overallScore != null ? scoreLabel(overallScore) : "No data"}
//                   </span>
//                 </div>
//               </motion.div>
//             </div>

//             {/* Overall explanation */}
//             <div className="mt-4 grid gap-3 md:grid-cols-[1.3fr,0.9fr] text-[11px] text-slate-300">
//               <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
//                 <p className="text-[10px] uppercase tracking-[0.2em] text-sky-400 mb-1">
//                   What this score really means
//                 </p>
//                 <p>
//                   {overallScore != null ? (
//                     <>
//                       With a score of{" "}
//                       <span className="font-semibold">{overallScore}/100</span>,
//                       you&apos;re in the{" "}
//                       <span className="font-semibold">{tier}</span> band.{" "}
//                       {tierDescription(overallScore)}
//                     </>
//                   ) : (
//                     "We couldn’t compute a full score yet — try analysing this channel again after a few more uploads."
//                   )}
//                 </p>
//               </div>
//               <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 flex flex-col justify-between">
//                 <div>
//                   <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 mb-1">
//                     XP to next tier
//                   </p>
//                   <p>
//                     {xpToNext != null
//                       ? `You’re roughly ${xpToNext} “score points” away from a perfect 100. That’s usually 4–8 really dialed-in uploads.`
//                       : "Upload consistently for a few weeks and we’ll estimate how far you are from the next tier."}
//                   </p>
//                 </div>
//                 {xpToNext != null && (
//                   <div className="mt-3">
//                     <div className="h-1.5 w-full rounded-full bg-slate-800">
//                       <div
//                         className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400"
//                         style={{ width: `${Math.min(100, overallScore)}%` }}
//                       />
//                     </div>
//                     <p className="mt-1 text-[10px] text-slate-400">
//                       Each focused upload nudges this bar closer to 100.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Metric cards */}
//             <div className="mt-5 grid gap-3 md:grid-cols-4">
//               {metricItems.map((item) => {
//                 const v = item.value;
//                 const label =
//                   v != null ? scoreLabel(v) : "No data";

//                 return (
//                   <motion.div
//                     key={item.key}
//                     className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3"
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.25 }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <p className="text-[11px] text-slate-400">{item.label}</p>
//                       <span
//                         className={`rounded-full px-2 py-0.5 text-[10px] border ${
//                           v != null && v >= 70
//                             ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
//                             : "bg-amber-500/10 text-amber-200 border-amber-500/40"
//                         }`}
//                       >
//                         {label}
//                       </span>
//                     </div>
//                     <p className="mt-1 text-base font-semibold">
//                       {v != null ? `${v} / 100` : "—"}
//                     </p>
//                     <p className="mt-1 text-[11px] text-slate-400">
//                       {item.description}
//                     </p>
//                     <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800">
//                       <div
//                         className="h-1.5 rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-pink-400"
//                         style={{ width: `${v != null ? v : 0}%` }}
//                       />
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           </motion.div>

//           {/* Right side – stats + quick missions */}
//           <motion.div
//             className="space-y-4"
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4, delay: 0.05 }}
//           >
//             <div className="rounded-[24px] border border-slate-800 bg-slate-950/80 p-4">
//               <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
//                 Channel overview
//               </p>
//               <div className="mt-3 space-y-1.5 text-xs text-slate-300">
//                 <p>
//                   <span className="text-slate-500">Videos analysed:</span>{" "}
//                   {data?.videos?.length ?? "—"}
//                 </p>
//                 <p>
//                   <span className="text-slate-500">Subscribers:</span>{" "}
//                   {data?.channel?.statistics?.subscriberCount ?? "—"}
//                 </p>
//                 <p>
//                   <span className="text-slate-500">Total views:</span>{" "}
//                   {data?.channel?.statistics?.viewCount ?? "—"}
//                 </p>
//               </div>
//             </div>

//             <div className="rounded-[24px] border border-slate-800 bg-slate-950/80 p-4">
//               <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
//                 7-day missions
//               </p>
//               <ul className="mt-3 space-y-2 text-xs text-slate-300">
//                 <li>• Post 2 uploads that match the next-video pattern below.</li>
//                 <li>• Cut 3 Shorts from the highest-energy 5 seconds.</li>
//                 <li>• DM 2 of the suggested brands with this CRS screenshot.</li>
//               </ul>
//               <p className="mt-3 text-[11px] text-slate-400">
//                 Scroll down or hit <span className="font-semibold">“Do the magic”</span> to see the exact idea and brand list.
//               </p>
//             </div>
//           </motion.div>
//         </section>

//         {/* Bottom grid – next video + brand fit with real brands */}
//         <section
//           id="magic-section"
//           className="mt-7 grid gap-6 lg:grid-cols-[1.1fr,1.1fr]"
//         >
//           {/* Next video idea */}
//           <motion.div
//             className="rounded-[26px] border border-slate-800 bg-slate-950/80 p-5"
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.35, delay: 0.1 }}
//           >
//             <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
//               Next video idea
//             </p>
//             <h3 className="mt-2 text-sm font-semibold text-slate-50">
//               {nextVideoTitle}
//             </h3>
//             <p className="mt-2 text-xs text-slate-300">{nextVideoHook}</p>

//             <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-3 text-[11px] text-slate-300">
//               <p className="text-[10px] uppercase tracking-[0.2em] text-sky-400">
//                 Shot list blueprint
//               </p>
//               <ul className="mt-2 space-y-1.5">
//                 <li>1. 3–5 second cold open: the most chaotic or emotional moment.</li>
//                 <li>2. 10–15 seconds of fast context: who you are, what’s at stake.</li>
//                 <li>3. 2–3 big beats: challenge, twist, or conflict escalating.</li>
//                 <li>4. Payoff + subtle CTA: tease the next upload or mini-series.</li>
//               </ul>
//             </div>
//           </motion.div>

//           {/* Brand check + REAL brand logos */}
//           <motion.div
//             className="rounded-[26px] border border-slate-800 bg-slate-950/80 p-5"
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.35, delay: 0.15 }}
//           >
//             <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
//               Brand fit (real sponsors)
//             </p>

//             <div className="mt-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-[11px] text-emerald-200">
//               <p>✅ {brandSummary}</p>
//             </div>

//             {/* Brand logos row */}
//             <div className="mt-4">
//               <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
//                 Top brands that would actually make sense
//               </p>
//               <div className="mt-3 flex flex-wrap gap-3">
//                 {brandMatches.map((brand) => (
//                   <div
//                     key={brand.name}
//                     className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-[11px]"
//                   >
//                     {/* Logo avatar (emoji or initial as logo) */}
//                     <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500/70 via-indigo-500/70 to-pink-500/70 text-sm">
//                       <span>{brand.emoji || brand.name[0]}</span>
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-xs font-semibold text-slate-50">
//                         {brand.name}
//                       </span>
//                       <span className="text-[10px] text-slate-400">
//                         {brand.category} • Fit{" "}
//                         {brand.score != null ? `${brand.score}%` : "—"}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Brand guidance */}
//             <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-[11px] text-slate-300">
//               <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
//                 How to use this
//               </p>
//               <ul className="mt-2 space-y-1.5">
//                 <li>
//                   • Screenshot this dashboard and attach it when you email a brand
//                   — it proves you’ve thought about fit.
//                 </li>
//                 <li>
//                   • Start with brands over <span className="font-semibold">80% fit</span>{" "}
//                   and pitch 1 video + 3 Shorts package.
//                 </li>
//                 <li>
//                   • If a brand under 70% reaches out, ask yourself: “Would my audience
//                   expect to see this here?” If not, say no.
//                 </li>
//               </ul>
//             </div>
//           </motion.div>
//         </section>
//       </main>
//     </div>
//   );
// }



//-----------------------------------------------OLD ONE------------------------------------------------------------
//-----------------------------------------------OLD ONE------------------------------------------------------------
//-----------------------------------------------OLD ONE------------------------------------------------------------
//-----------------------------------------------OLD ONE------------------------------------------------------------
// // pages/dashboard.js
// export default function Dashboard() {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#02091f] to-[#020617] text-slate-50">
//         {/* Glow background blobs */}
//         <div className="pointer-events-none fixed inset-0 -z-10">
//           <div className="absolute -right-32 top-[-80px] h-72 w-72 rounded-full bg-[#3b82f6] opacity-20 blur-3xl" />
//           <div className="absolute -left-24 bottom-[-60px] h-80 w-80 rounded-full bg-[#a855f7] opacity-25 blur-3xl" />
//         </div>
  
//         {/* Top nav */}
//         <header className="border-b border-slate-800/60 bg-slate-950/60 backdrop-blur-xl">
//           <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
//             <div className="flex items-center gap-2">
//               <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#22d3ee] via-[#6366f1] to-[#ec4899] shadow-lg shadow-sky-500/40">
//                 <span className="text-xs font-semibold tracking-wide">CRS</span>
//               </div>
//               <div className="flex flex-col leading-tight">
//                 <span className="text-sm font-semibold text-slate-50">
//                   Creator Score
//                 </span>
//                 <span className="text-[11px] text-slate-400">
//                   Turn your channel into a strategy engine
//                 </span>
//               </div>
//             </div>
  
//             <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
//               <button className="hover:text-slate-50">Dashboard</button>
//               <button className="hover:text-slate-50">For creators</button>
//               <button className="hover:text-slate-50">For brands</button>
//               <button className="hover:text-slate-50">How it works</button>
//             </div>
  
//             <div className="flex items-center gap-3">
//               <button className="hidden rounded-full border border-slate-700/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 hover:text-slate-50 md:inline-flex">
//                 Docs
//               </button>
//               <button className="rounded-full bg-gradient-to-r from-[#22d3ee] via-[#6366f1] to-[#ec4899] px-4 py-1.5 text-xs font-semibold text-slate-900 shadow-[0_0_25px_rgba(56,189,248,0.55)] hover:brightness-110">
//                 Get early access
//               </button>
//             </div>
//           </nav>
//         </header>
  
//         {/* Main content */}
//         <main className="mx-auto max-w-6xl px-4 py-8 lg:px-6 lg:py-10">
//           {/* Top row: input + summary */}
//           <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//             <div>
//               <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
//                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//                 Live example – YouTube creator dashboard
//               </p>
//               <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
//                 Turn your channel into a scored strategy engine.
//               </h1>
//               <p className="mt-2 max-w-xl text-sm text-slate-400">
//                 Paste your handle, get a single score for identity, content,
//                 timing, and brand-fit — then see exactly what to post next and
//                 which sponsorships to actually say yes to.
//               </p>
//             </div>
  
//             <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950/70 p-3 shadow-xl shadow-black/40">
//               <label className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
//                 Channel handle
//               </label>
//               <div className="mt-1.5 flex items-center rounded-xl border border-slate-700 bg-slate-900/70 px-2.5 py-1.5">
//                 <span className="text-xs text-slate-500">@</span>
//                 <input
//                   className="ml-1 flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 outline-none"
//                   placeholder="yourchannel"
//                 />
//                 <button className="rounded-full bg-gradient-to-r from-[#22d3ee] to-[#6366f1] px-3 py-1 text-[11px] font-semibold text-slate-900 hover:brightness-110">
//                   Get score
//                 </button>
//               </div>
//               <p className="mt-1 text-[11px] text-slate-500">
//                 No channel access — just your public videos.
//               </p>
//             </div>
//           </section>
  
//           {/* Grid layout */}
//           <section className="grid gap-5 lg:grid-cols-[1.15fr,0.95fr]">
//             {/* Left column */}
//             <div className="space-y-4">
//               {/* Score + metrics card */}
//               <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
//                 <div className="flex items-start justify-between gap-4">
//                   <div>
//                     <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
//                       Overall creator score
//                     </p>
//                     <h2 className="mt-1 text-xl font-semibold text-slate-50">
//                       @yourchannel
//                     </h2>
//                     <p className="mt-1 text-xs text-slate-400">
//                       Content, identity, timing &amp; brand-fit in a single
//                       number.
//                     </p>
//                   </div>
  
//                   {/* Score ring */}
//                   <div className="relative flex h-20 w-20 items-center justify-center">
//                     <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#22d3ee] via-[#6366f1] to-[#ec4899] opacity-80" />
//                     <div className="absolute inset-[4px] rounded-full bg-slate-950" />
//                     <div className="relative text-center">
//                       <span className="block text-lg font-semibold text-slate-50">
//                         82
//                       </span>
//                       <span className="text-[10px] uppercase tracking-wide text-slate-400">
//                         /100
//                       </span>
//                     </div>
//                   </div>
//                 </div>
  
//                 {/* Metrics grid */}
//                 <div className="mt-4 grid gap-3 md:grid-cols-4">
//                   {[
//                     { label: "Identity", value: 76 },
//                     { label: "Content", value: 88 },
//                     { label: "Timing", value: 72 },
//                     { label: "Brand fit", value: 94 },
//                   ].map((item) => (
//                     <div
//                       key={item.label}
//                       className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3"
//                     >
//                       <p className="text-[11px] text-slate-400">{item.label}</p>
//                       <p className="mt-1 text-sm font-semibold text-slate-50">
//                         {item.value}
//                       </p>
//                       <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800">
//                         <div
//                           className="h-1.5 rounded-full bg-gradient-to-r from-[#22d3ee] via-[#6366f1] to-[#ec4899]"
//                           style={{ width: `${item.value}%` }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
  
//               {/* Next video idea + performance */}
//               <div className="grid gap-4 md:grid-cols-2">
//                 {/* Next video idea */}
//                 <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
//                   <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
//                     Next video idea
//                   </p>
//                   <h3 className="mt-2 text-sm font-semibold text-slate-50">
//                     “I followed my own advice for 30 days. Here’s what broke.”
//                   </h3>
//                   <p className="mt-2 text-xs text-slate-400">
//                     Hook: Start with the chaos your audience already feels. Then
//                     show them how your system saved you.
//                   </p>
//                   <div className="mt-3 flex items-center justify-between text-[11px]">
//                     <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-1 text-emerald-300">
//                       <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//                       High chance to trend
//                     </span>
//                     <span className="text-slate-400">Predicted CTR: 7.3%</span>
//                   </div>
//                 </div>
  
//                 {/* Performance snapshot */}
//                 <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
//                   <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
//                     Performance snapshot
//                   </p>
//                   <div className="mt-3 h-32 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-900/10 to-slate-900 p-3">
//                     {/* Fake chart */}
//                     <div className="flex h-full items-end gap-1">
//                       {[20, 35, 50, 60, 45, 75, 90].map((h, i) => (
//                         <div
//                           key={i}
//                           className="flex-1 rounded-full bg-gradient-to-t from-slate-700 to-[#22d3ee]"
//                           style={{ height: `${h}%` }}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                   <div className="mt-3 flex justify-between text-[11px] text-slate-400">
//                     <span>Last 30 days</span>
//                     <span className="text-emerald-300">+41% watch time</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
  
//             {/* Right column */}
//             <div className="space-y-4">
//               {/* Brand check card */}
//               <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
//                 <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
//                   Brand check
//                 </p>
//                 <h3 className="mt-2 text-sm font-semibold text-slate-50">
//                   This productivity app is a strong match.
//                 </h3>
//                 <ul className="mt-3 space-y-2 text-xs text-slate-400">
//                   <li>
//                     <span className="mr-1 text-emerald-400">✓</span> Audience
//                     overlap: <span className="text-slate-100">91%</span>
//                   </li>
//                   <li>
//                     <span className="mr-1 text-emerald-400">✓</span> Risk level:{" "}
//                     <span className="text-slate-100">Low</span>
//                   </li>
//                   <li>
//                     <span className="mr-1 text-emerald-400">✓</span> Suggested
//                     format: 60s integrated ad read + pinned comment CTA.
//                   </li>
//                 </ul>
//                 <button className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#22d3ee] via-[#6366f1] to-[#ec4899] px-3 py-2 text-xs font-semibold text-slate-900 hover:brightness-110">
//                   View compatible sponsors
//                 </button>
//               </div>
  
//               {/* Earnings projection */}
//               <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
//                 <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
//                   Earnings projection
//                 </p>
//                 <h3 className="mt-2 text-sm font-semibold text-slate-50">
//                   ₹46,000 → ₹1,20,000 / month
//                 </h3>
//                 <p className="mt-2 text-xs text-slate-400">
//                   Based on your last 20 uploads, current growth rate, and
//                   sponsored-slot capacity, this is the realistic range if you
//                   follow the plan for 90 days.
//                 </p>
  
//                 <div className="mt-4 h-20 rounded-2xl bg-slate-900/80 p-3">
//                   <div className="flex items-center justify-between text-[11px] text-slate-400">
//                     <span>Today</span>
//                     <span>90 days</span>
//                   </div>
//                   <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800">
//                     <div className="h-1.5 w-3/5 rounded-full bg-gradient-to-r from-[#22d3ee] via-[#6366f1] to-[#ec4899]" />
//                   </div>
//                 </div>
//               </div>
  
//               {/* Checklist */}
//               <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
//                 <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
//                   Today&apos;s focus
//                 </p>
//                 <ul className="mt-3 space-y-2 text-xs text-slate-300">
//                   <li className="flex items-start gap-2">
//                     <span className="mt-0.5 h-3 w-3 rounded-full border border-slate-500" />
//                     Script and record the “30-day advice” video with strong
//                     story-first hook.
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="mt-0.5 h-3 w-3 rounded-full border border-slate-500" />
//                     Add 1 mid-roll slot to your top 3 videos for sponsor tests.
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="mt-0.5 h-3 w-3 rounded-full border border-slate-500" />
//                     Shortlist 3 brands from the &quot;Productivity&quot; category
//                     with &gt;80% match.
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </section>
//         </main>
//       </div>
//     );
//   }
  