// src/utils/youtubeService.ts

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// --- PREMIUM CURATED FALLBACKS ---
// If the YouTube API fails or quota is exceeded, the app will instantly load these high-quality courses.
const CURATED_COURSES: Record<string, any[]> = {
  'AI & Machine Learning Engineer': [
    { id: 'i_LwzRmAESA', title: 'Machine Learning for Everybody – Full Course', channel: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/i_LwzRmAESA/hqdefault.jpg' },
    { id: '7eh4d6sabA0', title: 'Python for Beginners - Full Course', channel: 'Programming with Mosh', thumbnail: 'https://i.ytimg.com/vi/7eh4d6sabA0/hqdefault.jpg' },
    { id: 'aircAruvnKk', title: 'But what is a neural network? | Chapter 1, Deep learning', channel: '3Blue1Brown', thumbnail: 'https://i.ytimg.com/vi/aircAruvnKk/hqdefault.jpg' },
    { id: 'cKxRvEZd3Kg', title: "How I'd learn ML in 2026 (if I could start over)", channel: 'mrdbourke', thumbnail: 'https://i.ytimg.com/vi/cKxRvEZd3Kg/hqdefault.jpg' }
  ],
  'Full Stack Architect': [
    { id: 'mOU1EWMeZCQ', title: 'Full Stack Web Development for Beginners', channel: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/mOU1EWMeZCQ/hqdefault.jpg' },
    { id: 'SqcY0GlETPk', title: 'React Tutorial for Beginners', channel: 'Programming with Mosh', thumbnail: 'https://i.ytimg.com/vi/SqcY0GlETPk/hqdefault.jpg' },
    { id: 'Oe421EPjeBE', title: 'Node.js and Express.js - Full Course', channel: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/Oe421EPjeBE/hqdefault.jpg' },
    { id: 'bgZOA7vJkL8', title: 'System Design for Beginners Course', channel: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/bgZOA7vJkL8/hqdefault.jpg' }
  ],
  'UI/UX Product Designer': [
    { id: 'c9Wg6Cb_YlU', title: 'UI / UX Design Tutorial – Wireframe, Mockup & Design in Figma', channel: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/c9Wg6Cb_YlU/hqdefault.jpg' },
    { id: 'jwCmIBJ8Jtc', title: 'Figma Tutorial for UI Design - Course for Beginners', channel: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/jwCmIBJ8Jtc/hqdefault.jpg' },
    { id: 'MDcG23jExes', title: 'A Day in the Life of a UX Designer', channel: 'Rachel How', thumbnail: 'https://i.ytimg.com/vi/MDcG23jExes/hqdefault.jpg' },
    { id: '3eZ1zSihX4U', title: 'How to build a UX Portfolio from scratch', channel: 'Chunbuns', thumbnail: 'https://i.ytimg.com/vi/3eZ1zSihX4U/hqdefault.jpg' }
  ],
  'Investment Banker / Financial Analyst': [
    { id: 'Vz7Q_27I_H8', title: 'Financial Modeling for Beginners', channel: 'Corporate Finance Institute', thumbnail: 'https://i.ytimg.com/vi/Vz7Q_27I_H8/hqdefault.jpg' },
    { id: '8_NteE-D-yQ', title: 'A Day in the Life of an Investment Banking Analyst', channel: 'Kenji Explains', thumbnail: 'https://i.ytimg.com/vi/8_NteE-D-yQ/hqdefault.jpg' },
    { id: 'W0Qk_mK84C8', title: 'Accounting Basics Explained Through a Story', channel: 'My Secret Math Tutor', thumbnail: 'https://i.ytimg.com/vi/W0Qk_mK84C8/hqdefault.jpg' },
    { id: 'tqQZ8Xz3c1U', title: 'Valuation in Four Lessons', channel: 'Aswath Damodaran', thumbnail: 'https://i.ytimg.com/vi/tqQZ8Xz3c1U/hqdefault.jpg' }
  ]
};

const DEFAULT_FALLBACK = [
  { id: 'v2Bw1H0yZ6w', title: 'How to Learn Anything Fast', channel: 'Ali Abdaal', thumbnail: 'https://i.ytimg.com/vi/v2Bw1H0yZ6w/hqdefault.jpg' },
  { id: '5MgBikgcWnY', title: 'The Ultimate Guide to Starting Your Career', channel: 'Thomas Frank', thumbnail: 'https://i.ytimg.com/vi/5MgBikgcWnY/hqdefault.jpg' },
  { id: 'yR0uU00Z2rY', title: 'Resume Masterclass: How to write a winning resume', channel: 'Jeff Su', thumbnail: 'https://i.ytimg.com/vi/yR0uU00Z2rY/hqdefault.jpg' },
  { id: 'Vn_M_BDEJgQ', title: 'How to Ace Your Next Interview', channel: 'Harvard Business Review', thumbnail: 'https://i.ytimg.com/vi/Vn_M_BDEJgQ/hqdefault.jpg' }
];

export const fetchCareerVideos = async (careerTitle: string) => {
  const cacheKey = `yt_cache_${careerTitle.replace(/\s+/g, '_').toLowerCase()}`;
  
  // 1. Check LocalStorage first
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    const { videos, timestamp } = JSON.parse(cachedData);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;
    
    if (!isExpired && videos && videos.length > 0) {
      console.log("CACHE HIT: Loading videos from LocalStorage");
      return videos;
    }
  }

  // 2. If no API key is found, use the curated fallback database immediately
  if (!API_KEY) {
    console.warn("⚠️ No YouTube API Key found. Using premium curated database.");
    return CURATED_COURSES[careerTitle] || DEFAULT_FALLBACK;
  }

  // 3. If no cache or expired, call the Real API
  console.log("CACHE MISS: Calling YouTube API...");
  try {
    // Upgraded search query to pull high-quality tutorials instead of vlogs
    const query = encodeURIComponent(`${careerTitle} full course tutorial beginner masterclass`);
    const response = await fetch(
      `${BASE_URL}?part=snippet&maxResults=4&q=${query}&type=video&videoEmbeddable=true&key=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.error) throw new Error(data.error.message);

    if (data.items && data.items.length > 0) {
      const videoList = data.items.map((item: any) => ({
        id: item.id.videoId,
        // Clean up weird HTML characters in YouTube titles
        title: item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&"),
        thumbnail: item.snippet.thumbnails.high.url,
        channel: item.snippet.channelTitle
      }));

      // 4. Save the new results to LocalStorage for next time
      localStorage.setItem(cacheKey, JSON.stringify({
        videos: videoList,
        timestamp: Date.now()
      }));

      return videoList;
    }

    // If API returns empty data, fallback safely.
    console.warn("⚠️ YouTube API returned no videos. Using fallback.");
    return CURATED_COURSES[careerTitle] || DEFAULT_FALLBACK;

  } catch (error) {
    console.error("YouTube API Error:", error);
    // 5. If the API crashes (quota exceeded, network error), gracefully fall back
    console.warn("⚠️ YouTube API failed. Switching to curated database.");
    return CURATED_COURSES[careerTitle] || DEFAULT_FALLBACK;
  }
};