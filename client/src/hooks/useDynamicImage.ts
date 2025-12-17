import { useQuery } from "@tanstack/react-query";
import type { ImageAsset } from "@shared/schema";

export function useDynamicImage(page: string, section: string, fallbackImage: string): string {
  const { data: images } = useQuery<ImageAsset[]>({
    queryKey: ['/api/images'],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const res = await fetch('/api/images', { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const dynamicImage = images?.find(img => img.page === page && img.section === section);
  return dynamicImage?.filePath || fallbackImage;
}
