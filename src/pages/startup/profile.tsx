import ProtectedRoute from '@/components/custom/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useCategorizedJobPostings } from '@/hooks/useCategorizedJobPostings';
import { useStartup } from '@/hooks/useStartup';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import BusinessInfoSection from '@/components/custom/StartupProfilePage/BusinessInfoSection';
import ConnectionsSection from '@/components/custom/StartupProfilePage/ConnectionsSection';
import JobPostingsSection from '@/components/custom/StartupProfilePage/JobPostingsSection';
import StartupInfoSection from '@/components/custom/StartupProfilePage/StartupInfoSection';
import LoadingPage from '../loading-page';

const StartupProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const startupId = user?.userType === 'Startup' ? user.id : '';

  const { startup, loading: startupLoading, error: startupError } = useStartup(startupId);

  const {
    openJobPostings,
    hiredJobPostings,
    loading: jobPostingsLoading,
    error: jobPostingsError,
  } = useCategorizedJobPostings();

  if (user?.userType === 'Startup') {
    if (startupLoading || jobPostingsLoading) return <LoadingPage />;

    if (startupError || jobPostingsError)
      return <div>Error loading data: {String(startupError ?? jobPostingsError)}</div>;

    if (!startup) return <div>No startup with this ID data found.</div>;
  }

  if (user?.userType !== 'Startup' || !startup) {
    return (
      <ProtectedRoute requiredUserType="Startup">
        <div></div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredUserType="Startup">
      <div className="min-h-screen flex items-start justify-center p-4 pt-16">
        <Helmet>
          <title>Startup Business Profile</title>
          <meta
            name="description"
            content="View your startup startup profile with the option to edit."
          />
        </Helmet>

        <div className="w-full max-w-6xl min-h-screen px-2 sm:px-6 lg:px-12 pb-20">
          {/* Profile Information and Edit Button */}
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-6 mb-4 mt-4">
            <h1 className="text-4xl font-bold text-primary">Startup Profile Information</h1>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => void navigate('/startup/profile/edit')}
            >
              Edit Profile
            </Button>
          </div>

          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
            <div className="space-y-6">
              {/* Startup Info Card */}
              <StartupInfoSection startup={startup} />

              {/* Connections Card */}
              <ConnectionsSection
                connectionBalance={
                  (startup.monthlyConnectionBalance ?? 0) +
                  (startup.permanentConnectionBalance ?? 0)
                }
              />

              {/* Business Info Card */}
              <BusinessInfoSection startup={startup} />
            </div>

            {/* Open Job Postings */}
            <div className="space-y-6">
              <JobPostingsSection title="Open Job Postings" jobPostings={openJobPostings} />
            </div>

            {/* Hired Job Postings */}
            <div className="space-y-6">
              <JobPostingsSection title="Hired Job Postings" jobPostings={hiredJobPostings} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StartupProfile;
