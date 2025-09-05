import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useJobPostingById } from '@/hooks/useJobPostingById';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useSkills } from '@/hooks/useSkills';
import { useExpertiseAreas } from '@/hooks/useExpertiseAreas';
import { useLanguages } from '@/hooks/useLanguages';
import { useLanguageProficiencyLevels } from '@/hooks/useLanguageProficiencyLevels';
import { useStartup } from '@/hooks/useStartup';
import { useDegrees } from '@/hooks/useDegrees';
import { usePositions } from '@/hooks/usePositions';
import CreateConversationButton from '@/components/custom/CreateConversationButton';
import { useAuth } from '@/context/AuthContext';

import JobHeader from '@/components/custom/JobPage/JobHeader';
import JobDescription from '@/components/custom/JobPage/JobDescription';
import ExpertiseSection from '@/components/custom/JobPage/ExpertiseSection';
import WorkExperienceSection from '@/components/custom/JobPage/WorkExperienceSection';
import DegreesSection from '@/components/custom/JobPage/DegreesSection';
import SkillsSection from '@/components/custom/JobPage/SkillsSection';
import LanguageSection from '@/components/custom/JobPage/LanguageSection';
import JobDetailsSection from '@/components/custom/JobPage/JobDetailsSection';

const Job: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { job, loading: jobLoading, error } = useJobPostingById(id);
  const { skills, loading: skillsLoading } = useSkills();
  const { expertiseAreas, loading: expertiseLoading } = useExpertiseAreas();
  const { languages, loading: languagesLoading } = useLanguages();
  const { languageProficiencyLevels, loading: levelsLoading } = useLanguageProficiencyLevels();
  const { startup, loading: startupLoading } = useStartup(job?.startupId);
  const { degrees, loading: degreesLoading } = useDegrees();
  const { positions, loading: positionsLoading } = usePositions();

  const isLoading =
    jobLoading ||
    skillsLoading ||
    expertiseLoading ||
    languagesLoading ||
    levelsLoading ||
    startupLoading ||
    degreesLoading ||
    positionsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-t-2 border-primary rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 mb-6 rounded-r shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p>
            Error loading job posting: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => void navigate(-1)}
          className="text-foreground hover:text-primary hover:border-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-6 mb-6 rounded-r shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Not Found</h3>
          <p>Job posting not found</p>
        </div>
        <Button variant="outline" onClick={() => void navigate(-1)} className="text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Helmet>
        <title>Job Details</title>
      </Helmet>
      {/* navigation button */}
      <div className="max-w-5xl mx-auto mb-4">
        <Button variant="outline" onClick={() => void navigate(-1)} className="text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      {/* job Information */}
      <Card className="shadow-lg border-t-4 border-t-primary max-w-5xl mx-auto overflow-hidden">
        <JobHeader title={job.title} startup={startup} subscriptionTier={job.subscriptionTier} />

        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* left: job info */}
            <div className="md:col-span-3">
              <JobDescription description={job.description} />

              {/* expertises */}
              <ExpertiseSection
                expertiseIds={job.matchingExpertiseAreas ?? []}
                expertiseAreas={expertiseAreas}
              />

              {/* skills */}
              <SkillsSection skillIds={job.matchingSkills ?? []} skills={skills} />

              {/* language  */}
              <LanguageSection
                languageProficiencies={job.matchingLanguageProficiencies ?? []}
                languages={languages}
                languageProficiencyLevels={languageProficiencyLevels}
              />
            </div>

            {/* right: job details */}
            <div className="md:col-span-2">
              <JobDetailsSection job={job} />
            </div>
          </div>

          {/* bottom section with work experience on left side and education right */}
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <WorkExperienceSection
                  positionIds={job.matchingPositions ?? []}
                  positions={positions}
                />
              </div>
              <div>
                <DegreesSection degreeIds={job.matchingDegrees ?? []} degrees={degrees} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* added CreateConversationButton for retirees if they want to contact startup based on a job posting */}
      {user?.userType === 'Retiree' && (
        <Card className="max-w-5xl mx-auto mt-8 p-6 text-center shadow-lg border-t-4 border-t-primary">
          <div>
            <h2 className="text-xl font-semibold text-primary mb-4">Interested in this job?</h2>
            <p className="text-gray-800 mb-6">
              Connect with <b>{startup?.title ?? 'the startup'}</b> to get more information about
              the job posting <b>{job.title}</b>.
            </p>
            <CreateConversationButton
              startupId={job.startupId}
              retireeId={user.id}
              jobPostingId={job.id}
            >
              Start Conversation
            </CreateConversationButton>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Job;
