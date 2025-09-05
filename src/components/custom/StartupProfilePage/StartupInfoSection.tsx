import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Startup } from '@/api/openapi-client/models';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface StartupInfoSectionProps {
  startup: Startup;
}

const StartupInfoSection: React.FC<StartupInfoSectionProps> = ({ startup }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center text-primary">
          {startup.contactPersonNameFirst} {startup.contactPersonNameLast}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Avatar className="w-40 h-40 mx-auto border-4 border-tier-free shadow">
          <AvatarImage
            src={startup.contactPersonPicture ?? ''}
            alt={`${startup.contactPersonNameFirst ?? ''} ${startup.contactPersonNameLast ?? ''}`}
          />
          <AvatarFallback className="bg-muted text-muted-foreground font-medium text-6xl">
            {startup.contactPersonNameFirst
              ? startup.contactPersonNameFirst.charAt(0).toUpperCase()
              : '?'}
          </AvatarFallback>
        </Avatar>
        <div className="mt-4 text-2xl text-center text-primary">{startup.title}</div>
      </CardContent>
    </Card>
  );
};

export default StartupInfoSection;
