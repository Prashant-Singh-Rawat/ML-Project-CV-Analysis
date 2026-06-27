/**
 * cvExampleProfiles.js
 *
 * Fictional, fully-fleshed-out sample CV content — one profile per template
 * category. Used to power the "Professional CV Examples" gallery so visitors
 * see a real, well-written CV rather than an abstract placeholder mockup.
 *
 * Keys must match the `id` values used in CV_EXAMPLES (CVPage.jsx) and the
 * `tid` values handled by LiveResumePreview (Home.jsx / Analyze.jsx).
 */

const CV_EXAMPLE_PROFILES = {
  'software-engineer': {
    name: 'Arjun Mehta',
    profession: 'Senior Full-Stack Engineer',
    email: 'arjun.mehta@example.com',
    phone: '+1 (415) 555-0148',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/arjunmehta',
    website: 'arjunmehta.dev',
    summary:
      'Full-stack engineer with 7+ years building and scaling consumer-facing web platforms. Specialises in React, Node.js, and distributed systems, with a track record of cutting infrastructure costs and shipping high-impact features for products used by millions.',
    experience: [
      {
        role: 'Senior Software Engineer',
        company: 'BrightPeak Technologies',
        startDate: 'Mar 2022',
        endDate: 'Present',
        desc:
          'Led migration of the core checkout service to a microservices architecture, cutting average latency by 38%.\nBuilt a real-time analytics dashboard (React, WebSockets) adopted by 40+ internal teams.\nMentored 4 junior engineers and introduced a code-review framework that reduced production incidents by 25%.',
      },
      {
        role: 'Software Engineer',
        company: 'Vertex Cloud Systems',
        startDate: 'Jul 2019',
        endDate: 'Feb 2022',
        desc:
          'Developed and shipped the company\'s first public REST API, onboarding 200+ third-party integrations.\nOptimised PostgreSQL queries and indexing strategy, reducing average page load time by 45%.\nCollaborated with design to rebuild the onboarding flow, lifting activation rate by 18%.',
      },
    ],
    education: [
      {
        degree: 'B.Tech',
        field: 'Computer Science & Engineering',
        school: 'State Institute of Technology',
        date: '2015 – 2019',
      },
    ],
    skills: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'GraphQL',
      'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'System Design',
    ],
  },

  'data-scientist': {
    name: 'Sara Liu',
    profession: 'Data Scientist & ML Engineer',
    email: 'sara.liu@example.com',
    phone: '+1 (628) 555-0192',
    location: 'Seattle, WA',
    linkedin: 'linkedin.com/in/saraliu',
    website: 'saraliu.ai',
    summary:
      'Data scientist with 5 years of experience designing and deploying machine learning models in production. Strong background in NLP and predictive modelling, with two published papers and a record of translating research into measurable business impact.',
    experience: [
      {
        role: 'Data Scientist II',
        company: 'Orbital Analytics',
        startDate: 'Aug 2021',
        endDate: 'Present',
        desc:
          'Built a churn-prediction model (XGBoost) deployed to production, reducing customer churn by 14%.\nDesigned an NLP pipeline using BERT embeddings to auto-tag 2M+ support tickets with 92% accuracy.\nPresented findings at the company-wide Data Summit and mentored 3 junior data analysts.',
      },
      {
        role: 'Machine Learning Intern → Data Analyst',
        company: 'Lumen Insights Lab',
        startDate: 'Jun 2019',
        endDate: 'Jul 2021',
        desc:
          'Built feature-engineering pipelines in Pandas/NumPy that cut model training time by 30%.\nCo-authored a peer-reviewed paper on transfer learning for low-resource text classification.\nCreated Tableau dashboards used weekly by the executive team for forecasting.',
      },
    ],
    education: [
      {
        degree: 'M.S.',
        field: 'Data Science',
        school: 'Lakeshore University',
        date: '2017 – 2019',
      },
      {
        degree: 'B.S.',
        field: 'Statistics',
        school: 'Lakeshore University',
        date: '2013 – 2017',
      },
    ],
    skills: [
      'Python', 'SQL', 'Pandas', 'Scikit-learn', 'TensorFlow', 'PyTorch',
      'NLP', 'BERT', 'Tableau', 'A/B Testing', 'Statistical Modeling',
    ],
  },

  'research-cv': {
    name: 'Dr. Elena Castillo',
    profession: 'Postdoctoral Researcher, Cognitive Neuroscience',
    email: 'elena.castillo@example.edu',
    phone: '+44 20 7946 0958',
    location: 'Oxford, United Kingdom',
    linkedin: 'linkedin.com/in/elenacastillo',
    website: 'elenacastillo.academia.edu',
    summary:
      'Cognitive neuroscientist researching memory consolidation and sleep using fMRI and computational modelling. Author of 9 peer-reviewed publications and recipient of two competitive research fellowships, with experience supervising graduate researchers and teaching at undergraduate level.',
    experience: [
      {
        role: 'Postdoctoral Research Fellow',
        company: 'Department of Experimental Psychology, Ashbourne University',
        startDate: 'Oct 2022',
        endDate: 'Present',
        desc:
          'Lead investigator on a 3-year grant studying sleep-dependent memory consolidation (£420k, funded).\nPublished 4 first-author papers in peer-reviewed journals including Nature Neuroscience.\nSupervise 2 PhD students and co-teach the graduate Cognitive Neuroscience seminar.',
      },
      {
        role: 'Doctoral Researcher / Teaching Assistant',
        company: 'Ashbourne University',
        startDate: 'Sep 2018',
        endDate: 'Sep 2022',
        desc:
          'Completed PhD thesis on hippocampal activity during declarative memory encoding (fMRI).\nPresented research at 6 international conferences, including SfN and FENS.\nTaught undergraduate statistics and research methods to cohorts of 60+ students.',
      },
    ],
    education: [
      {
        degree: 'Ph.D.',
        field: 'Cognitive Neuroscience',
        school: 'Ashbourne University',
        date: '2018 – 2022',
      },
      {
        degree: 'M.Sc.',
        field: 'Psychology (Distinction)',
        school: 'Kingsbridge College',
        date: '2016 – 2017',
      },
    ],
    skills: [
      'fMRI Analysis', 'MATLAB', 'R', 'Python', 'Statistical Modeling',
      'Grant Writing', 'Scientific Writing', 'Conference Presentation',
    ],
  },

  healthcare: {
    name: 'Michael Obi, RN',
    profession: 'Registered Nurse, Critical Care',
    email: 'michael.obi@example.com',
    phone: '+1 (646) 555-0177',
    location: 'New York, NY',
    linkedin: 'linkedin.com/in/michaelobi',
    website: '',
    summary:
      'Critical care registered nurse with 6 years of experience in high-acuity ICU settings. BLS and ACLS certified, with a strong record of patient advocacy, interdisciplinary collaboration, and mentoring new graduate nurses through residency.',
    experience: [
      {
        role: 'ICU Staff Nurse',
        company: 'Riverside Memorial Hospital',
        startDate: 'Feb 2021',
        endDate: 'Present',
        desc:
          'Manage care for a 2:1 patient ratio in a 24-bed Level I trauma ICU.\nServe as charge nurse on rotating shifts, coordinating staffing and emergency response.\nPrecept 8+ new graduate nurses annually through a structured residency programme.',
      },
      {
        role: 'Medical-Surgical Nurse',
        company: 'Lakeside General Hospital',
        startDate: 'Jul 2018',
        endDate: 'Jan 2021',
        desc:
          'Provided direct patient care for post-operative and chronic illness caseloads of up to 6 patients.\nLed a unit-wide initiative that reduced hospital-acquired infection rates by 20%.\nCollaborated with physicians and care teams to develop individualised discharge plans.',
      },
    ],
    education: [
      {
        degree: 'B.S.N.',
        field: 'Nursing',
        school: 'Hartwell University School of Nursing',
        date: '2014 – 2018',
      },
    ],
    skills: [
      'BLS Certified', 'ACLS Certified', 'Critical Care', 'Patient Assessment',
      'Ventilator Management', 'EHR / Epic', 'Patient Education', 'Team Leadership',
    ],
  },

  'business-executive': {
    name: 'Catherine Hale',
    profession: 'VP of Operations',
    email: 'catherine.hale@example.com',
    phone: '+1 (212) 555-0136',
    location: 'New York, NY',
    linkedin: 'linkedin.com/in/catherinehale',
    website: '',
    summary:
      'Operations executive with 14 years of experience scaling logistics and supply-chain functions for high-growth retail and e-commerce companies. Proven record of leading cross-functional teams of 100+ and driving double-digit margin improvement through process transformation.',
    experience: [
      {
        role: 'VP of Operations',
        company: 'Meridian Retail Group',
        startDate: 'Jan 2020',
        endDate: 'Present',
        desc:
          'Own P&L for a $180M operations division spanning logistics, warehousing, and customer service.\nLed a network redesign that cut fulfilment costs by 22% while improving on-time delivery to 98.5%.\nBuilt and lead a leadership team of 6 directors overseeing 450+ staff across 5 distribution centres.',
      },
      {
        role: 'Director of Supply Chain',
        company: 'Harborline Logistics',
        startDate: 'Mar 2015',
        endDate: 'Dec 2019',
        desc:
          'Directed end-to-end supply chain strategy for a 3-country operation, managing a $60M budget.\nNegotiated carrier and vendor contracts that delivered $4.2M in annual savings.\nImplemented an S&OP process that reduced inventory holding costs by 17%.',
      },
    ],
    education: [
      {
        degree: 'MBA',
        field: 'Operations & Strategy',
        school: 'Whitfield School of Management',
        date: '2011 – 2013',
      },
      {
        degree: 'B.A.',
        field: 'Economics',
        school: 'Bellmont College',
        date: '2004 – 2008',
      },
    ],
    skills: [
      'P&L Management', 'Supply Chain Strategy', 'Team Leadership',
      'Vendor Negotiation', 'Process Transformation', 'S&OP', 'Budgeting',
    ],
  },

  'creative-designer': {
    name: 'Noah Bennett',
    profession: 'Senior UX/UI Designer',
    email: 'noah.bennett@example.com',
    phone: '+1 (310) 555-0163',
    location: 'Los Angeles, CA',
    linkedin: 'linkedin.com/in/noahbennett',
    website: 'noahbennett.design',
    summary:
      'Senior product designer with 8 years crafting end-to-end digital experiences for fintech and consumer apps. Skilled at translating complex workflows into intuitive interfaces, with a portfolio spanning mobile apps used by 3M+ people.',
    experience: [
      {
        role: 'Senior UX/UI Designer',
        company: 'Folio Studio',
        startDate: 'May 2021',
        endDate: 'Present',
        desc:
          'Led end-to-end redesign of the flagship mobile app, lifting user satisfaction scores by 31%.\nBuilt and maintain the company-wide design system used across 5 product squads.\nMentor 2 junior designers and run weekly critique sessions to raise design craft.',
      },
      {
        role: 'Product Designer',
        company: 'Pixel & Co.',
        startDate: 'Aug 2017',
        endDate: 'Apr 2021',
        desc:
          'Designed onboarding and payments flows for a fintech app, reducing drop-off by 26%.\nRan 40+ usability testing sessions to validate design decisions pre-launch.\nPartnered with engineering to ship pixel-perfect, accessible UI across iOS and Android.',
      },
    ],
    education: [
      {
        degree: 'B.F.A.',
        field: 'Graphic & Interaction Design',
        school: 'Crestwood Institute of Art',
        date: '2013 – 2017',
      },
    ],
    skills: [
      'Figma', 'Design Systems', 'Prototyping', 'User Research',
      'Interaction Design', 'Accessibility', 'Adobe Creative Suite',
    ],
  },
};

export default CV_EXAMPLE_PROFILES;