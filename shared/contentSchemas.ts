import { z } from "zod";

// UI Control types
export type UIControl = 'text' | 'textarea' | 'number' | 'select' | 'radio' | 'switch' | 'icon' | 'color';

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
  title: z.string().min(1).max(200),
  subtitle: z.string().min(1).max(300),
  primaryCTA: z.string().min(1).max(50),
  secondaryCTA: z.string().min(1).max(50),
});

const homeStatsItemSchema = z.object({
  label: z.string().min(1).max(100),
  value: z.string().min(1).max(50),
  description: z.string().min(1).max(200),
  icon: z.string().min(1),
});

const homeStatsSchema = z.object({
  stats: z.array(homeStatsItemSchema).min(1).max(6),
});

// Services Page Schemas
const serviceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100),
  icon: z.string().min(1),
  description: z.string().min(1).max(300),
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

// Resources Page Schemas
const resourceTypeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  icon: z.string().min(1),
  description: z.string().min(1).max(300),
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
});

// UI Metadata for each schema
export const contentSchemas: Record<string, SectionSchema> = {
  home_hero: {
    schema: homeHeroSchema,
    label: 'Hero Section',
    description: 'Main hero section with title, subtitle, and call-to-action buttons',
    uiMeta: {
      title: {
        label: 'Main Title',
        control: 'text',
        placeholder: 'Your Trusted Financial Planning Partner',
      },
      subtitle: {
        label: 'Subtitle',
        control: 'textarea',
        rows: 3,
        placeholder: 'Comprehensive wealth management and financial advisory services...',
      },
      primaryCTA: {
        label: 'Primary Button Text',
        control: 'text',
        placeholder: 'Get Started',
      },
      secondaryCTA: {
        label: 'Secondary Button Text',
        control: 'text',
        placeholder: 'Learn More',
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
  services_investment: {
    schema: serviceSchema,
    label: 'Investment Advisory Service',
    description: 'Investment advisory service details',
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
    uiMeta: {
      id: { label: 'Service ID', control: 'text', placeholder: 'strategic' },
      title: { label: 'Service Title', control: 'text', placeholder: 'Strategic Planning' },
      icon: { label: 'Icon', control: 'select', options: iconOptions },
      description: { label: 'Description', control: 'textarea', rows: 3 },
      features: { label: 'Key Features', control: 'text' },
      color: { label: 'Color Theme', control: 'select', options: colorOptions },
    },
  },
  services_legacy: {
    schema: serviceSchema,
    label: 'Legacy & Estate Planning',
    description: 'Legacy planning service details',
    uiMeta: {
      id: { label: 'Service ID', control: 'text', placeholder: 'legacy' },
      title: { label: 'Service Title', control: 'text', placeholder: 'Legacy Planning' },
      icon: { label: 'Icon', control: 'select', options: iconOptions },
      description: { label: 'Description', control: 'textarea', rows: 3 },
      features: { label: 'Key Features', control: 'text' },
      color: { label: 'Color Theme', control: 'select', options: colorOptions },
    },
  },
  services_risk: {
    schema: serviceSchema,
    label: 'Risk Management',
    description: 'Risk management service details',
    uiMeta: {
      id: { label: 'Service ID', control: 'text', placeholder: 'risk' },
      title: { label: 'Service Title', control: 'text', placeholder: 'Risk Management' },
      icon: { label: 'Icon', control: 'select', options: iconOptions },
      description: { label: 'Description', control: 'textarea', rows: 3 },
      features: { label: 'Key Features', control: 'text' },
      color: { label: 'Color Theme', control: 'select', options: colorOptions },
    },
  },
  services_special: {
    schema: serviceSchema,
    label: 'Special Situations',
    description: 'Special situations service details',
    uiMeta: {
      id: { label: 'Service ID', control: 'text', placeholder: 'special' },
      title: { label: 'Service Title', control: 'text', placeholder: 'Special Situations' },
      icon: { label: 'Icon', control: 'select', options: iconOptions },
      description: { label: 'Description', control: 'textarea', rows: 3 },
      features: { label: 'Key Features', control: 'text' },
      color: { label: 'Color Theme', control: 'select', options: colorOptions },
    },
  },
  services_aggregation: {
    schema: serviceSchema,
    label: 'Account Aggregation',
    description: 'Account aggregation service details',
    uiMeta: {
      id: { label: 'Service ID', control: 'text', placeholder: 'aggregation' },
      title: { label: 'Service Title', control: 'text', placeholder: 'Account Aggregation' },
      icon: { label: 'Icon', control: 'select', options: iconOptions },
      description: { label: 'Description', control: 'textarea', rows: 3 },
      features: { label: 'Key Features', control: 'text' },
      color: { label: 'Color Theme', control: 'select', options: colorOptions },
    },
  },
  contact_office: {
    schema: contactMethodSchema,
    label: 'Office Location',
    description: 'Office location contact information',
    uiMeta: {
      icon: { label: 'Icon', control: 'select', options: iconOptions },
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
      icon: { label: 'Icon', control: 'select', options: iconOptions },
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
      icon: { label: 'Icon', control: 'select', options: iconOptions },
      title: { label: 'Title', control: 'text', placeholder: 'Email Contact' },
      content: { label: 'Content Lines', control: 'text' },
      color: { label: 'Color Theme', control: 'select', options: colorOptions },
    },
  },
  resources_articles: {
    schema: resourceTypeSchema,
    label: 'Articles Resource Type',
    description: 'Articles resource type description',
    uiMeta: {
      id: { label: 'Resource ID', control: 'text', placeholder: 'article' },
      name: { label: 'Resource Name', control: 'text', placeholder: 'Articles' },
      icon: { label: 'Icon', control: 'select', options: iconOptions },
      description: { label: 'Description', control: 'textarea', rows: 2 },
    },
  },
  resources_videos: {
    schema: resourceTypeSchema,
    label: 'Videos Resource Type',
    description: 'Videos resource type description',
    uiMeta: {
      id: { label: 'Resource ID', control: 'text', placeholder: 'video' },
      name: { label: 'Resource Name', control: 'text', placeholder: 'Videos' },
      icon: { label: 'Icon', control: 'select', options: iconOptions },
      description: { label: 'Description', control: 'textarea', rows: 2 },
    },
  },
  resources_newsletters: {
    schema: resourceTypeSchema,
    label: 'Newsletters Resource Type',
    description: 'Newsletters resource type description',
    uiMeta: {
      id: { label: 'Resource ID', control: 'text', placeholder: 'newsletter' },
      name: { label: 'Resource Name', control: 'text', placeholder: 'Newsletters' },
      icon: { label: 'Icon', control: 'select', options: iconOptions },
      description: { label: 'Description', control: 'textarea', rows: 2 },
    },
  },
  resources_flipbooks: {
    schema: resourceTypeSchema,
    label: 'Flipbooks Resource Type',
    description: 'Flipbooks resource type description',
    uiMeta: {
      id: { label: 'Resource ID', control: 'text', placeholder: 'flipbook' },
      name: { label: 'Resource Name', control: 'text', placeholder: 'Flipbooks' },
      icon: { label: 'Icon', control: 'select', options: iconOptions },
      description: { label: 'Description', control: 'textarea', rows: 2 },
    },
  },
  resources_faq: {
    schema: resourceTypeSchema,
    label: 'FAQ Resource Type',
    description: 'FAQ resource type description',
    uiMeta: {
      id: { label: 'Resource ID', control: 'text', placeholder: 'faq' },
      name: { label: 'Resource Name', control: 'text', placeholder: 'FAQ' },
      icon: { label: 'Icon', control: 'select', options: iconOptions },
      description: { label: 'Description', control: 'textarea', rows: 2 },
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
    description: 'Footer company information',
    uiMeta: {
      name: { label: 'Company Name', control: 'text', placeholder: 'IFS Group' },
      tagline: { label: 'Tagline', control: 'textarea', rows: 2 },
      address: { label: 'Address', control: 'textarea', rows: 2 },
      phone: { label: 'Phone', control: 'text', placeholder: '+46 13 123 4567' },
      email: { label: 'Email', control: 'text', placeholder: 'contact@ifsgroup.com' },
    },
  },
};

// Page to sections mapping
export const pageSections: Record<string, string[]> = {
  home: ['home_hero', 'home_stats'],
  services: ['services_investment', 'services_strategic', 'services_legacy', 'services_risk', 'services_special', 'services_aggregation'],
  contact: ['contact_office', 'contact_phone', 'contact_email'],
  resources: ['resources_articles', 'resources_videos', 'resources_newsletters', 'resources_flipbooks', 'resources_faq'],
  footer: ['footer_company', 'footer_platform', 'footer_resources', 'footer_company_details'],
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
