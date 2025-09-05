// React and related imports
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Form handling libraries
import { useForm } from 'react-hook-form';

// Type definitions
import type { Startup } from '@/api/openapi-client/models';

// API and data services
import { defaultApi } from '@/api/defaultapi';
import type { UploadImageRequest } from '@/api/openapi-client';

// Context providers
import { useAuth } from '@/context/AuthContext';

// Custom hooks for data fetching
import { useStartup } from '@/hooks/useStartup';
import { useFundingStatuses } from '@/hooks/useFundingStatus';

// Form section components
import StartupSection from '@/components/custom/StartupProfileEdit/StartupSection';
import ContactPersonSection from '@/components/custom/StartupProfileEdit/ContactPersonSection';

// UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

import StepProgressBar from '@/components/custom/StepProgressBar';

// Define the fields that are required for each section
type SectionField = keyof Pick<
  Startup,
  | 'title'
  | 'aboutUs'
  | 'industry'
  | 'addressCity'
  | 'addressCountry'
  | 'fundingStatus'
  | 'fulltimeEmployeesNum'
  | 'foundingYear'
  | 'revenuePerYearEUR'
  | 'imprintUrl'
  | 'websiteUrl'
  | 'contactPersonNameFirst'
  | 'contactPersonNameLast'
>;

const StartupProfileEdit: React.FC = () => {
  const { user } = useAuth();
  const startupId = user?.id ?? '';
  const navigate = useNavigate();

  const [isNewStartup, setisNewStartup] = useState(false);
  const { startup, loading: loadingStartup, refreshStartup, mutateStartup } = useStartup(startupId);
  const { fundingStatuses, loading: loadingFundingStatuses } = useFundingStatuses();

  const loading = loadingStartup || loadingFundingStatuses;

  const {
    handleSubmit,
    reset,
    control,
    watch,
    trigger,
    formState: { isSubmitting, errors },
  } = useForm<Startup>({ mode: 'onChange' });

  const startupSection = useRef<HTMLDivElement>(null);
  const contactPersonSection = useRef<HTMLDivElement>(null);

  const sections: {
    id: string;
    label: string;
    ref: React.RefObject<HTMLDivElement>;
    requiredFields: SectionField[];
  }[] = [
    {
      id: 'startupInfo',
      label: 'Startup',
      ref: startupSection,
      requiredFields: [
        'title',
        'aboutUs',
        'industry',
        'addressCity',
        'addressCountry',
        'fundingStatus',
        'fulltimeEmployeesNum',
        'foundingYear',
        'revenuePerYearEUR',
        'imprintUrl',
        'websiteUrl',
      ] as SectionField[],
    },
    {
      id: 'contactPerson',
      label: 'Contact Person',
      ref: contactPersonSection,
      requiredFields: ['contactPersonNameFirst', 'contactPersonNameLast'],
    },
  ];

  const steps = sections.map((section) => {
    const isComplete = section.requiredFields.every((name) => {
      const value = watch(name);
      if (errors[name]) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (!value) return false;
      return true;
    });
    return { id: section.id, label: section.label, completed: isComplete };
  });

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

    await handleSubmit(onSubmit)();
  };

  useEffect(() => {
    if (startup) {
      let isNewStartup = false;
      if (startup.title === '') {
        isNewStartup = true;
        startup.title = '';
      }
      setisNewStartup(isNewStartup);
      reset(startup);
    }
  }, [startup, reset]);

  function setDummyData() {
    if (!startup) return;
    const dummyData: Startup = {
      id: startupId,
      email: startup.email,
      nameLast: 'Startup',
      nameFirst: 'Example',
      title: 'Example Startup',
      aboutUs:
        'Example Startup is a pioneering startup focused on developing AI-powered solutions for sustainability challenges. Our team combines expertise in machine learning and environmental science to create innovative products that help businesses reduce their carbon footprint while improving operational efficiency.',
      industry: 'CleanTech',
      addressCity: 'Berlin',
      addressCountry: 'Germany',
      fundingStatus: fundingStatuses[0].id,
      fulltimeEmployeesNum: 12,
      foundingYear: 2021,
      revenuePerYearEUR: 750000,
      imprintUrl: 'https://example.com/imprint',
      websiteUrl: 'example.com',
      contactPersonNameFirst: 'Emma',
      contactPersonNameLast: 'Schmidt',
    };
    reset(dummyData);
  }

  const onSubmit = async (formData: Startup) => {
    const contactPersonPicture = formData.contactPersonPicture as unknown;
    const logoUrl = formData.logoUrl as unknown;

    if (contactPersonPicture instanceof File) {
      try {
        const uploadBody: UploadImageRequest = { image: contactPersonPicture };
        const { url } = await defaultApi.uploadImage(uploadBody);

        if (!url) {
          throw new Error('No URL returned from upload');
        }

        formData.contactPersonPicture = `${url}?v=${Date.now().toString()}`;
      } catch (err) {
        console.error('Contact picture upload failed:', err);
        toast.error('Error', {
          description: 'Failed to upload the contact person picture. Please try again.',
        });
        return;
      }
    }

    if (logoUrl instanceof File) {
      try {
        const uploadBody: UploadImageRequest = { image: logoUrl };
        const { url } = await defaultApi.uploadImage(uploadBody);

        if (!url) {
          throw new Error('No URL returned from upload');
        }

        formData.logoUrl = url;
      } catch (err) {
        console.error('Logo upload failed:', err);
        toast.error('Error', {
          description: 'Failed to upload the logo. Please try again.',
        });
        return;
      }
    }

    try {
      const updated = await defaultApi.startupStartupIdPut({
        startupId: startupId,
        startupUpdate: {
          ...formData,
        },
      });

      toast.success('Success!', {
        description: 'Profile updated successfully.',
      });

      reset(updated);
      mutateStartup(updated, false);
      await refreshStartup();

      if (isNewStartup) {
        await navigate(`/startup/paywall`);
      } else {
        await navigate(`/startup/profile/`);
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
        <meta name="description" content="Edit your startup profile on Startup Finder." />
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <StepProgressBar steps={steps} onStepClick={handleStepClick} />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex flex-row justify-between">
            <span>{isNewStartup ? 'Complete' : 'Edit'} Your Startup Profile</span>
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
            {isNewStartup ? 'Complete' : 'Update'} your professional information and career details
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit(onSubmit)();
          }}
          className="space-y-8"
        >
          <div ref={startupSection} id="personalInfo">
            {' '}
            <StartupSection control={control} fundingStatuses={fundingStatuses} />
          </div>
          <div ref={contactPersonSection} id="personalInfo">
            {' '}
            <ContactPersonSection control={control} />{' '}
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

export default StartupProfileEdit;
