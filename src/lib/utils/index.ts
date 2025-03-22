import { ApolloError } from "@apollo/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);


export const checkIsLiked = (likeList: string[], userId: string) => {
  if (!likeList) return false;
  return likeList.includes(userId);
};

export const checkIsSaved = (saveList: string[], userId: string) => {
  if (!saveList) return false;
  return saveList.includes(userId);
};

export const apolloErrorHandler = (error: ApolloError) => {
  const mainError = error.message;
  
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const graphQLError = error.graphQLErrors[0];
    
    if (graphQLError.extensions?.code === 'BAD_USER_INPUT') {
      return graphQLError.message;
    }
    
    if (graphQLError.extensions?.code === 'UNAUTHENTICATED') {
      return "Authentication failed";
    }
    
    return graphQLError.message;
  }
  
  if (error.networkError) {
    return "Network error. Please check your connection";
  }
  return mainError;
};

/**
 * Converts a Mongoose timestamp to a formatted date string
 * @param timestamp - Mongoose timestamp (milliseconds since epoch) as string or number
 * @param format - Format type: 'full', 'date', 'time', 'dateTime', 'relative', or custom format string
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export function formatTimestamp(
  timestamp: string | number | Date, 
  format: 'full' | 'date' | 'time' | 'dateTime' | 'relative' | string = 'dateTime',
  locale: string = 'en-US'
): string {
  const date = timestamp instanceof Date 
    ? timestamp 
    : new Date(timestamp);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  // Handle predefined formats
  switch (format) {
    case 'full':
      // Example: Wednesday, July 3, 2024, 9:30:45 AM
      return date.toLocaleString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      });
      
    case 'date':
      // Example: 07/03/2024
      return date.toLocaleDateString(locale);
      
    case 'time':
      // Example: 9:30 AM
      return date.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
    case 'dateTime':
      // Example: 07/03/2024, 9:30 AM
      return date.toLocaleString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
    case 'relative':
      // Calculate relative time (e.g., "2 hours ago")
      return getRelativeTimeString(date);
      
    default:
      // Custom format handling
      // Simple format string parsing (e.g., 'YYYY-MM-DD')
      return formatCustomDate(date, format);
  }
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const diffInSeconds = diff / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;
  const diffInMonths = diffInDays / 30;
  const diffInYears = diffInDays / 365;

  switch (true) {
    case diffInSeconds < 60:
      return "Just now";
    case diffInMinutes < 60:
      const minutes = Math.floor(diffInMinutes);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    case diffInHours < 24:
      const hours = Math.floor(diffInHours);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    case diffInDays < 30:
      const days = Math.floor(diffInDays);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    case diffInMonths < 12:
      const months = Math.floor(diffInMonths);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    default:
      const years = Math.floor(diffInYears);
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
}

/**
 * Format date using a custom format string
 * Supports: YYYY, MM, DD, HH, mm, ss
 */
function formatCustomDate(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}
