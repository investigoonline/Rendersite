import { z } from "zod";

// UI Control types
export type UIControl = 'text' | 'textarea' | 'richtext' | 'number' | 'select' | 'radio' | 'switch' | 'icon' | 'color';

export interface UIFieldMeta {
  label: string;
  control: UIControl;
  placeholder?: string;
  help?: string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  rows?: number;
}

export interface SectionSchema {
  schema: z.ZodType<any>;
  uiMeta: Record<string, UIFieldMeta>;
  label: string;
  description: string;
  allowMultiple?: boolean;
}

// Icon options from lucide-react
export const iconOptions = [
  { label: 'Target', value: 'Target' },
  { label: 'Shield', value: 'Shield' },
  { label: 'Briefcase', value: 'Briefcase' },
  { label: 'Users', value: 'Users' },
  { label: 'TrendingUp', value: 'TrendingUp' },
  { label: 'Wallet', value: 'Wallet' },
  { label: 'Globe', value: 'Globe' },
  { label: 'Map Pin', value: 'MapPin' },
  { label: 'Phone', value: 'Phone' },
  { label: 'Mail', value: 'Mail' },
  { label: 'File Text', value: 'FileText' },
  { label: 'Video', value: 'Video' },
  { label: 'Book', value: 'Book' },
  { label: 'Help Circle', value: 'HelpCircle' },
  { label: 'Calculator', value: 'Calculator' },
  { label: 'Database', value: 'Database' },
  { label: 'Check Circle', value: 'CheckCircle' },
  { label: 'Dollar Sign', value: 'DollarSign' },
  { label: 'Percent', value: 'Percent' },
  { label: 'PiggyBank', value: 'PiggyBank' },
  { label: 'Clock', value: 'Clock' },
  { label: 'Calendar', value: 'Calendar' },
  { label: 'Message Circle', value: 'MessageCircle' },
  { label: 'Building', value: 'Building' },
  { label: 'Car', value: 'Car' },
  { label: 'Pie Chart', value: 'PieChart' },
  { label: 'Credit Card', value: 'CreditCard' },
];

// Color options
export const colorOptions = [
  { label: 'Primary', value: 'text-primary' },
  { label: 'Secondary', value: 'text-secondary' },
  { label: 'Blue', value: 'text-blue-600' },
  { label: 'Green', value: 'text-green-600' },
  { label: 'Purple', value: 'text-purple-600' },
  { label: 'Orange', value: 'text-orange-600' },
  { label: 'Red', value: 'text-red-600' },
];

// Home Page Schemas
const homeHeroSchema = z.object({
  badge1: z.string().min(1).max(100),
  badge1Icon: z.string().min(1),
  badge2: z.string().min(1).max(100),
  badge2Icon: z.string().min(1),
  titlePart1: z.string().min(1).max(100),
  titleHighlight: z.string().min(1).max(100),
  titlePart2: z.string().min(1).max(100),
  subtitle: z.string().min(1).max(500),
  primaryCTA: z.string().min(1).max(50),
  secondaryCTA: z.string().min(1).max(50),
});

const homeStatsItemSchema = z.object({
  value: z.string().min(1).max(50),
  label: z.string().min(1).max(100),
});

const homeStatsSchema = z.object({
  stats: z.array(homeStatsItemSchema).min(3).max(3),
});

const homePortfolioSchema = z.object({
  title: z.string().min(1).max(100),
  growthPercent: z.string().min(1).max(20),
  totalNetWorth: z.string().min(1).max(50),
  monthlyIncome: z.string().min(1).max(50),
  debtRatio: z.string().min(1).max(20),
});

// Services Page Schemas
const serviceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100),
  icon: z.string().min(1),
  description: z.string().min(1),
  features: z.array(z.string()).min(1).max(10),
  color: z.string().min(1),
});

// Contact Page Schemas
const contactMethodSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1).max(100),
  content: z.array(z.string()).min(1).max(5),
  color: z.string().min(1),
});

const contactFormHeaderSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
});

const quickActionSchema = z.object({
  icon: z.string().min(1),
  label: z.string().min(1).max(100),
});

const contactQuickActionsSchema = z.object({
  title: z.string().min(1).max(100),
  actions: z.array(quickActionSchema).min(1).max(5),
});

const supportFeatureSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1),
});

const contactSupportFeaturesSchema = z.object({
  title: z.string().min(1).max(100),
  features: z.array(supportFeatureSchema).min(1).max(5),
});

const businessHoursSchema = z.object({
  title: z.string().min(1).max(100),
  monday_friday: z.string().min(1).max(100),
  saturday: z.string().min(1).max(100),
  sunday: z.string().min(1).max(100),
  emergency: z.string().min(1).max(100),
});

const officeInfoItemSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1).max(100),
  details: z.array(z.string()).min(1).max(5),
});

const contactOfficeInfoSchema = z.object({
  title: z.string().min(1).max(100),
  items: z.array(officeInfoItemSchema).min(1).max(5),
});

const clientSectionSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  benefits: z.array(z.string()).min(1).max(10),
  buttonText: z.string().min(1).max(50),
});

// Resources Page Schemas
const resourceTypeSchema = z.object({
  id: z.string().min(1).refine(
    (val) => ['article', 'video', 'newsletter', 'flipbook', 'faq'].includes(val),
    { message: 'Resource ID must be one of: article, video, newsletter, flipbook, faq (lowercase)' }
  ),
  name: z.string().min(1).max(100),
  icon: z.string().min(1),
  description: z.string().min(1),
  showBadge: z.boolean().default(true),
  badgeText: z.string().optional(),
});

// Footer Schemas
const footerLinksSchema = z.object({
  title: z.string().min(1).max(100),
  links: z.array(z.object({
    label: z.string().min(1).max(100),
    href: z.string().min(1).max(200),
  })).min(1).max(10),
});

const footerCompanyDetailsSchema = z.object({
  name: z.string().min(1).max(200),
  tagline: z.string().min(1).max(300),
  address: z.string().min(1).max(300),
  phone: z.string().min(1).max(50),
  email: z.string().email().max(100),
  linkedinUrl: z.string().max(500).optional().or(z.literal('')),
  twitterUrl: z.string().max(500).optional().or(z.literal('')),
  facebookUrl: z.string().max(500).optional().or(z.literal('')),
});

// Page Header Schemas
const pageHeaderSchema = z.object({
  badge: z.string().min(1).max(50).optional(),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
});

// Services Stats Schema
const servicesStatsSchema = z.object({
  stats: z.array(z.object({
    icon: z.string().min(1),
    value: z.string().min(1).max(50),
    label: z.string().min(1).max(100),
  })).length(4),
});

// Services Process Schema
const servicesProcessSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  steps: z.array(z.object({
    title: z.string().min(1).max(50),
    description: z.string().min(1),
  })).length(4),
});

// Services Why Choose Schema
const servicesWhyChooseSchema = z.object({
  title: z.string().min(1).max(100),
  reasons: z.array(z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1),
  })).min(3).max(6),
});

// Services Commitment Schema
const servicesCommitmentSchema = z.object({
  title: z.string().min(1).max(100),
  commitments: z.array(z.object({
    label: z.string().min(1).max(100),
    value: z.string().min(1).max(50),
  })).min(3).max(10),
});

// Services CTA Schema
const servicesCtaSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().min(1),
  primaryButtonText: z.string().min(1).max(50),
  primaryButtonHref: z.string().min(1).max(200),
  secondaryButtonText: z.string().min(1).max(50),
  secondaryButtonHref: z.string().min(1).max(200),
});

// Contact Form Fields Schema
const contactFormFieldsSchema = z.object({
  nameLabel: z.string().min(1).max(50),
  namePlaceholder: z.string().min(1).max(100),
  emailLabel: z.string().min(1).max(50),
  emailPlaceholder: z.string().min(1).max(100),
  phoneLabel: z.string().min(1).max(50),
  phonePlaceholder: z.string().min(1).max(100),
  contactMethodLabel: z.string().min(1).max(50),
  subjectLabel: z.string().min(1).max(50),
  messageLabel: z.string().min(1).max(50),
  messagePlaceholder: z.string().min(1).max(200),
  submitButtonText: z.string().min(1).max(50),
  successTitle: z.string().min(1).max(100),
  successMessage: z.string().min(1).max(200),
});

// Resources Additional Section Schemas
const resourcesBecomeClientSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  benefits: z.array(z.string()).min(1).max(10),
  buttonText: z.string().min(1).max(50),
  buttonHref: z.string().min(1).max(200),
});

const resourcesNeedHelpSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  actions: z.array(z.object({
    icon: z.string().min(1),
    label: z.string().min(1).max(50),
    href: z.string().min(1).max(200),
  })).min(1).max(5),
});

// Home Quick Actions Schema
const homeQuickActionsSchema = z.object({
  actions: z.array(z.object({
    icon: z.string().min(1),
    title: z.string().min(1).max(100),
    description: z.string().min(1),
    href: z.string().min(1).max(200),
    color: z.string().min(1),
  })).min(1).max(6),
});

// Home Calculators Schema
const homeCalculatorsSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  calculators: z.array(z.object({
    icon: z.string().min(1),
    title: z.string().min(1).max(100),
    description: z.string().min(1),
    href: z.string().min(1).max(200),
    color: z.string().min(1),
  })).min(1).max(6),
});

// Home Calculator Categories Schema
const homeCalculatorCategoriesSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().min(1).max(500),
  categories: z.array(z.object({
    id: z.string().min(1),
    title: z.string().min(1).max(100),
    icon: z.string().min(1),
    description: z.string().min(1),
    calculators: z.array(z.string()).min(1).max(5),
  })).min(1).max(10),
});

// Blog Page Schemas
const blogHeaderSchema = z.object({
  badge: z.string().min(1).max(50).optional(),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
});

const blogFeaturedSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
});

const blogCategoriesSchema = z.object({
  title: z.string().min(1).max(100),
  categories: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1).max(50),
    description: z.string().min(1),
    count: z.number().min(0).optional(),
  })).min(1).max(10),
});

const blogCtaSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().min(1),
  primaryButtonText: z.string().min(1).max(50),
  primaryButtonHref: z.string().min(1).max(200),
  secondaryButtonText: z.string().min(1).max(50),
  secondaryButtonHref: z.string().min(1).max(200),
});

// Dashboard Schemas
const dashboardHeaderSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
});

const dashboardStatsSchema = z.object({
  stats: z.array(z.object({
    label: z.string().min(1).max(100),
    icon: z.string().min(1),
    color: z.string().min(1),
  })).length(4),
});

const dashboardUserDistributionSchema = z.object({
  title: z.string().min(1).max(100),
  guestLabel: z.string().min(1).max(100),
  clientsLabel: z.string().min(1).max(100),
  totalLabel: z.string().min(1).max(100),
});

const dashboardEngagementSchema = z.object({
  title: z.string().min(1).max(100),
  calculationsLabel: z.string().min(1).max(100),
  resourcesLabel: z.string().min(1).max(100),
  avgLabel: z.string().min(1).max(100),
});

const dashboardSystemStatusSchema = z.object({
  title: z.string().min(1).max(100),
  databaseLabel: z.string().min(1).max(100),
  apiLabel: z.string().min(1).max(100),
  statusLabel: z.string().min(1).max(100),
  healthyBadge: z.string().min(1).max(50),
  onlineBadge: z.string().min(1).max(50),
  operationalBadge: z.string().min(1).max(50),
});

// About Page Schemas
const aboutHeaderSchema = z.object({
  badge: z.string().min(1).max(50),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
});

const aboutStatsSchema = z.object({
  stats: z.array(z.object({
    icon: z.string().min(1),
    value: z.string().min(1).max(50),
    label: z.string().min(1).max(100),
    color: z.string().min(1),
  })).length(4),
});

const aboutStorySchema = z.object({
  title: z.string().min(1).max(100),
  paragraphs: z.array(z.string().min(1).max(1000)).min(1).max(5),
});

const aboutMissionVisionSchema = z.object({
  title: z.string().min(1).max(100),
  missionTitle: z.string().min(1).max(100),
  missionText: z.string().min(1).max(500),
  missionIcon: z.string().min(1),
  approachTitle: z.string().min(1).max(100),
  approachText: z.string().min(1).max(500),
  approachIcon: z.string().min(1),
  visionTitle: z.string().min(1).max(100),
  visionText: z.string().min(1).max(500),
  visionIcon: z.string().min(1),
});

const aboutValuesSchema = z.object({
  title: z.string().min(1).max(100),
  values: z.array(z.object({
    icon: z.string().min(1),
    title: z.string().min(1).max(100),
    description: z.string().min(1),
  })).length(4),
});

const aboutLeadershipSchema = z.object({
  title: z.string().min(1).max(100),
  leaders: z.array(z.object({
    name: z.string().min(1).max(100),
    title: z.string().min(1).max(100),
    description: z.string().min(1),
  })).min(1).max(10),
});

const aboutHeadquartersSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1).max(100),
  subtitle: z.string().min(1).max(200),
  description: z.string().min(1),
});

const aboutInnovationSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  features: z.array(z.string().min(1).max(200)).min(1).max(10),
});

const aboutSecuritySchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  features: z.array(z.string().min(1).max(200)).min(1).max(10),
});

const aboutCtaSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  primaryButtonText: z.string().min(1).max(50),
  primaryButtonHref: z.string().min(1).max(200),
  secondaryButtonText: z.string().min(1).max(50),
  secondaryButtonHref: z.string().min(1).max(200),
});

// UI Metadata for each schema
export const contentSchemas: Record<string, SectionSchema> = {
  home_hero: {
    schema: homeHeroSchema,
    label: 'Hero Section',
    description: 'Main hero section with badges, styled title, subtitle, and call-to-action buttons',
    uiMeta: {
      badge1: {
        label: 'First Badge Text',
        control: 'text',
        placeholder: 'AI-Powered Platform',
      },
      badge1Icon: {
        label: 'First Badge Icon',
        control: 'icon',
      },
      badge2: {
        label: 'Second Badge Text',
        control: 'text',
        placeholder: '32+ Calculators',
      },
      badge2Icon: {
        label: 'Second Badge Icon',
        control: 'icon',
      },
      titlePart1: {
        label: 'Title Part 1 (before highlight)',
        control: 'text',
        placeholder: 'Your Complete',
      },
      titleHighlight: {
        label: 'Title Highlighted Part (blue)',
        control: 'text',
        placeholder: 'Financial Intelligence',
      },
      titlePart2: {
        label: 'Title Part 2 (after highlight)',
        control: 'text',
        placeholder: 'Platform',
      },
      subtitle: {
        label: 'Subtitle',
        control: 'textarea',
        rows: 4,
        placeholder: 'Comprehensive financial planning tools, AI-driven insights, and personalized recommendations...',
      },
      primaryCTA: {
        label: 'Primary Button Text',
        control: 'text',
        placeholder: 'Start Free Trial',
      },
      secondaryCTA: {
        label: 'Secondary Button Text',
        control: 'text',
        placeholder: 'Explore Calculators',
      },
    },
  },
  home_stats: {
    schema: homeStatsSchema,
    label: 'Statistics Cards',
    description: 'Key statistics displayed on the home page',
    allowMultiple: false,
    uiMeta: {
      stats: {
        label: 'Statistics',
        control: 'text', // This will be handled specially as array
      },
    },
  },
  home_portfolio: {
    schema: homePortfolioSchema,
    label: 'Portfolio Overview',
    description: 'Portfolio summary card showing financial metrics',
    uiMeta: {
      title: {
        label: 'Card Title',
        control: 'text',
        placeholder: 'Portfolio Overview',
      },
      growthPercent: {
        label: 'Growth Percentage',
        control: 'text',
        placeholder: '+12.4%',
      },
      totalNetWorth: {
        label: 'Total Net Worth',
        control: 'text',
        placeholder: '$1,247,832',
      },
      monthlyIncome: {
        label: 'Monthly Income',
        control: 'text',
        placeholder: '$8,450',
      },
      debtRatio: {
        label: 'Debt Ratio',
        control: 'text',
        placeholder: '18.2%',
      },
    },
  },
  home_wealth_creation: {
    schema: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      imageUrl: z.string().optional(),
    }),
    label: 'Wealth Creation Block',
    description: 'Wealth Creation pillar content block for landing page',
    uiMeta: {
      title: {
        label: 'Block Title',
        control: 'text',
        placeholder: 'Wealth Creation',
      },
      description: {
        label: 'Block Content',
        control: 'textarea',
        rows: 4,
        placeholder: 'Enter description for Wealth Creation...',
      },
      imageUrl: {
        label: 'Image URL',
        control: 'text',
        placeholder: '/api/storage/hero-images/wealth-creation.png',
        help: 'Upload image via Hero Images tab, then paste the URL here',
      },
    },
  },
  home_wealth_protection: {
    schema: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      imageUrl: z.string().optional(),
    }),
    label: 'Wealth Protection Block',
    description: 'Wealth Protection pillar content block for landing page',
    uiMeta: {
      title: {
        label: 'Block Title',
        control: 'text',
        placeholder: 'Wealth Protection',
      },
      description: {
        label: 'Block Content',
        control: 'textarea',
        rows: 4,
        placeholder: 'Enter description for Wealth Protection...',
      },
      imageUrl: {
        label: 'Image URL',
        control: 'text',
        placeholder: '/api/storage/hero-images/wealth-protection.png',
        help: 'Upload image via Hero Images tab, then paste the URL here',
      },
    },
  },
  home_wealth_preservation: {
    schema: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      imageUrl: z.string().optional(),
    }),
    label: 'Wealth Preservation Block',
    description: 'Wealth Preservation pillar content block for landing page',
    uiMeta: {
      title: {
        label: 'Block Title',
        control: 'text',
        placeholder: 'Wealth Preservation',
      },
      description: {
        label: 'Block Content',
        control: 'textarea',
        rows: 4,
        placeholder: 'Enter description for Wealth Preservation...',
      },
      imageUrl: {
        label: 'Image URL',
        control: 'text',
        placeholder: '/api/storage/hero-images/wealth-preservation.png',
        help: 'Upload image via Hero Images tab, then paste the URL here',
      },
    },
  },
  home_wealth_transfer: {
    schema: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      imageUrl: z.string().optional(),
    }),
    label: 'Wealth Transfer & Legacy Block',
    description: 'Wealth Transfer & Legacy pillar content block for landing page',
    uiMeta: {
      title: {
        label: 'Block Title',
        control: 'text',
        placeholder: 'Wealth Transfer & Legacy',
      },
      description: {
        label: 'Block Content',
        control: 'textarea',
        rows: 4,
        placeholder: 'Enter description for Wealth Transfer & Legacy...',
      },
      imageUrl: {
        label: 'Image URL',
        control: 'text',
        placeholder: '/api/storage/hero-images/wealth-transfer.png',
        help: 'Upload image via Hero Images tab, then paste the URL here',
      },
    },
  },
  services_investment: {
    schema: serviceSchema,
    label: 'Investment Advisory Service',
    description: 'Investment advisory service details',
    allowMultiple: true,
    uiMeta: {
      id: {
        label: 'Service ID',
        control: 'text',
        placeholder: 'investment',
      },
      title: {
        label: 'Service Title',
        control: 'text',
        placeholder: 'Investment Advisory',
      },
      icon: {
        label: 'Icon',
        control: 'select',
        options: iconOptions,
      },
      description: {
        label: 'Description',
        control: 'textarea',
        rows: 3,
        placeholder: 'Comprehensive investment strategies...',
      },
      features: {
        label: 'Key Features',
        control: 'text', // Array handled specially
      },
      color: {
        label: 'Color Theme',
        control: 'select',
        options: colorOptions,
      },
    },
  },
  services_strategic: {
    schema: serviceSchema,
    label: 'Strategic Financial Planning',
    description: 'Strategic planning service details',
    allowMultiple: true,
    uiMeta: {
      id: { label: 'Service ID', control: 'text', placeholder: 'strategic' },
      title: { label: 'Service Title', control: 'text', placeholder: 'Strategic Planning' },
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      description: { label: 'Description', control: 'richtext' },
      features: { label: 'Key Features', control: 'text' },
      color: { label: 'Color Theme', control: 'select', options: colorOptions },
    },
  },
  services_legacy: {
    schema: serviceSchema,
    label: 'Legacy & Estate Planning',
    description: 'Legacy planning service details',
    allowMultiple: true,
    uiMeta: {
      id: { label: 'Service ID', control: 'text', placeholder: 'legacy' },
      title: { label: 'Service Title', control: 'text', placeholder: 'Legacy Planning' },
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      description: { label: 'Description', control: 'richtext' },
      features: { label: 'Key Features', control: 'text' },
      color: { label: 'Color Theme', control: 'select', options: colorOptions },
    },
  },
  services_risk: {
    schema: serviceSchema,
    label: 'Risk Management',
    description: 'Risk management service details',
    allowMultiple: true,
    uiMeta: {
      id: { label: 'Service ID', control: 'text', placeholder: 'risk' },
      title: { label: 'Service Title', control: 'text', placeholder: 'Risk Management' },
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      description: { label: 'Description', control: 'richtext' },
      features: { label: 'Key Features', control: 'text' },
      color: { label: 'Color Theme', control: 'select', options: colorOptions },
    },
  },
  services_special: {
    schema: serviceSchema,
    label: 'Special Situations',
    description: 'Special situations service details',
    allowMultiple: true,
    uiMeta: {
      id: { label: 'Service ID', control: 'text', placeholder: 'special' },
      title: { label: 'Service Title', control: 'text', placeholder: 'Special Situations' },
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      description: { label: 'Description', control: 'richtext' },
      features: { label: 'Key Features', control: 'text' },
      color: { label: 'Color Theme', control: 'select', options: colorOptions },
    },
  },
  services_aggregation: {
    schema: serviceSchema,
    label: 'Account Aggregation',
    description: 'Account aggregation service details',
    allowMultiple: true,
    uiMeta: {
      id: { label: 'Service ID', control: 'text', placeholder: 'aggregation' },
      title: { label: 'Service Title', control: 'text', placeholder: 'Account Aggregation' },
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      description: { label: 'Description', control: 'richtext' },
      features: { label: 'Key Features', control: 'text' },
      color: { label: 'Color Theme', control: 'select', options: colorOptions },
    },
  },
  contact_office: {
    schema: contactMethodSchema,
    label: 'Office Location',
    description: 'Office location contact information',
    uiMeta: {
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      title: { label: 'Title', control: 'text', placeholder: 'Office Location' },
      content: { label: 'Content Lines', control: 'text' },
      color: { label: 'Color Theme', control: 'select', options: colorOptions },
    },
  },
  contact_phone: {
    schema: contactMethodSchema,
    label: 'Phone Contact',
    description: 'Phone contact information',
    uiMeta: {
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      title: { label: 'Title', control: 'text', placeholder: 'Phone Contact' },
      content: { label: 'Content Lines', control: 'text' },
      color: { label: 'Color Theme', control: 'select', options: colorOptions },
    },
  },
  contact_email: {
    schema: contactMethodSchema,
    label: 'Email Contact',
    description: 'Email contact information',
    uiMeta: {
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      title: { label: 'Title', control: 'text', placeholder: 'Email Contact' },
      content: { label: 'Content Lines', control: 'text' },
      color: { label: 'Color Theme', control: 'select', options: colorOptions },
    },
  },
  contact_form_header: {
    schema: contactFormHeaderSchema,
    label: 'Contact Form Header',
    description: 'Header text for the contact form section',
    uiMeta: {
      title: { label: 'Form Title', control: 'text', placeholder: 'Send us a Message' },
      description: { label: 'Form Description', control: 'richtext', placeholder: 'Fill out the form...' },
    },
  },
  contact_form_fields: {
    schema: contactFormFieldsSchema,
    label: 'Contact Form Fields',
    description: 'Customize form field labels, placeholders, and messages',
    uiMeta: {
      nameLabel: { label: 'Name Field Label', control: 'text', placeholder: 'Full Name *' },
      namePlaceholder: { label: 'Name Field Placeholder', control: 'text', placeholder: 'Enter your full name' },
      emailLabel: { label: 'Email Field Label', control: 'text', placeholder: 'Email Address *' },
      emailPlaceholder: { label: 'Email Field Placeholder', control: 'text', placeholder: 'Enter your email address' },
      phoneLabel: { label: 'Phone Field Label', control: 'text', placeholder: 'Phone Number (Optional)' },
      phonePlaceholder: { label: 'Phone Field Placeholder', control: 'text', placeholder: 'Enter your phone number' },
      contactMethodLabel: { label: 'Contact Method Label', control: 'text', placeholder: 'Preferred Contact Method' },
      subjectLabel: { label: 'Subject Field Label', control: 'text', placeholder: 'Subject *' },
      messageLabel: { label: 'Message Field Label', control: 'text', placeholder: 'Your Message *' },
      messagePlaceholder: { label: 'Message Field Placeholder', control: 'textarea', rows: 2, placeholder: 'Tell us how we can help...' },
      submitButtonText: { label: 'Submit Button Text', control: 'text', placeholder: 'Send Message' },
      successTitle: { label: 'Success Message Title', control: 'text', placeholder: 'Message Sent Successfully' },
      successMessage: { label: 'Success Message Text', control: 'text', placeholder: 'Thank you for contacting us. We\'ll get back to you within 24 hours.' },
    },
  },
  contact_quick_actions: {
    schema: contactQuickActionsSchema,
    label: 'Quick Actions',
    description: 'Quick action buttons for contact page',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Quick Actions' },
      actions: { label: 'Action Buttons', control: 'text' },
    },
  },
  contact_support_features: {
    schema: contactSupportFeaturesSchema,
    label: 'Support Features',
    description: 'Why choose our support section',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Why Choose Our Support' },
      features: { label: 'Features', control: 'text' },
    },
  },
  contact_business_hours: {
    schema: businessHoursSchema,
    label: 'Business Hours',
    description: 'Business hours information',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Business Hours' },
      monday_friday: { label: 'Monday-Friday', control: 'text', placeholder: '8:00 AM - 6:00 PM EST' },
      saturday: { label: 'Saturday', control: 'text', placeholder: '9:00 AM - 2:00 PM EST' },
      sunday: { label: 'Sunday', control: 'text', placeholder: 'Closed' },
      emergency: { label: 'Emergency Support', control: 'text', placeholder: '24/7' },
    },
  },
  contact_office_info: {
    schema: contactOfficeInfoSchema,
    label: 'Office Information',
    description: 'Detailed office location and global presence',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Office Information' },
      items: { label: 'Office Items', control: 'text' },
    },
  },
  contact_prospective_clients: {
    schema: clientSectionSchema,
    label: 'Prospective Clients Section',
    description: 'Information for prospective clients',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'For Prospective Clients' },
      description: { label: 'Description', control: 'richtext' },
      benefits: { label: 'Benefits List', control: 'text' },
      buttonText: { label: 'Button Text', control: 'text', placeholder: 'Schedule Free Consultation' },
    },
  },
  contact_current_clients: {
    schema: clientSectionSchema,
    label: 'Current Clients Section',
    description: 'Information for current clients',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'For Current Clients' },
      description: { label: 'Description', control: 'richtext' },
      benefits: { label: 'Benefits List', control: 'text' },
      buttonText: { label: 'Button Text', control: 'text', placeholder: 'Access Client Portal' },
    },
  },
  resources_articles: {
    schema: resourceTypeSchema,
    label: 'Articles Resource Type',
    description: 'Articles resource type description',
    allowMultiple: true,
    uiMeta: {
      id: { label: 'Resource ID', control: 'text', placeholder: 'article', help: 'Must be lowercase: article, video, newsletter, flipbook, or faq' },
      name: { label: 'Resource Name', control: 'text', placeholder: 'Articles' },
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      description: { label: 'Description', control: 'richtext' },
      showBadge: { label: 'Show Badge', control: 'switch', help: 'Display badge above the heading' },
      badgeText: { label: 'Badge Text', control: 'richtext', placeholder: 'Articles', help: 'Custom badge text with formatting (uses Resource Name if empty)' },
    },
  },
  resources_videos: {
    schema: resourceTypeSchema,
    label: 'Videos Resource Type',
    description: 'Videos resource type description',
    uiMeta: {
      id: { label: 'Resource ID', control: 'text', placeholder: 'video' },
      name: { label: 'Resource Name', control: 'text', placeholder: 'Videos' },
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      description: { label: 'Description', control: 'richtext' },
      showBadge: { label: 'Show Badge', control: 'switch', help: 'Display badge above the heading' },
      badgeText: { label: 'Badge Text', control: 'richtext', placeholder: 'Videos', help: 'Custom badge text with formatting (uses Resource Name if empty)' },
    },
  },
  resources_newsletters: {
    schema: resourceTypeSchema,
    label: 'Newsletters Resource Type',
    description: 'Newsletters resource type description',
    uiMeta: {
      id: { label: 'Resource ID', control: 'text', placeholder: 'newsletter' },
      name: { label: 'Resource Name', control: 'text', placeholder: 'Newsletters' },
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      description: { label: 'Description', control: 'richtext' },
      showBadge: { label: 'Show Badge', control: 'switch', help: 'Display badge above the heading' },
      badgeText: { label: 'Badge Text', control: 'richtext', placeholder: 'Newsletters', help: 'Custom badge text with formatting (uses Resource Name if empty)' },
    },
  },
  resources_flipbooks: {
    schema: resourceTypeSchema,
    label: 'Flipbooks Resource Type',
    description: 'Flipbooks resource type description',
    uiMeta: {
      id: { label: 'Resource ID', control: 'text', placeholder: 'flipbook' },
      name: { label: 'Resource Name', control: 'text', placeholder: 'Flipbooks' },
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      description: { label: 'Description', control: 'richtext' },
      showBadge: { label: 'Show Badge', control: 'switch', help: 'Display badge above the heading' },
      badgeText: { label: 'Badge Text', control: 'richtext', placeholder: 'Flipbooks', help: 'Custom badge text with formatting (uses Resource Name if empty)' },
    },
  },
  resources_faq: {
    schema: resourceTypeSchema,
    label: 'FAQ Resource Type',
    description: 'FAQ resource type description',
    uiMeta: {
      id: { label: 'Resource ID', control: 'text', placeholder: 'faq' },
      name: { label: 'Resource Name', control: 'text', placeholder: 'FAQ' },
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      description: { label: 'Description', control: 'richtext' },
      showBadge: { label: 'Show Badge', control: 'switch', help: 'Display badge above the heading' },
      badgeText: { label: 'Badge Text', control: 'richtext', placeholder: 'FAQ', help: 'Custom badge text with formatting (uses Resource Name if empty)' },
    },
  },
  resources_become_client: {
    schema: resourcesBecomeClientSchema,
    label: 'Become a Client Card',
    description: 'Card encouraging visitors to become clients',
    uiMeta: {
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      title: { label: 'Card Title', control: 'text', placeholder: 'Become a Client' },
      description: { label: 'Card Description', control: 'richtext', placeholder: 'Ready to take your financial planning to the next level?' },
      benefits: { label: 'Benefits List', control: 'text' },
      buttonText: { label: 'Button Text', control: 'text', placeholder: 'Learn More About Client Services' },
      buttonHref: { label: 'Button Link', control: 'text', placeholder: '/contact' },
    },
  },
  resources_need_help: {
    schema: resourcesNeedHelpSchema,
    label: 'Need Help Card',
    description: 'Card with support and help action buttons',
    uiMeta: {
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      title: { label: 'Card Title', control: 'text', placeholder: 'Need Help?' },
      description: { label: 'Card Description', control: 'richtext', placeholder: 'Have questions about our platform?' },
      actions: { label: 'Action Buttons (1-5 items)', control: 'text' },
    },
  },
  contact_header: {
    schema: pageHeaderSchema,
    label: 'Contact Page Header',
    description: 'Contact page title and description',
    uiMeta: {
      title: { label: 'Page Title', control: 'text', placeholder: 'Get in Touch' },
      description: { label: 'Page Description', control: 'richtext' },
    },
  },
  services_header: {
    schema: pageHeaderSchema,
    label: 'Services Page Header',
    description: 'Services page title, badge, and description',
    uiMeta: {
      badge: { label: 'Badge Text (optional)', control: 'text', placeholder: 'Professional Services' },
      title: { label: 'Page Title', control: 'text', placeholder: 'Comprehensive Financial Services' },
      description: { label: 'Page Description', control: 'richtext' },
    },
  },
  services_stats: {
    schema: servicesStatsSchema,
    label: 'Services Overview Stats',
    description: '4 key statistics displayed on services page',
    uiMeta: {
      stats: { label: 'Statistics (4 items)', control: 'text' },
    },
  },
  services_process: {
    schema: servicesProcessSchema,
    label: 'Our Service Process',
    description: '4-step service process displayed on services page',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Our Service Process' },
      description: { label: 'Section Description', control: 'text', placeholder: 'A systematic approach to delivering comprehensive financial guidance' },
      steps: { label: 'Process Steps (4 items)', control: 'text' },
    },
  },
  services_why_choose: {
    schema: servicesWhyChooseSchema,
    label: 'Why Choose Our Services',
    description: 'Reasons to choose our services section',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Why Choose Our Services' },
      reasons: { label: 'Reasons (3-6 items)', control: 'text' },
    },
  },
  services_commitment: {
    schema: servicesCommitmentSchema,
    label: 'Service Commitment',
    description: 'Service commitment metrics and guarantees',
    uiMeta: {
      title: { label: 'Card Title', control: 'text', placeholder: 'Service Commitment' },
      commitments: { label: 'Commitments (3-10 items)', control: 'text' },
    },
  },
  services_cta: {
    schema: servicesCtaSchema,
    label: 'Ready to Experience Our Services',
    description: 'Call-to-action section for scheduling consultation',
    uiMeta: {
      title: { label: 'CTA Title', control: 'text', placeholder: 'Ready to Experience Our Services?' },
      description: { label: 'CTA Description', control: 'richtext', placeholder: 'Schedule a consultation...' },
      primaryButtonText: { label: 'Primary Button Text', control: 'text', placeholder: 'Schedule Consultation' },
      primaryButtonHref: { label: 'Primary Button Link', control: 'text', placeholder: '/contact' },
      secondaryButtonText: { label: 'Secondary Button Text', control: 'text', placeholder: 'Call +1 (555) 123-4567' },
      secondaryButtonHref: { label: 'Secondary Button Link', control: 'text', placeholder: 'tel:+15551234567' },
    },
  },
  resources_header: {
    schema: pageHeaderSchema,
    label: 'Resources Page Header',
    description: 'Resources page title and description',
    uiMeta: {
      title: { label: 'Page Title', control: 'text', placeholder: 'Resource Library' },
      description: { label: 'Page Description', control: 'richtext' },
    },
  },
  home_quick_actions: {
    schema: homeQuickActionsSchema,
    label: 'Home Quick Actions',
    description: 'Quick action buttons on home page',
    uiMeta: {
      actions: { label: 'Quick Actions', control: 'text' },
    },
  },
  home_calculators: {
    schema: homeCalculatorsSchema,
    label: 'Home Popular Calculators',
    description: 'Popular calculator links on home page',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Popular Calculators' },
      description: { label: 'Section Description', control: 'text', placeholder: 'Quick access to frequently used calculators' },
      calculators: { label: 'Calculators', control: 'text' },
    },
  },
  home_calculator_categories: {
    schema: homeCalculatorCategoriesSchema,
    label: 'Calculator Categories Showcase',
    description: 'Complete financial calculator suite with 8 calculator categories',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Complete Financial Calculator Suite' },
      subtitle: { label: 'Section Subtitle', control: 'textarea', rows: 2, placeholder: '32+ professional-grade calculators across 8 categories...' },
      categories: { label: 'Calculator Categories', control: 'text' },
    },
  },
  footer_company: {
    schema: footerLinksSchema,
    label: 'Company Links',
    description: 'Footer company navigation links',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Company' },
      links: { label: 'Links', control: 'text' },
    },
  },
  footer_platform: {
    schema: footerLinksSchema,
    label: 'Platform Links',
    description: 'Footer platform navigation links',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Platform' },
      links: { label: 'Links', control: 'text' },
    },
  },
  footer_resources: {
    schema: footerLinksSchema,
    label: 'Resources Links',
    description: 'Footer resources navigation links',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Resources' },
      links: { label: 'Links', control: 'text' },
    },
  },
  footer_company_details: {
    schema: footerCompanyDetailsSchema,
    label: 'Company Details',
    description: 'Footer company information and social media links',
    uiMeta: {
      name: { label: 'Company Name', control: 'text', placeholder: 'IFS Group' },
      tagline: { label: 'Tagline', control: 'textarea', rows: 2 },
      address: { label: 'Address', control: 'textarea', rows: 2 },
      phone: { label: 'Phone', control: 'text', placeholder: '+46 13 123 4567' },
      email: { label: 'Email', control: 'text', placeholder: 'contact@ifsgroup.com' },
      linkedinUrl: { label: 'LinkedIn URL', control: 'text', placeholder: 'https://linkedin.com/company/yourcompany' },
      twitterUrl: { label: 'Twitter/X URL', control: 'text', placeholder: 'https://twitter.com/yourcompany' },
      facebookUrl: { label: 'Facebook URL', control: 'text', placeholder: 'https://facebook.com/yourcompany' },
    },
  },
  dashboard_header: {
    schema: dashboardHeaderSchema,
    label: 'Dashboard Header',
    description: 'Admin dashboard page header',
    uiMeta: {
      title: { label: 'Page Title', control: 'text', placeholder: 'System Admin Dashboard' },
      description: { label: 'Page Description', control: 'text', placeholder: 'Overview of platform metrics and user activity' },
    },
  },
  dashboard_stats: {
    schema: dashboardStatsSchema,
    label: 'Dashboard Statistics',
    description: '4 stat cards displayed on admin dashboard',
    uiMeta: {
      stats: { label: 'Statistics (4 items)', control: 'text' },
    },
  },
  dashboard_user_distribution: {
    schema: dashboardUserDistributionSchema,
    label: 'User Distribution Card',
    description: 'User distribution statistics card',
    uiMeta: {
      title: { label: 'Card Title', control: 'text', placeholder: 'User Distribution' },
      guestLabel: { label: 'Guest Users Label', control: 'text', placeholder: 'Guest Users' },
      clientsLabel: { label: 'Active Clients Label', control: 'text', placeholder: 'Active Clients' },
      totalLabel: { label: 'Total Label', control: 'text', placeholder: 'Total Users' },
    },
  },
  dashboard_engagement: {
    schema: dashboardEngagementSchema,
    label: 'Platform Engagement Card',
    description: 'Platform engagement statistics card',
    uiMeta: {
      title: { label: 'Card Title', control: 'text', placeholder: 'Platform Engagement' },
      calculationsLabel: { label: 'Calculations Label', control: 'text', placeholder: 'Calculations' },
      resourcesLabel: { label: 'Resources Label', control: 'text', placeholder: 'Resources' },
      avgLabel: { label: 'Average Label', control: 'text', placeholder: 'Avg per User' },
    },
  },
  dashboard_system_status: {
    schema: dashboardSystemStatusSchema,
    label: 'System Status Card',
    description: 'System status information card',
    uiMeta: {
      title: { label: 'Card Title', control: 'text', placeholder: 'System Status' },
      databaseLabel: { label: 'Database Label', control: 'text', placeholder: 'Database' },
      apiLabel: { label: 'API Label', control: 'text', placeholder: 'API' },
      statusLabel: { label: 'Platform Status Label', control: 'text', placeholder: 'Platform Status' },
      healthyBadge: { label: 'Healthy Badge Text', control: 'text', placeholder: 'Healthy' },
      onlineBadge: { label: 'Online Badge Text', control: 'text', placeholder: 'Online' },
      operationalBadge: { label: 'Operational Badge Text', control: 'text', placeholder: 'Operational' },
    },
  },
  about_header: {
    schema: aboutHeaderSchema,
    label: 'About Page Header',
    description: 'About page badge, title, and description',
    uiMeta: {
      badge: { label: 'Badge Text', control: 'text', placeholder: 'IFS Group' },
      title: { label: 'Page Title', control: 'text', placeholder: 'Trusted Financial Intelligence Since 1983' },
      description: { label: 'Page Description', control: 'richtext' },
    },
  },
  about_stats: {
    schema: aboutStatsSchema,
    label: 'Company Statistics',
    description: '4 key company statistics',
    uiMeta: {
      stats: { label: 'Statistics (4 items)', control: 'text' },
    },
  },
  about_story: {
    schema: aboutStorySchema,
    label: 'Company Story',
    description: 'Company history and story paragraphs',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Our Story' },
      paragraphs: { label: 'Story Paragraphs', control: 'text' },
    },
  },
  about_mission_vision: {
    schema: aboutMissionVisionSchema,
    label: 'Mission, Approach & Philosophy',
    description: 'Company mission, approach, and philosophy statements',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Mission, Approach & Philosophy' },
      missionTitle: { label: 'Mission Title', control: 'text', placeholder: 'Our Mission' },
      missionText: { label: 'Mission Text', control: 'textarea', rows: 3 },
      missionIcon: { label: 'Mission Icon', control: 'icon', options: iconOptions },
      approachTitle: { label: 'Approach Title', control: 'text', placeholder: 'Our Approach' },
      approachText: { label: 'Approach Text', control: 'textarea', rows: 3 },
      approachIcon: { label: 'Approach Icon', control: 'icon', options: iconOptions },
      visionTitle: { label: 'Philosophy Title', control: 'text', placeholder: 'Our Philosophy' },
      visionText: { label: 'Philosophy Text', control: 'textarea', rows: 3 },
      visionIcon: { label: 'Philosophy Icon', control: 'icon', options: iconOptions },
    },
  },
  about_values: {
    schema: aboutValuesSchema,
    label: 'Company Values',
    description: '4 core company values',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Our Values' },
      values: { label: 'Values (4 items)', control: 'text' },
    },
  },
  about_leadership: {
    schema: aboutLeadershipSchema,
    label: 'Leadership Team',
    description: 'Leadership team members',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Leadership Team' },
      leaders: { label: 'Team Members', control: 'text' },
    },
  },
  about_headquarters: {
    schema: aboutHeadquartersSchema,
    label: 'Global Headquarters',
    description: 'Company headquarters information',
    uiMeta: {
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      title: { label: 'Section Title', control: 'text', placeholder: 'Global Headquarters' },
      subtitle: { label: 'Subtitle', control: 'text', placeholder: 'Linköping, Sweden • Serving clients worldwide' },
      description: { label: 'Description', control: 'richtext' },
    },
  },
  about_innovation: {
    schema: aboutInnovationSchema,
    label: 'Innovation & Technology',
    description: 'Technology and innovation section',
    uiMeta: {
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      title: { label: 'Section Title', control: 'text', placeholder: 'Innovation at Our Core' },
      description: { label: 'Description', control: 'richtext' },
      features: { label: 'Innovation Features', control: 'text' },
    },
  },
  about_security: {
    schema: aboutSecuritySchema,
    label: 'Security & Compliance',
    description: 'Security and compliance section',
    uiMeta: {
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      title: { label: 'Section Title', control: 'text', placeholder: 'Security & Compliance' },
      description: { label: 'Description', control: 'richtext' },
      features: { label: 'Security Features', control: 'text' },
    },
  },
  about_cta: {
    schema: aboutCtaSchema,
    label: 'Call to Action',
    description: 'Final CTA section with buttons',
    uiMeta: {
      title: { label: 'CTA Title', control: 'text', placeholder: 'Ready to Experience the Future of Financial Planning?' },
      description: { label: 'CTA Description', control: 'richtext' },
      primaryButtonText: { label: 'Primary Button Text', control: 'text', placeholder: 'Explore Our Platform' },
      primaryButtonHref: { label: 'Primary Button Link', control: 'text', placeholder: '/calculators' },
      secondaryButtonText: { label: 'Secondary Button Text', control: 'text', placeholder: 'Contact Our Team' },
      secondaryButtonHref: { label: 'Secondary Button Link', control: 'text', placeholder: '/contact' },
    },
  },
  blog_header: {
    schema: blogHeaderSchema,
    label: 'Blog Page Header',
    description: 'Blog page title, badge, and description',
    uiMeta: {
      badge: { label: 'Badge Text (optional)', control: 'text', placeholder: 'Insights & Analysis' },
      title: { label: 'Page Title', control: 'text', placeholder: 'Financial Insights Blog' },
      description: { label: 'Page Description', control: 'richtext', placeholder: 'Expert analysis and insights on financial planning, investments, and wealth management' },
    },
  },
  blog_featured: {
    schema: blogFeaturedSchema,
    label: 'Featured Posts Section',
    description: 'Section highlighting featured blog posts',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Featured Articles' },
      description: { label: 'Section Description', control: 'richtext', placeholder: 'Hand-picked articles from our financial experts' },
    },
  },
  blog_categories: {
    schema: blogCategoriesSchema,
    label: 'Blog Categories',
    description: 'Categories and topics navigation',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Browse by Category' },
      categories: { label: 'Categories (1-10 items)', control: 'text' },
    },
  },
  blog_cta: {
    schema: blogCtaSchema,
    label: 'Blog Call to Action',
    description: 'CTA section for newsletter subscription or consultation',
    uiMeta: {
      title: { label: 'CTA Title', control: 'text', placeholder: 'Stay Informed with Financial Insights' },
      description: { label: 'CTA Description', control: 'richtext', placeholder: 'Subscribe to our newsletter or schedule a consultation to learn more' },
      primaryButtonText: { label: 'Primary Button Text', control: 'text', placeholder: 'Subscribe to Newsletter' },
      primaryButtonHref: { label: 'Primary Button Link', control: 'text', placeholder: '/resources' },
      secondaryButtonText: { label: 'Secondary Button Text', control: 'text', placeholder: 'Schedule Consultation' },
      secondaryButtonHref: { label: 'Secondary Button Link', control: 'text', placeholder: '/contact' },
    },
  },
  legal_privacy_policy: {
    schema: z.object({
      title: z.string().min(1),
      lastUpdated: z.string().optional(),
      content: z.string().min(1),
    }),
    label: 'Privacy Policy',
    description: 'Privacy policy page content',
    uiMeta: {
      title: { label: 'Page Title', control: 'text', placeholder: 'Privacy Policy' },
      lastUpdated: { label: 'Last Updated Date', control: 'text', placeholder: 'January 2026' },
      content: { label: 'Policy Content', control: 'richtext', placeholder: 'Enter the full privacy policy content here...' },
    },
  },
  legal_terms_of_service: {
    schema: z.object({
      title: z.string().min(1),
      lastUpdated: z.string().optional(),
      content: z.string().min(1),
    }),
    label: 'Terms of Service',
    description: 'Terms of service page content',
    uiMeta: {
      title: { label: 'Page Title', control: 'text', placeholder: 'Terms of Service' },
      lastUpdated: { label: 'Last Updated Date', control: 'text', placeholder: 'January 2026' },
      content: { label: 'Terms Content', control: 'richtext', placeholder: 'Enter the full terms of service content here...' },
    },
  },
  legal_disclosures: {
    schema: z.object({
      title: z.string().min(1),
      lastUpdated: z.string().optional(),
      content: z.string().min(1),
    }),
    label: 'Disclosures',
    description: 'Legal disclosures page content',
    uiMeta: {
      title: { label: 'Page Title', control: 'text', placeholder: 'Disclosures' },
      lastUpdated: { label: 'Last Updated Date', control: 'text', placeholder: 'January 2026' },
      content: { label: 'Disclosures Content', control: 'richtext', placeholder: 'Enter the full disclosures content here...' },
    },
  },
  // Privacy Policy Page Schemas
  privacy_policy_header: {
    schema: z.object({
      badge: z.string().optional(),
      title: z.string().min(1),
      subtitle: z.string().optional(),
    }),
    label: 'Privacy Policy Header',
    description: 'Hero banner section for the privacy policy page',
    uiMeta: {
      badge: { label: 'Badge Text', control: 'text', placeholder: 'Privacy & Security' },
      title: { label: 'Page Title', control: 'text', placeholder: 'Privacy Policy' },
      subtitle: { label: 'Subtitle', control: 'textarea', rows: 2, placeholder: 'Learn how we protect your personal and financial information.' },
    },
  },
  // Terms of Service Page Schemas
  terms_of_service_header: {
    schema: z.object({
      badge: z.string().optional(),
      title: z.string().min(1),
      subtitle: z.string().optional(),
    }),
    label: 'Terms of Service Header',
    description: 'Hero banner section for the terms of service page',
    uiMeta: {
      badge: { label: 'Badge Text', control: 'text', placeholder: 'Legal Agreement' },
      title: { label: 'Page Title', control: 'text', placeholder: 'Terms of Service' },
      subtitle: { label: 'Subtitle', control: 'textarea', rows: 2, placeholder: 'Please review our terms and conditions for using IFS Wealth Management services.' },
    },
  },
  // Disclosures Page Schemas
  disclosures_header: {
    schema: z.object({
      badge: z.string().optional(),
      title: z.string().min(1),
      subtitle: z.string().optional(),
    }),
    label: 'Disclosures Header',
    description: 'Hero banner section for the disclosures page',
    uiMeta: {
      badge: { label: 'Badge Text', control: 'text', placeholder: 'Legal & Compliance' },
      title: { label: 'Page Title', control: 'text', placeholder: 'Disclosures & Legal Documents' },
      subtitle: { label: 'Subtitle', control: 'textarea', rows: 2, placeholder: 'Access important legal documents, regulatory disclosures, and compliance information.' },
    },
  },
  // Process Page Schemas
  process_header: {
    schema: z.object({
      title: z.string().min(1),
      subtitle: z.string().min(1),
      introParagraph1: z.string().min(1),
      introParagraph2: z.string().min(1),
      stepsTitle: z.string().min(1),
    }),
    label: 'Process Header',
    description: 'Header section with intro text for the process page',
    uiMeta: {
      title: { label: 'Page Title', control: 'text', placeholder: 'It Starts with You' },
      subtitle: { label: 'Tagline', control: 'text', placeholder: 'Our process begins with getting to know you...' },
      introParagraph1: { label: 'First Intro Paragraph', control: 'textarea', rows: 4, placeholder: 'Our process begins with getting to know you and your goals...' },
      introParagraph2: { label: 'Second Intro Paragraph', control: 'textarea', rows: 4, placeholder: 'We believe a detailed planning process...' },
      stepsTitle: { label: 'Steps Section Title', control: 'text', placeholder: 'So what are the steps?' },
    },
  },
  process_step: {
    schema: z.object({
      stepNumber: z.number().min(1).max(10),
      title: z.string().min(1),
      description: z.string().min(1),
    }),
    label: 'Process Step',
    description: 'Individual step in the planning process',
    allowMultiple: true,
    uiMeta: {
      stepNumber: { label: 'Step Number', control: 'number', min: 1, max: 10 },
      title: { label: 'Step Title', control: 'text', placeholder: 'Introductory Meeting' },
      description: { label: 'Step Description', control: 'textarea', rows: 4, placeholder: 'In our first meeting, we\'ll identify your goals...' },
    },
  },
  // Individual Calculator Content Schemas (21 calculators)
  // Wealth Management Category (2)
  calc_net_worth: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Total Net Worth Calculator',
    description: 'Edit title, descriptions and disclaimer for Total Net Worth Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Total Net Worth Calculator' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Net worth tracking, debt ratio analysis, and wealth building strategies.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Total Net Worth Calculator' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate your complete financial position' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  calc_debt_ratio: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Income to Debt Ratio Calculator',
    description: 'Edit title, descriptions and disclaimer for Income to Debt Ratio Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Income to Debt Ratio Calculator' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Analyze your debt-to-income ratio for financial health.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Income to Debt Ratio' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate your debt-to-income ratio' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  // Loans & Credit Category (2)
  calc_loan_payoff: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Loan Payoff Calculator',
    description: 'Edit title, descriptions and disclaimer for Loan Payoff Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Loan Payoff Calculator' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Calculate loan payoff timelines and interest savings.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Loan Payoff Calculator' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate your loan payoff timeline' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  calc_credit_card_debt: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Credit Card Debt Calculator',
    description: 'Edit title, descriptions and disclaimer for Credit Card Debt Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Credit Card Debt Calculator' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Plan your credit card debt payoff strategy.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Credit Card Debt Calculator' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate your credit card payoff plan' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  // Real Estate Category (3)
  calc_home_affordability: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Home Affordability Calculator',
    description: 'Edit title, descriptions and disclaimer for Home Affordability Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Home Affordability Calculator' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Determine how much home you can afford.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Home Affordability' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate your home buying budget' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  calc_mortgage_refinance: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Mortgage Refinancing Calculator',
    description: 'Edit title, descriptions and disclaimer for Mortgage Refinancing Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Mortgage Refinancing Calculator' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Analyze potential savings from refinancing your mortgage.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Mortgage Refinancing' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate refinancing savings' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  calc_mortgage_acceleration: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Mortgage Acceleration Calculator',
    description: 'Edit title, descriptions and disclaimer for Mortgage Acceleration Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Mortgage Acceleration Calculator' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'See how extra payments can pay off your mortgage faster.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Mortgage Acceleration' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate early payoff scenarios' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  // Vehicle Financing Category (2)
  calc_lease_payment: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Lease Payment Calculator',
    description: 'Edit title, descriptions and disclaimer for Lease Payment Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Lease Payment Calculator' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Calculate your monthly lease payments.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Lease Payment Calculator' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate vehicle lease payments' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  calc_car_affordability: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Car Affordability Calculator',
    description: 'Edit title, descriptions and disclaimer for Car Affordability Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Car Affordability Calculator' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Determine how much car you can afford.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Car Affordability' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate your car buying budget' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  // Retirement & Inflation Category (5)
  calc_retirement_cost: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Cost of Retirement Calculator',
    description: 'Edit title, descriptions and disclaimer for Cost of Retirement Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Cost of Retirement Calculator' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Estimate how much you need to save for retirement.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Cost of Retirement' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate retirement savings needs' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  calc_rmd: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Required Minimum Distributions (RMD)',
    description: 'Edit title, descriptions and disclaimer for RMD Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Required Minimum Distributions (RMD)' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Calculate your required minimum distributions.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'RMD Calculator' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate required minimum distributions' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  calc_inflation_impact: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Impact of Inflation Calculator',
    description: 'Edit title, descriptions and disclaimer for Inflation Impact Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Impact of Inflation Calculator' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'See how inflation affects your purchasing power over time.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Inflation Impact' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate inflation effects' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  calc_retirement_early: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Retirement Plan Early Distribution',
    description: 'Edit title, descriptions and disclaimer for Early Distribution Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Retirement Plan Early Distribution' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Calculate penalties and taxes on early retirement withdrawals.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Early Distribution' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate early withdrawal impact' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  calc_portfolio_lifespan: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Retirement Portfolio Lifespan',
    description: 'Edit title, descriptions and disclaimer for Portfolio Lifespan Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Retirement Portfolio Lifespan' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Estimate how long your retirement savings will last.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Portfolio Lifespan' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate portfolio longevity' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  // Estate Planning Category (1)
  calc_estate_tax: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Estate Tax Calculator',
    description: 'Edit title, descriptions and disclaimer for Estate Tax Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Estate Tax Calculator' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Calculate potential estate taxes and plan for wealth transfer.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Estate Tax Calculator' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate estate tax liability' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  // Taxes & IRAs Category (4)
  calc_federal_tax: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Federal Income Tax Calculator',
    description: 'Edit title, descriptions and disclaimer for Federal Tax Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Federal Income Tax Calculator' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Calculate your federal income tax liability.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Federal Income Tax' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate federal tax obligations' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  calc_tax_deferred: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Tax-Deferred Savings Calculator',
    description: 'Edit title, descriptions and disclaimer for Tax-Deferred Savings Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Tax-Deferred Savings Calculator' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Compare tax-deferred vs taxable savings growth.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Tax-Deferred Savings' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate tax-deferred growth benefits' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  calc_ira_eligibility: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'IRA Eligibility Calculator',
    description: 'Edit title, descriptions and disclaimer for IRA Eligibility Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'IRA Eligibility Calculator' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Determine your eligibility for IRA contributions.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'IRA Eligibility' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Check your IRA contribution eligibility' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  calc_roth_conversion: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Roth IRA Conversion Calculator',
    description: 'Edit title, descriptions and disclaimer for Roth Conversion Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Roth IRA Conversion Calculator' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Analyze the benefits of converting to a Roth IRA.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Roth IRA Conversion' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate Roth conversion impact' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  // Credit & Debt Category (2)
  calc_credit_impact: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Credit Score Impact Analysis',
    description: 'Edit title, descriptions and disclaimer for Credit Score Impact Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Credit Score Impact Analysis' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'Understand how financial decisions affect your credit score.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Credit Score Impact' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Analyze credit score factors' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  calc_debt_consolidation: {
    schema: z.object({
      pageTitle: z.string().min(1),
      pageDescription: z.string(),
      cardTitle: z.string().min(1),
      cardDescription: z.string(),
      disclaimer: z.string(),
    }),
    label: 'Debt Consolidation Calculator',
    description: 'Edit title, descriptions and disclaimer for Debt Consolidation Calculator',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Debt Consolidation Calculator' },
      pageDescription: { label: 'Page Description', control: 'textarea', rows: 2, placeholder: 'See if consolidating your debts could save you money.' },
      cardTitle: { label: 'Card Title', control: 'text', placeholder: 'Debt Consolidation' },
      cardDescription: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Calculate consolidation savings' },
      disclaimer: { label: 'Disclaimer Text', control: 'textarea', rows: 4, placeholder: 'This example is for illustrative purposes only...' },
    },
  },
  // Calculator Page Header
  calculator_page_header: {
    schema: z.object({
      title: z.string().min(1),
      subtitle: z.string().min(1),
      description: z.string().min(1),
      searchPlaceholder: z.string().min(1),
    }),
    label: 'Calculator Page Header',
    description: 'Main header for the Calculators page',
    uiMeta: {
      title: { label: 'Page Title', control: 'text', placeholder: 'Financial Calculators' },
      subtitle: { label: 'Subtitle', control: 'text', placeholder: 'Professional Planning Tools' },
      description: { label: 'Description', control: 'textarea', rows: 3, placeholder: 'Access our suite of 32+ professional-grade financial calculators...' },
      searchPlaceholder: { label: 'Search Placeholder', control: 'text', placeholder: 'Search calculators...' },
    },
  },
  // Calculator Category Schemas - 8 categories
  calculator_category_wealth_management: {
    schema: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      icon: z.string().min(1),
    }),
    label: 'Wealth Management Category',
    description: 'Wealth Management calculator category settings',
    uiMeta: {
      title: { label: 'Category Title', control: 'text', placeholder: 'Wealth Management' },
      description: { label: 'Category Description', control: 'textarea', rows: 2, placeholder: 'Net worth tracking, debt ratio analysis, and wealth building strategies.' },
      icon: { label: 'Icon', control: 'icon' },
    },
  },
  calculator_category_loans_credit: {
    schema: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      icon: z.string().min(1),
    }),
    label: 'Loans & Credit Cards Category',
    description: 'Loans & Credit Cards calculator category settings',
    uiMeta: {
      title: { label: 'Category Title', control: 'text', placeholder: 'Loans & Credit Cards' },
      description: { label: 'Category Description', control: 'textarea', rows: 2, placeholder: 'Payoff strategies, payment schedules, and debt optimization tools.' },
      icon: { label: 'Icon', control: 'icon' },
    },
  },
  calculator_category_real_estate: {
    schema: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      icon: z.string().min(1),
    }),
    label: 'Real Estate & Housing Category',
    description: 'Real Estate & Housing calculator category settings',
    uiMeta: {
      title: { label: 'Category Title', control: 'text', placeholder: 'Real Estate & Housing' },
      description: { label: 'Category Description', control: 'textarea', rows: 2, placeholder: 'Home affordability, mortgage refinancing, and acceleration strategies.' },
      icon: { label: 'Icon', control: 'icon' },
    },
  },
  calculator_category_vehicle_financing: {
    schema: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      icon: z.string().min(1),
    }),
    label: 'Vehicle Financing Category',
    description: 'Vehicle Financing calculator category settings',
    uiMeta: {
      title: { label: 'Category Title', control: 'text', placeholder: 'Vehicle Financing' },
      description: { label: 'Category Description', control: 'textarea', rows: 2, placeholder: 'Lease vs buy analysis, payment calculations, and affordability assessment.' },
      icon: { label: 'Icon', control: 'icon' },
    },
  },
  calculator_category_retirement_inflation: {
    schema: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      icon: z.string().min(1),
    }),
    label: 'Retirement & Inflation Category',
    description: 'Retirement & Inflation calculator category settings',
    uiMeta: {
      title: { label: 'Category Title', control: 'text', placeholder: 'Retirement & Inflation' },
      description: { label: 'Category Description', control: 'textarea', rows: 2, placeholder: 'Retirement cost planning, RMD calculations, and inflation impact analysis.' },
      icon: { label: 'Icon', control: 'icon' },
    },
  },
  calculator_category_estate_planning: {
    schema: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      icon: z.string().min(1),
    }),
    label: 'Estate Planning Category',
    description: 'Estate Planning calculator category settings',
    uiMeta: {
      title: { label: 'Category Title', control: 'text', placeholder: 'Estate Planning' },
      description: { label: 'Category Description', control: 'textarea', rows: 2, placeholder: 'Estate tax calculations and planning recommendations for asset transfer.' },
      icon: { label: 'Icon', control: 'icon' },
    },
  },
  calculator_category_taxes_iras: {
    schema: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      icon: z.string().min(1),
    }),
    label: 'Taxes & IRAs Category',
    description: 'Taxes & IRAs calculator category settings',
    uiMeta: {
      title: { label: 'Category Title', control: 'text', placeholder: 'Taxes & IRAs' },
      description: { label: 'Category Description', control: 'textarea', rows: 2, placeholder: 'Income tax calculations, IRA eligibility, and Roth conversion analysis.' },
      icon: { label: 'Icon', control: 'icon' },
    },
  },
  calculator_category_credit_debt: {
    schema: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      icon: z.string().min(1),
    }),
    label: 'Credit & Debt Management Category',
    description: 'Credit & Debt Management calculator category settings',
    uiMeta: {
      title: { label: 'Category Title', control: 'text', placeholder: 'Credit & Debt Management' },
      description: { label: 'Category Description', control: 'textarea', rows: 2, placeholder: 'Credit optimization strategies and debt management planning tools.' },
      icon: { label: 'Icon', control: 'icon' },
    },
  },
  // Individual Calculator Item Schema
  calculator_item: {
    schema: z.object({
      categoryId: z.string().min(1),
      calculatorId: z.string().min(1),
      name: z.string().min(1),
      description: z.string().min(1),
      sortOrder: z.number().min(1).max(50),
    }),
    label: 'Calculator Item',
    description: 'Individual calculator name and description within a category',
    allowMultiple: true,
    uiMeta: {
      categoryId: { 
        label: 'Category', 
        control: 'select',
        options: [
          { label: 'Wealth Management', value: 'wealth_management' },
          { label: 'Loans & Credit Cards', value: 'loans_credit' },
          { label: 'Real Estate & Housing', value: 'real_estate' },
          { label: 'Vehicle Financing', value: 'vehicle_financing' },
          { label: 'Retirement & Inflation', value: 'retirement_inflation' },
          { label: 'Estate Planning', value: 'estate_planning' },
          { label: 'Taxes & IRAs', value: 'taxes_iras' },
          { label: 'Credit & Debt Management', value: 'credit_debt' },
        ]
      },
      calculatorId: { label: 'Calculator ID', control: 'text', placeholder: 'net_worth' },
      name: { label: 'Calculator Name', control: 'text', placeholder: 'Total Net Worth Calculator' },
      description: { label: 'Calculator Description', control: 'textarea', rows: 2, placeholder: 'Calculate your complete financial position including assets and liabilities' },
      sortOrder: { label: 'Display Order', control: 'number', min: 1, max: 50 },
    },
  },
  // Flipbook Content Schemas
  flipbook_header: {
    schema: z.object({
      title: z.string().min(1),
      subtitle: z.string().min(1),
      description: z.string().min(1),
    }),
    label: 'Flipbook Section Header',
    description: 'Header for the flipbooks section on Resources page',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Financial Flipbooks' },
      subtitle: { label: 'Subtitle', control: 'text', placeholder: 'Interactive Guides' },
      description: { label: 'Description', control: 'textarea', rows: 3, placeholder: 'Explore our collection of interactive financial guides...' },
    },
  },
  flipbook_item: {
    schema: z.object({
      title: z.string().min(1),
      subtitle: z.string().min(1),
      description: z.string().min(1),
      imageUrl: z.string().min(1),
      bgColor: z.string().min(1),
      sortOrder: z.number().min(1).max(20),
    }),
    label: 'Flipbook Item',
    description: 'Individual flipbook magazine card',
    allowMultiple: true,
    uiMeta: {
      title: { label: 'Title', control: 'text', placeholder: 'Financial Management Insight:' },
      subtitle: { label: 'Subtitle', control: 'text', placeholder: 'Strategies to Help Build Your Future' },
      description: { label: 'Description', control: 'textarea', rows: 3, placeholder: 'The decisions you make about money form the basis for your financial future...' },
      imageUrl: { label: 'Cover Image URL', control: 'text', placeholder: 'https://images.unsplash.com/photo-...' },
      bgColor: { 
        label: 'Background Gradient', 
        control: 'select', 
        options: [
          { label: 'Purple', value: 'from-purple-900 to-purple-700' },
          { label: 'Teal', value: 'from-teal-700 to-teal-500' },
          { label: 'Blue', value: 'from-blue-600 to-blue-400' },
          { label: 'Amber', value: 'from-amber-700 to-amber-500' },
          { label: 'Yellow', value: 'from-yellow-600 to-yellow-400' },
          { label: 'Emerald', value: 'from-emerald-700 to-emerald-500' },
          { label: 'Gray', value: 'from-gray-700 to-gray-500' },
          { label: 'Rose', value: 'from-rose-700 to-rose-500' },
          { label: 'Indigo', value: 'from-indigo-700 to-indigo-500' },
        ]
      },
      sortOrder: { label: 'Display Order', control: 'number', min: 1, max: 20 },
    },
  },
  // Newsletter Content Schemas
  newsletter_header: {
    schema: z.object({
      title: z.string().min(1),
      subtitle: z.string().min(1),
      description: z.string().min(1),
    }),
    label: 'Newsletter Section Header',
    description: 'Header for the newsletters section',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Newsletters' },
      subtitle: { label: 'Subtitle', control: 'text', placeholder: 'Financial Insights' },
      description: { label: 'Description', control: 'textarea', rows: 3, placeholder: 'Our financial newsletters are designed to provide helpful information on a wide variety of financial topics...' },
    },
  },
  newsletter_article: {
    schema: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      month: z.string().min(1),
      year: z.number().min(2020).max(2030),
      isHotTopic: z.boolean(),
      linkUrl: z.string().optional(),
      sortOrder: z.number().min(1).max(100),
    }),
    label: 'Newsletter Article',
    description: 'Individual newsletter article entry',
    allowMultiple: true,
    uiMeta: {
      title: { label: 'Article Title', control: 'text', placeholder: 'AI Expectations Underpin the Economic Outlook for 2026' },
      description: { label: 'Article Description', control: 'textarea', rows: 3, placeholder: 'This article discusses economic forecasts and the trends that are influencing them...' },
      month: { 
        label: 'Month', 
        control: 'select',
        options: [
          { label: 'January', value: 'January' },
          { label: 'February', value: 'February' },
          { label: 'March', value: 'March' },
          { label: 'April', value: 'April' },
          { label: 'May', value: 'May' },
          { label: 'June', value: 'June' },
          { label: 'July', value: 'July' },
          { label: 'August', value: 'August' },
          { label: 'September', value: 'September' },
          { label: 'October', value: 'October' },
          { label: 'November', value: 'November' },
          { label: 'December', value: 'December' },
        ]
      },
      year: { label: 'Year', control: 'number', min: 2020, max: 2030 },
      isHotTopic: { label: 'Mark as HOT TOPIC', control: 'switch' },
      linkUrl: { label: 'Article Link URL (optional)', control: 'text', placeholder: 'https://...' },
      sortOrder: { label: 'Display Order within Month', control: 'number', min: 1, max: 100 },
    },
  },

  // Financial Calculators Page
  financial_calculators_hero: {
    schema: z.object({
      pageTitle: z.string().min(1).max(100),
      subtitle: z.string().min(1).max(500),
    }),
    label: 'Hero Section',
    description: 'Main hero banner — page title and subtitle',
    uiMeta: {
      pageTitle: { label: 'Page Title', control: 'text', placeholder: 'Financial Calculators' },
      subtitle: { label: 'Subtitle', control: 'textarea', rows: 3, placeholder: 'Professional-grade financial planning tools — net worth, loans, real estate, retirement, interest, and more.' },
    },
  },

  financial_calc_net_worth: {
    schema: z.object({
      label: z.string().min(1).max(50),
      badge: z.string().min(1).max(100),
      badgeColor: z.string().min(1),
      title: z.string().min(1).max(150),
      description: z.string().min(1).max(500),
    }),
    label: 'Net Worth Calculator Card',
    description: 'Sidebar label, badge, title and description for the Net Worth calculator',
    uiMeta: {
      label: { label: 'Sidebar Label', control: 'text', placeholder: 'Net Worth' },
      badge: { label: 'Badge Text', control: 'text', placeholder: 'Comprehensive Planning' },
      badgeColor: { label: 'Badge Color Classes', control: 'text', placeholder: 'bg-indigo-100 text-indigo-800' },
      title: { label: 'Section Title', control: 'text', placeholder: 'Net Worth Calculator' },
      description: { label: 'Description', control: 'textarea', rows: 3, placeholder: 'Your complete financial profile…' },
    },
  },

  financial_calc_loan_payoff: {
    schema: z.object({
      label: z.string().min(1).max(50),
      badge: z.string().min(1).max(100),
      badgeColor: z.string().min(1),
      title: z.string().min(1).max(150),
      description: z.string().min(1).max(500),
    }),
    label: 'Loan Payoff Calculator Card',
    description: 'Sidebar label, badge, title and description for the Loan Payoff calculator',
    uiMeta: {
      label: { label: 'Sidebar Label', control: 'text', placeholder: 'Loan Payoff' },
      badge: { label: 'Badge Text', control: 'text', placeholder: 'Loans' },
      badgeColor: { label: 'Badge Color Classes', control: 'text', placeholder: 'bg-orange-100 text-orange-800' },
      title: { label: 'Section Title', control: 'text', placeholder: 'Loan Payoff & Extra-Payment Calculator' },
      description: { label: 'Description', control: 'textarea', rows: 3, placeholder: 'See exactly how much time and interest you save…' },
    },
  },

  financial_calc_real_estate: {
    schema: z.object({
      label: z.string().min(1).max(50),
      badge: z.string().min(1).max(100),
      badgeColor: z.string().min(1),
      title: z.string().min(1).max(150),
      description: z.string().min(1).max(500),
    }),
    label: 'Real Estate Calculator Card',
    description: 'Sidebar label, badge, title and description for the Real Estate calculator',
    uiMeta: {
      label: { label: 'Sidebar Label', control: 'text', placeholder: 'Real Estate' },
      badge: { label: 'Badge Text', control: 'text', placeholder: 'Real Estate & Housing' },
      badgeColor: { label: 'Badge Color Classes', control: 'text', placeholder: 'bg-green-100 text-green-800' },
      title: { label: 'Section Title', control: 'text', placeholder: 'Real Estate & Housing Calculator' },
      description: { label: 'Description', control: 'textarea', rows: 3, placeholder: 'Analyze home equity, investment ROI…' },
    },
  },

  financial_calc_retirement: {
    schema: z.object({
      label: z.string().min(1).max(50),
      badge: z.string().min(1).max(100),
      badgeColor: z.string().min(1),
      title: z.string().min(1).max(150),
      description: z.string().min(1).max(500),
    }),
    label: 'Retirement Calculator Card',
    description: 'Sidebar label, badge, title and description for the Retirement calculator',
    uiMeta: {
      label: { label: 'Sidebar Label', control: 'text', placeholder: 'Retirement' },
      badge: { label: 'Badge Text', control: 'text', placeholder: 'Retirement Planning' },
      badgeColor: { label: 'Badge Color Classes', control: 'text', placeholder: 'bg-purple-100 text-purple-800' },
      title: { label: 'Section Title', control: 'text', placeholder: 'Retirement Calculator' },
      description: { label: 'Description', control: 'textarea', rows: 3, placeholder: 'Estimate your retirement nest egg…' },
    },
  },

  financial_calc_interest: {
    schema: z.object({
      label: z.string().min(1).max(50),
      badge: z.string().min(1).max(100),
      badgeColor: z.string().min(1),
      title: z.string().min(1).max(150),
      description: z.string().min(1).max(500),
    }),
    label: 'Interest Calculators Card',
    description: 'Sidebar label, badge, title and description for the Interest calculator',
    uiMeta: {
      label: { label: 'Sidebar Label', control: 'text', placeholder: 'Interest' },
      badge: { label: 'Badge Text', control: 'text', placeholder: 'Interest Tools' },
      badgeColor: { label: 'Badge Color Classes', control: 'text', placeholder: 'bg-yellow-100 text-yellow-800' },
      title: { label: 'Section Title', control: 'text', placeholder: 'Interest Calculators' },
      description: { label: 'Description', control: 'textarea', rows: 3, placeholder: 'Simple Interest and Compound Interest calculators…' },
    },
  },

  financial_calc_ira: {
    schema: z.object({
      label: z.string().min(1).max(50),
      badge: z.string().min(1).max(100),
      badgeColor: z.string().min(1),
      title: z.string().min(1).max(150),
      description: z.string().min(1).max(500),
    }),
    label: 'IRA Eligibility Calculator Card',
    description: 'Sidebar label, badge, title and description for the IRA Eligibility calculator',
    uiMeta: {
      label: { label: 'Sidebar Label', control: 'text', placeholder: 'IRA Eligibility' },
      badge: { label: 'Badge Text', control: 'text', placeholder: 'Retirement Accounts' },
      badgeColor: { label: 'Badge Color Classes', control: 'text', placeholder: 'bg-red-100 text-red-800' },
      title: { label: 'Section Title', control: 'text', placeholder: 'IRA & Roth IRA Eligibility Calculator' },
      description: { label: 'Description', control: 'textarea', rows: 3, placeholder: 'Determine your Roth IRA contribution eligibility…' },
    },
  },
};

// Page to sections mapping
export const pageSections: Record<string, string[]> = {
  home: ['home_hero', 'home_stats', 'home_portfolio', 'home_wealth_creation', 'home_wealth_protection', 'home_wealth_preservation', 'home_wealth_transfer'],
  services: ['services_header', 'services_stats', 'services_investment', 'services_strategic', 'services_legacy', 'services_risk', 'services_special', 'services_aggregation', 'services_process', 'services_why_choose', 'services_commitment', 'services_cta'],
  contact: [
    'contact_header',
    'contact_office', 
    'contact_phone', 
    'contact_email',
    'contact_form_header',
    'contact_form_fields',
    'contact_quick_actions',
    'contact_support_features',
    'contact_business_hours',
    'contact_office_info',
    'contact_prospective_clients',
    'contact_current_clients'
  ],
  resources: ['resources_header', 'resources_articles', 'resources_videos', 'resources_newsletters', 'resources_flipbooks', 'resources_faq', 'resources_become_client', 'resources_need_help'],
  blog: ['blog_header', 'blog_featured', 'blog_categories', 'blog_cta'],
  about: ['about_header', 'about_stats', 'about_story', 'about_mission_vision', 'about_values', 'about_leadership', 'about_headquarters', 'about_innovation', 'about_security', 'about_cta'],
  dashboard: ['dashboard_header', 'dashboard_stats', 'dashboard_user_distribution', 'dashboard_engagement', 'dashboard_system_status'],
  footer: ['footer_company', 'footer_platform', 'footer_resources', 'footer_company_details'],
  privacy_policy: ['privacy_policy_header', 'legal_privacy_policy'],
  terms_of_service: ['terms_of_service_header', 'legal_terms_of_service'],
  disclosures: ['disclosures_header', 'legal_disclosures'],
  process: ['process_header', 'process_step'],
  calculators: [
    'calculator_page_header',
    'calculator_category_wealth_management',
    'calculator_category_loans_credit',
    'calculator_category_real_estate',
    'calculator_category_vehicle_financing',
    'calculator_category_retirement_inflation',
    'calculator_category_estate_planning',
    'calculator_category_taxes_iras',
    'calculator_category_credit_debt',
    'calculator_item',
    'calc_net_worth',
    'calc_debt_ratio',
    'calc_loan_payoff',
    'calc_credit_card_debt',
    'calc_home_affordability',
    'calc_mortgage_refinance',
    'calc_mortgage_acceleration',
    'calc_lease_payment',
    'calc_car_affordability',
    'calc_retirement_cost',
    'calc_rmd',
    'calc_inflation_impact',
    'calc_retirement_early',
    'calc_portfolio_lifespan',
    'calc_estate_tax',
    'calc_federal_tax',
    'calc_tax_deferred',
    'calc_ira_eligibility',
    'calc_roth_conversion',
    'calc_credit_impact',
    'calc_debt_consolidation'
  ],
  flipbooks: ['flipbook_header', 'flipbook_item'],
  newsletters: ['newsletter_header', 'newsletter_article'],
  financial_calculators: [
    'financial_calculators_hero',
    'financial_calc_net_worth',
    'financial_calc_loan_payoff',
    'financial_calc_real_estate',
    'financial_calc_retirement',
    'financial_calc_interest',
    'financial_calc_ira',
  ],
};

// Helper to get schema for a section
export function getSectionSchema(section: string): SectionSchema | undefined {
  return contentSchemas[section];
}

// Helper to validate content against schema
export function validateContent(section: string, content: any): { success: boolean; data?: any; error?: any } {
  const sectionSchema = getSectionSchema(section);
  if (!sectionSchema) {
    return { success: false, error: 'Unknown section' };
  }
  
  const result = sectionSchema.schema.safeParse(content);
  return result.success 
    ? { success: true, data: result.data }
    : { success: false, error: result.error };
}
