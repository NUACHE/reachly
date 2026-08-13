const TOKEN_URL = "https://oauth2.googleapis.com/token";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const API_BASE = "https://www.googleapis.com/youtube/v3";
const SCOPE = "https://www.googleapis.com/auth/youtube.readonly";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set — YouTube integration is not configured.`);
  return value;
}

export function buildYoutubeAuthUrl(redirectUri: string, state: string) {
  const params = new URLSearchParams({
    client_id: requireEnv("GOOGLE_CLIENT_ID"),
    redirect_uri: redirectUri,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: SCOPE,
    state,
  });
  return `${AUTH_URL}?${params.toString()}`;
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export async function exchangeCodeForTokens(code: string, redirectUri: string): Promise<TokenResponse> {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: requireEnv("GOOGLE_CLIENT_ID"),
      client_secret: requireEnv("GOOGLE_CLIENT_SECRET"),
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!response.ok) throw new Error(`Failed to exchange code for tokens: ${await response.text()}`);
  return response.json();
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: requireEnv("GOOGLE_CLIENT_ID"),
      client_secret: requireEnv("GOOGLE_CLIENT_SECRET"),
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!response.ok) throw new Error(`Failed to refresh access token: ${await response.text()}`);
  return response.json();
}

export interface YoutubeChannel {
  externalAccountId: string;
  username: string | null;
  displayName: string;
  followerCount: number;
}

export async function fetchYoutubeChannel(accessToken: string): Promise<YoutubeChannel> {
  const response = await fetch(`${API_BASE}/channels?part=snippet,statistics&mine=true`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error(`Failed to fetch YouTube channel: ${await response.text()}`);
  const data = await response.json();
  const channel = data.items?.[0];
  if (!channel) throw new Error("No YouTube channel found for this account.");

  return {
    externalAccountId: channel.id,
    username: channel.snippet?.customUrl ?? null,
    displayName: channel.snippet?.title ?? "YouTube Channel",
    followerCount: Number(channel.statistics?.subscriberCount ?? 0),
  };
}

export interface YoutubeVideo {
  externalPostId: string;
  title: string;
  description: string;
  url: string;
  postedAt: Date;
  views: number;
  likes: number;
  comments: number;
}

export async function fetchRecentYoutubeVideos(accessToken: string, maxResults = 10): Promise<YoutubeVideo[]> {
  const searchParams = new URLSearchParams({
    part: "id",
    forMine: "true",
    type: "video",
    order: "date",
    maxResults: String(maxResults),
  });
  const searchResponse = await fetch(`${API_BASE}/search?${searchParams.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!searchResponse.ok) throw new Error(`Failed to list YouTube videos: ${await searchResponse.text()}`);
  const searchData = await searchResponse.json();
  const videoIds = (searchData.items ?? []).map((item: { id: { videoId: string } }) => item.id.videoId).filter(Boolean);
  if (videoIds.length === 0) return [];

  const videosResponse = await fetch(`${API_BASE}/videos?part=snippet,statistics&id=${videoIds.join(",")}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!videosResponse.ok) throw new Error(`Failed to fetch YouTube video stats: ${await videosResponse.text()}`);
  const videosData = await videosResponse.json();

  return (videosData.items ?? []).map(
    (video: {
      id: string;
      snippet: { title: string; description?: string; publishedAt: string };
      statistics: { viewCount?: string; likeCount?: string; commentCount?: string };
    }) => ({
      externalPostId: video.id,
      title: video.snippet.title,
      description: video.snippet.description ?? "",
      url: `https://www.youtube.com/watch?v=${video.id}`,
      postedAt: new Date(video.snippet.publishedAt),
      views: Number(video.statistics.viewCount ?? 0),
      likes: Number(video.statistics.likeCount ?? 0),
      comments: Number(video.statistics.commentCount ?? 0),
    })
  );
}
