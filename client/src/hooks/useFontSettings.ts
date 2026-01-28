import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { SiteSetting } from "@shared/schema";

export function useFontSettings() {
  const { data: fontSettings, isLoading } = useQuery<SiteSetting[]>({
    queryKey: ['/api/site-settings', 'font'],
    queryFn: async () => {
      const res = await fetch('/api/site-settings?type=font', { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (fontSettings && fontSettings.length > 0) {
      const root = document.documentElement;
      
      fontSettings.forEach((setting) => {
        switch (setting.settingKey) {
          case 'font_size_h1':
            root.style.setProperty('--font-size-h1', `${setting.settingValue}px`);
            break;
          case 'font_size_h2':
            root.style.setProperty('--font-size-h2', `${setting.settingValue}px`);
            break;
          case 'font_size_content':
            root.style.setProperty('--font-size-content', `${setting.settingValue}px`);
            break;
        }
      });
    }
  }, [fontSettings]);

  return { fontSettings, isLoading };
}
