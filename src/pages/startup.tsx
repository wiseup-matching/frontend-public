import StartupDescription from '@/components/custom/StartupDetailsPage/StartupDescription';
import StartupDetailsSection from '@/components/custom/StartupDetailsPage/StartupDetailsSection';
import StartupHeader from '@/components/custom/StartupDetailsPage/StartupHeader';
import StartupJobPostings from '@/components/custom/StartupDetailsPage/StartupJobPostings';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCategorizedJobPostings } from '@/hooks/useCategorizedJobPostings';
import { useStartup } from '@/hooks/useStartup';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingPage from './loading-page';

const StartupDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startup, loading, error } = useStartup(id);
  const { openJobPostings, loading: jobsLoading } = useCategorizedJobPostings(id);

  if (loading) return <LoadingPage />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 mb-6 rounded-r shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p>
            Error loading startup details:{' '}
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => void navigate(-1)}
          className="text-gray-800 hover:text-primary hover:border-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-6 mb-6 rounded-r shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Not Found</h3>
          <p>Startup not found</p>
        </div>
        <Button variant="outline" onClick={() => void navigate(-1)} className="text-gray-800">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Helmet>
        <title>Startup Details</title>
      </Helmet>
      {/* navigation button */}
      <div className="max-w-5xl mx-auto mb-4">
        <Button variant="outline" onClick={() => void navigate(-1)} className="text-gray-800">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      {/*startup Information */}
      <Card className="shadow-lg border-t-4 border-t-primary max-w-5xl mx-auto overflow-hidden">
        <StartupHeader startup={startup} />

        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Left: startup info */}
            <div className="md:col-span-3">
              <StartupDescription aboutUs={startup.aboutUs} />

              {/* left bottom: job posting */}
              {!jobsLoading && <StartupJobPostings jobPostings={openJobPostings} />}
            </div>

            {/* right: startup details */}
            <div className="md:col-span-2">
              <StartupDetailsSection startup={startup} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupDetails;
