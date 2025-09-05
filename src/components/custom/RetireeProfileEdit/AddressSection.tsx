import React from 'react';
import { Controller, type UseFormRegister, type Control } from 'react-hook-form';
import type { Retiree } from '@/api/openapi-client/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { validationRules } from '@/lib/validation';

interface AddressSectionProps {
  register: UseFormRegister<Retiree>;
  control: Control<Retiree>;
}

const AddressSection: React.FC<AddressSectionProps> = ({ control }) => {
  // Use centralized validation rules
  const retireeRules = validationRules.retiree;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Address Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Street Address */}
        <div className="space-y-2">
          <Label htmlFor="addressStreet">Street Address</Label>
          <Controller
            control={control}
            name="addressStreet"
            defaultValue=""
            rules={retireeRules.addressStreet}
            render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
              <>
                <Input
                  name={name}
                  value={value ?? ''}
                  onChange={onChange}
                  onBlur={onBlur}
                  id="addressStreet"
                  placeholder="Main Street 123"
                  className="w-full"
                />
                {error && <span className="text-red-500 text-xs">{error.message}</span>}
              </>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ZIP Code */}
          <div className="space-y-2">
            <Label htmlFor="addressZip">ZIP Code</Label>
            <Controller
              control={control}
              name="addressZip"
              defaultValue=""
              rules={retireeRules.addressZip}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={value ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    id="addressZip"
                    placeholder="12345"
                    className="w-full"
                  />
                  {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </>
              )}
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="addressCity">City</Label>
            <Controller
              control={control}
              name="addressCity"
              defaultValue=""
              rules={retireeRules.addressCity}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={value ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    id="addressCity"
                    placeholder="Your City"
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
              rules={retireeRules.addressCountry}
              render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                  <Input
                    name={name}
                    value={value ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    id="addressCountry"
                    placeholder="Your Country"
                    className="w-full"
                  />
                  {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressSection;
