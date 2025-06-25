/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface WebViewBlockProps {
  block: any;
  entry: any;
}

const WebViewBlock: React.FC<WebViewBlockProps> = ({ block, entry }) => {
  const blockData = block?.block || {};
  const { title, copy, image, layout } = blockData;
  const isImageLeft = layout === "image_left";
  const isHeroFragmentEntry = entry?.title === "Hero Fragment";

  if (isHeroFragmentEntry) {
    const backgroundImageUrl =
      entry.blocks?.[0]?.hero?.background_asset?.url ||
      entry.background_asset?.url ||
      entry.background_image?.url ||
      entry.hero_background?.url ||
      entry.asset?.url ||
      image?.url;

    const descriptionText =
      entry.blocks?.[0]?.hero?.description ||
      entry.blocks?.[0]?.hero?.copy ||
      entry.description ||
      entry.copy ||
      entry.subtitle ||
      entry.hero_description;

    return (
      <div
        className="relative h-80 rounded-lg overflow-hidden shadow-lg border bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: backgroundImageUrl
            ? `url(${backgroundImageUrl})`
            : "linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white p-8 max-w-2xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            {...entry.$.title}
          >
            {entry.title || "[Headline]"}
          </h1>

          {descriptionText && (
            <p
              className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed"
              {...entry.$.description}
            >
              {descriptionText || "[Description]"}
            </p>
          )}

          <button
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            {...(entry.$?.button_text ?? entry.$?.cta_text ?? {})}
          >
            {entry.button_text || entry.cta_text || "Button Text"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-4 p-4 bg-white rounded-lg shadow-sm border ${
        isImageLeft ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <div className="flex-shrink-0 w-24 h-24">
        <img
          src={image?.url || ""}
          alt={image?.title || title || "Block image"}
          className="w-full h-full object-cover rounded-lg"
          {...blockData.$.image}
        />
      </div>
      <div className="flex-1">
        <h3
          className="text-lg font-semibold text-gray-900 mb-2"
          {...blockData.$.title}
        >
          {title || "Untitled Block"}
        </h3>
        <div
          className="text-gray-700 prose prose-sm text-sm"
          {...blockData.$.copy}
          dangerouslySetInnerHTML={{ __html: copy || "No content available" }}
        />
      </div>
    </div>
  );
};

export default WebViewBlock;
