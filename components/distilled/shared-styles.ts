// Shared styles and constants for distilled components
import { StyleSheet } from "react-native";

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const COLORS = {
  surface: "rgba(255,255,255,0.04)",
  surfaceHighlight: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.08)",
  borderLight: "rgba(255,255,255,0.12)",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.7)",
  textMuted: "rgba(255,255,255,0.5)",
  accent: "#0A84FF",
  accentSoft: "rgba(10,132,255,0.15)",
  success: "#30D158",
  successSoft: "rgba(48,209,88,0.15)",
  warning: "#FFD60A",
  warningSoft: "rgba(255,214,10,0.15)",
  danger: "#FF453A",
  dangerSoft: "rgba(255,69,58,0.15)",
  overlay: "rgba(0,0,0,0.5)",
  overlayLight: "rgba(0,0,0,0.35)",
};

export const FONTS = {
  regular: undefined, // Uses system default
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const sharedStyles = StyleSheet.create({
  // Section containers
  section: {
    marginBottom: SPACING.xl,
  },

  // Card-like containers
  card: {
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },

  // Typography
  sectionTitle: {
    fontSize: 24,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  sectionDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },

  // Chips/Tags
  chip: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceHighlight,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.textPrimary,
  },

  // Images
  image: {
    width: "100%",
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
  },

  // Content padding
  padding: {
    padding: SPACING.lg,
  },
  paddingHorizontal: {
    paddingHorizontal: SPACING.lg,
  },
  paddingVertical: {
    paddingVertical: SPACING.lg,
  },
});

// Rating star helper
export function renderRatingStars(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars)
  );
}

// Trend icon helper
export function getTrendIcon(
  trend?: "up" | "down" | "neutral" | "warning",
): string {
  switch (trend) {
    case "up":
      return "↑";
    case "down":
      return "↓";
    case "warning":
      return "⚠️";
    default:
      return "→";
  }
}

// Trend color helper
export function getTrendColor(
  trend?: "up" | "down" | "neutral" | "warning",
): string {
  switch (trend) {
    case "up":
      return COLORS.success;
    case "down":
      return COLORS.danger;
    case "warning":
      return COLORS.warning;
    default:
      return COLORS.textSecondary;
  }
}

// Icon name to emoji mapping
const ICON_MAP: Record<string, string> = {
  // Common stats/metrics
  chart: "📊",
  graph: "📈",
  trending: "📈",
  analytics: "📊",
  stats: "📊",
  growth: "📈",
  decline: "📉",

  // People/Users
  user: "👤",
  users: "👥",
  people: "👥",
  team: "👥",
  person: "👤",
  profile: "👤",

  // Money/Finance
  money: "💰",
  dollar: "💵",
  currency: "💰",
  price: "💲",
  revenue: "💰",
  profit: "💵",
  cost: "💸",
  budget: "💰",

  // Time
  time: "⏱️",
  clock: "🕐",
  calendar: "📅",
  date: "📅",
  schedule: "📆",
  duration: "⏱️",

  // Technology
  code: "💻",
  computer: "💻",
  laptop: "💻",
  phone: "📱",
  mobile: "📱",
  server: "🖥️",
  database: "🗄️",
  cloud: "☁️",

  // Communication
  email: "📧",
  message: "💬",
  chat: "💬",
  notification: "🔔",
  bell: "🔔",

  // Status
  check: "✅",
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
  question: "❓",

  // Objects
  star: "⭐",
  heart: "❤️",
  like: "👍",
  fire: "🔥",
  lightning: "⚡",
  target: "🎯",
  flag: "🚩",
  bookmark: "🔖",
  pin: "📌",

  // Navigation/Actions
  home: "🏠",
  settings: "⚙️",
  search: "🔍",
  filter: "🔍",
  edit: "✏️",
  delete: "🗑️",
  add: "➕",
  remove: "➖",
  link: "🔗",
  share: "📤",
  download: "📥",
  upload: "📤",

  // Documents
  file: "📄",
  document: "📄",
  folder: "📁",
  image: "🖼️",
  photo: "📷",
  video: "🎬",
  music: "🎵",

  // Business
  business: "💼",
  briefcase: "💼",
  company: "🏢",
  building: "🏢",
  shop: "🏪",
  store: "🛒",
  cart: "🛒",

  // Location
  location: "📍",
  map: "🗺️",
  globe: "🌍",
  world: "🌍",

  // Misc
  gift: "🎁",
  rocket: "🚀",
  trophy: "🏆",
  medal: "🏅",
  crown: "👑",
  gem: "💎",
  lock: "🔒",
  unlock: "🔓",
  key: "🔑",
  tool: "🔧",
  wrench: "🔧",
  hammer: "🔨",
  light: "💡",
  idea: "💡",
  bulb: "💡",
};

// Get emoji from icon name (case insensitive, with fallback)
export function getIconEmoji(iconName?: string): string {
  if (!iconName) return "";

  // If it's already an emoji (starts with a unicode emoji char), return as is
  const emojiRegex =
    /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  if (emojiRegex.test(iconName)) return iconName;

  const normalized = iconName.toLowerCase().trim();
  return ICON_MAP[normalized] || "📌"; // Default fallback
}
