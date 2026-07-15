/**
 * Marketplace creator directory — the static fallback (ADR-04).
 *
 * The public /marketplace page and the admin creator CRUD read through
 * lib/creators.ts::listMarketplaceCreators(), which prefers DB records when
 * any exist and falls back to this array when none do. That means:
 *   - fresh install with no MONGODB_URI → this array is what shows publicly
 *   - MONGODB_URI set but no creators yet → same fallback (never empty)
 *   - admin publishes one creator → DB takes over completely
 *
 * Keep this in sync with what feels representative for the site's design;
 * once real creators are in the DB, this array can be trimmed to a
 * one-or-two "showcase" seed if desired.
 */

export const MARKETPLACE_FILTERS = [
  { value: 'all', label: 'All Creators' },
  { value: 'video', label: 'Video Editing' },
  { value: 'design', label: 'Graphic Design' },
  { value: 'motion', label: 'Motion Graphics' },
  { value: 'photo', label: 'Photography' },
  { value: 'copy', label: 'Copywriting' },
] as const;

export type CreatorCategory = 'video' | 'design' | 'motion' | 'photo' | 'copy';

export type MarketplaceCreator = {
  name: string;
  role: string;
  initial: string;
  bg: string;
  chips: string[];
  rate: string;
  rating: string;
  reviews: number;
  emoji: string;
  category: CreatorCategory;
};

export const seedCreators: MarketplaceCreator[] = [
  { name: 'Riya Ahmed', role: 'Video Editor & Content Creator', initial: 'R', bg: 'linear-gradient(135deg,#5e6ad2,#7c3aed)', chips: ['Reels', 'TikTok', 'Hooks'], rate: 'From ৳5,000', rating: '4.9', reviews: 48, emoji: '🎬', category: 'video' },
  { name: 'Sadia Islam', role: 'Motion Graphics Artist', initial: 'S', bg: 'linear-gradient(135deg,#ec4899,#7c3aed)', chips: ['After Effects', 'Logo Anim'], rate: 'From ৳8,000', rating: '5.0', reviews: 32, emoji: '✨', category: 'motion' },
  { name: 'Karim Hassan', role: 'Brand Designer', initial: 'K', bg: 'linear-gradient(135deg,#0ea5e9,#5e6ad2)', chips: ['Logos', 'Brand Kits', 'Social'], rate: 'From ৳3,500', rating: '4.8', reviews: 61, emoji: '🎨', category: 'design' },
  { name: 'Arif Hossain', role: 'Commercial Photographer', initial: 'A', bg: 'linear-gradient(135deg,#f59e0b,#ef4444)', chips: ['Products', 'Lifestyle', 'Events'], rate: 'From ৳8,000', rating: '4.9', reviews: 27, emoji: '📸', category: 'photo' },
  { name: 'Nusrat Jahan', role: 'UGC Creator & Presenter', initial: 'N', bg: 'linear-gradient(135deg,#10b981,#0ea5e9)', chips: ['UGC Ads', 'Reviews', 'Unboxing'], rate: 'From ৳4,000', rating: '4.7', reviews: 55, emoji: '🎥', category: 'video' },
  { name: 'Tahsin Rahman', role: 'Illustration & Digital Art', initial: 'T', bg: 'linear-gradient(135deg,#7c3aed,#ec4899)', chips: ['Illustration', 'Posters', 'Characters'], rate: 'From ৳4,500', rating: '4.9', reviews: 38, emoji: '🖌️', category: 'design' },
  { name: 'Fatima Akter', role: 'Copywriter & Content Strategist', initial: 'F', bg: 'linear-gradient(135deg,#5e6ad2,#10b981)', chips: ['Ad Copy', 'Bangla', 'Blogs'], rate: 'From ৳1,500', rating: '4.8', reviews: 72, emoji: '✍️', category: 'copy' },
  { name: 'Mehedi Hasan', role: '2D Animator & Motion Artist', initial: 'M', bg: 'linear-gradient(135deg,#ef4444,#f59e0b)', chips: ['Explainers', 'Ads', '2D Anim'], rate: 'From ৳10,000', rating: '4.9', reviews: 19, emoji: '🎞️', category: 'motion' },
];
