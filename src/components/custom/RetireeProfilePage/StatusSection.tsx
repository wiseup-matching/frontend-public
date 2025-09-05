import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CirclePlus, Briefcase } from 'lucide-react';

interface StatusSectionProps {
  status: string;
}

const StatusSection: React.FC<StatusSectionProps> = ({ status }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Availability Status</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="mb-2">
          {status === 'available' ? (
            <div className="flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
                <CirclePlus className="h-8 w-8 text-primary" />
              </div>
              <span className="capitalize text-lg font-medium text-primary mt-2">Available</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-success/20 flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-success" />
              </div>
              <span className="capitalize text-lg font-medium text-success mt-2">At Capacity</span>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground mt-4">
          <i>To edit your status, please go to "Edit Profile"</i>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusSection;
