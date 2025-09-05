// React and related imports
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Form handling libraries
import { useForm, useFieldArray } from 'react-hook-form';

// Type definitions
import type { Retiree } from '@/api/openapi-client/models';

// API and data services
import { defaultApi } from '@/api/defaultapi';
import type { UploadImageRequest } from '@/api/openapi-client';

// Context providers
import { useAuth } from '@/context/AuthContext';

// Custom hooks for data fetching
import { useRetiree } from '@/hooks/useRetiree';
import { useLanguages } from '@/hooks/useLanguages';
import { useLanguageProficiencyLevels } from '@/hooks/useLanguageProficiencyLevels';
import { useSkills } from '@/hooks/useSkills';
import { useExpertiseAreas } from '@/hooks/useExpertiseAreas';
import { usePositions } from '@/hooks/usePositions';
import { useDegrees } from '@/hooks/useDegrees';

// Form section components
import PersonalInfoSection from '@/components/custom/RetireeProfileEdit/PersonalInfoSection';
import AddressSection from '@/components/custom/RetireeProfileEdit/AddressSection';
import SkillsSection from '@/components/custom/RetireeProfileEdit/SkillsSection';
import ExpertiseSection from '@/components/custom/RetireeProfileEdit/ExpertiseSection';
import EducationCareerSection from '@/components/custom/RetireeProfileEdit/EducationCareerSection';
import JobCareerSection from '@/components/custom/RetireeProfileEdit/JobCareerSection';
import LanguageSection from '@/components/custom/RetireeProfileEdit/LanguageSection';
import StatusSection from '@/components/custom/RetireeProfileEdit/StatusSection';

// UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

import StepProgressBar from '@/components/custom/StepProgressBar';

type SectionField = keyof Pick<
  Retiree,
  | 'status'
  | 'nameFirst'
  | 'nameLast'
  | 'email'
  | 'addressStreet'
  | 'addressZip'
  | 'addressCity'
  | 'addressCountry'
  | 'languageProficiencies'
  | 'skills'
  | 'expertiseAreas'
  | 'careerElements'
>;

const RetireeProfileEdit: React.FC = () => {
  const { user } = useAuth();
  const retireeId = user?.id ?? '';
  const navigate = useNavigate();

  const [isNewRetiree, setisNewRetiree] = useState(false);
  const { retiree, loading: loadingRetiree, refreshRetiree, mutateRetiree } = useRetiree(retireeId);
  const { skills: allSkills, loading: loadingSkills } = useSkills();
  const { expertiseAreas: allExpertise, loading: loadingExpertise } = useExpertiseAreas();
  const { languages: allLanguages, loading: loadingLanguages } = useLanguages();
  const { languageProficiencyLevels, loading: loadinglanguageProficiencyLevels } =
    useLanguageProficiencyLevels();
  const { degrees, loading: loadingDegrees } = useDegrees();
  const { positions, loading: loadingPositions } = usePositions();
  const loading =
    loadingRetiree ||
    loadingSkills ||
    loadingExpertise ||
    loadingLanguages ||
    loadingDegrees ||
    loadingPositions ||
    loadinglanguageProficiencyLevels;

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    trigger,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<Retiree>({
    defaultValues: {
      skills: [],
      expertiseAreas: [],
      careerElements: [],
    },
    mode: 'onChange',
  });

  const statusRef = useRef<HTMLDivElement>(null);
  const personalInfoRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const expertiseRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const workRef = useRef<HTMLDivElement>(null);

  const sections: {
    id: string;
    label: string;
    ref: React.RefObject<HTMLDivElement>;
    requiredFields: SectionField[];
    requiredCareerKind?: 'education' | 'job';
  }[] = [
    ...(!isNewRetiree
      ? [
          {
            id: 'status',
            label: 'Status',
            ref: statusRef,
            requiredFields: ['status'] as SectionField[],
          },
        ]
      : []),
    {
      id: 'personalInfo',
      label: 'Personal',
      ref: personalInfoRef,
      requiredFields: ['nameFirst', 'nameLast', 'email'],
    },
    {
      id: 'address',
      label: 'Address',
      ref: addressRef,
      requiredFields: ['addressStreet', 'addressZip', 'addressCity', 'addressCountry'],
    },
    {
      id: 'language',
      label: 'Language',
      ref: languageRef,
      requiredFields: ['languageProficiencies'],
    },
    {
      id: 'skills',
      label: 'Skills',
      ref: skillsRef,
      requiredFields: ['skills'],
    },
    {
      id: 'expertise',
      label: 'Expertise',
      ref: expertiseRef,
      requiredFields: ['expertiseAreas'],
    },

    {
      id: 'education',
      label: 'Education',
      ref: educationRef,
      requiredFields: [],
      requiredCareerKind: 'education',
    },
    {
      id: 'work',
      label: 'Work Experience',
      ref: workRef,
      requiredFields: [],
      requiredCareerKind: 'job',
    },
  ];

  const careerElements = watch('careerElements') ?? [];

  const steps = sections.map((section) => {
    let isComplete: boolean;
    if (section.requiredCareerKind) {
      isComplete = careerElements.some((el) => el.kind === section.requiredCareerKind);
    } else {
      isComplete = section.requiredFields.every((name) => {
        const value = watch(name);
        if (errors[name]) return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (!value) return false;
        return true;
      });
    }
    return { id: section.id, label: section.label, completed: isComplete };
  });

  function setDummyData() {
    if (!retiree) return;
    const dummyData: Retiree = {
      id: retireeId,
      nameFirst: 'John',
      nameLast: 'Doe',
      email: retiree.email,
      hasCompletedTutorial: false,
      status: 'available',
      aboutMe: 'Experienced retiree looking for new opportunities.',
      profilePicture: '',
      birthday: new Date('1950-01-01'),
      retiredSince: new Date('2020-01-01'),
      expectedHourlySalaryEUR: 20,
      desiredWorkHoursPerWeek: 20,
      addressStreet: '123 Main St',
      addressZip: '12345',
      addressCity: 'Berlin',
      addressCountry: 'Germany',
      skills: [...allSkills].splice(0, 3).map((skill) => skill.id),
      expertiseAreas: [...allExpertise].splice(0, 3).map((area) => area.id),
      languageProficiencies: [...allLanguages].splice(0, 3).map((lang) => ({
        id: lang.id,
        languageId: lang.id,
        levelId: languageProficiencyLevels[0].id,
      })),
      careerElements: [
        {
          id: 'NO_ID',
          title: 'B.Sc. Dummy Engineering',
          description: 'Dummy description for education',
          organizationName: 'Dummy University',
          finalGrade: '1.0',
          degree: degrees[0].id,
          kind: 'education',
          fromDate: new Date('1970-01-01'),
          untilDate: new Date('1974-01-01'),
        },
        {
          id: 'NO_ID',
          kind: 'job',
          title: 'Senior Dummy Engineer',
          description: 'Dummy description for job',
          organizationName: 'Dummy Company',
          fromDate: new Date('1975-01-01'),
          untilDate: new Date('2000-01-01'),
          position: positions[0].id,
        },
      ],
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
        description: 'Please fix the highlighted errors before submitting.',
      });

      const firstErrorElement = document.querySelector('.text-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return;
    }

    const retiredSince = watch('retiredSince');
    const careerElements = watch('careerElements') ?? [];

    if (retiredSince) {
      for (let i = 0; i < careerElements.length; i++) {
        const el = careerElements[i];
        if (el.kind === 'job') {
          const from = el.fromDate ? new Date(el.fromDate) : null;
          const until = el.untilDate ? new Date(el.untilDate) : null;
          const retired = new Date(retiredSince);
          let hasError = false;
          if (from && from > retired) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            setError(`careerElements.${i}.fromDate`, {
              type: 'manual',
              message: 'Job start date must be before retirement date',
            });
            hasError = true;
          }
          if (until && until > retired) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            setError(`careerElements.${i}.untilDate`, {
              type: 'manual',
              message: 'Job end date must be before retirement date',
            });
            hasError = true;
          }
          if (until && from && from >= until) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            setError(`careerElements.${i}.fromDate`, {
              type: 'manual',
              message: 'Job start date must be before end date',
            });
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            setError(`careerElements.${i}.untilDate`, {
              type: 'manual',
              message: 'Job end date must be after start date',
            });
            hasError = true;
          }
          if (hasError) {
            const firstErrorElement = document.querySelector('.text-red-500');
            if (firstErrorElement) {
              firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            toast.error('Validation Error', {
              description: 'Please fix the highlighted errors before submitting.',
            });
            return;
          }
        }
      }
    }
    const hasEducation = careerElements.some((el) => el.kind === 'education');
    const hasJob = careerElements.some((el) => el.kind === 'job');
    if (!hasEducation || !hasJob) {
      toast.error('Validation Error', {
        description:
          'You must have at least one education and one job entry in your career history.',
      });
      return;
    }

    await handleSubmit(onSubmit)();
  };

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'careerElements',
  });

  useEffect(() => {
    if (retiree) {
      let isNewRetiree = false;
      if (retiree.nameFirst === '' || retiree.nameLast === '') {
        isNewRetiree = true;
        retiree.nameFirst = '';
        retiree.nameLast = '';
        retiree.status = 'available';
      }
      setisNewRetiree(isNewRetiree);
      reset(retiree);
      replace(retiree.careerElements ?? []);
    }
  }, [retiree, reset, replace]);

  const onSubmit = async (formData: Retiree) => {
    try {
      const processedCareerElements =
        formData.careerElements?.map((element) => {
          const { ...safeElement } = element;

          if (safeElement.fromDate) {
            safeElement.fromDate = new Date(safeElement.fromDate);
          }

          if (safeElement.untilDate) {
            safeElement.untilDate = new Date(safeElement.untilDate);
          }

          return safeElement;
        }) ?? [];

      const profilePicture = formData.profilePicture as unknown;

      if (profilePicture instanceof File) {
        try {
          const uploadBody: UploadImageRequest = { image: profilePicture };
          const { url } = await defaultApi.uploadImage(uploadBody);

          if (!url) {
            throw new Error('No URL returned from upload');
          }

          formData.profilePicture = `${url}?v=${Date.now().toString()}`;
        } catch (err) {
          console.error('Retiree profile picture upload failed:', err);
          toast.error('Error', {
            description: 'Failed to upload the retiree profile picture. Please try again.',
          });
          return;
        }
      }

      const updateData = {
        nameFirst: formData.nameFirst,
        nameLast: formData.nameLast,
        email: formData.email,
        status: formData.status,
        aboutMe: formData.aboutMe,
        profilePicture: formData.profilePicture,
        birthday: formData.birthday ? new Date(formData.birthday) : null,
        retiredSince: formData.retiredSince ? new Date(formData.retiredSince) : null,
        expectedHourlySalaryEUR: formData.expectedHourlySalaryEUR,
        desiredWorkHoursPerWeek: formData.desiredWorkHoursPerWeek,
        addressStreet: formData.addressStreet,
        addressZip: formData.addressZip,
        addressCity: formData.addressCity,
        addressCountry: formData.addressCountry,
        skills: formData.skills ?? [],
        expertiseAreas: formData.expertiseAreas ?? [],
        languageProficiencies: formData.languageProficiencies ?? [],
        careerElements: processedCareerElements,
      };

      const updated = await defaultApi.retireeRetireeIdPut({
        retireeId: retireeId,
        retireeUpdate: { id: retireeId, ...updateData },
      });

      toast.success('Success!', {
        description: 'Profile updated successfully.',
      });

      reset(updated);
      await mutateRetiree(updated, false);
      await refreshRetiree();

      if (isNewRetiree) {
        await navigate(`/retiree/browse-jobs`);
      } else {
        await navigate(`/retiree/profile/`);
      }
    } catch (e: unknown) {
      console.error('API error details:', e);

      let message = 'Unknown error';
      if (e && typeof e === 'object' && 'message' in e) {
        message = String((e as { message: unknown }).message);
      }
      toast.error('Error', {
        description: `Update failed: ${message}`,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="flex items-center gap-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg">Loading profile data...</span>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Edit Profile</title>
        <meta name="description" content="Edit your retiree profile." />
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress bar with fixed transparency */}
        <StepProgressBar steps={steps} onStepClick={handleStepClick} startIndex={1} />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex flex-row justify-between items-center">
            <span>
              {isNewRetiree ? 'Complete Your Retiree Profile' : 'Edit Your Retiree Profile'}
            </span>
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
            {isNewRetiree ? 'Complete' : 'Update'} your professional information and career details
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit(onSubmit)();
          }}
          className="space-y-8"
        >
          {!isNewRetiree && (
            <div ref={statusRef} id="status">
              <StatusSection control={control} />
            </div>
          )}

          {/* Use div refs to anchor each section */}
          <div ref={personalInfoRef} id="personalInfo">
            <PersonalInfoSection control={control} />
          </div>

          <div ref={addressRef} id="address">
            <AddressSection register={register} control={control} />
          </div>

          <div ref={languageRef} id="language">
            <LanguageSection
              control={control}
              allLanguages={allLanguages}
              languageProficiencyLevels={languageProficiencyLevels}
            />
          </div>

          <div ref={skillsRef} id="skills">
            <SkillsSection control={control} allSkills={allSkills} />
          </div>

          <div ref={expertiseRef} id="expertise">
            <ExpertiseSection control={control} allExpertise={allExpertise} />
          </div>

          <div ref={educationRef} id="educationCareer">
            <EducationCareerSection
              control={control}
              register={register}
              fields={fields}
              append={append}
              remove={remove}
              careerElements={careerElements}
              degrees={degrees}
            />
          </div>
          <div ref={workRef} id="jobCareer">
            <JobCareerSection
              control={control}
              register={register}
              fields={fields}
              append={append}
              remove={remove}
              careerElements={careerElements}
              positions={positions}
            />
          </div>
          <Card className="sticky bottom-4 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <CardContent className="p-6">
              <Button
                type="button"
                onClick={() => void handleFormSubmit()}
                disabled={isSubmitting}
                className="w-full h-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Profile
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default RetireeProfileEdit;
