import React, { useEffect } from 'react';
import ProtectedRoute from '@/components/custom/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useCategorizedJobPostings } from '@/hooks/useCategorizedJobPostings';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import JobPostingsSection from '@/components/custom/matchingPage/JobPostingsSectionMatches';
import MatchesCarousel from '@/components/custom/matchingPage/MatchesCarousel';
import RetireeProfileCard from '@/components/custom/matchingPage/RetireeProfileCard';
import useTopMatches from '@/hooks/useTopMatches';
import CreateConversationButton from '@/components/custom/CreateConversationButton';
import { MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Matches: React.FC = () => {
  const { user, loading: userLoading } = useAuth();
  const startupId = user?.id ?? '';
  const { jobPostingId } = useParams<{ jobPostingId: string }>();
  const navigate = useNavigate();

  /* ---------- Job‑postings ---------- */
  const {
    openJobPostings,
    loading: jobPostingsLoading,
    error: jobPostingsError,
  } = useCategorizedJobPostings();
  const selectedJob = openJobPostings.find((job) => job.id === jobPostingId);

  /* ---------- Matches & carousel ---------- */
  const {
    topMatches,
    currentMatchIndex,
    currentMatch,
    currentRetiree,
    imageMap,
    retireeMap,
    matchesLoading,
    matchesError,
    nextMatch,
    prevMatch,
    selectMatch,
  } = useTopMatches(jobPostingId);

  /* ---------- Auto‑redirect to first posting ---------- */
  useEffect(() => {
    if (!jobPostingId && openJobPostings.length > 0) {
      navigate('/startup/matches/' + openJobPostings[0].id, { replace: true });
    }
  }, [jobPostingId, openJobPostings, navigate]);

  /* ---------- Loading / guard states ---------- */
  if (userLoading || jobPostingsLoading) {
    return <div className="min-h-screen" />; // skeletons could live here
  }

  if (!startupId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view your matches.</p>
      </div>
    );
  }

  if (jobPostingsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading job postings: {String(jobPostingsError)}</p>
      </div>
    );
  }

  /* ---------- Main render ---------- */
  return (
    <ProtectedRoute requiredUserType="Startup">
      <Helmet>
        <title>Matches</title>
      </Helmet>

      <div className="min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Left column : job postings --- */}
          <JobPostingsSection
            title="Open Job Postings"
            jobPostings={openJobPostings}
            clickablePostings
            selectedJobId={jobPostingId}
            headerIcon={<Briefcase className="h-5 w-5" />}
            onJobClick={(job) => {
              navigate('/startup/matches/' + job.id, { replace: true });
            }}
          />

          {/* --- Right column : matches & profile --- */}
          <div className="lg:col-span-2 ">
            {jobPostingId && selectedJob ? (
              <Card className="h-full bg-transparent shadow-none border-none">
                <CardContent className="p-8 flex flex-col h-full">
                  {/* Heading */}
                  <div className="text-center mb-8">
                    <Badge variant="secondary" className="mb-4 text-sm font-medium">
                      Your best Matches for
                    </Badge>
                    <h2 className="text-3xl font-bold mb-2">{selectedJob.title}</h2>
                    {topMatches.length > 0 && (
                      <p className="text-muted-foreground">
                        {topMatches.length} Shortlisted candidates based on your job posting
                      </p>
                    )}
                  </div>

                  {/* Carousel */}
                  <MatchesCarousel
                    matches={topMatches}
                    currentIndex={currentMatchIndex}
                    imageMap={imageMap}
                    retireeMap={retireeMap}
                    loading={matchesLoading}
                    error={matchesError}
                    onPrev={prevMatch}
                    onNext={nextMatch}
                    onSelect={selectMatch}
                    score={currentMatch?.score}
                  />

                  {/* Score display - more visually appealing */}
                  {currentMatch && typeof currentMatch.score === 'number' && (
                    <div className="flex flex-col items-center my-6">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-primary">
                          {Math.round(currentMatch.score * 100)}%
                        </p>
                        <p className="text-md text-muted-foreground mt-2">
                          compatibility score with this job posting
                        </p>
                      </div>
                    </div>
                  )}

                  {/* --- Centre header : contact + meta --- */}
                  {currentMatch && currentRetiree && (
                    <div className="flex flex-col items-center my-6 space-y-2">
                      <CreateConversationButton
                        startupId={startupId}
                        retireeId={currentRetiree.id}
                        jobPostingId={jobPostingId}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {currentRetiree.isObscured ? 'Start Conversation' : 'Go to Conversation'}
                      </CreateConversationButton>
                    </div>
                  )}

                  {/* Retiree profile */}
                  {currentMatch?.retiree && (
                    <RetireeProfileCard
                      retireeId={currentMatch.retiree}
                      startupId={startupId}
                      jobPostingId={jobPostingId}
                    />
                  )}

                  {/* No matches state */}
                  {topMatches.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No matches found for this job posting yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground mb-2">
                    Select a job posting to view matches
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Choose from your open job postings on the left
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Matches;
