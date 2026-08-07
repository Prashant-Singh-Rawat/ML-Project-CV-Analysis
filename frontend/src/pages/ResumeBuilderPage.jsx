import React from 'react';
import FormPanel from '../components/builder/FormPanel';
import PreviewPanel from '../components/builder/PreviewPanel';
import AIPanel from '../components/builder/AIPanel';
import { useResumeStore } from '../store/resumeStore';

export default function ResumeBuilderPage() {
  const { design } = useResumeStore();

  return (
    <div className="h-screen w-full bg-slate-50 flex overflow-hidden">
      {/* LEFT PANEL: Forms */}
      <div className="w-[400px] h-full bg-white border-r border-slate-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 shrink-0">
        <FormPanel />
      </div>

      {/* CENTER PANEL: Live Preview */}
      <div className="flex-1 h-full bg-slate-100 overflow-hidden flex flex-col relative z-0">
        <PreviewPanel />
      </div>

      {/* RIGHT PANEL: AI Assistant & ATS */}
      <div className="w-[380px] h-full bg-white border-l border-slate-200 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10 shrink-0">
        <AIPanel />
      </div>
    </div>
  );
}