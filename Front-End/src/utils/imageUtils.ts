// Utility functions for handling image loading and fallbacks

export const createFallbackImage = (width: number, height: number, text: string = 'No Image'): string => {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#F5B596"/>
      <path d="M${width/2} ${height/2}C${width/2} ${height/2 - 8} ${width/2 - 8} ${height/2 - 16} ${width/2 - 16} ${height/2 - 16}C${width/2 - 24} ${height/2 - 16} ${width/2 - 32} ${height/2 - 8} ${width/2 - 32} ${height/2}C${width/2 - 32} ${height/2 + 8} ${width/2 - 24} ${height/2 + 16} ${width/2 - 16} ${height/2 + 16}C${width/2 - 8} ${height/2 + 16} ${width/2} ${height/2 + 8} ${width/2} ${height/2}Z" fill="#FFFFFF"/>
      <text x="${width/2}" y="${height/2 + 30}" text-anchor="middle" fill="#FFFFFF" font-family="Arial" font-size="${Math.max(12, width/20)}">${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackText: string = 'No Image') => {
  const target = event.target as HTMLImageElement;
  
  // Prevent infinite loops by checking if we're already showing a fallback
  if (!target.src.includes('data:image/svg+xml') && !target.src.includes('placeholder')) {
    const rect = target.getBoundingClientRect();
    const width = Math.max(rect.width || 300, 80);
    const height = Math.max(rect.height || 200, 80);
    
    target.src = createFallbackImage(width, height, fallbackText);
  }
};

// Preload images to reduce loading errors
export const preloadImage = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};
