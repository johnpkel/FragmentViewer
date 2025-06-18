import React, { useState, useEffect } from 'react';
import './App.css';

const ContentstackViewer = () => {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Contentstack configuration
  const stackConfig = {
    api_key: 'blt80dc93420b90938f',
    delivery_token: 'cs39d0b8027160dbc7a2dfc680', 
    environment: 'preview',
    region: 'us'
  };

  useEffect(() => {
    fetchEntriesFromContentstack();
  }, []);

  const fetchEntriesFromContentstack = async () => {
    try {
      setLoading(true);
      setError(null);

      // If Contentstack SDK is not available, fall back to REST API
      if (typeof window !== 'undefined' && !window.Contentstack) {
        await loadContentstackSDK();
      }

      let entriesData;
      
      if (window.Contentstack) {
        // Use Contentstack SDK
        const Stack = window.Contentstack.Stack({
          api_key: stackConfig.api_key,
          delivery_token: stackConfig.delivery_token,
          environment: stackConfig.environment,
          region: stackConfig.region
        });

        const Query = Stack.ContentType('page').Query();
        const result = await Query.includeReference('image').includeReference('blocks.block.image').find();
        entriesData = result[0];
      } else {
        // Fallback to REST API
        const response = await fetch(
          `https://${stackConfig.region}-cdn.contentstack.com/v3/content_types/page/entries?environment=${stackConfig.environment}&include_reference=image,blocks.block.image`,
          {
            headers: {
              'api_key': stackConfig.api_key,
              'access_token': stackConfig.delivery_token
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        entriesData = data.entries;
      }

      setEntries(entriesData || []);
      if (entriesData && entriesData.length > 0) {
        setSelectedEntry(entriesData[0]);
      }
    } catch (err) {
      console.error('Error fetching Contentstack data:', err);
      setError(err.message);
      // Load sample data as fallback
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  const loadContentstackSDK = () => {
    return new Promise((resolve, reject) => {
      if (window.Contentstack) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/contentstack@3.16.0/dist/web/contentstack.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const loadSampleData = () => {
    // Fallback sample data
    const sampleEntries = [
      {
        "title": "Contentstack Kickstart",
        "url": "/",
        "description": "This is an entry for a Contentstack Kickstart",
        "image": {
          "url": "https://images.contentstack.io/v3/assets/blt80dc93420b90938f/blt0e4cebc884272b9a/6850afabbe0dc9b594da84d9/contentstack-kickstarts.jpg",
          "title": "contentstack-kickstarts.jpg"
        },
        "blocks": [
          {
            "block": {
              "title": "This is a modular block",
              "copy": "<p>Contentstack <a href=\"https://www.contentstack.com/docs/developers/create-content-types/modular-blocks\" target=\"_blank\">Modular Blocks</a> allow you to dynamically create, arrange, and reuse content components within a single field, offering flexibility for building complex page layouts without changes to the content type structure.</p>",
              "image": {
                "url": "https://images.contentstack.io/v3/assets/blt80dc93420b90938f/blt3c131413b7e72593/6850afab188a47a37d1ab009/csLogo_640x360.jpg",
                "title": "csLogo_640x360.jpg"
              },
              "layout": "image_left"
            }
          },
          {
            "block": {
              "title": "Check out the Academy",
              "copy": "<p>Contentstack offers courses and explainers on how to use the platform. Check out the course on <a href=\"https://www.contentstack.com/academy/courses/content-modeling\" target=\"_blank\">content modeling</a> and the more <a href=\"https://www.contentstack.com/academy/explore?filter=%5B%7B%22uid%22%3A%22coding%22%2C%22parentUid%22%3A%22content_type%22%7D%5D&page=1\" target=\"_blank\">development specific videos</a>.</p>",
              "image": {
                "url": "https://images.contentstack.io/v3/assets/blt80dc93420b90938f/bltb77b2039e1af4f1b/6850afacb1a14c7310813eba/Opengraph_B.png",
                "title": "Opengraph_B.png"
              },
              "layout": "image_right"
            }
          },
          {
            "block": {
              "title": "Join the community",
              "copy": "<p>The <a href=\"https://community.contentstack.com\" target=\"_blank\">community</a> connects you with a vibrant network of like-minded developers to show off your work or to ask any questions.</p>",
              "image": {
                "url": "https://images.contentstack.io/v3/assets/blt80dc93420b90938f/blt9661d0c954b0a56d/6850afacd3664e442a5a8415/discord-logo.webp",
                "title": "discord-logo.webp"
              },
              "layout": "image_left"
            }
          }
        ],
        "uid": "blt1a1a19f70f2675ed"
      }
    ];

    setEntries(sampleEntries);
    setSelectedEntry(sampleEntries[0]);
  };

  const stripHtml = (html) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const WebViewBlock = ({ block }) => {
    const { title, copy, image, layout } = block.block;
    const isImageLeft = layout === 'image_left';
    
    return (
      <div className={`flex gap-4 p-4 bg-white rounded-lg shadow-sm border ${isImageLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className="flex-shrink-0 w-24 h-24">
          <img 
            src={image?.url} 
            alt={image?.title || title}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA4QzEzLjEgOCAxNCA4LjkgMTQgMTBDMTQgMTEuMSAxMy4xIDEyIDEyIDEyQzEwLjkgMTIgMTAgMTEuMSAxMCAxMEMxMCA4LjkgMTAuOSA4IDEyIDhaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMSAxOVYxN0MyMSAxNS45IDIwLjEgMTUgMTkgMTVIMTdMMTUuNSAxMy41QzE1LjEgMTMuMSAxNC40IDEzLjEgMTQgMTMuNUwxMiAxNS41TDkuNSAxM0M5LjEgMTIuNiA4LjQgMTIuNiA4IDEzTDUgMTZIM0MyIDMuOTcgMy45NyAzIDUgM0gxOUMyMC4wMyAzIDIxIDMuOTcgMjEgNVYxOVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
            }}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <div 
            className="text-gray-700 prose prose-sm text-sm"
            dangerouslySetInnerHTML={{ __html: copy }}
          />
        </div>
      </div>
    );
  };

  const MobileViewBlock = ({ block }) => {
    const { title, copy, image } = block.block;
    
    return (
      <div className="w-48 mx-auto bg-white rounded-lg shadow-lg border overflow-hidden">
        {/* Mobile phone frame */}
        <div className="bg-black rounded-t-lg h-6 flex items-center justify-center">
          <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
        </div>
        <div className="p-3 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <div className="w-full h-20">
            <img 
              src={image?.url} 
              alt={image?.title || title}
              className="w-full h-full object-cover rounded"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA4QzEzLjEgOCAxNCA4LjkgMTQgMTBDMTQgMTEuMSAxMy4xIDEyIDEyIDEyQzEwLjkgMTIgMTAgMTEuMSAxMCAxMEMxMCA4LjkgMTAuOSA4IDEyIDhaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMSAxOVYxN0MyMSAxNS45IDIwLjEgMTUgMTkgMTVIMTdMMTUuNSAxMy41QzE1LjEgMTMuMSAxNC40IDEzLjEgMTQgMTMuNUwxMiAxNS41TDkuNSAxM0M5LjEgMTIuNiA8LjQgMTIuNiA4IDEzTDUgMTZIM0MyIDMuOTcgMy45NyAzIDUgM0gxOUMyMC4wMyAzIDIxIDMuOTcgMjEgNVYxOVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
              }}
            />
          </div>
          <div className="text-xs text-gray-700 leading-tight">
            {stripHtml(copy).substring(0, 120)}...
          </div>
        </div>
      </div>
    );
  };

  const AgentforceView = ({ block }) => {
    return (
      <div className="bg-gray-900 rounded-lg p-3 h-full">
        <div className="mb-2">
          <span className="text-yellow-400 text-xs font-mono">JSON</span>
        </div>
        <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap overflow-auto max-h-64">
          {JSON.stringify(block.block, null, 2)}
        </pre>
      </div>
    );
  };

  const RAGView = ({ block }) => {
    const { title, copy, image, layout } = block.block;
    const cleanCopy = stripHtml(copy);
    
    const interpretation = `This content block represents a "${title}" section designed to inform users about ${title.toLowerCase()}. The block contains:

• A primary heading: "${title}"
• Descriptive content explaining: ${cleanCopy.substring(0, 100)}...
• Visual support through an image titled "${image?.title || 'supporting image'}"
• Layout configuration set to "${layout}" for optimal visual presentation

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Contentstack Modular Blocks Viewer</h1>
          <p className="text-gray-600">Stack: {stackConfig.api_key}</p>
          <div className="mt-2 text-sm text-gray-500">
            Fragment/DMO: image + title + desc
            {error && (
              <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 rounded text-yellow-700 text-xs">
                ⚠️ Using sample data - {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Entry Selector */}
      {entries.length > 1 && (
        <div className="bg-white border-b px-6 py-3">
          <select 
            value={selectedEntry?.uid || ''} 
            onChange={(e) => setSelectedEntry(entries.find(entry => entry.uid === e.target.value))}
            className="border rounded px-3 py-2 text-sm"
          >
            {entries.map(entry => (
              <option key={entry.uid} value={entry.uid}>{entry.title}</option>
            ))}
          </select>
        </div>
      )}

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

      {/* Content Blocks */}
      <div className="p-6 space-y-6">
        {selectedEntry?.blocks && selectedEntry.blocks.length > 0 ? (
          selectedEntry.blocks.map((block, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <h3 className="font-medium text-gray-900">Block {index + 1}: {block.block?.title}</h3>
              </div>
              <div className="grid grid-cols-4 gap-4 p-4 min-h-64">
                {/* Web View Column */}
                <div className="border-r pr-4">
                  <WebViewBlock block={block} />
                </div>

                {/* Mobile Column */}
                <div className="border-r pr-4 flex items-center justify-center">
                  <MobileViewBlock block={block} />
                </div>

                {/* Agentforce Column */}
                <div className="border-r pr-4">
                  <AgentforceView block={block} />
                </div>

                {/* RAG Column */}
                <div>
                  <RAGView block={block} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No modular blocks found in this entry.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentstackViewer;