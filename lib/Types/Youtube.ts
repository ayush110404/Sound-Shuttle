// YouTube Playlist Item List Response
interface YouTubePlaylistItemListResponse {
    kind: "youtube#playlistItemListResponse";
    etag: string;
    nextPageToken?: string;
    prevPageToken?: string;
    pageInfo: {
      totalResults: number;
      resultsPerPage: number;
    };
    items: YouTubePlaylistItem[];
  }
  
  // YouTube Playlist Item
  interface YouTubePlaylistItem {
    kind: "youtube#playlistItem";
    etag: string;
    id: string;
    snippet: {
      publishedAt: string; // ISO 8601 date-time string
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        [key: string]: {
          url: string;
          width: number;
          height: number;
        };
      };
      channelTitle: string;
      videoOwnerChannelTitle: string;
      videoOwnerChannelId: string;
      playlistId: string;
      position: number;
      resourceId: {
        kind: string;
        videoId: string;
      };
    };
    contentDetails?: {
      videoId: string;
      startAt?: string;
      endAt?: string;
      note?: string;
      videoPublishedAt: string; // ISO 8601 date-time string
    };
    status?: {
      privacyStatus: string;
    };
  }