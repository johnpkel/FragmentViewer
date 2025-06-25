/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Removes HTML tags from a string
 * @param html The HTML string to strip tags from
 * @returns A plain text string without HTML tags
 */
export const stripHtml = (html: any): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }
  return html.replace(/<[^>]*>/g, "");
};
