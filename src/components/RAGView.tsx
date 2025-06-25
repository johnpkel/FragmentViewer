/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { stripHtml } from "../utils/stringUtils";

interface RAGViewProps {
  block: any;
  entry: any;
}

const RAGView: React.FC<RAGViewProps> = ({ block, entry }) => {
  // Check if this is the "Hero Fragment" entry
  const isHeroFragmentEntry = entry?.title === "Hero Fragment";

  // If this is the Hero Fragment entry, provide hero-specific interpretation
  if (isHeroFragmentEntry) {
    const backgroundImageUrl =
      entry.blocks?.[0]?.hero?.background_asset?.url ||
      entry.background_asset?.url ||
      entry.background_image?.url ||
      entry.hero_background?.url ||
      entry.asset?.url;

    const descriptionText =
      entry.blocks?.[0]?.hero?.description ||
      entry.blocks?.[0]?.hero?.copy ||
      entry.description ||
      entry.copy ||
      entry.subtitle ||
      entry.hero_description;

    const cleanDescription = descriptionText
      ? stripHtml(descriptionText)
      : "No description available";
    const heroTitle = entry.headline || entry.title || "Hero Fragment";

    const interpretation = `This content block represents a "${heroTitle}" section designed to inform users about ${heroTitle.toLowerCase()}. The block contains:

• A primary heading: "${heroTitle}"
• Descriptive content explaining: ${cleanDescription.substring(0, 100)}${
      cleanDescription.length > 100 ? "..." : ""
    }
• Visual support through a background image${
      backgroundImageUrl
        ? " with URL: " + backgroundImageUrl
        : " (no image available)"
    }
• Call-to-action button with text: "${
      entry.button_text || entry.cta_text || "Button Text"
    }"

This block serves as a hero component that combines prominent textual content with visual background elements to engage users and communicate key information about the topic. The structured layout ensures consistent presentation across different platforms while maintaining readability and visual appeal.`;

    return (
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          Natural Language Interpretation
        </h4>
        <div className="text-sm text-blue-800 leading-relaxed">
          {interpretation}
        </div>
      </div>
    );
  }

  // Safely access block properties with fallbacks for regular blocks
  const blockData = block?.block || {};
  const { title, copy, image, layout } = blockData;

  if (!blockData || Object.keys(blockData).length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          Natural Language Interpretation
        </h4>
        <div className="text-sm text-gray-600 leading-relaxed">
          No block data available for interpretation.
        </div>
      </div>
    );
  }

  const cleanCopy = copy ? stripHtml(copy) : "No content available";
  const blockTitle = title || "Untitled Block";

  const interpretation = `This content block represents a "${blockTitle}" section designed to inform users about ${blockTitle.toLowerCase()}. The block contains:

• A primary heading: "${blockTitle}"
• Descriptive content explaining: ${cleanCopy.substring(0, 100)}${
    cleanCopy.length > 100 ? "..." : ""
  }
• Visual support through an image titled "${image?.title || "supporting image"}"
• Layout configuration set to "${
    layout || "default"
  }" for optimal visual presentation

This block serves as an informational component that combines textual content with visual elements to engage users and communicate key information about the topic. The structured layout ensures consistent presentation across different platforms while maintaining readability and visual appeal.`;

  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="text-sm font-semibold text-blue-900 mb-2">
        Natural Language Interpretation
      </h4>
      <div className="text-sm text-blue-800 leading-relaxed">
        {interpretation}
      </div>
    </div>
  );
};

export default RAGView;
