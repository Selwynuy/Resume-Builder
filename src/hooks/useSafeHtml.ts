import { useMemo } from 'react'
import { sanitizeHtml } from '@/lib/security'

/**
 * Hook for safely sanitizing HTML content before rendering
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML string safe for dangerouslySetInnerHTML
 */
export const useSafeHtml = (html: string) => {
  return useMemo(() => {
    if (!html) return ''
    return sanitizeHtml(html)
  }, [html])
} 