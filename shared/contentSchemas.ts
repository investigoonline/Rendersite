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
  description: z.string().min(1).max(1000),
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
  description: z.string().min(1).max(1000),
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
  description: z.string().min(1).max(1000),
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
  description: z.string().min(1).max(500),
  benefits: z.array(z.string()).min(1).max(10),
  buttonText: z.string().min(1).max(50),
});

// Resources Page Schemas
const resourceTypeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  icon: z.string().min(1),
  description: z.string().min(1).max(1000),
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

// Page Header Schemas
const pageHeaderSchema = z.object({
  badge: z.string().min(1).max(50).optional(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
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
  description: z.string().min(1).max(1000),
  steps: z.array(z.object({
    title: z.string().min(1).max(50),
    description: z.string().min(1).max(200),
  })).length(4),
});

// Services Why Choose Schema
const servicesWhyChooseSchema = z.object({
  title: z.string().min(1).max(100),
  reasons: z.array(z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
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
  description: z.string().min(1).max(500),
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
  description: z.string().min(1).max(1000),
  benefits: z.array(z.string()).min(1).max(10),
  buttonText: z.string().min(1).max(50),
  buttonHref: z.string().min(1).max(200),
});

const resourcesNeedHelpSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
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
    description: z.string().min(1).max(200),
    href: z.string().min(1).max(200),
    color: z.string().min(1),
  })).min(1).max(6),
});

// Home Calculators Schema
const homeCalculatorsSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  calculators: z.array(z.object({
    icon: z.string().min(1),
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(200),
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
    description: z.string().min(1).max(1000),
    calculators: z.array(z.string()).min(1).max(5),
  })).min(1).max(10),
});

// Dashboard Schemas
const dashboardHeaderSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
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
  description: z.string().min(1).max(500),
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
  visionTitle: z.string().min(1).max(100),
  visionText: z.string().min(1).max(500),
  visionIcon: z.string().min(1),
});

const aboutValuesSchema = z.object({
  title: z.string().min(1).max(100),
  values: z.array(z.object({
    icon: z.string().min(1),
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
  })).length(4),
});

const aboutLeadershipSchema = z.object({
  title: z.string().min(1).max(100),
  leaders: z.array(z.object({
    name: z.string().min(1).max(100),
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
  })).min(1).max(10),
});

const aboutHeadquartersSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1).max(100),
  subtitle: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
});

const aboutInnovationSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  features: z.array(z.string().min(1).max(200)).min(1).max(10),
});

const aboutSecuritySchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  features: z.array(z.string().min(1).max(200)).min(1).max(10),
});

const aboutCtaSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
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
      description: { label: 'Description', control: 'textarea', rows: 3 },
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
      description: { label: 'Description', control: 'textarea', rows: 3 },
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
      description: { label: 'Description', control: 'textarea', rows: 3 },
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
      description: { label: 'Description', control: 'textarea', rows: 3 },
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
      description: { label: 'Form Description', control: 'textarea', rows: 2, placeholder: 'Fill out the form...' },
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
      description: { label: 'Description', control: 'textarea', rows: 3 },
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
      description: { label: 'Description', control: 'textarea', rows: 3 },
      benefits: { label: 'Benefits List', control: 'text' },
      buttonText: { label: 'Button Text', control: 'text', placeholder: 'Access Client Portal' },
    },
  },
  resources_articles: {
    schema: resourceTypeSchema,
    label: 'Articles Resource Type',
    description: 'Articles resource type description',
    uiMeta: {
      id: { label: 'Resource ID', control: 'text', placeholder: 'article' },
      name: { label: 'Resource Name', control: 'text', placeholder: 'Articles' },
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
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
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
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
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
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
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
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
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      description: { label: 'Description', control: 'textarea', rows: 2 },
    },
  },
  resources_become_client: {
    schema: resourcesBecomeClientSchema,
    label: 'Become a Client Card',
    description: 'Card encouraging visitors to become clients',
    uiMeta: {
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      title: { label: 'Card Title', control: 'text', placeholder: 'Become a Client' },
      description: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Ready to take your financial planning to the next level?' },
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
      description: { label: 'Card Description', control: 'textarea', rows: 2, placeholder: 'Have questions about our platform?' },
      actions: { label: 'Action Buttons (1-5 items)', control: 'text' },
    },
  },
  contact_header: {
    schema: pageHeaderSchema,
    label: 'Contact Page Header',
    description: 'Contact page title and description',
    uiMeta: {
      title: { label: 'Page Title', control: 'text', placeholder: 'Get in Touch' },
      description: { label: 'Page Description', control: 'textarea', rows: 3 },
    },
  },
  services_header: {
    schema: pageHeaderSchema,
    label: 'Services Page Header',
    description: 'Services page title, badge, and description',
    uiMeta: {
      badge: { label: 'Badge Text (optional)', control: 'text', placeholder: 'Professional Services' },
      title: { label: 'Page Title', control: 'text', placeholder: 'Comprehensive Financial Services' },
      description: { label: 'Page Description', control: 'textarea', rows: 3 },
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
      description: { label: 'CTA Description', control: 'textarea', rows: 3, placeholder: 'Schedule a consultation...' },
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
      description: { label: 'Page Description', control: 'textarea', rows: 3 },
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
    description: 'Footer company information',
    uiMeta: {
      name: { label: 'Company Name', control: 'text', placeholder: 'IFS Group' },
      tagline: { label: 'Tagline', control: 'textarea', rows: 2 },
      address: { label: 'Address', control: 'textarea', rows: 2 },
      phone: { label: 'Phone', control: 'text', placeholder: '+46 13 123 4567' },
      email: { label: 'Email', control: 'text', placeholder: 'contact@ifsgroup.com' },
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
      description: { label: 'Page Description', control: 'textarea', rows: 3 },
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
    label: 'Mission & Vision',
    description: 'Company mission and vision statements',
    uiMeta: {
      title: { label: 'Section Title', control: 'text', placeholder: 'Mission & Vision' },
      missionTitle: { label: 'Mission Title', control: 'text', placeholder: 'Our Mission' },
      missionText: { label: 'Mission Text', control: 'textarea', rows: 3 },
      missionIcon: { label: 'Mission Icon', control: 'select', options: iconOptions },
      visionTitle: { label: 'Vision Title', control: 'text', placeholder: 'Our Vision' },
      visionText: { label: 'Vision Text', control: 'textarea', rows: 3 },
      visionIcon: { label: 'Vision Icon', control: 'select', options: iconOptions },
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
      description: { label: 'Description', control: 'textarea', rows: 4 },
    },
  },
  about_innovation: {
    schema: aboutInnovationSchema,
    label: 'Innovation & Technology',
    description: 'Technology and innovation section',
    uiMeta: {
      icon: { label: 'Icon', control: 'icon', options: iconOptions },
      title: { label: 'Section Title', control: 'text', placeholder: 'Innovation at Our Core' },
      description: { label: 'Description', control: 'textarea', rows: 3 },
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
      description: { label: 'Description', control: 'textarea', rows: 3 },
      features: { label: 'Security Features', control: 'text' },
    },
  },
  about_cta: {
    schema: aboutCtaSchema,
    label: 'Call to Action',
    description: 'Final CTA section with buttons',
    uiMeta: {
      title: { label: 'CTA Title', control: 'text', placeholder: 'Ready to Experience the Future of Financial Planning?' },
      description: { label: 'CTA Description', control: 'textarea', rows: 2 },
      primaryButtonText: { label: 'Primary Button Text', control: 'text', placeholder: 'Explore Our Platform' },
      primaryButtonHref: { label: 'Primary Button Link', control: 'text', placeholder: '/calculators' },
      secondaryButtonText: { label: 'Secondary Button Text', control: 'text', placeholder: 'Contact Our Team' },
      secondaryButtonHref: { label: 'Secondary Button Link', control: 'text', placeholder: '/contact' },
    },
  },
};

// Page to sections mapping
export const pageSections: Record<string, string[]> = {
  home: ['home_hero', 'home_stats', 'home_portfolio'],
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
  about: ['about_header', 'about_stats', 'about_story', 'about_mission_vision', 'about_values', 'about_leadership', 'about_headquarters', 'about_innovation', 'about_security', 'about_cta'],
  dashboard: ['dashboard_header', 'dashboard_stats', 'dashboard_user_distribution', 'dashboard_engagement', 'dashboard_system_status'],
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
