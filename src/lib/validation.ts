// Central validation rules that match the backend validation.ts
// This ensures consistency between frontend and backend validation

// General email validation function
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validationRules = {
  // Startup validation rules
  startup: {
    title: {
      minLength: { value: 2, message: 'Startup name must be at least 2 characters' },
    },
    industry: {
      minLength: { value: 2, message: 'Industry must be at least 2 characters' },
    },
    aboutUs: {
      minLength: { value: 10, message: 'About Us must be at least 10 characters' },
    },
    addressCity: {
      minLength: { value: 2, message: 'City must be at least 2 characters' },
      maxLength: { value: 50, message: 'City must be less than 50 characters' },
    },
    addressCountry: {
      minLength: { value: 2, message: 'Country must be at least 2 characters' },
      maxLength: { value: 50, message: 'Country must be less than 50 characters' },
    },
    fundingStatus: {},
    fulltimeEmployeesNum: {
      min: { value: 0, message: 'Cannot be negative' },
    },
    foundingYear: {
      min: { value: 1900, message: 'Year must be after 1900' },
      max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' },
    },
    revenuePerYearEUR: {
      min: { value: 0, message: 'Cannot be negative' },
    },
    imprintUrl: {
      pattern: {
        value: /^(https?:\/\/)?([\w.-]+\.[a-z]{2,})(\/\S*)?$/i,
        message: 'Invalid URL format',
      },
    },
    websiteUrl: {
      pattern: {
        value: /^(https?:\/\/)?([\w.-]+\.[a-z]{2,})(\/\S*)?$/i,
        message: 'Invalid URL format',
      },
    },
  },

  // Contact person validation rules
  contactPerson: {
    contactPersonNameFirst: {
      minLength: { value: 2, message: 'First name must be at least 2 characters' },
      maxLength: { value: 50, message: 'First name must be less than 50 characters' },
    },
    contactPersonNameLast: {
      minLength: { value: 2, message: 'Last name must be at least 2 characters' },
      maxLength: { value: 50, message: 'Last name must be less than 50 characters' },
    },
  },

  // Retiree validation rules
  retiree: {
    nameFirst: {
      minLength: { value: 2, message: 'First name must be at least 2 characters' },
      maxLength: { value: 50, message: 'First name must be less than 50 characters' },
    },
    nameLast: {
      minLength: { value: 2, message: 'Last name must be at least 2 characters' },
      maxLength: { value: 50, message: 'Last name must be less than 50 characters' },
    },
    email: {
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Invalid email address',
      },
    },
    aboutMe: {
      maxLength: { value: 500, message: 'About Me must be less than 500 characters' },
    },
    addressStreet: {
      minLength: { value: 3, message: 'Street address must be at least 3 characters' },
      maxLength: { value: 100, message: 'Street address must be less than 100 characters' },
    },
    addressZip: {
      pattern: {
        value: /^\d{5}$/,
        message: 'ZIP code must be exactly 5 digits',
      },
    },
    addressCity: {
      minLength: { value: 2, message: 'City must be at least 2 characters' },
      maxLength: { value: 50, message: 'City must be less than 50 characters' },
    },
    addressCountry: {
      minLength: { value: 2, message: 'Country must be at least 2 characters' },
      maxLength: { value: 50, message: 'Country must be less than 50 characters' },
    },
    approxHourlySalaryEUR: {
      min: { value: 0, message: 'Salary must be positive' },
      max: { value: 1000, message: 'Salary cannot exceed €1000/hour' },
    },
    approxHoursPerWeek: {
      min: { value: 0, message: 'Hours must be positive' },
      max: { value: 40, message: 'Cannot exceed 40 hours/week' },
    },
    skills: {
      validate: (value: string[] | undefined) =>
        !value ||
        value.length <= 10 ||
        'Maximum of 10 Skills can be selected. Please remove one to add another.',
    },
    expertiseAreas: {
      validate: (value: string[] | undefined) =>
        !value ||
        value.length <= 5 ||
        'Maximum of 5 Expertise areas can be selected. Please remove one to add another.',
    },
  },

  // Job posting validation rules
  jobPosting: {
    title: {
      required: 'Job title is required',
      minLength: { value: 3, message: 'Job title must be at least 3 characters' },
      maxLength: { value: 100, message: 'Job title must be less than 100 characters' },
    },
    description: {
      required: 'Job description is required',
      minLength: { value: 10, message: 'Job description must be at least 10 characters' },
      maxLength: { value: 1000, message: 'Job description must be less than 1000 characters' },
    },
    startupId: {
      required: 'Startup ID is required',
    },
    requiredZip: {
      pattern: {
        value: /^\d{5}$/,
        message: 'ZIP code must be exactly 5 digits',
      },
    },
    requiredCity: {
      minLength: { value: 2, message: 'City must be at least 2 characters' },
      maxLength: { value: 20, message: 'City must be less than 20 characters' },
    },
    requiredCountry: {
      minLength: { value: 5, message: 'Country must be at least 5 characters' },
      maxLength: { value: 20, message: 'Country must be less than 20 characters' },
    },
    desiredStartDate: {
      validate: (value: Date | null | undefined) => {
        if (!value) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(value) < today) {
          return 'Start date cannot be in the past';
        }
        return true;
      },
    },
    approxDurationWeeks: {
      min: { value: 1, message: 'Duration must be at least 1 week' },
      max: { value: 52, message: 'Duration cannot exceed 52 weeks' },
    },
    approxHoursPerWeek: {
      min: { value: 1, message: 'Hours per week must be at least 1' },
      max: { value: 40, message: 'Hours per week cannot exceed 40' },
    },
    approxDaysPerWeek: {
      min: { value: 1, message: 'Days per week must be at least 1' },
      max: { value: 5, message: 'Days per week cannot exceed 5' },
    },
    approxHourlySalaryEUR: {
      min: { value: 0, message: 'Hourly salary cannot be negative' },
      max: { value: 1000, message: 'Hourly salary seems too high, please adjust' },
    },
    matchingSkills: {
      validate: (value: string[] | undefined) => {
        if (value && value.length > 10) {
          return 'Maximum 10 skills can be selected';
        }
        return true;
      },
    },
    matchingExpertiseAreas: {
      validate: (value: string[] | undefined) => {
        if (value && value.length > 5) {
          return 'Maximum 5 expertise areas can be selected';
        }
        return true;
      },
    },
    matchingDegrees: {
      validate: (value: string[] | undefined) => {
        if (value && value.length > 5) {
          return 'Maximum 5 degrees can be selected';
        }
        return true;
      },
    },
    matchingPositions: {
      validate: (value: string[] | undefined) => {
        if (value && value.length > 8) {
          return 'Maximum 8 positions can be selected';
        }
        return true;
      },
    },
    matchingLanguageProficiencies: {
      validate: (reqLanguage: any[] | undefined) => {
        if (reqLanguage && reqLanguage.length > 5) {
          return 'Maximum 5 language requirements can be added';
        }
        return true;
      },
    },
  },

  // Career element validation rules
  careerElement: {
    kind: { required: 'Kind is required' },
    title: {
      required: 'Title is required',
      minLength: { value: 2, message: 'Title must be at least 2 characters' },
    },
    organizationName: {
      minLength: { value: 2, message: 'Organization must be at least 2 characters' },
    },
    degree: {},
    position: {},
    fromDate: {
      required: 'From date is required',
    },
    untilDate: {
      validate: (value: Date | null | undefined, formData: any) => {
        if (!value || !formData.fromDate) return true;
        if (new Date(value) <= new Date(formData.fromDate)) {
          return 'Until date must be after from date';
        }
        return true;
      },
    },
    description: {
      maxLength: { value: 500, message: 'Description must be below 500 characters' },
    },
  },
};
