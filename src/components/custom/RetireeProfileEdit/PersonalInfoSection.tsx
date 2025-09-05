import React from 'react';
import { Controller, type Control } from 'react-hook-form';
import type { Retiree } from '@/api/openapi-client/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import SquareImageUploader from '@/components/custom/SquareImageProcesser';
import { validationRules } from '@/lib/validation';

const formatDate = (v: Date | string | null | undefined) =>
  v ? (v instanceof Date ? v : new Date(v)).toISOString().split('T')[0] : '';

interface PersonalInfoSectionProps {
  control: Control<Retiree>;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ control }) => {
  // Use centralized validation rules
  const retireeRules = validationRules.retiree;

  // Custom date validation: birthday must be before retiredSince and at least 20 years apart
  const birthdayRules = {
    validate: (birthday: Date | null | undefined, formValues?: Retiree) => {
      const retiredSince = formValues?.retiredSince;
      if (!birthday) return true;
      if (!(birthday instanceof Date) || isNaN(birthday.getTime())) return 'Invalid date';
      if (retiredSince && retiredSince instanceof Date && !isNaN(retiredSince.getTime())) {
        if (birthday > retiredSince) return 'Birthday cannot be after retirement date';
        const diffYears =
          (retiredSince.getTime() - birthday.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        if (diffYears < 20) return 'Retirement must be at least 20 years after birthday';
      }
      return true;
    },
  };
  const retiredSinceRules = {
    validate: (retiredSince: Date | null | undefined, formValues?: Retiree) => {
      const birthday = formValues?.birthday;
      if (!retiredSince) return true;
      if (!(retiredSince instanceof Date) || isNaN(retiredSince.getTime())) return 'Invalid date';
      if (birthday && birthday instanceof Date && !isNaN(birthday.getTime())) {
        if (birthday > retiredSince) return 'Retirement date cannot be before birthday';
        const diffYears =
          (retiredSince.getTime() - birthday.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        if (diffYears < 20) return 'Retirement must be at least 20 years after birthday';
      }
      return true;
    },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="nameFirst">First Name</Label>
            <Controller
              control={control}
              name="nameFirst"
              defaultValue=""
              rules={retireeRules.nameFirst}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    id="nameFirst"
                    placeholder="Enter your first name"
                    autoComplete="given-name"
                    className="w-full"
                  />
                  {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </>
              )}
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="nameLast">Last Name</Label>
            <Controller
              control={control}
              name="nameLast"
              defaultValue=""
              rules={retireeRules.nameLast}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    id="nameLast"
                    placeholder="Enter your last name"
                    autoComplete="family-name"
                    className="w-full"
                  />
                  {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </>
              )}
            />
          </div>
        </div>

        {/* About Me */}
        <div className="space-y-2">
          <Label htmlFor="aboutMe">About Me</Label>
          <Controller
            control={control}
            name="aboutMe"
            defaultValue=""
            rules={retireeRules.aboutMe}
            render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
              <>
                <Textarea
                  name={name}
                  value={value ?? ''}
                  onChange={onChange}
                  onBlur={onBlur}
                  id="aboutMe"
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px] resize-none"
                />
                {error && <span className="text-red-500 text-xs">{error.message}</span>}
              </>
            )}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="birthday" className="flex items-center gap-2">
              Birthday
            </Label>
            <Controller
              control={control}
              name="birthday"
              defaultValue={null}
              rules={birthdayRules}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={formatDate(value)}
                    onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
                    onBlur={onBlur}
                    id="birthday"
                    type="date"
                    className="w-full"
                  />
                  {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="retiredSince">Retired Since</Label>
            <Controller
              control={control}
              name="retiredSince"
              defaultValue={null}
              rules={retiredSinceRules}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={formatDate(value)}
                    onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
                    onBlur={onBlur}
                    id="retiredSince"
                    type="date"
                    className="w-full"
                  />
                  {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </>
              )}
            />
          </div>
        </div>

        {/* Salary & Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expectedHourlySalaryEUR" className="flex items-center gap-2">
              Expected Hourly Salary (€)
            </Label>
            <Controller
              control={control}
              name="expectedHourlySalaryEUR"
              defaultValue={null}
              rules={retireeRules.approxHourlySalaryEUR}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={value ?? ''}
                    onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
                    onBlur={onBlur}
                    id="expectedHourlySalaryEUR"
                    type="number"
                    placeholder="25"
                    className="w-full"
                    onWheel={(e) => (e.target as HTMLElement).blur()}
                  />
                  {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desiredWorkHoursPerWeek" className="flex items-center gap-2">
              Desired Hours/Week
            </Label>
            <Controller
              control={control}
              name="desiredWorkHoursPerWeek"
              defaultValue={null}
              rules={retireeRules.approxHoursPerWeek}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={value ?? ''}
                    onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
                    onBlur={onBlur}
                    id="desiredWorkHoursPerWeek"
                    type="number"
                    placeholder="20"
                    className="w-full"
                    onWheel={(e) => (e.target as HTMLElement).blur()}
                  />
                  {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </>
              )}
            />
          </div>
        </div>

        {/* profilePicture */}
        <div className="grid grid-cols-1 md:grid-cols-1">
          <div className="space-y-2">
            <Label htmlFor="profilePicture">Profile Picture</Label>
            <Controller
              control={control}
              name="profilePicture"
              defaultValue={null}
              render={({ field: { value, onChange } }) => (
                <SquareImageUploader
                  label="Upload Profile Picture"
                  initialUrl={typeof value === 'string' ? value : null}
                  onCropped={(file) => onChange(file)}
                />
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
