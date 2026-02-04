import type {
    DistilledComponent,
    DistilledResponse,
} from "@/types/distilled-content";
import { Share } from "react-native";

/**
 * Convert distilled content to a plain text format for sharing
 */
export function distilledToText(
  data: DistilledResponse,
  sourceUrl?: string,
): string {
  if (!data.components || data.components.length === 0) {
    return "No content available";
  }

  const lines: string[] = [];

  for (const component of data.components) {
    const componentText = componentToText(component);
    if (componentText) {
      lines.push(componentText);
      lines.push(""); // Empty line between components
    }
  }

  // Add source URL at the end if provided
  if (sourceUrl) {
    lines.push("---");
    lines.push(`Source: ${sourceUrl}`);
    lines.push("");
    lines.push("Distilled with Distill ✨");
  }

  return lines.join("\n").trim();
}

/**
 * Convert a single component to text
 */
function componentToText(component: DistilledComponent): string {
  const lines: string[] = [];

  switch (component.type) {
    case "article":
      if (component.title) lines.push(`📰 ${component.title}`);
      if (component.subtitle) lines.push(component.subtitle);
      if (component.author || component.readTime) {
        const meta = [
          component.author ? `By ${component.author}` : "",
          component.readTime || "",
        ]
          .filter(Boolean)
          .join(" • ");
        if (meta) lines.push(meta);
      }
      lines.push("");
      if (component.keyTakeaways?.length) {
        lines.push("Key Takeaways:");
        component.keyTakeaways.forEach((t) => lines.push(`  → ${t}`));
        lines.push("");
      }
      if (component.content) {
        // Strip markdown formatting for plain text
        const plainContent = component.content
          .replace(/#{1,6}\s+/g, "")
          .replace(/\*\*/g, "")
          .replace(/\*/g, "")
          .replace(/`/g, "")
          .replace(/!\[.*?\]\(.*?\)/g, "[image]");
        lines.push(plainContent);
      }
      break;

    case "cards":
      if (component.title) lines.push(`🎴 ${component.title}`);
      if (component.description) lines.push(component.description);
      lines.push("");
      component.cards?.forEach((card, i) => {
        lines.push(`${i + 1}. ${card.title}`);
        if (card.subtitle) lines.push(`   ${card.subtitle}`);
        if (card.summary) lines.push(`   ${card.summary}`);
        if (card.rating) lines.push(`   ⭐ ${card.rating.toFixed(1)}`);
        if (card.price) lines.push(`   💰 ${card.price}`);
        if (card.pros?.length) {
          card.pros.forEach((p) => lines.push(`   ✓ ${p}`));
        }
        if (card.cons?.length) {
          card.cons.forEach((c) => lines.push(`   ✗ ${c}`));
        }
        lines.push("");
      });
      break;

    case "hero":
      if (component.headline) lines.push(`🌟 ${component.headline}`);
      if (component.subheadline) lines.push(component.subheadline);
      if (component.summary) lines.push(component.summary);
      if (component.highlights?.length) {
        lines.push("");
        component.highlights.forEach((h) => {
          lines.push(`  ${h.icon || "•"} ${h.title}: ${h.description}`);
        });
      }
      break;

    case "stats":
      if (component.title) lines.push(`📊 ${component.title}`);
      if (component.summary) lines.push(component.summary);
      lines.push("");
      component.stats?.forEach((stat) => {
        const trend =
          stat.trend === "up" ? "↑" : stat.trend === "down" ? "↓" : "";
        lines.push(`  ${stat.label}: ${stat.value} ${trend}`);
        if (stat.context) lines.push(`    ${stat.context}`);
      });
      break;

    case "timeline":
      if (component.title) lines.push(`📅 ${component.title}`);
      if (component.description) lines.push(component.description);
      lines.push("");
      component.items?.forEach((item, i) => {
        const date = item.date ? `[${item.date}] ` : "";
        lines.push(`  ${date}${item.title}`);
        if (item.description) lines.push(`    ${item.description}`);
      });
      break;

    case "faq":
      if (component.title) lines.push(`❓ ${component.title}`);
      if (component.description) lines.push(component.description);
      lines.push("");
      component.questions?.forEach((q, i) => {
        lines.push(`Q: ${q.question}`);
        lines.push(`A: ${q.answer}`);
        lines.push("");
      });
      break;

    case "comparison":
      if (component.title) lines.push(`⚖️ ${component.title}`);
      if (component.description) lines.push(component.description);
      lines.push("");
      if (component.items?.length) {
        lines.push(`Comparing: ${component.items.join(" vs ")}`);
      }
      component.categories?.forEach((cat) => {
        lines.push(`  ${cat.name}: ${cat.values.join(" | ")}`);
      });
      break;

    case "list":
      if (component.title) lines.push(`📋 ${component.title}`);
      if (component.description) lines.push(component.description);
      lines.push("");
      component.items?.forEach((item, i) => {
        const prefix =
          component.listStyle === "numbered" ? `${item.rank || i + 1}.` : "•";
        lines.push(`${prefix} ${item.title}`);
        if (item.description) lines.push(`   ${item.description}`);
      });
      break;

    case "profile":
      if (component.name) lines.push(`👤 ${component.name}`);
      if (component.title) lines.push(component.title);
      if (component.tagline) lines.push(`"${component.tagline}"`);
      if (component.bio) {
        lines.push("");
        lines.push(component.bio);
      }
      if (component.stats?.length) {
        lines.push("");
        component.stats.forEach((s) => lines.push(`  ${s.label}: ${s.value}`));
      }
      break;

    case "quote":
      lines.push(`💬 "${component.quote}"`);
      if (component.author) lines.push(`   — ${component.author}`);
      if (component.context) lines.push(`   ${component.context}`);
      break;

    case "gallery":
      if (component.title) lines.push(`🖼️ ${component.title}`);
      if (component.description) lines.push(component.description);
      if (component.images?.length) {
        lines.push(`  ${component.images.length} images`);
      }
      break;

    default:
      // For unknown types, try to extract any title
      if ("title" in component) {
        lines.push(String((component as { title?: string }).title || ""));
      }
  }

  return lines.join("\n");
}

/**
 * Share distilled content using the native share dialog
 */
export async function shareDistilledContent(
  data: DistilledResponse,
  sourceUrl?: string,
): Promise<void> {
  try {
    const text = distilledToText(data, sourceUrl);

    await Share.share({
      message: text,
      title: "Share Distilled Content",
    });
  } catch (error) {
    console.error("Error sharing content:", error);
    throw error;
  }
}
