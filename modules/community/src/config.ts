export const BILIBILI_API_BASE = 'https://api.bilibili.com';
export const COMMUNITY_VIDEO_SOURCES = ['bilibili'] as const;
export type CommunityVideoSource = (typeof COMMUNITY_VIDEO_SOURCES)[number];
