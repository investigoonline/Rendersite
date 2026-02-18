import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { SiteSetting } from "@shared/schema";

export function useFontSettings() {
  const { data: globalFontSettings } = useQuery<SiteSetting[]>({
    queryKey: ['/api/site-settings', 'font'],
    queryFn: async () => {
      const res = await fetch('/api/site-settings?type=font', { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const root = document.documentElement;

    let h1Size = '22.5';
    let h2Size = '16.5';
    let contentSize = '13.5';

    if (globalFontSettings && globalFontSettings.length > 0) {
      globalFontSettings.forEach((setting) => {
        switch (setting.settingKey) {
          case 'font_size_h1':
            h1Size = setting.settingValue;
            break;
          case 'font_size_h2':
            h2Size = setting.settingValue;
            break;
          case 'font_size_content':
            contentSize = setting.settingValue;
            break;
        }
      });
    }

    root.style.setProperty('--font-size-h1', `${h1Size}px`);
    root.style.setProperty('--font-size-h2', `${h2Size}px`);
    root.style.setProperty('--font-size-content', `${contentSize}px`);
  }, [globalFontSettings]);

  return { globalFontSettings };
}
