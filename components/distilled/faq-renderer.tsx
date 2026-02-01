import type { FaqComponent } from "@/types/distilled-content";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BORDER_RADIUS, COLORS, SPACING, sharedStyles } from "./shared-styles";

interface FaqRendererProps {
  data: FaqComponent;
}

function FaqItem({
  question,
  answer,
  category,
}: {
  question: string;
  answer: string;
  category?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Pressable
      style={styles.faqItem}
      onPress={() => setIsExpanded(!isExpanded)}
    >
      <View style={styles.questionRow}>
        <View style={styles.questionContent}>
          {category && <Text style={styles.category}>{category}</Text>}
          <Text style={styles.question}>{question}</Text>
        </View>
        <Text style={styles.expandIcon}>{isExpanded ? "−" : "+"}</Text>
      </View>
      {isExpanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answer}>{answer}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function FaqRenderer({ data }: FaqRendererProps) {
  // Group questions by category if categories exist
  const groupedQuestions = data.questions.reduce(
    (acc, q) => {
      const cat = q.category || "General";
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push(q);
      return acc;
    },
    {} as Record<string, typeof data.questions>,
  );

  const hasCategories =
    Object.keys(groupedQuestions).length > 1 ||
    (Object.keys(groupedQuestions).length === 1 &&
      !groupedQuestions["General"]);

  return (
    <View style={sharedStyles.section}>
      {data.title && (
        <Text style={sharedStyles.sectionTitle}>{data.title}</Text>
      )}
      {data.description && (
        <Text style={sharedStyles.sectionDescription}>{data.description}</Text>
      )}

      <View style={styles.faqContainer}>
        {hasCategories
          ? // Render grouped by category
            Object.entries(groupedQuestions).map(
              ([category, questions], groupIndex) => (
                <View key={`group-${groupIndex}`} style={styles.categoryGroup}>
                  <Text style={styles.categoryHeader}>{category}</Text>
                  {questions.map((q, index) => (
                    <FaqItem
                      key={`faq-${groupIndex}-${index}`}
                      question={q.question}
                      answer={q.answer}
                    />
                  ))}
                </View>
              ),
            )
          : // Render flat list
            data.questions.map((q, index) => (
              <FaqItem
                key={`faq-${index}`}
                question={q.question}
                answer={q.answer}
                category={q.category}
              />
            ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  faqContainer: {
    gap: SPACING.md,
  },
  categoryGroup: {
    gap: SPACING.sm,
  },
  categoryHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.accent,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  faqItem: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  questionContent: {
    flex: 1,
  },
  category: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: "500",
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  expandIcon: {
    fontSize: 24,
    color: COLORS.textMuted,
    fontWeight: "300",
  },
  answerContainer: {
    padding: SPACING.lg,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  answer: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
    paddingTop: SPACING.md,
  },
});
