// src/utils/youtubeService.ts

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const fetchCareerVideos = async (careerTitle: string) => {
  const cacheKey = `yt_cache_${careerTitle.replace(/\s+/g, '_').toLowerCase()}`;
  
  // 1. Check LocalStorage first
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    const { videos, timestamp } = JSON.parse(cachedData);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;
    
    if (!isExpired) {
      console.log("CACHE HIT: Loading videos from LocalStorage");
      return videos;
    }
  }

  // 2. If no cache or expired, call the Real API
  console.log("CACHE MISS: Calling YouTube API...");
  try {
    const query = encodeURIComponent(`${careerTitle} career roadmap masterclass 2026`);
    const response = await fetch(
      `${BASE_URL}?part=snippet&maxResults=4&q=${query}&type=video&key=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.error) throw new Error(data.error.message);

    const videoList = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      channel: item.snippet.channelTitle
    }));

    // 3. Save the new results to LocalStorage for next time
    localStorage.setItem(cacheKey, JSON.stringify({
      videos: videoList,
      timestamp: Date.now()
    }));

    return videoList;
  } catch (error) {
    console.error("YouTube API Error:", error);
    return [];
  }
};