import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { Retiree } from '@/api/openapi-client/models';

interface PersonalInfoSectionProps {
  retiree: Retiree;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ retiree }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-primary">
          {retiree.nameFirst} {retiree.nameLast}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Avatar className="w-40 h-40 mx-auto border-4 border-tier-free shadow">
          <AvatarImage
            src={retiree.profilePicture ?? ''}
            alt={`${retiree.nameFirst} ${retiree.nameLast}`}
          />
          <AvatarFallback className="bg-muted text-muted-foreground font-medium text-6xl">
            {retiree.nameFirst ? retiree.nameFirst.charAt(0).toUpperCase() : '?'}
          </AvatarFallback>
        </Avatar>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
