// Client-side helper functions for SEO analysis

import { MetaTagStatus } from "@shared/schema";

/**
 * Returns the appropriate Tailwind CSS color class based on the tag status
 */
export function getStatusColorClass(status: MetaTagStatus): string {
  switch (status) {
    case "optimal":
    case "good":
      return "text-success";
    case "improve":
      return "text-warning";
    case "missing":
      return "text-danger";
    case "notApplicable":
      return "text-slate-400";
    default:
      return "text-slate-400";
  }
}

/**
 * Returns the appropriate background color class based on the tag status
 */
export function getStatusBgClass(status: MetaTagStatus): string {
  switch (status) {
    case "optimal":
    case "good":
      return "bg-success/20 text-success";
    case "improve":
      return "bg-warning/20 text-warning";
    case "missing":
      return "bg-danger/20 text-danger";
    case "notApplicable":
      return "bg-slate-200 text-slate-500";
    default:
      return "bg-slate-200 text-slate-500";
  }
}

/**
 * Returns the appropriate icon based on the tag status
 */
export function getStatusIcon(status: MetaTagStatus): string {
  switch (status) {
    case "optimal":
    case "good":
      return "check-circle";
    case "improve":
      return "exclamation-circle";
    case "missing":
      return "times-circle";
    case "notApplicable":
      return "minus-circle";
    default:
      return "question-circle";
  }
}

/**
 * Returns color classes for recommendation types
 */
export function getRecommendationColorClass(type: "critical" | "improvement" | "additional"): string {
  switch (type) {
    case "critical":
      return "text-danger";
    case "improvement":
      return "text-warning";
    case "additional":
      return "text-primary";
    default:
      return "text-slate-600";
  }
}

/**
 * Returns icon for recommendation types
 */
export function getRecommendationIcon(type: "critical" | "improvement" | "additional"): string {
  switch (type) {
    case "critical":
      return "times-circle";
    case "improvement":
      return "exclamation-circle";
    case "additional":
      return "info-circle";
    default:
      return "info-circle";
  }
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Normalizes a URL by adding https:// if missing
 */
export function normalizeUrl(url: string): string {
  if (!url) return '';
  url = url.trim();
  
  // If URL doesn't start with http:// or https://, add https://
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  
  return url;
}
