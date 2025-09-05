import React from 'react';
import { Controller, type Control } from 'react-hook-form';
import type { JobPosting } from '@/api/openapi-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import { validationRules } from '@/lib/validation';

interface JobBasicsSectionProps {
  control: Control<JobPosting>;
}

const JobBasicsSection: React.FC<JobBasicsSectionProps> = ({ control }) => {
  // use centralized validation rules
  const jobPostingRules = validationRules.jobPosting;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Job Basics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title" className="mb-2 block">
            Job Title
          </Label>
          <Controller
            name="title"
            control={control}
            rules={jobPostingRules.title}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input
                  id="title"
                  placeholder="Enter your job title"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  aria-invalid={error ? 'true' : 'false'}
                />
                {error && (
                  <p className="mt-2 text-sm text-destructive">
                    {error.message ?? 'Job title is required'}
                  </p>
                )}
              </>
            )}
          />
        </div>
        <div>
          <Label htmlFor="description" className="mb-2 block">
            Job Description
          </Label>
          <Controller
            name="description"
            control={control}
            rules={jobPostingRules.description}
            render={({ field, fieldState: { error } }) => (
              <>
                <Textarea
                  id="description"
                  placeholder="Enter a description for your new job posting"
                  rows={4}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  aria-invalid={error ? 'true' : 'false'}
                />
                {error && <p className="mt-2 text-sm text-destructive">{error.message}</p>}
              </>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default JobBasicsSection;
