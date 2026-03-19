/**
 * @fileOverview Definiciones de tipos basadas en backend.json para BioLive.
 */

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  profilePictureUrl?: string;
  bio?: string;
  createdAt: any;
  updatedAt?: any;
}

export interface MediaItem {
  id: string;
  uploaderId: string;
  title: string;
  description?: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  type: 'REEL' | 'VIDEO' | 'LIVE_RECORDING';
  durationSeconds?: number;
  viewsCount?: number;
  likesCount?: number;
  commentsCount?: number;
  createdAt: any;
  updatedAt?: any;
}

export interface LiveStream {
  id: string;
  broadcasterId: string;
  title: string;
  description?: string;
  streamUrl: string;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED';
  startedAt: any;
  endedAt?: any;
  peakViewerCount?: number;
  recordedMediaItemId?: string;
}

export interface Comment {
  id: string;
  mediaItemId: string;
  userId: string;
  content: string;
  createdAt: any;
  updatedAt?: any;
  parentId?: string;
  moderationStatus?: string;
}
