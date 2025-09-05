import React from 'react';
import { Controller, type Control } from 'react-hook-form';
import type { Startup } from '@/api/openapi-client/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import SquareImageUploader from '@/components/custom/SquareImageProcesser';
import { validationRules } from '@/lib/validation';

// Normalizes potentially undefined string values for form inputs
const normalizeString = (value: string | null | undefined) => value ?? '';

// Use centralized validation rules
const contactPersonRules = validationRules.contactPerson;

interface contactPersonSectionProps {
  control: Control<Startup>;
}

const PersonalInfoSection: React.FC<contactPersonSectionProps> = ({ control }) => {
  // Validation rules
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Contact Person Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="contactPersonNameFirst">First Name</Label>
            <Controller
              control={control}
              name="contactPersonNameFirst"
              defaultValue=""
              rules={contactPersonRules.contactPersonNameFirst}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={normalizeString(value)}
                    onChange={onChange}
                    onBlur={onBlur}
                    id="contactPersonNameFirst"
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
            <Label htmlFor="contactPersonNameLast">Last Name</Label>
            <Controller
              control={control}
              name="contactPersonNameLast"
              defaultValue=""
              rules={contactPersonRules.contactPersonNameLast}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={normalizeString(value)}
                    onChange={onChange}
                    onBlur={onBlur}
                    id="contactPersonNameLast"
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

        {/* contactPersonPicture */}
        <div className="grid grid-cols-1 md:grid-cols-1">
          <div className="space-y-2">
            <Label htmlFor="contactPersonPicture">Contact Person Picture</Label>
            <Controller
              control={control}
              name="contactPersonPicture"
              defaultValue={null}
              render={({ field: { value, onChange } }) => (
                <SquareImageUploader
                  label="Upload Contact Person Picture"
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
