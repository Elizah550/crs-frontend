// pages/api/creator-score.js
import { NextApiRequest, NextApiResponse } from "next";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// --- Helpers ---------------------------------------------------------

// Extract channel ID or handle from a YouTube URL or @handle
function extractChannelIdentifier(input) {
  if (!input) return null;

  const trimmed = input.trim();

  // If user passed bare handle like "@pavannet" or "pavannet"
  if (trimmed.startsWith("@")) {
    return { type: "handle", value: trimmed.slice(1) };
  }

  // Full URL cases
  try {
    const url = new URL(trimmed);

    // /@handle
    if (url.pathname.startsWith("/@")) {
      return { type: "handle", value: url.pathname.slice(2) };
    }

    // /channel/CHANNEL_ID
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts[0] === "channel" && parts[1]) {
      return { type: "channelId", value: parts[1] };
    }

    // /c/CustomName or /user/CustomName — we'll treat as handle-like name
    if ((parts[0] === "c" || parts[0] === "user") && parts[1]) {
      return { type: "customName", value: parts[1] };
    }
  } catch {
    // Not a URL, fall back to treating it as a handle or ID
  }

  // Fallback: assume handle-like
  return { type: "handle", value: trimmed.replace("@", "") };
}

// Resolve channelId from whatever the user gave
async function resolveChannelId(identifier) {
  const { type, value } = identifier;

  if (type === "channelId") {
    return value;
  }

  // For handle or custom name, use search.list
  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  searchUrl.searchParams.set("part", "snippet");
  searchUrl.searchParams.set("maxResults", "1");
  searchUrl.searchParams.set("type", "channel");
  searchUrl.searchParams.set("key", YOUTUBE_API_KEY);

  if (type === "handle") {
    searchUrl.searchParams.set("q", `@${value}`);
  } else {
    searchUrl.searchParams.set("q", value);
  }

  const res = await fetch(searchUrl.toString());
  if (!res.ok) {
    throw new Error("Failed to search channel");
  }
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    throw new Error("Channel not found from search");
  }

  return data.items[0].snippet.channelId;
}

// Fetch channel details (snippet + stats)
async function fetchChannelDetails(channelId) {
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "snippet,statistics,contentDetails");
  url.searchParams.set("id", channelId);
  url.searchParams.set("key", YOUTUBE_API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error("Failed to fetch channel details");
  }

  const data = await res.json();
  if (!data.items || data.items.length === 0) {
    throw new Error("Channel not found");
  }

  return data;
}

// Fetch recent videos (last N uploads) via uploads playlist
async function fetchRecentVideos(channelData, maxResults = 10) {
  const channel = channelData.items[0];
  const uploadsPlaylistId =
    channel.contentDetails?.relatedPlaylists?.uploads || null;

  if (!uploadsPlaylistId) return [];

  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.set("part", "snippet,contentDetails");
  url.searchParams.set("playlistId", uploadsPlaylistId);
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("key", YOUTUBE_API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error("Failed to fetch recent videos");
  }

  const data = await res.json();
  return data.items || [];
}

// Fetch durations and stats for each video, compute crude watch-time estimate
async function enrichVideosAndEstimateWatchTime(videos) {
  if (!videos.length) {
    return { enrichedVideos: [], approxWatchTimeHours: 0 };
  }

  const videoIds = videos
    .map((item) => item.contentDetails?.videoId)
    .filter(Boolean);

  if (!videoIds.length) {
    return { enrichedVideos: [], approxWatchTimeHours: 0 };
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet,contentDetails,statistics");
  url.searchParams.set("id", videoIds.join(","));
  url.searchParams.set("key", YOUTUBE_API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error("Failed to fetch video details");
  }

  const data = await res.json();
  const byId = new Map();
  for (const v of data.items || []) {
    byId.set(v.id, v);
  }

  // Merge base "playlistItems" with full "videos" resource
  const enrichedVideos = videos
    .map((item) => {
      const vid = item.contentDetails?.videoId;
      const full = byId.get(vid);
      if (!full) return null;
      return full;
    })
    .filter(Boolean);

  // Approx watch-time: sum(viewCount * durationSeconds) for these videos
  let totalSeconds = 0;

  for (const v of enrichedVideos) {
    const duration = v.contentDetails?.duration || "PT0S";
    const views = Number(v.statistics?.viewCount || 0);
    const seconds = isoDurationToSeconds(duration);
    totalSeconds += views * seconds;
  }

  const approxWatchTimeHours = totalSeconds / 3600;

  return { enrichedVideos, approxWatchTimeHours };
}

// Convert ISO 8601 duration (PT10M5S etc.) to seconds
function isoDurationToSeconds(iso) {
  // Very small parser for YT durations
  const match =
    /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i.exec(iso) || [];
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

// Call OpenAI to compute scores & ideas
async function getCreatorScoresFromOpenAI({ channel, videos, approxWatchTimeHours }) {
  const systemPrompt = `
You are "Syncfluence CRS Engine", an evaluator for YouTube creators.
You receive basic channel info, recent videos, and estimated total watch time for the latest 10 videos.
Return a strict JSON object with these fields:

{
  "overall_score": number,          // 0–100
  "identity_score": number,         // 0–100
  "content_score": number,          // 0–100
  "timing_score": number,           // 0–100
  "brand_fit_score": number,        // 0–100
  "watch_time_score": number,       // 0–100

  "next_video_title": string,
  "next_video_hook": string,

  "brand_check_summary": string,

  "inspiration_channels": [
    { "name": string, "url": string, "reason": string }
  ]
}
No extra keys, no comments, no markdown.
  `.trim();

  const userPayload = {
    channel,
    videos: videos.map((v) => ({
      id: v.id,
      title: v.snippet?.title,
      description: v.snippet?.description,
      publishedAt: v.snippet?.publishedAt,
      duration: v.contentDetails?.duration,
      viewCount: v.statistics?.viewCount,
      likeCount: v.statistics?.likeCount,
      commentCount: v.statistics?.commentCount,
    })),
    approxWatchTimeHours,
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify(userPayload),
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("OpenAI error:", text);
    throw new Error("Failed to get scores from OpenAI");
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "{}";

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    console.error("Failed to parse OpenAI JSON:", e, content);
    throw new Error("Invalid JSON from OpenAI");
  }

  return parsed;
}

// --- API Handler -----------------------------------------------------

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { channelUrl } = req.body || {};
    if (!channelUrl) {
      return res.status(400).json({
        error: "channelUrl is required in the request body.",
      });
    }

    if (!YOUTUBE_API_KEY) {
      return res
        .status(500)
        .json({ error: "Missing YOUTUBE_API_KEY env var." });
    }

    if (!OPENAI_API_KEY) {
      return res
        .status(500)
        .json({ error: "Missing OPENAI_API_KEY env var." });
    }

    // 1) Resolve what user passed to a proper channelId
    const identifier = extractChannelIdentifier(channelUrl);
    const channelId = await resolveChannelId(identifier);

    // 2) Fetch channel details
    const channelData = await fetchChannelDetails(channelId);
    const channel = channelData.items[0];

    const channelTitle = channel.snippet.title;
    const channelDescription = channel.snippet.description || "";
    const statistics = channel.statistics || {};

    // 👇 pick highest quality thumbnail available
    const profilePictureUrl =
      channel.snippet?.thumbnails?.high?.url ||
      channel.snippet?.thumbnails?.medium?.url ||
      channel.snippet?.thumbnails?.default?.url ||
      null;

    // 3) Fetch recent videos
    const recentVideos = await fetchRecentVideos(channelData, 10);

    // 4) Enrich + compute approx watch time
    const { enrichedVideos, approxWatchTimeHours } =
      await enrichVideosAndEstimateWatchTime(recentVideos);

    // 5) Get scores + next video ideas from OpenAI
    const result = await getCreatorScoresFromOpenAI({
      channel: {
        id: channelId,
        title: channelTitle,
        description: channelDescription,
        statistics,
      },
      videos: enrichedVideos,
      approxWatchTimeHours,
    });

    // 6) Final response (THIS IS WHAT YOU ASKED TO STRUCTURE)
    return res.status(200).json({
      channel: {
        id: channelId,
        title: channelTitle,
        description: channelDescription,
        statistics,
        profilePictureUrl, // 👈 added
      },
      videos: enrichedVideos,
      estimatedWatchTime: {
        recent10Hours: approxWatchTimeHours,
      },
      scores: {
        overall: result.overall_score,
        identity: result.identity_score,
        content: result.content_score,
        timing: result.timing_score,
        brandFit: result.brand_fit_score,
        watchTime: result.watch_time_score,
      },
      nextVideo: {
        title: result.next_video_title,
        hook: result.next_video_hook,
      },
      brandCheck: {
        summary: result.brand_check_summary,
      },
      inspiration: {
        channels: result.inspiration_channels || [],
      },
    });
  } catch (error) {
    console.error("creator-score error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message || "Unknown error",
    });
  }
}

// =====================================================OLD ONE 1.0 =========================================
// pages/api/creator-score.js
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Helper: parse ISO8601 duration (e.g. PT12M34S) into seconds
// function parseISO8601Duration(duration) {
//   // Simple parser for PT#H#M#S
//   const match = duration.match(
//     /P(?:\d+Y)?(?:\d+M)?(?:\d+D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
//   );
//   if (!match) return 0;
//   const hours = parseInt(match[1] || "0", 10);
//   const minutes = parseInt(match[2] || "0", 10);
//   const seconds = parseInt(match[3] || "0", 10);
//   return hours * 3600 + minutes * 60 + seconds;
// }

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   try {
//     const { handle } = req.body;

//     if (!handle) {
//       return res.status(400).json({ error: "Missing YouTube handle" });
//     }

//     const apiKey = process.env.YOUTUBE_API_KEY;
//     if (!apiKey) {
//       return res.status(500).json({ error: "Missing YOUTUBE_API_KEY env var" });
//     }

//     // 1) Normalize handle (strip @ if present)
//     const cleanHandle = handle.startsWith("@") ? handle.slice(1) : handle;

//     // 2) Get channel info by handle
//     const channelRes = await fetch(
//       `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(
//         cleanHandle
//       )}&key=${apiKey}`
//     );

//     const channelData = await channelRes.json();

//     if (!channelData.items || channelData.items.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "Channel not found. Check the handle." });
//     }

//     const channel = channelData.items[0];
//     const channelId = channel.id;
//     const channelTitle = channel.snippet.title;
//     const channelDescription = channel.snippet.description || "";
//     const statistics = channel.statistics || {};

//     // 3) Fetch recent videos (last 10 uploads by date)
//     const searchRes = await fetch(
//       `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=10&type=video&key=${apiKey}`
//     );
//     const searchData = await searchRes.json();

//     const searchItems = searchData.items || [];

//     // Extract video IDs from search results
//     const videoIdList = searchItems
//       .map((item) => item.id && item.id.videoId)
//       .filter(Boolean);

//     let videos = [];
//     let approxWatchTimeHours = 0;

//     if (videoIdList.length > 0) {
//       const idsParam = videoIdList.join(",");

//       // 4) Get statistics & duration for those videos
//       const videosRes = await fetch(
//         `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${idsParam}&key=${apiKey}`
//       );
//       const videosData = await videosRes.json();
//       const videoItems = videosData.items || [];

//       // Build a map from videoId -> snippet from original search (for consistency)
//       const snippetMap = {};
//       for (const item of searchItems) {
//         const vid = item.id && item.id.videoId;
//         if (vid) {
//           snippetMap[vid] = item.snippet;
//         }
//       }

//       // Estimate watch time hours for last 10 videos
//       for (const v of videoItems) {
//         const vid = v.id;
//         const snippet = snippetMap[vid] || v.snippet || {};
//         const title = snippet.title;
//         const description = snippet.description;
//         const publishedAt = snippet.publishedAt;

//         const stats = v.statistics || {};
//         const viewCount = Number(stats.viewCount || 0);

//         const durationISO = v.contentDetails?.duration || "PT0S";
//         const durationSeconds = parseISO8601Duration(durationISO);

//         // Very rough heuristic: average view duration = 50% of video duration (capped by full duration)
//         const avgViewDurationSeconds = Math.min(
//           durationSeconds,
//           durationSeconds * 0.5
//         );

//         const watchTimeHoursForVideo =
//           (viewCount * avgViewDurationSeconds) / 3600;

//         approxWatchTimeHours += watchTimeHoursForVideo;

//         videos.push({
//           id: vid,
//           title,
//           description,
//           publishedAt,
//           viewCount,
//           durationSeconds,
//           durationISO,
//         });
//       }
//     }

//     // 5) Ask OpenAI to score the channel (including watch time info + inspiration channels)
//     const prompt = `
// You are a YouTube strategy analyst.

// You are given:
// - Channel title
// - Channel description
// - Basic stats (views, subs, videos)
// - Approximate recent watch time (last 10 videos)
// - Recent videos (title, description, publish time, views, duration)

// Tasks:
// 1) Judge how strong this channel is overall.
// 2) Judge how strong their identity, content, timing, brand-fit, and watch time are.
// 3) Recommend the next video idea.
// 4) Give a short brand-fit summary for productivity / tech / finance apps.
// 5) **Very important:** suggest 3–5 **real, existing YouTube channels** in a similar niche that this creator can study for inspiration.
//    - Prefer channels known for strong watch time, retention, or brand deals in this niche.
//    - For each, include: 
//      - name
//      - handle_or_url (best guess; doesn't have to be perfect)
//      - why_relevant (1–2 sentences)
//      - what_to_learn (specific behaviour: thumbnails, hooks, series format, upload cadence, etc.)

// Return a **single JSON object ONLY** with these keys:
// - overall_score (0-100)
// - identity_score (0-100)
// - content_score (0-100)
// - timing_score (0-100)
// - brand_fit_score (0-100)
// - watch_time_score (0-100)   // how strong their watch time/engagement is relative to their size
// - next_video_title           // short, catchy title
// - next_video_hook            // 1-2 sentence hook
// - brand_check_summary        // 2-3 sentence summary if this channel is a strong fit for productivity / tech / finance apps
// - inspiration_channels       // array of 3-5 objects:
//                              //   [{ "name": string,
//                              //      "handle_or_url": string,
//                              //      "why_relevant": string,
//                              //      "what_to_learn": string }]

// Here is the data:

// Channel:
// Title: ${channelTitle}
// Description: ${channelDescription}
// Statistics: ${JSON.stringify(statistics, null, 2)}

// Approximate recent watch time (last 10 videos): ${approxWatchTimeHours.toFixed(
//       2
//     )} hours

// Recent videos (with views + duration):
// ${JSON.stringify(videos, null, 2)}
//     `;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You output strict JSON only." },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.7,
//     });

//     let raw = completion.choices[0].message.content || "{}";

//     // Sometimes models wrap JSON in ```json ``` – strip if needed
//     raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

//     let result;
//     try {
//       result = JSON.parse(raw);
//     } catch (e) {
//       console.error("Failed to parse JSON from model:", raw);
//       return res.status(500).json({
//         error: "Failed to parse AI response",
//         raw,
//       });
//     }

//     // 6) Send combined response
//     return res.status(200).json({
//       channel: {
//         id: channelId,
//         title: channelTitle,
//         description: channelDescription,
//         statistics,
//       },
//       videos,
//       estimatedWatchTime: {
//         recent10Hours: approxWatchTimeHours,
//       },
//       scores: {
//         overall: result.overall_score,
//         identity: result.identity_score,
//         content: result.content_score,
//         timing: result.timing_score,
//         brandFit: result.brand_fit_score,
//         watchTime: result.watch_time_score,
//       },
//       nextVideo: {
//         title: result.next_video_title,
//         hook: result.next_video_hook,
//       },
//       brandCheck: {
//         summary: result.brand_check_summary,
//       },
//       inspiration: {
//         channels: result.inspiration_channels || [],
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(500)
//       .json({ error: "Server error", details: err.message });
//   }
// }

/////////////////////////////////////--Version -02 ------------////////////////////////////////////
// // pages/api/creator-score.js
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Helper: parse ISO8601 duration (e.g. PT12M34S) into seconds
// function parseISO8601Duration(duration) {
//   // Simple parser for PT#H#M#S
//   const match = duration.match(
//     /P(?:\d+Y)?(?:\d+M)?(?:\d+D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
//   );
//   if (!match) return 0;
//   const hours = parseInt(match[1] || "0", 10);
//   const minutes = parseInt(match[2] || "0", 10);
//   const seconds = parseInt(match[3] || "0", 10);
//   return hours * 3600 + minutes * 60 + seconds;
// }

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   try {
//     const { handle } = req.body;

//     if (!handle) {
//       return res.status(400).json({ error: "Missing YouTube handle" });
//     }

//     const apiKey = process.env.YOUTUBE_API_KEY;
//     if (!apiKey) {
//       return res.status(500).json({ error: "Missing YOUTUBE_API_KEY env var" });
//     }

//     // 1) Normalize handle (strip @ if present)
//     const cleanHandle = handle.startsWith("@") ? handle.slice(1) : handle;

//     // 2) Get channel info by handle
//     const channelRes = await fetch(
//       `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(
//         cleanHandle
//       )}&key=${apiKey}`
//     );

//     const channelData = await channelRes.json();

//     if (!channelData.items || channelData.items.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "Channel not found. Check the handle." });
//     }

//     const channel = channelData.items[0];
//     const channelId = channel.id;
//     const channelTitle = channel.snippet.title;
//     const channelDescription = channel.snippet.description || "";
//     const statistics = channel.statistics || {};

//     // 3) Fetch recent videos (last 10 uploads by date)
//     const searchRes = await fetch(
//       `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=10&type=video&key=${apiKey}`
//     );
//     const searchData = await searchRes.json();

//     const searchItems = searchData.items || [];

//     // Extract video IDs from search results
//     const videoIdList = searchItems
//       .map((item) => item.id && item.id.videoId)
//       .filter(Boolean);

//     let videos = [];
//     let approxWatchTimeHours = 0;

//     if (videoIdList.length > 0) {
//       const idsParam = videoIdList.join(",");

//       // 4) Get statistics & duration for those videos
//       const videosRes = await fetch(
//         `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${idsParam}&key=${apiKey}`
//       );
//       const videosData = await videosRes.json();
//       const videoItems = videosData.items || [];

//       // Build a map from videoId -> snippet from original search (for consistency)
//       const snippetMap = {};
//       for (const item of searchItems) {
//         const vid = item.id && item.id.videoId;
//         if (vid) {
//           snippetMap[vid] = item.snippet;
//         }
//       }

//       // Estimate watch time hours for last 10 videos
//       for (const v of videoItems) {
//         const vid = v.id;
//         const snippet = snippetMap[vid] || v.snippet || {};
//         const title = snippet.title;
//         const description = snippet.description;
//         const publishedAt = snippet.publishedAt;

//         const stats = v.statistics || {};
//         const viewCount = Number(stats.viewCount || 0);

//         const durationISO = v.contentDetails?.duration || "PT0S";
//         const durationSeconds = parseISO8601Duration(durationISO);

//         // Very rough heuristic: average view duration = 50% of video duration (capped by full duration)
//         const avgViewDurationSeconds = Math.min(
//           durationSeconds,
//           durationSeconds * 0.5
//         );

//         const watchTimeHoursForVideo =
//           (viewCount * avgViewDurationSeconds) / 3600;

//         approxWatchTimeHours += watchTimeHoursForVideo;

//         videos.push({
//           id: vid,
//           title,
//           description,
//           publishedAt,
//           viewCount,
//           durationSeconds,
//           durationISO,
//         });
//       }
//     }

//     // 5) Ask OpenAI to score the channel (including watch time info)
//     const prompt = `
// You are a YouTube strategy analyst.

// You are given:
// - Channel title
// - Channel description
// - Basic stats (views, subs, videos)
// - Approximate recent watch time (last 10 videos)
// - Recent videos (title, description, publish time, views, duration)

// Use the approximate watch time to make a stronger judgment about whether this channel has real engagement or just vanity metrics.

// Return a **single JSON object ONLY** with these keys:
// - overall_score (0-100)
// - identity_score (0-100)
// - content_score (0-100)
// - timing_score (0-100)
// - brand_fit_score (0-100)
// - watch_time_score (0-100)  // how strong their watch time/engagement is relative to their size
// - next_video_title (short, catchy title)
// - next_video_hook (1-2 sentence hook)
// - brand_check_summary (2-3 sentence summary if this channel is a strong fit for productivity / tech / finance apps)

// Here is the data:

// Channel:
// Title: ${channelTitle}
// Description: ${channelDescription}
// Statistics: ${JSON.stringify(statistics, null, 2)}

// Approximate recent watch time (last 10 videos): ${approxWatchTimeHours.toFixed(
//       2
//     )} hours

// Recent videos (with views + duration):
// ${JSON.stringify(videos, null, 2)}
//     `;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You output strict JSON only." },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.7,
//     });

//     let raw = completion.choices[0].message.content || "{}";

//     // Sometimes models wrap JSON in ```json ``` – strip if needed
//     raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

//     let result;
//     try {
//       result = JSON.parse(raw);
//     } catch (e) {
//       console.error("Failed to parse JSON from model:", raw);
//       return res.status(500).json({
//         error: "Failed to parse AI response",
//         raw,
//       });
//     }

//     // 6) Send combined response
//     return res.status(200).json({
//       channel: {
//         id: channelId,
//         title: channelTitle,
//         description: channelDescription,
//         statistics,
//       },
//       videos,
//       estimatedWatchTime: {
//         recent10Hours: approxWatchTimeHours,
//       },
//       scores: {
//         overall: result.overall_score,
//         identity: result.identity_score,
//         content: result.content_score,
//         timing: result.timing_score,
//         brandFit: result.brand_fit_score,
//         watchTime: result.watch_time_score,
//       },
//       nextVideo: {
//         title: result.next_video_title,
//         hook: result.next_video_hook,
//       },
//       brandCheck: {
//         summary: result.brand_check_summary,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(500)
//       .json({ error: "Server error", details: err.message });
//   }
// }

//////////////////////////////////--OLD --ONE--------//////////////////////////////////////
// // pages/api/creator-score.js
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   try {
//     const { handle } = req.body;

//     if (!handle) {
//       return res.status(400).json({ error: "Missing YouTube handle" });
//     }

//     const apiKey = process.env.YOUTUBE_API_KEY;
//     if (!apiKey) {
//       return res.status(500).json({ error: "Missing YOUTUBE_API_KEY env var" });
//     }

//     // 1) Normalize handle (strip @ if present)
//     const cleanHandle = handle.startsWith("@") ? handle.slice(1) : handle;

//     // 2) Get channel info by handle
//     const channelRes = await fetch(
//       `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${encodeURIComponent(
//         cleanHandle
//       )}&key=${apiKey}`
//     );

//     const channelData = await channelRes.json();

//     if (!channelData.items || channelData.items.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "Channel not found. Check the handle." });
//     }

//     const channel = channelData.items[0];
//     const channelId = channel.id;
//     const channelTitle = channel.snippet.title;
//     const channelDescription = channel.snippet.description || "";
//     const statistics = channel.statistics || {};

//     // 3) Fetch recent videos
//     const videosRes = await fetch(
//       `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=10&type=video&key=${apiKey}`
//     );
//     const videosData = await videosRes.json();

//     const videos = (videosData.items || []).map((v) => ({
//       title: v.snippet.title,
//       description: v.snippet.description,
//       publishedAt: v.snippet.publishedAt,
//     }));

//     // 4) Ask OpenAI to score the channel
//     const prompt = `
// You are a YouTube strategy analyst.

// You are given:
// - Channel title
// - Channel description
// - Basic stats (views, subs, videos)
// - Recent videos (title, description, publish time)

// Return a **single JSON object ONLY** with these keys:
// - overall_score (0-100)
// - identity_score (0-100)
// - content_score (0-100)
// - timing_score (0-100)
// - brand_fit_score (0-100)
// - next_video_title (short, catchy title)
// - next_video_hook (1-2 sentence hook)
// - brand_check_summary (2-3 sentence summary if this channel is a strong fit for productivity / tech / finance apps)

// Here is the data:

// Channel:
// Title: ${channelTitle}
// Description: ${channelDescription}
// Statistics: ${JSON.stringify(statistics, null, 2)}

// Recent videos:
// ${JSON.stringify(videos, null, 2)}
//     `;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You output strict JSON only." },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.7,
//     });

//     let raw = completion.choices[0].message.content || "{}";

//     // Sometimes models wrap JSON in ```json ``` – strip if needed
//     raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

//     let result;
//     try {
//       result = JSON.parse(raw);
//     } catch (e) {
//       console.error("Failed to parse JSON from model:", raw);
//       return res.status(500).json({
//         error: "Failed to parse AI response",
//         raw,
//       });
//     }

//     // 5) Send combined response
//     return res.status(200).json({
//       channel: {
//         id: channelId,
//         title: channelTitle,
//         description: channelDescription,
//         statistics,
//       },
//       videos,
//       scores: {
//         overall: result.overall_score,
//         identity: result.identity_score,
//         content: result.content_score,
//         timing: result.timing_score,
//         brandFit: result.brand_fit_score,
//       },
//       nextVideo: {
//         title: result.next_video_title,
//         hook: result.next_video_hook,
//       },
//       brandCheck: {
//         summary: result.brand_check_summary,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Server error", details: err.message });
//   }
// }
