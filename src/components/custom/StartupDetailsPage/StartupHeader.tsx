import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { Startup } from '@/api/openapi-client/models';

interface StartupHeaderProps {
  startup: Startup;
}

const StartupHeader: React.FC<StartupHeaderProps> = ({ startup }) => {
  return (
    <div>
      <CardHeader className="border-b pb-3 pt-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-primary">{startup.title}</CardTitle>
            <CardDescription className="text-gray-800 mt-1 text-base font-semibold">
              {startup.industry}
            </CardDescription>

            <div className="text-gray-800 mt-1 text-base">
              Contact Person: {startup.contactPersonNameFirst ?? ''}{' '}
              {startup.contactPersonNameLast ?? ''}
            </div>
          </div>

          <Avatar
            className="h-16 w-16 ml-4 border-2 border-tier-free"
            style={{ borderRadius: '8px' }}
          >
            {startup.logoUrl ? (
              <AvatarImage src={startup.logoUrl} alt={startup.title} />
            ) : (
              <AvatarFallback className="bg-tier-free text-primary text-2xl">
                {startup.title ? startup.title.charAt(0).toUpperCase() : 'S'}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </CardHeader>
    </div>
  );
};

export default StartupHeader;
