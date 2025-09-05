import React, { useState, useEffect } from 'react';
import Joyride, { type Step, type CallBackProps } from 'react-joyride';
import { useAuth } from '@/context/AuthContext';
import { useRetiree } from '@/hooks/useRetiree';
import { defaultApi } from '@/api/defaultapi';
import { useLocation } from 'react-router-dom';

const BrowseJobsTutorial: React.FC = () => {
  const { user } = useAuth();
  const { retiree, mutateRetiree } = useRetiree(user?.userType === 'Retiree' ? user.id : undefined);
  const [runTutorial, setRunTutorial] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname === '/retiree/browse-jobs' &&
      user?.userType === 'Retiree' &&
      retiree &&
      !retiree.hasCompletedTutorial
    ) {
      setRunTutorial(true);
    } else {
      setRunTutorial(false); // reset tutorial when navigating away to other page
    }
  }, [user, retiree, location.pathname]);

  const steps: Step[] = [
    {
      target: '#navbar-profile-pic',
      content: '1/6: Click here to view and edit your profile information.',
    },
    {
      target: '#navbar-notifications',
      content: '2/6: Click here to view your notifications and messages.',
    },
    {
      target: '#navbar-conversations',
      content: '3/6: Click here to view your future conversations with startups.',
    },
    {
      target: '#search-bar',
      content: '4/6: Use this search bar to find jobs by title.',
      disableScrolling: true,
    },
    {
      target: '#filter-section',
      content: '5/6: Here you can filter jobs by skills, languages, availability and more.',
      disableScrolling: true,
    },
    {
      target: '#job-list',
      content:
        '6/6: This is the list of jobs matching your criteria. Click on any job to view details and start a conversation with the startup.',
      disableScrolling: true,
    },
  ];

  const handleTutorialCallback = (data: CallBackProps) => {
    if (data.status === 'finished' || data.status === 'skipped') {
      setRunTutorial(false);

      if (user?.userType === 'Retiree' && retiree && !retiree.hasCompletedTutorial) {
        void (async () => {
          try {
            const updatedRetiree = await defaultApi.retireeRetireeIdPut({
              retireeId: retiree.id,
              retireeUpdate: {
                ...retiree,
                hasCompletedTutorial: true,
              },
            });
            void mutateRetiree(updatedRetiree, false);
          } catch (error) {
            console.error('Failed to update tutorial completion status:', error);
          }
        })();
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTutorial}
      continuous
      showSkipButton
      locale={{
        last: 'Done',
      }}
      styles={{
        options: {
          zIndex: 1000,
          arrowColor: 'white',
          backgroundColor: '#2f27ce',
          textColor: 'white',
          overlayColor: 'rgba(0, 0, 0, 0.7)',
          primaryColor: '#2f27ce',
          spotlightShadow: '0 0 20px rgba(0, 0, 0, 0.6)',
          width: '300px',
        },
        tooltip: {
          padding: '15px',
          fontSize: '16px',
          lineHeight: '1.5',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          color: '#333333',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        buttonNext: {
          color: 'white',
          backgroundColor: '#2f27ce',
          borderRadius: '5px',
          padding: '8px 15px',
          fontWeight: 'bold',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
        },
        buttonBack: {
          color: 'white',
          backgroundColor: '#2f27ce',
          borderRadius: '5px',
          padding: '8px 15px',
          fontWeight: 'bold',
          marginRight: 6,
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          position: 'relative',
        },
        buttonSkip: {
          color: 'white',
          backgroundColor: 'black',
          borderRadius: '5px',
          padding: '8px 15px',
          fontWeight: 'bold',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          position: 'relative',
          left: '-28px',
        },
      }}
      callback={handleTutorialCallback}
    />
  );
};

export default BrowseJobsTutorial;
