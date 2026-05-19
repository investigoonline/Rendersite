import { useEffect } from "react";

const SITE_NAME = "IFS Wealth Management";

export function usePageTitle(pageTitle?: string) {
  useEffect(() => {
    document.title = pageTitle
      ? `${pageTitle} | ${SITE_NAME}`
      : SITE_NAME;
  }, [pageTitle]);
}
