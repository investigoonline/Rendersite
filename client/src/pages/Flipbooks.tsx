import { useQuery } from "@tanstack/react-query";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { useDynamicImage } from "@/hooks/useDynamicImage";
import resourcesHeroDefault from "@assets/image_1765301156968.png";
import type { PageContent, ImageAsset } from "@shared/schema";

const flipbookDataFallback = [
  {
    id: "financial-management",
    title: "Financial Management Insight:",
    subtitle: "Strategies to Help Build Your Future",
    description: "The decisions you make about money form the basis for your financial future and can help you pursue your goals.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    bgColor: "from-purple-900 to-purple-700",
  },
  {
    id: "social-security",
    title: "Understanding Social Security and Medicare:",
    subtitle: "America's Retirement Safety Net",
    description: "Social Security and Medicare rules can be complex. To help maximize benefits, it pays to understand your options.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    bgColor: "from-teal-700 to-teal-500",
  },
  {
    id: "higher-education",
    title: "Higher Education:",
    subtitle: "College Saving and Funding Strategies",
    description: "College is an investment in your child's future. It requires a savings commitment and knowledge of funding methods.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    bgColor: "from-blue-600 to-blue-400",
  },
  {
    id: "investing-basics",
    title: "Investing Basics:",
    subtitle: "Embark on Your Wealth-Building Journey",
    description: "Weighing the risks and rewards of various investment options can help you develop a sound investment strategy.",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop",
    bgColor: "from-amber-700 to-amber-500",
  },
  {
    id: "tax-savvy",
    title: "Time to Get Tax-Savvy:",
    subtitle: "Managing Your Tax Burden",
    description: "Understanding tax rules and spotting tax-saving opportunities might help you put the money to better use.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
    bgColor: "from-yellow-600 to-yellow-400",
  },
  {
    id: "wealth-preservation",
    title: "Wealth Preservation:",
    subtitle: "Planning to Leave a Legacy",
    description: "An estate planning strategy could increase the value of your estate and help avoid potential conflicts and delays.",
    image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=300&fit=crop",
    bgColor: "from-emerald-700 to-emerald-500",
  },
  {
    id: "financial-protection",
    title: "Financial Protection:",
    subtitle: "Using Insurance to Help Manage Life's Risks",
    description: "Home, auto, life, disability — Protect your financial interests by having the appropriate insurance coverage.",
    image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=400&h=300&fit=crop",
    bgColor: "from-gray-700 to-gray-500",
  },
];

export default function Flipbooks() {
  usePageTitle("Flipbooks");
  const resourcesHeroImage = useDynamicImage("resources", "hero", resourcesHeroDefault);
  const flipbooksHeroImage = useDynamicImage("flipbooks", "hero", "");
  const heroImage = flipbooksHeroImage || resourcesHeroImage;

  const { data: flipbookContent } = useQuery<PageContent[]>({
    queryKey: ["/api/content", "flipbooks"],
    queryFn: async () => {
      const res = await fetch("/api/content?page=flipbooks", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: resourcesContent } = useQuery<PageContent[]>({
    queryKey: ["/api/content", "resources"],
    queryFn: async () => {
      const res = await fetch("/api/content?page=resources", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const flipbookHeader = flipbookContent?.find((c) => c.section === "flipbook_header")?.content as
    | { title: string; subtitle: string; description: string }
    | undefined;

  const resourcesFlipbookSection = resourcesContent?.find(
    (c) => c.section === "resources_flipbooks"
  )?.content as { name: string; description: string } | undefined;

  const headerTitle = flipbookHeader?.title || resourcesFlipbookSection?.name || "Flipbooks";
  const headerDescription = flipbookHeader?.description || resourcesFlipbookSection?.description ||
    "These magazine-style flipbooks provide helpful information on a variety of financial topics and illustrate key financial concepts. Select one of the flipbooks below and click the image to view it.";

  const cmsFlipbooks =
    flipbookContent
      ?.filter((c) => c.section === "flipbook_item")
      .map(
        (content) =>
          content.content as {
            title: string;
            subtitle: string;
            description: string;
            imageUrl: string;
            bgColor: string;
            sortOrder: number;
          }
      )
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)) || [];

  const displayFlipbooks = cmsFlipbooks.length > 0 ? cmsFlipbooks : flipbookDataFallback;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <section>
        <div className="hero-banner">
          <img src={heroImage} alt="Financial Flipbooks" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">Resources</Badge>
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {headerTitle}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto whitespace-pre-wrap">
            {headerDescription}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {displayFlipbooks.slice(0, 4).map((flipbook, index) => (
            <div key={`flipbook-${index}`} className="group cursor-pointer">
              <div
                className={`relative aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-gradient-to-br ${flipbook.bgColor} shadow-lg group-hover:shadow-xl transition-shadow`}
              >
                <div className="absolute inset-0 p-4 flex flex-col justify-center text-white">
                  <p className="text-xs font-medium opacity-90 mb-1">{flipbook.title}</p>
                  <p className="text-sm font-bold leading-tight">{flipbook.subtitle}</p>
                </div>
                <img
                  src={"imageUrl" in flipbook ? flipbook.imageUrl : (flipbook as any).image}
                  alt={flipbook.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {flipbook.title} <span className="font-normal">{flipbook.subtitle}</span>
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-3">{flipbook.description}</p>
            </div>
          ))}
        </div>

        {displayFlipbooks.length > 4 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:px-16">
            {displayFlipbooks.slice(4).map((flipbook, index) => (
              <div key={`flipbook-extra-${index}`} className="group cursor-pointer">
                <div
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-gradient-to-br ${flipbook.bgColor} shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <div className="absolute inset-0 p-4 flex flex-col justify-center text-white">
                    <p className="text-xs font-medium opacity-90 mb-1">{flipbook.title}</p>
                    <p className="text-sm font-bold leading-tight">{flipbook.subtitle}</p>
                  </div>
                  <img
                    src={"imageUrl" in flipbook ? flipbook.imageUrl : (flipbook as any).image}
                    alt={flipbook.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {flipbook.title} <span className="font-normal">{flipbook.subtitle}</span>
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-3">{flipbook.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
