import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    summary: '',
    photoUrl: null,
  },
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    languages: [],
    tools: [],
  },
  projects: [],
  certifications: [],
  customSections: [],
};

const initialDesignState = {
  templateId: 'cascade', // Default template
  themeColor: '#2563eb', // Default blue
  fontFamily: 'Inter',
  fontSize: 'medium', // small, medium, large
  layout: {
    sectionOrder: ['experience', 'education', 'skills', 'projects', 'certifications'],
    isTwoColumn: true,
  }
};

export const useResumeStore = create(
  persist(
    (set, get) => ({
      // Data State
      resumeData: initialResumeData,
      design: initialDesignState,
      
      // AI & ATS State
      atsScore: 0,
      aiSuggestions: [],
      resumeIssues: [],
      
      // Actions: Personal Info
      updatePersonalInfo: (field, value) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          personalInfo: {
            ...state.resumeData.personalInfo,
            [field]: value
          }
        }
      })),

      // Actions: Generic Array Items (Experience, Education, Projects, Certifications)
      addArrayItem: (section, initialItem) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          [section]: [...state.resumeData[section], { id: crypto.randomUUID(), ...initialItem }]
        }
      })),
      
      updateArrayItem: (section, id, field, value) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          [section]: state.resumeData[section].map(item => 
            item.id === id ? { ...item, [field]: value } : item
          )
        }
      })),
      
      removeArrayItem: (section, id) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          [section]: state.resumeData[section].filter(item => item.id !== id)
        }
      })),

      reorderArray: (section, startIndex, endIndex) => set((state) => {
        const result = Array.from(state.resumeData[section]);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return {
          resumeData: {
            ...state.resumeData,
            [section]: result
          }
        };
      }),

      // Actions: Skills
      addSkill: (category, skill) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          skills: {
            ...state.resumeData.skills,
            [category]: [...state.resumeData.skills[category], skill]
          }
        }
      })),
      
      removeSkill: (category, index) => set((state) => ({
        resumeData: {
          ...state.resumeData,
          skills: {
            ...state.resumeData.skills,
            [category]: state.resumeData.skills[category].filter((_, i) => i !== index)
          }
        }
      })),

      // Actions: Design
      updateDesign: (field, value) => set((state) => ({
        design: {
          ...state.design,
          [field]: value
        }
      })),

      updateLayoutOrder: (newOrder) => set((state) => ({
        design: {
          ...state.design,
          layout: {
            ...state.design.layout,
            sectionOrder: newOrder
          }
        }
      })),

      // Meta Actions
      resetResume: () => set({ resumeData: initialResumeData, design: initialDesignState }),
      
      importResumeData: (data) => set((state) => ({
        resumeData: { ...state.resumeData, ...data }
      })),
      
      setAtsData: (data) => set({
        atsScore: data.score,
        aiSuggestions: data.suggestions,
        resumeIssues: data.issues
      }),
    }),
    {
      name: 'tonycv-resume-storage', // local storage key
      partialize: (state) => ({ resumeData: state.resumeData, design: state.design }), // only persist data and design
    }
  )
);
