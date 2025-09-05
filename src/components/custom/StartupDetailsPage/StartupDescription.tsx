import React from 'react';

interface StartupDescriptionProps {
  aboutUs?: string | null;
}

const StartupDescription: React.FC<StartupDescriptionProps> = ({ aboutUs }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">About the Startup</h3>
      <p className="whitespace-pre-line text-gray-800">
        {aboutUs ?? 'No startup description available.'}
      </p>
    </div>
  );
};

export default StartupDescription;
