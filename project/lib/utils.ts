import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function formatFollowers(followers: number): string {
  if (followers >= 1000000) {
    return (followers / 1000000).toFixed(1) + 'M';
  }
  if (followers >= 1000) {
    return (followers / 1000).toFixed(1) + 'K';
  }
  return followers.toString();
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const categories = [
  'Fashion & Lifestyle',
  'Fitness & Health',
  'Food & Cooking',
  'Travel',
  'Technology',
  'Beauty & Skincare',
  'Gaming',
  'Entertainment',
  'Education',
  'Business & Finance',
  'Art & Creativity',
  'Sports',
  'Music',
  'Parenting',
  'Home & Garden',
];

export const platforms = [
  'Instagram',
  'YouTube',
  'TikTok',
  'Facebook',
];

export const services = [
  'Social Media Campaigns',
  'Product Launch',
  'Brand Ambassador',
  'Content Creation',
  'Event Coverage',
  'Sponsored Posts',
  'Video Content',
  'Reviews & Testimonials',
];

export const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Chandigarh',
  'Puducherry',
];