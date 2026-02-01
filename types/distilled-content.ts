// ============================================================================
// Distilled Content Types - Multi-Component System
// ============================================================================

// Base component interface
export interface BaseComponent {
  type: ComponentType;
}

export type ComponentType =
  | "cards"
  | "article"
  | "timeline"
  | "comparison"
  | "faq"
  | "stats"
  | "hero"
  | "list"
  | "gallery"
  | "profile"
  | "quote";

// ============================================================================
// 1. Cards Component
// ============================================================================
export interface SpecItem {
  key: string;
  value: string;
}

export interface CardData {
  title: string;
  subtitle?: string;
  image?: string;
  rating?: number;
  price?: string;
  pros?: string[];
  cons?: string[];
  summary?: string;
  specs?: SpecItem[];
  tags?: string[];
}

export interface CardsComponent extends BaseComponent {
  type: "cards";
  title: string;
  description?: string;
  cards: CardData[];
}

// ============================================================================
// 2. Article Component
// ============================================================================
export interface ArticleComponent extends BaseComponent {
  type: "article";
  title: string;
  subtitle?: string;
  author?: string;
  readTime?: string;
  heroImage?: string;
  content: string; // Markdown content
  keyTakeaways?: string[];
}

// ============================================================================
// 3. Timeline Component
// ============================================================================
export interface TimelineItem {
  date?: string;
  title: string;
  description?: string;
  image?: string;
  icon?: string;
}

export interface TimelineComponent extends BaseComponent {
  type: "timeline";
  title: string;
  description?: string;
  orientation?: "vertical" | "horizontal";
  items: TimelineItem[];
}

// ============================================================================
// 4. Comparison Component
// ============================================================================
export interface ComparisonCategory {
  name: string;
  values: string[];
  highlight?: number; // Index of the highlighted value
}

export interface ComparisonComponent extends BaseComponent {
  type: "comparison";
  title: string;
  description?: string;
  items: string[]; // Column headers
  categories: ComparisonCategory[];
}

// ============================================================================
// 5. FAQ Component
// ============================================================================
export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface FaqComponent extends BaseComponent {
  type: "faq";
  title: string;
  description?: string;
  questions: FaqItem[];
}

// ============================================================================
// 6. Stats Component
// ============================================================================
export interface StatItem {
  value: string;
  label: string;
  trend?: "up" | "down" | "neutral" | "warning";
  icon?: string;
  context?: string;
}

export interface ChartData {
  type: "bar" | "line" | "pie";
  title: string;
  description?: string;
}

export interface StatsComponent extends BaseComponent {
  type: "stats";
  title: string;
  summary?: string;
  stats: StatItem[];
  charts?: ChartData[];
}

// ============================================================================
// 7. Hero Component
// ============================================================================
export interface HeroHighlight {
  icon?: string;
  title: string;
  description: string;
}

export interface HeroCTA {
  text: string;
  url: string;
}

export interface HeroComponent extends BaseComponent {
  type: "hero";
  headline: string;
  subheadline?: string;
  heroImage?: string;
  cta?: HeroCTA;
  highlights?: HeroHighlight[];
  summary?: string;
}

// ============================================================================
// 8. List Component
// ============================================================================
export interface ListItem {
  rank?: number;
  title: string;
  description?: string;
  image?: string;
  tags?: string[];
}

export interface ListComponent extends BaseComponent {
  type: "list";
  title: string;
  description?: string;
  listStyle?: "numbered" | "bulleted" | "featured";
  items: ListItem[];
}

// ============================================================================
// 9. Gallery Component
// ============================================================================
export interface GalleryImage {
  url: string;
  caption?: string;
  credit?: string;
  tags?: string[];
}

export interface GalleryComponent extends BaseComponent {
  type: "gallery";
  title: string;
  description?: string;
  layout?: "grid" | "masonry" | "carousel";
  images: GalleryImage[];
}

// ============================================================================
// 10. Profile Component
// ============================================================================
export interface ProfileStat {
  label: string;
  value: string;
}

export interface ProfileSocial {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  [key: string]: string | undefined;
}

export interface ProfileComponent extends BaseComponent {
  type: "profile";
  name: string;
  title?: string;
  image?: string;
  tagline?: string;
  bio?: string;
  stats?: ProfileStat[];
  highlights?: string[];
  social?: ProfileSocial;
}

// ============================================================================
// 11. Quote Component
// ============================================================================
export interface QuoteComponent extends BaseComponent {
  type: "quote";
  quote: string;
  author?: string;
  context?: string;
  image?: string;
  backgroundImage?: string;
  relatedContent?: string;
}

// ============================================================================
// Union Type for All Components
// ============================================================================
export type DistilledComponent =
  | CardsComponent
  | ArticleComponent
  | TimelineComponent
  | ComparisonComponent
  | FaqComponent
  | StatsComponent
  | HeroComponent
  | ListComponent
  | GalleryComponent
  | ProfileComponent
  | QuoteComponent;

// ============================================================================
// Main Response Type
// ============================================================================
export interface DistilledResponse {
  components: DistilledComponent[];
}

// ============================================================================
// Type Guards
// ============================================================================
export function isCardsComponent(c: DistilledComponent): c is CardsComponent {
  return c.type === "cards";
}

export function isArticleComponent(
  c: DistilledComponent,
): c is ArticleComponent {
  return c.type === "article";
}

export function isTimelineComponent(
  c: DistilledComponent,
): c is TimelineComponent {
  return c.type === "timeline";
}

export function isComparisonComponent(
  c: DistilledComponent,
): c is ComparisonComponent {
  return c.type === "comparison";
}

export function isFaqComponent(c: DistilledComponent): c is FaqComponent {
  return c.type === "faq";
}

export function isStatsComponent(c: DistilledComponent): c is StatsComponent {
  return c.type === "stats";
}

export function isHeroComponent(c: DistilledComponent): c is HeroComponent {
  return c.type === "hero";
}

export function isListComponent(c: DistilledComponent): c is ListComponent {
  return c.type === "list";
}

export function isGalleryComponent(
  c: DistilledComponent,
): c is GalleryComponent {
  return c.type === "gallery";
}

export function isProfileComponent(
  c: DistilledComponent,
): c is ProfileComponent {
  return c.type === "profile";
}

export function isQuoteComponent(c: DistilledComponent): c is QuoteComponent {
  return c.type === "quote";
}
