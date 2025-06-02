import React from 'react';

const ConversationSkeleton: React.FC = () => {
  return (
    <div className="p-3 border-b border-base-content/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="skeleton w-10 h-10 rounded-full" />
          
          <div className="flex flex-col gap-1">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton h-2 w-32 rounded" />
          </div>
        </div>

        <div className="skeleton h-2 w-8 rounded" />
      </div>
    </div>
  );
};

export default ConversationSkeleton;