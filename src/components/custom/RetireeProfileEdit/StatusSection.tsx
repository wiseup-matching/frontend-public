import React from 'react';
import { Controller, type Control } from 'react-hook-form';
import type { Retiree } from '@/api/openapi-client/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Briefcase, CirclePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusSectionProps {
  control: Control<Retiree>;
}

const StatusSection: React.FC<StatusSectionProps> = ({ control }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Availability Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full">
          <Controller
            control={control}
            name="status"
            defaultValue="available"
            render={({ field: { value, onChange, onBlur } }) => (
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button
                  type="button"
                  variant={value === 'available' ? 'default' : 'outline'}
                  onClick={() => onChange('available')}
                  onBlur={onBlur}
                  className={cn(
                    'cursor-pointer flex items-center justify-center gap-2 h-14 text-base font-medium transition-all duration-200',
                    value === 'available'
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground border-primary shadow-lg'
                      : 'bg-background text-muted-foreground hover:bg-secondary hover:text-primary border-border hover:border-primary',
                  )}
                >
                  <CirclePlus className="h-5 w-5" />
                  Available
                </Button>

                <Button
                  type="button"
                  variant={value === 'atcapacity' ? 'default' : 'outline'}
                  onClick={() => onChange('atcapacity')}
                  onBlur={onBlur}
                  className={cn(
                    'cursor-pointer flex items-center justify-center gap-2 h-14 text-base font-medium transition-all duration-200',
                    value === 'atcapacity'
                      ? 'bg-success hover:bg-success/90 text-success-foreground border-success shadow-lg'
                      : 'bg-background text-muted-foreground hover:bg-success/20 hover:text-success border-border hover:border-success',
                  )}
                >
                  <Briefcase className="h-5 w-5" />
                  At Capacity
                </Button>
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusSection;
