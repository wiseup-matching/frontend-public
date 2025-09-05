import React from 'react';

interface RetireeDescriptionProps {
  aboutMe?: string | null;
}

const RetireeDescription: React.FC<RetireeDescriptionProps> = ({ aboutMe }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">About Me</h3>
      <p className="whitespace-pre-line text-gray-800">
        {/* use || instead of ?? because ?? would show empty string as aboutMe text */}
        {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
        {aboutMe || <span className="text-gray-500">No description provided.</span>}
      </p>
    </div>
  );
};

export default RetireeDescription;
