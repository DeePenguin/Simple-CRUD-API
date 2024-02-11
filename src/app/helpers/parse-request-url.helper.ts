export const parseRequestUrl = (url?: string): string[] => {
  if (!url) {
    return []
  }

  return url.split('/').filter(Boolean)
}
