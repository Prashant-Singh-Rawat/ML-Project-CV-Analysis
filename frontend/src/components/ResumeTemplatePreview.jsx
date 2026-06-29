import React from 'react';
import SoftwareEngineerTemplate from './templates/SoftwareEngineerTemplate';
import DataScientistTemplate from './templates/DataScientistTemplate';
import AcademicResearchTemplate from './templates/AcademicResearchTemplate';
import HealthcareProfessionalTemplate from './templates/HealthcareProfessionalTemplate';
import BusinessExecutiveTemplate from './templates/BusinessExecutiveTemplate';
import CreativeDesignerTemplate from './templates/CreativeDesignerTemplate';
import CV_EXAMPLE_PROFILES from '../data/cvExampleProfiles';

/**
 * Maps each Resume Builder template id to the real layout component that
 * renders it, plus the matching realistic sample profile (reused from the
 * CV Examples gallery so we don't maintain duplicate sample content).
 *
 * IMPORTANT: this mapping must stay in sync with the `tid` switch inside
 * LiveResumePreview in pages/Analyze.jsx — that's what the actual builder
 * uses once "Use This Template" is clicked. If you change one, change the
 * other, or the gallery preview and the live builder preview will disagree.
 */
const RESUME_TEMPLATE_MAP = {
  cascade: { Component: SoftwareEngineerTemplate, profileId: 'software-engineer' },
  cubic: { Component: DataScientistTemplate, profileId: 'data-scientist' },
  crisp: { Component: AcademicResearchTemplate, profileId: 'research-cv' },
  aria: { Component: HealthcareProfessionalTemplate, profileId: 'healthcare' },
  nexus: { Component: CreativeDesignerTemplate, profileId: 'creative-designer' },
  apex: { Component: BusinessExecutiveTemplate, profileId: 'business-executive' },
};

// Natural width (px) we render the template at before scaling down for the
// thumbnail. Matches the templates' comfortable desktop layout width.
const THUMBNAIL_SOURCE_WIDTH = 760;
const THUMBNAIL_SCALE = 0.3;

/**
 * ResumeTemplatePreview — renders an actual, populated resume template
 * instead of a static (and previously broken/fake) preview image.
 *
 * mode="thumbnail": a clipped, scaled-down, non-interactive "page peek" used
 *   on the gallery card (sits inside a fixed-height relative container).
 * mode="full": the full-size, scrollable template used inside the
 *   View Example / Preview modal.
 */
export default function ResumeTemplatePreview({ templateId, color, mode = 'thumbnail' }) {
  const entry = RESUME_TEMPLATE_MAP[(templateId || '').toLowerCase().trim()];
  const Template = entry?.Component;
  const data = entry ? CV_EXAMPLE_PROFILES[entry.profileId] : null;

  if (!Template || !data) return null;

  if (mode === 'full') {
    return (
      <div
        id={`resume-template-preview-${templateId}`}
        className="w-full max-h-[78vh] overflow-y-auto rounded-2xl bg-slate-100 p-3 sm:p-5"
      >
        <Template data={data} color={color} photoEnabled={true} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden flex items-start justify-center pt-3" aria-hidden="true">
      <div
        className="shrink-0 rounded-lg overflow-hidden shadow-2xl bg-white pointer-events-none select-none"
        style={{
          width: THUMBNAIL_SOURCE_WIDTH,
          transform: `scale(${THUMBNAIL_SCALE})`,
          transformOrigin: 'top center',
        }}
      >
        <Template data={data} color={color} photoEnabled={true} />
      </div>
    </div>
  );
}