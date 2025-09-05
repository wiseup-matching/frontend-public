import React, { useState, useEffect } from 'react';
import { type Control, Controller, type UseFormSetValue } from 'react-hook-form';
import type { JobPosting } from '@/api/openapi-client/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';
import { validationRules } from '@/lib/validation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface JobDetailsSectionProps {
  control: Control<JobPosting>;
  isOnsite: boolean;
  setLocationField?: UseFormSetValue<JobPosting>;
  isEditMode?: boolean;
}

const JobDetailsSection: React.FC<JobDetailsSectionProps> = ({
  control,
  isOnsite,
  setLocationField,
  isEditMode = false,
}) => {
  const [locationType, setLocationType] = useState<'onsite' | 'remote'>(
    isOnsite ? 'onsite' : 'remote',
  );

  // use centralized validation rules
  const jobPostingRules = validationRules.jobPosting;

  // update locationType when isOnsite prop changes (important for edit mode)
  useEffect(() => {
    setLocationType(isOnsite ? 'onsite' : 'remote');
  }, [isOnsite]);

  const customDesiredStartDateRules = {
    ...jobPostingRules.desiredStartDate,
    validate: (value: Date | null | undefined) => {
      // skip rule that date must be in present if in edit mode
      if (isEditMode) return true;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (value && new Date(value) < today) {
        return 'Start date cannot be in the past';
      }
      return true;
    },
  };

  useEffect(() => {
    if (locationType === 'remote' && setLocationField) {
      setLocationField('requiredZip', null, { shouldValidate: true });
      setLocationField('requiredCity', null, { shouldValidate: true });
      setLocationField('requiredCountry', null, { shouldValidate: true });
    }
  }, [locationType, setLocationField]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Job Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div className="space-y-2">
            <Label className="text-sm">Job Location</Label>
            <RadioGroup
              className="flex space-x-4"
              value={locationType}
              onValueChange={(value: string) => setLocationType(value as 'remote' | 'onsite')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="remote" id="remote" />
                <Label htmlFor="remote">Remote</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="onsite" id="onsite" />
                <Label htmlFor="onsite">On-site</Label>
              </div>
            </RadioGroup>
          </div>

          {locationType === 'onsite' && (
            <div className="space-y-2">
              <Label htmlFor="requiredZip">
                Zip Code<span className="text-500">*</span>
              </Label>
              <Controller
                control={control}
                name="requiredZip"
                rules={{
                  required: 'Zip Code is required for on-site jobs',
                  ...jobPostingRules.requiredZip,
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      id="requiredZip"
                      placeholder="e.g., 80331"
                      className={error ? 'border-red-500' : ''}
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                    {error && (
                      <p className="text-sm text-red-500 mt-1">{error.message?.toString()}</p>
                    )}
                  </>
                )}
              />
            </div>
          )}

          {locationType === 'onsite' && (
            <div className="space-y-2">
              <Label htmlFor="requiredCity">
                City<span className="text-500">*</span>
              </Label>
              <Controller
                control={control}
                name="requiredCity"
                rules={{
                  required: 'City is required for on-site jobs',
                  ...jobPostingRules.requiredCity,
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      id="requiredCity"
                      placeholder="e.g., Munich"
                      className={error ? 'border-red-500' : ''}
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                    {error && (
                      <p className="text-sm text-red-500 mt-1">{error.message?.toString()}</p>
                    )}
                  </>
                )}
              />
            </div>
          )}

          {locationType === 'onsite' && (
            <div className="space-y-2">
              <Label htmlFor="requiredCountry">
                Country<span className="text-500">*</span>
              </Label>
              <Controller
                control={control}
                name="requiredCountry"
                rules={{
                  required: 'Country is required for on-site jobs',
                  ...jobPostingRules.requiredCountry,
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      id="requiredCountry"
                      placeholder="e.g., Germany"
                      className={error ? 'border-red-500' : ''}
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                    {error && (
                      <p className="text-sm text-red-500 mt-1">{error.message?.toString()}</p>
                    )}
                  </>
                )}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 mt-2">
            <Label htmlFor="desiredStartDate">Desired Start Date</Label>
            <Controller
              control={control}
              name="desiredStartDate"
              rules={customDesiredStartDateRules}
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    id="desiredStartDate"
                    type="date"
                    value={value ? new Date(value).toISOString().split('T')[0] : ''}
                    onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
                    onBlur={onBlur}
                    aria-invalid={error ? 'true' : 'false'}
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">
                      {error.message ?? 'Start date is required'}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2 mt-2">
            <Label htmlFor="approxDurationWeeks">Duration (Weeks)</Label>
            <Controller
              control={control}
              name="approxDurationWeeks"
              rules={jobPostingRules.approxDurationWeeks}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    id="approxDurationWeeks"
                    type="number"
                    placeholder="e.g., 12"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        field.onChange(null);
                      } else {
                        const numValue = parseInt(value, 10);
                        field.onChange(isNaN(numValue) ? null : numValue);
                      }
                    }}
                    onBlur={field.onBlur}
                    onWheel={(e) => (e.target as HTMLElement).blur()}
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">
                      {error.message ?? 'Please enter a valid duration for the approx weeks'}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 mt-2">
            <Label htmlFor="approxHourlySalaryEUR">Hourly Salary (EUR)</Label>
            <Controller
              control={control}
              name="approxHourlySalaryEUR"
              rules={jobPostingRules.approxHourlySalaryEUR}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    id="approxHourlySalaryEUR"
                    type="number"
                    placeholder="e.g., 15"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        field.onChange(null);
                      } else {
                        const numValue = parseFloat(value);
                        field.onChange(isNaN(numValue) ? null : numValue);
                      }
                    }}
                    onBlur={field.onBlur}
                    onWheel={(e) => (e.target as HTMLElement).blur()}
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">
                      {error.message ?? 'Please enter a valid hourly salary in EUR'}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2 mt-2">
            <Label htmlFor="approxHoursPerWeek">Hours per Week</Label>
            <Controller
              control={control}
              name="approxHoursPerWeek"
              rules={jobPostingRules.approxHoursPerWeek}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    id="approxHoursPerWeek"
                    type="number"
                    placeholder="e.g., 20"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        field.onChange(null);
                      } else {
                        const numValue = parseInt(value, 10);
                        field.onChange(isNaN(numValue) ? null : numValue);
                      }
                    }}
                    onBlur={field.onBlur}
                    onWheel={(e) => (e.target as HTMLElement).blur()}
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">
                      {error.message ?? 'Please enter valid hours per week'}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2 mt-2">
            <Label htmlFor="approxDaysPerWeek">Days per Week</Label>
            <Controller
              control={control}
              name="approxDaysPerWeek"
              rules={jobPostingRules.approxDaysPerWeek}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    id="approxDaysPerWeek"
                    type="number"
                    placeholder="e.g., 3"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        field.onChange(null);
                      } else {
                        const numValue = parseInt(value, 10);
                        field.onChange(isNaN(numValue) ? null : numValue);
                      }
                    }}
                    onBlur={field.onBlur}
                    onWheel={(e) => (e.target as HTMLElement).blur()}
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">
                      {error.message ?? 'Please enter valid days per week, at max 5'}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDetailsSection;
