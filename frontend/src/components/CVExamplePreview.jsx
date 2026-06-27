import React from 'react';
import SoftwareEngineerTemplate from './templates/SoftwareEngineerTemplate';
import DataScientistTemplate from './templates/DataScientistTemplate';
import AcademicResearchTemplate from './templates/AcademicResearchTemplate';
import HealthcareProfessionalTemplate from './templates/HealthcareProfessionalTemplate';
import BusinessExecutiveTemplate from './templates/BusinessExecutiveTemplate';
import CreativeDesignerTemplate from './templates/CreativeDesignerTemplate';
import CV_EXAMPLE_PROFILES from '../data/cvExampleProfiles';

const TEMPLATE_COMPONENTS = {
  'software-engineer': SoftwareEngineerTemplate,
  'data-scientist': DataScientistTemplate,
  'research-cv': AcademicResearchTemplate,
  healthcare: HealthcareProfessionalTemplate,
  'business-executive': BusinessExecutiveTemplate,
  'creative-designer': CreativeDesignerTemplate,
};

// Natural width (px) we render the template at before scaling down for the
// thumbnail. Matches the templates' comfortable desktop layout width.
const THUMBNAIL_SOURCE_WIDTH = 760;
const THUMBNAIL_SCALE = 0.3;

/**
 * CVExamplePreview — renders an actual, populated CV template instead of an
 * abstract placeholder mockup.
 *
 * mode="thumbnail": a clipped, scaled-down, non-interactive "page peek" used
 *   on the gallery card (sits inside a fixed-height relative container).
 * mode="full": the full-size, scrollable template used inside the
 *   View Example modal/lightbox.
 */
export default function CVExamplePreview({ exampleId, color, mode = 'thumbnail' }) {
  const Template = TEMPLATE_COMPONENTS[exampleId];
  const data = CV_EXAMPLE_PROFILES[exampleId];

  if (!Template || !data) return null;

  if (mode === 'full') {
    return (
      <div
        id={`cv-example-preview-${exampleId}`}
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