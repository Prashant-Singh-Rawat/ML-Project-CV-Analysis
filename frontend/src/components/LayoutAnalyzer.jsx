import React from 'react';

const LayoutAnalyzer = ({ layoutData }) => {
  if (!layoutData) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Layout Analysis
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upload a CV to view structural formatting insights and LayoutLM analysis.
        </p>
      </div>
    );
  }

  const { formatting_score, insights, visual_highlights } = layoutData;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Visual Layout Analysis
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Score:</span>
          <span className={`px-2.5 py-1 rounded-full text-sm font-medium ${
            formatting_score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
            formatting_score >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {formatting_score}/100
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Structural Insights</h4>
          <ul className="space-y-2">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="mt-1 text-blue-500">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {visual_highlights && visual_highlights.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detected Sections</h4>
            <div className="grid gap-2">
              {visual_highlights.map((vh, idx) => (
                <div key={idx} className="p-2 bg-gray-50 dark:bg-gray-750 rounded text-xs flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{vh.label}</span>
                  {vh.issue && (
                    <span className="text-orange-500">{vh.issue}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LayoutAnalyzer;
