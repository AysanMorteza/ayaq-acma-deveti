export interface MenuItem {
  category: string;
  persianCategory: string;
  items: {
    title: string;
    description: string;
    image: string;
    badge?: string;
  }[];
  description?: string;
  icon: string;
}

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  iconName: string;
  highlight?: boolean;
}

export interface CoupleStory {
  coupleTitle: string;
  groom: {
    name: string;
    title: string;
    note: string;
  };
  bride: {
    name: string;
    title: string;
    note: string;
  };
  quote: string;
  anniversaryNote: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  alt: string;
  caption: string;
}

export interface RsvpSubmission {
  id?: string;
  name: string;
  relationship?: string;
  attendance: "attending" | "declined";
  guestsCount: number;
  dietaryOrNote?: string;
  message?: string;
  phoneNumber?: string;
  createdAt: number;
  formattedDate?: string;
  likes?: number;
  isPinned?: boolean;
  pinnedAt?: number;
  pinnedOrder?: number;
  hostLiked?: boolean;
}
