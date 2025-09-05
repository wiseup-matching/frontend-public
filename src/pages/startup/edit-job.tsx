import type { JobPosting, JobPostingCreate, JobPostingUpdate } from '@/api/openapi-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useDegrees } from '@/hooks/useDegrees';
import { useExpertiseAreas } from '@/hooks/useExpertiseAreas';
import { useJobPostingById } from '@/hooks/useJobPostingById';
import { useLanguageProficiencyLevels } from '@/hooks/useLanguageProficiencyLevels';
import { useLanguages } from '@/hooks/useLanguages';
import { usePositions } from '@/hooks/usePositions';
import { useSkills } from '@/hooks/useSkills';

import ProtectedRoute from '@/components/custom/ProtectedRoute';
import StepProgressBar from '@/components/custom/StepProgressBar';

import { defaultApi } from '@/api/defaultapi';
import JobBasicsSection from '@/components/custom/JobPostingsEdit/JobBasicsSection';
import JobDegreesSection from '@/components/custom/JobPostingsEdit/JobDegreesSection';
import JobDetailsSection from '@/components/custom/JobPostingsEdit/JobDetailsSection';
import JobExpertiseSection from '@/components/custom/JobPostingsEdit/JobExpertiseSection';
import JobLanguagesSection from '@/components/custom/JobPostingsEdit/JobLanguagesSection';
import JobSkillsSection from '@/components/custom/JobPostingsEdit/JobSkillsSection';
import JobWorkExperienceSection from '@/components/custom/JobPostingsEdit/JobWorkExperienceSection';
import LoadingPage from '../loading-page';

function EditJobPage() {
  const { id } = useParams<{ id: string | undefined }>(); // if set -> edit mode, if not set -> create new job posting
  const mode: 'edit' | 'create' = id ? 'edit' : 'create';
  const isEditMode = mode === 'edit';

  const { user } = useAuth();
  const navigate = useNavigate();

  // conditional hook call, only fetch job data in edit mode
  const {
    job,
    loading: loadingJob,
    error: jobError,
  } = useJobPostingById(isEditMode ? id : undefined);

  const { skills, loading: loadingSkills } = useSkills();
  const { expertiseAreas, loading: loadingExpertiseAreas } = useExpertiseAreas();
  const { languages, loading: loadingLanguages } = useLanguages();
  const { languageProficiencyLevels, loading: loadingLanguageProficiencyLevels } =
    useLanguageProficiencyLevels();
  const { degrees, loading: loadingDegrees } = useDegrees();
  const { positions, loading: loadingPositions } = usePositions();

  const loading =
    (isEditMode ? loadingJob : false) ||
    loadingSkills ||
    loadingExpertiseAreas ||
    loadingLanguages ||
    loadingLanguageProficiencyLevels ||
    loadingDegrees ||
    loadingPositions;

  // refs for each section for progress bar
  const basicsRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const expertiseRef = useRef<HTMLDivElement>(null);
  const degreesRef = useRef<HTMLDivElement>(null);
  const workExperienceRef = useRef<HTMLDivElement>(null);
  const languagesRef = useRef<HTMLDivElement>(null);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<JobPosting>({
    defaultValues: {
      // required fields
      id: isEditMode ? job?.id : undefined, // will be set by backend in edit mode
      title: '',
      startupId: user?.id,
      description: '',
      matchingSkills: [],
      matchingExpertiseAreas: [],
      matchingDegrees: [],
      matchingPositions: [],
      matchingLanguageProficiencies: [],
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isEditMode && job) {
      // create safe copy of job data for the form
      const formData: JobPostingCreate = {
        title: job.title,
        description: job.description ?? '',
        requiredZip: job.requiredZip ?? null,
        requiredCity: job.requiredCity ?? null,
        requiredCountry: job.requiredCountry ?? null,
        approxDurationWeeks: job.approxDurationWeeks ?? undefined,
        approxHoursPerWeek: job.approxHoursPerWeek ?? undefined,
        approxDaysPerWeek: job.approxDaysPerWeek ?? undefined,
        approxHourlySalaryEUR: job.approxHourlySalaryEUR ?? undefined,
        desiredStartDate: job.desiredStartDate ? new Date(job.desiredStartDate) : undefined,
        matchingSkills: job.matchingSkills ?? [],
        matchingExpertiseAreas: job.matchingExpertiseAreas ?? [],
        matchingDegrees: job.matchingDegrees ?? [],
        matchingPositions: job.matchingPositions ?? [],
        matchingLanguageProficiencies: job.matchingLanguageProficiencies ?? [],
        startupId: user?.id ?? '',
      };

      reset(formData);
    }
  }, [isEditMode, job, reset, user]);

  // update startupId when user is loaded (create mode)
  useEffect(() => {
    if (!isEditMode && user?.id) {
      setValue('startupId', user.id);
    }
  }, [isEditMode, user, setValue]);

  const sections: {
    id: string;
    label: string;
    ref: React.RefObject<HTMLDivElement>;
    requiredFields: (keyof JobPosting)[];
  }[] = [
    {
      id: 'basics',
      label: 'Job Basics',
      ref: basicsRef,
      requiredFields: ['title', 'description'],
    },
    {
      id: 'details',
      label: 'Job Details',
      ref: detailsRef,
      requiredFields: [
        'desiredStartDate',
        'approxHoursPerWeek',
        'approxDaysPerWeek',
        'approxHourlySalaryEUR',
      ],
    },
    {
      id: 'skills',
      label: 'Skills',
      ref: skillsRef,
      requiredFields: ['matchingSkills'],
    },
    {
      id: 'expertise',
      label: 'Expertise Areas',
      ref: expertiseRef,
      requiredFields: ['matchingExpertiseAreas'],
    },
    {
      id: 'degrees',
      label: 'Education',
      ref: degreesRef,
      requiredFields: ['matchingDegrees'],
    },
    {
      id: 'workExperience',
      label: 'Work Experience',
      ref: workExperienceRef,
      requiredFields: ['matchingPositions'],
    },
    {
      id: 'languages',
      label: 'Languages',
      ref: languagesRef,
      requiredFields: ['matchingLanguageProficiencies'],
    },
  ];

  // generate steps for progress bar
  const steps = sections.map((section) => {
    const isComplete = section.requiredFields.every((field) => {
      const value = watch(field);

      if (errors[field]) return false;

      if (Array.isArray(value) && value.length === 0) return false;

      return value !== undefined && value !== null && value !== '';
    });
    return { id: section.id, label: section.label, completed: isComplete };
  });

  function setDummyData() {
    if (!user) return;
    const dummyData: JobPostingCreate = {
      startupId: user.id,
      title: 'Software Engineer',
      description: 'We are looking for a skilled software engineer to join our team.',
      requiredZip: '12345',
      requiredCity: 'Berlin',
      requiredCountry: 'Germany',
      approxDurationWeeks: 12,
      approxHoursPerWeek: 20,
      approxDaysPerWeek: 5,
      approxHourlySalaryEUR: 30,
      desiredStartDate: new Date(),
      matchingSkills: [...skills].slice(0, 3).map((skill) => skill.id),
      matchingExpertiseAreas: [...expertiseAreas].slice(0, 3).map((area) => area.id),
      matchingDegrees: [...degrees].slice(0, 3).map((degree) => degree.id),
      matchingPositions: [...positions].slice(0, 3).map((position) => position.id),
      matchingLanguageProficiencies: [...languages].slice(0, 3).map((lang) => ({
        id: lang.id,
        languageId: lang.id,
        levelId: languageProficiencyLevels[0]?.id,
      })),
    };
    reset(dummyData);
  }

  const handleStepClick = (sectionId: string): void => {
    const target = sections.find((s) => s.id === sectionId);
    if (!target?.ref.current) return;

    const progressBar = document.querySelector<HTMLElement>('.progress-bar-container');

    const barOffset = progressBar ? progressBar.getBoundingClientRect().bottom : 0;

    const sectionY = target.ref.current.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: sectionY - barOffset - 16,
      behavior: 'smooth',
    });
  };

  const handleFormSubmit = async () => {
    const isValid = await trigger();

    if (!isValid) {
      toast.error('Validation Error', {
        description: 'Please fix the highlighted errors before submitting your form',
      });

      // scroll to first error on page that is red
      const firstErrorElement = document.querySelector('.text-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return;
    }

    await handleSubmit(onSubmit)();
  };

  const onSubmit = async (formData: JobPosting) => {
    try {
      if (!user) {
        throw new Error('User is not authenticated');
      }
      formData.startupId = user.id;

      if (isEditMode) {
        await defaultApi.jobPostingJobPostingIdPut({
          jobPostingId: id ?? '',
          jobPostingUpdate: formData as JobPostingUpdate,
        });
        toast.success('Job posting updated successfully!');
      } else {
        await defaultApi.jobPostingPost({
          jobPostingCreate: formData as JobPostingCreate,
        });
        toast.success('New job posting created successfully!');
      }

      void navigate('/startup/profile');
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} job posting:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Error ${isEditMode ? 'updating' : 'creating'} job posting: ${errorMessage}`);
    }
  };

  if (loading) return <LoadingPage />;

  if (isEditMode && jobError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>Error loading job posting: {jobError.message}</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/startup/profile">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredUserType="Startup">
      <Helmet>
        <title>{isEditMode ? 'Edit' : 'Create'} Job Posting</title>
        {!isEditMode && (
          <meta name="description" content="Create a new job posting for your startup." />
        )}
      </Helmet>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Navigation, only show in edit mode */}
          {isEditMode && (
            <div className="mb-6">
              <Button variant="outline" onClick={() => void navigate('/startup/profile')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to your Profile
              </Button>
            </div>
          )}

          {/* Progress bar */}
          <StepProgressBar steps={steps} onStepClick={handleStepClick} />

          {/* title and description of the page */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2 flex justify-between items-center">
              <span>{isEditMode ? 'Edit' : 'Create New'} Job Posting</span>

              <Button
                variant="outline"
                onClick={() => {
                  setDummyData();
                }}
              >
                Set Dummy Data
              </Button>
            </h1>
            <p className="text-muted-foreground text-lg">
              {isEditMode
                ? 'Update the details of your job posting'
                : 'Fill out the details about the job position that you want to upload to your profile'}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleFormSubmit();
            }}
            className="space-y-8"
          >
            <div ref={basicsRef}>
              <JobBasicsSection control={control} />
            </div>

            <div ref={detailsRef}>
              <JobDetailsSection
                control={control}
                setLocationField={setValue}
                isEditMode={isEditMode}
                isOnsite={watch('requiredZip') ? true : false}
              />
            </div>

            <div ref={skillsRef}>
              <JobSkillsSection control={control} allSkills={skills} />
            </div>

            <div ref={expertiseRef}>
              <JobExpertiseSection control={control} allExpertise={expertiseAreas} />
            </div>

            <div ref={degreesRef}>
              <JobDegreesSection control={control} allDegrees={degrees} />
            </div>

            <div ref={workExperienceRef}>
              <JobWorkExperienceSection control={control} allPositions={positions} />
            </div>

            <div ref={languagesRef}>
              <JobLanguagesSection
                control={control}
                allLanguages={languages}
                languageProficiencyLevels={languageProficiencyLevels}
              />
            </div>

            <Card className="sticky bottom-4 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <CardContent className="p-6">
                <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {isEditMode ? 'Updating' : 'Creating'} Job Posting...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      {isEditMode ? 'Save Changes' : 'Create Job Posting'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default EditJobPage;
