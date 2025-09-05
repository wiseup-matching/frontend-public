import React from 'react';

import { useExpertiseAreas } from '@/hooks/useExpertiseAreas';
import { useLanguageProficiencyLevels } from '@/hooks/useLanguageProficiencyLevels';
import { useLanguages } from '@/hooks/useLanguages';
import { useRetiree } from '@/hooks/useRetiree';
import { useSkills } from '@/hooks/useSkills';

import ProtectedRoute from '@/components/custom/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import CareerOverviewSection from '@/components/custom/RetireeProfilePage/CareerOverviewSection';
import PersonalInfoSection from '@/components/custom/RetireeProfilePage/PersonalInfoSection';
import RetireeInfoSection from '@/components/custom/RetireeProfilePage/RetireeInfoSection';
import StatisticsSection from '@/components/custom/RetireeProfilePage/StatisticsSection';
import StatusSection from '@/components/custom/RetireeProfilePage/StatusSection';
import LoadingPage from '../loading-page';

const RetireeProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const retireeId = user?.userType === 'Retiree' ? user.id : '';

  const { retiree, loading, error } = useRetiree(retireeId);
  const { languages, loading: loadingLanguages } = useLanguages();
  const { languageProficiencyLevels, loading: loadingLevels } = useLanguageProficiencyLevels();
  const { skills: allSkills, loading: loadingSkills } = useSkills();
  const { expertiseAreas: allExpertiseAreas, loading: loadingExpertise } = useExpertiseAreas();

  // Helper functions to extract skills, language proficiency, expertise areas
  const getSkillsToDisplay = () => {
    if (!retiree?.skills || !Array.isArray(retiree.skills)) return [];

    return retiree.skills.map((skillId) => {
      if (typeof skillId === 'string') {
        const skill = allSkills.find((s) => s.id === skillId);
        return skill ?? { id: skillId, name: skillId };
      }
      return skillId;
    });
  };

  const getExpertiseAreasToDisplay = () => {
    if (!retiree?.expertiseAreas || !Array.isArray(retiree.expertiseAreas)) return [];

    return retiree.expertiseAreas.map((areaId) => {
      if (typeof areaId === 'string') {
        const area = allExpertiseAreas.find((a) => a.id === areaId);
        return area ?? { id: areaId, name: areaId };
      }
      return areaId;
    });
  };

  const getLanguageProficienciesToDisplay = () => {
    if (
      !retiree?.languageProficiencies ||
      !Array.isArray(retiree.languageProficiencies) ||
      retiree.languageProficiencies.length === 0
    ) {
      return [];
    }

    return retiree.languageProficiencies.map((proficiency) => {
      const languageId = languages.find((lang) => lang.id === proficiency.languageId);
      const levelId = languageProficiencyLevels.find((lvl) => lvl.id === proficiency.levelId);

      return {
        id: proficiency.id,
        languageId: languageId?.name ?? 'Unknown language',
        levelId: levelId?.code ?? 'Unknown level',
      };
    });
  };

  if (user?.userType === 'Retiree') {
    if (loading || loadingLanguages || loadingLevels || loadingSkills || loadingExpertise) {
      return <LoadingPage />;
    }
    if (error) {
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      return <div>Error while loading your profile: {errorMessage}</div>;
    }
    if (!retiree) return <div>No retiree with this ID data found.</div>;
  }

  if (user?.userType !== 'Retiree' || !retiree) {
    return (
      <ProtectedRoute requiredUserType="Retiree">
        <div></div>
      </ProtectedRoute>
    );
  }

  const skills = getSkillsToDisplay();
  const expertiseAreas = getExpertiseAreasToDisplay();
  const languageProficiencies = getLanguageProficienciesToDisplay();

  return (
    <ProtectedRoute requiredUserType="Retiree">
      <div className="min-h-screen flex items-start justify-center p-4 pt-16">
        <Helmet>
          <title>Retiree Profile</title>
          <meta name="description" content="View your retiree profile with the option to edit." />
        </Helmet>

        <div className="w-full max-w-6xl min-h-screen px-2 sm:px-6 lg:px-12 pb-20">
          {/* Profile Information and Edit Button in a Card */}
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-6 mb-4 mt-4">
            <h1 className="text-4xl font-bold text-primary">Profile Information</h1>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                void navigate('/retiree/profile/edit');
              }}
            >
              Edit Profile
            </Button>
          </div>

          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
            <div className="space-y-6">
              {/* Name & Profile Picture */}
              <PersonalInfoSection retiree={retiree} />

              {/* Status Box */}
              <StatusSection status={retiree.status} />

              {/* Statistics Box */}
              <StatisticsSection retiree={retiree} />
            </div>

            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info */}
              <RetireeInfoSection retiree={retiree} />

              {/* Career Overview */}
              <CareerOverviewSection
                careerElements={retiree.careerElements ?? []}
                skills={skills}
                expertiseAreas={expertiseAreas}
                languageProficiencies={languageProficiencies}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default RetireeProfile;
