/**
 * Normalizes common image sharing URLs into directly embeddable image URLs.
 *
 * Supported sources:
 *  - Google Drive (drive.google.com/file/d/... or drive.google.com/open?id=...)
 *  - Dropbox (dropbox.com/... links, swaps dl=0 → raw=1)
 *  - OneDrive / SharePoint (converts /embed or appends ?download=1)
 *  - Imgur page links (imgur.com/XXXX → i.imgur.com/XXXX.jpg)
 *  - iCloud shared photos (no reliable direct-link transform — left as-is)
 *  - Already-direct URLs (*.jpg, *.png, etc.) are passed through unchanged.
 */

export function normalizeImageUrl(url: string | undefined): string | undefined {
  if (!url) return url;

  const trimmed = url.trim();
  if (!trimmed) return undefined;

  // --- Google Drive ---
  // Formats:
  //   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  //   https://drive.google.com/open?id=FILE_ID
  //   https://drive.google.com/uc?id=FILE_ID&export=view (already direct)
  const driveFileMatch = trimmed.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  );
  if (driveFileMatch) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  const driveOpenMatch = trimmed.match(
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/
  );
  if (driveOpenMatch) {
    return `https://lh3.googleusercontent.com/d/${driveOpenMatch[1]}`;
  }

  if (trimmed.includes('drive.google.com/uc')) {
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) {
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
    }
  }

  // --- Dropbox ---
  // Replace dl=0 with raw=1, or add raw=1 if no query param
  if (trimmed.includes('dropbox.com')) {
    let directUrl = trimmed.replace(/dl=0/, 'raw=1');
    if (!directUrl.includes('raw=1')) {
      directUrl += (directUrl.includes('?') ? '&' : '?') + 'raw=1';
    }
    return directUrl;
  }

  // --- OneDrive / SharePoint ---
  if (
    trimmed.includes('1drv.ms') ||
    trimmed.includes('onedrive.live.com') ||
    trimmed.includes('sharepoint.com')
  ) {
    if (!trimmed.includes('download=1')) {
      return trimmed + (trimmed.includes('?') ? '&' : '?') + 'download=1';
    }
    return trimmed;
  }

  // --- Imgur page URLs (not already i.imgur.com) ---
  const imgurPageMatch = trimmed.match(
    /^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]+)$/
  );
  if (imgurPageMatch) {
    return `https://i.imgur.com/${imgurPageMatch[1]}.jpg`;
  }

  return trimmed;
}
