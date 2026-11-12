import React, { useState } from 'react';

export default function ExportPDF({ onExport }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      if (onExport) await onExport();
      else window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm flex items-center gap-1.5"
    >
      <span>📄</span>
      <span>{downloading ? 'Preparing PDF...' : 'Export PDF Report'}</span>
    </button>
  );
}
