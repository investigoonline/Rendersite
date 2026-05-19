import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const client = neon(process.env.DATABASE_URL);
const db = drizzle(client);

async function seed() {
  console.log("🌱 Starting database seed...");

  // ─── ROLE PERMISSIONS ────────────────────────────────────────────────────────
  console.log("  → Seeding role_permissions...");
  await db.execute(sql`DELETE FROM role_permissions`);
  await db.execute(sql`
    INSERT INTO role_permissions (role, resource_type, resource_id) VALUES
    -- super_admin pages
    ('super_admin','page','About'),
    ('super_admin','page','About IFS Group'),
    ('super_admin','page','Admin Dashboard'),
    ('super_admin','page','Articles & Insights'),
    ('super_admin','page','Become Client'),
    ('super_admin','page','Careers'),
    ('super_admin','page','Contact'),
    ('super_admin','page','Content Management'),
    ('super_admin','page','Custodian'),
    ('super_admin','page','Disclosures'),
    ('super_admin','page','FAQ'),
    ('super_admin','page','Facebook'),
    ('super_admin','page','Financial Calculators'),
    ('super_admin','page','Help Center'),
    ('super_admin','page','Home (Landing/Dashboard)'),
    ('super_admin','page','Location'),
    ('super_admin','page','Mobile App'),
    ('super_admin','page','Privacy Policy'),
    ('super_admin','page','Process'),
    ('super_admin','page','Register'),
    ('super_admin','page','Resources'),
    ('super_admin','page','Services'),
    ('super_admin','page','Terms of Service'),
    -- super_admin calculators
    ('super_admin','calculator','Car Affordability Calculator'),
    ('super_admin','calculator','Cost of Retirement Calculator'),
    ('super_admin','calculator','Credit Card Debt Calculator'),
    ('super_admin','calculator','Credit Score Impact Analysis'),
    ('super_admin','calculator','Debt Consolidation Calculator'),
    ('super_admin','calculator','Estate Tax Calculator'),
    ('super_admin','calculator','Federal Income Tax Calculator'),
    ('super_admin','calculator','Home Affordability Calculator'),
    ('super_admin','calculator','IRA Eligibility Calculator'),
    ('super_admin','calculator','Impact of Inflation Calculator'),
    ('super_admin','calculator','Income to Debt Ratio Calculator'),
    ('super_admin','calculator','Lease Payment Calculator'),
    ('super_admin','calculator','Loan Payoff Calculator'),
    ('super_admin','calculator','Mortgage Acceleration Calculator'),
    ('super_admin','calculator','Mortgage Refinancing Calculator'),
    ('super_admin','calculator','Required Minimum Distributions (RMD)'),
    ('super_admin','calculator','Retirement Plan Early Distribution'),
    ('super_admin','calculator','Retirement Portfolio Lifespan'),
    ('super_admin','calculator','Roth IRA Conversion Calculator'),
    ('super_admin','calculator','Tax-Deferred Savings Calculator'),
    ('super_admin','calculator','Total Net Worth Calculator'),
    -- super_admin calculator_categories
    ('super_admin','calculator_category','CALCULATORS'),
    ('super_admin','calculator_category','Credit & Debt Management'),
    ('super_admin','calculator_category','Estate Planning'),
    ('super_admin','calculator_category','FOOTER LINKS'),
    ('super_admin','calculator_category','Footer - Company Links'),
    ('super_admin','calculator_category','Footer - Platform Links'),
    ('super_admin','calculator_category','Footer - Resources Links'),
    ('super_admin','calculator_category','Footer - Social Media Links'),
    ('super_admin','calculator_category','Loans & Credit Cards'),
    ('super_admin','calculator_category','Real Estate & Housing'),
    ('super_admin','calculator_category','Retirement & Inflation'),
    ('super_admin','calculator_category','Taxes & IRAs'),
    ('super_admin','calculator_category','Vehicle Financing'),
    ('super_admin','calculator_category','Wealth Management'),
    -- admin pages
    ('admin','page','About'),
    ('admin','page','About IFS Group'),
    ('admin','page','Admin Dashboard'),
    ('admin','page','Articles & Insights'),
    ('admin','page','Become Client'),
    ('admin','page','Careers'),
    ('admin','page','Contact'),
    ('admin','page','Content Management'),
    ('admin','page','Custodian'),
    ('admin','page','Disclosures'),
    ('admin','page','FAQ'),
    ('admin','page','Facebook'),
    ('admin','page','Financial Calculators'),
    ('admin','page','Help Center'),
    ('admin','page','Home (Landing/Dashboard)'),
    ('admin','page','Location'),
    ('admin','page','Mobile App'),
    ('admin','page','Privacy Policy'),
    ('admin','page','Process'),
    ('admin','page','Register'),
    ('admin','page','Resources'),
    ('admin','page','Services'),
    ('admin','page','Terms of Service'),
    -- admin calculators
    ('admin','calculator','Car Affordability Calculator'),
    ('admin','calculator','Cost of Retirement Calculator'),
    ('admin','calculator','Credit Card Debt Calculator'),
    ('admin','calculator','Credit Score Impact Analysis'),
    ('admin','calculator','Debt Consolidation Calculator'),
    ('admin','calculator','Estate Tax Calculator'),
    ('admin','calculator','Federal Income Tax Calculator'),
    ('admin','calculator','Home Affordability Calculator'),
    ('admin','calculator','IRA Eligibility Calculator'),
    ('admin','calculator','Impact of Inflation Calculator'),
    ('admin','calculator','Income to Debt Ratio Calculator'),
    ('admin','calculator','Lease Payment Calculator'),
    ('admin','calculator','Loan Payoff Calculator'),
    ('admin','calculator','Mortgage Acceleration Calculator'),
    ('admin','calculator','Mortgage Refinancing Calculator'),
    ('admin','calculator','Required Minimum Distributions (RMD)'),
    ('admin','calculator','Retirement Plan Early Distribution'),
    ('admin','calculator','Retirement Portfolio Lifespan'),
    ('admin','calculator','Roth IRA Conversion Calculator'),
    ('admin','calculator','Tax-Deferred Savings Calculator'),
    ('admin','calculator','Total Net Worth Calculator'),
    -- admin calculator_categories
    ('admin','calculator_category','CALCULATORS'),
    ('admin','calculator_category','Credit & Debt Management'),
    ('admin','calculator_category','Estate Planning'),
    ('admin','calculator_category','FOOTER LINKS'),
    ('admin','calculator_category','Footer - Company Links'),
    ('admin','calculator_category','Footer - Platform Links'),
    ('admin','calculator_category','Footer - Resources Links'),
    ('admin','calculator_category','Footer - Social Media Links'),
    ('admin','calculator_category','Loans & Credit Cards'),
    ('admin','calculator_category','Real Estate & Housing'),
    ('admin','calculator_category','Retirement & Inflation'),
    ('admin','calculator_category','Taxes & IRAs'),
    ('admin','calculator_category','Vehicle Financing'),
    ('admin','calculator_category','Wealth Management'),
    -- content_manager pages
    ('content_manager','page','About'),
    ('content_manager','page','About IFS Group'),
    ('content_manager','page','Admin Dashboard'),
    ('content_manager','page','Articles & Insights'),
    ('content_manager','page','Become Client'),
    ('content_manager','page','Careers'),
    ('content_manager','page','Contact'),
    ('content_manager','page','Content Management'),
    ('content_manager','page','Custodian'),
    ('content_manager','page','Disclosures'),
    ('content_manager','page','FAQ'),
    ('content_manager','page','Facebook'),
    ('content_manager','page','Financial Calculators'),
    ('content_manager','page','Help Center'),
    ('content_manager','page','Home (Landing/Dashboard)'),
    ('content_manager','page','Location'),
    ('content_manager','page','Mobile App'),
    ('content_manager','page','Privacy Policy'),
    ('content_manager','page','Process'),
    ('content_manager','page','Register'),
    ('content_manager','page','Resources'),
    ('content_manager','page','Services'),
    ('content_manager','page','Terms of Service'),
    ('content_manager','calculator_category','FOOTER LINKS'),
    ('content_manager','calculator_category','Footer - Company Links'),
    ('content_manager','calculator_category','Footer - Platform Links'),
    ('content_manager','calculator_category','Footer - Resources Links'),
    ('content_manager','calculator_category','Footer - Social Media Links'),
    -- guest_user pages
    ('guest_user','page','About'),
    ('guest_user','page','About IFS Group'),
    ('guest_user','page','Articles & Insights'),
    ('guest_user','page','Become Client'),
    ('guest_user','page','Careers'),
    ('guest_user','page','Contact'),
    ('guest_user','page','Custodian'),
    ('guest_user','page','Disclosures'),
    ('guest_user','page','Facebook'),
    ('guest_user','page','Financial Calculators'),
    ('guest_user','page','Help Center'),
    ('guest_user','page','Home (Landing/Dashboard)'),
    ('guest_user','page','Location'),
    ('guest_user','page','Mobile App'),
    ('guest_user','page','Privacy Policy'),
    ('guest_user','page','Process'),
    ('guest_user','page','Register'),
    ('guest_user','page','Resources'),
    ('guest_user','page','Services'),
    ('guest_user','page','Terms of Service'),
    ('guest_user','calculator_category','FOOTER LINKS'),
    ('guest_user','calculator_category','Footer - Company Links'),
    ('guest_user','calculator_category','Footer - Platform Links'),
    ('guest_user','calculator_category','Footer - Resources Links'),
    ('guest_user','calculator_category','Footer - Social Media Links'),
    -- preferred_client pages
    ('preferred_client','page','About'),
    ('preferred_client','page','About IFS Group'),
    ('preferred_client','page','Articles & Insights'),
    ('preferred_client','page','Become Client'),
    ('preferred_client','page','Careers'),
    ('preferred_client','page','Contact'),
    ('preferred_client','page','Custodian'),
    ('preferred_client','page','Disclosures'),
    ('preferred_client','page','Facebook'),
    ('preferred_client','page','Financial Calculators'),
    ('preferred_client','page','Help Center'),
    ('preferred_client','page','Home (Landing/Dashboard)'),
    ('preferred_client','page','Location'),
    ('preferred_client','page','Mobile App'),
    ('preferred_client','page','Privacy Policy'),
    ('preferred_client','page','Process'),
    ('preferred_client','page','Register'),
    ('preferred_client','page','Resources'),
    ('preferred_client','page','Services'),
    ('preferred_client','page','Terms of Service'),
    ('preferred_client','calculator_category','FOOTER LINKS'),
    ('preferred_client','calculator_category','Footer - Company Links'),
    ('preferred_client','calculator_category','Footer - Platform Links'),
    ('preferred_client','calculator_category','Footer - Resources Links'),
    ('preferred_client','calculator_category','Footer - Social Media Links'),
    -- client pages
    ('client','page','About'),
    ('client','page','About IFS Group'),
    ('client','page','Articles & Insights'),
    ('client','page','Become Client'),
    ('client','page','Careers'),
    ('client','page','Contact'),
    ('client','page','Custodian'),
    ('client','page','Disclosures'),
    ('client','page','Facebook'),
    ('client','page','Financial Calculators'),
    ('client','page','Help Center'),
    ('client','page','Home (Landing/Dashboard)'),
    ('client','page','Location'),
    ('client','page','Mobile App'),
    ('client','page','Privacy Policy'),
    ('client','page','Process'),
    ('client','page','Register'),
    ('client','page','Resources'),
    ('client','page','Services'),
    ('client','page','Terms of Service'),
    ('client','calculator_category','FOOTER LINKS'),
    ('client','calculator_category','Footer - Company Links'),
    ('client','calculator_category','Footer - Platform Links'),
    ('client','calculator_category','Footer - Resources Links'),
    ('client','calculator_category','Footer - Social Media Links'),
    -- unregistered pages
    ('unregistered','page','About'),
    ('unregistered','page','Contact'),
    ('unregistered','page','Disclosures'),
    ('unregistered','page','Home (Landing/Dashboard)'),
    ('unregistered','page','Privacy Policy'),
    ('unregistered','page','Resources'),
    ('unregistered','page','Services'),
    ('unregistered','page','Terms of Service'),
    -- unregistered calculators
    ('unregistered','calculator','Car Affordability Calculator'),
    ('unregistered','calculator','Cost of Retirement Calculator'),
    ('unregistered','calculator','Credit Card Debt Calculator'),
    ('unregistered','calculator','Credit Score Impact Analysis'),
    ('unregistered','calculator','Debt Consolidation Calculator'),
    ('unregistered','calculator','Estate Tax Calculator'),
    ('unregistered','calculator','Federal Income Tax Calculator'),
    ('unregistered','calculator','Home Affordability Calculator'),
    ('unregistered','calculator','IRA Eligibility Calculator'),
    ('unregistered','calculator','Impact of Inflation Calculator'),
    ('unregistered','calculator','Income to Debt Ratio Calculator'),
    ('unregistered','calculator','Lease Payment Calculator'),
    ('unregistered','calculator','Loan Payoff Calculator'),
    ('unregistered','calculator','Mortgage Acceleration Calculator'),
    ('unregistered','calculator','Mortgage Refinancing Calculator'),
    ('unregistered','calculator','Required Minimum Distributions (RMD)'),
    ('unregistered','calculator','Retirement Plan Early Distribution'),
    ('unregistered','calculator','Retirement Portfolio Lifespan'),
    ('unregistered','calculator','Roth IRA Conversion Calculator'),
    ('unregistered','calculator','Tax-Deferred Savings Calculator'),
    ('unregistered','calculator','Total Net Worth Calculator'),
    -- unregistered calculator_categories
    ('unregistered','calculator_category','CALCULATORS'),
    ('unregistered','calculator_category','Credit & Debt Management'),
    ('unregistered','calculator_category','Estate Planning'),
    ('unregistered','calculator_category','Loans & Credit Cards'),
    ('unregistered','calculator_category','Real Estate & Housing'),
    ('unregistered','calculator_category','Retirement & Inflation'),
    ('unregistered','calculator_category','Taxes & IRAs'),
    ('unregistered','calculator_category','Vehicle Financing'),
    ('unregistered','calculator_category','Wealth Management')
  `);
  console.log("  ✓ role_permissions seeded");

  // ─── SITE SETTINGS ────────────────────────────────────────────────────────────
  console.log("  → Seeding site_settings...");
  await db.execute(sql`
    INSERT INTO site_settings (setting_key, setting_value, setting_type, label, description)
    VALUES
      ('font_size_h1',      '22.5',                          'font',   'Heading 1 Size',  'Font size for main headings (in pixels)'),
      ('font_size_h2',      '16.5',                          'font',   'Heading 2 Size',  'Font size for subheadings (in pixels)'),
      ('font_size_content', '13',                            'font',   'Content Size',     'Font size for body content (in pixels)'),
      ('contact_email',     'clientservices@investigoonline.com', 'system', 'Contact Email',   'Email address where contact form submissions are sent'),
      ('smtp_host',         'mail.investigoonline.com',      'system', 'SMTP Host',       'Mail server hostname, e.g. mail.yourdomain.com'),
      ('smtp_port',         '587',                           'system', 'SMTP Port',       'Mail server port (usually 587 or 465)'),
      ('smtp_user',         'clientservices@investigoonline.com', 'system', 'SMTP User',  'Email account username / login'),
      ('smtp_pass',         '',                              'system', 'SMTP Password',   'Email account password or app password'),
      ('smtp_from',         'clientservices@investigoonline.com', 'system', 'SMTP From',  'Sender display name or address (defaults to SMTP User if blank)')
    ON CONFLICT (setting_key) DO UPDATE
      SET setting_value = EXCLUDED.setting_value
  `);
  console.log("  ✓ site_settings seeded");

  // ─── IMAGE ASSETS ─────────────────────────────────────────────────────────────
  console.log("  → Seeding image_assets...");
  await db.execute(sql`DELETE FROM image_assets`);
  await db.execute(sql`
    INSERT INTO image_assets (page, section, file_name, file_path, original_name, mime_type, file_size, width, height)
    VALUES
      ('about',           'hero',       'hero_1770916875586_About_Us_Banner_IFS.webp',             '/api/storage/hero-images/hero_1770916875586_About_Us_Banner_IFS.webp',             'About_Us_Banner_IFS.webp',             'image/webp', 100000, 1920, 480),
      ('articles',        'carousel_1', 'hero_1770913491917_Flipbooks_Banner_IFS.webp',             '/api/storage/hero-images/hero_1770913491917_Flipbooks_Banner_IFS.webp',             'Flipbooks_Banner_IFS.webp',             'image/webp', 100000, 1920, 480),
      ('articles',        'carousel_2', 'hero_1767107834654_pexels-yankrukov-6817697.webp',         '/api/storage/hero-images/hero_1767107834654_pexels-yankrukov-6817697.webp',         'pexels-yankrukov-6817697.webp',         'image/webp', 333994, 1920, 1280),
      ('articles',        'carousel_3', 'hero_1770916044906_Our_NewsLetters__2_.webp',              '/api/storage/hero-images/hero_1770916044906_Our_NewsLetters__2_.webp',              'Our_NewsLetters_2.webp',                'image/webp', 100000, 1920, 480),
      ('articles',        'carousel_4', 'hero_1767107865010_pexels-gustavo-fring-4148842.webp',    '/api/storage/hero-images/hero_1767107865010_pexels-gustavo-fring-4148842.webp',    'pexels-gustavo-fring-4148842.webp',     'image/webp', 313788, 1920, 1280),
      ('calculators',     'hero',       'hero_1771433480952_Final_IFS_Banner.webp',                 '/api/storage/hero-images/hero_1771433480952_Final_IFS_Banner.webp',                 'Final_IFS_Banner.webp',                 'image/webp', 100000, 1920, 480),
      ('contact',         'hero',       'hero_1770916027975_Our_NewsLetters__3_.webp',              '/api/storage/hero-images/hero_1770916027975_Our_NewsLetters__3_.webp',              'Our_NewsLetters_3.webp',                'image/webp', 100000, 1920, 480),
      ('disclosures',     'hero',       'hero_1770921417625_Disclosures_Banner_IFS.webp',           '/api/storage/hero-images/hero_1770921417625_Disclosures_Banner_IFS.webp',           'Disclosures_Banner_IFS.webp',           'image/webp', 100000, 1920, 480),
      ('faq',             'hero',       'hero_1771433691018_Final_IFS_Banner__1_.webp',             '/api/storage/hero-images/hero_1771433691018_Final_IFS_Banner__1_.webp',             'Final_IFS_Banner_1.webp',               'image/webp', 100000, 1920, 480),
      ('flipbooks',       'hero',       'hero_1771350711127_Flipbooks_Banner_IFS.webp',             '/api/storage/hero-images/hero_1771350711127_Flipbooks_Banner_IFS.webp',             'Flipbooks_Banner_IFS.webp',             'image/webp', 100000, 1920, 480),
      ('footer',          'logo',       'hero_1769730980862_IFSDark.webp',                          '/api/storage/hero-images/hero_1769730980862_IFSDark.webp',                          'IFSDark.webp',                          'image/webp', 100000, 400,  120),
      ('global',          'logo',       'hero_1771950116308_IFS_logo_New-removebg-preview.webp',   '/api/storage/hero-images/hero_1771950116308_IFS_logo_New-removebg-preview.webp',   'IFS_logo_New-removebg-preview.webp',    'image/webp',  25000, 400,  120),
      ('home',            'hero',       'hero_1770911242643_Our_NewsLetters__3_.webp',              '/api/storage/hero-images/hero_1770911242643_Our_NewsLetters__3_.webp',              'Our_NewsLetters_3.webp',                'image/webp', 100000, 1920, 480),
      ('newsletters',     'hero',       'hero_1771350736786_Newsletter_Banner_IFS.webp',            '/api/storage/hero-images/hero_1771350736786_Newsletter_Banner_IFS.webp',            'Newsletter_Banner_IFS.webp',            'image/webp', 100000, 1920, 480),
      ('privacy_policy',  'hero',       'hero_1770921458207_Disclosures_Banner_IFS.webp',           '/api/storage/hero-images/hero_1770921458207_Disclosures_Banner_IFS.webp',           'Disclosures_Banner_IFS.webp',           'image/webp', 100000, 1920, 480),
      ('process',         'hero',       'hero_1770921404189_Our_Process_Banner_IFS__2_.webp',       '/api/storage/hero-images/hero_1770921404189_Our_Process_Banner_IFS__2_.webp',       'Our_Process_Banner_IFS_2.webp',         'image/webp', 100000, 1920, 480),
      ('resources',       'hero',       'hero_1770909939226_Our_NewsLetters__1_.webp',              '/api/storage/hero-images/hero_1770909939226_Our_NewsLetters__1_.webp',              'Our_NewsLetters_1.webp',                'image/webp', 100000, 1920, 480),
      ('services',        'hero',       'hero_1770916034064_Our_NewsLetters__1_.webp',              '/api/storage/hero-images/hero_1770916034064_Our_NewsLetters__1_.webp',              'Our_NewsLetters_1.webp',                'image/webp', 100000, 1920, 480),
      ('terms_of_service','hero',       'hero_1770921453998_Disclosures_Banner_IFS.webp',           '/api/storage/hero-images/hero_1770921453998_Disclosures_Banner_IFS.webp',           'Disclosures_Banner_IFS.webp',           'image/webp', 100000, 1920, 480)
  `);
  console.log("  ✓ image_assets seeded");

  // ─── PAGE CONTENT ─────────────────────────────────────────────────────────────
  console.log("  → Seeding page_content...");
  await db.execute(sql`DELETE FROM page_content`);

  const contentRows: Array<{ page: string; section: string; content: string }> = [
    // ── About ──────────────────────────────────────────────────────────────────
    { page: 'about', section: 'about_header', content: '{"badge":"IFS Group","title":"IFS Wealth Management Inc","description":"Personal service, long-term financial independence, guided by fundamentals."}' },
    { page: 'about', section: 'about_stats', content: '{"stats":[{"icon":"Building","color":"text-primary","label":"Years of Excellence","value":"40+"},{"icon":"Users","color":"text-secondary","label":"Team Members Globally","value":"7,000+"},{"icon":"Globe","color":"text-accent","label":"Countries Served","value":"80+"},{"icon":"Award","color":"text-primary","label":"Company Valuation","value":"$10B"}]}' },
    { page: 'about', section: 'about_story', content: '{"title":"Our Story","paragraphs":["IFS Wealth Management Inc was founded with the goal of assisting clients in every aspect of their financial lives through highly personalized service. For each client, we strive to help create lasting financial independence through thoughtful planning and disciplined execution.","We are an independent financial advisory firm committed to providing personal and professional financial planning services. For many years, one core principle has guided our success: emotions may win in the short term, but fundamentals always win in the long term.","Our professionals understand the complexity of the financial world and recognize that sustainable financial success requires more than quick fixes or cookie-cutter solutions. That is why we focus on building long-term relationships with individuals and families who value a truly long-term-oriented, comprehensive approach to financial planning."]}' },
    { page: 'about', section: 'about_mission_vision', content: '{"title":"Mission, Approach & Philosophy","visionIcon":"ChartLine","visionText":"We believe long-term success is built on trust, transparency, and personalized service. Our philosophy centers on understanding each client\'s unique circumstances and delivering tailored solutions that align with their values and long-term financial goals.","missionIcon":"MessageCircle","missionText":"The mission of IFS Wealth Management Inc is to help individuals and families achieve financial independence by providing common-sense, tax-efficient, and risk-conscious strategies for wealth accumulation, management, and preservation — delivered in a personalized and cost-effective manner.","visionTitle":"Our Philosophy","approachIcon":"TrendingUp","approachText":"IFS Wealth Management Inc follows a strategic asset allocation approach. Allocation decisions are grounded in mathematics, historical data, and sound financial fundamentals — guided by experience and practical judgment.","missionTitle":"Our Mission","approachTitle":"Our Approach"}' },
    { page: 'about', section: 'about_values', content: '{"title":"Our Values","values":[{"icon":"Target","title":"Innovation Excellence","description":"Driving transformative fintech advancements to better empower every client experience."},{"icon":"Heart","title":"Client-Centric Focus","description":"Every decision we make is dedicated to advancing our clients\' financial success. "},{"icon":"ShieldCheck","title":"Trust & Security","description":"Elevating security and compliance to empower confident, unstoppable progress."},{"icon":"Globe","title":"Global Reach","description":"Serving clients with localized expertise and scalable solutions, wherever you are."}]}' },
    { page: 'about', section: 'about_leadership', content: '{"title":"Leadership Team","leaders":[{"name":"Mark Moffat","title":"Chief Executive Officer","description":"Leading IFS Group\'s strategic vision and global expansion initiatives."},{"name":"Michael Ouissi","title":"Chief Customer Officer","description":"Ensuring exceptional client experiences and driving customer success."},{"name":"Christian Pedersen","title":"Chief Product Officer","description":"Overseeing product development and innovation strategy."},{"name":"Oliver Pilgerstorfer","title":"Chief Marketing Officer","description":"Leading global marketing and brand strategy initiatives."},{"name":"Helena Nimmo","title":"Chief Information Officer","description":"Driving digital transformation and technology strategy."},{"name":"Debra McCowan","title":"Chief Human Resources Officer","description":"Leading talent acquisition and organizational development."}]}' },
    { page: 'about', section: 'about_headquarters', content: '{"icon":"Globe","title":"Office Address","subtitle":"1500 S Dairy Ashford Rd, Ste 354, Houston, TX 77077","description":"Our global presence currently includes India and Dubai. We are actively exploring additional locations and expanding our reach in the near future."}' },
    { page: 'about', section: 'about_innovation', content: '{"icon":"ChartLine","title":"Innovation at Our Core","features":["Advanced AI and machine learning algorithms","Real-time data processing and analytics","Cloud-native architecture for scalability","Continuous integration and deployment"],"description":"Our commitment to innovation drives everything we do. From our early days pioneering enterprise software to today\'s AI-powered financial intelligence platform, we continue to push the boundaries of what\'s possible in financial technology."}' },
    { page: 'about', section: 'about_security', content: '{"icon":"ShieldCheck","title":"Security & Compliance","features":["SOC 2 Type II certified infrastructure","GDPR and CCPA compliant data practices","End-to-end encryption for all data","Regular security audits and penetration testing"],"description":"Trust is the foundation of financial services. We maintain the highest standards of security and regulatory compliance, ensuring your financial data is always protected and your privacy is respected."}' },
    { page: 'about', section: 'about_cta', content: '{"title":"Ready to Experience the Future of Financial Planning?","description":"Join thousands of individuals and businesses who trust IFS Group for their financial intelligence needs.","primaryButtonHref":"/calculators","primaryButtonText":"Explore Our Platform","secondaryButtonHref":"/contact","secondaryButtonText":"Contact Our Team"}' },
    // ── Contact ────────────────────────────────────────────────────────────────
    { page: 'contact', section: 'contact_header', content: '{"title":"Get in Touch","description":"<p><strong>Ready to take control? Begin with a free consultation or connect with our expert team for personalized guidance.</strong></p>"}' },
    { page: 'contact', section: 'contact_office', content: '{"icon":"MapPin","color":"text-primary","title":"Office Location","content":["IFS Wealth Management Inc","1500 S Dairy Ashford Rd,","Ste 354, Houston, TX 77077"]}' },
    { page: 'contact', section: 'contact_phone', content: '{"icon":"Phone","color":"text-secondary","title":"Phone Support","content":["+1 (512) 923-6479","24/7 Emergency Support","Monday - Friday 8:00 AM - 6:00 PM CST","Saturday 9:00 AM - 2:00 PM CST","Sunday Closed"]}' },
    { page: 'contact', section: 'contact_email', content: '{"icon":"Mail","color":"text-accent","title":"Email Support","content":["clientservices@investigoonline.com","Response within 24 hours","Priority client support"]}' },
    { page: 'contact', section: 'contact_form_header', content: '{"title":"Send us a Message","description":"Fill out the form below and we\'ll get back to you within 24 hours."}' },
    { page: 'contact', section: 'contact_form_fields', content: '{"nameLabel":"Full Name *","emailLabel":"Email Address *","phoneLabel":"Phone Number (Optional)","messageLabel":"Your Message *","subjectLabel":"Subject *","successTitle":"Message Sent Successfully","successMessage":"Thank you for contacting us. We will get back to you within 24 hours.","namePlaceholder":"Enter your full name","emailPlaceholder":"Enter your email address","phonePlaceholder":"Enter your phone number","submitButtonText":"Send Message","contactMethodLabel":"Preferred Contact Method","messagePlaceholder":"Tell us how we can help you..."}' },
    { page: 'contact', section: 'contact_quick_actions', content: '{"title":"Quick Actions","actions":[{"icon":"Mail","label":"Send Us Email"},{"icon":"MessageCircle","label":"Live Chat Support"},{"icon":"Phone","label":"Request Call Back"}]}' },
    { page: 'contact', section: 'contact_support_features', content: '{"title":"Why Choose Our Support","features":[{"icon":"Clock","title":"24/7 Availability","description":"Round-the-clock support for critical financial decisions."},{"icon":"Shield","title":"Secure Communication","description":"All communications are encrypted and confidential."},{"icon":"Globe","title":"Global Expertise","description":"Local knowledge with international perspective."}]}' },
    { page: 'contact', section: 'contact_business_hours', content: '{"title":"Business Hours","sunday":"Closed","saturday":"9:00 AM - 2:00 PM EST","emergency":"24/7","monday_friday":"8:00 AM - 6:00 PM EST"}' },
    { page: 'contact', section: 'contact_prospective_clients', content: '{"title":"For Prospective Clients","benefits":["Free Initial Consultation","Personalized Financial Assessment","Custom Service Recommendations","Transparent Fee Structure"],"buttonText":"Schedule A Call","description":"We provide comprehensive financial planning tailored to your unique goals."}' },
    { page: 'contact', section: 'contact_current_clients', content: '{"title":"For Current Clients","benefits":["Priority Phone & Email Support","Personal Account Manager","Quarterly Performance & Strategy Reviews","Immediate Emergency Financial Support"],"buttonText":"Access To Client Portal","description":"Premium, proactive service with a dedicated partner at your side."}' },
    { page: 'contact', section: 'contact_office_info', content: '{"items":[{"icon":"Building","title":"Headquarters","details":["Linköping, Sweden","Enterprise Software Campus","Building A, Floor 12"]},{"icon":"Globe","title":"Global Presence","details":["80+ countries served","7,000+ team members","24/7 global support network"]}],"title":"Office Information"}' },
    // ── Dashboard ──────────────────────────────────────────────────────────────
    { page: 'dashboard', section: 'dashboard_header', content: '{"title":"System Admin Dashboard","description":"Overview of platform metrics and user activity"}' },
    { page: 'dashboard', section: 'dashboard_stats', content: '{"stats":[{"icon":"Users","color":"text-secondary","label":"Guest Users"},{"icon":"UserCheck","color":"text-primary","label":"Active Clients"},{"icon":"Calculator","color":"text-accent","label":"Total Calculations"},{"icon":"FileText","color":"text-primary","label":"Resources Published"}]}' },
    { page: 'dashboard', section: 'dashboard_user_distribution', content: '{"title":"User Distribution","guestLabel":"Guest Users","totalLabel":"Total Users","clientsLabel":"Active Clients"}' },
    { page: 'dashboard', section: 'dashboard_engagement', content: '{"title":"Platform Engagement","avgLabel":"Avg per User","resourcesLabel":"Resources","calculationsLabel":"Calculations"}' },
    { page: 'dashboard', section: 'dashboard_system_status', content: '{"title":"System Status","apiLabel":"API","onlineBadge":"Online","statusLabel":"Platform Status","healthyBadge":"Healthy","databaseLabel":"Database","operationalBadge":"Operational"}' },
    // ── Disclosures ────────────────────────────────────────────────────────────
    { page: 'disclosures', section: 'legal_disclosures', content: '{"title":"Disclosures","content":"<p>IFS Wealth Management Inc is committed to transparency in all our dealings. This page contains important disclosures about our services and practices.</p><h2>Investment Advisory Services</h2><p>IFS Wealth Management Inc provides investment advisory services. Past performance is not indicative of future results.</p><h2>Fee Disclosure</h2><p>Our fee structure is disclosed in our Form ADV Part 2A brochure, available upon request.</p><h2>Regulatory Information</h2><p>IFS Wealth Management Inc is registered with the Securities and Exchange Commission as an investment adviser.</p><h2>Contact</h2><p>For questions about our disclosures, contact us at compliance@ifswealthmanagement.com</p>","lastUpdated":"January 2026"}' },
    // ── Financial Calculators ──────────────────────────────────────────────────
    { page: 'financial_calculators', section: 'financial_calculators_hero', content: '{"subtitle":"Professional-grade financial planning tools — net worth, loans, real estate, retirement, interest, and more.","pageTitle":"Financial Calculators"}' },
    { page: 'financial_calculators', section: 'financial_calc_net_worth', content: '{"badge":"Comprehensive Planning","label":"Net Worth","title":"Net Worth Calculator","badgeColor":"bg-indigo-100 text-indigo-800","description":"Your complete financial profile — personal details, domestic & non-domicile assets, liabilities, risk profile, estate planning, and retirement projections at ages 65, 75 & 85."}' },
    { page: 'financial_calculators', section: 'financial_calc_loan_payoff', content: '{"badge":"Loans","label":"Loan Payoff","title":"Loan Payoff & Extra-Payment Calculator","badgeColor":"bg-orange-100 text-orange-800","description":"See exactly how much time and interest you save by making extra payments on your loan."}' },
    { page: 'financial_calculators', section: 'financial_calc_real_estate', content: '{"badge":"Real Estate & Housing","label":"Real Estate","title":"Real Estate & Housing Calculator","badgeColor":"bg-green-100 text-green-800","description":"Analyze home equity, investment ROI, mortgage payments, and affordability in one place."}' },
    { page: 'financial_calculators', section: 'financial_calc_retirement', content: '{"badge":"Retirement Planning","label":"Retirement","title":"Retirement Calculator","badgeColor":"bg-purple-100 text-purple-800","description":"Estimate your retirement nest egg, replacement ratio, and whether you\'re on track to retire comfortably."}' },
    { page: 'financial_calculators', section: 'financial_calc_interest', content: '{"badge":"Interest Tools","label":"Interest","title":"Interest Calculators","badgeColor":"bg-yellow-100 text-yellow-800","description":"Simple Interest and Compound Interest calculators with Annual Addition support."}' },
    { page: 'financial_calculators', section: 'financial_calc_ira', content: '{"badge":"Retirement Accounts","label":"IRA Eligibility","title":"IRA & Roth IRA Eligibility Calculator","badgeColor":"bg-red-100 text-red-800","description":"Determine your Roth IRA contribution eligibility and Traditional IRA deductibility based on 2024 IRS rules."}' },
    // ── Flipbooks ──────────────────────────────────────────────────────────────
    { page: 'flipbooks', section: 'flipbook_header', content: '{"title":"Flipbooks","subtitle":"Interactive Financial Guides","description":"These magazine-style flipbooks provide helpful information on a variety of financial topics and illustrate key financial concepts. Select one of the flipbooks below and click the image to view it."}' },
    { page: 'flipbooks', section: 'flipbook_item', content: '{"title":"Financial Management Insight:","bgColor":"from-purple-900 to-purple-700","imageUrl":"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop","subtitle":"Strategies to Help Build Your Future","sortOrder":1,"description":"The decisions you make about money form the basis for your financial future and can help you pursue your goals."}' },
    { page: 'flipbooks', section: 'flipbook_item', content: '{"title":"Understanding Social Security and Medicare:","bgColor":"from-teal-700 to-teal-500","imageUrl":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop","subtitle":"America\'s Retirement Safety Net","sortOrder":2,"description":"Social Security and Medicare rules can be complex. To help maximize benefits, it pays to understand your options."}' },
    { page: 'flipbooks', section: 'flipbook_item', content: '{"title":"Higher Education:","bgColor":"from-blue-600 to-blue-400","imageUrl":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop","subtitle":"College Saving and Funding Strategies","sortOrder":3,"description":"College is an investment in your child\'s future. It requires a savings commitment and knowledge of funding methods."}' },
    { page: 'flipbooks', section: 'flipbook_item', content: '{"title":"Investing Basics:","bgColor":"from-amber-700 to-amber-500","imageUrl":"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop","subtitle":"Embark on Your Wealth-Building Journey","sortOrder":4,"description":"Weighing the risks and rewards of various investment options can help you develop a sound investment strategy."}' },
    { page: 'flipbooks', section: 'flipbook_item', content: '{"title":"Time to Get Tax-Savvy:","bgColor":"from-yellow-600 to-yellow-400","imageUrl":"https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop","subtitle":"Managing Your Tax Burden","sortOrder":5,"description":"Understanding tax rules and spotting tax-saving opportunities might help you put the money to better use."}' },
    { page: 'flipbooks', section: 'flipbook_item', content: '{"title":"Wealth Preservation:","bgColor":"from-emerald-700 to-emerald-500","imageUrl":"https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=300&fit=crop","subtitle":"Planning to Leave a Legacy","sortOrder":6,"description":"An estate planning strategy could increase the value of your estate and help avoid potential conflicts and delays."}' },
    { page: 'flipbooks', section: 'flipbook_item', content: '{"title":"Financial Protection:","bgColor":"from-gray-700 to-gray-500","imageUrl":"https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=400&h=300&fit=crop","subtitle":"Using Insurance to Help Manage Life\'s Risks","sortOrder":7,"description":"Home, auto, life, disability — Protect your financial interests by having the appropriate insurance coverage."}' },
    // ── Footer ─────────────────────────────────────────────────────────────────
    { page: 'footer', section: 'footer_company', content: '{"links":[{"href":"/about","label":"About IFS Group"},{"href":"#","label":"Leadership Team"},{"href":"#","label":"Careers"},{"href":"#","label":"Press & Media"},{"href":"/contact","label":"Contact Us"}],"title":"Company"}' },
    { page: 'footer', section: 'footer_platform', content: '{"links":[{"href":"/financial-calculators","label":"Financial Calculators"},{"href":"#","label":"Guest Access"},{"href":"/login","label":"Client Login"},{"href":"#","label":"Mobile App"},{"href":"#","label":"API Documentation"}],"title":"Platform"}' },
    { page: 'footer', section: 'footer_resources', content: '{"links":[{"href":"/about","label":"About IFS Group"},{"href":"/articles","label":"Articles"},{"href":"/disclosures","label":"Disclosures"},{"href":"/about/process","label":"Process"},{"href":"/flipbooks","label":"Flipbooks"},{"href":"/faq","label":"Frequently Asked Questions"},{"href":"/newsletters","label":"NewsLetters"}],"title":"Links"}' },
    { page: 'footer', section: 'footer_company_details', content: '{"name":"Investigoonline","email":"rajveepuri@investigonline.com","phone":"+1 (512) 923-6479","address":"IFS Group Headquarters, 1500 S Dairy Ashford Rd, Ste 354, Houston, Tx-77077","tagline":"Professional financial planning platform powered by 30+ years of IFS Group expertise.","twitterUrl":"https://twitter.com/ifsgroup","facebookUrl":"https://facebook.com/ifsgroup","linkedinUrl":"https://linkedin.com/company/ifsgroup"}' },
    // ── Home ───────────────────────────────────────────────────────────────────
    { page: 'home', section: 'home_hero', content: '{"badge1":"AI-Powered Platform","badge2":"32+ Calculators","subtitle":"Comprehensive financial planning tools, AI-driven insights, and personalized recommendations. From wealth management to retirement planning - all in one secure platform.","badge1Icon":"Sparkles","badge2Icon":"Calculator","primaryCTA":"Start Free Trial","titlePart1":"Your Complete","titlePart2":"Platform","secondaryCTA":"Explore Calculators","titleHighlight":"Financial Intelligence"}' },
    { page: 'home', section: 'home_stats', content: '{"stats":[{"label":"Financial Calculators","value":"32+"},{"label":"Powered Insights","value":"AI"},{"label":"Platform Access","value":"24/7"}]}' },
    { page: 'home', section: 'home_portfolio', content: '{"title":"Portfolio Overview","debtRatio":"18.2%","growthPercent":"+12.4%","monthlyIncome":"$8,450","totalNetWorth":"$1,247,832"}' },
    { page: 'home', section: 'home_wealth_creation', content: '{"title":"Wealth Creation","description":"Build and grow your assets through disciplined investing and smart financial strategies.\\n\\nStrategically building wealth through disciplined investing and thoughtful financial planning.\\n\\nFocus areas:\\n• Investment planning & portfolio construction\\n• Retirement planning\\n• Business owner & executive strategies"}' },
    { page: 'home', section: 'home_wealth_protection', content: '{"title":"Wealth Protection","description":"Safeguard what you\'ve built against life\'s uncertainties.\\n\\nProtecting your wealth through proactive risk management and strategic planning.\\n\\nFocus areas:\\n• Risk management & insurance planning\\n• Asset protection strategies\\n• Emergency and contingency planning"}' },
    { page: 'home', section: 'home_wealth_preservation', content: '{"title":"Wealth Preservation","description":"Minimize erosion of wealth over time and across generations.\\n\\nPreserving your wealth through tax-efficient strategies and long-term planning.\\n\\nFocus areas:\\n• Tax-efficient planning\\n• Estate & legacy planning\\n• Trust and succession strategies"}' },
    { page: 'home', section: 'home_wealth_transfer', content: '{"title":"Wealth Transfer & Legacy","description":"Ensure your wealth supports your values, family, and long-term goals.\\n\\nThoughtfully transferring wealth to support your legacy and future generations.\\n\\nFocus areas:\\n• Estate distribution planning\\n• Charitable giving & philanthropy\\n• Intergenerational wealth education"}' },
    { page: 'home', section: 'home_calculator_categories', content: '{"title":"Complete Financial Calculator Suite","subtitle":"Master your money with 32+ professional calculators across 8 categories. Offering solutions from basic budgeting to advanced estate planning.","categories":[{"id":"wealth_management","icon":"PieChart","title":"Wealth Management","calculators":["Total Net Worth Calculator","Income to Debt Ratio"],"description":"Expert financial insight: Net worth tracking, debt analysis, wealth strategies."},{"id":"loans_credit","icon":"CreditCard","title":"Loans & Credit Cards","calculators":["Loan Payoff Calculator","Credit Card Debt Analysis"],"description":"Efficient debt resolution: Tailored payoff strategies, optimized payment schedules, and advanced debt optimization tools."},{"id":"real_estate","icon":"Building","title":"Real Estate & Housing","calculators":["Home Affordability Calculator","Mortgage Refinancing"],"description":"Real Estate & Housing: Empowering decisions in home affordability, advanced mortgage refinancing, and tailored acceleration strategies."},{"id":"vehicle_financing","icon":"Car","title":"Vehicle Financing","calculators":["Lease Payment Calculator","Car Affordability Analysis"],"description":"Informed vehicle decisions: Lease vs buy analysis, precise payment calculations, and robust affordability assessments"},{"id":"retirement_inflation","icon":"Clock","title":"Retirement & Inflation","calculators":["Cost of Retirement Calculator","RMD Calculator"],"description":"Secure your future: Retirement cost planning, RMD calculations, and inflation impact analysis for lasting financial peace."},{"id":"estate_planning","icon":"Shield","title":"Estate Planning","calculators":["Estate Tax Calculator","Tax Planning Tools"],"description":"Comprehensive estate management: Accurate estate tax calculations and personalized planning recommendations for optimized asset transfer."},{"id":"taxes_iras","icon":"DollarSign","title":"Taxes & IRAs","calculators":["Federal Income Tax Calculator","IRA Eligibility Calculator"],"description":"Optimize your tax strategy: Income tax calculations, IRA eligibility, and Roth conversion analysis for maximum savings."},{"id":"credit_debt","icon":"TrendingUp","title":"Credit & Debt Management","calculators":["Credit Score Impact Analysis","Debt Consolidation Calculator"],"description":"Credit & Debt Management: Empower your financial future with credit optimization strategies and robust debt management planning tools."}]}' },
    // ── Newsletters ────────────────────────────────────────────────────────────
    { page: 'newsletters', section: 'newsletter_header', content: '{"title":"Newsletters","subtitle":"Will you outlive your retirement income? Are your financial expectations for the coming year realistic?","description":"Our financial newsletters are designed to provide helpful information on a wide variety of financial topics. Simply click on one of the newsletter topics below to read the article in its entirety."}' },
    { page: 'newsletters', section: 'newsletter_article', content: '{"year":2026,"month":"February","title":"AI Expectations Underpin the Economic Outlook for 2026","linkUrl":"","sortOrder":1,"isHotTopic":true,"description":"This article discusses economic forecasts and the trends that are influencing them, including the impact of artificial intelligence on markets and business growth."}' },
    { page: 'newsletters', section: 'newsletter_article', content: '{"year":2026,"month":"February","title":"Understanding Market Volatility: What Investors Need to Know","linkUrl":"","sortOrder":2,"isHotTopic":false,"description":"Market volatility can be unsettling, but understanding its causes and having a solid strategy can help you navigate uncertain times with confidence."}' },
    { page: 'newsletters', section: 'newsletter_article', content: '{"year":2026,"month":"January","title":"Tax Planning Strategies for the New Year","linkUrl":"","sortOrder":3,"isHotTopic":false,"description":"Start the year right with smart tax planning strategies that can help reduce your tax burden and maximize your savings potential."}' },
    { page: 'newsletters', section: 'newsletter_article', content: '{"year":2026,"month":"January","title":"Retirement Planning: Are You On Track?","linkUrl":"","sortOrder":4,"isHotTopic":true,"description":"A comprehensive look at retirement readiness indicators and steps you can take to ensure your golden years are financially secure."}' },
    // ── Privacy Policy ─────────────────────────────────────────────────────────
    { page: 'privacy_policy', section: 'legal_privacy_policy', content: '{"title":"Privacy Policy","content":"<p>This Privacy Policy describes how IFS Wealth Management Inc (\\"we\\", \\"us\\", or \\"our\\") collects, uses, and shares information about you when you use our website and services.</p><h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you create an account, use our calculators, or contact us for support.</p><h2>How We Use Your Information</h2><p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you.</p><h2>Contact Us</h2><p>If you have any questions about this Privacy Policy, please contact us at privacy@ifswealthmanagement.com</p>","lastUpdated":"January 2026"}' },
    // ── Process ────────────────────────────────────────────────────────────────
    { page: 'process', section: 'process_header', content: '{"title":"It Starts with You.","subtitle":"A personalized approach to financial planning that adapts to your life\'s journey","stepsTitle":"Our 4-Step Process","introParagraph1":"Our process starts with you—your goals, your priorities, and your vision for the future. Share where you want to go, and we\'ll collaborate to craft a plan tailored to your needs. As life evolves, we\'ll adapt your strategy to align with your new path.","introParagraph2":"We believe that a thoughtful, disciplined planning process is one of the most effective ways to secure financial well-being. A well-structured plan not only aims to safeguard your financial security throughout life but also helps mitigate the impact of unexpected events—such as disability, critical illness, or other sudden income interruptions."}' },
    { page: 'process', section: 'process_step', content: '{"title":"Discovery & Understanding","stepNumber":1,"description":"We begin with a thorough discovery session to understand your current financial situation, goals, values, and concerns. This foundational step ensures we fully understand your unique circumstances."}' },
    { page: 'process', section: 'process_step', content: '{"title":"Analysis & Strategic Planning","stepNumber":2,"description":"Our team analyzes your financial data, identifies opportunities and risks, and develops a comprehensive, personalized wealth management strategy aligned with your objectives."}' },
    { page: 'process', section: 'process_step', content: '{"title":"Presentation & Alignment","stepNumber":3,"description":"We clearly present our findings and recommendations, walking you through the strategy in understandable terms. This collaborative discussion ensures alignment, clarity, and confidence before moving forward."}' },
    { page: 'process', section: 'process_step', content: '{"title":"Implementation & Ongoing Management","stepNumber":4,"description":"Once approved, we implement your plan and coordinate with legal, tax, and other professionals as needed. We continuously monitor performance, adapt to life changes and market conditions, and conduct regular reviews to keep your strategy on track."}' },
    // ── Resources ──────────────────────────────────────────────────────────────
    { page: 'resources', section: 'resources_header', content: '{"title":"Resource Library","description":"Educational content, tools, and resources to help you make informed financial decisions."}' },
    { page: 'resources', section: 'resources_articles', content: '{"id":"article","icon":"FileText","name":"Articles","badgeText":"<h2 style=\\"text-align: left;\\"><span style=\\"color: rgb(0, 0, 0);\\">Estates &amp; Trusts</span></h2><p></p>","showBadge":true,"description":"<p></p>"}' },
    { page: 'resources', section: 'resources_videos', content: '{"id":"video","icon":"Video","name":"Videos","description":"Video tutorials and webinars covering essential financial concepts."}' },
    { page: 'resources', section: 'resources_newsletters', content: '{"id":"newsletter","icon":"Mail","name":"Newsletters","description":"Weekly market updates and quarterly financial outlooks."}' },
    { page: 'resources', section: 'resources_flipbooks', content: '{"id":"flipbook","icon":"Book","name":"Flipbooks","description":"Interactive brochures and comprehensive planning guides."}' },
    { page: 'resources', section: 'resources_faq', content: '{"id":"faq","icon":"HelpCircle","name":"FAQ","description":"Searchable answers to common financial planning questions."}' },
    // ── Services ───────────────────────────────────────────────────────────────
    { page: 'services', section: 'services_header', content: '{"badge":"Professional Services","title":"Comprehensive Financial Services","description":"<p><strong>A complete, life-stage-aware approach to your finances-investment strategy, protection, and legacy planning-with 30+ years of proven expertise.</strong></p>"}' },
    { page: 'services', section: 'services_stats', content: '{"stats":[{"icon":"Globe","label":"Service Areas","value":"2"},{"icon":"Users","label":"Years Experience","value":"30+"},{"icon":"Shield","label":"Fiduciary Standard","value":"100%"},{"icon":"Database","label":"Account Access","value":"24/7"}]}' },
    { page: 'services', section: 'services_investment', content: '{"id":"investment_management","icon":"TrendingUp","color":"primary","title":"Investment Management","features":["Structured Diversification & Strategic Asset Allocation","Tax-Efficient Investing Practices","Regular Quarterly Performance Reporting","Transparent Monthly Statements and Annual Reviews","24/7 Online Account Access"],"description":"Institutional-grade portfolio oversight with disciplined strategies and continuous monitoring."}' },
    { page: 'services', section: 'services_strategic', content: '{"id":"strategic_planning","icon":"FileText","color":"secondary","title":"Strategic Financial Planning","features":["Retirement Planning Strategies","Pension Optimization","Stock Options Planning","Education Funding Strategies","Goal-Based Financial Planning"],"description":"Customized, goal-focused strategies designed around your unique life and financial situation."}' },
    { page: 'services', section: 'services_strategic', content: '{"id":"Repatriation_Strategy","icon":"Book","color":"text-primary","title":"Repatriation Guidance","features":["Personal & Family Logistics","Tax & Legal Considerations","Cross-Border Asset Coordination","Health Care & Insurance Continuity","Housing & Employment Transition"],"description":"Preparing for return with comprehensive planning"}' },
    { page: 'services', section: 'services_legacy', content: '{"id":"legacy_planning","icon":"Users","color":"accent","title":"Legacy Planning","features":["Estate Planning Documents Review","Beneficiary Review & Updates","Philanthropic Planning","Charitable Trust Strategies","Private Foundations","Trust Management Services","Business Succession/Exit Planning"],"description":"Thoughtful, value-driven wealth transfer that aligns with your family\'s vision."}' },
    { page: 'services', section: 'services_risk', content: '{"id":"risk_management","icon":"Shield","color":"primary","title":"Risk Management","features":["Asset Protection Strategies","Life Insurance Analysis & Review","Disability Insurance Analysis & Review","Personal Liability Insurance Review","Long-Term Care Insurance Planning"],"description":"Protect your assets and family with comprehensive insurance and risk analysis."}' },
    { page: 'services', section: 'services_special', content: '{"id":"special_situations","icon":"PieChart","color":"secondary","title":"Special Situations Planning","features":["Divorce Financial Planning and Income Replacement","Foundation and Endowment Guidance","Financial Windfall Planning","Structured Settlements","Special Needs Trusts - Asset Management"],"description":"Specialized financial guidance for unique life circumstances and transitions."}' },
    { page: 'services', section: 'services_aggregation', content: '{"id":"account_aggregation","icon":"Database","color":"accent","title":"Account Aggregation","features":["View All Bank & Brokerage Accounts in One Secure Place","Balance Sheet/Net Worth Statements","Financial Goals/Plans Tracking","Asset Allocation Strategy Oversight","Tax Documents, Trusts, Wills & Other Private Records","Insurance Policies & Coverages Management"],"description":"Centralized view and management of all your financial accounts and documents."}' },
    { page: 'services', section: 'services_why_choose', content: '{"title":"Why Choose Our Services","reasons":[{"title":"Fiduciary Standard","description":"We are legally bound to act in your best interest at all times, ensuring unbiased advice."},{"title":"Comprehensive Approach","description":"All aspects of your financial life coordinated under one roof for seamless planning."},{"title":"Institutional Expertise","description":"Access to institutional-grade investment strategies and professional resources."},{"title":"Ongoing Support","description":"Regular monitoring, reviews, and adjustments to keep your plan current."}]}' },
    { page: 'services', section: 'services_commitment', content: '{"title":"Service Commitment","commitments":[{"label":"Client Review Frequency","value":"Quarterly"},{"label":"Response Time","value":"24 Hours"},{"label":"Account Access","value":"24/7 Online"},{"label":"Performance Reports","value":"Monthly"},{"label":"Planning Updates","value":"As Needed"}]}' },
    { page: 'services', section: 'services_cta', content: '{"title":"Ready to Transform Your Financial Future?","description":"Book a call to see how our holistic strategy can drive real, measurable progress toward your goals.","primaryButtonHref":"/contact","primaryButtonText":"Schedule Consultation","secondaryButtonHref":"tel:+15129236479","secondaryButtonText":"Call +1 (512) 923-6479"}' },
    // ── Terms of Service ───────────────────────────────────────────────────────
    { page: 'terms_of_service', section: 'legal_terms_of_service', content: '{"title":"Terms of Service","content":"<p>Welcome to IFS Wealth Management Inc. By accessing or using our website and services, you agree to be bound by these Terms of Service.</p><h2>Use of Services</h2><p>You may use our services only in compliance with these terms and all applicable laws and regulations.</p><h2>Account Registration</h2><p>To access certain features, you may need to register for an account. You are responsible for maintaining the confidentiality of your account credentials.</p><h2>Disclaimer</h2><p>The calculators and tools provided are for informational purposes only and do not constitute financial advice.</p><h2>Contact</h2><p>For questions about these terms, contact us at legal@ifswealthmanagement.com</p>","lastUpdated":"January 2026"}' },
  ];

  for (const row of contentRows) {
    await db.execute(
      sql`INSERT INTO page_content (page, section, content) VALUES (${row.page}, ${row.section}, ${row.content}::jsonb)`
    );
  }
  console.log(`  ✓ page_content seeded (${contentRows.length} rows)`);

  console.log("\n✅ Database seed complete!");
  console.log("\nNext step: Log in as super_admin and upload your hero images via the CMS,");
  console.log("or push code with public/hero-images/ to serve them as static files.\n");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
