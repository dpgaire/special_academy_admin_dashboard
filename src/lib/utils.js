import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateUniqueId() {
  return (
    Date.now().toString(36) +        // timestamp in base36
    Math.random().toString(36).substr(2, 9)  // random string
  );
}
