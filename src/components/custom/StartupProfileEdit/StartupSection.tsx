import React from 'react';
import { Controller, type Control } from 'react-hook-form';
import type { FundingStatus, Startup } from '@/api/openapi-client/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Rocket } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SquareImageUploader from '@/components/custom/SquareImageProcesser';
import { validationRules } from '@/lib/validation';

// Normalizes potentially undefined string values for form inputs
const normalizeString = (value: string | null | undefined) => value ?? '';

// Use centralized validation rules
const startupRules = validationRules.startup;

interface StartupSectionProps {
  control: Control<Startup>;
  fundingStatuses: FundingStatus[];
}

const PersonalInfoSection: React.FC<StartupSectionProps> = ({ control, fundingStatuses }) => {
  // Validation rules
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5" />
          Startup Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Startup Name */}
          <div className="space-y-2">
            <Label htmlFor="title">Startup Name</Label>
            <Controller
              control={control}
              name="title"
              defaultValue=""
              rules={startupRules.title}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={normalizeString(value)}
                    onChange={onChange}
                    onBlur={onBlur}
                    id="title"
                    placeholder="Enter your startups name"
                    autoComplete="given-name"
                    className="w-full"
                  />
                  {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </>
              )}
            />
          </div>
          {/* Startup Name */}
          <div className="space-y-2">
            <Label htmlFor="industry">Startup Industry</Label>
            <Controller
              control={control}
              name="industry"
              defaultValue=""
              rules={startupRules.industry}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={normalizeString(value)}
                    onChange={onChange}
                    onBlur={onBlur}
                    id="industry"
                    placeholder="Enter your startups industry"
                    autoComplete=""
                    className="w-full"
                  />
                  {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </>
              )}
            />
          </div>
        </div>
        {/* About Us */}
        <div className="space-y-2">
          <Label htmlFor="aboutUs">About Us</Label>
          <Controller
            control={control}
            name="aboutUs"
            defaultValue=""
            rules={startupRules.aboutUs}
            render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
              <>
                <Textarea
                  name={name}
                  value={normalizeString(value)}
                  onChange={onChange}
                  onBlur={onBlur}
                  id="aboutUs"
                  placeholder="Tell us about your Startup..."
                  className="min-h-[100px] resize-none"
                />
                {error && <span className="text-red-500 text-xs">{error.message}</span>}
              </>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="addressCity">City</Label>
            <Controller
              control={control}
              name="addressCity"
              defaultValue=""
              rules={startupRules.addressCity}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={value ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    id="addressCity"
                    placeholder="City of your startup HQ"
                    className="w-full"
                  />
                  {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </>
              )}
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="addressCountry">Country</Label>
            <Controller
              control={control}
              name="addressCountry"
              defaultValue=""
              rules={startupRules.addressCountry}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={value ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    id="addressCountry"
                    placeholder="Country of your startup HQ"
                    className="w-full"
                  />
                  {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Funding Status */}
          <div className="space-y-2">
            <Label htmlFor="title">Funding Status</Label>
            <Controller
              control={control}
              name="fundingStatus"
              defaultValue=""
              rules={startupRules.fundingStatus}
              render={({ field: { onChange, value }, fieldState: { error } }) => {
                const selectedFundingStatus = fundingStatuses.find((d) => d.id === value);
                return (
                  <>
                    <Select onValueChange={onChange} value={value ?? ''}>
                      <SelectTrigger id={`fundingStatus`}>
                        <SelectValue placeholder="Select a funding status">
                          {selectedFundingStatus
                            ? selectedFundingStatus.title
                            : 'Select a degree type'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {fundingStatuses.map((fundingStatus) => (
                          <SelectItem key={fundingStatus.id} value={fundingStatus.id}>
                            {fundingStatus.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {error && <span className="text-red-500 text-xs">{error.message}</span>}
                  </>
                );
              }}
            />
          </div>
          {/* Number Employees */}
          <div className="space-y-2">
            <Label htmlFor="industry">Full Time Employee Number</Label>
            <Controller
              control={control}
              name="fulltimeEmployeesNum"
              defaultValue={undefined}
              rules={startupRules.fulltimeEmployeesNum}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={value ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    type="number"
                    id="fulltimeEmployeesNum"
                    placeholder="Enter the number of full time employees"
                    autoComplete=""
                    className="w-full"
                    onWheel={(e) => (e.target as HTMLElement).blur()}
                  />
                  {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Founding Year */}
          <div className="space-y-2">
            <Label htmlFor="title">Founding Year</Label>
            <Controller
              control={control}
              name="foundingYear"
              defaultValue={undefined}
              rules={startupRules.foundingYear}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={value ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    type="number"
                    id="foundingYear"
                    placeholder="Enter your funding year"
                    autoComplete=""
                    className="w-full"
                    onWheel={(e) => (e.target as HTMLElement).blur()}
                  />
                  {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </>
              )}
            />
          </div>
          {/* Number Employees */}
          <div className="space-y-2">
            <Label htmlFor="industry">Revenue per Year</Label>
            <Controller
              control={control}
              name="revenuePerYearEUR"
              defaultValue={undefined}
              rules={startupRules.revenuePerYearEUR}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={value ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    type="number"
                    id="revenuePerYearEUR"
                    placeholder="Enter your revenue per year in EUR"
                    autoComplete=""
                    className="w-full"
                    onWheel={(e) => (e.target as HTMLElement).blur()}
                  />
                  {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* imprint Url */}
          <div className="space-y-2">
            <Label htmlFor="imprintUrl">Imprint URL</Label>
            <Controller
              control={control}
              name="imprintUrl"
              defaultValue=""
              rules={startupRules.imprintUrl}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={normalizeString(value)}
                    onChange={onChange}
                    onBlur={onBlur}
                    id="imprintUrl"
                    placeholder="Enter your funding imprint URL"
                    autoComplete=""
                    className="w-full"
                  />
                  {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </>
              )}
            />
          </div>
          {/* Website URL */}
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Controller
              control={control}
              name="websiteUrl"
              defaultValue=""
              rules={startupRules.websiteUrl}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={normalizeString(value)}
                    onChange={onChange}
                    onBlur={onBlur}
                    id="websiteUrl"
                    placeholder="Enter your Website URL"
                    autoComplete=""
                    className="w-full"
                  />
                  {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </>
              )}
            />
          </div>
        </div>

        {/* logoUrl */}
        <div className="grid grid-cols-1 md:grid-cols-1">
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Startup Logo</Label>
            <Controller
              control={control}
              name="logoUrl"
              defaultValue={null}
              render={({ field: { value, onChange } }) => (
                <SquareImageUploader
                  label="Upload logo"
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
