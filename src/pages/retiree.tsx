import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useCategorizedJobPostings } from '@/hooks/useCategorizedJobPostings';
import { useExpertiseAreas } from '@/hooks/useExpertiseAreas';
import { useLanguageProficiencyLevels } from '@/hooks/useLanguageProficiencyLevels';
import { useLanguages } from '@/hooks/useLanguages';
import { useRetiree } from '@/hooks/useRetiree';
import { useSkills } from '@/hooks/useSkills';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

import CreateConversationButton from '@/components/custom/CreateConversationButton';
import RetireeDescription from '@/components/custom/RetireeDetailsPage/RetireeDescription';
import RetireeDetailsSection from '@/components/custom/RetireeDetailsPage/RetireeDetailsSection';
import RetireeEducationSection from '@/components/custom/RetireeDetailsPage/RetireeEducationSection';
import RetireeExpertiseSection from '@/components/custom/RetireeDetailsPage/RetireeExpertiseSection';
import RetireeHeader from '@/components/custom/RetireeDetailsPage/RetireeHeader';
import RetireeLanguageSection from '@/components/custom/RetireeDetailsPage/RetireeLanguageSection';
import RetireeSkillsSection from '@/components/custom/RetireeDetailsPage/RetireeSkillsSection';
import RetireeWorkExperienceSection from '@/components/custom/RetireeDetailsPage/RetireeWorkExperienceSection';
import LoadingPage from './loading-page';

const RetireeDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { retiree, loading, error } = useRetiree(id);
  const { skills: allSkills } = useSkills();
  const { expertiseAreas: allExpertiseAreas } = useExpertiseAreas();
  const { languages: allLanguages } = useLanguages();
  const { languageProficiencyLevels: allLevels } = useLanguageProficiencyLevels();
  const { user } = useAuth();
  const { openJobPostings, loading: jobsLoading } = useCategorizedJobPostings(user?.id);
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  //helpr functions
  const getSkillName = (id: string) => allSkills.find((s) => s.id === id)?.name ?? id;
  const getExpertiseName = (id: string) => allExpertiseAreas.find((e) => e.id === id)?.name ?? id;
  const getLanguageName = (id: string) => allLanguages.find((l) => l.id === id)?.name ?? id;
  const getLevelName = (id: string) => allLevels.find((l) => l.id === id)?.code ?? id;

  if (loading) return <LoadingPage />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 mb-6 rounded-r shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p>
            Error loading retiree details:{' '}
            {error instanceof Error ? error.message : 'Unknown error'}
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

  if (!retiree) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-6 mb-6 rounded-r shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Not Found</h3>
          <p>Retiree not found</p>
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
        <title>Retiree Profile</title>
      </Helmet>
      {/* navigation button */}
      <div className="max-w-5xl mx-auto mb-4">
        <Button variant="outline" onClick={() => void navigate(-1)} className="text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      {/*retiree Information */}
      <Card className="shadow-lg border-t-4 border-t-primary max-w-5xl mx-auto overflow-hidden">
        <div className={retiree.isObscured ? 'relative' : ''}>
          {retiree.isObscured && <div className="blur-sm" />}
          <div className={retiree.isObscured ? 'opacity-50' : ''}>
            <RetireeHeader retiree={retiree} isObscured={retiree.isObscured} />
          </div>
        </div>

        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* left: retiree info */}
            <div className="md:col-span-3">
              <RetireeDescription aboutMe={retiree.aboutMe} />

              {/* skills section */}
              <RetireeSkillsSection skills={retiree.skills ?? []} getSkillName={getSkillName} />

              {/* expertise areas Section */}
              <RetireeExpertiseSection
                expertiseIds={retiree.expertiseAreas ?? []}
                getExpertiseName={getExpertiseName}
              />

              {/*languages section */}
              <RetireeLanguageSection
                languageProficiencies={retiree.languageProficiencies ?? []}
                getLanguageName={getLanguageName}
                getLevelName={getLevelName}
              />
            </div>

            {/* right: retiree details */}
            <div className="md:col-span-2">
              <RetireeDetailsSection retiree={retiree} />
            </div>
          </div>

          {/* bottom section with work experience on left side and education right */}
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <RetireeWorkExperienceSection
                  careerElements={retiree.careerElements ?? []}
                  isObscured={retiree.isObscured}
                />
              </div>
              <div>
                <RetireeEducationSection
                  careerElements={retiree.careerElements ?? []}
                  isObscured={retiree.isObscured}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* add CreateConversationButton for startups if they want to contact retiree*/}
      {user?.userType === 'Startup' && (
        <Card className="max-w-5xl mx-auto mt-8 p-6 text-center shadow-lg border-t-4 border-t-primary">
          <div>
            <h2 className="text-xl font-semibold text-primary mb-4">Contact this retiree</h2>
            <p className="text-gray-800 mb-6">
              Connect with this retiree by selecting one of your job postings. <b>Note: </b>
              Starting a conversation will use one of your connections.
            </p>

            <div className="mb-2">
              <label htmlFor="job-posting-select" className="text-gray-800 mb-6">
                Select a job posting for which you want to contact the retiree:
              </label>
              <div className="flex justify-center items-center mt-2">
                <Select onValueChange={setSelectedJobId} value={selectedJobId}>
                  <SelectTrigger id="job-posting-select" className="text-center">
                    <SelectValue placeholder="Select a job posting" />
                  </SelectTrigger>
                  <SelectContent>
                    {openJobPostings.length === 0 && jobsLoading && (
                      <SelectItem value="loading" disabled>
                        Loading job postings...
                      </SelectItem>
                    )}
                    {openJobPostings.length === 0 && !jobsLoading && (
                      <SelectItem value="none" disabled>
                        No open job postings found
                      </SelectItem>
                    )}
                    {openJobPostings.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {openJobPostings.length === 0 && !jobsLoading && (
                <p className="mt-2 text-sm text-red-500">
                  You need to create open job postings before you can contact retirees.
                </p>
              )}
            </div>

            {selectedJobId && (
              <CreateConversationButton
                startupId={user.id}
                retireeId={retiree.id}
                jobPostingId={selectedJobId}
              >
                Start Conversation
              </CreateConversationButton>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default RetireeDetails;
