import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Contentstack configuration
const stackConfig = {
  api_key: 'blt80dc93420b90938f',
  delivery_token: 'cs39d0b8027160dbc7a2dfc680', 
  environment: 'preview',
  region: 'us'
};

const ContentstackViewer = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntriesFromContentstack = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all entries for the 'page' content type
      const response = await fetch(
        `https://cdn.contentstack.io/v3/content_types/page/entries?environment=${stackConfig.environment}&live_preview=true&include_fallback=true`,
        {
          headers: {
            'api_key': stackConfig.api_key,
            'access_token': stackConfig.delivery_token,
            'branch': 'main'
          },
          // Prevent caching to always get fresh content
          cache: 'no-store'
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Contentstack Response:', data);

      if (data && data.entries && data.entries.length > 0) {
        setEntries(data.entries);
      } else {
        setError('No entries found');
      }
    } catch (err) {
      console.error('Error fetching from Contentstack:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch content on initial load
  useEffect(() => {
    fetchEntriesFromContentstack();
  }, [fetchEntriesFromContentstack]);

  const stripHtml = (html) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const WebViewBlock = ({ block, entry }) => {
    // Safely access block properties with fallbacks
    const blockData = block?.block || {};
    const { title, copy, image, layout } = blockData;
    const isImageLeft = layout === 'image_left';
    
    // Check if this is the "Hero Fragment" entry
    const isHeroFragmentEntry = entry?.title === 'Hero Fragment';
    
    // If this is the Hero Fragment entry, render as hero component using entry fields
    if (isHeroFragmentEntry) {
      // Add debugging to check the blocks structure
      console.log('=== Hero Fragment Debugging ===');
      console.log('Full entry:', entry);
      console.log('Entry blocks:', entry.blocks);
      
      if (entry.blocks && entry.blocks[0]) {
        console.log('First block:', entry.blocks[0]);
        if (entry.blocks[0].hero) {
          console.log('Hero block exists:', entry.blocks[0].hero);
          console.log('Background asset:', entry.blocks[0].hero.background_asset);
          console.log('Background asset URL:', entry.blocks[0].hero.background_asset?.url);
        }
      }
      
      // Try different possible field names for background asset, including the blocks structure
      const backgroundImageUrl = entry.blocks?.[0]?.hero?.background_asset?.url ||
                                entry.background_asset?.url || 
                                entry.background_image?.url || 
                                entry.hero_background?.url ||
                                entry.asset?.url ||
                                image?.url;

      // Try different possible field names for description
      const descriptionText = entry.blocks?.[0]?.hero?.description ||
                            entry.blocks?.[0]?.hero?.copy ||
                            entry.description || 
                            entry.copy || 
                            entry.subtitle || 
                            entry.hero_description;

      console.log('Hero Fragment Entry:', entry);
      console.log('Background Image URL:', backgroundImageUrl);
      console.log('Description Text:', descriptionText);

      return (
        <div 
          className="relative h-80 rounded-lg overflow-hidden shadow-lg border bg-cover bg-center bg-no-repeat flex items-center justify-center"
          style={{ 
            backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 
                           'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 text-center text-white p-8 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {entry.headline || entry.title || '[Headline]'}
            </h1>
            
            {descriptionText && (
              <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
                {typeof descriptionText === 'string' ? stripHtml(descriptionText) : '[Description]'}
              </p>
            )}
            
            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              {entry.button_text || entry.cta_text || 'Button Text'}
            </button>
          </div>
        </div>
      );
    }
    
    // If no block data, show a placeholder
    if (!blockData || Object.keys(blockData).length === 0) {
      return (
        <div className="flex gap-4 p-4 bg-gray-100 rounded-lg border">
          <div className="text-gray-500 text-sm">No block data available</div>
        </div>
      );
    }
    
    return (
      <div className={`flex gap-4 p-4 bg-white rounded-lg shadow-sm border ${isImageLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className="flex-shrink-0 w-24 h-24">
          <img 
            src={image?.url || ''} 
            alt={image?.title || title || 'Block image'}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA4QzEzLjEgOCAxNCA4LjkgMTQgMTBDMTQgMTEuMSAxMy4xIDEyIDEyIDEyQzEwLjkgMTIgMTAgMTEuMSAxMCAxMEMxMCA4LjkgMTAuOSA4IDEyIDhaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ek0yMSAxOVYxN0MyMSAxNS45IDIwLjEgMTUgMTkgMTVIMTdMMTUuNSAxMy41QzE1LjEgMTMuMSAxNC40IDEzLjEgMTQgMTMuNUwxMiAxNS41TDkuNSAxM0M5LjEgMTIuNiA4LjQgMTIuNiA4IDEzTDUgMTZIM0MyIDMuOTcgMy45NyAzIDUgM0gxOUMyMC4wMyAzIDIxIDMuOTcgMjEgNVYxOVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
            }}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title || 'Untitled Block'}</h3>
          <div 
            className="text-gray-700 prose prose-sm text-sm"
            dangerouslySetInnerHTML={{ __html: copy || 'No content available' }}
          />
        </div>
      </div>
    );
  };

  const MobileViewBlock = ({ block, entry }) => {
    // Check if this is the "Hero Fragment" entry
    const isHeroFragmentEntry = entry?.title === 'Hero Fragment';
    
    // If this is the Hero Fragment entry, render as mobile hero
    if (isHeroFragmentEntry) {
      // Get the background image and content from the hero entry
      const backgroundImageUrl = entry.blocks?.[0]?.hero?.background_asset?.url ||
                                entry.background_asset?.url || 
                                entry.background_image?.url || 
                                entry.hero_background?.url ||
                                entry.asset?.url;

      const descriptionText = entry.blocks?.[0]?.hero?.description ||
                            entry.blocks?.[0]?.hero?.copy ||
                            entry.description || 
                            entry.copy || 
                            entry.subtitle || 
                            entry.hero_description;

      return (
        <div className="w-48 mx-auto bg-white rounded-lg shadow-lg border overflow-hidden">
          {/* Mobile phone frame */}
          <div className="bg-black rounded-t-lg h-6 flex items-center justify-center">
            <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
          </div>
          {/* Mobile Hero Content */}
          <div 
            className="relative h-32 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 
                             'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="relative z-10 text-white p-3 h-full flex flex-col justify-center">
              <h3 className="text-sm font-bold mb-2 leading-tight">
                {entry.headline || entry.title || '[Headline]'}
              </h3>
              {descriptionText && (
                <p className="text-xs opacity-90 mb-2 leading-tight">
                  {typeof descriptionText === 'string' ? 
                    stripHtml(descriptionText).substring(0, 60) + '...' : 
                    '[Description]'}
                </p>
              )}
              <button className="bg-transparent border border-white text-white text-xs py-1 px-2 rounded text-center inline-block">
                {entry.button_text || entry.cta_text || 'Button'}
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Safely access block properties with fallbacks for regular blocks
    const blockData = block?.block || {};
    const { title, copy, image } = blockData;
    
    // If no block data, show a placeholder
    if (!blockData || Object.keys(blockData).length === 0) {
      return (
        <div className="w-48 mx-auto bg-gray-100 rounded-lg shadow-lg border overflow-hidden">
          <div className="bg-black rounded-t-lg h-6 flex items-center justify-center">
            <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
          </div>
          <div className="p-3 space-y-3">
            <div className="text-xs text-gray-500">No block data available</div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="w-48 mx-auto bg-white rounded-lg shadow-lg border overflow-hidden">
        {/* Mobile phone frame */}
        <div className="bg-black rounded-t-lg h-6 flex items-center justify-center">
          <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
        </div>
        <div className="p-3 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">{title || 'Untitled Block'}</h3>
          <div className="w-full h-20">
            <img 
              src={image?.url || ''} 
              alt={image?.title || title || 'Block image'}
              className="w-full h-full object-cover rounded"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA4QzEzLjEgOCAxNCA4LjkgMTQgMTBDMTQgMTEuMSAxMy4xIDEyIDEyIDEyQzEwLjkgMTIgMTAgMTEuMSAxMCAxMEMxMCA4LjkgMTAuOSA4IDEyIDhaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMSAxOVYxN0MyMSAxNS45IDIwLjEgMTUgMTkgMTVIMTdMMTUuNSAxMy41QzE1LjEgMTMuMSAxNC40IDEzLjEgMTQgMTMuNUwxMiAxNS41TDkuNSAxM0M5LjEgMTIuNiA4LjQgMTIuNiA4IDEzTDUgMTZIM0MyIDMuOTcgMy45NyAzIDUgM0gxOUMyMC4wMyAzIDIxIDMuOTcgMjEgNVYxOVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
              }}
            />
          </div>
          <div className="text-xs text-gray-700 leading-tight">
            {copy ? stripHtml(copy).substring(0, 120) + '...' : 'No content available'}
          </div>
        </div>
      </div>
    );
  };

  const AgentforceView = ({ block }) => {
    // Safely access block properties
    const blockData = block?.block || block || {};
    
    return (
      <div className="bg-gray-900 rounded-lg p-3 h-full">
        <div className="mb-2">
          <span className="text-yellow-400 text-xs font-mono">JSON</span>
        </div>
        <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap overflow-auto max-h-64">
          {JSON.stringify(blockData, null, 2)}
        </pre>
      </div>
    );
  };

  const RAGView = ({ block, entry }) => {
    // Check if this is the "Hero Fragment" entry
    const isHeroFragmentEntry = entry?.title === 'Hero Fragment';
    
    // If this is the Hero Fragment entry, provide hero-specific interpretation
    if (isHeroFragmentEntry) {
      const backgroundImageUrl = entry.blocks?.[0]?.hero?.background_asset?.url ||
                                entry.background_asset?.url || 
                                entry.background_image?.url || 
                                entry.hero_background?.url ||
                                entry.asset?.url;

      const descriptionText = entry.blocks?.[0]?.hero?.description ||
                            entry.blocks?.[0]?.hero?.copy ||
                            entry.description || 
                            entry.copy || 
                            entry.subtitle || 
                            entry.hero_description;

      const cleanDescription = descriptionText ? stripHtml(descriptionText) : 'No description available';
      const heroTitle = entry.headline || entry.title || 'Hero Fragment';
      
      const interpretation = `This content block represents a "${heroTitle}" section designed to inform users about ${heroTitle.toLowerCase()}. The block contains:

• A primary heading: "${heroTitle}"
• Descriptive content explaining: ${cleanDescription.substring(0, 100)}${cleanDescription.length > 100 ? '...' : ''}
• Visual support through a background image${backgroundImageUrl ? ' with URL: ' + backgroundImageUrl : ' (no image available)'}
• Call-to-action button with text: "${entry.button_text || entry.cta_text || 'Button Text'}"

This block serves as a hero component that combines prominent textual content with visual background elements to engage users and communicate key information about the topic. The structured layout ensures consistent presentation across different platforms while maintaining readability and visual appeal.`;

      return (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Natural Language Interpretation</h4>
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
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Natural Language Interpretation</h4>
          <div className="text-sm text-gray-600 leading-relaxed">
            No block data available for interpretation.
          </div>
        </div>
      );
    }
    
    const cleanCopy = copy ? stripHtml(copy) : 'No content available';
    const blockTitle = title || 'Untitled Block';
    
    const interpretation = `This content block represents a "${blockTitle}" section designed to inform users about ${blockTitle.toLowerCase()}. The block contains:

• A primary heading: "${blockTitle}"
• Descriptive content explaining: ${cleanCopy.substring(0, 100)}${cleanCopy.length > 100 ? '...' : ''}
• Visual support through an image titled "${image?.title || 'supporting image'}"
• Layout configuration set to "${layout || 'default'}" for optimal visual presentation

This block serves as an informational component that combines textual content with visual elements to engage users and communicate key information about the topic. The structured layout ensures consistent presentation across different platforms while maintaining readability and visual appeal.`;

    return (
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Natural Language Interpretation</h4>
        <div className="text-sm text-blue-800 leading-relaxed">
          {interpretation}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Contentstack entries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-4">
          <div className="text-red-500 text-xl mb-4">Error Loading Entries</div>
          <div className="text-gray-700 mb-4">{error}</div>
          <div className="text-sm text-gray-500">
            Please check your Contentstack configuration and make sure entries exist.
          </div>
        </div>
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-700">No entries found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Contentstack Modular Blocks Viewer</h1>
          <p className="text-gray-600">Stack: {stackConfig.api_key}</p>
          <div className="mt-2 text-sm text-gray-500">
            Fragment/DMO: image + title + desc ({entries.length} entries found)
            {error && (
              <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 rounded text-yellow-700 text-xs">
                ⚠️ Using sample data - {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="bg-white border-b">
        <div className="grid grid-cols-4 gap-4 px-6 py-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">Web View</h2>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">Mobile</h2>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">Agentforce</h2>
            <p className="text-xs text-gray-600">JSON</p>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">RAG</h2>
            <p className="text-xs text-gray-600">Natural Language interpretation of the entry</p>
          </div>
        </div>
      </div>

      {/* Content Blocks from All Entries */}
      <div className="p-6 space-y-6">
        {entries.map((entry, entryIndex) => (
          <div key={entry.uid}>
            {/* Entry Header */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Entry: {entry.title || `Entry ${entryIndex + 1}`}
              </h2>
              <p className="text-sm text-gray-600">UID: {entry.uid}</p>
            </div>

            {/* Blocks for this entry */}
            {entry.blocks && entry.blocks.length > 0 ? (
              entry.blocks.map((block, blockIndex) => (
                <div key={`${entry.uid}-${blockIndex}`} className="bg-white rounded-lg shadow-sm border overflow-hidden mb-4">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <h3 className="font-medium text-gray-900">
                      {entry.title || `Entry ${entryIndex + 1}`} - Block {blockIndex + 1}: {block.block?.title || 'Untitled Block'}
                    </h3>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-4 min-h-64">
                    {/* Web View Column */}
                    <div className="border-r pr-4">
                      <WebViewBlock block={block} entry={entry} />
                    </div>

                    {/* Mobile Column */}
                    <div className="border-r pr-4 flex items-center justify-center">
                      <MobileViewBlock block={block} entry={entry} />
                    </div>

                    {/* Agentforce Column */}
                    <div className="border-r pr-4">
                      <AgentforceView block={block} />
                    </div>

                    {/* RAG Column */}
                    <div>
                      <RAGView block={block} entry={entry} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-4">
                <p className="text-gray-500 text-center">No modular blocks found in this entry.</p>
              </div>
            )}
          </div>
        ))}
        
        {entries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No entries found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentstackViewer;