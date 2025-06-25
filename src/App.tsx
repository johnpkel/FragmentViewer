/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPages, initLivePreview } from "./lib/contentstack";
import { useEffect, useState } from "react";
import ContentstackLivePreview from "@contentstack/live-preview-utils";
import {
  WebViewBlock,
  MobileViewBlock,
  AgentforceView,
  RAGView,
} from "./components";
import { Page } from "./lib/types";

const Header = ({ pagesCount }: { pagesCount: number }) => (
  <div className="bg-gray-50">
    <div className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Contentstack Modular Blocks Viewer with Visual Builder
        </h1>
        <p className="text-gray-600">Stack: blt80dc93420b90938f</p>
        <div className="mt-2 text-sm text-gray-500">
          Fragment/DMO: image + title + desc ({pagesCount} entries found)
        </div>
      </div>
    </div>
  </div>
);

const TableHeader = () => (
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
        <p className="text-xs text-gray-600">
          Natural Language interpretation of the entry
        </p>
      </div>
    </div>
  </div>
);

const ContentBlock = ({
  block,
  entry,
  entryIndex,
  blockIndex,
}: {
  block: any;
  entry: Page;
  entryIndex: number;
  blockIndex: number;
}) => (
  <div
    key={`${entry.uid}-${blockIndex}`}
    className="bg-white rounded-lg shadow-sm border overflow-hidden mb-4"
    {...((block as any).$ ?? {})}
  >
    <div className="bg-gray-50 px-4 py-2 border-b">
      <h3
        className="font-medium text-gray-900"
        {...((block as any).$?.block?.title ?? {})}
      >
        {entry.title || `Entry ${entryIndex + 1}`} - Block {blockIndex + 1}:{" "}
        {block.block?.title || "Untitled Block"}
      </h3>
    </div>

    <div className="grid grid-cols-4 gap-4 p-4 min-h-64">
      <div className="border-r pr-4">
        <WebViewBlock block={block} entry={entry} />
      </div>

      <div className="border-r pr-4 flex items-center justify-center">
        <MobileViewBlock block={block} entry={entry} />
      </div>

      <div className="border-r pr-4">
        <AgentforceView block={block} />
      </div>

      <div>
        <RAGView block={block} entry={entry} />
      </div>
    </div>
  </div>
);

const EntryItem = ({
  entry,
  entryIndex,
}: {
  entry: Page;
  entryIndex: number;
}) => (
  <div key={entry.uid} {...(entry.$?.blocks ?? {})}>
    {/* Entry Header */}
    <div className="mb-4">
      <h2
        className="text-xl font-semibold text-gray-900 mb-2"
        {...(entry.$?.title ?? {})}
      >
        Entry: {entry.title || `Entry ${entryIndex + 1}`}
      </h2>
      <p className="text-sm text-gray-600">UID: {entry.uid}</p>
    </div>

    {entry.blocks?.map((block, blockIndex) => (
      <ContentBlock
        key={`${entry.uid}-${blockIndex}`}
        block={block}
        entry={entry}
        entryIndex={entryIndex}
        blockIndex={blockIndex}
      />
    ))}
  </div>
);

function App() {
  const [pages, setPages] = useState<Page[]>([]);

  const getContent = async () => {
    const pagesData = await getPages();
    setPages((pagesData as Page[]) || []);
  };

  useEffect(() => {
    initLivePreview();
    ContentstackLivePreview.onEntryChange(getContent);
  }, []);

  return (
    <main>
      <Header pagesCount={pages?.length || 0} />
      <TableHeader />

      <div className="p-6 space-y-6">
        {pages?.map((entry, entryIndex) => (
          <EntryItem key={entry.uid} entry={entry} entryIndex={entryIndex} />
        ))}
      </div>
    </main>
  );
}

export default App;
