/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { stripHtml } from "../utils/stringUtils";

interface MobileViewBlockProps {
  block: any;
  entry: any;
}

const MobileViewBlock: React.FC<MobileViewBlockProps> = ({ block, entry }) => {
  const isHeroFragmentEntry = entry?.title === "Hero Fragment";

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

    return (
      <div className="w-48 mx-auto bg-white rounded-lg shadow-lg border overflow-hidden">
        <div className="bg-black rounded-t-lg h-6 flex items-center justify-center">
          <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
        </div>
        <div
          className="relative h-32 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: backgroundImageUrl
              ? `url(${backgroundImageUrl})`
              : "linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 text-white p-3 h-full flex flex-col justify-center">
            <h3
              className="text-sm font-bold mb-2 leading-tight"
              {...entry.$.title}
            >
              {entry.headline || entry.title || "[Headline]"}
            </h3>
            {descriptionText && (
              <p
                className="text-xs opacity-90 mb-2 leading-tight"
                {...entry.$.description}
              >
                {typeof descriptionText === "string"
                  ? stripHtml(descriptionText).substring(0, 60) + "..."
                  : "[Description]"}
              </p>
            )}
            <button
              className="bg-transparent border border-white text-white text-xs py-1 px-2 rounded text-center inline-block"
              {...(entry.$?.button_text ?? entry.$?.cta_text ?? {})}
            >
              {entry.button_text || entry.cta_text || "Button"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Safely access block properties with fallbacks for regular blocks
  const blockData = block?.block || {};
  const { title, copy, image } = blockData;

  return (
    <div className="w-48 mx-auto bg-white rounded-lg shadow-lg border overflow-hidden">
      {/* Mobile phone frame */}
      <div className="bg-black rounded-t-lg h-6 flex items-center justify-center">
        <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
      </div>
      <div className="p-3 space-y-3">
        <h3
          className="text-sm font-semibold text-gray-900"
          {...blockData.$.title}
        >
          {title || "Untitled Block"}
        </h3>
        <div className="w-full h-20">
          <img
            src={image?.url || ""}
            alt={image?.title || title || "Block image"}
            className="w-full h-full object-cover rounded"
            {...blockData.$.image}
            onError={(e) => {
              const imgElement = e.target as HTMLImageElement;
              imgElement.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA4QzEzLjEgOCAxNCA4LjkgMTQgMTBDMTQgMTEuMSAxMy4xIDEyIDEyIDEyQzEwLjkgMTIgMTAgMTEuMSAxMCAxMEMxMCA4LjkgMTAuOSA4IDEyIDhaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMSAxOVYxN0MyMSAxNS45IDIwLjEgMTUgMTkgMTVIMTdMMTUuNSAxMy41QzE1LjEgMTMuMSAxNC40IDEzLjEgMTQgMTMuNUwxMiAxNS41TDkuNSAxM0M5LjEgMTIuNiA4LjQgMTIuNiA4IDEzTDUgMTZIM0MyIDMuOTcgMy45NyAzIDUgM0gxOUMyMC4wMyAzIDIxIDMuOTcgMjEgNVYxOVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
            }}
          />
        </div>
        <div
          className="text-xs text-gray-700 leading-tight"
          {...blockData.$.copy}
        >
          {copy
            ? stripHtml(copy).substring(0, 120) + "..."
            : "No content available"}
        </div>
      </div>
    </div>
  );
};

export default MobileViewBlock;
