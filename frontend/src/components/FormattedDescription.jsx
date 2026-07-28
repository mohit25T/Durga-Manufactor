import React from "react";
import { CheckCircle2 } from "lucide-react";

/**
 * Normalizes text containing unformatted or raw markdown elements
 * into cleanly separated blocks with newlines.
 */
function normalizeDescriptionText(text) {
  if (!text || typeof text !== "string") return "";

  let str = text;

  // 1. Separate headers like ### or ##
  str = str.replace(/(###|##|#)\s*/g, "\n\n### ");

  // 2. Separate bullet points like * **Feature:** or • **Feature:**
  str = str.replace(/([.!?]|:)?\s*([*•-]|(?:\d+\.))\s*\*\*/g, "$1\n\n• **");

  // 3. Separate section titles if stuck after text
  str = str.replace(
    /([.!?])\s*(Key Features & Technical Specifications:|\*\*Key Features & Technical Specifications:\*\*)/gi,
    "$1\n\n$2"
  );

  // 4. Separate closing statements if stuck after last bullet
  str = str.replace(
    /(\.)\s*(Invest in|Manufactured with|Backed by Durga|Designed for commercial)/gi,
    "$1\n\n$2"
  );

  // 5. Replace multiple consecutive newlines with clean double newlines
  str = str.replace(/\n{3,}/g, "\n\n");

  return str.trim();
}

/**
 * Renders inline markdown text, turning **bold text** into styled bold tags
 * and highlighting key feature names.
 */
function renderFormattedInline(text) {
  if (!text) return null;

  // Split by bold pattern **text**
  const parts = text.split(/\*\*(.*?)\*\*/g);

  return parts.map((part, index) => {
    if (index % 2 === 1) {
      // Bold text segment
      const isHeaderPrefix = part.endsWith(":");
      return (
        <strong
          key={index}
          className={`font-bold ${
            isHeaderPrefix
              ? "text-brand-forest font-sans tracking-tight pr-1"
              : "text-brand-charcoal"
          }`}
        >
          {part}
        </strong>
      );
    }
    // Normal text segment
    return <span key={index}>{part}</span>;
  });
}

/**
 * Premium Formatted Description Component
 * Renders product descriptions with rich typography, bold highlighting,
 * section headings, and custom styled bullet points.
 */
export default function FormattedDescription({ description, className = "" }) {
  if (!description) return null;

  const normalized = normalizeDescriptionText(description);
  const lines = normalized
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className={`space-y-3 font-sans text-brand-charcoal ${className}`}>
      {lines.map((line, idx) => {
        // Check if line is a header (starts with ### or **Key Features...** or ends with :)
        const isHeader =
          line.startsWith("###") ||
          line.startsWith("##") ||
          line.toLowerCase().includes("key features") ||
          (line.startsWith("**") && line.endsWith("**") && line.length < 60);

        // Check if line is a bullet item
        const isBullet =
          line.startsWith("•") ||
          line.startsWith("*") ||
          line.startsWith("-") ||
          /^\d+\./.test(line);

        if (isHeader) {
          const cleanHeadingText = line
            .replace(/^#+\s*/, "")
            .replace(/^\*\*/, "")
            .replace(/\*\*$/, "")
            .trim();

          return (
            <h4
              key={idx}
              className="font-serif text-base md:text-lg font-bold text-brand-forest mt-5 mb-3 flex items-center gap-2.5 border-b border-brand-sand/60 pb-2 tracking-tight"
            >
              <CheckCircle2 className="w-4.5 h-4.5 text-brand-forest shrink-0" />
              <span>{cleanHeadingText}</span>
            </h4>
          );
        }

        if (isBullet) {
          const cleanBulletText = line
            .replace(/^[*•-]\s*/, "")
            .replace(/^\d+\.\s*/, "")
            .trim();

          return (
            <div
              key={idx}
              className="flex items-start gap-3 my-2 pl-1.5 py-1.5 rounded-lg bg-stone-50/60 border border-stone-200/50 hover:bg-brand-sage/10 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-brand-forest shrink-0 mt-2.5 shadow-sm" />
              <div className="text-xs md:text-sm text-brand-charcoal leading-relaxed flex-grow">
                {renderFormattedInline(cleanBulletText)}
              </div>
            </div>
          );
        }

        // Regular paragraph block
        return (
          <p
            key={idx}
            className="text-xs md:text-sm text-brand-charcoal/90 font-medium leading-relaxed mb-3"
          >
            {renderFormattedInline(line)}
          </p>
        );
      })}
    </div>
  );
}
