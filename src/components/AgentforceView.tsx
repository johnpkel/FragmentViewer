/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface AgentforceViewProps {
  block: any;
}

const AgentforceView: React.FC<AgentforceViewProps> = ({ block }) => {
  // Safely access block properties
  const blockData = block?.block || block || {};

  return (
    <div className="bg-gray-900 rounded-lg p-3 h-full">
      <div className="mb-2">
        <span className="text-yellow-400 text-xs font-mono">JSON</span>
      </div>
      <pre
        {...block.$.block}
        className="text-green-400 text-xs font-mono whitespace-pre-wrap overflow-auto max-h-64"
      >
        {JSON.stringify(blockData, null, 2)}
      </pre>
    </div>
  );
};

export default AgentforceView;
